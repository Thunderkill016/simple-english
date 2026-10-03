import { describe, expect, it } from "vitest";
import { checkLessonSemantics } from "../scripts/content-checks.mjs";
import fixture from "../src/content/fixtures/greetings.lesson.json";
import { curriculum } from "../src/content/curriculum";

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

  it.each(curriculum.map((l) => [l.id, l] as const))(
    "curriculum lesson %s passes semantic checks",
    (_id, lesson) => {
      expect(checkLessonSemantics(lesson)).toEqual([]);
    },
  );

  it("curriculum excludes synthetic fixtures", () => {
    expect(curriculum.length).toBeGreaterThan(0);
    expect(curriculum.every((l) => l.authoredBy !== "SE fixture")).toBe(true);
  });
});

describe("multi-source provenance (canonical lessons)", () => {
  const real = curriculum[0];
  if (!real) throw new Error("expected at least one real lesson");

  it("rejects a sourceId that is not in the registry", () => {
    const invalid = structuredClone(real);
    invalid.sourceRefs[0]!.sourceId = "not-a-source";
    const errors = checkLessonSemantics(invalid);
    expect(
      errors.some((e) => e.includes('"not-a-source" is not a registered source')),
    ).toBe(true);
  });

  it("rejects duplicate sourceRef ids", () => {
    const invalid = structuredClone(real);
    invalid.sourceRefs.push(structuredClone(invalid.sourceRefs[0]!));
    const errors = checkLessonSemantics(invalid);
    expect(errors.some((e) => e.includes("duplicate id"))).toBe(true);
  });

  it("rejects an adapted/reused block pointing at a reference-only ref", () => {
    const invalid = structuredClone(real);
    const ref = invalid.sourceRefs.find((r) => r.use === "reference");
    if (!ref) throw new Error("expected a reference sourceRef in the lesson");
    const block = invalid.blocks.find(
      (b) => b.provenance?.kind === "adapted",
    );
    if (!block?.provenance) throw new Error("expected an adapted block");
    block.provenance.sourceRef = ref.id;
    const errors = checkLessonSemantics(invalid);
    expect(errors.some((e) => e.includes("conflicts with sourceRef"))).toBe(true);
  });

  it("rejects a reused/adapted block without a sourceRef", () => {
    const invalid = structuredClone(real);
    const block = invalid.blocks.find(
      (b) => b.provenance?.kind === "adapted",
    );
    if (!block?.provenance) throw new Error("expected an adapted block");
    delete block.provenance.sourceRef;
    const errors = checkLessonSemantics(invalid);
    expect(errors.some((e) => e.includes("requires sourceRef"))).toBe(true);
  });

  it("rejects a se-authored block claiming an external sourceRef", () => {
    const invalid = structuredClone(real);
    const block = invalid.blocks.find(
      (b) => b.provenance?.kind === "se-authored",
    );
    if (!block?.provenance) throw new Error("expected a se-authored block");
    block.provenance.sourceRef = invalid.sourceRefs[0]!.id;
    const errors = checkLessonSemantics(invalid);
    expect(errors.some((e) => e.includes("must not claim sourceRef"))).toBe(true);
  });

  it("rejects a provenance sourceRef not declared in sourceRefs", () => {
    const invalid = structuredClone(real);
    const block = invalid.blocks.find(
      (b) => b.provenance?.kind === "adapted",
    );
    if (!block?.provenance) throw new Error("expected an adapted block");
    block.provenance.sourceRef = "ghost-ref";
    const errors = checkLessonSemantics(invalid);
    expect(errors.some((e) => e.includes("not declared in sourceRefs"))).toBe(
      true,
    );
  });

  it("rejects a reused/adapted sourceRef that no block uses", () => {
    const invalid = structuredClone(real);
    invalid.sourceRefs.push({
      id: "dangling-ref",
      sourceId: "voa-lets-learn-english-level-1",
      itemUrl: "https://learningenglish.voanews.com/p/5644.html",
      role: "claimed but unused",
      use: "adapted",
    });
    const errors = checkLessonSemantics(invalid);
    expect(errors.some((e) => e.includes("no block carries provenance"))).toBe(
      true,
    );
  });
});

describe("audio media checks (local rights-verified assets)", () => {
  const real = curriculum[0];
  if (!real) throw new Error("expected at least one real lesson");
  const audio = real.blocks.find((b) => b.type === "audio");
  if (!audio || audio.type !== "audio") {
    throw new Error("expected the canonical lesson to carry a local audio asset");
  }

  it("the canonical audio passes: file + evidence + sha256 verified", () => {
    expect(checkLessonSemantics(real)).toEqual([]);
  });

  it("rejects an audio src with no local file", () => {
    const invalid = structuredClone(real);
    const a = invalid.blocks.find((b) => b.type === "audio");
    if (a?.type === "audio") a.src = "/media/does-not-exist.mp3";
    const errors = checkLessonSemantics(invalid);
    expect(errors.some((e) => e.includes("has no file in public/"))).toBe(true);
  });

  it("rejects a missing evidence file", () => {
    const invalid = structuredClone(real);
    const a = invalid.blocks.find((b) => b.type === "audio");
    if (a?.type === "audio") a.evidence = "docs/sources/evidence/nope.json";
    const errors = checkLessonSemantics(invalid);
    expect(errors.some((e) => e.includes("evidence file"))).toBe(true);
  });
});
