import Ajv2020 from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";
import fixture from "./fixtures/greetings.lesson.json";
import schema from "./schema/lesson.schema.json";

const ajv = new Ajv2020({ strict: true, allErrors: true });
const validate = ajv.compile(schema);

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
});
