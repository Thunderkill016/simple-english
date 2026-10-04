# Source pack — VOA Let's Learn English Level 1, Lesson 1 ("Welcome!")

Canonical page: <https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html>
Machine-readable inventory: `src/content/sourcepacks/voa-lle1-lesson1.sourcepack.json`
(reproducibly generated + fragment-verified by `scripts/build-sourcepack.mjs`)

## Asset inventory (14)

| # | Asset | Type | Rights | Third-party | Local copy |
|---|-------|------|--------|-------------|------------|
| 1 | Lesson plan PDF (Day 1–5 teacher plan) | document | reusable · VERIFIED | NONE_OBSERVED | embedded `sourceText` |
| 2 | Lesson 1 learner page | page | reusable · VERIFIED | PRESENT (YouTube embed, chrome) | embedded `sourceText` |
| 3 | Main video (~5:00) | video | reusable · VERIFIED | NONE_OBSERVED | `public/media/voa-lle1/voa-lle1-main-video.mp4` |
| 4 | Conversation audio (0:29) | audio | reusable · VERIFIED | NONE_OBSERVED | `public/media/voa-lle1/conversation.mp3` |
| 5 | Speaking-practice video (2:27) | video | reusable · VERIFIED | NONE_OBSERVED | `public/media/voa-lle1/voa-lle1-speaking-practice.mp4` |
| 6 | Pronunciation video (0:29) | video | reusable · VERIFIED | NONE_OBSERVED | `public/media/voa-lle1/voa-lle1-pronunciation.mp4` |
| 7–12 | Quiz question clips q1–q6 | video | reusable · VERIFIED | NONE_OBSERVED | `public/media/voa-lle1/voa-lle1-quiz-q{1..6}.mp4` |
| 13 | Alphabet-song YouTube embed | embed | embed-only · THIRD_PARTY | PRESENT (entire asset) | never ingested |
| 14 | Activity Sheets (referenced) | document | reference · UNVERIFIED | UNKNOWN | not located — GAP |

Rights evidence for every reusable asset: the official VOA copyright
statement at <https://learningenglish.voanews.com/p/6021.html> — "All text,
audio and video material produced exclusively by the Voice of America is in
the public domain" (credit required; the same page notes the third-party
carve-out). Verified 2026-10-03.

## Fragment layer (88 fragments)

Every instructional field in the lesson cites a **fragment**: a verbatim,
normalized-contiguous substring of a text asset's `sourceText`, sha256-pinned
(`exactTextHash`), and audience-classified:

| Audience | Count | May back |
|---|---|---|
| METADATA | 33 | titles, goal/topic display, self-eval statements |
| LEARNER | 19 | any field — scripts, definitions, prompts, models |
| ASSESSMENT | 31 | scored items only — quiz/dictation stems, prompts, options |
| TEACHER | 5 | `gap` refs only — never learner-facing |

The generator re-verifies every fragment's containment on each run; the build
gate re-verifies containment + hashes again at validation time.

## Integrity (SHA-256)

```
d3ee8a7f52615988b98f1e4addacaee35b0486cd6c8d8e7a08cf32b65a123b  conversation.mp3  (prefix d3ee…; full hash in sourcepack JSON)
a7bc9ee8405a07196a162e87fe68b52071c4c576289dc03840d9d4bfd97dce98  voa-lle1-main-video.mp4
5b280b0ab61b432d3f94e1e28b585083719786056e6f0e11e7a5fba09bc89c30  voa-lle1-pronunciation.mp4
3e0735627a2ffa7357a79a458d2f547af909acb43c28fe7802abdcc33daa36fe  voa-lle1-quiz-q1.mp4
d6928e2eaef54193f8d2bc3dbda9b215d73ff7f3b1b94be13f298d31f517d419  voa-lle1-quiz-q2.mp4
86fa266e48b955b9e0d1ce4d9ab9cbab1ea6a87f2a6288385767bb5f597895bf  voa-lle1-quiz-q3.mp4
b2ecd1558c23d4b83a103dcfda6933e6fedae901f44ac440661525fd023898a9  voa-lle1-quiz-q4.mp4
1b66dcdfef809b69e09d1c258b389373c4e0f1d86071b8a33a90180839c73016  voa-lle1-quiz-q5.mp4
902fda2aae1d39b5d0f4a0d5cbe0763471523a5d4f2bd32d36015d11325a108e  voa-lle1-quiz-q6.mp4
b5f4fe7107ad537c897ad5a171d114928159348202e89e3e7f554be05d58a519  voa-lle1-speaking-practice.mp4
```

Authoritative hashes live in the sourcepack JSON — the build verifies every
declared `local` file's SHA-256 against disk (`pnpm validate:content`).

## What was deliberately NOT extracted

- Page chrome, navigation, ads, unrelated lessons.
- Teacher-voice plan text is extracted as TEACHER-audience fragments but is
  **never shown to learners**: the three fields that would have needed it are
  withheld as GAP dispositions (`editorial-packet.md`), rendering no
  instructional English until a human editor approves learner-facing wording.
- The alphabet-song video is referenced embed-only; the plan's "Activity
  Sheets" file could not be located and is recorded as a GAP rather than
  substituted.
