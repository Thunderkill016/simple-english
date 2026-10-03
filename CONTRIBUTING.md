# Contributing to Simple English

SE is in the foundation/research stage. Contributions are welcome, but the
project deliberately moves slowly on implementation and quickly on research.

## Before proposing anything

1. Read [SPEC.md](SPEC.md) — it is the canonical specification.
2. Read [docs/principles/](docs/principles/) — product, learning, and
   reuse-first philosophy.
3. Read [docs/adr/0001-research-and-reuse-first.md](docs/adr/0001-research-and-reuse-first.md).

## The one rule that matters most

Before proposing a feature or building a subsystem, run the
**canonical decision test** (SPEC.md §4). In short:

> Has this problem already been solved well enough?

- If yes — reuse it.
- If partially — adapt it.
- If no — build the smallest missing piece.

Proposals that jump to custom implementation without answering the reuse
questions will be sent back to research.

## How to propose work

- **Research / audits** — open an issue with the *Research task* template.
- **Features / changes** — open an issue with the *Change proposal* template
  and answer the decision-test questions.
- **Small fixes** (typos, broken links, factual corrections with a citation) —
  a pull request is fine.

## Evidence standards

- Prefer official/primary sources when researching technologies.
- Prefer original educational sources (the resource itself, its publisher's
  license page) when researching learning material.
- Do not use SEO summaries as primary evidence when original sources exist.
- Do not assert licenses or reuse rights you have not verified. Free to access
  is not free to redistribute.

## Licensing of contributions

- Code and documentation contributions are licensed under the repository's
  [MIT license](LICENSE).
- Third-party educational content keeps its original license and must be
  recorded in the source registry with attribution — it is never relicensed.
- Do not submit content you do not have the right to contribute.

## Keep it simple

No premature abstractions, no speculative features, no giant scaffolding. When
in doubt, do less and document why.
