import { db } from "../../db/db";

export type LessonStatus = "not-started" | "in-progress" | "completed";

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  selectedAnswer?: string;
  completedAt?: string;
  updatedAt: string;
}

// --- Pure transitions (unit-tested without a database) ---

export function progressAfterStart(
  existing: LessonProgress | undefined,
  lessonId: string,
  now: string,
): LessonProgress {
  if (existing?.status === "completed") return existing;
  return {
    lessonId,
    status: "in-progress",
    selectedAnswer: existing?.selectedAnswer,
    updatedAt: now,
  };
}

export function progressAfterAnswer(
  existing: LessonProgress | undefined,
  lessonId: string,
  optionId: string,
  now: string,
): LessonProgress {
  return {
    lessonId,
    status: existing?.status === "completed" ? "completed" : "in-progress",
    selectedAnswer: optionId,
    completedAt: existing?.completedAt,
    updatedAt: now,
  };
}

export function progressAfterComplete(
  existing: LessonProgress | undefined,
  lessonId: string,
  now: string,
): LessonProgress {
  return {
    lessonId,
    status: "completed",
    selectedAnswer: existing?.selectedAnswer,
    completedAt: existing?.completedAt ?? now,
    updatedAt: now,
  };
}

// --- Persistence (Dexie). UI applies optimistic state first, then calls these. ---

export function getLessonProgress(lessonId: string) {
  return db.lessonProgress.get(lessonId);
}

export async function markLessonStarted(lessonId: string): Promise<LessonProgress> {
  return db.transaction("rw", db.lessonProgress, async () => {
    const next = progressAfterStart(
      await db.lessonProgress.get(lessonId),
      lessonId,
      new Date().toISOString(),
    );
    await db.lessonProgress.put(next);
    return next;
  });
}

export async function saveAnswer(lessonId: string, optionId: string): Promise<LessonProgress> {
  return db.transaction("rw", db.lessonProgress, async () => {
    const next = progressAfterAnswer(
      await db.lessonProgress.get(lessonId),
      lessonId,
      optionId,
      new Date().toISOString(),
    );
    await db.lessonProgress.put(next);
    return next;
  });
}

export async function completeLesson(lessonId: string): Promise<LessonProgress> {
  return db.transaction("rw", db.lessonProgress, async () => {
    const next = progressAfterComplete(
      await db.lessonProgress.get(lessonId),
      lessonId,
      new Date().toISOString(),
    );
    await db.lessonProgress.put(next);
    return next;
  });
}

export function countCompletedLessons(): Promise<number> {
  return db.lessonProgress.where("status").equals("completed").count();
}

export function listCompletedProgress(): Promise<LessonProgress[]> {
  return db.lessonProgress.where("status").equals("completed").toArray();
}
