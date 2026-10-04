# Pilot results — VOA LLE1 Lesson 1, seven gates

Task 006 exit review, **re-assessed after the Task 006.1 hardening pass**.
The question the pilot answers: *can the architecture normalize a complete
human-authored source pack into a coherent offline-capable self-study lesson
with correct state handling?* It claims nothing about learning efficacy.

## Gate 1 — Source integrity — PASS

- Source pack inventories 14 assets with per-asset rights status, evidence
  URL, verification date, third-party status, human-authorship class, local
  path + SHA-256 (`voa-lle1-lesson1.sourcepack.json`). Rights evidence for
  all reusable assets cites the official VOA copyright statement
  (`learningenglish.voanews.com/p/6021.html`).
- **Fragment layer**: 88 verbatim fragments extracted from the two text
  assets' embedded `sourceText` — each a normalized-contiguous substring,
  sha256-pinned, audience-classified (LEARNER/METADATA/ASSESSMENT/TEACHER).
  Extraction is reproducible: `scripts/build-sourcepack.mjs` re-verifies
  containment on every run.
- `pnpm validate:content` verifies media hashes, fragment hashes, and
  fragment→sourceText containment — a tampered file, tampered fragment, or
  non-contiguous claim fails the build.
- Automated audit artifact: `docs/pilots/voa-lle1-lesson1/gate-audit.json`
  (110 instructional fields: 84 source · 23 derived · 0 editor · 3 gap;
  82 fragments referenced; full lineage counts + gap dispositions).
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
- Every learner-facing instructional string is a provenanced `Field` —
  including all titles (bare-string titles fail schema validation). Prov
  kinds: `source` (verbatim fragment), `derived` (allowlisted transform the
  gate recomputes), `editor` (recorded approval), `gap` (withheld
  teacher-voice). The internal `task006-spec` directive asset was removed —
  spec text is never a content source; self-eval response choices moved to
  UI chrome.
- Teacher-voice audit: 3 fields withheld as GAP dispositions pending
  editor-approved learner wording (`editorial-packet.md`). The gate rejects
  a gap carrying text, a gap pointing at non-TEACHER material, TEACHER text
  in any field position, and ASSESSMENT fragments outside scored items.
- Retired the SE-authored lesson model: old `lesson.ts`/`curriculum.ts`,
  lesson JSON, schema, `lessonProgress` table, and their tests all removed;
  spec archived to `docs/curriculum/archive/`; SPEC §6.1 updated.

## Gate 3 — Resume correctness — PASS

- Item-cursor granularity: resume lands on the first *unresolved item*
  (`firstUnresolvedIndex`), finer than the USAL activity-level reference.
- `resolveItem` is idempotent inside its transaction: a second resolution of
  the same item is a no-op — double-invocation and concurrent calls collapse
  to the first recorded outcome (regression-tested).
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
| `pnpm validate:content` | sourcepack ✓ · gate PASS — 110 fields (84 source / 23 derived / 3 gap), 82 fragments, 6 transform ops |
| `pnpm test` (Vitest) | 58/58 |
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
