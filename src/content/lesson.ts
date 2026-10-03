// Content model — mirrors src/content/schema/lesson.schema.json.
// Fixture content is validated against the JSON Schema by the pipeline
// (pnpm validate:content / build); these types are the code-side contract.
// Keep the two in sync when the schema evolves.
//
// v2: lessons are SE-authored multi-source syntheses. Single-source
// `source` was replaced by authoredBy + sourceRefs + block provenance.

/** How SE uses a source item — "reference" contributes no copied content. */
export type SourceUse = "reused" | "adapted" | "reference";

export interface SourceRef {
  /** local key blocks' provenance.sourceRef points to */
  id: string;
  /** registry key — must match a src/content/sources/ record */
  sourceId: string;
  itemTitle?: string;
  /** canonical URL of the specific source item used */
  itemUrl: string;
  /** what this source contributes, e.g. "primary-language-model" */
  role: string;
  use: SourceUse;
}

/** Origin of a block's English content. Translations are always SE-authored. */
export type ProvenanceKind = "reused" | "adapted" | "se-authored" | "reference";

export interface BlockProvenance {
  kind: ProvenanceKind;
  /** sourceRefs[].id — required for reused/adapted/reference, forbidden for se-authored */
  sourceRef?: string;
}

export type LessonLevel = "beginner" | "elementary" | "intermediate";

export interface HeadingBlock {
  type: "heading";
  text: string;
  provenance?: BlockProvenance;
}

export interface TextBlock {
  type: "text";
  text: string;
  provenance?: BlockProvenance;
}

export interface ExampleBlock {
  type: "example";
  text: string;
  /** secondary-language support — always SE-authored */
  translation?: string;
  provenance?: BlockProvenance;
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
  provenance?: BlockProvenance;
}

export interface AudioBlock {
  type: "audio";
  title: string;
  /** local static asset — SE hosts only rights-verified media */
  src: string;
  /** full transcript — keeps the lesson usable when audio fails */
  transcript: string;
  /** repo-relative path to retained rights/hash evidence JSON */
  evidence: string;
  provenance?: BlockProvenance;
}

export interface ExternalEmbedBlock {
  type: "external-embed";
  /** allowlisted provider — semantic checks map it to permitted hosts */
  provider: "youtube";
  title: string;
  /** https embed URL on the original host — never a copied/rehosted asset */
  src: string;
  /** original canonical URL (watch page / chapter page) */
  sourceUrl: string;
  /** why this external item contributes to the lesson */
  purpose: string;
  /** where the learner goes if the embed cannot load */
  fallbackUrl: string;
  provenance?: BlockProvenance;
}

export type LessonBlock =
  | HeadingBlock
  | TextBlock
  | ExampleBlock
  | MultipleChoiceBlock
  | AudioBlock
  | ExternalEmbedBlock;

export interface LessonCompletion {
  /** capability-completion sentence shown on the completion panel */
  statement: string;
  /** what the learner practiced */
  skills: string[];
}

export interface Lesson {
  schemaVersion: 2;
  id: string;
  title: string;
  level: LessonLevel;
  /** one-sentence learner-facing description shown on Today/Learn */
  summary: string;
  /** what the learner can do after completing the lesson */
  capability: string;
  /** 'Simple English' for canonical lessons, 'SE fixture' for synthetic content */
  authoredBy: string;
  sourceRefs: SourceRef[];
  completion?: LessonCompletion;
  blocks: LessonBlock[];
}
