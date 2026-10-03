# R1.4B — Open-Source Learning-System Map

> Locked scope (ChatGPT R1.3 review): reverse-engineer the named
> projects plus relevant discoveries. Fields per project: license,
> maintenance, architecture, course/unit/lesson/session model,
> content format, human-vs-AI provenance, exercise engine, media,
> progress, mistakes, review/SRS, resume, next-action, offline/local,
> sync, assessment separation, speaking, reading, accessibility,
> test quality. Verdicts: REUSE_DIRECTLY / ADAPT / STUDY_ONLY /
> REJECT. Software quality ≠ curriculum quality — kept separate.
> Human-content rule: AI-generated lesson content is forbidden as
> SE learner content; code may still be studied/reused.

## Summary matrix

| Project | License | Maintained | Type | Session model exists? | Local-first? | Verdict |
|---------|---------|-----------|------|----------------------|--------------|---------|
| LibreLingo | AGPL-3.0 | **ARCHIVED 2026-06** | course platform | partial (module→challenge lists) | PouchDB, yes | STUDY_ONLY (format + mechanics) |
| Lingo Lessons (openappsstudio) | open (repo unlocated) | PARTIAL | guided courses | unknown | offline lessons claimed | PARTIAL — needs repo |
| Sotto (sotto.fm) | open (repo unlocated) | active product | AI speaking rehearsal | rehearsal loop | local-first claimed | PARTIAL — needs repo; AI content gate |
| LUTE v3 | MIT | active | reading/vocab tool | n/a (no lessons) | self-hosted | STUDY_ONLY (lookup/review patterns) |
| LinguaCafe | GPL-3.0 | active | reading/vocab platform | n/a | self-hosted | STUDY_ONLY (immersion reader patterns) |
| OmniLingo | AGPL-3.0 | low activity | listening cloze game | batch-of-5 adaptive | no | STUDY_ONLY (audio-first task types) |
| H5P | MIT (libraries+types) | active | interactive content format | n/a (embeddable) | needs runtime | **ADAPT** (exercise widgets/format) |
| fsrs.js → **ts-fsrs** | MIT | fsrs.js superseded; ts-fsrs active | SRS algorithm | n/a | pure library | **REUSE_DIRECTLY** (review engine) |
| Localingo (discovered) | MIT | active | local-first tutor | lesson loop + daily goal | IndexedDB, yes | STUDY_ONLY (closest SE analogue) |
| OpenLingo/pretzelai (discovered) | MIT | active | AI tutor platform | unit→lesson steps | no (PG) | STUDY_ONLY code / REJECT content (AI-generated) |

## Per-project detail

### LibreLingo — STUDY_ONLY
- License: AGPL-3.0 (software); courses individually licensed —
  provenance per course; community-authored, uneven QA.
- Architecture: Python yaml-loader/json-export pipeline + Svelte
  web app, PouchDB local progress. Archived read-only 2026-06.
- Models: course → module → skill → challenge types
  (cards/chips/listening/short-input/options). Session = linear
  challenge list per skill; no resume/due-review engine.
- Lesson to take: declarative YAML course format, tiny challenge
  taxonomy, local progress via PouchDB — precedents SE can borrow
  conceptually. AGPL + archive blocks forking.

### Lingo Lessons — PARTIAL
- openappsstudio; open source claimed, 8 guided courses, offline
  lessons, personalized review. Repository not located in bounded
  pass → license/architecture UNKNOWN. Follow-up required before
  any reuse claim.

### Sotto — PARTIAL
- sotto.fm: self-hosted rehearsal system (CEFR classes, guided
  speaking, local LLM/TTS/STT/storage; "practice companion, not a
  replacement for human instruction" — refreshingly honest
  framing matching our speaking-evidence lock). Repo not located
  in bounded pass; AI-generated content makes it STUDY_ONLY for
  mechanics even when found.

### LUTE v3 — STUDY_ONLY
- LuteOrg/lute-v3: MIT, Python/Flask + Docker, self-hosted.
- Reading-first: import text → click word → dictionary/term card
  → status ladder (1-5+WKY) → Anki export / term review.
- No course/lesson/session; it's a *tool*, not a course. Take:
  per-word status model, text parsing/dictionary pipeline, Anki
  bridge idea (media→review-item extraction).

### LinguaCafe — STUDY_ONLY
- simjanos-dev/LinguaCafe: GPL-3.0, Vue + PHP, self-hosted, 1.4k
  stars, active; 26+ languages.
- Same category as LUTE at platform scale: library→reader→word
  statuses→SRS review→Jellyfin video+subtitle integration.
- Take: immersion-reader UX patterns, word-status graph, media
  library structure. GPL + PHP stack ≠ SE's Vite/Dexie.

### OmniLingo — STUDY_ONLY
- AGPL-3.0, Python+JS, Common Voice (CC0) dataset as content.
- Session mechanics worth studying: questions ordered by
  difficulty → batches of 5 → 4 task types (cloze, drag-tiles,
  pick-right, spot-word) → advance when 5 answered faster than
  audio plays. Audio-first, no metalingual dependency.
- Take: audio-first exercise types + Common-Voice→cloze pipeline
  idea (TIER C data, per-item check). AGPL blocks reuse.

### H5P — ADAPT
- MIT across libraries/content types; hub + PHP/JS runtime;
  standalone player exists. Active, institutional adoption huge.
- Model: content type definitions (JSON semantics + JS view) —
  interactive video, dialog cards, MC, fill-blanks, drag-words,
  dictation, question sets; xAPI statement emission.
- No course/session/progress model — it is the *exercise layer*
  that LMSs embed. PCC workbook already uses H5P exercises →
  format compatibility with our Tier-A sources is real.
- Take: reuse content-type widgets for exercise rendering;
  treat H5P semantics as an exercise-schema reference.

### fsrs.js / ts-fsrs — REUSE_DIRECTLY
- fsrs.js: MIT, superseded (author redirects). ts-fsrs: MIT,
  TypeScript monorepo, 800★, active; FSRS-4.5/5/6 implementations.
- Model: card {difficulty, stability, retrievability} → rating
  (Again/Hard/Good/Easy) → new due + review log; states
  New→Learning→Review→Relearning; parameters tunable; optimizer
  exists (fsrs-rs) for per-user fitting from review history.
- Evidence: FSRS beat SM-2 in open benchmarks on real review
  logs (open-spaced-repetition wiki); Anki itself adopted FSRS
  as option in 2024 — production-validated at scale.
- Fit: Dexie-persisted per-item state + ts-fsrs scheduling =
  SE's due-review engine with zero algorithm risk.

### Localingo — STUDY_ONLY (discovered)
- baditaflorin/localingo: MIT, pure GitHub-Pages SPA, React+Vite
  + IndexedDB, no backend/auth. SM-2-inspired SRS, Web-Audio
  pronunciation scoring, local grammar feedback via n-gram
  embeddings, shareable state links, activity log, daily goal.
- The closest existing analogue to SE's architecture (local-first
  IndexedDB + client-only). Content is generated drills — verify
  provenance before anything enters learner path.
- Take: IndexedDB SRS schema, offline patterns, share-link state
  export (replaces sync), speech-scoring approach.

### OpenLingo (pretzelai) — STUDY_ONLY code / REJECT content
- MIT, Next.js+PG; AI-generated units (GPT) → fails Human
  Authorship Gate for content. Mechanics worth noting: markdown+
  frontmatter unit format, lesson step types, FSRS-6 flashcards.

## What NO open-source system solves for SE

- A resumable pedagogical-lesson model (LibreLingo challenge lists
  are the closest — linear, no resume position).
- Assessment separation (formative vs proficiency) — none model
  it.
- Human-authored course pipeline with per-asset rights metadata —
  none have SE's provenance layer.
- A1-appropriate speaking practice loop — all AI-based or absent.
- The professional-course lesson structure (sections, controlled→
  personalized flow) — none implement it; SE still owns this gap.

## Fork-vs-continue — PROVISIONAL (corrected by R1.4 review)

Among the open-source systems audited, none survives gate+fit:
the course products (LibreLingo, Lingo Lessons, OpenLingo) are
archived/AGPL/AI-content-gated; the reading platforms (LUTE,
LinguaCafe) are tools without curricula; the engines worth
taking are *libraries* (ts-fsrs MIT) and *widgets* (H5P),
adoptable into SE's Dexie/React stack.

**However this verdict is PROVISIONAL**: USA Learns — a
human-designed self-study system that already converted VOA
content into independent web study — had not been deeply
reverse-engineered when this was written. It is the R1.4A
mission. Even if its code is proprietary (no fork), the broader
question stands: can SE clean-room reproduce a proven
self-study architecture instead of inventing one?

### H5P licensing — corrected granularity

Do NOT summarize H5P as "MIT". Separate layers:

- H5P core libraries/plugins: MIT (h5p-php-library etc.)
- content-type code: MIT for official types (verify per type)
- H5P *content* created by others: licensed per item by its
  author — a PCC H5P exercise's license ≠ the runtime's license
- third-party dependencies inside types: per-package check
- H5P.com/hub services: commercial, separate from libraries
