#!/usr/bin/env node
/**
 * Content pipeline validation (ADR-0002/0003):
 *   1. every *.sourcepack.json → source-pack schema
 *   2. every *.lesson.json     → v3 course schema
 *   3. every course            → Human Content Gate (provenance, rights,
 *                                media hashes on disk)
 *   4. emits docs/pilots/<pack>/gate-audit.json — the automated audit
 *      artifact required by Gate 1 (SOURCE INTEGRITY)
 *
 * Fails the build on any violation — the gate is code, not code review.
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { checkHumanContentGate } from "./content-gate.mjs";
import { loadEvidenceSet } from "./upstream-evidence.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "src/content");
const publicDir = join(root, "public");

const courseSchema = JSON.parse(
  readFileSync(join(contentDir, "schema/lesson-v3.schema.json"), "utf8"),
);
const packSchema = JSON.parse(
  readFileSync(join(contentDir, "schema/sourcepack.schema.json"), "utf8"),
);

const ajv = new Ajv2020({ strict: true, allErrors: true });
const validateCourse = ajv.compile(courseSchema);
const validatePack = ajv.compile(packSchema);

let failed = false;
const io = {
  exists: (src) => existsSync(join(publicDir, src)),
  sha256: (src) =>
    createHash("sha256")
      .update(readFileSync(join(publicDir, src)))
      .digest("hex"),
};

function* jsonFiles(dir, suffix) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* jsonFiles(path, suffix);
    else if (entry.name.endsWith(suffix)) yield path;
  }
}

const packs = new Map();
const evidenceSets = new Map();
for (const path of jsonFiles(join(contentDir, "sourcepacks"), ".sourcepack.json")) {
  const data = JSON.parse(readFileSync(path, "utf8"));
  if (!validatePack(data)) {
    failed = true;
    console.error(`✗ ${path}\n  ${ajv.errorsText(validatePack.errors)}`);
    continue;
  }
  packs.set(data.id, data);
  // Upstream evidence root (Task 006.2): the pack's text must equal the
  // committed evidence snapshots, verified by manifest hashes here.
  evidenceSets.set(
    data.id,
    loadEvidenceSet(join(root, "docs/sources/evidence", data.id)),
  );
  console.log(`✓ sourcepack ${data.id}`);
}

for (const path of jsonFiles(contentDir, ".lesson.json")) {
  const name = path.slice(contentDir.length + 1);
  const course = JSON.parse(readFileSync(path, "utf8"));
  if (!validateCourse(course)) {
    failed = true;
    console.error(`✗ ${name}\n  ${ajv.errorsText(validateCourse.errors)}`);
    continue;
  }
  const pack = packs.get(course.sourcePack);
  if (!pack) {
    failed = true;
    console.error(`✗ ${name}: sourcePack '${course.sourcePack}' not found`);
    continue;
  }
  const { errors, audit } = checkHumanContentGate(course, pack, {
    ...io,
    evidence: evidenceSets.get(pack.id),
  });
  if (errors.length > 0) {
    failed = true;
    console.error(`✗ ${name} — ${errors.length} gate violation(s)`);
    for (const e of errors) console.error(`  ${e}`);
  } else {
    console.log(
      `✓ ${name} — Human Content Gate PASS (${audit.fieldCount} fields: ` +
        `${audit.byKind.source} source · ${audit.byKind.derived} derived · ` +
        `${audit.byKind.editor} editor · ${audit.byKind.gap} gap)`,
    );
    const auditDir = join(root, "docs/pilots", pack.id);
    mkdirSync(auditDir, { recursive: true });
    writeFileSync(
      join(auditDir, "gate-audit.json"),
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          course: course.id,
          sourcePack: pack.id,
          upstreamEvidence: {
            ...audit.upstreamEvidence,
            snapshotSha256: Object.fromEntries(
              (evidenceSets.get(pack.id)?.manifest?.artifacts ?? []).map(
                (a) => [a.assetRef, a.extractedTextSha256],
              ),
            ),
          },
          instructionalFields: audit.fieldCount,
          byKind: audit.byKind,
          fragmentsUsed: [...audit.fragmentsUsed].sort(),
          transformsUsed: audit.transformsUsed,
          approvalsUsed: [...audit.approvalsUsed].sort(),
          fieldAudiences: audit.audiences,
          fragmentOrigins: audit.origins,
          gaps: audit.gaps,
          requiredGapsRemaining: audit.gaps.length,
          violations: [],
          // Two separate verdicts (Task 006.2): pipeline integrity is the
          // gate's PASS; learner-readiness additionally requires zero
          // unresolved editorial gaps.
          pipelineIntegrity: "PASS",
          learnerReady: audit.gaps.length === 0 ? "PASS" : "GAP",
          result: "PASS",
        },
        null,
        2,
      ) + "\n",
    );
  }
}

process.exit(failed ? 1 : 0);
