// Upstream evidence loader (ADR-0003, Task 006.2) — loads a committed
// evidence set (manifest + raw artifacts + extracted text snapshots) and
// verifies every declared sha256 against the files on disk. This is the
// root of the provenance chain: upstream evidence → sourceText →
// fragments → transforms → learner fields. The generated sourcepack is
// never consulted here.

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const fileSha256 = (p) =>
  createHash("sha256").update(readFileSync(p)).digest("hex");

/**
 * Load and verify an evidence set directory.
 * Returns { errors, manifest, textByAsset } — evidence is trustworthy
 * only when errors is empty.
 */
export function loadEvidenceSet(dir) {
  const errors = [];
  const textByAsset = {};
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
  } catch {
    return {
      errors: [`evidence set ${dir}: manifest.json missing or unreadable`],
      manifest: null,
      textByAsset,
    };
  }
  for (const a of manifest.artifacts ?? []) {
    const tag = `evidence ${manifest.evidenceSet}/${a.assetRef}`;
    for (const [key, hashKey] of [
      ["rawArtifact", "rawArtifactSha256"],
      ["extractedText", "extractedTextSha256"],
    ]) {
      const file = a[key];
      const expected = a[hashKey];
      if (!file || !expected) {
        errors.push(`${tag}: manifest missing ${key}/${hashKey}`);
        continue;
      }
      const p = join(dir, file);
      if (!existsSync(p)) {
        errors.push(`${tag}: ${file} missing on disk`);
        continue;
      }
      const actual = fileSha256(p);
      if (actual !== expected) {
        errors.push(`${tag}: ${file} sha256 mismatch (committed ${expected.slice(0, 12)}… ≠ disk ${actual.slice(0, 12)}…)`);
      }
    }
    const textPath = a.extractedText && join(dir, a.extractedText);
    if (textPath && existsSync(textPath)) {
      textByAsset[a.assetRef] = readFileSync(textPath, "utf8");
    }
  }
  return { errors, manifest, textByAsset };
}
