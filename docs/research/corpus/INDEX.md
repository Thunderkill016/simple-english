# SE Research Corpus — Index

Mission: `R1 — Build the Evidence Base Before Building the Product`
Branch: `research/r1-english-learning-corpus`
Started: 2026-10-04

> DOCUMENTS DECIDE. AI RESEARCHES, EXTRACTS, COMPARES AND IMPLEMENTS LATER.
> No product feature work happens in R1. ChatGPT reviews each research round
> and makes the product decisions.

## Conventions

Every research document separates:

- **SOURCE FACT** — what a specific inspected source actually states/shows.
- **DEVIN ANALYSIS** — inference drawn from that evidence.
- **OPEN QUESTION** — unresolved; never filled by guessing.

Claims are tagged `CONFIRMED` / `PARTIAL` / `UNKNOWN` where source visibility is limited.

## Research rounds

| Round | Scope | Status |
| --- | --- | --- |
| R1.1 | Cambridge ecosystem (deepest) | IN PROGRESS — reported to ChatGPT |
| R1.2 | Professional course comparison (Empower / English File / Speakout / Roadmap-GSE / Outcomes) | DONE — reported to ChatGPT, awaiting review |
| R1.3 | Open content & rights | Pending |
| R1.4 | SLA evidence & digital systems | Pending |
| Final | Evidence-base synthesis | Pending |

## Documents

### R1.1 — Cambridge

- `cambridge-system-map.md` — how the Cambridge learning system works end to end.
- `cambridge-empower-a1-deep-dive.md` — unit/lesson structure of Empower Starter Unit 1 (**LEGACY / FIRST-EDITION internal evidence**; 2e cross-confirmed at skeleton level).
- `empower-edition-diff.md` — 1e Starter Unit 1 vs 2e Starter/A1 Unit 1 (SAME/CHANGED/UNKNOWN per dimension). **2e evidence wins conflicts.**
- `cambridge-assessment-system.md` — LOA, Principles of Good Practice, Empower progress/competency tests, Write&Improve / Speak&Improve (formative estimate per Correction C).
- `english-profile-analysis.md` — EP programme, EGP, EVP — **REFERENCE_ONLY per ChatGPT Decision 3**.
- `cambridge-corpus-analysis.md` — which corpora exist, how Cambridge uses them, what is public/licensed.
- `cambridge-rights-boundary.md` — what may be inspected vs what may be reused.

---

## CHATGPT REVIEW DECISIONS (2026-10-04)

R1.1 accepted with corrections; recorded per mission §39.

**Reference hierarchy (locked):**

```text
FOUNDATIONAL EVIDENCE      CEFR + SLA research + ACTFL + British Council + TESOL
PRIMARY PROFESSIONAL BENCHMARK   Cambridge Empower Second Edition
SPECIALIST PROFESSIONAL BENCHMARKS  English File / Speakout / Roadmap-GSE / Outcomes
IMPLEMENTABLE CONTENT      VOA / American English / OER / open data
→ SE
```

Cambridge is the structural benchmark, not sole truth — it does not override
stronger foundational evidence or self-study product constraints. Deviations
from classroom mechanics need their own evidence.

**Depth principle (locked):**

SE targets **coverage depth**, not exercise counts. Four distinct scopes:

```text
UNIT depth    = the capability cluster (Cambridge unit ≈ SE unit)
LESSON depth  = one objective-titled skills chain
SECTION depth = one stage inside a lesson (input / language / pron / practice / production / check)
SESSION depth = what one web sitting actually covers — a lesson may span
                multiple resumable sessions
```

Do NOT cut curriculum to make a short session. Do NOT copy Cambridge's
~25-item exercise count into a web lesson.

**EGP/EVP (locked):** REFERENCE_ONLY — research queries + cited findings;
no bulk ingestion, repo snapshot, runtime dependency, commercial-use
assumption, or "English Profile informed" claim. Terms:
`englishprofile.org/?menu=evp-terms-of-use`, `?menu=contact-us`.

**Speaking evidence (locked for SE v1):** self-practice / record / replay /
reflect = PRACTICE EVIDENCE ONLY. Never claim speaking competency from it.
Machine scoring = formative estimate unless independently validated.
Human+rubric review = possible stronger evidence later. Interpersonal
ability cannot be inferred from solo repetition.

**Speak & Improve / Write & Improve:** formative practice estimates —
not Cambridge-exam-equivalent proficiency evidence (official help docs).

**R1.2 scope (locked):** same beginner problem (meet/greet/introduce/basic
personal info) across Empower 2e Starter/A1, English File 5e Beginner,
Speakout 3e A1, Roadmap 2e/GSE beginner, Outcomes 3e Beginner. Ten questions
on recurring patterns, Cambridge-specifics, specialist deltas, depth,
unit/lesson/section/session boundaries, pronunciation integration,
controlled-vs-personalized production, review, assessment-vs-completion,
and classroom mechanics that don't transfer to solo web. No scores, no
winner, no new SE curriculum.

## CHATGPT REVIEW DECISIONS — R1.2 (2026-10-04)

R1.2 = PASS WITH CORRECTIONS. PR #9 stays open; same research branch.

1. **Pirated-source ban is absolute** — no mirrored/leaked scans may
   support, corroborate, or raise confidence in any claim, even
   TOC-level facts. Official publisher or authorized reproductions
   only; otherwise the claim is PARTIAL/UNKNOWN.
2. **Sample-scoped language** — "observed in the inspected
   five-course beginner sample" ≠ "professional universal".
   Unit is the stable depth envelope; lesson depth varies.
3. **Edition verification** — Roadmap 2e verified (official A1 U1
   sample pack: SAME core structure, DYS moved to Extended book,
   new Soft skills strand, I-can statements in Check and reflect).
   Outcomes 3e Beginner exists (ISBN 9798214179261, 2024) but no
   official sample in bounded pass → 2e internals = LEGACY.
4. **Human Authorship Gate (new, locked)** — every R1.3+ source row
   carries `authorship_provenance`, `human_authored_status`,
   `ai_generated_status`. Statuses: HUMAN_AUTHORED_VERIFIED /
   HUMAN_EDITED_VERIFIED / AI_GENERATED / UNKNOWN.
   **AI_GENERATED and UNKNOWN content are forbidden as SE
   learner-facing curriculum/content.** Software mechanics of
   AI-using projects may still be studied; their AI-generated
   lesson content may not.

**Countries/alphabet:** COMMON PROFESSIONAL PATTERN, not a
curriculum requirement. Inclusion undecided — resolved later by
target-learner + reference curriculum + level evidence + recycling
value + available human-authored content.

**Session gap:** confirmed research priority — R1.4 must include
self-paced digital product + open-source system reverse
engineering (Duolingo/Busuu/Babbel/Speak/ELSA/LingQ/Language
Reactor/Migaku/Anki + LibreLingo/Lingo Lessons/Sotto/LUTE/
LinguaCafe/OmniLingo/H5P/FSRS): lesson→session, resume, next
action, review due, mistakes, progress, SRS, content packs,
offline/local state, assessment separation.

**R1.3 scope (locked):** two layers —
A) NARROW: can human-authored open content match professional
coverage depth for meet/greet/introduce/personal-info?
B) BROAD: landscape audit of complete human-authored open
resources (courses, textbooks, teacher resources, listening,
speaking, grammar, vocabulary, pronunciation, reading, writing,
review, assessment). Mandatory fields: exact item, author/org,
human-authorship status, original URL, license, commercial use,
adaptation, redistribution, third-party exceptions, level,
skill/function, completeness. No AI gap-filling. GAP = GAP.

### R1.2 — Professional course comparison

- `professional-course-comparison.md` — five-course Unit-1 comparison
  (Empower 2e / EF 5e / Speakout 3e / Roadmap A1-GSE / Outcomes 2e)
  answering the ten locked questions + R1.2-review correction pass
  (pirated-source purge, sample-scoped language, Roadmap 2e verified,
  Outcomes 3e-exists-but-legacy note, human-authorship gate).

### Cross-cutting

- `source-registry.csv` — machine-readable provenance for every inspected source.
- `download-manifest.md` — what was downloaded, where it lives, and why it was/wasn't committed.

### Planned (not yet created)

- R1.2: `english-file-analysis.md`, `speakout-analysis.md`, `roadmap-gse-analysis.md`, `outcomes-analysis.md`
- R1.3: `open-content-landscape.md`, `language-data-landscape.md`, `speech-landscape.md`
- R1.4: `sla-evidence-map.md`, `open-source-software-map.md`, `digital-product-benchmark.md`, `pedagogy-authorities.md`
- Final: `SE-EVIDENCE-MAP.md`, `contradictions-and-tradeoffs.md`, `research-coverage.md`

## Working files

Temporary inspection copies live in gitignored `research_cache/` (`cambridge/`,
`voa/`, `pearson/`, `ngl/`, `oup/`). Nothing copyrighted is committed.
See `download-manifest.md` for the exact inventory.
