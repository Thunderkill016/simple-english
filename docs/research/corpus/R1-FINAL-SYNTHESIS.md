# R1 Final Synthesis — Evidence Base Ready

Consolidation of R1.1–R1.4A. Not a product design doc — an evidence
position statement that answers what we know, what we hypothesize,
what we don't know, and what the smallest honest pilot should test.

## 1. What we know STRONGLY

- Professional beginner courses converge on the same Unit-1 capability
  (meet/greet/introduce + first building blocks) with multi-skill,
  multi-stage internal lesson structure — but NONE defines session
  boundaries or self-study session mechanics.
- A complete self-study transformation pipeline exists and is
  production-proven at scale (USA Learns): ORIENT → PREPARE LANGUAGE →
  PRIMARY INPUT → COMPREHENSION → LANGUAGE FOCUS → SUPPORTED PRACTICE →
  PRODUCTION → REFLECT/REVIEW. Functions, not fixed sections.
- Human-authored open content sufficient to build real Unit-1-depth
  lessons EXISTS (VOA especially: PD video+audio+quiz+lesson plan) —
  with rights verified at asset level. The binding problem is
  normalization/coherence, not raw availability.
- Retrieval practice, spacing, explicit grammar, corrective feedback,
  supported reading/listening, intelligibility-focused pronunciation
  all have solid evidence; the exact packaging is product design.
- Progress mechanics need exactly three orthogonal channels + a
  scheduler: completion state, formative score, self-report —
  plus FSRS retention state. All implementable with proven parts.
- Speaking can be honest practice (record→replay→self-review) with no
  scoring — production precedent exists (USAL), policy locked.
- ts-fsrs (MIT) + Dexie solve the two hard infrastructure pieces.

## 2. What is merely a PRODUCT HYPOTHESIS

- Review-first ordering at session start.
- Cue→reproduce→stronger-cue→reveal feedback (direction evidenced;
  exact cue design + authoring cost unproven).
- Section-boundary stopping as "natural" session end.
- Learning Log improving metacognition for SE's audience (borrowed
  from USAL/CEFR self-assessment tradition; unvalidated for SE).
- "Coverage depth ≈ professional courses" being achievable with open
  sources for LESSONS BEYOND the meet/greet capability (Unit-1
  capability is FULL; scaling is PARTIAL evidence).
- Vietnamese-muted L1 support pattern (SE-specific choice, not
  researched against alternatives).

## 3. What remains UNKNOWN

- How much a beginner session can productively hold (no source —
  telemetry question, explicitly not answered by pretending).
- Whether cue-first feedback is authorable at open-content scale
  without per-item bespoke writing.
- Whether FSRS scheduling at item granularity integrates cleanly
  with lesson-grouped review (SE-specific design space).
- Learning-outcome efficacy of ANY self-study product — no public
  causal data exists; SE's own claims must stay measured.
- Whether local-first's privacy/offline win outweighs USAL-style
  server features (teacher monitoring, cross-device) for SE's users.

## 4. What Cambridge / professional courses solve

- Curriculum SCOPE: what a serious beginner course covers, in what
  order, at what depth. Empower 2e = primary structural benchmark.
- Internal lesson architecture (staged multi-skill lessons),
  consolidation patterns (Review Your Progress / can-do),
  assessment channel SEPARATION (learning progress ≠ proficiency —
  Empower's two test layers are the model SE adopts conceptually).
- NOT solved for us: self-study session mechanics, media-interactive
  packaging, free-reusable content, open leveling data (EGP/EVP =
  REFERENCE_ONLY).

## 5. What USA Learns solves

- The exact transformation SE needs: human-authored English video →
  independent web self-study. Proven on the SAME source family SE
  uses (VOA, LAUSD).
- Minimal correct state machine (activity tri-state + orthogonal
  score + next-incomplete pointer + explicit reset).
- Feedback floor (bounded attempts → reveal; extend with cues).
- Speaking honesty (record/replay/self-review, unscored).
- Self-evaluation channel (Learning Log words + can-do).
- NOT solved: scheduling/spaced review, session design, offline,
  proficiency, item-level resume, focused media UX, modern renderer.

## 6. What open human-authored sources supply

- VOA LLE: the primary pilot content — PD video, conversation audio,
  quiz assets, 8-page lesson plan per episode. Asset-level verified.
- PCC ESOL workbook (CC BY): grammar/vocab exercise patterns +
  adapted lesson precedent already shipped in SE.
- English Storybooks (CC BY): leveled reader pool for supported
  reading functions.
- LibreTexts beginning ESL (CC BY): listening/speaking instructional
  prose.
- NGSL (CC BY-SA): frequency/prioritization signal only.
- Communication Beginnings (CC BY-NC): usable ONLY if SE stays
  non-commercial — flagged as conditional, not core.
- Tatoeba: supplementary sentences, per-item rights+quality checks.
- NOT supplied: coherent graded course, proficiency instruments,
  authored cue-feedback, media at professional production depth —
  all normalized/authored BY SE.

## 7. What OSS components SE should reuse

| Need | Component | License | Status |
|---|---|---|---|
| Spaced scheduling | ts-fsrs behind SE adapter | MIT | LOCKED reuse |
| Local persistence | Dexie (existing) | Apache-2.0 | in product |
| Interactive exercise types | H5P-compatible patterns (study; layered licenses) | mixed | study/import-compat only |
| Reading-tool mechanics | LUTE/LinguaCafe patterns | AGPL (study only) | design reference |
| Video delivery | VOA assets direct (local/PD) + YT embed fallback | PD / platform | in product pattern |
| NOT reused | LibreLingo/OmniLingo content (AI-gen), USAL code/content, EGP/EVP bulk | — | PROHIBITED/REFERENCE_ONLY |

## 8. What SE genuinely must build

- The learning shell: COURSE→UNIT→LESSON→SECTION→ACTIVITY→ITEM
  hierarchy with tri-state + score + self-report + review channels.
- Item-cursor resume (resolved items never repeat on re-entry).
- The content pipeline: open human-authored assets → normalized
  lesson items → rights/provenance metadata → validated package.
- Lesson authoring: SE-written connective tissue (goals, cues,
  noticing prompts, comprehension stems) around sourced media —
  the editorial work USAL did for VOA, done for SE's corpus.
- Feedback engine: bounded attempts + cue templates where
  deterministic; reveal as last resort.
- FSRS adapter mapping attempt outcomes → review state (never
  curriculum order, mastery, or CEFR).
- Self-evaluation surface (Learning Log equivalent).
- Calm, offline-capable, mobile-first UX (USAL's dated renderer is
  the counter-example; SE's existing shell is the base).

## 9. What claims SE must NEVER make

- CEFR level achieved, proficiency, communicative competence, mastery.
- "Passed speaking" from solo recording.
- Curriculum "personalized/adaptive" beyond what the mechanics do.
- Content "researched-backed" beyond the specific evidence cited.
- Score→mastery inference; completion→capability inference;
  self-report→assessed-evidence inference.
- Lineage claims requiring permission ("English Profile informed").

## 10. The smallest evidence-backed pilot

```text
PILOT = ONE deep lesson on the meet/greet capability
        built the USAL way from VOA source material
        inside SE's local-first shell
        with all four progress channels instrumented.
```

Concretely — a single lesson whose pipeline covers: ORIENT (goals) →
PREPARE (key words, ≥3 exposures) → INPUT (VOA L1 conversation
video/audio) → COMPREHENSION (audio-stem items) → LANGUAGE FOCUS
(introductions + BE from the source) → SUPPORTED PRACTICE (cloze/
dictation/matching with bounded attempts + reveal) → PRODUCTION
(record→replay self-intro) → REFLECT (learning log words + can-do)
→ REVIEW (FSRS-scheduled items at next visit).

It tests the actual risk list: normalization cost, cue authoring,
resume granularity, channel instrumentation, offline packaging of
VOA media — at ONE lesson's scope. Not a course. If this lesson
works, the pattern scales; if it doesn't, we learned at lesson cost.

## Provisional architecture map (locked shape)

```text
PROFESSIONAL CURRICULUM REFERENCE   (Empower 2e + specialists)
            ↓ informs scope/depth, never copied
HUMAN-AUTHORED OPEN CONTENT         (VOA PD, OER TIER A/B — asset-level)
            ↓ normalized + provenanced by SE pipeline
SELF-STUDY WRAPPER                  (USAL functional pipeline pattern)
            ↓ lesson = sectioned activities
FORMATIVE PRACTICE                  (bounded attempts + cue→reveal)
            ↓ attempt outcomes
LOCAL PROGRESS                      (tri-state + score + self-report)
            ↓ attempt results
REVIEW SCHEDULER                    (ts-fsrs adapter — scheduling only)
            ↓ due state
SELF-EVALUATION                     (Learning Log — metacognitive only)
            ↓
LEARNER                             (honest signals, honest labels)
```

SE = professional-depth human-authored content + proven self-study
wrapper + modern local-first mechanics + honest progress channels.
Nobody else occupies exactly this position.
