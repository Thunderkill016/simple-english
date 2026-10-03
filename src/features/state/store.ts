// Persistence + orchestration for the four state channels (ADR-0003).
// UI applies optimistic state first; these write to Dexie after — never on
// the network path (SPEC §9).

import { db } from "../../db/db";
import {
  activityIndex,
  getActivity,
  isAnswerable,
} from "../../content/course";
import { recordOutcome } from "../review/fsrs";
import {
  applyItemOutcome,
  completeActivity,
  firstUnresolvedIndex,
  initialActivityState,
  type ActivityState,
  type ItemOutcome,
  type ItemState,
  type SelfReport,
} from "./model";

const now = () => new Date().toISOString();

// ---- reads ----

export function getItemStates(itemIds: string[]): Promise<Map<string, ItemState>> {
  return db.itemStates
    .where("itemId")
    .anyOf(itemIds)
    .toArray()
    .then((rows) => new Map(rows.map((r) => [r.itemId, r])));
}

export function getActivityState(activityId: string) {
  return db.activityStates.get(activityId);
}

export function listActivityStates() {
  return db.activityStates.toArray();
}

export function listSelfReports() {
  return db.selfReports.toArray();
}

/** Today pointer: first activity not yet completed, in linear order. */
export async function nextActivityToDo() {
  const states = new Map(
    (await listActivityStates()).map((s) => [s.activityId, s]),
  );
  return (
    activityIndex.find((r) => states.get(r.activity.id)?.status !== "completed") ??
    undefined
  );
}

// ---- writes ----

export async function enterActivity(activityId: string): Promise<ActivityState> {
  return db.transaction("rw", db.activityStates, async () => {
    const existing = await db.activityStates.get(activityId);
    if (existing) return existing;
    const fresh = initialActivityState(activityId, now());
    await db.activityStates.put(fresh);
    return fresh;
  });
}

/**
 * Resolve an item outcome. Persists the item row, advances the activity
 * cursor to the first unresolved item, completes the activity when every
 * item resolved, and feeds the FSRS channel for answerable items.
 * Channels stay independent: self-report and completion never touch FSRS.
 */
export async function resolveItem(
  activityId: string,
  itemId: string,
  outcome: ItemOutcome,
  attempts: number,
): Promise<void> {
  await db.transaction("rw", [db.itemStates, db.activityStates, db.reviewCards], async () => {
    const t = now();
    await db.itemStates.put({ itemId, outcome, attempts, updatedAt: t });

    const ref = getActivity(activityId);
    if (!ref) return;
    let aState =
      (await db.activityStates.get(activityId)) ??
      initialActivityState(activityId, t);
    const states = await getItemStates(ref.activity.items.map((i) => i.id));
    states.set(itemId, { itemId, outcome, attempts, updatedAt: t });
    const cursor = firstUnresolvedIndex(
      ref.activity.items.map((i) => i.id),
      states,
    );
    aState = applyItemOutcome(aState, outcome, cursor, t);
    if (cursor >= ref.activity.items.length) aState = completeActivity(aState, t);
    await db.activityStates.put(aState);

    if (isAnswerable(ref.activity.items.find((i) => i.id === itemId)!)) {
      await recordOutcome(itemId, outcome, attempts, new Date(t));
    }
  });
}

export async function saveSelfReport(id: string, value: string): Promise<void> {
  await db.selfReports.put({ id, value, updatedAt: now() } satisfies SelfReport);
}

/** resume helper: load an activity's item states + cursor position */
export async function loadActivity(activityId: string) {
  const ref = getActivity(activityId);
  if (!ref) return undefined;
  const [aState, states] = await Promise.all([
    getActivityState(activityId),
    getItemStates(ref.activity.items.map((i) => i.id)),
  ]);
  const cursor = firstUnresolvedIndex(
    ref.activity.items.map((i) => i.id),
    states,
  );
  return { ref, aState, states, cursor };
}
