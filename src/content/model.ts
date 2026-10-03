// Content model v3 — source-driven learning model (ADR-0003).
//
// Canonical hierarchy: COURSE → UNIT → LESSON → SECTION → ACTIVITY → ITEM.
// SESSION is not an entity — a session is only a runtime visit.
//
// Human Content Gate: every learner-facing instructional English field is a
// `Field` carrying provenance. Fields whose text teaches English (prompts,
// options, transcripts, goals, definitions, can-do statements, models, stems)
// must resolve to a declared source-pack asset. Mechanical UI chrome
// (button labels, input placeholders, navigation titles) is plain `string`
// and is not instructional content.

/** Provenance classes allowed for learner-facing instructional English. */
export type ProvenanceKind =
  /** verbatim content from a verified human-authored source */
  | "source"
  /** human-authored adaptation of a verified source */
  | "adapted"
  /** human-editor-approved text (approval recorded in the source pack) */
  | "editor"
  /** deterministic transformation of a verified source — no invented text */
  | "derived";

export interface Provenance {
  kind: ProvenanceKind;
  /** id into the lesson's source pack `assets[]` */
  ref: string;
  /** for kind "derived"/"adapted": the mechanical transform applied */
  note?: string;
}

/** A learner-facing instructional English field — always provenanced. */
export interface Field {
  text: string;
  prov: Provenance;
}

// ---------- Source pack ----------

export type AssetRights =
  /** verified reusable (e.g. VOA public domain, CC BY) */
  | "reusable"
  /** third-party/platform asset — embed or link only, never ingested */
  | "embed-only"
  | "link-only"
  /** reference evidence — informs design, contributes no content */
  | "reference";

export interface SourceAsset {
  id: string;
  title: string;
  creator: string;
  url: string;
  assetType:
    | "document"
    | "video"
    | "audio"
    | "quiz"
    | "embed"
    | "directive"
    | "page";
  humanAuthorship:
    | "human-authored"
    | "human-approved"
    | "community"
    | "unknown";
  rights: AssetRights;
  license: string;
  /** repo-relative local path when packaged; required for reusable media */
  local?: string;
  sha256?: string;
  /** instructional role inside the source lesson */
  role: string;
  notes?: string;
}

export interface SourcePack {
  id: string;
  title: string;
  canonicalUrl: string;
  assets: SourceAsset[];
}

// ---------- Items ----------

/** static instructional text — goals, scripts, notices, definitions */
export interface ReadItem {
  type: "read";
  id: string;
  blocks: Field[];
}

/** local packaged or embed video/audio with optional transcript */
export interface MediaItem {
  type: "media";
  id: string;
  media:
    | { kind: "video" | "audio"; src: string; sha256: string }
    | {
        kind: "embed";
        provider: "youtube";
        embedSrc: string;
        sourceUrl: string;
      };
  title: Field;
  transcript?: Field;
}

export interface McOption {
  id: string;
  text: Field;
}

/** multiple-choice — scored when inside a scored activity */
export interface McItem {
  type: "mc";
  id: string;
  prompt: Field;
  media?: { kind: "video" | "audio"; src: string; sha256: string };
  options: McOption[];
  /** id of the correct option — provenance asserted by the validator */
  answer: string;
  attempts: number;
}

/** free-text reproduction of a heard/source line — scored */
export interface DictationItem {
  type: "dictation";
  id: string;
  prompt: Field;
  media: { kind: "video" | "audio"; src: string; sha256: string };
  answer: Field;
  attempts: number;
}

/** cloze on a verbatim source line — scored */
export interface ClozeItem {
  type: "cloze";
  id: string;
  /** verbatim source text containing the blanked token */
  text: Field;
  /** the blanked token(s) — deterministic excerpt of `text` */
  answer: Field;
  attempts: number;
}

/** record → playback → rerecord; never scored */
export interface RecordItem {
  type: "record";
  id: string;
  prompt: Field;
  /** verbatim model line to imitate */
  model?: Field;
  mediaModel?: { kind: "video" | "audio"; src: string; sha256: string };
}

/** free production task — stored, never scored */
export interface WriteItem {
  type: "write";
  id: string;
  prompt: Field;
  model?: Field;
}

/** learner-authored free text stored as self-report (e.g. Set a Goal) */
export interface NoteItem {
  type: "note";
  id: string;
  prompt: Field;
}

/** Learning-Log-style self-evaluation — self-report channel only */
export interface SelfEvalItem {
  type: "selfeval";
  id: string;
  statement: Field;
  options: McOption[];
}

export type Item =
  | ReadItem
  | MediaItem
  | McItem
  | DictationItem
  | ClozeItem
  | RecordItem
  | WriteItem
  | NoteItem
  | SelfEvalItem;

// ---------- Hierarchy ----------

export interface Activity {
  id: string;
  /** mechanical navigation label or verbatim source heading */
  title: Field | string;
  /** scored activities compute a formative % from resolved items */
  scored: boolean;
  items: Item[];
}

/** R1 functional pipeline roles — functions, not fixed template */
export type SectionFunction =
  | "orient"
  | "prepare"
  | "input"
  | "comprehension"
  | "language-focus"
  | "practice"
  | "production"
  | "reflect";

export interface Section {
  id: string;
  function: SectionFunction;
  title: Field | string;
  activities: Activity[];
}

export interface Lesson {
  id: string;
  title: string;
  sections: Section[];
}

export interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  schemaVersion: 3;
  id: string;
  title: string;
  sourcePack: string;
  units: Unit[];
}
