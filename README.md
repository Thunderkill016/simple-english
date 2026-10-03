# Simple English (SE)

A project to make effective English learning radically simpler.

## What is Simple English?

Simple English is an English-learning product built on one core idea: **reuse
the best existing knowledge and technology instead of rebuilding solved
problems.**

## What makes it different?

SE does not attempt to recreate decades of language-learning research or
rebuild technology that already works. It combines:

```text
proven educational knowledge
+ quality open learning material
+ existing open/free technology
+ carefully designed UX
```

The goal is the most effective and simple learning experience with the least
unnecessary work and complexity.

## Principles

- **Research first.** Educational decisions start from evidence, not intuition.
- **Reuse first.** If a problem is already solved well enough, reuse it.
- **Simplicity over feature count.** Complexity belongs behind the interface.
- **Effectiveness over novelty.** SE gets no extra credit for inventing things
  itself.

Internal motto: *Research first. Reuse first. Build only what matters. Keep
learning simple.*

## Current status

**Foundation stage — local-first slice with first real lesson.** The app
serves one adapted lesson ("Greetings: How are you?", from PCC's
*A Digital Workbook for Beginning ESOL*, CC0 — see `docs/sources/`), plus a
synthetic fixture used by tests. A learner can answer an exercise and
completion persists locally (IndexedDB) across reloads — no account, no
backend. It proves the architecture in ADR-0002, not the product. See the
open `R1` issue for the ongoing research track.

## Local development

Requires Node.js ≥ 20.19 and pnpm ≥ 10.

```bash
pnpm install          # install dependencies
pnpm dev              # dev server
pnpm test             # unit tests (Vitest)
pnpm validate:content # validate lesson content against JSON Schema
pnpm build            # typecheck + content validation + production build
pnpm test:e2e         # build + Playwright end-to-end tests
```

## Documentation

- [SPEC.md](SPEC.md) — canonical product specification
- [docs/principles/](docs/principles/) — product, learning, and reuse-first
  philosophy
- [docs/adr/](docs/adr/) — architecture decision records
- [docs/sources/](docs/sources/) — educational source registry direction
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to contribute

## License

- SE source code and SE-authored documentation: [MIT](LICENSE)
- Third-party educational content retains its original license (e.g., CC BY
  4.0) and is tracked in the source registry.
- The "Simple English" name and branding are not covered by the license grant.

Canonical licensing rules: [LICENSING.md](LICENSING.md) — see also
[SPEC.md §13](SPEC.md) and [docs/sources/](docs/sources/).
