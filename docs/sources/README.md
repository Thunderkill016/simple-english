# Source registry

This directory defines how Simple English tracks the educational sources it
may reuse, adapt, or link to.

**Core rule: free to access ≠ free to redistribute.** No source is used in SE
until its license and provenance have been verified and recorded here. No bulk
imports.

## Metadata standard: reuse, don't invent

Rather than inventing a custom metadata format, SE source records align with
**LRMI (Learning Resource Metadata Initiative)** — the education-metadata
vocabulary adopted into **schema.org** (`LearningResource`, `AlignmentObject`,
`EducationalAudience`), now maintained as a DCMI community specification —
supplemented by Dublin Core conventions where useful.

Field mapping:

| Registry field | LRMI / schema.org / DC term |
| --- | --- |
| `title` | `name` |
| `authors` | `author` / `creator` |
| `publisher` | `publisher` |
| `url` | `url` |
| `license` | `license` |
| `licenseUrl` | `useRightsUrl` / `license` (URL form) |
| `contentType` | `learningResourceType` |
| `levels` | `educationalLevel` (+ `educationalAlignment` for frameworks such as CEFR) |
| `subjects` | `teaches` / `about` |
| `adaptedFrom` | `isBasedOnUrl` (for SE adaptations) |
| `reuseStatus`, `provenanceNotes`, `verifiedAt`, `verifiedBy` | SE-specific verification fields (no standard equivalent) |

This keeps SE records conceptually compatible with the wider OER ecosystem
(OER Commons, Open Textbook Library, Pressbooks catalogs all emit LRMI-flavored
metadata) instead of inventing a private standard.

## Record schema (draft)

```json
{
  "id": "pcc-esol-digital-workbook",
  "type": "LearningResource",
  "title": "A Digital Workbook for Beginning ESOL",
  "authors": ["Eric Dodson", "Davida Jordan", "Tim Krause"],
  "publisher": "Portland Community College / Open Oregon Educational Resources",
  "url": "https://openoregon.pressbooks.pub/esol23/",
  "license": "CC BY 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
  "contentType": ["workbook", "interactive-exercises"],
  "levels": ["beginner"],
  "subjects": ["ESOL", "English language"],
  "reuseStatus": "approved | review-required | prohibited",
  "provenanceNotes": "Embedded third-party media (YouTube etc.) is not covered by the book's CC BY license; per-item review required during adaptation.",
  "verifiedAt": "2026-10-03",
  "verifiedBy": ""
}
```

The schema may be refined as real adaptation work begins — but changes must
stay LRMI-aligned unless an existing standard genuinely cannot express the
field.

## `reuseStatus` values

- `approved` — license verified from the original source; reuse/adaptation
  permitted under its stated terms.
- `review-required` — candidate source; licensing or provenance not yet fully
  verified. Do not adapt.
- `prohibited` — verified as not reusable; keep the record so the source is
  not re-evaluated repeatedly.

## Initial sources

| id | Title | License | Status |
| --- | --- | --- | --- |
| `pcc-esol-digital-workbook` | A Digital Workbook for Beginning ESOL (PCC / Open Oregon) | CC BY 4.0 | approved — canonical V1 beginner source; embedded third-party media needs per-item review |
| `pcc-portland-people-and-places` | Portland People and Places (Timothy Krause, PCC) | CC BY 4.0 | review-required — license verified 2026-10-03; adaptation review pending |
| `pcc-green-tea-intermediate` | Green Tea Intermediate English Communication OER (Dodson, Diniz, Leiton; PCC / Open Oregon, 2020) | CC BY 4.0 | review-required — license verified 2026-10-03; adaptation review pending |
| `american-english-state-dept` | American English / U.S. Dept. of State materials | per item | review-required — reuse rights vary; not automatically public domain |

Machine-readable records will be added as JSON files in this directory when
adaptation work actually starts — not before.

## Adding a source

1. Verify the license at the **original source** (the resource's own license
   page, not an aggregator summary).
2. Check for embedded third-party content with different terms.
3. Record attribution obligations.
4. Add the record with `reuseStatus`, `verifiedAt`, and evidence links in
   `provenanceNotes`.
