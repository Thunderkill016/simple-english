import { describe, expect, it } from "vitest";
import { checkLessonSemantics } from "../scripts/content-checks.mjs";
import fixture from "../src/content/fixtures/greetings.lesson.json";
import { curriculum, lessons } from "../src/content/lessons";

describe("semantic content checks (beyond JSON Schema)", () => {
  it("accepts the greetings fixture", () => {
    expect(checkLessonSemantics(fixture)).toEqual([]);
  });

  it("rejects an answer id that is not among the options", () => {
    const invalid = structuredClone(fixture) as {
      blocks: { answer?: string }[];
    };
    const mc = invalid.blocks.find((b) => b.answer !== undefined);
    if (mc) mc.answer = "z";
    const errors = checkLessonSemantics(invalid);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('"z" is not one of the option ids');
  });

  it("rejects duplicate option ids", () => {
    const invalid = structuredClone(fixture) as {
      blocks: { options?: { id: string; text: string }[] }[];
    };
    const mc = invalid.blocks.find((b) => b.options !== undefined);
    mc?.options?.push({ id: "a", text: "Duplicate" });
    const errors = checkLessonSemantics(invalid);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain("duplicate option ids");
  });

  it.each(lessons.map((l) => [l.id, l] as const))(
    "registered lesson %s passes semantic checks",
    (_id, lesson) => {
      expect(checkLessonSemantics(lesson)).toEqual([]);
    },
  );

  it("curriculum excludes synthetic fixtures", () => {
    expect(curriculum.length).toBeGreaterThan(0);
    expect(curriculum.every((l) => !l.source.synthetic)).toBe(true);
  });
});
