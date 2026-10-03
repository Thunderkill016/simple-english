# R1.4B — Commercial Product Benchmark (mechanics, not effectiveness)

> Locked rule: describe mechanics separately from effectiveness
> evidence. Duolingo's solution is not assumed pedagogically
> optimal. These are design observations for the session-model
> gap, not endorsements.

## Duolingo

- **Course model**: Path — units → sections → levels (= old
  skill crown level) → lessons. Lessons interleave new + review
  concepts by default ("spacing claim" per official blog).
- **Session**: a lesson = ~10-20 exercise items; mid-lesson exit
  loses that lesson's progress (lesson = atomic session unit).
- **Review**: Practice tab/barbell hub + review built into path;
  mistake review at lesson end is free (doesn't consume Energy).
- **Progress**: crown/level completion, XP, streaks, leagues —
  engagement metrics dominant; mastery not learner-visible as
  per-item state.
- **Mistake model**: errors re-queued at end of same lesson;
  persistent mistake review lives behind practice mode.
- **Monetization-gate mechanics**: Hearts → **Energy** (Jul 2025):
  exercises spend energy, correct streaks refund; full recharge
  ~1 day. Punishment moved from errors to throughput.
- **Assessment**: Duolingo English Test is a *separate product* —
  even the largest consumer app keeps formative and certified
  channels apart (confirms R1.2/R1.3 lock).
- **Speaking**: read-aloud + free-response with ASR; Max tier adds
  LLM roleplay. Content: human-authored core + AI-generated
  expansion (Birdbrain) — provenance mixed.

## Busuu

- **Course model**: CEFR-linear path (A1-B2); unit → chapter →
  ~5-min lessons of ~12 drills (vocab → dialogue → grammar
  → writing).
- **Session**: lesson = one sitting; completion = drill loop end.
- **Review**: dedicated Review tab (Smart Review SRS over all
  learned items) + periodic in-path review prompts every couple
  of lessons.
- **Progress**: per-lesson completion + per-item review strength;
  placement test at onboarding; goal-date prediction.
- **Assessment separation**: **clearest in class** — McGraw-Hill
  Education certificates at level completion; in-course practice
  stays formative.
- **Speaking**: record → *human community* correction (not ASR);
  Busuu Live = paid teacher sessions — human feedback is
  monetized, machine feedback is not claimed as assessment.
- **Community**: corrections from native speakers — a human-in-
  the-loop feedback channel SE lacks entirely (documented, not
  replicable at our scale).

## Babbel

- **Course model**: linear courses per language; lesson =
  10-15 min scenario (word-picture → sentence → dialogue →
  pron/grammar).
- **Session**: one lesson per sitting; mid-lesson resume to
  lesson start.
- **Review**: Review Manager SRS; prompts quick review sessions
  before new lessons; learner picks format (flashcard /
  listening / speaking / writing) — review as *daily habit
  interleaved with new material*.
- **Progress**: lesson completion + review counts.
- **Speaking**: speech-recognition checks inside lessons
  (acceptance thresholds, not proficiency claims).
- **Content**: human-authored in-house curriculum (didactics
  team) — professional-authored like coursebooks.

## LingQ

- **Course model**: no fixed curriculum — content library
  (articles/podcasts/videos) + mini-stories for beginners;
  user imports own content.
- **Session**: open a text → read+listen → click words (make
  "LingQs") → session ends when user stops; position persisted
  per lesson.
- **Review**: SRS review of saved LingQs (flashcards/cloze) —
  review driven by *what you saved while reading*, not by a
  syllabus.
- **Progress**: known-words count (claimed coverage), streaks.
- **Assessment**: none beyond known-word metrics — immersion
  tool, not course.
- **Fit note**: SE's graded-reading channel shares LingQ's model
  (text+audio+tap-to-know) at much smaller scope.

## Language Reactor

- **Model**: browser extension over Netflix/YouTube — dual
  subtitles, click-to-translate, replay sentence, save phrases.
- **Session**: media session itself; saved items → flashcard
  review later.
- **Lesson model**: none — pure tooling over authentic media.
- Take: transcript-linked playback UX (line click → seek), the
  same mechanic VOA quizzes already use conceptually.

## Migaku

- **Model**: Chrome extension + deck tooling — mine sentences
  from Netflix/YouTube/web into Anki cards; course content for
  beginners exists ("Migaku Fundamentals") but core pitch is
  *learn from media you chose*.
- **Session**: media watching with tooling; review = Anki SRS
  (delegated entirely).
- Take: sentence-mining pipeline (media → card) as a pattern;
  its SRS is outsourced — validates "review engine is a
  separate component" architecture.

## Speak

- **Model**: AI speaking-tutor — unit → talking points → guided
  AI conversation + drilling; subscription.
- **Session**: roleplay conversation sessions + structured
  drills; completion = scenario done.
- **Speaking**: LLM conversation as the core mechanic — the
  farthest current point of "interactive speaking" without a
  human; still formative (no validated proficiency claim).
- **Honest note**: closest thing to interaction practice, but
  it's an AI interlocutor — our evidence lock says simulated
  dialogue ≠ demonstrated interpersonal ability; mechanics
  worth studying, claims not transferable.

## ELSA Speak

- **Model**: skill assessment → personalized pron path → daily
  drills; lessons segmented by sound/stress/topic.
- **Session**: short drill sets (minutes); progress = skill
  percentages per phoneme cluster.
- **Speaking**: proprietary ASR scoring at *phone level* —
  granular formative feedback (score = estimate, not
  certification; same caution as Speak & Improve).
- Take: phone-level feedback granularity; progress visualized
  per sub-skill (matches our per-item mastery model).

## Anki

- **Model**: decks → cards; no course/lesson concept — pure
  review engine + content decks.
- **Session**: a review session = due cards until done; new
  cards/day and max reviews/day are user-set budgets —
  **session sizing is a scheduling decision, not content
  structure**. "Learn ahead" and "bury related" exist.
- **Resume**: trivially perfect — due queue IS the state;
  position in queue; can stop mid-session.
- **Mistake model**: Again → relearn steps → card re-enters
  queue; leech flagging (repeat failures surfaced for user
  action).
- **SRS**: SM-2 lineage → **FSRS built-in since v24** — the
  algorithm SE should reuse now runs inside the biggest
  production SRS product.
- **Assessment separation**: none needed — everything is
  review state, no claims.
- Take: the due-queue session model, relearn steps, leech
  handling, bury-related, daily budgets — all directly
  describable for SE's review channel.

## Cross-product session patterns

| Mechanic | Where observed |
|----------|----------------|
| Atomic lesson = session boundary | Duolingo, Busuu, Babbel, Speak |
| Due-review queue as the session | Anki, LingQ (saved items) |
| Review prompted inside/before lesson | Babbel, Busuu, Duolingo path |
| End-of-lesson mistake re-queue | Duolingo (free), most apps |
| Mid-lesson progress loss on exit | Duolingo, Busuu, Babbel (lesson restarts) |
| Resume by content position | LingQ, Language Reactor, Migaku |
| Daily budget sizing | Anki (new/day + review cap), Duolingo (Energy) |
| Streak/return-tomorrow hook | all (engagement, not learning) |
| Proficiency assessment separate product | Duolingo (DET), Busuu (McGraw-Hill), Cambridge |
| Human feedback channel | Busuu community, Speak human-coach upsells |

**Mechanics ≠ effectiveness note**: streaks, Energy and leagues
are engagement economics, not learning evidence. The learning-
science-relevant takeaways are modest: session sizing by budget,
review-interleaving, resume-at-queue semantics, and assessment
channel separation.

## R1.4A — USA Learns (observed as a real learner)

USAL occupies a category the prior matrix missed: **government OER-era
self-study courseware** — deep pedagogical lessons rather than
consumer-app loops.

| Mechanic | USA Learns (observed) |
|---|---|
| Session definition | none — free navigation, no sizing/timeboxing |
| Resume | "Go to my next activity" = first-incomplete deep link; activity-internal restart (new attempt per entry) |
| Completion | tri-state per activity (□/◧/■); finishing at 22% still counts COMPLETE |
| Score | orthogonal % on scored items only; advisory 80%, never a gate |
| Review | unit-level retrieval lesson; NO spaced scheduling/due queue |
| Feedback | 2 attempts → reveal; "Incorrect. Try again." / "See the correct answer above." |
| Speaking | record→playback→self-review, 100% unscored |
| Self-eval | Learning Log: "words I know" + can-do checkboxes every lesson |
| Media | YouTube embeds + self-hosted MP3; ads inside activities; Flash fallback remnants |
| Persistence | server-side account only; no offline |
| Monetization | none (government); AdSense present anyway |

Benchmark position: USAL is the reference for **pedagogical session
architecture** (sectioned deep lessons); consumer apps remain the
reference for **habit mechanics**. SE sits between: USAL's lesson
depth + app-grade resume/due mechanics + local-first persistence
neither has.
