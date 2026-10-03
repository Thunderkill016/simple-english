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
   verified asset). LLM-authored instructional text is prohibited; AI may only
   write non-instructional UI chrome.

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
