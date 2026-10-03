# Simple English — Product Specification

Status: CANONICAL — LOCKED V1 FOUNDATION
Last updated: 2026-10-03

This document is the canonical product specification for Simple English. When
other project documents conflict with this file, this file wins.

## Governance

Core product philosophy, learning philosophy, reuse-first philosophy, and
canonical architecture principles may not be silently changed by
implementation work.

Changes to those principles require:

```text
explicit product decision
+
SPEC update
+
ADR when architectural
```

Implementation tasks are not permission to reinterpret the project
philosophy.

## 1. Identity

- **Name:** Simple English
- **Abbreviation:** SE
- **Repository:** `Thunderkill016/simple-english` (public)
- **Internal motto:** *Research first. Reuse first. Build only what matters.
  Keep learning simple.*

## 2. Product thesis

Simple English aims to make English learning simple and effective by
integrating existing proven knowledge and technology rather than recreating
solved problems.

SE exists because learning English — and building learning software — is often
made unnecessarily complicated. The project aggressively reuses decades of
existing:

- second-language acquisition research;
- ESL/EFL teaching knowledge;
- cognitive science;
- retrieval-practice research;
- spaced-learning research;
- comprehensible-input research;
- pronunciation research;
- vocabulary research;
- existing curricula;
- Open Educational Resources;
- public-domain materials;
- corpora;
- dictionaries;
- audio datasets;
- open-source software;
- browser standards;
- APIs;
- free infrastructure;
- mature libraries;
- existing AI models.

The goal is not "build everything ourselves." The goal is:

> Deliver the most effective and simple learning experience with the least
> unnecessary work and complexity.

SE does not receive extra credit for inventing something itself.

## 3. Principles

1. Research first.
2. Reuse first.
3. Evidence over novelty.
4. Simplicity over feature count.
5. Effectiveness over cleverness.
6. Open/free solutions first when they are good enough.
7. Build only what creates meaningful value.
8. Complexity belongs behind the interface.
9. Preserve licensing and provenance.
10. Don't reinvent curriculum without evidence that it is necessary.
11. Don't reinvent software infrastructure without evidence that it is
    necessary.
12. Performance is part of the product experience, not an optimization phase.
13. Local first: the network is not on the critical path of normal learning
    interactions.

## 4. Canonical decision test

Every proposed feature or subsystem must answer:

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

A proposal that cannot answer questions 1–2 concretely is not ready. A proposal
that skips questions 3–8 may not proceed to custom implementation.

## 5. Canonical workflows

### 5.1 Build-decision workflow

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

Do not start with coding by default.

### 5.2 Educational evidence hierarchy

Educational decisions prioritize, in order:

```text
Research evidence
↓
Systematic reviews / meta-analyses
↓
Established SLA / ESL practice
↓
Institutional educational resources
↓
High-quality OER
↓
Expert resources
↓
Community evidence
↓
AI hypothesis
```

AI intuition is not the source of truth for pedagogy. SE must not invent an
English curriculum from zero unless genuinely necessary.

### 5.3 Technology preference order

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

Custom implementation must be justified. SE does not build commodity systems
for engineering prestige.

Categories SE should generally reuse rather than reinvent:

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

## 6. Learning approach

### 6.1 Initial curriculum decision

The initial canonical beginner source for V1 is:

- **A Digital Workbook for Beginning ESOL** — Eric Dodson, Davida Jordan, Tim
  Krause; Portland Community College / Open Oregon Educational Resources;
  licensed **CC BY 4.0** (verified from source, 2026-10-03).
  <https://openoregon.pressbooks.pub/esol23/>

It is selected because it provides existing structured beginner ESOL material
with an open license suitable for adaptation.

Candidate secondary sources (see `docs/sources/` for registry status):

- **Portland People and Places** — Timothy Krause; PCC; **CC BY 4.0**
  (verified 2026-10-03); beginner graded-reader stories, Lexile ~300–500.
  <https://openoregon.pressbooks.pub/portlandpeopleandplaces/>
- **Green Tea Intermediate English Communication OER** — Eric Dodson, Luciana
  Diniz, Nanci Leiton; PCC / Open Oregon, 2020; **CC BY 4.0** (verified
  2026-10-03); low-to-mid intermediate.
- **American English / U.S. Department of State materials** — candidate only;
  reuse rights must be verified per item before any use. Government-produced
  materials are not automatically free of third-party restrictions.

### 6.2 Provenance caveat

OER books may embed third-party media (e.g., YouTube videos, stock images)
that are **not** covered by the book's own CC license. Per-item provenance
review is required during adaptation, not just book-level license checks.

### 6.3 Content principle

```text
trusted educational sources
        ↓
SE normalization layer
        ↓
consistent SE learning experience
```

SE's value is not owning every textbook. Its value is:

- selecting good material;
- adapting it well;
- simplifying access;
- creating a coherent experience;
- preserving progress;
- making review easy;
- integrating useful technology intelligently.

### 6.4 Content rule

**Free to access ≠ free to redistribute.** Every source requires explicit
licensing and provenance review before use. No bulk imports.

## 7. Product surface

Initial expected product surface (a direction, not permission to implement all
of it now):

- Today
- Learn
- Review
- Progress

The central product is the **learning experience**, not:

- dashboard;
- profile;
- settings;
- gamification;
- chatbot;
- social network.

The learner-facing flow should trend toward:

```text
Open
↓
Learn
↓
Practice
↓
Continue later
```

The learner should never have to understand the methodology or the system
architecture.

## 8. Simplicity rule

> **System complexity is acceptable. User complexity is not.**

Complexity may exist internally. It must not be transferred to learners.

## 9. Performance and local-first principles

Performance is not an optimization phase. It is part of the product
experience.

> **Normal learning interactions must feel immediate.**

> **The network must not be on the critical path of normal learning
> interactions unless the operation fundamentally requires a server.**

Expected behavior:

```text
answer exercise      → immediate
next step            → immediate
lesson navigation    → immediate
save local progress  → immediate
restore progress     → local first
cloud synchronization → asynchronous
```

Bad architecture:

```text
tap
↓
network request
↓
wait
↓
update UI
```

Preferred architecture:

```text
tap
↓
update UI
↓
persist locally
↓
background sync
```

Hard architectural rules (not targets — requirements):

- Exercise feedback must not await a network round trip.
- Learner state is written to the local database first; cloud sync is a
  background consequence, never a prerequisite.
- First-run learning works without an account and without network beyond the
  initial asset fetch.
- Cloud SDKs (auth, sync) are not in the initial bundle critical path; they
  load on demand when the learner opts into an account.

Measurement goals and budgets live in ADR-0002 and are enforced in CI as the
application is built.

## 10. V1 architecture direction

Validated in [ADR-0002](docs/adr/0002-v1-web-architecture.md) against official
documentation and primary sources:

```text
Frontend           React 19 + TypeScript + Vite 7
Routing            React Router — Declarative mode (not Data/Framework mode)
Styling            Tailwind CSS v4 (official Vite plugin)
Components         native/simple first; shadcn/ui selectively if needed
Content            versioned structured JSON validated by JSON Schema
                   at import/build time; served as static assets/CDN
Local persistence  IndexedDB via Dexie (canonical learner store)
Cloud              Firebase Auth + Cloud Firestore — background sync only
Hosting            GitHub (repo) + Vercel (static SPA hosting)
Testing            Vitest (unit) + Playwright (E2E)
```

The cloud layer is a synchronization/backup layer. It is not the learning
runtime and must never sit on the interaction path (see §9).

## 11. Non-goals

Do not start building:

- AI tutor chatbot;
- AI-generated curriculum;
- custom LLM;
- custom speech-recognition engine;
- giant mastery engine;
- knowledge graph;
- social network;
- leaderboard;
- virtual currency;
- store;
- achievements system;
- complex onboarding;
- avatar system;
- custom auth implementation;
- custom analytics infrastructure;
- microservices;
- Kubernetes;
- premature scaling infrastructure.

Complexity must be earned by a demonstrated requirement.

## 12. Source registry

SE maintains a registry of educational sources with licensing and provenance
metadata. Direction and record schema: [`docs/sources/README.md`](docs/sources/README.md).

The registry aligns with the existing **LRMI / schema.org LearningResource**
metadata standard rather than inventing a new one, extended with SE-specific
reuse-verification fields.

## 13. Licensing

Canonical statement: [`LICENSING.md`](LICENSING.md).

| Layer | License |
| --- | --- |
| SE source code | MIT (`LICENSE`) |
| SE-authored documentation and specifications | MIT (same repo license) |
| Third-party educational content | Retains its original license per the source registry |
| SE adaptations of third-party content | Governed by the original license's terms (e.g., CC BY 4.0 attribution; share-alike where applicable) |
| "Simple English" name / branding | Not licensed; all rights reserved |

Rationale:

- Creative Commons explicitly recommends against using CC licenses for
  software; an OSI-approved license is the correct tool for code.
- MIT is the simplest widely understood permissive license; it maximizes
  reuse, consistent with SE's philosophy. Apache-2.0 is the fallback if an
  explicit patent grant ever becomes necessary.
- Third-party educational content is never relicensed under MIT. Its
  attribution and license obligations are preserved via the source registry.
- Educational content is deliberately not mixed into the software license.

## 14. Status

V1 foundation locked. Architecture validated in ADR-0002. No product features
are implemented. Active research track: Issue R1 (wider reusable-ecosystem
audit + ongoing challenge of the accepted stack).
