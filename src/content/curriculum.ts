import greetingsJson from "./lessons/pcc-esol-l1m1-greetings.lesson.json";
import type { Lesson } from "./lesson";

// Static versioned content — validated against the lesson schema in the
// build pipeline (pnpm validate:content). The client trusts the schema and
// pays no runtime validation cost (ADR-0002).
//
// Synthetic fixtures (src/content/fixtures/) are test-only: they are never
// imported here, so they never ship in the production bundle.
const greetings = greetingsJson as unknown as Lesson;

export const curriculum: readonly Lesson[] = [greetings];

export function getLesson(id: string): Lesson | undefined {
  return curriculum.find((lesson) => lesson.id === id);
}
