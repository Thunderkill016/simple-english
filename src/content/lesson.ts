// Content model — mirrors src/content/schema/lesson.schema.json.
// Fixture content is validated against the JSON Schema by the pipeline
// (pnpm validate:content / build); these types are the code-side contract.
// Keep the two in sync when the schema evolves.

export interface LessonSource {
  /** registry key — must match a src/content/sources/ record for
   *  non-synthetic content; item-level fields below override record defaults */
  id: string;
  title?: string;
  license?: string;
  url?: string;
  /** canonical URL of the source license deed */
  licenseUrl?: string;
  /** true when SE adapted this from an external source */
  adapted: boolean;
  /** material adaptations made from the source, for traceability */
  adaptationNotes?: string[];
  /** true when content is SE-authored fixture/test data, not real curriculum */
  synthetic?: boolean;
  /** attribution line satisfying the source license obligations */
  attribution?: string;
}

export type LessonLevel = "beginner" | "elementary" | "intermediate";

export interface HeadingBlock {
  type: "heading";
  text: string;
}

export interface TextBlock {
  type: "text";
  text: string;
}

export interface ExampleBlock {
  type: "example";
  text: string;
  translation?: string;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
}

export interface MultipleChoiceBlock {
  type: "multiple-choice";
  id: string;
  prompt: string;
  options: MultipleChoiceOption[];
  /** id of the correct option */
  answer: string;
}

export type LessonBlock = HeadingBlock | TextBlock | ExampleBlock | MultipleChoiceBlock;

export interface Lesson {
  schemaVersion: 1;
  id: string;
  title: string;
  level: LessonLevel;
  source: LessonSource;
  blocks: LessonBlock[];
}
