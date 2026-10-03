import { describe, expect, it } from "vitest";
import {
  progressAfterAnswer,
  progressAfterComplete,
  progressAfterStart,
  type LessonProgress,
} from "./progress";

const NOW = "2026-10-03T00:00:00.000Z";
const LESSON = "greetings";

function completedProgress(overrides: Partial<LessonProgress> = {}): LessonProgress {
  return {
    lessonId: LESSON,
    status: "completed",
    selectedAnswer: "b",
    completedAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

describe("progress transitions", () => {
  it("starts a fresh lesson as in-progress", () => {
    expect(progressAfterStart(undefined, LESSON, NOW)).toEqual({
      lessonId: LESSON,
      status: "in-progress",
      selectedAnswer: undefined,
      updatedAt: NOW,
    });
  });

  it("never downgrades a completed lesson back to in-progress", () => {
    const existing = completedProgress();
    expect(progressAfterStart(existing, LESSON, NOW)).toBe(existing);
  });

  it("keeps status completed when answering a completed lesson again", () => {
    const next = progressAfterAnswer(completedProgress(), LESSON, "a", NOW);
    expect(next.status).toBe("completed");
    expect(next.selectedAnswer).toBe("a");
  });

  it("completing a lesson stamps completedAt once", () => {
    const started = progressAfterStart(undefined, LESSON, NOW);
    const done = progressAfterComplete(started, LESSON, NOW);
    expect(done.status).toBe("completed");
    expect(done.completedAt).toBe(NOW);
    // Re-completing preserves the original completedAt
    const later = "2026-10-04T00:00:00.000Z";
    expect(progressAfterComplete(done, LESSON, later).completedAt).toBe(NOW);
  });
});
