# Source pack — VOA Let's Learn English Level 1, Lesson 1 ("Welcome!")

Canonical page: <https://learningenglish.voanews.com/a/lets-learn-english-level-1-lesson-1-welcome/4566771.html>
Machine-readable inventory: `src/content/sourcepacks/voa-lle1-lesson1.sourcepack.json`

## Asset inventory

| # | Asset | Type | Rights | Human authorship | Local copy |
|---|-------|------|--------|------------------|------------|
| 1 | Lesson 1 page (script, quiz text, key words) | page | reusable | VOA Learning English (US federal work) | extracted text |
| 2 | Lesson plan PDF (Day 1–5 teacher plan) | document | reusable | VOA Learning English | extracted text |
| 3 | Main video (~5:00, 360p) | video | reusable | VOA | `public/media/voa-lle1/voa-lle1-main-video.mp4` |
| 4 | Conversation audio | audio | reusable | VOA | `public/media/voa-lle1/conversation.mp3` |
| 5 | Pronunciation video | video | reusable | VOA | `public/media/voa-lle1/voa-lle1-pronunciation.mp4` |
| 6–11 | Quiz question clips q1–q6 | video | reusable | VOA | `public/media/voa-lle1/voa-lle1-quiz-q{1..6}.mp4` |
| 12 | Speaking-practice video | video | reusable | VOA | `public/media/voa-lle1/voa-lle1-speaking-practice.mp4` |
| 13 | YouTube embed (same main video) | embed | embed-only | VOA | link only |

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

## Rights reasoning

VOA Learning English content is produced by the U.S. federal government
(VOA); the video/audio files and lesson text are treated as reusable U.S.
government works for this pilot (per-asset verification recorded in the pack).
The YouTube copy of the main video is kept **embed-only**: a separate
distribution channel with its own terms — the packaged mp4 is used instead.

## What was deliberately NOT extracted

- Page chrome, navigation, ads, unrelated lessons.
- Teacher-voice plan text that addresses teachers ("they can…") is kept only
  where the plan itself is the instructional source (e.g. the Day-5 writing
  prompt), marked verbatim with `prov.note`.
