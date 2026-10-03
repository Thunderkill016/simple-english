import greetingsJson from "./fixtures/greetings.lesson.json";
import greetingsHowAreYouJson from "./library/greetings-how-are-you.lesson.json";
import type { Lesson } from "./lesson";

// Static versioned content — validated against the lesson schema in the
// build pipeline (pnpm validate:content). The client trusts the schema and
// pays no runtime validation cost (ADR-0002).
const greetingsHowAreYou = greetingsHowAreYouJson as unknown as Lesson;
const greetings = greetingsJson as unknown as Lesson;

export const lessons: readonly Lesson[] = [greetingsHowAreYou, greetings];

/** Real curriculum only — synthetic fixtures stay reachable via ?lesson=<id>
 *  for tests and development but are never listed to learners. */
export const curriculum: readonly Lesson[] = lessons.filter(
  (l) => !l.source.synthetic,
);

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
