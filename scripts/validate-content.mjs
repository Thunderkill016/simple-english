#!/usr/bin/env node
/**
 * Content pipeline validation (ADR-0002): every lesson fixture is validated
 * against the canonical JSON Schema here — at build/test time — so the
 * production client pays zero runtime validation cost for trusted content.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { checkLessonSemantics } from "./content-checks.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(
  readFileSync(join(root, "src/content/schema/lesson.schema.json"), "utf8"),
);
const fixturesDir = join(root, "src/content/fixtures");

const ajv = new Ajv2020({ strict: true, allErrors: true });
const validate = ajv.compile(schema);

let failed = false;
const files = readdirSync(fixturesDir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const data = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const schemaErrors = validate(data) ? [] : [ajv.errorsText(validate.errors)];
  const semanticErrors = schemaErrors.length === 0 ? checkLessonSemantics(data) : [];
  if (schemaErrors.length === 0 && semanticErrors.length === 0) {
    console.log(`✓ ${file}`);
  } else {
    failed = true;
    console.error(`✗ ${file}`);
    for (const err of [...schemaErrors, ...semanticErrors]) {
      console.error(`  ${err}`);
    }
  }
}

if (files.length === 0) {
  console.error("No content files found — nothing validated.");
  process.exit(1);
}

process.exit(failed ? 1 : 0);
