import { describe, expect, it } from "vitest";
import {
  activityScore,
  applyItemOutcome,
  completeActivity,
  firstUnresolvedIndex,
  initialActivityState,
  type ItemState,
} from "./model";

const t = "2026-01-01T00:00:00.000Z";

function item(id: string, outcome: ItemState["outcome"]): ItemState {
  return { itemId: id, outcome, attempts: 1, updatedAt: t };
}

describe("firstUnresolvedIndex — item-cursor resume", () => {
  const ids = ["a", "b", "c", "d"];

  it("starts at 0 with no state", () => {
    expect(firstUnresolvedIndex(ids, new Map())).toBe(0);
  });

  it("returns the FIRST unresolved item, not the last visited", () => {
    const states = new Map([
      ["a", item("a", "correct")],
      ["c", item("c", "revealed")],
    ]);
    // 'b' unresolved → resume lands on b even though c is already done
    expect(firstUnresolvedIndex(ids, states)).toBe(1);
  });

  it("returns itemIds.length when everything is resolved", () => {
    const states = new Map(ids.map((id) => [id, item(id, "done")]));
    expect(firstUnresolvedIndex(ids, states)).toBe(4);
  });
});

describe("applyItemOutcome — formative channel only", () => {
  it("counts correct outcomes", () => {
    const s = applyItemOutcome(initialActivityState("act", t), "correct", 1, t);
    expect(s.correctCount).toBe(1);
    expect(s.resolvedCount).toBe(1);
  });

  it("revealed resolves but does not count correct", () => {
    const s = applyItemOutcome(initialActivityState("act", t), "revealed", 1, t);
    expect(s.correctCount).toBe(0);
    expect(s.resolvedCount).toBe(1);
  });

  it("done/practiced are non-scored — untouched by the formative channel", () => {
    let s = applyItemOutcome(initialActivityState("act", t), "done", 1, t);
    s = applyItemOutcome(s, "practiced", 2, t);
    expect(s.correctCount).toBe(0);
    expect(s.resolvedCount).toBe(0);
    expect(s.cursor).toBe(2);
  });
});

describe("activityScore", () => {
  it("is null before anything resolves", () => {
    expect(activityScore(initialActivityState("a", t), 5)).toBeNull();
  });

  it("is correct/resolved as a percent — never 'mastery'", () => {
    let s = initialActivityState("a", t);
    s = applyItemOutcome(s, "correct", 1, t);
    s = applyItemOutcome(s, "correct", 2, t);
    s = applyItemOutcome(s, "revealed", 3, t);
    s = applyItemOutcome(s, "revealed", 4, t);
    expect(activityScore(s, 4)).toBe(50);
  });
});

describe("completeActivity — completion is orthogonal to score", () => {
  it("completes with a zero score (completion is not outcome measurement)", () => {
    let s = applyItemOutcome(initialActivityState("a", t), "revealed", 1, t);
    s = completeActivity(s, t);
    expect(s.status).toBe("completed");
    expect(activityScore(s, 1)).toBe(0);
  });

  it("keeps the first completedAt on repeat completion", () => {
    let s = completeActivity(initialActivityState("a", "t1"), "t1");
    s = completeActivity(s, "t2");
    expect(s.completedAt).toBe("t1");
  });
});
