# SE Lesson 001 — Meet Someone

Canonical educational specification. The JSON implementation
(`src/content/lessons/se-a1-meet-someone.lesson.json`) must match this.

Evidence bases:

- Content: `docs/research/lesson-001-source-comparison.md`
- Pedagogy: `docs/research/lesson-design-frameworks.md`
- Contract: `docs/curriculum/lesson-design-contract.md`
- Design audit: `docs/research/lesson-001-design-audit.md`
- Stage map: `docs/curriculum/lesson-001-stage-map.md`

## Identity

- Lesson id: `se-a1-meet-someone`
- Title: **Meet Someone**
- Authored by: Simple English (multi-source synthesis)
- Level: beginner (absolute / early A1)

## Learner

Absolute beginner, self-directed, no partner, no teacher. Vietnamese
support lines are allowed as SE-authored glue.

## Desired result (backward design — before activities)

Take part in a very short first-time meeting in English:

1. say hello
2. say their name
3. respond when another person introduces themselves

## Acceptable lesson-level evidence

1. First listen for gist, second listen with text support;
2. selects an appropriate response to "Nice to meet you." (controlled
   check, instant feedback);
3. produces the greeting/name/response frame aloud with their own name
   (self-practice; SE does not assess speech).

**Non-claims:** one completion does not prove retention, real-time
interaction with a live partner, pronunciation accuracy, or CEFR
proficiency. Completion copy is practice-bounded.

## Target language (all traced)

```
Hi.                        VOA (reused)
I'm + name.                VOA ("I'm Anna.", "I'm Pete.") + Forum chart ("I'm ______.")
Nice to meet you.          VOA
Nice to meet you, too.     English Teaching Forum chart (verbatim)
Good night.                AE verbatim (distractor; a farewell per AE notes)
I am Pete.                 VOA verbatim (distractor)
```

## Source components & roles

| sourceRef        | Source                                           | Role                                               | Use       |
| ---------------- | ------------------------------------------------ | -------------------------------------------------- | --------- |
| voa-lle1-welcome | VOA LLE L1 "Welcome!"                            | primary language model                             | adapted   |
| voa-lle1-audio   | VOA LLE L1 conversation MP3                      | listening input (local)                            | reused    |
| evergreen-ch1    | Evergreen ch.1 Grammar                           | I am→I'm contraction                               | adapted   |
| ae-introductions | AE Everyday Conversations                        | first-meeting usage note + "Good night" distractor | adapted   |
| ae-forum-trythis | English Teaching Forum, TRY THIS Role-Play Party | verbatim cloze starters + "Nice to meet you, too." | adapted   |
| pcc-greetings    | PCC Digital Workbook                             | exercise-mechanics reference                       | reference |

## Lesson stages (derived; see stage map for citations)

Planning: ACTFL Backward Design. Listening spine: BC
pre/while/post-listening. Practice: ARC Restricted → freer production.

1. **Outcome** — one sentence (SE glue).
2. **Pre-listening + gist question** — "Two people are talking. Is this
   their first time meeting? Listen." — a real overall-understanding
   task (situation/relationship, not detail; answer not pre-revealed).
   Evergreen True/False-style comprehension mechanic.
3. **First listen (gist)** — VOA MP3 (neutral title so the gist answer
   isn't leaked); transcript behind a `<details>` reveal.
4. **Gist check + re-listen** — "They meet for the first time. Now
   listen again and read the important parts…" — self-check answer,
   then detail focus.
5. **Chunks** — adapted VOA exchange (ARC Clarification).
6. **Response** — "Nice to meet you, too." verbatim from the English
   Teaching Forum Small-Talk Function Chart.
7. **Meaning notes** — "'I'm' means 'I am'." (Evergreen contraction) and
   "'Nice to meet you' is what people say when they meet someone for
   the first time." (AE note) — split so each block's provenance points
   at its actual source; no grammar table.
8. **Check** — MC "Anna says 'Nice to meet you.' What is a good
   answer?" — options: a. Forum-verbatim; b. "Good night." (AE
   verbatim, a farewell per its own notes); c. "I am Pete." (VOA
   verbatim). Instant correct/incorrect feedback.
9. **Your turn** — speak-aloud cloze "Hi, I'm ______. / Nice to meet
   you. / Nice to meet you, too." — Forum chart starters verbatim;
   honest solo self-practice.
10. **Completion** — practice-bounded statement + skills + honest note;
    CTA remains after all blocks.

## Media

- `public/media/voa-lle1-conversation.mp3` — 19.9 s, 159,737 B.
  Trimmed excerpt of the VOA conversation (meet-someone exchange only);
  rights: public domain, VOA Learning English policy.
- Evidence + SHA-256: `docs/sources/evidence/voa-lle1-conversation.json`
- Native `<audio controls preload="none">`; transcript in `<details>`
  (gist-first listening) — still readable if audio fails.

## Excluded content (unchanged)

- Spelling/alphabet/address, "How are you?", formal introductions,
  "Where are you from?", verb-BE tables, pronunciation intervention,
  VOA's video assets.

## Provenance model

`authoredBy` + `sourceRefs[]` + block `provenance` (reused/adapted/
se-authored); adapted/reused require a non-reference `use`; semantic
checks unchanged. The pedagogy rationale lives in the stage map —
deliberately not runtime schema.

## Completion semantics

- `statement`: "You practiced meeting someone in English."
- `skills`: "Say hello", "Say your name", "Respond to an introduction"
- `note`: honest bound — one practice session; real meetings need more
  practice (displayed in the completion panel).

## Progress reset

`pcc-esol-l1m1-greetings` remains removed and unmigrated (different
capability).
