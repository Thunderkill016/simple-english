# Reuse-first engineering

## The mandatory question

Before building anything, ask:

> **Has this problem already been solved well enough?**

- If yes — **reuse it.**
- If partially — **adapt it.**
- If no — **build the smallest missing piece.**

Do not start with coding by default.

## Canonical workflow

```text
Define problem
↓
Research existing knowledge
↓
Search existing solutions
↓
Search open-source / free alternatives
↓
Check quality
↓
Check license
↓
Check maintenance/security
↓
Reuse / integrate / adapt
↓
Only build missing functionality
```

## Technology preference order

```text
Web standards / native browser capabilities
↓
Existing high-quality open-source
↓
Existing free solution
↓
Generous free-tier managed service
↓
Low-cost existing solution
↓
Custom implementation
```

Custom implementation must be justified through the canonical decision test
([SPEC.md §4](../../SPEC.md)). SE does not build commodity systems for
engineering prestige.

## What SE should generally reuse

Examples of categories where custom implementation needs strong evidence:

- authentication;
- database;
- deployment;
- analytics;
- speech recognition;
- audio playback infrastructure;
- UI primitives;
- test runners;
- browser automation;
- build tooling;
- monitoring;
- storage;
- generic CMS capabilities.

## When building is justified

Custom implementation is acceptable when at least one of these holds:

- no existing solution meets the requirement;
- the existing options have security or privacy problems;
- licensing prevents reuse;
- vendor lock-in is unacceptable;
- cost is unacceptable;
- the solution is poorly maintained;
- integration cost exceeds a small custom implementation;
- the functionality is genuinely core differentiation for SE.

Even then: build the **smallest** missing piece, and record the reasoning in
an ADR.
