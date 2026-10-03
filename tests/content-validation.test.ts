import { describe, expect, it } from "vitest";
import { checkLessonSemantics } from "../scripts/content-checks.mjs";
import fixture from "../src/content/fixtures/greetings.lesson.json";
import { curriculum, lessons } from "../src/content/curriculum";

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

describe("provenance requirements (non-synthetic lessons)", () => {
  const real = lessons.find((l) => !l.source.synthetic);
  if (!real) throw new Error("expected at least one real lesson");

  it("rejects a source.id that is not in the registry", () => {
    const invalid = structuredClone(real);
    invalid.source.id = "not-a-source";
    expect(checkLessonSemantics(invalid)).toContain(
      'source.id "not-a-source" is not a registered source (src/content/sources/)',
    );
  });

  it("rejects an adapted lesson without adaptationNotes", () => {
    const invalid = structuredClone(real);
    delete invalid.source.adaptationNotes;
    expect(checkLessonSemantics(invalid)).toContain(
      "adapted lesson must record source.adaptationNotes",
    );
  });

  it("rejects non-synthetic content that resolves no license", () => {
    const invalid = structuredClone(real);
    delete invalid.source.license;
    delete invalid.source.url;
    invalid.source.id = "ghost-source"; // unregistered → no record fallback
    const errors = checkLessonSemantics(invalid);
    expect(errors).toContain(
      "no license information (source.license or registry record)",
    );
    expect(errors).toContain(
      "no provenance URL (source.url or registry record)",
    );
  });
});
