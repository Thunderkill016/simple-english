// Human Content Gate v2 (ADR-0003, Task 006.1) — build/test-time enforcement
// that every learner-facing instructional English field resolves to verbatim
// source fragments, a recomputed deterministic transform, a recorded editor
// approval, or an explicit GAP at a teacher-voice fragment.
// Pure logic, no fs access here: callers pass {exists, sha256} resolvers.

import { createHash } from "node:crypto";

const norm = (s) => s.replace(/\s+/g, " ").trim();
const sha256 = (s) => createHash("sha256").update(s, "utf8").digest("hex");

const CARDINAL_NAMES = [
  "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen", "twenty",
];
const ALPHABET = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";

/** audience permitted per field position */
const AUDIENCE_RULES = {
  title: new Set(["METADATA", "LEARNER"]),
  display: new Set(["LEARNER", "METADATA"]),
  assessment: new Set(["LEARNER", "ASSESSMENT"]),
};
const GAP_CONTEXTS = new Set(["display"]);

const TRANSFORM_OPS = new Set([
  "VERBATIM",
  "SELECT_LINES",
  "BLANK_TOKEN",
  "TOKEN",
  "JOIN_VERBATIM_ITEMS",
  "ENUMERATE_ALPHABET",
  "ENUMERATE_CARDINALS",
]);

/**
 * Walk every instructional Field in a course and check provenance against
 * its source pack. Returns {errors, audit}; errors [] means pass.
 *
 * @param {object} course   parsed *.lesson.json (schemaVersion 3)
 * @param {object} pack     parsed *.sourcepack.json
 * @param {object} io       { exists(src), sha256(src), evidence } —
 *                          filesystem probes + committed upstream evidence
 *                          ({ errors, textByAsset }) — all optional
 */
export function checkHumanContentGate(course, pack, io = {}) {
  const errors = [];
  const assets = new Map(pack.assets.map((a) => [a.id, a]));
  const fragments = new Map((pack.fragments ?? []).map((f) => [f.id, f]));
  const approvals = new Map((pack.approvals ?? []).map((a) => [a.id, a]));

  const audit = {
    fieldCount: 0,
    byKind: { source: 0, derived: 0, editor: 0, gap: 0 },
    fragmentsUsed: new Set(),
    transformsUsed: {},
    approvalsUsed: new Set(),
    gaps: [],
    audiences: {},
    origins: {},
    upstreamEvidence: null,
  };

  // ---------- upstream evidence root (Task 006.2) ---------------------------
  // The pack must not self-bootstrap: when evidence is supplied, every text
  // asset's sourceText must equal the committed extracted snapshot verbatim.
  if (io.evidence) {
    for (const e of io.evidence.errors ?? []) errors.push(e);
    audit.upstreamEvidence = {
      evidenceSet: io.evidence.manifest?.evidenceSet ?? pack.id,
      artifacts: Object.keys(io.evidence.textByAsset ?? {}),
    };
    for (const a of pack.assets ?? []) {
      if (a.sourceText === undefined) continue;
      const expected = io.evidence.textByAsset?.[a.id];
      if (expected === undefined) {
        errors.push(
          `asset ${a.id}: sourceText present but no committed upstream evidence snapshot`,
        );
      } else if (a.sourceText !== expected) {
        errors.push(
          `asset ${a.id}: sourceText diverges from committed upstream evidence snapshot`,
        );
      }
    }
  }

  const frag = (ref) => fragments.get(ref);
  const fragAsset = (f) => assets.get(f.assetRef);

  /** origin gate: only VOA-produced-verified fragments may back content */
  function checkOrigin(f, path) {
    audit.origins[f.originStatus] = (audit.origins[f.originStatus] ?? 0) + 1;
    if (f.originStatus !== "VOA_PRODUCED_VERIFIED") {
      errors.push(
        `${path}: fragment '${f.id}' originStatus=${f.originStatus} may not back instructional content`,
      );
    }
  }

  // ---------- pack integrity: fragments ⊆ asset sourceText, hashes honest ----
  for (const f of pack.fragments ?? []) {
    const a = assets.get(f.assetRef);
    if (!a) {
      errors.push(`fragment ${f.id}: assetRef '${f.assetRef}' does not resolve`);
      continue;
    }
    if (a.sourceText && !norm(a.sourceText).includes(norm(f.exactText))) {
      errors.push(
        `fragment ${f.id}: exactText is not a contiguous substring of asset '${f.assetRef}'`,
      );
    }
    if (sha256(f.exactText) !== f.exactTextHash) {
      errors.push(`fragment ${f.id}: exactTextHash does not match sha256(exactText)`);
    }
  }

  // ---------- pack integrity: rights evidence --------------------------------
  for (const a of pack.assets ?? []) {
    if (a.rights === "reusable") {
      if (a.rightsStatus !== "VERIFIED")
        errors.push(`asset ${a.id}: reusable but rightsStatus=${a.rightsStatus}`);
      if (!a.rightsEvidenceUrl?.startsWith("https://"))
        errors.push(`asset ${a.id}: reusable without https rightsEvidenceUrl`);
      if (!a.rightsVerifiedAt)
        errors.push(`asset ${a.id}: reusable without rightsVerifiedAt`);
      if (a.thirdPartyStatus === "UNKNOWN")
        errors.push(`asset ${a.id}: reusable with unknown third-party status`);
    }
    if ((a.rights === "embed-only" || a.rights === "link-only") && a.local) {
      errors.push(`asset ${a.id}: ${a.rights} asset must not be ingested (has local)`);
    }
  }

  function refAudience(f, ctx) {
    return AUDIENCE_RULES[ctx].has(f.audience)
      ? null
      : `${f.audience} fragment '${f.id}' may not back a ${ctx} field`;
  }

  /** recompute a derived transform; returns {result} or {error} */
  function recompute(t, path) {
    const need = (ref) => {
      const f = frag(ref);
      if (!f) errors.push(`${path}: transform ref '${ref}' does not resolve to a fragment`);
      return f;
    };
    switch (t.op) {
      case "VERBATIM": {
        const f = need(t.ref);
        return f ? { result: f.exactText, refs: [t.ref] } : { refs: [t.ref] };
      }
      case "SELECT_LINES": {
        const sources = t.refs.map(need).filter(Boolean);
        for (const pick of t.picks) {
          if (!sources.some((f) => norm(f.exactText).includes(norm(pick)))) {
            errors.push(`${path}: SELECT_LINES pick '${pick.slice(0, 40)}…' not found in refs`);
          }
        }
        return { result: t.picks.join(t.sep), refs: t.refs };
      }
      case "BLANK_TOKEN": {
        const f = need(t.ref);
        if (!f) return { refs: [t.ref] };
        if (!norm(f.exactText).includes(norm(t.source))) {
          errors.push(`${path}: BLANK_TOKEN source not found in fragment '${t.ref}'`);
        }
        if (!t.source.includes(t.token)) {
          errors.push(`${path}: BLANK_TOKEN token '${t.token}' absent from source`);
        }
        return { result: t.source.replace(t.token, "__"), refs: [t.ref] };
      }
      case "TOKEN": {
        const f = need(t.ref);
        if (f && !norm(f.exactText).includes(norm(t.token))) {
          errors.push(`${path}: TOKEN '${t.token}' not found in fragment '${t.ref}'`);
        }
        return { result: t.token, refs: [t.ref] };
      }
      case "JOIN_VERBATIM_ITEMS": {
        const heads = t.refs.map((ref) => {
          const f = need(ref);
          return f ? norm(f.exactText).split(/\s+-\s+/)[0] : "";
        });
        return { result: heads.join(t.sep), refs: t.refs };
      }
      case "ENUMERATE_ALPHABET":
        need(t.ref);
        return { result: ALPHABET, refs: [t.ref] };
      case "ENUMERATE_CARDINALS": {
        need(t.ref);
        if (t.to > CARDINAL_NAMES.length) {
          errors.push(`${path}: ENUMERATE_CARDINALS only supports 1..${CARDINAL_NAMES.length}`);
        }
        return {
          result: CARDINAL_NAMES.slice(t.from - 1, t.to).join(", "),
          refs: [t.ref],
        };
      }
      default:
        errors.push(`${path}: transform op '${t.op}' is not in the deterministic allowlist`);
        return { refs: [] };
    }
  }

  function checkField(field, path, ctx) {
    audit.fieldCount++;
    if (field == null || typeof field !== "object" || field.prov == null) {
      errors.push(`${path}: instructional field missing provenance`);
      return;
    }
    const prov = field.prov;

    if (prov.kind === "gap") {
      if (!GAP_CONTEXTS.has(ctx)) {
        errors.push(`${path}: gap field not allowed in ${ctx} position`);
      }
      if ("text" in field) {
        errors.push(`${path}: gap field must not carry text (withheld wording)`);
      }
      const f = frag(prov.ref);
      if (!f) {
        errors.push(`${path}: gap ref '${prov.ref}' does not resolve to a fragment`);
      } else {
        if (f.audience !== "TEACHER") {
          errors.push(
            `${path}: gap ref '${prov.ref}' must point at a TEACHER-audience fragment`,
          );
        }
        checkOrigin(f, path);
        audit.fragmentsUsed.add(prov.ref);
      }
      audit.byKind.gap++;
      audit.gaps.push({ path, ref: prov.ref, note: prov.note });
      return;
    }

    if (typeof field.text !== "string" || field.text.trim().length === 0) {
      errors.push(`${path}: instructional field has empty text`);
      return;
    }

    if (prov.kind === "source") {
      const f = frag(prov.ref);
      if (!f) {
        errors.push(`${path}: source ref '${prov.ref}' does not resolve to a fragment`);
        return;
      }
      audit.fragmentsUsed.add(prov.ref);
      audit.audiences[f.audience] = (audit.audiences[f.audience] ?? 0) + 1;
      checkOrigin(f, path);
      const rule = refAudience(f, ctx);
      if (rule) errors.push(`${path}: ${rule}`);
      if (norm(field.text) !== norm(f.exactText)) {
        errors.push(
          `${path}: text ≠ verbatim fragment '${prov.ref}' (${f.locator})`,
        );
      }
      const a = fragAsset(f);
      if (a && a.rights !== "reusable") {
        errors.push(`${path}: fragment backed by non-reusable asset '${f.assetRef}'`);
      }
      audit.byKind.source++;
      return;
    }

    if (prov.kind === "derived") {
      const t = prov.transform;
      if (!t || !TRANSFORM_OPS.has(t.op)) {
        errors.push(`${path}: derived field missing allowlisted transform`);
        return;
      }
      const { result, refs } = recompute(t, path);
      for (const ref of refs ?? []) {
        const f = frag(ref);
        if (!f) continue;
        audit.fragmentsUsed.add(ref);
        audit.audiences[f.audience] = (audit.audiences[f.audience] ?? 0) + 1;
        checkOrigin(f, path);
        if (f.audience === "TEACHER") {
          errors.push(`${path}: transform reads TEACHER fragment '${ref}'`);
        }
        const rule = refAudience(f, ctx);
        if (rule) errors.push(`${path}: ${rule}`);
      }
      audit.transformsUsed[t.op] = (audit.transformsUsed[t.op] ?? 0) + 1;
      if (result !== undefined && norm(result) !== norm(field.text)) {
        errors.push(
          `${path}: transform ${t.op} recomputes to '${norm(result).slice(0, 60)}…' ≠ field text`,
        );
      }
      audit.byKind.derived++;
      return;
    }

    if (prov.kind === "editor") {
      const a = approvals.get(prov.ref);
      if (!a) {
        errors.push(`${path}: editor ref '${prov.ref}' does not resolve to an approval`);
        return;
      }
      audit.approvalsUsed.add(prov.ref);
      if (norm(field.text) !== norm(a.text)) {
        errors.push(`${path}: text ≠ approved text '${prov.ref}'`);
      }
      audit.byKind.editor++;
      return;
    }

    errors.push(`${path}: provenance kind '${prov.kind}' is not human-provenanced`);
  }

  function checkLocalMedia(media, path) {
    if (!media || media.kind === "embed") return;
    const declared = pack.assets.find(
      (a) => a.local && media.src.endsWith(a.local.replace(/^public\//, "")),
    );
    if (!declared) {
      errors.push(`${path}: media src '${media.src}' not declared in source pack`);
    } else {
      if (declared.rights !== "reusable") {
        errors.push(`${path}: media '${media.src}' backed by non-reusable asset '${declared.id}'`);
      }
      if (declared.sha256 && declared.sha256 !== media.sha256) {
        errors.push(`${path}: media sha256 in item ≠ source-pack sha256 for '${declared.id}'`);
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

  const ASSESSMENT_ITEMS = new Set(["mc", "dictation", "cloze"]);

  function checkItem(item, path) {
    const p = `${path}/item:${item.id}`;
    const ctx = ASSESSMENT_ITEMS.has(item.type) ? "assessment" : "display";
    switch (item.type) {
      case "read":
        item.blocks.forEach((b, i) => checkField(b, `${p}/blocks[${i}]`, ctx));
        break;
      case "media":
        checkField(item.title, `${p}/title`, "title");
        if (item.transcript) checkField(item.transcript, `${p}/transcript`, ctx);
        if (item.media.kind === "embed") checkEmbed(item.media, p);
        else checkLocalMedia(item.media, p);
        break;
      case "mc":
        checkField(item.prompt, `${p}/prompt`, ctx);
        if (item.media) checkLocalMedia(item.media, `${p}/stem`);
        item.options.forEach((o, i) => checkField(o.text, `${p}/options[${i}]`, ctx));
        if (!item.options.some((o) => o.id === item.answer)) {
          errors.push(`${p}: answer '${item.answer}' is not an option id`);
        }
        break;
      case "dictation":
        checkField(item.prompt, `${p}/prompt`, ctx);
        checkField(item.answer, `${p}/answer`, ctx);
        checkLocalMedia(item.media, `${p}/stem`);
        break;
      case "cloze":
        checkField(item.text, `${p}/text`, ctx);
        checkField(item.answer, `${p}/answer`, ctx);
        if (fieldText(item.text) && !fieldText(item.text).includes("__")) {
          errors.push(`${p}: cloze text has no blank marker`);
        }
        break;
      case "record":
        checkField(item.prompt, `${p}/prompt`, ctx);
        if (item.model) checkField(item.model, `${p}/model`, ctx);
        if (item.mediaModel) checkLocalMedia(item.mediaModel, `${p}/mediaModel`);
        break;
      case "write":
        checkField(item.prompt, `${p}/prompt`, ctx);
        if (item.model) checkField(item.model, `${p}/model`, ctx);
        break;
      case "note":
        checkField(item.prompt, `${p}/prompt`, ctx);
        break;
      case "selfeval":
        checkField(item.statement, `${p}/statement`, ctx);
        break;
      default:
        errors.push(`${p}: unknown item type '${item.type}'`);
    }
  }

  const fieldText = (f) => (f && typeof f === "object" ? f.text : undefined);

  checkField(course.title, `${course.id}/title`, "title");
  for (const unit of course.units) {
    checkField(unit.title, `${unit.id}/title`, "title");
    for (const lesson of unit.lessons) {
      checkField(lesson.title, `${lesson.id}/title`, "title");
      for (const section of lesson.sections) {
        checkField(section.title, `${section.id}/title`, "title");
        for (const activity of section.activities) {
          checkField(activity.title, `${activity.id}/title`, "title");
          activity.items.forEach((item) => checkItem(item, activity.id));
        }
      }
    }
  }

  return { errors, audit };
}
