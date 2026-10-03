# ADR 0001 — Research and reuse first

- Status: Accepted
- Date: 2026-10-03

## Context

Simple English is a new English-learning product. Two temptations threaten it
from day one:

1. **Pedagogical invention** — writing a curriculum or learning methodology
   from scratch, when decades of SLA research, ESL/EFL practice, and open
   educational resources already exist.
2. **Engineering invention** — building custom infrastructure (auth,
   analytics, spaced repetition, speech tools, CMS, deployment), when mature
   open-source and free solutions already solve these problems.

Both produce unnecessary work, more code to maintain, and — worse — a worse
product, because self-built substitutes are usually weaker than mature,
field-tested alternatives.

## Decision

SE will research and reuse suitable existing knowledge, standards, libraries,
services, datasets, educational resources and open-source implementations
**before** authorizing any custom development.

Before building anything, the question is:

> Has this problem already been solved well enough?

- If yes — reuse it.
- If partially — adapt it.
- If no — build the smallest missing piece.

## Why

- Learning science and curriculum design are solved far better by existing
  research and OER than by ad-hoc invention.
- Commodity software (auth, storage, deployment, testing) is a liability to
  own, not an asset.
- Reuse shortens the path to a working learning experience, which is the only
  place SE creates unique value: selection, adaptation, normalization, and a
  simple learner experience.

## Benefits

- Less code to write, maintain, and secure.
- Faster path to a real product.
- Educational quality inherits from proven sources instead of unvalidated
  guesses.
- Engineering effort concentrates on the parts that are actually
  differentiating.

## Costs

- Research takes time before code is written; this is intentional, not a
  defect.
- Reused components impose their own constraints (APIs, licenses, data
  models) that SE must adapt to.
- Dependency and service choices create ongoing maintenance/monitoring
  obligations.
- A reused solution may be "good enough" rather than perfect for a specific
  need — that trade-off is usually acceptable per the decision test.

## Exceptions

Custom implementation is allowed when at least one holds:

- no existing solution meets the requirements;
- security or privacy problems rule out existing options;
- licensing prevents reuse;
- unacceptable vendor lock-in;
- unacceptable cost;
- poor maintenance of the existing solution;
- integration cost exceeds a small custom implementation;
- the functionality is genuinely core differentiation.

Exceptions require explicit justification through the checklist below, and
non-trivial exceptions should be recorded as ADRs.

## Decision checklist

Every proposed feature or subsystem must answer (canonical version:
[SPEC.md §4](../../SPEC.md)):

1. What user/learning problem does this solve?
2. What evidence shows the problem matters?
3. What existing solutions already address it?
4. Is there an open-source solution?
5. Is there a free solution?
6. Can we reuse a web standard?
7. What are the license constraints?
8. What are the maintenance/security risks?
9. Why is custom implementation necessary?
10. Can the solution be simpler?
