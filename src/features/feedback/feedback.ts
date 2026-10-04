// Feedback engine (ADR-0003) — bounded attempts → reveal, with source-backed
// cues only. Direction: wrong → cue (if one legitimately exists) → retry →
// reveal verified answer as last resort. Cues are never generated — an item
// either carries a provenanced cue or falls back to the simple verified path.

export type ItemOutcome = "correct" | "revealed" | "done" | "practiced";

export type FeedbackEvent =
  | { kind: "correct" }
  | { kind: "retry"; attemptsLeft: number }
  | { kind: "revealed"; answer: string };

export interface AttemptState {
  attempts: number;
  resolved: ItemOutcome | undefined;
}

/**
 * Evaluate an answer submission for an answerable item.
 * `correct` is decided by the caller against the verified source answer.
 */
export function evaluate(
  state: AttemptState,
  correct: boolean,
  maxAttempts: number,
  answerText: string,
): { state: AttemptState; event: FeedbackEvent } {
  if (state.resolved !== undefined) return { state, event: { kind: "correct" } };
  const attempts = state.attempts + 1;
  if (correct) {
    return {
      state: { attempts, resolved: "correct" },
      event: { kind: "correct" },
    };
  }
  if (attempts >= maxAttempts) {
    return {
      state: { attempts, resolved: "revealed" },
      event: { kind: "revealed", answer: answerText },
    };
  }
  return {
    state: { attempts, resolved: undefined },
    event: { kind: "retry", attemptsLeft: maxAttempts - attempts },
  };
}

/** exact-match normalization for free-text answers (dictation/cloze) */
export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"’‘“”]/g, "")
    .replace(/\s+/g, " ");
}
