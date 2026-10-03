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
const sourceSchema = JSON.parse(
  readFileSync(join(root, "src/content/schema/source.schema.json"), "utf8"),
);
const contentDir = join(root, "src/content");
const sourcesDir = join(contentDir, "sources");

const ajv = new Ajv2020({ strict: true, allErrors: true });
const validate = ajv.compile(schema);
const validateSource = ajv.compile(sourceSchema);

let failed = false;

// Registry records are load-bearing provenance — they get their own schema.
const sourceFiles = readdirSync(sourcesDir).filter((f) => f.endsWith(".json"));
for (const file of sourceFiles) {
  const data = JSON.parse(readFileSync(join(sourcesDir, file), "utf8"));
  if (validateSource(data)) {
    console.log(`✓ sources/${file}`);
  } else {
    failed = true;
    console.error(`✗ sources/${file}`);
    console.error(`  ${ajv.errorsText(validateSource.errors)}`);
  }
}

/** Recursively collect *.lesson.json files (fixtures + real curriculum). */
function* lessonFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* lessonFiles(path);
    else if (entry.name.endsWith(".lesson.json")) yield path;
  }
}

const files = [...lessonFiles(contentDir)];

for (const path of files) {
  const name = path.slice(contentDir.length + 1);
  const data = JSON.parse(readFileSync(path, "utf8"));
  const schemaErrors = validate(data) ? [] : [ajv.errorsText(validate.errors)];
  const semanticErrors = schemaErrors.length === 0 ? checkLessonSemantics(data) : [];
  if (schemaErrors.length === 0 && semanticErrors.length === 0) {
    console.log(`✓ ${name}`);
  } else {
    failed = true;
    console.error(`✗ ${name}`);
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
