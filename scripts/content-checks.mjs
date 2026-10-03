// Semantic content checks — cross-field rules JSON Schema cannot express.
// Shared by the validation CLI (scripts/validate-content.mjs) and unit tests.

/**
 * @param {object} lesson - a lesson that already passed JSON Schema validation
 * @returns {string[]} human-readable error messages (empty = valid)
 */
export function checkLessonSemantics(lesson) {
  const errors = [];
  (lesson.blocks ?? []).forEach((block, i) => {
    if (block?.type !== "multiple-choice") return;
    const label = `blocks[${i}] (${block.id ?? "?"})`;
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
