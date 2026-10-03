import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "../src/db/db";
import {
  completeLesson,
  countCompletedLessons,
  getLessonProgress,
  markLessonStarted,
  saveAnswer,
} from "../src/features/progress/progress";

const LESSON = "greetings";

describe("local persistence (IndexedDB via Dexie)", () => {
  beforeEach(async () => {
    await db.lessonProgress.clear();
  });

  it("round-trips answer + completion through the database", async () => {
    await markLessonStarted(LESSON);
    expect((await getLessonProgress(LESSON))?.status).toBe("in-progress");

    await saveAnswer(LESSON, "b");
    expect((await getLessonProgress(LESSON))?.selectedAnswer).toBe("b");

    await completeLesson(LESSON);
    const restored = await getLessonProgress(LESSON);
    expect(restored?.status).toBe("completed");
    expect(restored?.selectedAnswer).toBe("b");
    expect(restored?.completedAt).toBeTruthy();

    expect(await countCompletedLessons()).toBe(1);
  });

  it("simulates reload: a second read still sees completion", async () => {
    await completeLesson(LESSON);
    // A new "session" reads the same persisted record
    const restored = await getLessonProgress(LESSON);
    expect(restored?.status).toBe("completed");
  });
});
