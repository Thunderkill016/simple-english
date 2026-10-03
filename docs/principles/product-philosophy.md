# Product philosophy

> **Simple English is a simple, evidence-informed English-learning product
> built by intelligently reusing the best existing educational knowledge, open
> content, software, open-source projects and free technology instead of
> rebuilding solved problems from scratch.**

Internal motto: *Research first. Reuse first. Build only what matters. Keep
learning simple.*

This philosophy is load-bearing. Do not dilute it.

## Why SE exists

Learning English — and building learning software — is often made
unnecessarily complicated. SE exists to do the opposite: combine what already
works into the simplest effective learning experience possible.

The goal is not:

> Build everything ourselves.

The goal is:

> Deliver the most effective and simple learning experience with the least
> unnecessary work and complexity.

SE does not receive extra credit for inventing something itself.

## Simplicity rule

> **System complexity is acceptable. User complexity is not.**

Complexity may exist internally — adapting sources, tracking provenance,
scheduling review. It must not be transferred to learners.

The learner-facing experience should trend toward:

```text
Open
↓
Learn
↓
Practice
↓
Continue later
```

The learner should not have to understand the methodology or the system
architecture.

## Product surface

Initial expected product surface (direction, not permission to implement it
all now):

- **Today** — what to do now.
- **Learn** — the learning material itself.
- **Review** — retention/practice of what was learned.
- **Progress** — minimal evidence that learning is working.

The central product is the **learning experience**, not dashboards, profiles,
settings, gamification, chatbots, or social features.

## Non-goals

See [SPEC.md §9](../../SPEC.md). In short: no AI tutor chatbot, no generated
curriculum, no custom LLM, no gamification economy, no social network, no
custom auth/analytics, no premature infrastructure. Complexity must be earned
by a demonstrated requirement.
