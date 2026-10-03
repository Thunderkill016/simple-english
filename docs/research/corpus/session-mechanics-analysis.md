# R1.4 — Session Mechanics Analysis

> The special investigation: professional coursebooks leave
> SESSION undefined (R1.2 finding). How do self-paced products
> solve session boundaries? Mechanics described separately from
> effectiveness evidence.

## The eleven questions

### 1. Start session

| Product family | Mechanic |
|----------------|----------|
| Course apps (Duolingo/Busuu/Babbel) | "Continue" CTA resumes next incomplete unit item; session = lesson |
| Review apps (Anki/LingQ) | session = the due queue itself; opening IS starting |
| Reading tools (LUTE/LinguaCafe/LingQ) | session = open a text; no start ritual |

**Pattern**: two entry semantics — *next-lesson pointer* or
*due-queue*. SE needs both: curriculum pointer for new material,
due queue for review.

### 2. Resume

- Atomic-lesson apps (Duolingo/Busuu/Babbel): exiting mid-lesson
  discards in-lesson progress — lesson restart. Cheap to
  implement; punishes interruption (arguably acceptable at
  5-15-min lesson size).
- Queue apps (Anki): position in queue = resumable to the card.
- Reading (LingQ/LUTE): position in text persisted.
- **SE implication**: our lesson is a multi-section pedagogical
  unit (Empower-scale), so atomic-restart is NOT acceptable —
  resume needs section granularity. This is the concrete place
  where copying an app session model would hurt the pedagogy.

### 3. Stopping point

- Duolingo/Busuu/Babbel: lesson end is the only clean stop;
  reward economy (Energy/XP) is tuned to lesson completion.
- Anki: any point — queue remembers.
- **SE implication**: section boundaries are natural stops;
  progress must persist mid-section too (per-item attempt state,
  not screen state).

### 4. Lesson chunking

- Coursebook lesson (Empower 1C ≈ 24 items + writing + review)
  vs app lesson (~12 drills / ~5 min). Professional unit =
  3-5 lessons ≈ what a professional expects over days.
- No product solves "pedagogical lesson spanning multiple
  sittings" — commercial apps simply shrank the lesson to fit
  the session. That is the thing SE must not do (locked).
- **SE implication**: SESSION = slice of a lesson's sections
  bounded by learner stopping; the curriculum never chunks
  itself to fit.

### 5. Review interruption

- Anki: interrupting mid-review just leaves queue state.
- Babbel: review prompt appears at session start; skipping it is
  allowed but re-asked.
- Duolingo: review is a path node; can't be "interrupted" mid-
  course because it's interleaved as lessons.

### 6. Due review vs new material

- Anki: due reviews always win; new cards added after reviews
  up to daily budget.
- Babbel: review first, then new lesson.
- Duolingo: invisible — path decides.
- **SE implication**: DUE REVIEW FIRST is a *product
  hypothesis* (products converge on it; learning evidence
  doesn't order it) — candidate rule, marked as hypothesis in
  the session spec, not a locked rule. If used, keep it
  learner-visible, not opaque ordering.

### 7. Mistake recovery

- Duolingo: errors re-queued at lesson end (free); Energy doesn't
  punish them.
- Anki: Again → relearn steps → card back into session queue.
- Lyster & Ranta (R1.4A): prompts that force re-production beat
  showing the answer.
- **SE implication**: mistake → targeted re-attempt within the
  same session (prompt-style, not show-answer) + item enters the
  due-queue for later days. Two timescales of mistake handling.

### 8. "Continue" action

- Every course app has exactly one primary CTA = next incomplete
  item. Decision fatigue is engineered away.
- **SE implication**: Today screen = one continue affordance +
  one review affordance. No dashboard of choices.

### 9. Session completion

- App lessons end on completion screen (score, XP) — reward loop.
- Anki session ends when queue empties or user stops — no ceremony.
- **SE implication**: end a session with *section boundary
  reached* + plain progress statement (items practiced/attempted)
  — not a score masquerading as mastery (locked formative
  policy).

### 10. Return-tomorrow behavior

- Streaks/energy/due accrual bring users back; learning-relevant
  version: Anki's due queue grows daily, Babbel prompts review.
- **SE implication**: "What's due today" is the honest
  return mechanic — spaced schedule creates natural daily
  shape without engagement gimmicks.

### 11. Offline / local state

- Anki: fully local, sync optional layer (AnkiWeb).
- Localingo: local-only, shareable state links instead of sync.
- LibreLingo app: PouchDB local progress.
- Course apps: server-authoritative; offline is cached-only.
- **SE already chose local-first (Dexie)** — aligned with the
  review-engine class of products, not the course products.

## The session model this implies for SE

```text
SESSION (one web sitting)
  ├── A. Due review (FSRS queue) — hypothesized first,
  │      ordering NOT evidence-locked
  ├── B. Continue pointer → resume mid-section position
  │      inside the current pedagogical LESSON
  └── C. Stop anywhere; per-item attempt state persists
         (section boundaries are clean resume anchors)

LOCKED (R1.4 review): resumability, explicit learner state,
completion ≠ mastery, progress survives leaving/reloading.
NOT LOCKED: review-first, session size, exact stop rules.```

Constraints pulled from the evidence:

- Session sizing = learner time + due load, never curriculum
  reshaping (locked R1.1/R1.3).
- Resume granularity = section, with per-item attempt state —
  finer than any course app, required by professional lesson
  depth.
- Review vs new = ordering still open (review-first is the
  product hypothesis; not evidence-locked).
- Mistake handling = two timescales (in-session re-attempt,
  next-day queue).
- Completion semantics = section boundary + attempt record;
  "done" never means "mastered" (formative ≠ proficiency).
- Return mechanic = real due load, not energy economics.

## What remains genuinely unsolved everywhere

- How much of a deep pedagogical lesson can one beginner session
  productively hold — no product or coursebook answers this;
  SE must instrument and measure (research question, flagged).
- Whether review-first vs lesson-first ordering matters for
  completion — apps pick review-first for habit, but evidence
  is engagement-data, not learning-data.

## R1.4A addendum — USA Learns (observed live, the missing case)

USAL answers several open questions with a *minimal* model:

- **No session concept at all.** No timeboxing, no daily plan, no
  session sizing. Learner navigates menus freely; "Go to my next
  activity" is the only resume CTA. Sessions emerge from the learner,
  not the system — and LINCS reviewers call the uniform flow easy
  anyway. Evidence AGAINST over-engineering session rules.
- **Resume granularity = activity.** Mid-activity exit discards item
  progress (new attempt GUID on re-entry, restart at item 1). The
  pointer = first-incomplete-activity in linear order. SE's planned
  section-level resume is FINER than USAL; USAL shows coarser is
  survivable but we keep finer for deep lessons.
- **Completion ≠ measured mastery proven in production:** a 22% activity marks
  FULL; the 80% rule is advisory text. No gate anywhere.
- **Mistake recovery = bounded retry + reveal** (2 attempts, then
  "See the correct answer above"). No re-queue, no remediation branch.
- **Next action = "Go to my next activity"** deep link + chained
  Next at activity end (auto-flow into the next activity).
- **"Start over"** is offered as a normal course action — explicit
  full reset, user-initiated.
- **Review = unit-level retrieval lesson only** (E1+ 1.6: vocab,
  spelling, cloze, conversation completion, Your Turn). No due queue
  or scheduling — consistent with review-first staying a hypothesis.
