# ADR-0003: Source-driven content model — the VOA Lesson 1 pilot

Status: accepted (Task 006)
Supersedes: the SE-authored Lesson 001 content path (not ADR-0001/0002)

## Context

R1 research (`docs/research/corpus/R1-FINAL-SYNTHESIS.md`) established that SE's
hard problem is not finding content — it is the **normalization layer** that
turns verified human-authored material into a coherent self-study experience.
The reviewed synthesis fixed two hard constraints:

1. **Pilot authority** — the pilot is the complete VOA *Let's Learn English
   Level 1 — Lesson 1* source pack. "Meet / greet / introduce" is its theme,
   not a license to ship an AI-selected micro-capability.
2. **Human Content Gate** — every learner-facing instructional English field
   must carry provenance (`source`, `adapted`, `editor`, or `derived` from a
   verified asset; the Task 006.1 amendment below replaces this set with
   `source`/`derived`/`editor`/`gap`). LLM-authored instructional text is
   prohibited; AI may only write non-instructional UI chrome.

## Decision

### Content model v3

Canonical hierarchy: `COURSE → UNIT → LESSON → SECTION → ACTIVITY → ITEM`.
There is no `SESSION` entity — a visit is runtime only.

- A **source pack** (`*.sourcepack.json`) inventories human-authored assets
  with per-asset rights (`reusable`, `embed-only`, `link-only`, `reference`),
  human-authorship class, local media path and SHA-256.
- A **course** (`*.lesson.json`, `schemaVersion: 3`) references one pack and
  carries instructional text as `{ text, prov }` fields.
- Sections are typed by **function** (orient, prepare, input, comprehension,
  language-focus, practice, production, reflect) — the human source decides
  what exists; functions are not mandatory fixed sections.
- Item types: `read, media, mc, dictation, cloze, record, write, note,
  selfeval`. Only `mc/dictation/cloze` are *answerable* (scoreable +
  reviewable).

### State model v2 — four orthogonal channels

1. **Completion** — activity tri-state (none/started/completed).
2. **Formative** — item outcomes + per-activity practice score. Never mastery.
3. **Self-report** — Learning-Log goals/can-do statements. Never contaminates
   other channels.
4. **Review** — `ts-fsrs` scheduling state. Scheduler only: no curriculum
   order, no mastery, no proficiency.

Resume is at **first-unresolved-item** granularity (finer than the USA Learns
activity-level resume). Completion is not outcome measurement: an activity can
complete with a zero practice score.

### Feedback

Bounded attempts → retry → reveal the verified answer. Feedback *cues* may
only exist when provenanced; otherwise the system uses the simple verified
path. No cue is ever generated.

### Media

Rights-verified assets are packaged under `public/media/` with recorded
SHA-256s, verified at validation time and on disk. A minimal service worker
caches `/media/*` cache-first and the app shell stale-while-revalidate, so a
loaded lesson needs no network. YouTube stays click-to-load embed-only.

## Consequences

- `se-a1-meet-someone` (the SE-authored lesson) is retired; its spec is
  archived under `docs/curriculum/archive/`.
- Dexie v2 drops `lessonProgress`; new tables: `itemStates`,
  `activityStates`, `selfReports`, `reviewCards`.
- `pnpm validate:content` fails the build on any Human Content Gate
  violation, and emits `docs/pilots/<pack>/gate-audit.json`.
- The pilot proves the architecture can ingest human material — it claims
  nothing about learning efficacy, CEFR, or proficiency.

## Amendment — Task 006.1 hardening (provenance to fragment granularity)

Review found the v1 gate too weak: a `source` ref named only an *asset*, so
field text was trusted, not verified; teacher-voice strings reached learners;
titles bypassed the gate; an internal spec document posed as a provenance
source; and `resolveItem` could double-resolve. Hardened as follows:

- **Source fragments** — the unit of provenance is now a verbatim, normalized-
  contiguous substring of a text asset's embedded `sourceText`: `{ id,
  assetRef, locator, exactText, exactTextHash, audience, role }`. Extraction
  is reproducible (`scripts/build-sourcepack.mjs`); both the generator and
  the gate verify containment + sha256. Media assets keep file-level hashes.
- **Deterministic transform allowlist** — `VERBATIM`, `SELECT_LINES`,
  `BLANK_TOKEN`, `TOKEN`, `JOIN_VERBATIM_ITEMS`, `ENUMERATE_ALPHABET`,
  `ENUMERATE_CARDINALS`. Every `derived` field declares a transform; the gate
  recomputes the result and requires an exact match. Transforms may not read
  TEACHER fragments.
- **Fragment audiences** — `LEARNER` (any field), `METADATA` (titles +
  display only), `ASSESSMENT` (scored items only), `TEACHER` (never
  learner-facing — `gap` refs only). Enforced per field position.
- **GAP dispositions** — teacher-voice fields are withheld: `{ prov:
  { kind: "gap", ref: <TEACHER fragment>, note } }` renders no instructional
  English until an editor approves learner-facing wording (recorded in
  `approvals[]`, gated as `kind: "editor"`). See `editorial-packet.md`.
- **Titles are Fields** — every title at every level must carry provenance;
  bare-string titles fail schema validation. Self-eval response choices are
  UI chrome in code, not instructional content.
- **Rights evidence** — reusable assets carry `rightsStatus`,
  `rightsEvidenceUrl`, `rightsVerifiedAt`, `thirdPartyStatus` (+notes when
  PRESENT); the official VOA copyright statement
  (`learningenglish.voanews.com/p/6021.html`) is the evidence URL.
- **Idempotent `resolveItem`** — a resolved item is never re-resolved inside
  the transaction; concurrent/double invocations collapse to one outcome.
- **Spec documents are never provenance** — the `task006-spec` directive
  asset was removed; internal instructions cannot back learner-facing text.
