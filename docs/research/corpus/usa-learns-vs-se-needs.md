# USA Learns vs SE Needs — R1.4A Verdict Analysis

Per-subsystem verdict: does USAL already solve what SE needs?
SOLVED_BY_REFERENCE = USAL demonstrates a complete, transferable
solution SE can clean-room reimplement. PARTIALLY_SOLVED = useful
pattern exists but has gaps/limits for SE. NOT_SOLVED = USAL doesn't
do it (SE must design independently).

## Subsystem scores

| Subsystem | Verdict | Evidence |
|---|---|---|
| Curriculum navigation | **SOLVED_BY_REFERENCE** | rigid course→unit→lesson→activity menus; LINCS-praised uniformity; breadcrumb + Menu link; next-activity chaining |
| Lesson sequencing | **SOLVED_BY_REFERENCE** | fixed linear order, sections inside lessons, review lesson at unit end; simplest possible correct model |
| Activity engine | **PARTIALLY_SOLVED** | taxonomy covers vocab/listen/grammar/dictation/reading/speaking/self-eval; but server-driven full reloads, no offline, dated controls — SE must rebuild the renderer anyway |
| Feedback | **PARTIALLY_SOLVED_BY_REFERENCE** | 2-attempt + reveal cycle is a proven simple mechanic (immediate feedback, bounded retry, deterministic resolution); LINCS notes items do not explain WHY an answer is wrong; learning science favors cue→reproduce→stronger-cue→reveal — SE should extend, not copy |
| Progress | **SOLVED_BY_REFERENCE** | orthogonal ✓ state + % score + self-report channel (Learning Log); 22%-still-complete proves completion≠mastery by design |
| Resume | **PARTIALLY_SOLVED** | "Go to my next activity" = next-incomplete deep link (excellent); but activity-internal progress discarded on exit — SE must decide item-level resume deliberately |
| Review | **NOT_SOLVED** | only unit-level retrieval lessons; NO spaced scheduling, no due queue, no cross-session review — SE needs FSRS anyway |
| Speaking | **SOLVED_BY_REFERENCE** | model→record→playback→rerecord, scripted prompts, ALL unscored; confirms SE's practice-evidence-only policy |
| Assessment | **PARTIALLY_SOLVED** | formative quizzes + advisory threshold + self-eval log; no proficiency channel (same gap as SE — nobody solved it) |
| Media | **PARTIALLY_SOLVED** | YT embeds + self-hosted MP3s work; but bare embeds, ads, no transcript layering, no offline cache — SE already does better (click-to-load, provenance) |
| Next action | **SOLVED_BY_REFERENCE** | "Go to my next activity" + Next chaining = unambiguous forward motion; Start over = explicit reset |
| Learner autonomy | **PARTIALLY_SOLVED** | full freedom to hop any activity/unit (nothing locked); but no session framing, no daily plan, no stopping guidance |


## Fork/build verdict — REVISED (post-deep-dive)

USAL is NOT a fork candidate (proprietary platform+content, no source),
but it is now the **PRIMARY SELF-STUDY PRODUCT REFERENCE**:

- The earlier claim "no existing system solves resumable multi-section
  lessons" was wrong in spirit: USAL solves RESUMABLE LINEAR COURSES
  with a trivially small state model (activity tri-state + score +
  next-incomplete pointer). What remains unsolved — everywhere — is
  only the part SE already knew was unsolved (scheduling, sessions,
  proficiency).
- SE's local-first shell stays the right build (USAL gives no code),
  but its curriculum model should adopt USAL's structure:
  sectioned lessons of mixed scored/unscored activities over a
  primary media asset, with explicit goals, vocab prep, noticing,
  and a self-eval close.
- SE's differentiators vs USAL (and they are real gaps in USAL):
  offline/local-first, spaced review layer, calm focus-mode UX,
  session framing, provenance-first content model.

## What SE can clean-room reimplement (legal analysis)

SE documents abstract functional behavior for clean-room study and
independently implements its own code, content, wording and visual
expression. USA Learns code, proprietary activity content, media,
layout and other protected expression are not reused. (Correction E —
functional-pattern reuse is a clean-room methodology claim, not a
categorical legal conclusion; rights remain asset-level.)

IMPLEMENTABLE FUNCTIONAL PATTERNS:
- hierarchy + ✓/score/tri-state + next-incomplete pointer
- 2-attempt → reveal feedback cycle
- advisory 80% + unlimited retry + Start over
- sectioned lesson skeleton (intro→vocab→input→language→reading→
  speaking→self-eval→unit review)
- record→playback→self-review speaking loop
- Learning Log can-do/word self-checklists
- comprehension questions read aloud (listen-focused stems)

NEVER (protected expression):
- USAL question items, readings, noticing prose, recordings, images,
  word-image pairs, layouts/CSS, their activity content.

ALWAYS ASSET-LEVEL on OUR side: VOA videos/audio are PD at the asset
level — SE uses the SAME upstream source USAL uses, not USAL's copy
of it. That's the legal magic of this whole finding: the wrapper is
reimplementable because the wrapped content is open.

## Remaining genuinely-unsolved (for final R1 synthesis)

- Session sizing/stop rules (nobody observed solves this well).
- Proficiency channel (global gap — keep formative-only + honest labels).
- Item-level resume decision (USAL: no; SE: choose deliberately).
- How a self-reported Learning Log interacts with FSRS scheduling
  (novel integration SE must design).
- Offline-variants of streaming media (VOA assets are local-copyable
  PD — SE can cache what USAL can only embed).
