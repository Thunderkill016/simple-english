import greetingsFixtureJson from "./fixtures/greetings.lesson.json";
import greetingsJson from "./lessons/pcc-esol-l1m1-greetings.lesson.json";
import type { Lesson } from "./lesson";

// Static versioned content — validated against the lesson schema in the
// build pipeline (pnpm validate:content). The client trusts the schema and
// pays no runtime validation cost (ADR-0002).
const greetings = greetingsJson as unknown as Lesson;
const greetingsFixture = greetingsFixtureJson as unknown as Lesson;

export const lessons: readonly Lesson[] = [greetings, greetingsFixture];

/** Real curriculum only — synthetic fixtures stay reachable via ?lesson=<id>
 *  for tests and development but are never listed to learners. */
export const curriculum: readonly Lesson[] = lessons.filter(
  (l) => !l.source.synthetic,
);

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
