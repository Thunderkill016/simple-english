#!/usr/bin/env node
/**
 * Source-pack builder (ADR-0003, Task 006.1).
 *
 * Generates src/content/sourcepacks/voa-lle1-lesson1.sourcepack.json:
 *   - embeds the verified source extractions as asset `sourceText`
 *   - declares every source FRAGMENT used by the lesson (verbatim substring,
 *     audience class, locator, sha256 of exactText)
 *   - verifies at generation time that each fragment is a normalized-contiguous
 *     substring of its asset's sourceText — a fragment that cannot be
 *     re-derived from the source fails the build here, not at review time
 *
 * Rights evidence: VOA-produced assets cite the official VOA copyright
 * statement (learningenglish.voanews.com/p/6021.html): "All text, audio and
 * video material produced exclusively by the Voice of America is in the
 * public domain." Third-party carve-out noted on that same page.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const packPath = join(
  root,
  "src/content/sourcepacks/voa-lle1-lesson1.sourcepack.json",
);

/**
 * Ground-truth extractions live in research_cache/ (local provenance
 * evidence, gitignored). On a fresh clone, fall back to the pack's own
 * embedded sourceText — regenerating then re-verifies the existing
 * fragments rather than re-extracting.
 */
function sourceTextFor(cacheFile, assetId) {
  try {
    return readFileSync(join(root, cacheFile), "utf8");
  } catch {
    const existing = JSON.parse(readFileSync(packPath, "utf8"));
    const a = existing.assets.find((x) => x.id === assetId);
    if (!a?.sourceText) throw new Error(`no sourceText for ${assetId}`);
    return a.sourceText;
  }
}
const planText = sourceTextFor("research_cache/voa/voa-l1.txt", "lesson-plan");
const pageText = sourceTextFor("research_cache/voa/voa-l1-page.txt", "learner-page");

const VERIFIED = "2026-10-03";
const EVIDENCE_URL = "https://learningenglish.voanews.com/p/6021.html";
const PD =
  "Public domain — VOA-produced material (official VOA copyright statement, credit required)";

/** whitespace-insensitive containment used for both generation and the gate */
const norm = (s) => s.replace(/\s+/g, " ").trim();
const sha256 = (s) => createHash("sha256").update(s, "utf8").digest("hex");

const rightsFor = {
  reusable: {
    rightsStatus: "VERIFIED",
    rightsEvidenceUrl: EVIDENCE_URL,
    rightsVerifiedAt: VERIFIED,
    thirdPartyStatus: "NONE_OBSERVED",
  },
  embedOnly: {
    rightsStatus: "THIRD_PARTY",
    rightsEvidenceUrl: "https://youtu.be/IpIhzFh0yw8",
    rightsVerifiedAt: VERIFIED,
    thirdPartyStatus: "PRESENT",
  },
  reference: {
    rightsStatus: "UNVERIFIED",
    thirdPartyStatus: "UNKNOWN",
  },
};

const assetBase = {
  creator: "Voice of America — Learning English",
  humanAuthorship: "human-authored",
};

const assets = [
  {
    id: "lesson-plan",
    title:
      "Let's Learn English Level 1 Lesson 1 'Welcome!' — official lesson plan (12pp)",
    ...assetBase,
    url: "https://docs.voanews.eu/en-US-LEARN/2022/06/07/c4dbd6af-5f63-4f28-bc42-0bd175f4e4b4.pdf",
    assetType: "document",
    rights: "reusable",
    license: PD,
    role: "curriculum authority — topics, goals, learning strategy, verbatim scripts, conversation transcript, key words + definitions, quiz text and instructions, activity instructions",
    sourceText: planText,
    ...rightsFor.reusable,
  },
  {
    id: "learner-page",
    title:
      "Let's Learn English - Level 1 - Lesson 1: Welcome! — official learner page",
    ...assetBase,
    url: "https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html",
    assetType: "page",
    rights: "reusable",
    license: PD,
    role: "learner-facing lesson page — titles, section order, conversation text, quiz entry",
    sourceText: pageText,
    ...rightsFor.reusable,
    thirdPartyStatus: "PRESENT",
    thirdPartyNotes:
      "Page hosts a third-party YouTube embed (alphabet song) and platform chrome; only VOA-produced text fragments are cited",
  },
  {
    id: "main-video",
    title: "Let's Learn English Level 1, Lesson 1 — main video (5:00)",
    ...assetBase,
    url: "https://voa-video.voanews.eu/pangeavideo/2021/02/5/5f/5f00c78a-0f84-41e6-949d-bd808bcadf50.mp4",
    assetType: "video",
    rights: "reusable",
    license: PD,
    local: "public/media/voa-lle1/voa-lle1-main-video.mp4",
    sha256:
      "a7bc9ee8405a07196a162e87fe68b52071c4c576289dc03840d9d4bfd97dce98",
    role: "primary input — Anna meets her new neighbors",
    ...rightsFor.reusable,
  },
  {
    id: "conversation-audio",
    title: "Lesson 1 conversation — audio (0:29)",
    ...assetBase,
    url: "https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html",
    assetType: "audio",
    rights: "reusable",
    license: PD,
    local: "public/media/voa-lle1/conversation.mp3",
    sha256:
      "11d3ee8a7f52615988b98f1e4addacaee35b0486cd6c8d8e7a08cf32b65a123b",
    role: "primary input — Pete/Anna conversation, repeatable",
    ...rightsFor.reusable,
  },
  {
    id: "speaking-practice-video",
    title: "Speaking Practice — Lesson 1 (2:27)",
    ...assetBase,
    url: "https://voa-video-ns.akamaized.net/pangeavideo/2016/02/9/95/95563cd7-fdac-421c-8e41-e7d85c25d375.mp4",
    assetType: "video",
    rights: "reusable",
    license: PD,
    local: "public/media/voa-lle1/voa-lle1-speaking-practice.mp4",
    sha256:
      "b5f4fe7107ad537c897ad5a171d114928159348202e89e3e7f554be05d58a519",
    role: "prepare — key words + record-yourself practice model",
    ...rightsFor.reusable,
  },
  {
    id: "pronunciation-video",
    title: "Pronunciation Practice — Lesson 1 (0:29)",
    ...assetBase,
    url: "https://voa-video-ns.akamaized.net/pangeavideo/2016/02/2/23/23242e5a-9c43-48c1-a8ef-7e963241bb23.mp4",
    assetType: "video",
    rights: "reusable",
    license: PD,
    local: "public/media/voa-lle1/voa-lle1-pronunciation.mp4",
    sha256:
      "5b280b0ab61b432d3f94e1e28b585083719786056e6f0e11e7a5fba09bc89c30",
    role: "language focus — I am → I'm contraction, slow/fast speech",
    ...rightsFor.reusable,
  },
  ...[1, 2, 3, 4, 5, 6].map((n) => ({
    id: `quiz-q${n}-video`,
    title: `Listening quiz stem — question ${n}`,
    ...assetBase,
    url: `https://learningenglish.voanews.com/Quiz/Start/3111026/${n}`,
    assetType: "video",
    rights: "reusable",
    license: PD,
    local: `public/media/voa-lle1/voa-lle1-quiz-q${n}.mp4`,
    sha256: {
      1: "3e0735627a2ffa7357a79a458d2f547af909acb43c28fe7802abdcc33daa36fe",
      2: "d6928e2eaef54193f8d2bc3dbda9b215d73ff7f3b1b94be13f298d31f517d419",
      3: "86fa266e48b955b9e0d1ce4d9ab9cbab1ea6a87f2a6288385767bb5f597895bf",
      4: "b2ecd1558c23d4b83a103dcfda6933e6fedae901f44ac440661525fd023898a9",
      5: "1b66dcdfef809b69e09d1c258b389373c4e0f1d86071b8a33a90180839c73016",
      6: "902fda2aae1d39b5d0f4a0d5cbe0763471523a5d4f2bd32d36015d11325a108e",
    }[n],
    role: `comprehension — audio stem for quiz question ${n}`,
    ...rightsFor.reusable,
  })),
  {
    id: "alphabet-video",
    title:
      "The Alphabet Song — YouTube embed referenced by the lesson plan",
    creator: "third-party YouTube channel (linked by VOA lesson plan)",
    url: "https://youtu.be/IpIhzFh0yw8",
    assetType: "embed",
    humanAuthorship: "unknown",
    rights: "embed-only",
    license:
      "YouTube platform terms — third-party asset, not VOA-produced; never ingested",
    role: "prepare — alphabet song support (optional, network-dependent)",
    ...rightsFor.embedOnly,
    thirdPartyNotes:
      "Entire asset is third-party YouTube content; embedded via sandboxed iframe only, never downloaded or re-served",
  },
  {
    id: "activity-sheets",
    title:
      "Activity Sheets: Alphabet and Numbers (referenced in lesson plan)",
    ...assetBase,
    url: "https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html",
    assetType: "document",
    rights: "reference",
    license: PD,
    role: "prepare — alphabet/numbers review reference",
    notes:
      "Referenced by the plan ('Prepare Before Class'); no standalone file was located on the lesson page — recorded as GAP; alphabet/number sets derived mechanically from the verified objective",
    ...rightsFor.reference,
  },
];

/**
 * Fragment = verbatim substring of a text asset's sourceText.
 * audience classes:
 *   LEARNER    — learner-facing material (scripts, definitions, prompts)
 *   METADATA   — titles/goals/topics shown as display information
 *   ASSESSMENT — quiz/dictation stems, prompts, options, answer key
 *   TEACHER    — teacher-voice text; never learner-facing (gap refs only)
 */
const F = (id, assetRef, audience, role, locator, exactText) => ({
  id,
  assetRef,
  audience,
  role,
  locator,
  exactText,
});

const P = "lesson-plan";
const PG = "learner-page";

const fragments = [
  // ---- METADATA: titles, headings, goals, topics ----
  F("frag-title-course", PG, "METADATA", "title", "page title block",
    "Let's Learn English - Level 1"),
  F("frag-title-unit", P, "METADATA", "title", "p.3 cover",
    "Level 1"),
  F("frag-title-lesson", PG, "METADATA", "title", "page title block",
    "Lesson 1: Welcome!"),
  F("frag-title-welcome", P, "METADATA", "title", "p.3 cover",
    "welcome!"),
  F("frag-topic-meeting", P, "METADATA", "topic", "p.3 Topics",
    "Meeting people"),
  F("frag-topic-introduce", P, "METADATA", "topic", "p.3 Topics",
    "Introduce yourself"),
  F("frag-goal-grammar", P, "METADATA", "goal", "p.3 Goals",
    "Grammar: Verb BE (I am) in introductions; BE + location"),
  F("frag-goal-speaking", P, "METADATA", "goal", "p.3 Goals",
    "Speaking: Meeting people; Ask question and answer “Are you (name)?”"),
  F("frag-goal-review", P, "METADATA", "goal", "p.3 Goals",
    "Review alphabet and numbers 1-20"),
  F("frag-goal-pron", P, "METADATA", "goal", "p.3 Goals",
    "Pronunciation: Pronouncing linked sounds"),
  F("frag-heading-goals", P, "METADATA", "heading", "p.3",
    "Goals"),
  F("frag-heading-strategy", P, "METADATA", "heading", "p.3 / p.5 Learning Strategy",
    "Learning Strategy"),
  F("frag-strategy-name", P, "METADATA", "heading", "p.3 Learning Strategy",
    "Set a Goal"),
  F("frag-heading-keywords", P, "METADATA", "heading", "p.7 Resources",
    "Key Words"),
  F("frag-heading-teachkw", P, "METADATA", "heading", "p.5 Day 2",
    "Teach Key Words"),
  F("frag-heading-present", P, "METADATA", "heading", "p.4 Day 1",
    "Present the Conversation"),
  F("frag-heading-quiz", P, "METADATA", "heading", "p.5 Listening Quiz",
    "Listening Quiz"),
  F("frag-heading-be", P, "METADATA", "heading", "p.6 Day 3",
    "Explain Questions and Answers Using BE"),
  F("frag-heading-writing", P, "METADATA", "heading", "p.7 Day 5",
    "Writing"),
  F("frag-heading-review", P, "METADATA", "heading", "p.7 Review",
    "Review"),
  F("frag-heading-mainscript", P, "METADATA", "heading", "p.4",
    "Main Video Script – Lesson 1"),
  F("frag-heading-pron", P, "METADATA", "heading", "p.6-7",
    "Pronunciation Practice"),
  F("frag-heading-alpha", P, "METADATA", "heading", "p.5",
    "Review the Alphabet"),
  F("frag-heading-numbers", P, "METADATA", "heading", "p.6 Day 4",
    "Numbers from 1 - 20"),
  F("frag-title-sp", P, "METADATA", "title", "p.5 'the Speaking Practice video'",
    "Speaking Practice"),
  F("frag-title-quiz", P, "METADATA", "title", "p.8 quiz paper heading",
    "Quiz - Level 1, Lesson 1: Welcome"),
  F("frag-title-page-alpha", PG, "METADATA", "title", "page embed heading",
    "Learn the alphabet"),
  F("frag-title-page-convo", PG, "METADATA", "title", "page section heading",
    "Conversation"),
  F("frag-alphabet-song", P, "METADATA", "title", "p.5 Review the Alphabet",
    "alphabet song"),

  // ---- LEARNER: learner-facing material ----
  F("frag-goal-question", P, "LEARNER", "prompt", "p.5 Learning Strategy (quoted learner question)",
    "What do you want to do in English after studying for three months?"),
  F("frag-kw-apartment", P, "LEARNER", "vocab-def", "p.7 Key Words",
    "apartment - n. a usually rented room or set of rooms that is part of a building and is used as a place to live"),
  F("frag-kw-meet", P, "LEARNER", "vocab-def", "p.7 Key Words",
    "meet - v. to see and speak to someone for the first time"),
  F("frag-kw-new", P, "LEARNER", "vocab-def", "p.7 Key Words",
    "new - adj. not known before; recently bought or rented"),
  F("frag-kw-nice", P, "LEARNER", "vocab-def", "p.8 Key Words",
    "nice - adj. good and enjoyable"),
  F("frag-kw-street", P, "LEARNER", "vocab-def", "p.8 Key Words",
    "street - n. a road in a city, town, or village"),
  F("frag-kw-try", P, "LEARNER", "vocab-def", "p.8 Key Words",
    "try - v. to make an effort to do something"),
  F("frag-kw-welcome", P, "LEARNER", "vocab-def", "p.8 Key Words",
    "welcome - interjection. used as a friendly greeting to someone who has arrived at a place"),
  F("frag-sp-script", P, "LEARNER", "script", "p.5 Speaking Practice video script",
    "Here’s how to practice.\n     Listen. (video recording of “apartment” plays)\n     Record yourself.\n     “Apartment.”\n     Then listen.\n     “Apartment”"),
  F("frag-main-script", P, "LEARNER", "script", "p.4 Main Video Script – Lesson 1",
    "1. Listen:                                          3. Listen:\n  Hi.                                                 Nice to meet you\n  Speak:                                              Speak:\n  Hi!                                                 Nice to meet you.\n  2. Listen:                                          4. Listen\n  I am Pete.                                          I’m Anna. A-N-N-A\n  Speak and say your name.                            Speak:\n  I am ________.                                      Speak and say your name.\n                                                      Then spell your name.\n                                                      I am ____________. __ __   ___ __ ___."),
  F("frag-cue-name-spell", P, "LEARNER", "prompt", "p.4 Main Video Script",
    "Speak and say your name.\n                                                      Then spell your name."),
  F("frag-record-model", P, "LEARNER", "model", "p.4 Main Video Script",
    "I am ____________. __ __   ___ __ ___."),
  F("frag-convo", P, "LEARNER", "script", "p.7 Resources: Conversation",
    "Pete: Hi! Are you Anna?\n Anna: Yes! Hi there! Are you Pete?\n Pete: I am Pete.\n Anna: Nice to meet you.\n Anna: Let’s try that again. I’m Anna.\n Pete: I’m Pete. “Anna” Is that A-N-A?\n Anna: No. A-N-N-A.\n Pete: Well, Anna with two “n’s” … Welcome to … 1400 Irving Street!\n Anna: My new apartment! Yes!"),
  F("frag-pron-script", P, "LEARNER", "script", "p.7 Pronunciation Practice Video Script",
    "1. Slow Speech:                            2.\n  I am Pete                                  I am\n                                             (video shows change to)\n  Fast Speech:                               I’m\n  I’m Pete.                                  Now you try it. Say your name.\n                                             I’m ___________."),
  F("frag-pron-cue", P, "LEARNER", "prompt", "p.7 Pronunciation Practice Video Script",
    "Now you try it. Say your name."),
  F("frag-pron-model", P, "LEARNER", "model", "p.7 Pronunciation Practice Video Script",
    "I’m ___________."),

  // ---- ASSESSMENT: quiz/dictation material (scored items only) ----
  F("frag-quiz-instr", P, "ASSESSMENT", "instruction", "p.8 quiz paper",
    "Listen. Circle the letter of the correct answer."),
  F("frag-quiz-q1", P, "ASSESSMENT", "prompt", "p.8",
    "1. Who is she?"),
  F("frag-quiz-q2", P, "ASSESSMENT", "prompt", "p.9",
    "2. Who is he?"),
  F("frag-quiz-q3", P, "ASSESSMENT", "prompt", "p.9",
    "3. What does the person say?"),
  F("frag-quiz-q4", P, "ASSESSMENT", "prompt", "p.8",
    "4. What does the person say?"),
  F("frag-quiz-q5", P, "ASSESSMENT", "prompt", "p.9",
    "5. What does Anna say?"),
  F("frag-quiz-q6", P, "ASSESSMENT", "prompt", "p.9",
    "6. What does Anna say?"),
  F("frag-q1-opt-a", P, "ASSESSMENT", "option", "p.8 q1", "Melissa"),
  F("frag-q1-opt-b", P, "ASSESSMENT", "option", "p.8 q1", "Mary"),
  F("frag-q1-opt-c", P, "ASSESSMENT", "option", "p.8 q1", "Maurice"),
  F("frag-q1-opt-d", P, "ASSESSMENT", "option", "p.8 q1", "Meghan"),
  F("frag-q2-opt-a", P, "ASSESSMENT", "option", "p.9 q2", "Joseph"),
  F("frag-q2-opt-b", P, "ASSESSMENT", "option", "p.9 q2", "Shawn"),
  F("frag-q2-opt-c", P, "ASSESSMENT", "option", "p.9 q2", "John"),
  F("frag-q2-opt-d", P, "ASSESSMENT", "option", "p.9 q2", "Josh"),
  F("frag-q3-opt-a1", P, "ASSESSMENT", "option", "p.9 q3",
    "Hello. My name is Russell."),
  F("frag-q3-opt-a2", P, "ASSESSMENT", "option", "p.9 q3",
    "Are you Sarah?"),
  F("frag-q3-opt-b", P, "ASSESSMENT", "option", "p.9 q3",
    "What is your name?"),
  F("frag-q3-opt-c1", P, "ASSESSMENT", "option", "p.9 q3",
    "Hello. What is your name?"),
  F("frag-q3-opt-c2", P, "ASSESSMENT", "option", "p.9 q3",
    "My name is John."),
  F("frag-q3-opt-d", P, "ASSESSMENT", "option", "p.9 q3",
    "Hi. I am Jill. Are you John?"),
  F("frag-q4-opt-a", P, "ASSESSMENT", "option", "p.8 q4",
    "Hi. I am Ross. Are you Jill’s friend?"),
  F("frag-q4-opt-b", P, "ASSESSMENT", "option", "p.8 q4",
    "Hello. I am Pete. Are you Anna?"),
  F("frag-q4-opt-c", P, "ASSESSMENT", "option", "p.8 q4",
    "Hi. I am Russell. Are you Anna’s friend?"),
  F("frag-q4-opt-d", P, "ASSESSMENT", "option", "p.8 q4",
    "Hello. I am John. Are you Mary?"),
  F("frag-q5-opt-a", P, "ASSESSMENT", "option", "p.9 q5", "Yes, Sam."),
  F("frag-q5-opt-b", P, "ASSESSMENT", "option", "p.9 q5", "Yes ma’am."),
  F("frag-q5-opt-c", P, "ASSESSMENT", "option", "p.9 q5", "Yes. I am."),
  F("frag-q6-opt-a", P, "ASSESSMENT", "option", "p.9 q6", "Ice cream, please!"),
  F("frag-q6-opt-b", P, "ASSESSMENT", "option", "p.9 q6", "Nice to meet you!"),
  F("frag-q6-opt-c", P, "ASSESSMENT", "option", "p.9 q6", "Nice to chew food!"),
  F("frag-q6-opt-d", P, "ASSESSMENT", "option", "p.9 q6", "Have a nice weekend!"),
  F("frag-dict-1", P, "ASSESSMENT", "stem", "p.5 read-aloud stems",
    "Hi, I am Mary."),
  F("frag-dict-2", P, "ASSESSMENT", "stem", "p.5 read-aloud stems",
    "Hi, I am John."),
  F("frag-dict-3", P, "ASSESSMENT", "stem", "p.5 read-aloud stems",
    "Hi, I am Jill. Are you John?"),
  F("frag-dict-4", P, "ASSESSMENT", "stem", "p.5 read-aloud stems",
    "Hi. I am Russell. Are you Anna’s friend?"),
  F("frag-dict-5", P, "ASSESSMENT", "stem", "p.5 read-aloud stems",
    "Yes, I am."),
  F("frag-dict-6", P, "ASSESSMENT", "stem", "p.5 read-aloud stems",
    "Nice to meet you!"),

  // ---- TEACHER: never learner-facing; gap refs only ----
  F("frag-t-strategy-advice", P, "TEACHER", "advice", "p.5 Learning Strategy",
    "It is best to set a short-term and small goal. Remind them to focus on this goal as they\n study."),
  F("frag-t-be-note", P, "TEACHER", "note", "p.6 Day 3",
    "The conversation between Anna and Pete has questions and answers with the verb BE."),
  F("frag-t-write", P, "TEACHER", "instruction", "p.7 Day 5 Writing",
    "Have students write a conversation between themselves and another student. They can\n model it on the lesson conversation. Or, they can make changes by using the names of\n teachers or classmates."),
  F("frag-t-review", P, "TEACHER", "instruction", "p.7 Review",
    "Play the video again. Have students repeat, then ask students to form pairs and practice\n introducing themselves, spelling their own names, and asking others how to spell their\n names."),
  F("frag-t-quiz-admin", P, "TEACHER", "instruction", "p.5 Listening Quiz",
    "Give each student a paper copy of the listening quiz. Play each question’s video and pause\n for students to answer. Ask students to choose the correct answer."),
];

// ---- generation-time verification: every fragment ⊆ its asset's sourceText ----
const sourceByAsset = new Map(
  assets.filter((a) => a.sourceText).map((a) => [a.id, a.sourceText]),
);
const failures = [];
for (const f of fragments) {
  const src = sourceByAsset.get(f.assetRef);
  if (!src) failures.push(`${f.id}: asset '${f.assetRef}' has no sourceText`);
  else if (!norm(src).includes(norm(f.exactText)))
    failures.push(`${f.id}: exactText not a contiguous substring of ${f.assetRef}`);
}
if (failures.length) {
  console.error("Fragment verification FAILED:");
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

const seenIds = new Set();
for (const f of fragments) {
  if (seenIds.has(f.id)) {
    console.error(`duplicate fragment id ${f.id}`);
    process.exit(1);
  }
  seenIds.add(f.id);
  f.exactTextHash = sha256(f.exactText);
}

const pack = {
  id: "voa-lle1-lesson1",
  title:
    "VOA Let's Learn English Level 1 — Lesson 1: Welcome! — complete source pack",
  canonicalUrl:
    "https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html",
  assets,
  fragments,
  approvals: [],
};

writeFileSync(packPath, JSON.stringify(pack, null, 2) + "\n");
console.log(
  `✓ wrote ${packPath} — ${assets.length} assets, ${fragments.length} fragments (all verified ⊆ sourceText)`,
);
