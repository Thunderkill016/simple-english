# SE Source Selection Rubric

How SE chooses material for a canonical lesson. Two independent gates —
educational quality is scored on its own, then rights decide what may
actually enter SE. An excellent copyrighted source keeps its score but
may contribute nothing but influence.

## Gate 1 — Educational quality (100 points)

Score each candidate lesson/item against the same narrow capability:

| Dimension                    | Pts | What earns full marks                                            |
| ---------------------------- | --- | ---------------------------------------------------------------- |
| Beginner fit                 | 15  | Designed for the declared learner; nothing beyond the capability |
| Clarity of objective         | 10  | Learner-facing goal exists or is obvious                         |
| Quality of language model    | 15  | Natural, accurate, complete target model (not fragments)         |
| Listening quality            | 10  | Real audio/voices matched to the model                           |
| Speaking / production        | 10  | A way for the learner to produce the language                    |
| Pronunciation support        | 10  | Models/noticing that aid pronunciation (not IPA dumps)           |
| Exercise / feedback quality  | 10  | Tasks with immediate, unambiguous feedback                       |
| Self-study suitability       | 10  | Works without a teacher or classmates                            |
| Authenticity / naturalness   | 5   | How people actually talk                                         |
| Progression / cognitive load | 5   | Order that builds; load an absolute beginner carries             |

Do not score by brand reputation. Score the actual inspected lesson,
not the homepage. Record what was inspected (URL, asset, length).

## Gate 2 — Reuse suitability

Assign one classification:

| Class          | Meaning                                                    |
| -------------- | ---------------------------------------------------------- |
| REUSE          | Copy/serve the item as-is (e.g. public-domain audio)       |
| ADAPT          | Modify under license (e.g. CC BY text → simplified blocks) |
| EMBED          | Include via the original host's supported player only      |
| LINK_ONLY      | Learner may open the original; nothing enters SE           |
| REFERENCE_ONLY | Read, compare, learn patterns — copy nothing               |
| PROHIBITED     | Explicitly forbidden; do not touch                         |
| UNKNOWN        | Rights unresolved — treat as REFERENCE_ONLY until resolved |

Then record: commercial compatibility, attribution requirement,
derivative-work requirement, third-party asset caveats, and technical
reliability of any hosted asset (a CDN-blocked embed is LINK_ONLY, not
EMBED — verify live, not just by URL inspection).

## Decision rule

1. Pick the **primary source**: highest quality score that clears
   REUSE/ADAPT/EMBED for the components the lesson actually needs.
2. Fill roles (structure / listening / pronunciation / practice /
   naturalness benchmark) from remaining candidates — one source may
   fill several; do not force diversity.
3. Reject explicitly — write down what was excluded and why.
4. Rights ambiguity never blocks the _comparison_, only the _copying_.

## Evidence requirements

For every reused/adapted component, retain before merge:

- original URL + item title + author/publisher;
- license/rights basis + license URL;
- retrieval date;
- for local media: file bytes, duration, SHA-256, evidence JSON under
  `docs/sources/evidence/`;
- where rights depend on _who produced it_ (e.g. VOA vs wire agencies,
  PCC vs embedded YouTube), asset-level verification — not a blanket
  site claim.
