import { describe, expect, it } from "vitest";
import { evaluate, normalizeAnswer, type AttemptState } from "./feedback";

const start: AttemptState = { attempts: 0, resolved: undefined };

describe("evaluate — bounded attempts → reveal", () => {
  it("correct on first try resolves as correct", () => {
    const { state, event } = evaluate(start, true, 3, "hello");
    expect(state.resolved).toBe("correct");
    expect(event).toEqual({ kind: "correct" });
  });

  it("wrong answer retries while attempts remain", () => {
    const { state, event } = evaluate(start, false, 3, "hello");
    expect(state.resolved).toBeUndefined();
    expect(event).toEqual({ kind: "retry", attemptsLeft: 2 });
  });

  it("exhaustion reveals the verified answer (last resort, never generated)", () => {
    let s = start;
    for (let i = 0; i < 2; i++) s = evaluate(s, false, 3, "the answer").state;
    const { state, event } = evaluate(s, false, 3, "the answer");
    expect(state.resolved).toBe("revealed");
    expect(event).toEqual({ kind: "revealed", answer: "the answer" });
  });

  it("resolved items never reopen — evaluate is a no-op", () => {
    const resolved: AttemptState = { attempts: 1, resolved: "correct" };
    const { state, event } = evaluate(resolved, false, 3, "x");
    expect(state).toBe(resolved);
    expect(event.kind).toBe("correct");
  });

  it("late correctness still wins before exhaustion", () => {
    const s = evaluate(start, false, 2, "a").state; // 1 attempt used
    const { state, event } = evaluate(s, true, 2, "a");
    expect(state.resolved).toBe("correct");
    expect(event.kind).toBe("correct");
  });
});

describe("normalizeAnswer", () => {
  it("ignores case, punctuation and whitespace for free-text items", () => {
    expect(normalizeAnswer("  Nice to MEET you! ")).toBe("nice to meet you");
    expect(normalizeAnswer("I'm Anna.")).toBe("im anna");
    expect(normalizeAnswer("it’s late")).toBe("its late");
  });
});
