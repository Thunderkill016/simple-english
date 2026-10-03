# SE Evidence Map — R1 Consolidated

The single reference for "what do we actually know, and from where."
Every claim carries a channel:

- **LOCKED** — decided by review; implement only this way.
- **STRONG** — convergent evidence (research + professional practice +
  observed system); high confidence.
- **HYPOTHESIS** — plausible product choice; NOT evidence-locked.
- **GAP** — no one has solved this; SE must not pretend otherwise.
- **FORBIDDEN** — ruled out by rights or evidence.

---

## A. Curriculum & content

| Claim | Status | Source |
|---|---|---|
| Professional Unit-1 scope: greet/introduce + alphabet/numbers or functionally-equivalent first-contact set, multi-skill | STRONG | 5-course R1.2 comparison (Empower 2e, EF5e, Speakout 3e, Roadmap 2e, Outcomes 3e) |
| Lesson-internal depth is multi-stage (input→language→practice→production→review), spanning more than one sitting | STRONG | Empower 2e lesson internals; USAL 8-function pipeline |
| UNIT/LESSON/SECTION/ACTIVITY/ITEM is the canonical hierarchy; SESSION = runtime visit, NOT a curriculum entity | LOCKED (R1.4A) | USAL observation + review Decision 4 |
| None of five pro courses defines session boundaries — SE designs this from self-study constraints, not coursebook precedent | STRONG | R1.2 finding |
| Functional pipeline (not fixed section count): ORIENT→PREPARE→INPUT→COMPREHENSION→LANGUAGE FOCUS→SUPPORTED PRACTICE→PRODUCTION→REFLECT/REVIEW | LOCKED as REFERENCE PATTERN | USAL E1+ live observation (R1.4A Decision 1) |
| VOA Let's Learn English L1 is usable PD content incl. video, conversation MP3, quiz assets, 8-page lesson plan | STRONG | asset-level inspection; PD at item level |
| Beginner content pool: VOA + PCC ESOL workbook + English Storybooks + LibreTexts + Communication Beginnings (NC) + NGSL | STRONG | R1.3 audit (7 FULL / 7 PARTIAL / 1 GAP at slot level) |
| NGSL = open frequency/priority reference; NEVER CEFR leveling or curriculum sequencer | LOCKED | R1.3 correction |
| Curriculum coherence (graded multi-lesson path) is PARTIAL not FULL — no open course matches pro-course internal coherence | GAP-adjacent PARTIAL | R1.3 grading |

## B. Learning mechanics

| Claim | Status | Source |
|---|---|---|
| Retrieval practice + spacing = high-utility core mechanics | STRONG | Dunlosky et al.; Roediger/Karpicke |
| Exercises are learning events, not just assessment | STRONG | testing-effect literature |
| Corrective feedback should prefer cue→reproduce→stronger-cue→reveal over instant reveal | STRONG (direction), HYPOTHESIS (exact cue design) | SLA feedback research; LINCS notes USAL items don't explain errors |
| Bounded attempts (2) → reveal is a proven simple mechanic | STRONG (as floor) | USAL observed; classified PARTIALLY_SOLVED — extend, don't copy |
| Explicit grammar instruction has strong evidence; sequencing is a product choice | STRONG/HYPOTHESIS | Norris & Ortega meta-analysis |
| 98% coverage = useful benchmark for UNASSISTED meaning-focused reading only | STRONG (bounded) | Nation/HSK-coverage research, R1.4 correction |
| Captions/transcripts support listening+vocab; transcript-on-demand preferred over always-on | STRONG | Vanderplank; Winke et al.; R1.4 |
| Extensive reading (incl. web) is supported | STRONG | ER literature review |
| Pronunciation targets intelligibility/prosody, not accent removal | STRONG | Munro & Derwing; Levis |
| Metacognitive listening (predict→monitor→evaluate) is useful | STRONG | Goh; Vandergrift |
| Review-first session ordering | HYPOTHESIS | product convergence ≠ learning evidence |
| Interleaving beyond recycling/retrieval | HYPOTHESIS | evidence overstated; flagged R1.4 |
| Comprehension questions read aloud (audio stems) keeps listening primary | STRONG (pattern) | USAL observed |

## C. Progress, state & assessment

| Claim | Status | Source |
|---|---|---|
| Resumability, explicit learner state, completion≠mastery, progress survives leaving/reloading | LOCKED | R1.4 review |
| Activity tri-state (not-started/in-progress/complete) + orthogonal % score + self-report + review-state = FOUR channels | LOCKED | USAL observed + Decision 2 |
| Resume = first unresolved item; persist completed activities + resolved items + current activity + item cursor | LOCKED | Decision 3 (finer than USAL) |
| Advisory threshold (80%) + unlimited repeats, not a hard gate | STRONG | USAL observed; LINCS |
| NO proficiency channel in V1 — never claim CEFR/proficiency/competence/mastery | LOCKED | Decision 5; universal gap |
| Learning Log self-evaluation (words-I-know + can-do) = metacognitive signal ONLY; never feeds FSRS/mastery | LOCKED | Decision 2 |
| Speaking V1 = record→replay→self-review practice evidence ONLY | LOCKED | USAL pattern + R1.1 Decision 4 |
| Machine speech scoring, if ever = formative estimate unless independently validated | LOCKED | R1.1 correction C |
| Validated open proficiency assessment | GAP (global) | R1.3; USAL confirmed absent |

## D. Software & systems

| Claim | Status | Source |
|---|---|---|
| ts-fsrs (MIT) behind an SE adapter = scheduler; never determines curriculum/mastery/CEFR | LOCKED | R1.4 review |
| Dexie/IndexedDB local-first is validated | STRONG | SE Task 002B live product |
| H5P = STUDY/IMPORT-COMPATIBILITY candidate; licensing split per layer (runtime/types/content/deps) | LOCKED | R1.4 correction |
| Full page reload per item, ads in activities, Flash fallbacks, bare embeds = dated mechanics to REJECT | STRONG | USAL observed |
| Explicitly LLM-generated course content (OpenLingo/freelingo and similar) is PROHIBITED for learner-facing use even if code is OSS. LibreLingo = community-authored courses → provenance/rights per course. OmniLingo = Common Voice/community speech → supplementary dataset/mechanics, not curriculum authority. Human Gate is provenance-based, not project-name-based | LOCKED | R1.4 + registry policy |
| LUTE/LinguaCafe = reading-tool study references, not curriculum engines | STRONG | R1.4 map |

## E. Legal & provenance

| Claim | Status | Source |
|---|---|---|
| EGP/EVP = REFERENCE_ONLY; no bulk ingestion, no runtime dependency, no commercial assumption | LOCKED | official Terms; R1.1 Decision 3 |
| USA Learns platform+content = REFERENCE_ONLY (SCOE copyright); VOA source assets reusable at SOURCE | LOCKED | R1.4A |
| Clean-room methodology claim wording (functional patterns implementable; protected expression never) | LOCKED | Correction E |
| AI-generated curriculum/lesson content for learners | FORBIDDEN | registry policy + reviews |
| HUMAN CONTENT GATE: all learner-facing instructional English — goals, examples, grammar explanations, cues/hints, noticing explanations, comprehension stems, answer options/distractors, pronunciation material, speaking frames, writing prompts, review content — must be HUMAN_AUTHORED_SOURCE, HUMAN_AUTHORED_ADAPTATION, HUMAN_EDITOR_APPROVED, or a DETERMINISTIC_TRANSFORMATION of a verified source; LLM-authored learner content (Devin/ChatGPT/Claude) is prohibited; AI may author non-instructional product/UI chrome only; where no source-backed cue exists, use the simpler verified feedback path rather than inventing one | LOCKED | R1-final verdict, Correction 1 |
| Rights are decided ASSET-LEVEL, never domain-level | LOCKED | R1.3 correction |
