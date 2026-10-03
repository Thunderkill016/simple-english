import { describe, expect, it } from "vitest";
import Ajv2020 from "ajv/dist/2020.js";
// @ts-expect-error — plain-node gate module shared with the build script
import { checkHumanContentGate } from "../scripts/content-gate.mjs";
import course from "../src/content/lessons/voa-lle1.lesson1.lesson.json";
import pack from "../src/content/sourcepacks/voa-lle1-lesson1.sourcepack.json";
import courseSchema from "../src/content/schema/lesson-v3.schema.json";
import packSchema from "../src/content/schema/sourcepack.schema.json";

const io = { exists: () => true, sha256: (src: string) => findHash(src) };

function findHash(src: string): string {
  type MediaHolder = { media?: { src?: string; sha256?: string } };
  const items: MediaHolder[] = course.units[0]!.lessons[0]!.sections.flatMap(
    (s) => s.activities.flatMap((a) => a.items as MediaHolder[]),
  );
  for (const item of items)
    if (item.media?.src === src && item.media.sha256) return item.media.sha256;
  return "0".repeat(64);
}

describe("Human Content Gate — real pilot course", () => {
  it("passes on the shipped course+pack (provenance + rights + media)", () => {
    const { errors, fieldCount } = checkHumanContentGate(course, pack, io);
    expect(errors).toEqual([]);
    expect(fieldCount).toBeGreaterThan(50);
  });

  it("every provenance ref resolves to a source-pack asset", () => {
    const ids = new Set(pack.assets.map((a: { id: string }) => a.id));
    const { fieldCount } = checkHumanContentGate(course, pack, io);
    expect(fieldCount).toBeGreaterThan(0);
    for (const asset of pack.assets) expect(ids.has(asset.id)).toBe(true);
  });
});

describe("Human Content Gate — violations it must catch", () => {
  const clone = () => JSON.parse(JSON.stringify(course));

  it("an instructional field without prov fails the gate", () => {
    const c = clone();
    const item = c.units[0].lessons[0].sections[0].activities[0].items[0];
    // strip provenance from the first instructional field
    (item.blocks ? item.blocks[0] : item.prompt).prov = undefined;
    const { errors } = checkHumanContentGate(c, pack, io);
    expect(errors.some((e: string) => e.includes("missing provenance"))).toBe(true);
  });

  it("a ref that does not resolve in the pack fails", () => {
    const c = clone();
    const item = c.units[0].lessons[0].sections[0].activities[0].items[0];
    (item.blocks ? item.blocks[0] : item.prompt).prov.ref = "nonexistent-asset";
    const { errors } = checkHumanContentGate(c, pack, io);
    expect(errors.some((e: string) => e.includes("does not resolve"))).toBe(true);
  });

  it("media missing on disk fails when io reports it", () => {
    const { errors } = checkHumanContentGate(course, pack, {
      exists: () => false,
    });
    expect(errors.some((e: string) => e.includes("missing on disk"))).toBe(true);
  });

  it("a tampered media hash fails integrity", () => {
    const c = clone();
    for (const s of c.units[0].lessons[0].sections)
      for (const a of s.activities)
        for (const item of a.items)
          if (item.media?.kind === "video" && item.media.sha256)
            item.media.sha256 = "f".repeat(64);
    const { errors } = checkHumanContentGate(c, pack, io);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e: string) => e.includes("sha256 mismatch"))).toBe(true);
  });
});

describe("JSON Schemas", () => {
  const ajv = new Ajv2020({ strict: true });
  it("course validates against lesson-v3 schema", () => {
    expect(ajv.compile(courseSchema)(course)).toBe(true);
  });
  it("source pack validates against its schema", () => {
    expect(ajv.compile(packSchema)(pack)).toBe(true);
  });
});
