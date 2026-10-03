import greetingsJson from "./fixtures/greetings.lesson.json";
import type { Lesson } from "./lesson";

// Static versioned content — validated against the lesson schema in the
// build pipeline (pnpm validate:content). The client trusts the schema and
// pays no runtime validation cost (ADR-0002).
const greetings = greetingsJson as unknown as Lesson;

export const lessons: readonly Lesson[] = [greetings];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
