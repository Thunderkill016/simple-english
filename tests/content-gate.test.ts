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

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));
const firstField = (c: typeof course) =>
  c.units[0]!.lessons[0]!.sections[0]!.activities[0]!.items[0]!;
// traversal helper — JSON-inferred unions make item access awkward to type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allItems = (c: typeof course): any[] =>
  (c.units as any[]).flatMap((u) =>
    (u.lessons as any[]).flatMap((l) =>
      (l.sections as any[]).flatMap((s) =>
        (s.activities as any[]).flatMap((a) => a.items),
      ),
    ),
  );

describe("Human Content Gate — real pilot course", () => {
  it("passes on the shipped course+pack (fragments, transforms, gaps, media)", () => {
    const { errors, audit } = checkHumanContentGate(course, pack, io);
    expect(errors).toEqual([]);
    expect(audit.fieldCount).toBeGreaterThan(50);
    expect(audit.byKind.source).toBeGreaterThan(0);
    expect(audit.byKind.derived).toBeGreaterThan(0);
    expect(audit.byKind.gap).toBe(3);
  });

  it("exercises every deterministic transform used by the lesson", () => {
    const { audit } = checkHumanContentGate(course, pack, io);
    for (const op of [
      "SELECT_LINES",
      "BLANK_TOKEN",
      "TOKEN",
      "JOIN_VERBATIM_ITEMS",
      "ENUMERATE_ALPHABET",
      "ENUMERATE_CARDINALS",
    ])
      expect(audit.transformsUsed[op]).toBeGreaterThan(0);
  });

  it("records lineage: fragment ids, audiences, gap dispositions", () => {
    const { audit } = checkHumanContentGate(course, pack, io);
    expect(audit.fragmentsUsed.size).toBeGreaterThan(50);
    for (const g of audit.gaps) {
      const f = pack.fragments.find((x) => x.id === g.ref);
      expect(f?.audience).toBe("TEACHER");
    }
  });
});

describe("Human Content Gate — violations it must catch", () => {
  it("an instructional field without prov fails the gate", () => {
    const c = clone(course);
    const item = firstField(c) as never as { blocks: { prov?: unknown }[] };
    item.blocks[0]!.prov = undefined;
    const { errors } = checkHumanContentGate(c, pack, io);
    expect(errors.some((e: string) => e.includes("missing provenance"))).toBe(true);
  });

  it("a source ref that resolves to no fragment fails", () => {
    const c = clone(course);
    const item = firstField(c) as never as { blocks: { prov: { ref: string } }[] };
    item.blocks[0]!.prov.ref = "nonexistent-fragment";
    const { errors } = checkHumanContentGate(c, pack, io);
    expect(errors.some((e: string) => e.includes("does not resolve to a fragment"))).toBe(true);
  });

  it("text that does not match its verbatim fragment fails", () => {
    const c = clone(course);
    const item = firstField(c) as never as { blocks: { text: string }[] };
    item.blocks[0]!.text = "People meeting (paraphrased)";
    const { errors } = checkHumanContentGate(c, pack, io);
    expect(errors.some((e: string) => e.includes("≠ verbatim fragment"))).toBe(true);
  });

  it("derived text that does not recompute from its transform fails", () => {
    const c = clone(course);
    // dictation prompt 'Listen.' → TOKEN transform; corrupt the text
    const dict = allItems(c).find((i) => i.type === "dictation")!;
    dict.prompt.text = "Listen carefully.";
    const { errors } = checkHumanContentGate(c, pack, io);
    expect(errors.some((e: string) => e.includes("recomputes"))).toBe(true);
  });

  it("a transform op outside the allowlist fails", () => {
    const c = clone(course);
    const dict = allItems(c).find((i) => i.type === "dictation")!;
    dict.prompt.prov.transform.op = "REWRITE";
    const { errors } = checkHumanContentGate(c, pack, io);
    expect(errors.some((e: string) => e.includes("allowlist"))).toBe(true);
  });

  it("a gap field carrying text fails (withheld wording must stay withheld)", () => {
    const c = clone(course);
    const read = c.units[0]!.lessons[0]!.sections[0]!.activities[1]!.items[0]! as never as {
      blocks: Record<string, unknown>[];
    };
    const gap = read.blocks.find((b) => (b.prov as { kind?: string })?.kind === "gap")!;
    gap.text = "Sneaked-in teacher voice";
    const { errors } = checkHumanContentGate(c, pack, io);
    expect(errors.some((e: string) => e.includes("gap field must not carry text"))).toBe(true);
  });

  it("a gap pointing at a non-TEACHER fragment fails", () => {
    const c = clone(course);
    const read = c.units[0]!.lessons[0]!.sections[0]!.activities[1]!.items[0]! as never as {
      blocks: { prov: { kind: string; ref: string } }[];
    };
    const gap = read.blocks.find((b) => b.prov.kind === "gap")!;
    gap.prov.ref = "frag-kw-apartment";
    const { errors } = checkHumanContentGate(c, pack, io);
    expect(errors.some((e: string) => e.includes("TEACHER-audience"))).toBe(true);
  });

  it("an ASSESSMENT fragment backing a display field fails", () => {
    const c = clone(course);
    const item = firstField(c) as never as {
      blocks: { prov: { kind: string; ref: string }; text: string }[];
    };
    item.blocks[0]!.prov.ref = "frag-quiz-q1";
    item.blocks[0]!.text = "1. Who is she?";
    const { errors } = checkHumanContentGate(c, pack, io);
    expect(errors.some((e: string) => e.includes("may not back a display field"))).toBe(true);
  });

  it("a tampered fragment hash fails pack integrity", () => {
    const p = clone(pack);
    p.fragments[0]!.exactTextHash = "0".repeat(64);
    const { errors } = checkHumanContentGate(course, p, io);
    expect(errors.some((e: string) => e.includes("exactTextHash"))).toBe(true);
  });

  it("a fragment not contained in its asset's sourceText fails", () => {
    const p = clone(pack);
    const f = p.fragments.find((x) => x.id === "frag-topic-meeting")!;
    f.exactText = "Gathering of persons";
    f.exactTextHash = "0".repeat(64);
    const { errors } = checkHumanContentGate(course, p, io);
    expect(errors.some((e: string) => e.includes("not a contiguous substring"))).toBe(true);
  });

  it("a reusable asset without rights evidence fails", () => {
    const p = clone(pack);
    delete (p.assets[0] as { rightsEvidenceUrl?: string }).rightsEvidenceUrl;
    const { errors } = checkHumanContentGate(course, p, io);
    expect(errors.some((e: string) => e.includes("rightsEvidenceUrl"))).toBe(true);
  });

  it("media missing on disk fails when io reports it", () => {
    const { errors } = checkHumanContentGate(course, pack, {
      exists: () => false,
    });
    expect(errors.some((e: string) => e.includes("missing on disk"))).toBe(true);
  });

  it("a tampered media hash fails integrity", () => {
    const c = clone(course);
    for (const item of allItems(c))
      if (item.type === "media" && item.media.kind === "video")
        item.media.sha256 = "f".repeat(64);
    const { errors } = checkHumanContentGate(c, pack, io);
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
  it("a bare-string title fails schema validation (titles must be Fields)", () => {
    const c = clone(course);
    (c.units[0]!.lessons[0]!.sections[0] as { title: unknown }).title = "welcome!";
    expect(ajv.compile(courseSchema)(c)).toBe(false);
  });
  it("a selfeval item carrying options fails schema (options are UI chrome)", () => {
    const c = clone(course);
    const se = allItems(c).find((i) => i.type === "selfeval")!;
    se.options = [{ id: "x", text: { text: "y", prov: { kind: "source", ref: "frag-x" } } }];
    expect(ajv.compile(courseSchema)(c)).toBe(false);
  });
});
