# Lesson 001 Source Comparison — "Meet Someone"

Date: 2026-10-03
Auditor: Devin
Task: `task/005-multisource-lesson-001`

## Learning target (fixed before comparison)

> A learner meets someone for the first time.
> They should be able to:
>
> 1. say hello
> 2. say their name
> 3. respond when another person introduces themselves

Explicit non-goals for this lesson: "How are you?", alphabet/spelling,
phone/email/address, countries/nationality, verb-BE grammar tables,
formal business introductions, time. These were used only to understand
each source, not scored.

## Prior hypothesis (tested, not assumed)

VOA Let's Learn English as primary backbone; Evergreen for structure;
PCC for practice; American English for naturalness benchmark.
The comparison below either confirms or rejects each part on evidence.

---

## 1. VOA Learning English — Let's Learn English Level 1, Lesson 1 "Welcome!"

- Publisher: Voice of America (USAGM, U.S. federal broadcaster)
- Item: https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html
- Inspected: main video (5:00, mp4 240p–1080p), Speaking Practice video
  (2:27), Pronunciation video (0:29), **Conversation MP3 (0:29.6, 64 kbps,
  236,944 bytes)** hosted on VOA's own CDN
  `voa-audio.voanews.eu/vle/2016/02/08/49485bf8-4277-47f6-9abe-617ee2473f8c.mp3`,
  on-page transcript, JS listening quiz, lesson download page.
- Rights page: https://learningenglish.voanews.com/p/6861.html —
  "Learning English texts, MP3s, photos and videos are in the public
  domain. You are allowed to reprint them for educational and commercial
  purposes, with credit to learningenglish.voanews.com." Excludes
  AP/Reuters/AFP agency material. The lesson is VOA-produced
  (byline "VOA - Voice of America English News").

Transcript (verbatim from the page):

```
Pete: Hi! Are you Anna?
Anna: Yes! Hi there! Are you Pete?
Pete: I am Pete.
Anna: Nice to meet you.
Anna: Let's try that again. I'm Anna. Nice to meet you.
Pete: I'm Pete. "Anna" Is that A-N-A?
Anna: No. A-N-N-A
Pete: Well, Anna with two "n's" ... Welcome to ... 1400 Irving Street!
Anna: My new apartment! Yes!
```

- Strengths: the only audited source that is (a) built for independent
  absolute beginners, (b) carries a real audio model of exactly the target
  capability, (c) public domain. The dialogue is short, natural, and
  contains a self-repair move ("Let's try that again") that models real
  speech. 52-week course → durable future supply with uniform rights.
- Weaknesses: the single lesson also teaches spelling the name and an
  address (beyond our target — reject those lines for the model); the
  5:00 video is too heavy for Lesson 001; quiz requires page JS.
- Self-study / absolute-beginner fit: highest of all candidates.

Educational score: **88/100**
(14 beginner fit, 8 objective, 14 language model, 9 listening,
8 speaking/production, 9 pronunciation, 7 exercise/feedback,
10 self-study, 4 naturalness, 5 progression)

Rights: **REUSE/ADAPT** — public domain, credit required.
Can copy: yes. Adapt: yes. Host: yes. Embed: yes. Link: yes.
Caveat: verify each asset is VOA-produced (no agency media) — the
selected MP3 is on VOA's CDN with a VOA byline; SHA-256 evidence retained
(`docs/sources/evidence/voa-lle1-conversation.json`).

Potential SE role: **primary language model + listening input**.

---

## 2. Evergreen Valley College — Listening & Speaking for Beginning ELL, Ch.1

- Publisher: Evergreen Valley College via LibreTexts (OER)
- Item: https://human.libretexts.org/Courses/Evergreen_Valley_College/Listening_and_Speaking_for_Beginning_English_Language_Learners/01:_Greetings_and_Introductions
- Inspected: chapter overview + section 1.1 Listening and Speaking
  (3 listenings with Preview → Listen → Comprehension Check → Speaking);
  sections 1.2 Pronunciation, 1.3 Grammar, 1.4 Vocabulary identified from
  the TOC (syllables, subject pronouns + possessives, greeting vocabulary).
- License: CC BY 4.0 (page metadata `license:ccby, licenseversion:40`).
- Declared level: **high-beginning**.

- Strengths: clean reusable lesson staging pattern — activate
  (preview/check what you say) → listen → comprehension check → speaking;
  strongest pronunciation coverage of any candidate; comprehension items
  are simple Yes/No checks an absolute beginner can attempt.
- Weaknesses for this target: listenings mix in "Where are you from?",
  the alphabet, spelling names, email/phone — all beyond our capability;
  every speaking activity requires classmates ("Work in pairs/groups");
  audio is embedded players (not downloadable, hosting/host unclear);
  content level is above absolute A1.
- Self-study fit: poor — it is a classroom textbook.

Educational score: **67/100**
(9, 7, 10, 8, 7, 9, 6, 4, 3, 4)

Rights: **ADAPT** (CC BY 4.0, attribution). Used here as **reference**
only — its staging pattern informs SE lesson order; no content copied.

Potential SE role: **structure model** (Preview → model → check → produce).

---

## 3. PCC / Open Oregon — A Digital Workbook for Beginning ESOL

- Publisher: Portland Community College / Open Oregon Educational Resources
- Item: https://openoregon.pressbooks.pub/esol23/chapter/chapter-1-2/
  (Beginning → Greetings, audited in Task 003; evidence retained in
  `docs/sources/evidence/pcc-esol-l1m1-greetings.h5p-metadata.json`)
- License: CC BY 4.0 "except where otherwise noted"; the audited H5P
  dialogue item is CC0; embedded YouTube is third-party.

- Strengths: best exercise mechanics — interactive H5P items with
  immediate feedback, genuinely built for beginning self-study.
- Weaknesses for this target: no audio at all on the audited items;
  dialogues are fragmentary fill-in-the-blank, not a full natural model;
  its greeting content teaches "How are you?" (Lesson 002 territory);
  H5P embed endpoint is CDN-blocked cross-origin (verified live).
- Self-study fit: moderate (workbook inside a course context).

Educational score: **53/100**
(11, 7, 8, 2, 2, 1, 8, 7, 3, 4)

Rights: **ADAPT** (CC BY/CC0 item-level). Used here as **reference** —
its H5P-style instant-feedback exercise mechanics already shaped SE's
exercise pattern; no content copied into this lesson.

Potential SE role: **practice-mechanics reference**.

---

## 4. American English (U.S. Dept. of State) — Everyday Conversations

- Publisher: U.S. Bureau of International Informational Programs
  (State Dept.)
- Item: https://americanenglish.state.gov/resources/everyday-conversations-learning-american-english
- Inspected: full dialogue list, per-dialogue MP3s
  (e.g. `dialogue_1-04_informal_introductions.mp3`), PDF text + language
  notes. Dialogues 1-1..1-4 cover greetings/introductions.
- Rights: U.S. Government work — public domain under 17 U.S.C. §105;
  State Dept. policy (public domain unless copyright indicated; cite the
  Department) is corroborated by Georgetown University Library's open
  resources guide and Wikimedia Commons hosting the identical PDF marked
  public domain. Target audience: 6th–7th grade EFL learners.

- Strengths: most natural register range of any candidate — real
  informal models ("let me introduce you", "Nice to meet you" → "You,
  too") plus usage notes written for learners; MP3 per dialogue.
- Weaknesses: no exercises, no speaking path, no scaffolding — a reading
  reference, not a lesson; formal-third-party introductions are beyond
  target; audio is longer contextual dialogue, not the minimal model.
- Self-study fit: moderate as reference material.

Educational score: **48/100**
(8, 6, 12, 7, 1, 0, 1, 6, 5, 2)

Rights: **REUSE-possible** (public domain) — but used here as
**reference**: it verified that "Nice to meet you (too)" and informal
"Hi/I'm + name" are the right natural target set. No dialogue copied.

Potential SE role: **naturalness benchmark**.

---

## 5. USA Learns — 1st English Course (beginning video course)

- Publisher: Sacramento County Office of Education (originally funded by
  U.S. DoE + California DoE)
- Item: https://www.usalearns.org/1st-free-online-english-course
- Inspected: public course pages and policy pages — 20-unit video-based
  course (Ms. Marquez classroom storyline), interactive
  listening/reading/writing/speaking activities, unit tests with scores,
  NRS levels 2–3 (low/high beginning), mobile-optimized since 2021.
  Lesson content itself sits behind learner registration — inspection
  limited to public structure/policy pages (recorded honestly).

- Strengths: purpose-built adult self-study sequence; richest
  activity/test coverage; production (record-your-voice) support.
- Weaknesses: requires account; slower video-first pacing; content not
  directly inspectable without registration.
- Self-study fit: high.

Educational score: **75/100**
(12, 7, 9, 8, 8, 6, 8, 9, 3, 5)

Rights: **REFERENCE_ONLY** — Sacramento COE holds "full ownership
rights"; no reuse license is granted on the site; its AUP prohibits
infringement. Nothing may be copied; comparison only.

Potential SE role: **structure/scope reference** (what a beginner
sequence looks like), not a content supplier.

---

## 6. Oxford Online English — "English Greetings and Introductions" (free lesson)

- Publisher: Oxford Online English (commercial school)
- Item: https://www.oxfordonlineenglish.com/greetings-introductions
- Inspected: full lesson page — embedded video lesson, downloadable PDF,
  three-registered dialogue models (formal / neutral / informal), and a
  20-question interactive quiz (requires free sign-up).

- Strengths: sharpest naturalness/register coverage — explicit guidance
  on which phrases fit which situations; good "introduce someone else"
  extension; professional model quality.
- Weaknesses: register breadth (business meetings, "What's up, my lady?",
  in-law scenarios) is beyond an absolute beginner; no speaking path;
  quiz behind account wall.
- Self-study fit: moderate.

Educational score: **54/100**
(6, 7, 13, 5, 1, 2, 6, 6, 5, 3)

Rights: **REFERENCE_ONLY** — commercial copyrighted material; free to
view, not licensed for reuse.

Potential SE role: **naturalness benchmark** (rejected as supplier).

---

## Scores at a glance

| Source                        | Ed. score | Rights                        | Decision                                |
| ----------------------------- | --------- | ----------------------------- | --------------------------------------- |
| VOA Let's Learn English L1    | 88        | Public domain (credit)        | **Primary** — adapt model + reuse audio |
| USA Learns                    | 75        | Copyrighted (Sacramento COE)  | Reference only                          |
| Evergreen Valley (LibreTexts) | 67        | CC BY 4.0                     | Reference — staging pattern             |
| Oxford Online English         | 54        | Copyrighted                   | Reference only                          |
| PCC / Open Oregon             | 53        | CC BY 4.0 (item-level varies) | Reference — exercise mechanics          |
| American English              | 48        | Public domain (17 USC §105)   | Reference — naturalness benchmark       |

Educational quality is scored independently of rights; a copyrighted
source keeps its pedagogy score but passes through the reuse gate
separately (see `docs/curriculum/source-selection-rubric.md`).

## Primary winner

**BEST PRIMARY SOURCE FOR LESSON 001: VOA Learning English — Let's
Learn English Level 1, Lesson 1 "Welcome!"** — hypothesis **confirmed**.

- Why it wins: it is the only source that simultaneously (a) targets
  independent absolute beginners, (b) contains an exact audio model of
  the target capability (greet → name → respond), and (c) is public
  domain — so SE can legally serve the audio locally instead of relying
  on a third-party embed.
- What it still lacks: a scoped lesson (spelling/address is inside its
  dialogue — SE trims the _model_ to the target lines while keeping the
  full audio + transcript as authentic input); an interactive practice
  surface (SE supplies its own exercise); an explicit capability
  statement (SE supplies it).

## Secondary contributors

- BEST STRUCTURE SOURCE: **Evergreen Valley** — Preview/activate →
  listen → comprehension → speak staging (adapted for self-study: the
  partner tasks become a solo speak-aloud step).
- BEST LISTENING SOURCE: **VOA** — the 29.6 s conversation MP3.
- BEST PRONUNCIATION SOURCE: **VOA** (29 s pronunciation video) and
  Evergreen (syllables section) both reviewed — **decision: defer** a
  dedicated pronunciation step; Lesson 001 gets pronunciation support
  implicitly via the short, replayable audio model + speak-aloud
  practice. No IPA, no extra media.
- BEST PRACTICE SOURCE: **PCC** — instant-feedback interactive item
  mechanics (already the SE exercise pattern).
- BEST NATURALNESS BENCHMARK: **American English** — confirmed the
  target chunk set is natural informal English (incl. the "too"
  response), with Oxford Online English corroborating.

## Rejected material

- VOA main video (5:00, 9.9–69.7 MB) — too heavy/long for Lesson 001;
  linked from the source record instead of embedded.
- VOA speaking-practice (2:27) and pronunciation (0:29) videos — not
  needed once the audio model + speak-aloud step exist (media budget).
- VOA dialogue lines on spelling ("Is that A-N-A?"), the address and the
  apartment — beyond target capability.
- Evergreen: "Where are you from?" threads, alphabet/spelling,
  email/phone tasks, all pair/group speaking activities, embedded-only
  audio.
- American English: formal greetings and formal/third-party
  introductions, all language-note prose.
- PCC: every item (its greeting content is "How are you?" — Lesson 002;
  no audio).
- USA Learns / Oxford Online English: all content — reference-only
  rights.
