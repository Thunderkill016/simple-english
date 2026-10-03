# Contradictions & Tradeoffs — R1

## Resolved during R1 (kept for provenance)

| Issue | Contradiction | Resolution |
|---|---|---|
| Empower editions | 1e sample ≠ current 2e | 2e wins; 1e = LEGACY evidence (empower-edition-diff.md) |
| EGP/EVP | "free" vs Terms of Use | REFERENCE_ONLY; open substitute = NGSL frequency layer |
| Speak&Improve | implied proficiency-grade scoring | formative estimate only (Cambridge's own wording) |
| 25-exercise depth | depth benchmark vs exercise count | coverage depth ≠ count; pedagogical lesson ≠ user session |
| NGSL role | open EVP substitute vs level assigner | frequency/priority reference ONLY |
| 98% coverage | universal gate vs reading-specific benchmark | bounded to unassisted meaning-focused reading |
| Review-first | looked locked vs product convergence | HYPOTHESIS, not evidence |
| "No system solves resumable lessons" | pre-audit claim vs USAL reality | retracted after live USAL audit |
| H5P "MIT" | blanket vs layered licensing | split: runtime / content-type code / content assets / deps |
| USAL speaking | "all unscored" vs scored • item | resolved live: the scored item is LISTENING multi-select, not speech |

## Live tradeoffs carried into synthesis

### T1 — Feedback: reveal-fast vs cue-first
USAL's 2-attempt→reveal is simple, deterministic, proven at scale —
but LINCS notes it never explains WHY, and feedback research favors
eliciting re-production before revealing. **Tradeoff**: cue-first is
better pedagogy but requires authored cue content (more curriculum
work) or deterministic templates. Position: bounded attempts kept;
reveal becomes last resort where cues exist.

### T2 — Freedom vs guidance
USAL = total freedom (no locks, no plan, wander menus) and is
LINCS-praised for it; consumer apps = guided single-button flow with
streak economics. SE sits between: next-action pointer + calm choice,
no engagement mechanics, no enforced session length (Decision 4:
session = runtime visit, measure first).

### T3 — Depth vs session length
Professional lessons exceed one sitting (Empower 1C ≈ 24 items +
media + writing). Options: thin lessons (violates depth) or resumable
deep lessons (USAL proves viable). Position: deep lessons + item-cursor
resume; a lesson may span several sittings.

### T4 — Self-report vs measured evidence
Learning Log gives honest metacognition cheaply; risk is learners
over-claiming. Locked: self-report is a fourth channel, never feeding
mastery/scheduling. It decorates, never certifies.

### T5 — Local-first vs account-based content ops
USAL's server-side model enables cross-device + teacher monitoring.
SE's local-first wins privacy/offline but makes "teacher sees
progress" impossible without sync. Deferred — sync stays an optional
adapter, not V1 scope.

### T6 — Open-content coherence gap
Slot-level fill was 7 FULL/7 PARTIAL/1 GAP, but PARTIALs share one
cause: open sources don't arrive as a coherent graded sequence.
The USAL lesson-wrapper pattern is the coherence mechanism: SE's own
human-curated sequencing + normalization closes what no single source
provides. Cost: editorial work per lesson — accepted as SE's core
content job.

### T7 — Assessment honesty
Everyone ships formative; nobody open ships validated proficiency.
SE V1 tracks seven honest signals (presented/attempted/correct/
completed/practiced/self-reported/review-state) and labels them
honestly. Claiming level from activity completion is the industry-
standard dishonesty SE explicitly rejects.

## Contradictions still OPEN (to flag, not resolve)

- **Session sizing**: no source answers "how much can a beginner
  session hold". Telemetry question post-pilot.
- **Cue authoring at scale**: cue→reproduce feedback needs per-item
  cues; open question whether deterministic templates suffice or
  per-item authoring is required (content-cost question).
- **Spaced review granularity**: FSRS at item vs activity vs word?
  Evidence supports item-level scheduling; integration with lesson
  structure is SE's own design space.
- **Teacher/classroom channel**: USAL's teacher-monitoring model is
  proven demand-side value but conflicts with local-first privacy;
  parked for post-V1.
