# USA Learns — System Deep Dive (R1.4A)

Status: REFERENCE_ONLY (Sacramento County Office of Education, ©2021+;
platform and content copyrighted). Clean-room observation only — behavior,
information architecture, state transitions, and mechanics documented.
No code, copy, media, or layout was or may be reused.

Method: free research account registered via Playwright (self-serve email +
image captcha, NO email verification gate, instant access). Courses
enrolled: 1st English Course + English 1 Plus. Flows exercised live:
registration → course menu → unit menu → lesson menu → activity menu →
unscored intro activities → scored exercise (full attempt lifecycle) →
video activity → speaking activity → lesson-end state → unit review →
student-home resume → 390px mobile viewport.

External validation used: official how-to-study doc, official Scope &
Sequence PDF (`/Content/Documents/ScopeSequence.pdf`), OTAN course-launch
article, LINCS resource profile (US DoE).

EVIDENCE PROVENANCE (Correction C): LIVE OBSERVATION = Playwright-driven
research account, 2026-10-03. OFFICIAL DOC = usalearns.org pages/PDFs.
EXTERNAL REVIEW = LINCS profile + OTAN article — they describe the
site/courses generally, not a current line-by-line E1+ audit.

---

## 1. Course catalog (observed at student-home)

7 courses: 1st English Course (low-high beginner, NRS 2-3), English 1
Plus (beginning-high/intermediate-low, VOA-based bridge), 2nd English
Course (intermediate, NRS 4-5), Practice English & Reading, U.S.
Citizenship, Skills for the Nursing Assistant, Access America.

All courses share ONE engine: identical menu tables, ✓/Score columns,
attempt mechanics, feedback strings. English 1 Plus was built later
(OTAN) by feeding VOA content into the same system — proof the engine
is content-agnostic.

## 2. Information architecture — one rigid hierarchy everywhere

```text
STUDENT HOME
└── Course card
    └── UNIT MENU          (numbered units, ✓ + Score columns)
        └── LESSON MENU    (numbered lessons, ✓ + Score columns)
            └── ACTIVITY MENU (named sections → numbered activities,
                               ✓ + Score columns)
                └── ACTIVITY  (paginated screens "N of M",
                               Back/Next + per-segment media controls)
```

- Every level is a server-rendered page (ASP.NET MVC, GUID-keyed URLs
  like `/learning/units/{classRegistrationId}/{unitId}`).
- Breadcrumb header on activity pages: `Course > Lesson > Menu`.
- "Menu" link top-right always returns to the parent list.
- Activity = the smallest tracked unit. A lesson is ONLY a grouping;
  all state lives at activity level.
- Activities contain 1..N screens (pager "N of M"); screens can be text,
  audio-text, video embed, exercise item, or self-eval prompt.

### Counts observed

- 1st English Course: 20 units. Unit 1 = 3 lessons (Introduction &
  Vocabulary / Language Practice / Review and Quiz). Lesson 1 =
  8 activities in 2 sections.
- English 1 Plus: 5 units × 6 lessons (5 content + Unit Review).
  Lesson 1.1 = 21 activities in 8 sections. Review lesson 1.6 =
  10 activities in 5 sections.
- 1st Course totals (official): 192 lessons, 600+ activities.
- Scoring coverage: ~7 of 21 activities scored in E1+ 1.1; the rest
  are — (never scored) by design. Unscored ≠ optional: they carry the
  input/instruction.

## 3. State machine (observed live + official docs)

Tracked per activity per learner, server-side:

| State | Icon | Semantics |
|---|---|---|
| NOT_STARTED | empty square | never entered |
| IN_PROGRESS | half square | entered, not finished |
| COMPLETE | full square | finished (all screens/items) |

Score column is ORTHOGONAL to completion:

- `—` = activity never scored (reading, video, speaking, self-eval)
- `•` = will be scored on completion
- `NN%` = last/best percentage (observed: Meaning Match 22% → still
  marked FULL)

CONFIRMED LIVE: completing a scored activity at 22% marks it COMPLETE.
The 80% threshold is ADVISORY only ("if less than 79%, you should do
the activity again" — official how-to-study). Completion ≠ mastery is
not just tolerated, it is the designed model.

HALF state triggers on ENTRY (observed: opened an activity, left via
Menu without finishing → half square). Re-entering a half activity
RESTARTS it at item 1 with a new `ActivityAttemptIdentity` — resume
granularity is the ACTIVITY, not the item/screen.

### Attempt model (from hidden form fields — confirmed in DOM)

```text
ActivityAttemptIdentity   (new GUID per activity entry)
ActivityItemIdentity      (per exercise item)
PermittedAttempts = 2     (observed in every scored activity type)
ActualAttempts            (server-side failed-attempt count)
ScoreDenominator = 100
ExpectedInput = Guid      (choice-type items)
```

### Feedback cycle (observed verbatim)

- Correct → "Correct! Now press Next." (Next reveals)
- Wrong, attempts remain → "Incorrect. Try again." (Check stays,
  Next hidden)
- Wrong at attempt limit → "See the correct answer above." (correct
  option highlighted, Next appears)
- Unscored → no Check at all; Listen/record + Next only

## 4. Session & resume model (observed)

- STUDENT HOME for enrolled courses offers exactly three actions:
  **"Go to my next activity"** (resume) / "Select a different unit" /
  **"Start over"** (reset).
- "Go to my next activity" deep-links `begin-activity` for the FIRST
  INCOMPLETE activity in linear order. Observed: it targeted the
  half-finished Listening Match — i.e. resume = next-incomplete
  pointer, not last-visited.
- Chaining: Next at an activity's last item jumps straight into the
  NEXT activity (no interstitial score screen between activities).
- Official doc: lesson-end page shows score + next-action choice;
  80% rule is advisory text, not a gate.
- No due-review queue, no spaced scheduling, no session sizing, no
  timeboxing anywhere. Linear progression entirely learner-driven.
- "Start over" = explicit full reset (destructive reset offered as a
  normal action).

## 5. Activity type taxonomy (observed)

| Type | Pattern | Scored |
|---|---|---|
| Text+audio read | segmented text, per-paragraph Listen (MP3) | — |
| Video watch | YouTube iframe embed (`rel=0&enablejsapi=1`) | — |
| Learning Goals | text list of unit objectives | — |
| Meaning Match | picture → pick word (radio×4) | • |
| Listening Match | Listen → pick matching picture | • |
| Check Understanding | comprehension Q + Listen reads Q aloud | • |
| Learn Key Words | word cards: image+word+audio | — |
| Listen for it | hear word/sentence → identify | • |
| Grammar presentation | rule + examples + Listen | — |
| Grammar practice | sentence items, 2 attempts | • |
| Dictation | Listen → type full sentence w/ caps+punct | •/— |
| Complete the Sentence | cloze | • |
| Find Correct Sentences | pick the well-formed sentence(s) | • |
| Complete the Conversations | dialogue cloze | • |
| Notice the Language | 3-screen noticing explainer from story | — |
| Read about it! | leveled text + Listen-while-read | — |
| Say it! / Pronounce | Listen model → Speak (record) → Playback | — |
| Your Turn | scripted speaking prompts, self-review | — |
| Learning Log | check "words I know" + can-do statements | — |
| Unit test/quiz (1st course) | "Review and Quiz" lesson | • |

Input controls: radio choice, text input (dictation/cloze), checkbox
lists (Learning Log), custom audio buttons, mic recorder
(Speak/Stop/Playback — still offers a Flash-plugin fallback link in
2026), YouTube iframe, AdSense banners inside activities.

## 6. Speaking mechanics (full answer to the R1.4 review)

USA Learns does NOT do machine-scored speech at all:

- Model audio (Listen) → learner presses Speak → records →
  Playback to self-review → re-record until satisfied → Next.
- "Your Turn" = semi-scripted production prompts ("Say, 'Hi! I'm ___.
  Nice to meet you.'") embedded in each lesson's Self-Evaluation.
- ALL record/playback speaking activities are `—` (unscored): Say it!,
  Your Turn, Shorten-forms, Pronounce. Evidence recorded =
  attempted/practiced, never "passed speaking".
- CORRECTION A (verified live): the Speaking SECTION of E1+ 1.1 does
  contain one scored activity, "Introducing Yourself" (•), but its
  scored component is a LISTENING item — "select all the sentences
  you hear" (7 checkboxes, PermittedAttempts=3). No recorded speech
  is scored anywhere; machine speech scoring does not exist.
- Mic permission handled in-page; legacy Flash fallback still offered.

This validates SE's locked policy: self-practice → record → replay →
self-review is a legitimate professional pattern; no machine scoring
is required for a credible beginner product.

## 7. Assessment model

- Formative: per-item checks inside activities (2 attempts + reveal).
- Lesson-level: quiz lesson per unit (1st course "Review and Quiz").
- Unit-level: review lesson (E1+ 1.6 = 10 retrieval activities across
  unit content) and/or unit test (1st course docs).
- Self-assessment: Learning Log can-do checklists EVERY lesson —
  self-reported mastery inventory, separate channel from % scores.
- NO proficiency/CERT assessment observed. Nothing claims CEFR level.
- Score = % correct on scored activities; no weighting visible, no
  partial credit observed (binary item correctness; a wrong-at-limit
  item scores 0).

## 8. Media & technology

- Lesson/story video = YouTube embeds (USAL channel), not self-hosted.
  The 1st-course videos ("Putting English to Work 1", LAUSD) and E1+
  VOA clips both play via `youtube.com/embed/{id}?rel=0&enablejsapi=1`.
- Instructional audio (vocab, questions, dictation) = self-hosted MP3
  with custom Listen/Pause buttons (no scrub bar).
- NO offline support; every Next = full page navigation (server-driven,
  not SPA). No transcript toggle observed on video screens; YouTube's
  own CC carries captions.
- AdSense ads render INSIDE learning activities (below content).
- 390px viewport: table menus reflow acceptably, no overflow; no
  mobile-native patterns (no bottom nav, no touch-sized targets beyond
  defaults). Functional but dated.
- Keyboard/a11y: form controls + links are standard HTML (probably
  operable), but radio/label association and focus management not
  audited in depth → partial UNKNOWN.

## 9. Strengths vs dated mechanics

STRONG (worth clean-room reuse as DESIGN):
- One uniform engine across 7 courses — LINCS resource profile
  describes uniformly-structured lessons/units across the reviewed
  courses (profile covers the site generally; it does NOT
  independently validate every current English 1 Plus activity —
  E1+ launched after the profile was written).
- Orthogonal completion/score/self-declared-mastery channels.
- Advisory 80% without hard gating; unlimited repeats.
- Resume = next-incomplete deep link + explicit reset.
- Activity-level (not screen-level) tracking simplifies state.
- Vocabulary heard/seen in ≥3 contexts before use (official design).
- Learning Log can-do self-evaluation every lesson.
- Dictation, noticing, dictation-of-grammar-point, listen-read questions.

DATED (reject for SE):
- Full page reload per item; no optimistic UI.
- Ads inside the learning surface.
- Flash fallback still referenced.
- No offline/local-first; all state server-side behind an account.
- No spaced review, no due queue, no scheduling at all.
- Bare YouTube embeds (no focused-player treatment, external
  dependency for core content).
- No keyboard-first or reduced-motion affordances observed.
- Table-based menus; no session concept (activity hopping is manual).

## 10. What USAL does NOT solve (verified gaps)

- Spaced repetition / due-review scheduling: absent entirely.
- Proficiency measurement: absent (formative only — same gap as ours).
- Offline learning: absent.
- Session design/timeboxing: absent — learner wanders menus.
- Adaptive sequencing: strictly linear.
- Pronunciation scoring: absent (self-judged playback only).
- Cross-session synthesis: no dashboard beyond per-row ✓/% cells.
- Vocabulary tracking is implicit (scores), not a learner corpus —
  except self-declared Learning Log words.
- Content licensing for reuse: USAL content is copyrighted; only its
  VIDEO SOURCES (VOA = PD, LAUSD PETW) are open at the asset level.
