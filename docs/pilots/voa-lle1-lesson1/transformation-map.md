# Transformation map — VOA LLE1 Lesson 1 → SE self-study lesson

Maps every source-pack element into the normalized course. Sections are typed
by *function* (the USAL functional pipeline as a clean-room reference), not by
a mandatory fixed order — the source decides what exists.

| SE section (function) | Source elements used | What the learner does |
|---|---|---|
| `s-orient` (orient) | Lesson plan "Learning Strategy" + page topics | Read goals; write own goal (note) |
| `s-prepare` (prepare) | Key-words list (7 words), speaking-practice clip, alphabet/numbers plan segment | Vocabulary exposure, alphabet review video |
| `s-input` (input) | Main video (mp4 + YouTube embed fallback), conversation mp3, script text | Watch the VOA conversation; re-listen with transcript |
| `s-comprehension` (comprehension) | VOA quiz q1–q6 (video stems, verbatim options) | 6 scored multiple-choice items |
| `s-language-focus` (language-focus) | Lesson-plan "Explain Questions and Answers Using BE" + script BE lines; pronunciation clip | Read the BE explanation drawn from the conversation; record-and-compare |
| `s-practice` (practice) | Quiz items re-purposed as dictation (audio stems); plan cloze for BE | 3 dictations, 4 clozes — bounded attempts → reveal |
| `s-production` (production) | Plan speaking task + speaking-practice clip; plan Day-5 writing prompt (verbatim) | Record self-introduction (record/replay, unscored); write a modeled conversation |
| `s-reflect` (reflect) | Plan review goals (grammar, speaking, review, pronunciation) + key-words list | Learning-Log self-evaluations — self-report only |

## Classification decisions

- **Quiz items appear twice**: once scored as authored (comprehension), once
  re-purposed as dictation stems in `s-practice` — the audio is the same VOA
  asset; the function differs. Provenance: `derived` from the quiz assets.
- **Speaking is never scored**: the `record` item produces `practiced`
  evidence (local record → replay → re-record). No machine scoring is claimed.
- **Self-evaluation is self-report**: `selfeval` items feed channel 3 only.
- **Non-answerable types** (`read`, `media`, `note`, `write`, `record`,
  `selfeval`) resolve by progression (`done`/`practiced`) and never enter the
  formative score or the FSRS eligibility set.

## Scope preservation check

Complete source-defined scope retained: goals + strategy (plan), 7 key words,
speaking-practice video, alphabet/numbers review, main conversation video +
audio + script, 6-question quiz, BE language focus, pronunciation practice,
dictation/cloze practice, speaking production, writing task, learning-log
review. Nothing from the pack's pedagogical content was dropped; nothing
learner-facing was invented.
