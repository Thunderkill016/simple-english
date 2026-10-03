// Learner-state model v2 (ADR-0003). Four ORTHOGONAL channels:
//
//   1. completion   — activity tri-state (none/started/completed)
//   2. formative    — item outcomes + activity score (never mastery)
//   3. self-report  — Learning-Log values (never affects other channels)
//   4. review       — FSRS scheduling state (never curriculum/mastery)
//
// SESSION is not an entity — state persists at item cursor granularity.

/** outcome of one item; absence of a row = unresolved */
export type ItemOutcome =
  | "correct" // resolved by a correct answer (attempts recorded)
  | "revealed" // resolved by revealing the verified answer
  | "done" // non-scored item progressed past (read/media/write/note)
  | "practiced"; // record item completed (practice evidence only)

export interface ItemState {
  itemId: string;
  outcome: ItemOutcome;
  attempts: number;
  updatedAt: string;
}

export type ActivityStatus = "none" | "started" | "completed";

export interface ActivityState {
  activityId: string;
  status: ActivityStatus;
  /** index of the first unresolved item — the resume cursor */
  cursor: number;
  /** formative channel: resolved-correct / resolved-total (scored only) */
  correctCount: number;
  resolvedCount: number;
  completedAt?: string;
  updatedAt: string;
}

export interface SelfReport {
  id: string; // itemId (selfeval) or note id
  value: string; // option id, or free text for notes
  updatedAt: string;
}

// ---- pure selectors (unit-tested without a database) ----

export function initialActivityState(activityId: string, now: string): ActivityState {
  return {
    activityId,
    status: "started",
    cursor: 0,
    correctCount: 0,
    resolvedCount: 0,
    updatedAt: now,
  };
}

/**
 * Resume semantics: return to the FIRST UNRESOLVED item.
 * Resolved work is never repeated because the visit ended.
 */
export function firstUnresolvedIndex(
  itemIds: string[],
  states: Map<string, ItemState>,
): number {
  const i = itemIds.findIndex((id) => states.get(id) === undefined);
  return i === -1 ? itemIds.length : i;
}

/** formative score for a scored activity — null when nothing resolved */
export function activityScore(state: ActivityState, totalItems: number): number | null {
  if (state.resolvedCount === 0) return null;
  const denominator = Math.max(state.resolvedCount, Math.min(totalItems, state.resolvedCount));
  return Math.round((state.correctCount / denominator) * 100);
}

export function applyItemOutcome(
  state: ActivityState,
  outcome: ItemOutcome,
  cursor: number,
  now: string,
): ActivityState {
  const scored = outcome === "correct" || outcome === "revealed";
  return {
    ...state,
    cursor,
    correctCount: state.correctCount + (outcome === "correct" ? 1 : 0),
    resolvedCount: state.resolvedCount + (scored ? 1 : 0),
    updatedAt: now,
  };
}

export function completeActivity(
  state: ActivityState,
  now: string,
): ActivityState {
  return { ...state, status: "completed", completedAt: state.completedAt ?? now, updatedAt: now };
}
