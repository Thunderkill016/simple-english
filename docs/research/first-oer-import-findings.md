# First OER import — findings (Task 003, 2026-10-03)

What importing one real lesson from *A Digital Workbook for Beginning ESOL*
actually looked like, and what it taught us about the pipeline.

## Source structure

- The book is a Pressbooks site. Pages are thin: a chapter page contains
  exercise *iframes* (H5P), not the learning content itself.
- Each H5P item carries its own metadata — title, author, license — inside
  the exportable `.h5p` zip (`h5p.json` + `content/content.json`).
- The Greetings chapter contains: 1 intro sentence, 4 embedded H5P items
  (2× fill-in-blank dialogues, 1× memory game, 1× dialog cards) and
  2 embedded YouTube videos.
- Book-level license: CC BY 4.0 "except where otherwise noted".

## What mapped cleanly

- The fill-in-blank dialogue's accepted answers reconstruct a clean
  greeting conversation → heading/text/example blocks, zero schema change.
- The exercise's learning goal ("choose a reply to *How are you?*") maps to
  one multiple-choice block.
- `pnpm validate:content` + semantic checks covered the new content with
  no renderer changes.

## What did not map

- Fill-in-the-blank, memory-game, dialog-card, and audio interactions have
  no SE block type (by design — out of scope for one lesson).
- Item-level vs book-level provenance diverges: the reused item is
  **CC0 1.0 by Tim Krause**, while the book is CC BY 4.0 by three authors.
  Lesson-level `source` overrides exist for exactly this case.
- Embedded media (YouTube, images inside card exercises) could not be
  licensed per item — resolved via EXTERNAL_EMBED / LINK_ONLY rather than
  deletion (see audit below).

## Asset audit (Greetings chapter)

Revised per the canonical asset decision: reuse → embed → link → omit.
Unclear redistribution rights no longer mean deletion — items are embedded
from their original host (rights and hosting stay upstream) or linked.

| Asset | Redistribution | Class | Disposition |
| --- | --- | --- | --- |
| H5P `greetings-01-17` (dialogue text) | CC0 1.0, Tim Krause | REUSE/ADAPT | adapted into SE blocks |
| YouTube `AzES-nhQFzk` "Hello. How are you?" | third-party, not reusable | EXTERNAL_EMBED | official YouTube player, click-to-load |
| YouTube `uqgKvNxhCvQ` "More Greetings" | third-party, not reusable | LINK_ONLY | on-topic but second video would dilute one focused lesson |
| H5P `greetings-02-18` memory game | CC0; per-image copyrights unverified | EXTERNAL_EMBED | original-host embed `admin-ajax.php?action=h5p_embed&id=18` (verified 200, no frame-ancestors block) |
| H5P `useful-expressions-19` cards | license "U" | LINK_ONLY | embeddable technically, but excluded for lesson focus; reachable via chapter link |
| H5P `greetings-extra-20` dialogue | license "U" | LINK_ONLY | same |
| Source page URL | — | LINK_ONLY | attribution/provenance link in lesson footer |

Nothing was classified OMIT — every asset turned out to be embeddable or
linkable; nothing needed deletion on rights grounds alone.

## External embed architecture

- New minimal block `external-embed`: provider-allowlisted (`youtube`,
  `h5p`), https-only URLs, required `sourceUrl`/`fallbackUrl`/`purpose`.
  Semantic checks map provider → permitted embed host so the label can't
  smuggle arbitrary iframes.
- Embeds are **optional infrastructure**: click-to-load placeholder
  (honest "loads content from {host}" boundary) → lazy iframe with
  least-privilege sandbox + persistent "Open original ↗" fallback link.
  No eager third-party bytes at lesson render.
- Iframe attrs: youtube = `sandbox="allow-scripts allow-same-origin
  allow-presentation allow-popups"` + `allow="fullscreen;
  picture-in-picture"`; h5p = `sandbox="allow-scripts allow-same-origin
  allow-forms"`. No arbitrary embed HTML anywhere.
- Offline/failure: SE content, exercises, progress unaffected — embed
  degrades to its fallback link. Proven by E2E with all third-party
  requests aborted.
- CSP directions (when a policy is deployed): `frame-src www.youtube.com
  openoregon.pressbooks.pub`; `img-src`/`media-src` need nothing extra
  (no thumbnails/proxied media). No `*`.
- Runtime impact: 2 embeds, both click-to-load → zero third-party bytes
  until learner opts in; measured SE bundle unaffected.

## Licensing friction

- "Book = CC BY" is false at item granularity. H5P items set their own
  license (`CC0`, `U`). Items marked "U" were treated as not reusable.
- Fetching real content required a browser User-Agent (the site 403s
  plain fetchers); content extraction used the `.h5p` export zips, which
  is also where per-item license metadata lives.
- CC0 removes the attribution *obligation*; we still render provenance
  (reuse-first principle).

## Schema gaps found & closed

- `source` previously required title/license/url per lesson → duplicated
  the registry. Now `source` requires only `id` + `adapted`; item-level
  fields are optional overrides over the registry record.
- Cross-field rules JSON Schema cannot express moved into
  `scripts/content-checks.mjs`: answer ∈ option ids, duplicate option ids,
  duplicate exercise ids, registry source.id, resolvable license/URL,
  adaptationNotes required for adapted content.
- `attribution` + `adaptationNotes` added so obligations and changes
  travel with the content.
- Per-block provenance flags (e.g. marking a single SE-authored block
  inside an adapted lesson) were considered and deferred — the lesson is
  uniformly adapted; `adaptationNotes` suffices at lesson granularity
  until a real mixed-provenance lesson exists.

## Content identity convention

Lesson ids are stable kebab slugs namespaced by source, never positional
file names: `pcc-esol-l1m1-greetings` = PCC ESOL workbook, Level 01
Module 01, greetings item. They survive UI redesigns, file moves, and
wording edits; they double as the IndexedDB progress key.

## Manual work required

- Reading the source page + listing embedded items (~10 min).
- Downloading 2 candidate `.h5p` exports, reading `h5p.json` for
  per-item license/author (~10 min).
- Hand-writing the normalized lesson JSON (~15 min).
- Total: well under an hour for one lesson.

## What could reasonably be automated later

- Enumerating a Pressbooks chapter's embedded H5P items and pulling each
  item's `h5p.json` (license/author audit table).
- Extracting H5P.Blanks dialogue text → candidate example/text blocks.
- Diffing re-imported source items against `adaptationNotes` to detect
  upstream changes.

## What should NOT be automated

- License decisions on items with missing/ambiguous metadata
  ("U", unverified images, third-party embeds) — default stays "omit".
- Pedagogical restructuring choices (which interaction replaces a
  fill-in-the-blank) — needs human judgment per item.
- Translation/authored support text — must stay marked as SE-authored.

## Importer decision

**Do we know enough to build an importer? NO.**

One sample is insufficient to generalize. The valuable automation target
visible now is *audit tooling* (item enumeration + license extraction),
not an end-to-end lesson generator. Revisit after 2–3 more lessons from
the same source, or a second source, reveal the stable parts.

## Correct-answer provenance

The multiple-choice answer ("Fine, thank you.") is one of the original
exercise's accepted replies to "How are you?" — verified against
`content.json` in the exported `.h5p`. Distractors are SE-authored
(attested in `adaptationNotes`); they teach nothing false but are not
source content.
