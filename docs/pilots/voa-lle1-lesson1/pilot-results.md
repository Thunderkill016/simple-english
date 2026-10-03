# Pilot results — VOA LLE1 Lesson 1, seven gates

Task 006 exit review. The question the pilot answers: *can the architecture
normalize a complete human-authored source pack into a coherent offline-capable
self-study lesson with correct state handling?* It claims nothing about
learning efficacy.

## Gate 1 — Source integrity — PASS

- Source pack inventories 13 assets with per-asset rights, human-authorship
  class, local path + SHA-256 (`voa-lle1-lesson1.sourcepack.json`).
- `pnpm validate:content` verifies every declared local file's hash against
  disk — a tampered/missing file fails the build
  (`tests/content-gate.test.ts` proves tamper + missing-file + missing-prov
  detection).
- Automated audit artifact: `docs/pilots/voa-lle1-lesson1/gate-audit.json`
  (generated each validation run — 122 instructional fields, 0 violations).
- Complete source-defined scope retained (see `transformation-map.md`):
  goals + strategy, 7 key words, speaking-practice clip, alphabet/numbers
  review, main video + conversation audio + script, 6-question quiz, BE
  language focus, pronunciation, dictation/cloze, speaking, writing, learning
  log — 8 sections, 15 activities, 42 items.

## Gate 2 — Normalization — PASS

- Single canonical model: `COURSE → UNIT → LESSON → SECTION → ACTIVITY → ITEM`,
  `schemaVersion: 3`. No `SESSION` entity.
- Sections typed by function (orient → prepare → input → comprehension →
  language-focus → practice → production → reflect); the source decides what
  exists.
- Every learner-facing instructional string is a `{ text, prov }` field; the
  Human Content Gate is enforced in code at build time and in tests — not by
  review discipline alone.
- Retired the SE-authored lesson model: old `lesson.ts`/`curriculum.ts`,
  lesson JSON, schema, `lessonProgress` table, and their tests all removed;
  spec archived to `docs/curriculum/archive/`; SPEC §6.1 updated.

## Gate 3 — Resume correctness — PASS

- Item-cursor granularity: resume lands on the first *unresolved item*
  (`firstUnresolvedIndex`), finer than the USAL activity-level reference.
- Proven unit-level (`tests/store.test.ts`: out-of-order resolution resumes
  correctly) and end-to-end (`e2e` 04: reload mid-activity → same item).
- `nextActivityToDo` drives the Today pointer; verified across a full-course
  completion walk.

## Gate 4 — State orthogonality — PASS

- Four independent channels: `activityStates` (completion),
  `itemStates` + score (formative), `selfReports` (self-report),
  `reviewCards` (retention). Separate Dexie tables (v2 schema).
- Completion ≠ outcome: an all-revealed activity completes with a 0% score
  (unit-tested + e2e).
- Self-report writes touch no other table (isolation test).
- Non-answerable items never create review cards (isolation test).

## Gate 5 — Source-backed feedback feasibility — PASS (simple path)

- Bounded attempts (source-defined `attempts: 2`) → retry → reveal the
  verified answer. Deterministic `evaluate()` — unit-tested including
  late-correctness and resolved no-op.
- No feedback cue was invented anywhere: the pack contains no provenanced
  hints, so the system uses the simple verified path exclusively, as the gate
  requires.

## Gate 6 — FSRS review integration — PASS

- `ts-fsrs@5.4.2` (MIT) behind `src/features/review/fsrs.ts` — scheduling
  only. Ratings map honestly: first-try-correct→Good, retried→Hard,
  revealed→Again.
- Only answerable items (mc/dictation/cloze) are eligible — enforced in code
  and tested.
- Deterministic clocks in tests; due selection is a pure filter.
- Review page re-attempts the same source item and reschedules — never
  curriculum order, never mastery.

## Gate 7 — Offline / media packaging — PASS

- 10 media assets (≈30 MB) under `public/media/voa-lle1/` with verified
  SHA-256; all references are root-absolute `/media/*` (a relative-`src`
  404 bug was caught by E2E and fixed).
- Minimal service worker (`public/sw.js`, registered prod-only):
  `/media/*` cache-first, app shell stale-while-revalidate; cross-origin
  never cached. YouTube stays click-to-load embed-only (e2e asserts no
  iframe on load).
- Learner state lives in IndexedDB only — no network on the state path.

## Metrics

| Check | Result |
|---|---|
| `pnpm typecheck` | clean |
| `pnpm validate:content` | sourcepack ✓ · gate PASS, 122 fields |
| `pnpm test` (Vitest) | 44/44 |
| `vite build` | 401 kB JS / 126 kB gzip |
| `pnpm test:e2e` (Playwright) | 11/11 |

## Known limitations (honest)

- The quiz-mp4 stems autoplay nothing; learners press play — fine for pilot.
- The 401 kB bundle includes the inlined course JSON + ts-fsrs; code-splitting
  deferred (single-course pilot).
- The Learning-Log self-eval uses the plan's own goal categories; no CEFR or
  level claim is made anywhere.
- Record → replay → re-record works where MediaRecorder exists; denied/unsupported
  degrades to "practice aloud" — by design, no speech scoring.
