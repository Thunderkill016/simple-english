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
| R1.2 | Professional course comparison (Empower / English File / Speakout / Roadmap-GSE / Outcomes) | PRELIMINARY DATA COLLECTED — awaits ChatGPT direction |
| R1.3 | Open content & rights | Pending |
| R1.4 | SLA evidence & digital systems | Pending |
| Final | Evidence-base synthesis | Pending |

## Documents

### R1.1 — Cambridge

- `cambridge-system-map.md` — how the Cambridge learning system works end to end.
- `cambridge-empower-a1-deep-dive.md` — unit/lesson structure of Empower Starter Unit 1, extracted from an official distributor reproduction.
- `cambridge-assessment-system.md` — LOA, Principles of Good Practice, Empower progress/competency tests, Write&Improve / Speak&Improve.
- `english-profile-analysis.md` — EP programme, EGP, EVP, Cambridge Learner Corpus connection.
- `cambridge-corpus-analysis.md` — which corpora exist, how Cambridge uses them, what is public/licensed.
- `cambridge-rights-boundary.md` — what may be inspected vs what may be reused.

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
