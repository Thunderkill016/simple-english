# USA Learns — Learner State Machine (R1.4A, observed live)

All states verified by direct interaction unless marked CLAIM (docs)
or UNKNOWN. Server-side persistence; every transition survives reload
and re-login by construction (observed across navigations).

## 1. Entity hierarchy

```text
Learner
└── ClassRegistration            (enrollment; "Start this class")
    └── Unit state               (derived from activities)
        └── Lesson state         (derived from activities)
            └── ACTIVITY STATE   (the only thing actually tracked)
                └── ActivityAttempt  (new GUID per entry)
                    └── Item attempt (PermittedAttempts=2)
```

URL shape confirms it: `/learning/{units|lessons|activities}/{classRegId}/{entityId}`
and `begin-activity` mints a new `ActivityAttemptIdentity` on every entry.

## 2. Activity lifecycle

```text
NOT_STARTED ──enter──▶ IN_PROGRESS ──finish(all items/screens)──▶ COMPLETE
   (empty □)              (half □)                                   (full ■)
                              │
                              └── leave early (Menu/nav) ──▶ stays IN_PROGRESS
                                                              next entry:
                                                              NEW attempt,
                                                              restart at item 1
```

Observed transitions:
- Enter "Learning Goals", leave via Menu → iconComplete-half.svg.
- Re-enter "Listening Match" (half) → new attempt GUID, "1 of 8".
- Finish "Meaning Match" at 22% → iconComplete-Full.svg + "22%".
- Unscored text activity ("Welcome!") → Full after single Next.

## 3. Score channel (orthogonal to completion)

```text
SCOREABLE?
├── — (em dash)   never scored: readings, videos, speaking,
│                 learning log, presentations, goals
└── • (dot)     scored on completion → NN% on completion
```

Score persists the value; completing again overwrites (observed docs:
repeat allowed unlimited, "improve your score"; overwrite-vs-best
UNKNOWN in detail).

80% threshold: advisory text only (CLAIM: official how-to-study). No
gate observed — 22% activity shows FULL and learner proceeds.

## 4. Item-level attempt cycle (scored exercises)

```text
ITEM shown
  → submit ──correct──▶ "Correct! Now press Next." → next item
  → submit ──wrong────▶ "Incorrect. Try again." (attempt++)
  → submit ──wrong & attempts exhausted──▶ "See the correct answer above."
                                           (answer revealed, Next appears,
                                            item scores 0)
```

PermittedAttempts = 2 observed in: Meaning Match, Check Your
Understanding (E1+). Dictation uses free-text input, same model.

## 5. Course-level navigation state

```text
NOT ENROLLED  → "Start this class"
ENROLLED      → "Go to my next activity" (first incomplete in order)
                "Select a different unit"
                "Start over" (full reset — destructive, offered openly)
```

Resume pointer = next incomplete activity (linear order across
units/lessons/activities). No time dimension, no due queue, no
staleness handling observed — the pointer never "forgets".

## 6. What the machine does NOT contain

- No due/scheduled review edges (no SRS anywhere).
- No item-level resume (mid-activity progress discarded on exit).
- No attempt history visible to learner (only latest % per activity).
- No mastery/level state (no CEFR/NRS inference shown to learner —
  NRS mapping exists only in teacher docs).
- No streaks, XP, time-on-task visible to learner.
- No offline transition path.

## 7. Minimal viable state SE can infer (clean-room)

```text
activityState: NOT_STARTED | IN_PROGRESS | COMPLETE
activityScore: NONE | PENDING | percent
attempt:      { activityId, startedAt, itemCursor }
item:         { correct | wrong(attempts) | revealed }
coursePointer: nextIncompleteActivityId
selfEval:     { wordsIKnown[], canDo[] }   // Learning Log channel
```

SE additions needed that USAL lacks: dueAt/scheduling layer, item-level
resume (or deliberate activity-level resume + justification), sync
metadata, attempt history for analytics, separate formative-vs-
proficiency channels.
