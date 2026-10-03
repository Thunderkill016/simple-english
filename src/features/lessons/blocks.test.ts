import { describe, expect, it } from "vitest";
import { optionState } from "./blocks";

describe("exercise option visual state", () => {
  it("keeps an unchecked option neutral regardless of feedback", () => {
    expect(optionState(false, "incorrect", false)).toBe("neutral");
    expect(optionState(false, "correct", false)).toBe("neutral");
    expect(optionState(false, null, true)).toBe("neutral");
  });

  it("marks the checked option as selected before any check", () => {
    expect(optionState(true, null, false)).toBe("selected");
  });

  it("marks a wrong selection as incorrect — never success-green", () => {
    expect(optionState(true, "incorrect", false)).toBe("incorrect");
  });

  it("marks a correct selection as correct, including a persisted completed answer", () => {
    expect(optionState(true, "correct", false)).toBe("correct");
    expect(optionState(true, null, true)).toBe("correct");
  });
});
