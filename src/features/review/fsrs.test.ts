import { describe, expect, it } from "vitest";
import { Rating } from "ts-fsrs";
import { isAnswerable } from "../../content/course";
import type { Item } from "../../content/model";
import {
  dueCards,
  ratingFromOutcome,
  ratingFromReviewAttempt,
  scheduleNext,
  type ReviewCardRow,
} from "./fsrs";

describe("rating mapping — outcome → FSRS grade", () => {
  it("first-try correct = Good", () => {
    expect(ratingFromOutcome("correct", 1)).toBe(Rating.Good);
  });
  it("correct after retries = Hard", () => {
    expect(ratingFromOutcome("correct", 3)).toBe(Rating.Hard);
  });
  it("revealed = Again (never seen it)", () => {
    expect(ratingFromOutcome("revealed", 2)).toBe(Rating.Again);
  });
  it("review re-attempt maps honestly", () => {
    expect(ratingFromReviewAttempt(true)).toBe(Rating.Good);
    expect(ratingFromReviewAttempt(false)).toBe(Rating.Again);
  });
});

describe("eligibility — only answerable items are reviewable", () => {
  const make = (type: Item["type"]) => ({ type }) as Item;
  it("mc/dictation/cloze are eligible", () => {
    for (const t of ["mc", "dictation", "cloze"] as const)
      expect(isAnswerable(make(t))).toBe(true);
  });
  it("everything else is excluded — read, media, record, write, note, selfeval", () => {
    for (const t of ["read", "media", "record", "write", "note", "selfeval"] as const)
      expect(isAnswerable(make(t))).toBe(false);
  });
});

describe("scheduleNext — deterministic clocks, scheduling only", () => {
  const t0 = new Date("2026-01-01T00:00:00Z");

  it("same history + same clock → same due (deterministic)", () => {
    const a = scheduleNext(undefined, Rating.Good, t0);
    const b = scheduleNext(undefined, Rating.Good, t0);
    expect(a.due.getTime()).toBe(b.due.getTime());
  });

  it("worse outcomes schedule sooner than better ones", () => {
    const again = scheduleNext(undefined, Rating.Again, t0);
    const good = scheduleNext(undefined, Rating.Good, t0);
    expect(again.due.getTime()).toBeLessThanOrEqual(good.due.getTime());
  });

  it("schedules forward — due is at/after now", () => {
    expect(scheduleNext(undefined, Rating.Good, t0).due.getTime()).toBeGreaterThanOrEqual(
      t0.getTime(),
    );
  });
});

describe("dueCards", () => {
  const row = (due: string): ReviewCardRow => ({
    itemId: "x",
    card: "{}",
    due,
    updatedAt: due,
  });
  it("selects only cards due at the clock", () => {
    const rows = [row("2026-01-01T00:00:00Z"), row("2026-02-01T00:00:00Z")];
    const due = dueCards(rows, new Date("2026-01-15T00:00:00Z"));
    expect(due).toHaveLength(1);
    expect(due[0]!.due).toBe("2026-01-01T00:00:00Z");
  });
});
