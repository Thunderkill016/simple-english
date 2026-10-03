// Human Content Gate (ADR-0003) — build/test-time enforcement that every
// learner-facing instructional English field has valid human provenance.
// Pure logic, no fs access here: callers pass {exists, sha256} resolvers.

const ALLOWED_KINDS = new Set(["source", "adapted", "editor", "derived"]);

/**
 * Walk every instructional Field in a course and check provenance against
 * its source pack. Returns a list of violation strings; [] means pass.
 *
 * @param {object} course   parsed *.lesson.json (schemaVersion 3)
 * @param {object} pack     parsed *.sourcepack.json
 * @param {object} io       { exists(src), sha256(src) } — filesystem probes,
 *                          optional (media hash checks skipped when absent)
 */
export function checkHumanContentGate(course, pack, io = {}) {
  const errors = [];
  const assets = new Map(pack.assets.map((a) => [a.id, a]));
  const seen = [];

  const asset = (ref) => assets.get(ref);

  function checkField(field, path) {
    if (field == null || typeof field !== "object" || field.prov == null) {
      errors.push(`${path}: instructional field missing provenance`);
      return;
    }
    if (typeof field.text !== "string" || field.text.trim().length === 0) {
      errors.push(`${path}: empty instructional text`);
    }
    const { kind, ref, note } = field.prov ?? {};
    if (!ALLOWED_KINDS.has(kind)) {
      errors.push(`${path}: provenance kind '${kind}' is not human-provenanced`);
      return;
    }
    if (typeof ref !== "string" || !asset(ref)) {
      errors.push(`${path}: sourceRef '${ref}' does not resolve in source pack`);
      return;
    }
    const a = asset(ref);
    if (a.rights === "link-only" || a.rights === "embed-only") {
      errors.push(
        `${path}: '${ref}' is ${a.rights} — cannot back instructional content`,
      );
    }
    if (kind === "source" || kind === "adapted") {
      if (a.rights !== "reusable") {
        errors.push(
          `${path}: '${kind}' field backed by non-reusable asset '${ref}' (${a.rights})`,
        );
      }
      if (a.humanAuthorship === "unknown") {
        errors.push(`${path}: '${ref}' has unknown human authorship`);
      }
    }
    if (kind === "derived") {
      if (a.rights !== "reusable" && a.rights !== "reference") {
        errors.push(
          `${path}: derived field backed by '${ref}' (${a.rights}) — transforms require a reusable or reference source`,
        );
      }
      if (!note || note.trim().length === 0) {
        errors.push(`${path}: derived field must declare its transform (prov.note)`);
      }
    }
    if (kind === "editor" && a.humanAuthorship !== "human-approved") {
      errors.push(
        `${path}: editor-approved field backed by '${ref}' which is not human-approved`,
      );
    }
    seen.push({ path, ref });
  }

  function checkLocalMedia(media, path) {
    if (!media || media.kind === "embed") return;
    const owning = pack.assets.find((a) => a.local && `media/${a.local.split("/").slice(1).join("/")}` === media.src);
    const declared = pack.assets.find(
      (a) => a.local && media.src.endsWith(a.local.replace(/^public\//, "")),
    );
    const a = owning ?? declared;
    if (!a) {
      errors.push(`${path}: media src '${media.src}' not declared in source pack`);
    } else {
      if (a.rights !== "reusable") {
        errors.push(`${path}: media '${media.src}' backed by non-reusable asset '${a.id}'`);
      }
      if (a.sha256 && a.sha256 !== media.sha256) {
        errors.push(`${path}: media sha256 in item ≠ source-pack sha256 for '${a.id}'`);
      }
    }
    if (io.exists && !io.exists(media.src)) {
      errors.push(`${path}: media file missing on disk: ${media.src}`);
    }
    if (io.sha256 && io.exists?.(media.src)) {
      const actual = io.sha256(media.src);
      if (actual !== media.sha256) {
        errors.push(`${path}: sha256 mismatch for ${media.src} (item ${media.sha256} ≠ file ${actual})`);
      }
    }
  }

  function checkEmbed(media, path) {
    if (media.provider !== "youtube") {
      errors.push(`${path}: unapproved embed provider '${media.provider}'`);
    }
    const a = pack.assets.find(
      (x) => x.rights === "embed-only" && media.sourceUrl.startsWith("http"),
    );
    if (!a) errors.push(`${path}: embed has no embed-only source-pack asset`);
  }

  function checkItem(item, path) {
    const p = `${path}/item:${item.id}`;
    switch (item.type) {
      case "read":
        item.blocks.forEach((b, i) => checkField(b, `${p}/blocks[${i}]`));
        break;
      case "media":
        checkField(item.title, `${p}/title`);
        if (item.transcript) checkField(item.transcript, `${p}/transcript`);
        if (item.media.kind === "embed") checkEmbed(item.media, p);
        else checkLocalMedia(item.media, p);
        break;
      case "mc":
        checkField(item.prompt, `${p}/prompt`);
        if (item.media) checkLocalMedia(item.media, `${p}/stem`);
        item.options.forEach((o, i) => checkField(o.text, `${p}/options[${i}]`));
        if (!item.options.some((o) => o.id === item.answer)) {
          errors.push(`${p}: answer '${item.answer}' is not an option id`);
        }
        break;
      case "dictation":
        checkField(item.prompt, `${p}/prompt`);
        checkField(item.answer, `${p}/answer`);
        checkLocalMedia(item.media, `${p}/stem`);
        break;
      case "cloze":
        checkField(item.text, `${p}/text`);
        checkField(item.answer, `${p}/answer`);
        if (!item.text.text.includes("__")) {
          errors.push(`${p}: cloze text has no blank marker`);
        }
        break;
      case "record":
        checkField(item.prompt, `${p}/prompt`);
        if (item.model) checkField(item.model, `${p}/model`);
        if (item.mediaModel) checkLocalMedia(item.mediaModel, `${p}/mediaModel`);
        break;
      case "write":
        checkField(item.prompt, `${p}/prompt`);
        if (item.model) checkField(item.model, `${p}/model`);
        break;
      case "note":
        checkField(item.prompt, `${p}/prompt`);
        break;
      case "selfeval":
        checkField(item.statement, `${p}/statement`);
        item.options.forEach((o, i) => checkField(o.text, `${p}/options[${i}]`));
        break;
      default:
        errors.push(`${p}: unknown item type '${item.type}'`);
    }
  }

  for (const unit of course.units)
    for (const lesson of unit.lessons)
      for (const section of lesson.sections) {
        if (typeof section.title === "object") checkField(section.title, `${section.id}/title`);
        for (const activity of section.activities) {
          if (typeof activity.title === "object")
            checkField(activity.title, `${activity.id}/title`);
          activity.items.forEach((item) => checkItem(item, activity.id));
        }
      }

  return { errors, fieldCount: seen.length };
}
