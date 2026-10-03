// Semantic content checks — cross-field rules JSON Schema cannot express.
// Shared by the validation CLI (scripts/validate-content.mjs) and unit tests.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourcesDir = join(root, "src/content/sources");

// Registry records keyed by id — single canonical provenance location.
const registry = new Map(
  readdirSync(sourcesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const record = JSON.parse(readFileSync(join(sourcesDir, f), "utf8"));
      return [record.id, record];
    }),
);

/** sha256 of a file, or undefined when it does not exist. */
function sha256Of(path) {
  if (!existsSync(path)) return undefined;
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

/**
 * @param {object} lesson - a lesson that already passed JSON Schema validation
 * @returns {string[]} human-readable error messages (empty = valid)
 */
export function checkLessonSemantics(lesson) {
  const errors = [];

  // --- Multi-source provenance ---
  const refs = Array.isArray(lesson.sourceRefs) ? lesson.sourceRefs : [];
  const refById = new Map();
  for (const ref of refs) {
    if (refById.has(ref.id)) {
      errors.push(`sourceRefs: duplicate id "${ref.id}"`);
      continue;
    }
    refById.set(ref.id, ref);
    const record = registry.get(ref.sourceId);
    if (!record) {
      errors.push(
        `sourceRefs["${ref.id}"]: sourceId "${ref.sourceId}" is not a registered source (src/content/sources/)`,
      );
    } else if (ref.use !== "reference" && record.reuseStatus === "prohibited") {
      errors.push(
        `sourceRefs["${ref.id}"]: source "${ref.sourceId}" is reuse-prohibited — use must be "reference"`,
      );
    }
  }

  const backedRefs = new Set();
  const mcIds = [];

  (lesson.blocks ?? []).forEach((block, i) => {
    const label = `blocks[${i}] (${block.id ?? block.title ?? block.type ?? "?"})`;
    const p = block?.provenance;
    if (p) {
      const ref = p.sourceRef ? refById.get(p.sourceRef) : undefined;
      if (p.kind === "se-authored") {
        if (p.sourceRef) {
          errors.push(
            `${label}: se-authored block must not claim sourceRef "${p.sourceRef}"`,
          );
        }
      } else {
        if (!p.sourceRef) {
          errors.push(`${label}: provenance kind "${p.kind}" requires sourceRef`);
        } else if (!ref) {
          errors.push(
            `${label}: provenance.sourceRef "${p.sourceRef}" is not declared in sourceRefs`,
          );
        } else if (ref.use !== p.kind) {
          // A reference-only source can never back reused/adapted content —
          // this is what stops copyrighted material from entering SE.
          errors.push(
            `${label}: provenance kind "${p.kind}" conflicts with sourceRef "${ref.id}" (use "${ref.use}")`,
          );
        } else {
          backedRefs.add(ref.id);
        }
      }
    }

    if (block?.type === "audio") {
      const asset = join(root, "public", block.src);
      const evidencePath = join(root, block.evidence);
      if (!existsSync(asset)) {
        errors.push(`${label}: audio src "${block.src}" has no file in public/`);
      }
      if (!existsSync(evidencePath)) {
        errors.push(`${label}: evidence file "${block.evidence}" not found`);
      } else {
        let ev;
        try {
          ev = JSON.parse(readFileSync(evidencePath, "utf8"));
        } catch {
          errors.push(`${label}: evidence file "${block.evidence}" is not valid JSON`);
        }
        if (ev) {
          for (const field of ["originalUrl", "assetUrl", "rightsBasis", "sha256", "retrievedAt"]) {
            if (!ev[field] && !(field === "originalUrl" && ev.assetUrl)) {
              errors.push(`${label}: evidence missing "${field}"`);
            }
          }
          if (ev.sha256) {
            const actual = sha256Of(asset);
            if (actual && actual !== ev.sha256) {
              errors.push(
                `${label}: audio file hash mismatch — evidence ${ev.sha256} vs file ${actual}`,
              );
            }
          }
        }
      }
      return;
    }

    if (block?.type === "external-embed") {
      // Provider label must match the actual embed host — prevents the
      // allowlist being used to smuggle arbitrary iframes.
      const EMBED_HOSTS = {
        youtube: ["www.youtube.com", "www.youtube-nocookie.com"],
      };
      try {
        const host = new URL(block.src).hostname;
        if (!(EMBED_HOSTS[block.provider] ?? []).includes(host)) {
          errors.push(
            `${label}: provider "${block.provider}" does not allow embed host "${host}"`,
          );
        }
      } catch {
        errors.push(`${label}: src is not a valid URL`);
      }
      return;
    }

    if (block?.type !== "multiple-choice") return;
    if (mcIds.includes(block.id)) {
      errors.push(`${label}: duplicate exercise id "${block.id}"`);
    }
    mcIds.push(block.id);
    const optionIds = (block.options ?? []).map((o) => o.id);
    if (!optionIds.includes(block.answer)) {
      errors.push(
        `${label}: answer "${block.answer}" is not one of the option ids [${optionIds.join(", ")}]`,
      );
    }
    const dupes = optionIds.filter((id, j) => optionIds.indexOf(id) !== j);
    if (dupes.length > 0) {
      errors.push(`${label}: duplicate option ids [${[...new Set(dupes)].join(", ")}]`);
    }
  });

  // Every reused/adapted sourceRef must back at least one block — a ref that
  // claims SE used content must be traceable to where it landed.
  for (const ref of refs) {
    if (ref.use !== "reference" && !backedRefs.has(ref.id)) {
      errors.push(
        `sourceRefs["${ref.id}"]: use "${ref.use}" but no block carries provenance to it`,
      );
    }
  }

  return errors;
}
