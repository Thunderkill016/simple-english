// Semantic content checks — cross-field rules JSON Schema cannot express.
// Shared by the validation CLI (scripts/validate-content.mjs) and unit tests.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourcesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/content/sources",
);

// Registry records keyed by id — single canonical provenance location.
const registry = new Map(
  readdirSync(sourcesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const record = JSON.parse(readFileSync(join(sourcesDir, f), "utf8"));
      return [record.id, record];
    }),
);

/**
 * @param {object} lesson - a lesson that already passed JSON Schema validation
 * @returns {string[]} human-readable error messages (empty = valid)
 */
export function checkLessonSemantics(lesson) {
  const errors = [];

  // Provenance: non-synthetic content must reference a registered source
  // and resolve license + URL from either lesson overrides or the record.
  const source = lesson.source ?? {};
  if (!source.synthetic) {
    const record = registry.get(source.id);
    if (!record) {
      errors.push(
        `source.id "${source.id}" is not a registered source (src/content/sources/)`,
      );
    }
    if (!(source.license ?? record?.license)) {
      errors.push("no license information (source.license or registry record)");
    }
    if (!(source.url ?? record?.url)) {
      errors.push("no provenance URL (source.url or registry record)");
    }
    if (
      source.adapted === true &&
      (!Array.isArray(source.adaptationNotes) || source.adaptationNotes.length === 0)
    ) {
      errors.push("adapted lesson must record source.adaptationNotes");
    }
  }

  // Exercise + embed semantics
  const EMBED_HOSTS = {
    youtube: ["www.youtube.com", "www.youtube-nocookie.com"],
    h5p: ["openoregon.pressbooks.pub"],
  };
  const mcIds = [];
  (lesson.blocks ?? []).forEach((block, i) => {
    const label = `blocks[${i}] (${block.id ?? block.title ?? "?"})`;
    if (block?.type === "external-embed") {
      // Provider label must match the actual embed host — prevents the
      // allowlist being used to smuggle arbitrary iframes.
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
  return errors;
}
