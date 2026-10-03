import Ajv2020 from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";
import fixture from "./fixtures/greetings.lesson.json";
import schema from "./schema/lesson.schema.json";
import sourceSchema from "./schema/source.schema.json";
import sourceRecord from "./sources/pcc-esol-digital-workbook.json";

const ajv = new Ajv2020({ strict: true, allErrors: true });
const validate = ajv.compile(schema);
const validateSource = ajv.compile(sourceSchema);

describe("lesson JSON Schema", () => {
  it("accepts the greetings fixture", () => {
    expect(validate(fixture), ajv.errorsText(validate.errors)).toBe(true);
  });

  it("rejects a lesson missing a required property", () => {
    const { title: _dropped, ...noTitle } = fixture;
    expect(validate(noTitle)).toBe(false);
  });

  it("rejects an unknown block type", () => {
    const invalid = {
      ...fixture,
      blocks: [...fixture.blocks, { type: "video", src: "x.mp4" }],
    };
    expect(validate(invalid)).toBe(false);
  });

  it("rejects a multiple-choice block without an answer", () => {
    const invalid = {
      ...fixture,
      blocks: [
        {
          type: "multiple-choice",
          id: "q1",
          prompt: "Pick one",
          options: [
            { id: "a", text: "A" },
            { id: "b", text: "B" },
          ],
        },
      ],
    };
    expect(validate(invalid)).toBe(false);
  });

  const validEmbed = {
    type: "external-embed",
    provider: "youtube",
    title: "A video",
    src: "https://www.youtube.com/embed/abc123",
    sourceUrl: "https://www.youtube.com/watch?v=abc123",
    purpose: "Watch",
    fallbackUrl: "https://www.youtube.com/watch?v=abc123",
  };

  it("accepts a valid external-embed block", () => {
    expect(
      validate({ ...fixture, blocks: [...fixture.blocks, validEmbed] }),
    ).toBe(true);
  });

  it.each([
    ["unknown provider", { ...validEmbed, provider: "vimeo" }],
    ["non-HTTPS src", { ...validEmbed, src: "http://www.youtube.com/embed/x" }],
    ["javascript: src", { ...validEmbed, src: "javascript:alert(1)" }],
    ["missing sourceUrl", Object.fromEntries(Object.entries(validEmbed).filter(([k]) => k !== "sourceUrl"))],
    ["missing fallbackUrl", Object.fromEntries(Object.entries(validEmbed).filter(([k]) => k !== "fallbackUrl"))],
  ])("rejects an external-embed with %s", (_name, embed) => {
    expect(validate({ ...fixture, blocks: [...fixture.blocks, embed] })).toBe(false);
  });
});

describe("source record JSON Schema (load-bearing provenance)", () => {
  it("accepts the PCC source record", () => {
    expect(validateSource(sourceRecord), ajv.errorsText(validateSource.errors)).toBe(true);
  });

  it.each(["authors", "publisher", "licenseUrl", "verifiedAt", "reuseStatus"] as const)(
    "rejects a record missing %s",
    (field) => {
      const { [field]: _dropped, ...incomplete } = sourceRecord;
      expect(validateSource(incomplete)).toBe(false);
    },
  );
});
