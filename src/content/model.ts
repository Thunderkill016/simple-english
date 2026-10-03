// Content model v3 — source-driven learning model (ADR-0003).
//
// Canonical hierarchy: COURSE → UNIT → LESSON → SECTION → ACTIVITY → ITEM.
// SESSION is not an entity — a session is only a runtime visit.
//
// Human Content Gate v2 (Task 006.1): every learner-facing instructional
// English field carries provenance that resolves to a verbatim source
// FRAGMENT (contiguous substring of a declared asset's sourceText), a
// recomputed deterministic transform over fragments, a recorded editor
// approval, or an explicit GAP pointing at the withheld teacher-voice
// fragment. UI chrome (button labels, placeholders, self-eval response
// choices) lives in code and is not instructional content.

// ---------- Source pack ----------

export type AssetRights =
  /** verified reusable (e.g. VOA public domain, CC BY) */
  | "reusable"
  /** third-party/platform asset — embed or link only, never ingested */
  | "embed-only"
  | "link-only"
  /** reference evidence — informs design, contributes no content */
  | "reference";

export type RightsStatus = "VERIFIED" | "THIRD_PARTY" | "UNVERIFIED";

export type ThirdPartyStatus =
  | "NONE_OBSERVED"
  | "PRESENT"
  | "UNKNOWN";

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
  /** rights evidence (Task 006.1 B6) */
  rightsStatus: RightsStatus;
  /** authoritative rights-policy URL the status was checked against */
  rightsEvidenceUrl?: string;
  /** ISO date the status was verified */
  rightsVerifiedAt?: string;
  thirdPartyStatus: ThirdPartyStatus;
  thirdPartyNotes?: string;
  /**
   * verbatim extraction of the asset's text — the ground truth every
   * fragment's exactText is verified against (text assets only)
   */
  sourceText?: string;
}

/**
 * Who may see a fragment. TEACHER text is never learner-facing: it may
 * only be referenced by a gap field (withheld pending human-approved
 * learner wording).
 */
export type FragmentAudience = "LEARNER" | "METADATA" | "ASSESSMENT" | "TEACHER";

export type FragmentRole =
  | "title"
  | "heading"
  | "topic"
  | "goal"
  | "vocab-def"
  | "script"
  | "prompt"
  | "option"
  | "stem"
  | "instruction"
  | "model"
  | "advice"
  | "note";

/** verbatim substring of an asset's sourceText — the unit of provenance */
export interface SourceFragment {
  id: string;
  assetRef: string;
  audience: FragmentAudience;
  role: FragmentRole;
  /** human locator — page/section inside the source document */
  locator: string;
  exactText: string;
  /** sha256(exactText) — computed by scripts/build-sourcepack.mjs */
  exactTextHash: string;
}

/** recorded human-editor approval — backs kind:"editor" fields */
export interface Approval {
  id: string;
  text: string;
  approvedBy: string;
  approvedAt: string;
  note?: string;
}

export interface SourcePack {
  id: string;
  title: string;
  canonicalUrl: string;
  assets: SourceAsset[];
  fragments: SourceFragment[];
  approvals: Approval[];
}

// ---------- Provenance & transforms ----------

/**
 * Deterministic transform allowlist (Task 006.1 B2). The gate recomputes
 * every derived field from its transform + referenced fragments and
 * requires an exact match — derived text is verified, not trusted.
 */
export type Transform =
  /** field text === fragment exactText (normalized) */
  | { op: "VERBATIM"; ref: string }
  /** field text === picks.join(sep); each pick ⊆ one of refs */
  | { op: "SELECT_LINES"; refs: string[]; picks: string[]; sep: string }
  /** field text === source with `token` replaced by "__"; source ⊆ ref */
  | { op: "BLANK_TOKEN"; ref: string; source: string; token: string }
  /** field text === token; token ⊆ ref */
  | { op: "TOKEN"; ref: string; token: string }
  /** field text === each ref's head word joined by sep (vocab lists) */
  | { op: "JOIN_VERBATIM_ITEMS"; refs: string[]; sep: string; extract: "head" }
  /** mechanical alphabet enumeration authorized by `ref` */
  | { op: "ENUMERATE_ALPHABET"; ref: string }
  /** mechanical cardinal-number enumeration authorized by `ref` */
  | { op: "ENUMERATE_CARDINALS"; ref: string; from: number; to: number };

export type Provenance =
  /** verbatim field — ref is a source-pack fragment id */
  | { kind: "source"; ref: string; note?: string }
  /** deterministic transform over fragments — gate recomputes */
  | { kind: "derived"; transform: Transform; note?: string }
  /** human-editor-approved — ref is a source-pack approval id */
  | { kind: "editor"; ref: string; note?: string }
  /**
   * withheld instructional wording — ref is a TEACHER-audience fragment
   * quoting the source text the field withholds; renders no English
   */
  | { kind: "gap"; ref: string; note: string };

/** learner-facing field carrying provenanced text */
export interface TextField {
  text: string;
  prov: Exclude<Provenance, { kind: "gap" }>;
}

/** withheld field — references the teacher-voice fragment it replaces */
export interface GapField {
  prov: { kind: "gap"; ref: string; note: string };
}

export type Field = TextField | GapField;

export function isGapField(f: Field): f is GapField {
  return f.prov.kind === "gap";
}

/** display text for a field; gap fields render a non-instructional marker */
export function fieldText(f: Field | string): string {
  if (typeof f === "string") return f;
  return isGapField(f) ? "" : f.text;
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
  title: TextField;
  transcript?: Field;
}

export interface McOption {
  id: string;
  text: TextField;
}

/** multiple-choice — scored when inside a scored activity */
export interface McItem {
  type: "mc";
  id: string;
  prompt: TextField;
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
  prompt: TextField;
  media: { kind: "video" | "audio"; src: string; sha256: string };
  answer: TextField;
  attempts: number;
}

/** cloze on a verbatim source line — scored */
export interface ClozeItem {
  type: "cloze";
  id: string;
  /** source line with the blanked token (BLANK_TOKEN transform) */
  text: TextField;
  /** the blanked token(s) — deterministic excerpt of `text` */
  answer: TextField;
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

/**
 * Learning-Log-style self-evaluation — self-report channel only.
 * Response choices are UI chrome (fixed constant in ItemView), not
 * instructional content — they carry no provenance.
 */
export interface SelfEvalItem {
  type: "selfeval";
  id: string;
  statement: Field;
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
  /** verbatim source heading or metadata fragment — never a bare string */
  title: Field;
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
  title: Field;
  activities: Activity[];
}

export interface Lesson {
  id: string;
  title: Field;
  sections: Section[];
}

export interface Unit {
  id: string;
  title: Field;
  lessons: Lesson[];
}

export interface Course {
  schemaVersion: 3;
  id: string;
  title: Field;
  sourcePack: string;
  units: Unit[];
}
