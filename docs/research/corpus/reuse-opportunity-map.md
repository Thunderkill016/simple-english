# R1.4 — Reuse Opportunity Map

> Required output format (locked): SE NEED → existing solution →
> license → fit → evidence → REUSE / ADAPT / STUDY / BUILD.
> The core question: does an existing open-source system already
> solve enough of SE's non-content learning infrastructure that
> adapting/forking beats continuing the custom build?

## Needs map

| SE NEED | Existing solution | License | Fit | Evidence | Verdict |
|---------|-------------------|---------|-----|----------|---------|
| **Spaced-review scheduling** | ts-fsrs (FSRS 4.5/5/6) | MIT | Exact — card DSR model, 4 ratings, review log, Dexie-persistable state | FSRS > SM-2 on open benchmarks; runs inside Anki v24+ | **REUSE** |
| Interactive exercise widgets (MC, fill-blank, drag, dictation, question sets) | H5P content types + standalone player | MIT | Good — rendering layer only; needs local runtime adaptation | PCC workbook (Tier A) already ships H5P exercises; institutional standard | **ADAPT** |
| Reading-with-lookup (graded reader channel) | LUTE v3 / LinguaCafe patterns | MIT / GPL-3.0 | Partial — tools, not course components; PHP/Vue stack ≠ ours | 1.6k+1.4k★, active; word-status models proven at scale | **STUDY** (patterns: word status, media library, Anki-bridge concept) |
| Declarative course/content format | LibreLingo YAML → our lesson JSON schema | AGPL-3.0 + archived | Partial — we already have a schema; YAML course idea is precedent | 3.5k commits, then abandoned — format outlived app | **STUDY** (schema precedent only) |
| Audio-first listening tasks | OmniLingo cloze types on Common Voice | AGPL-3.0 / CC0 data | Partial — task types worth copying; code AGPL | Common Voice (CC0) is the reusable part, per-item verified | **STUDY** (task taxonomy) + REUSE data (CC0, TIER C) |
| Course platform wholesale | LibreLingo / Lingo Lessons / OpenLingo / freelingo | AGPL or AI-content | Poor — archived, AGPL, or AI-generated curricula | none survived gate+fit | **REJECT** (fork decision below) |
| Speaking rehearsal (local) | Sotto (sotto.fm) | repo unlocated | Unknown — AI rehearsal loop, local-first claimed | PARTIAL; AI content anyway | **STUDY** (mechanics; content forbidden) |
| Local-first persistence | Dexie (already in SE) + Localingo precedent | Apache-2.0 / MIT | Exact — same stack choice validated by an existing app | Localingo runs the identical pattern in production | **REUSE** (status quo, validated) |
| Media→review-item mining | Migaku pipeline concept | proprietary | Concept only | — | **STUDY** (idea: source asset → review item) |
| Dual-subtitle/transcript playback | Language Reactor UX | proprietary | Concept only | — | **STUDY** (line-click→seek UX) |
| Lesson/session engine | nothing found | — | **GAP** — no open system models resumable pedagogical lessons | OSS map §"what none solves" | **BUILD** (SE's real differentiator) |
| Formative vs proficiency channels | nothing found | — | **GAP** — even big products outsource proficiency (DET, McGraw-Hill) | benchmark doc | **BUILD** (spec-level design, not test generation) |
| Human-authored content + provenance | nothing found | — | **GAP** — no OSS has per-asset rights/provenance | R1.3 registry | **BUILD** (SE's existing source-registry discipline) |
| Progress/mastery model | Anki item states + mastery thresholds | free deck model | Partial — per-item states reusable concept; mastery claims are ours | — | **ADAPT** (per-item states, not "mastered" screens) |
| Sync layer | Localingo shareable state links / PouchDB replication | MIT / Apache | Optional-later — matches local-first deferral | — | **STUDY** (defer; design hook only) |
| ASR pronunciation scoring | ELSA (proprietary), browser Web Audio + n-gram (Localingo) | — / MIT | Practice-only use is legitimate per speaking-evidence lock | formative-estimate policy | **STUDY** (formative only, never proficiency) |

## The fork question — answered

**No.** No existing open-source system solves enough of SE's
non-content learning infrastructure to justify adapting or
forking it instead of continuing the current custom build:

1. The *course* platforms (LibreLingo, Lingo Lessons, OpenLingo,
   freelingo) are dead/archived, AGPL-encumbered, or built on
   AI-generated curricula that fails the Human Authorship Gate.
2. The *reading* platforms (LUTE, LinguaCafe) are excellent
   tools with no curriculum — different product shape.
3. The *session/lesson engine* SE needs simply does not exist
   openly: nobody models a resumable multi-section pedagogical
   lesson with per-item state and formative/proficiency
   separation. That gap is SE's actual differentiator.
4. Everything worth importing imports cleanly as libraries
   (ts-fsrs) or widgets (H5P content types) into the existing
   React+Dexie shell — no platform adoption needed.

**Verdict: continue the custom shell; REUSE libraries, ADAPT
widgets, STUDY everything else — do not fork a platform.**

## Things SE should definitely NOT rebuild

- The spaced-repetition algorithm (ts-fsrs is MIT, benchmarked,
  Anki-proven — rebuilding SM-2-style scheduling would be
  reinventing a worse wheel).
- Interactive exercise rendering where H5P types fit.
- Local persistence (Dexie already correct).
- A sync backend (defer; shareable-state pattern exists when
  needed).
- Speech scoring infrastructure (formative-only value; if ever
  needed, browser-native approaches precede cloud ASR).

## Things SE necessarily builds (the real product)

- Lesson→section→session engine with resume semantics.
- Content pipeline: human-authored open sources → normalized
  lesson items + per-asset rights/provenance (R1.3 registry
  becomes the ingestion index).
- Progress model: per-item attempt/due/mastery state where
  "completed screen" never claims "mastered capability."
- The calm lesson UX joining VOA/OER content into professional-
  depth flow (Task 006 territory, post-R1).
