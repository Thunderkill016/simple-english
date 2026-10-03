import Dexie, { type Table } from "dexie";
import type { LessonProgress } from "../features/progress/progress";

/**
 * Canonical local learner store (ADR-0002).
 * IndexedDB via Dexie — learner state lives here, never on the network path.
 * Lesson content is NOT stored here; it is static versioned content.
 */
export class SEDatabase extends Dexie {
  lessonProgress!: Table<LessonProgress, string>;

  constructor() {
    super("simple-english");
    this.version(1).stores({
      // lessonId primary key; status indexed for progress-page counts
      lessonProgress: "lessonId, status",
    });
  }
}

export const db = new SEDatabase();
