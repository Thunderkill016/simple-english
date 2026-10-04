# SE Lesson 001 — Meet Someone

> **DEPRECATED (ADR-0003, Task 006).** This document specified an SE-authored
> lesson. Under the source-driven model, SE does not author curriculum — it
> normalizes human-authored source packs. Retained for history only; the
> active content model is `src/content/schema/lesson-v3.schema.json` and the
> pilot is `src/content/lessons/voa-lle1.lesson1.lesson.json`.

~~Canonical educational specification.~~ (Former canonical spec — see above.)

## Identity

- Lesson id: `se-a1-meet-someone` (SE-owned; no source name in the ID)
- Title: **Meet Someone**
- Authored by: Simple English (multi-source synthesis)
- Level: beginner (absolute / early A1)

## Capability

The learner can meet someone for the first time in English:

1. say hello
2. say their name
3. respond when another person introduces themselves

## Success criteria

- Chooses the natural response to "Nice to meet you." (controlled task)
- Speaks the frame "Hi, I'm ___." + "Nice to meet you (too)." aloud
  with their own name (production + transfer)
- Completion copy: "You can meet someone in English." listing the three
  practiced sub-skills — no XP, no celebration animation.

## Target language (survived the comparison)

```
Hi.
I'm + name.            (e.g. "I'm Anna.", "I'm Pete.")
Are you + name?
Nice to meet you.
Nice to meet you too.
```

"I'm" = "I am" is the only grammar note — the minimum needed to say a
name (§34 compliance: no verb-BE table).

## Source components & roles

| sourceRef | Source | Role in this lesson | Use |
|---|---|---|---|
| voa-lle1-welcome | VOA Let's Learn English L1, Lesson 1 "Welcome!" | primary language model + listening audio | adapted / reused (MP3) |
| evergreen-beginning-ls | Evergreen Valley "Listening & Speaking…" ch.1 | lesson staging pattern | reference |
| pcc-esol-digital-workbook | PCC Digital Workbook for Beginning ESOL | exercise mechanics | reference |
| ae-everyday-conversations | American English, Everyday Conversations | naturalness benchmark | reference |

USA Learns and Oxford Online English were compared and rejected
(reference-only rights) — they appear in the comparison document only.

## Lesson stages (evidence-based order)

Evergreen's staging was adapted for self-study: activation becomes a
one-line goal, pair work becomes a solo speak-aloud step.

1. **Goal** — one sentence telling the learner what they will be able to
   do (SE-authored).
2. **Model — listening** — VOA conversation MP3 (29.6 s, reused,
   hosted locally) with its full transcript. The audio is authentic
   input; it intentionally runs a few lines past the target exchange —
   the transcript is shown in full. Replaying is the listening practice.
3. **Model — target chunks** — the core exchange extracted as the
   readable model (adapted from the VOA dialogue; "too" response
   confirmed via the American English informal-introductions usage);
   Vietnamese support line (SE-authored); the single "I'm = I am" note.
4. **Controlled practice** — one multiple-choice item:
   "Anna says 'Nice to meet you.' What is a good answer?" →
   "Nice to meet you too." vs "Good night." and "I am Pete."
   (SE-authored; PCC-style instant feedback via the existing Exercise
   surface.)
5. **Production + transfer** — speak-aloud frame with the learner's own
   name filling the blank:
   "Hi, I'm ______. / Nice to meet you. / Nice to meet you too."
   This transfers the pattern off the Anna/Pete model onto the learner
   (SE-authored). It is honest practice — SE does not assess speech.

Rationale for exactly one interactive check: the multiple-choice state
is stored per-lesson (`progress.selectedAnswer`); supporting several
graded items needs a schema/persistence change. A single check that
tests the capability's response step plus an ungated production step is
the smallest defensible design — multi-item progression is deferred to
a future lesson that actually needs it.

## Media

One asset only:

- `public/media/voa-lle1-conversation.mp3` — VOA Lesson 1 conversation
  audio, 29.6 s, 64 kbps MP3, 236,944 bytes.
- Original: `https://voa-audio.voanews.eu/vle/2016/02/08/49485bf8-4277-47f6-9abe-617ee2473f8c.mp3`
- Rights basis: public domain — VOA Learning English policy
  (https://learningenglish.voanews.com/p/6861.html); VOA-produced
  (VOA byline + VOA CDN host), no agency material.
- Evidence + SHA-256:
  `docs/sources/evidence/voa-lle1-conversation.json`
- Delivered via a native `<audio controls preload="none">` — no player
  library; transcript stays readable if audio fails or is offline.

## Excluded content (with reasons)

- Name spelling / alphabet / address (inside the VOA dialogue) —
  different capability.
- "How are you?" / "Fine, thank you." — deferred to a later lesson;
  intentionally removed although the previous lesson taught it.
- Formal introductions ("It's a pleasure to meet you", introducing a
  third person), "Where are you from?", email/phone exchange.
- VOA's 5:00 main video and its speaking/pronunciation videos — media
  budget: one focused asset beats a pile of optional players.
- Grammar table for verb BE.
- Pronunciation intervention — deferred; the replayable short model +
  speak-aloud is the smallest useful dose for this target.

## Provenance model

- `authoredBy`: "Simple English"
- `sourceRefs[]`: the four rows above; `reference` sources influence
  structure/wording choices but contribute no copied content.
- Block provenance:
  - audio block → `reused` → voa-lle1-welcome
  - target-chunk example block → `adapted` → voa-lle1-welcome
  - everything else (goal, instructions, MC item, production frame,
    all Vietnamese) → `se-authored`
- Validation: REFERENCE_ONLY refs cannot back a `reused`/`adapted`
  block; `se-authored` blocks carry no sourceRef; audio media must have
  an evidence file with matching SHA-256 (build-time check).

## Completion semantics

`completion.statement`: "You can meet someone in English."
`completion.skills`: "Say hello", "Say your name",
"Respond to an introduction".

## Progress reset

`se-a1-meet-someone` replaces `pcc-esol-l1m1-greetings` as the canonical
Lesson 001. The old lesson taught a different capability; its Dexie
completion row is **not** migrated — it is ignored (orphaned rows
render nothing since the lesson no longer exists in the curriculum).
No migration code is written.
