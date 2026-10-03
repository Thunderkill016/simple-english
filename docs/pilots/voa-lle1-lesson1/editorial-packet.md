# Editorial packet — VOA LLE1 Lesson 1 GAP dispositions

Task 006.1 hardening removed every teacher-voice string that had been shown
to learners verbatim. Each occurrence is now a **gap field**: it renders no
instructional English, and its provenance points at the TEACHER-audience
fragment it withholds. The build gate enforces the rule (a gap field carrying
text, or pointing at a non-TEACHER fragment, fails the build).

For each gap below, a human editor must write learner-facing wording (or
decide the field stays empty). Approved wording is recorded as a source-pack
`approvals[]` entry and the field flips to `kind: "editor"` — at which point
the gate verifies the rendered text equals the approved text byte-for-byte.

## GAP 1 — goal-setting advice (orient)

- **Field:** `orient-set-goal / item:orient-strategy / blocks[1]`
- **Withheld fragment:** `frag-t-strategy-advice` (lesson plan, p.5)
- **Source teacher-voice text:** "It is best to set a short-term and small
  goal. Remind them to focus on this goal as they study."
- **What the editor must produce:** learner-facing advice in the same spirit
  (e.g. guidance toward a small, short-term goal), or a decision that the
  "Set a Goal" heading + learner question suffice alone.

## GAP 2 — noticing explanation for verb BE (language-focus)

- **Field:** `focus-notice-be / item:focus-be-lines / blocks[0]`
- **Withheld fragment:** `frag-t-be-note` (lesson plan, p.6)
- **Source teacher-voice text:** "The conversation between Anna and Pete has
  questions and answers with the verb BE."
- **What the editor must produce:** a learner-facing noticing prompt for the
  six verbatim BE lines displayed directly below the gap (e.g. an instruction
  to read and find the questions), or removal of the block entirely.

## GAP 3 — writing task prompt (production)

- **Field:** `production-write / item:prod-convo-write / prompt`
- **Withheld fragment:** `frag-t-write` (lesson plan, p.7, Day 5)
- **Source teacher-voice text:** "Have students write a conversation between
  themselves and another student. They can model it on the lesson
  conversation. Or, they can make changes by using the names of teachers or
  classmates."
- **What the editor must produce:** a learner-facing writing prompt with the
  same task (write a conversation; may follow the displayed model
  conversation; may use other names). The verbatim Conversation model remains
  displayed as the `model` field — only the instruction is withheld.

## Disposition notes

- The plan's `frag-t-review` (Day-5 review instructions) and
  `frag-t-quiz-admin` (paper-quiz administration) fragments are extracted and
  audience-classified but currently unreferenced — the activities they
  correspond to were normalized differently (review → Learning-Log self-eval;
  quiz administration → the scored digital quiz). They remain in the pack for
  audit completeness.
- Gap fields render the chrome string "Wording awaiting editor approval."
  — interface text, not instructional content.
