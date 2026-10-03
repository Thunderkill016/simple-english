import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "../src/db/db";
import { activityIndex } from "../src/content/course";
import { listCards, recordOutcome } from "../src/features/review/fsrs";
import {
  enterActivity,
  loadActivity,
  nextActivityToDo,
  resolveItem,
  saveSelfReport,
} from "../src/features/state/store";

const t0 = new Date("2026-01-01T00:00:00Z");

beforeEach(async () => {
  await db.itemStates.clear();
  await db.activityStates.clear();
  await db.selfReports.clear();
  await db.reviewCards.clear();
});

// first two activities of the pilot: a-01 (read goals) and a-02 (vocab read)
const [first, second] = activityIndex;

describe("activity lifecycle", () => {
  it("enterActivity marks 'started' once and is idempotent", async () => {
    const a = await enterActivity(first!.activity.id);
    const b = await enterActivity(first!.activity.id);
    expect(a.status).toBe("started");
    expect(b.updatedAt).toBe(a.updatedAt);
  });

  it("resolving all items completes the activity", async () => {
    const id = first!.activity.id;
    await enterActivity(id);
    for (const item of first!.activity.items)
      await resolveItem(id, item.id, "done", 0);
    const { aState } = (await loadActivity(id))!;
    expect(aState!.status).toBe("completed");
  });
});

describe("resume — item cursor granularity (finer than USA Learns)", () => {
  it("resumes at the first unresolved item after a mid-activity exit", async () => {
    const ref = activityIndex.find((r) => r.activity.items.length > 2)!;
    const id = ref.activity.id;
    const ids = ref.activity.items.map((i) => i.id);
    await enterActivity(id);
    // resolve the first and third items — leave the second open
    await resolveItem(id, ids[0]!, "done", 0);
    await resolveItem(id, ids[2]!, "done", 0);
    const { cursor } = (await loadActivity(id))!;
    expect(cursor).toBe(1);
  });
});

describe("channel orthogonality", () => {
  it("completion does not imply correctness", async () => {
    const ref = activityIndex.find((r) =>
      r.activity.items.some((i) => i.type === "mc"),
    )!;
    const id = ref.activity.id;
    await enterActivity(id);
    for (const item of ref.activity.items) {
      if (item.type === "mc") await resolveItem(id, item.id, "revealed", item.attempts);
      else await resolveItem(id, item.id, "done", 0);
    }
    const { aState } = (await loadActivity(id))!;
    expect(aState!.status).toBe("completed");
    expect(aState!.correctCount).toBe(0);
  });

  it("self-report never touches item/activity/review channels", async () => {
    await saveSelfReport("some-item", "I can greet people.");
    expect(await db.itemStates.count()).toBe(0);
    expect(await db.activityStates.count()).toBe(0);
    expect(await db.reviewCards.count()).toBe(0);
  });

  it("non-answerable items never create review cards", async () => {
    const id = first!.activity.id;
    await enterActivity(id);
    for (const item of first!.activity.items)
      await resolveItem(id, item.id, "done", 0);
    const cards = await listCards();
    const ids = new Set(first!.activity.items.map((i) => i.id));
    expect(cards.filter((c) => ids.has(c.itemId))).toHaveLength(0);
  });

  it("answerable item resolution schedules a review card", async () => {
    const ref = activityIndex.find((r) =>
      r.activity.items.some((i) => i.type === "mc"),
    )!;
    const mc = ref.activity.items.find((i) => i.type === "mc")!;
    await resolveItem(ref.activity.id, mc.id, "correct", 1);
    const card = await db.reviewCards.get(mc.id);
    expect(card).toBeDefined();
  });
});

describe("nextActivityToDo — Today pointer", () => {
  it("returns the first incomplete activity in linear order", async () => {
    expect((await nextActivityToDo())!.activity.id).toBe(first!.activity.id);
    await enterActivity(first!.activity.id);
    for (const item of first!.activity.items)
      await resolveItem(first!.activity.id, item.id, "done", 0);
    expect((await nextActivityToDo())!.activity.id).toBe(second!.activity.id);
  });

  it("returns undefined when the course is finished", async () => {
    for (const ref of activityIndex) {
      await enterActivity(ref.activity.id);
      for (const item of ref.activity.items)
        await resolveItem(ref.activity.id, item.id, item.type === "mc" ? "correct" : "done", 1);
    }
    expect(await nextActivityToDo()).toBeUndefined();
  });
});

describe("fsrs persistence", () => {
  it("records a card with a due date in the future (deterministic clock)", async () => {
    await recordOutcome("item-x", "correct", 1, t0);
    const card = await db.reviewCards.get("item-x");
    expect(card).toBeDefined();
    expect(new Date(card!.due).getTime()).toBeGreaterThanOrEqual(t0.getTime());
  });
});
