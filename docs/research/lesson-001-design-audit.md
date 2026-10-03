# Lesson 001 Design Audit — current `se-a1-meet-someone`

Stage-by-stage audit of the merged lesson (head `a6eab7a`) against the
lesson-design contract (`docs/curriculum/lesson-design-contract.md`)
and the pedagogy evidence (`docs/research/lesson-design-frameworks.md`).

Desired result (kept, re-worded as backward-design outcome):

> Take part in a very short first-time meeting: say hello, say your
> name, give a friendly response to an introduction.

Acceptable evidence inside this single lesson:

1. hears the model meeting and can re-encounter it with support;
2. selects an appropriate response to "Nice to meet you." in a
   controlled check;
3. produces the greeting/name/response aloud with their own name.

This evidence DOES prove: the learner engaged the target exchange,
comprehended its shape, and produced the frame once. It does NOT prove:
retention tomorrow, real-time use with a live partner, pronunciation,
or proficiency. Completion wording is bounded accordingly.

## Audit table

| Current stage | Pedagogy evidence | Content evidence | Problem | Decision |
|---|---|---|---|---|
| Intro text — "In this lesson you learn to meet someone…" | ACTFL desired results visible; BC pre-listening motivation/context | SE-authored glue (allowed) | Does not contextualize the listening or give a reason to listen | **MODIFY** — keep outcome line; add context+gist prompt before audio (Rule 7) |
| Heading "Listen: Anna and Pete meet" | — | UI glue | Fine | **KEEP** (retitled to match first-listen purpose) |
| Audio block (19.9 s VOA MP3, transcript always visible) | BC while-listening requires gist task; transcript-visible-first defeats "just listen" | reused VOA asset + verbatim transcript ✓ | Transcript visible on first listen undermines gist listening (Rule 8); no stated listening purpose | **MODIFY** — instruction says listen first; transcript moves behind a `<details>` reveal (stays available, never removed — accessibility + fallback) |
| Text "Listen two or three times. Then read the important parts…" | Rule 8 — repeated listening with purpose | SE-authored glue | Vague purpose; merges listen-again with chunk reading | **MODIFY** — split purposes: re-listen-and-read instruction after first listen |
| Example chunks "Hi! I'm Anna. / I'm Pete. Nice to meet you." | ARC Clarification; Rule 9 language-after-meaning | adapted VOA ✓ | Correct | **KEEP** |
| Example "— Nice to meet you too." | — | **NONE — flagged.** Not in VOA audio | Learner-facing English without a source | **MODIFY** — re-classify `adapted` → American English: AE dialogues attest the response pattern "…, too" ("Pleasure to meet you, too" formal; "You, too" informal) to "Nice to meet you"; documented composition |
| Text "'I'm' means 'I am'. … 'Nice to meet you' is what people say when they meet someone for the first time." | ARC Clarification; Rule 9 | **PARTIAL** — Evergreen 1.3 attests I am→I'm contraction; AE language note attests "Nice to meet you" as the first-meeting formula | Marked se-authored though the explanation restates sourced facts | **MODIFY** — reword to stay close to source content; classify `adapted` → evergreen-ch1 (+AE note documented in stage map) |
| MC "Anna says 'Nice to meet you.' What is a good answer?" + options | ARC Restricted use; Rule 10; Evergreen "choose the phrase that answers" mechanic; ACTFL feedback | Options: correct=AE attested pattern; "Good night."=AE verbatim (its notes say it's a farewell, not a greeting); "I am Pete."=VOA verbatim | Exercise composed by SE — honest but under-documented | **KEEP** — block stays `se-authored`; per-option sources documented in stage map |
| "Your turn" heading + "Say it out loud. Use your own name" | Rule 11 transfer; Evergreen "complete with your own information" pattern | SE-authored instruction glue | — | **KEEP** |
| Production frame "Hi, I'm ____. / Nice to meet you. / Nice to meet you too." | Rule 11; ACTFL meaningful use | Frame = Evergreen-style own-info cloze; lines = VOA/AE chunks | Marked se-authored though it's sourced chunks in a sourced frame | **MODIFY** — classify `adapted` → evergreen-ch1 frame (+documented composition) |
| Completion "You can meet someone in English." + 3 skills | Rule 4 violated — one attempt doesn't ground "you can" as real-world ability | SE-authored | Overstates evidence | **MODIFY** — statement → practice-bounded wording + honest note |
| Feedback "Correct — '…'" / "Not quite — try again." | ACTFL effective feedback | UI strings | Minimal = correct by design | **KEEP** |
| Completion CTA after last block | sequencing fix already accepted | — | — | **KEEP** (accepted fix, no regression) |

## Summary of decisions

- **Keep:** audio asset/transcript content; chunk example; MC item and
  options; "Your turn" mechanic; feedback strings; CTA ordering;
  provenance disclosure UI.
- **Modify:** pre-listening purpose text; transcript reveal timing;
  post-listen instruction; provenance classes of three blocks; completion
  statement + new honest note.
- **Remove:** nothing — current lesson already stays small; the audit
  finds provenance *misclassification*, not content bloat.
- **Add:** gist-purpose line before audio (Rule 7); optional
  `completion.note` field (Rule 4 needs a place to state the bound).

## Learner-facing English items — traceability after rebuild

| Item | Status |
|---|---|
| "Hi!", "I'm Anna.", "I'm Pete.", "Nice to meet you.", "I am Pete." | VOA (reused/adapted) ✓ |
| "Nice to meet you too." | adapted — AE response pattern documented ✓ |
| "Good night." | AE verbatim + AE note that it is a farewell ✓ |
| "I'm" = "I am" explanation | adapted — Evergreen contraction table ✓ |
| Frame "Hi, I'm ____." | adapted — Evergreen own-information cloze ✓ |
| Outcome text, instructions, gist prompt, headings, translations, MC prompt | SE-authored glue — allowed category, flagged ✓ |
