# Download Manifest — R1.1

Every file fetched during R1.1, where it lives, and why.

## COMMITTED OPEN FILES

None yet. No file fetched in R1.1 carried explicit redistribution permission
suitable for committing. (VOA assets are public domain — disposition deferred
to the ChatGPT-reviewed implementation round, not R1.)

## TEMPORARY COPYRIGHTED RESEARCH FILES

In gitignored `research_cache/` — inspected for structure only, never committed:

| File | Origin | Size | Purpose |
| --- | --- | --- | --- |
| `research_cache/cambridge/klett-empower.pdf` (+ `.txt`) | Klett (official Cambridge distributor) | 4.6 MB | Empower Starter Unit 1 page reproductions + teacher notes |
| `research_cache/cambridge/oxico-empower.pdf` (+ `.txt`) | Oxico bookshop, Cambridge excerpt | 1.6 MB | Empower Unit 1 "People" sample pages |
| `research_cache/cambridge/pogp.pdf` (+ `.txt`) | cambridgeenglish.org | ~0.4 MB | Principles of Good Practice full text |
| `research_cache/pearson/speakout-a1-sb.pdf` (+ `.txt`) | pearson.pl official sample | ~2 MB | Speakout 3e A1 Unit 1 reproduction |
| `research_cache/ngl/we-sample.pdf` (+ `.txt`) | NGL World English L1 3e sample | ~1 MB | Goal/GOAL-CHECK structure |
| `research_cache/voa/voa-l1-lessonplan.pdf` (+ `.txt`) | docs.voanews.eu | 1.3 MB | 8-page official lesson plan (PD) |
| `research_cache/cambridge/empower2e-starter-sample.pdf` (+ `.txt`) | eltbooks.com (Cambridge-authorized retailer) | 20 MB | **Empower 2e Starter/A1 official sample — complete Scope & Sequence + sample Unit 5 (Correction A evidence)** |
| `research_cache/cambridge/eltbooks.html` | eltbooks.com | 81 KB | sample-download provenance |
| `research_cache/oup/ef5e-a1-toc.pdf` (+ `eftoc.txt`) | oup.es official | ~200 KB | EF5e A1 full TOC — File 1 structure evidence |
| `research_cache/oup/ef-tb-sample.pdf` (+ `eftb.txt`) | oup.es official | ~1 MB | EF5e A1/A2 Teacher's Guide sample — architecture + assessment inventory |
| `research_cache/oup/ef5e-a1-sample.pdf` | oup.es official | ~MB | EF5e A1 SB+WB sample unit 9 — spread conventions |
| `research_cache/pearson/roadmap-gse-a1.pdf` (+ `rgse.txt`) | pearson.com official | ~500 KB | Roadmap A1 GSE Mapping Booklet — per-objective GSE scores |
| `research_cache/pearson/roadmap-a1-contents.pdf` | prestige.bg distributor | ~150 KB | Roadmap A1 SB contents — alternating lesson structure |
| `research_cache/ngl/outcomes2e-intro.pdf` (+ `outi.txt`) | eltngl.com official | ~300 KB | Outcomes Beginner methodology — 7 documented design deviations |
| `research_cache/voa/voa-l1-page.html` | learningenglish.voanews.com | 163 KB | Full lesson page — media inventory source |
| `research_cache/voa/quiz1-12.html` | learningenglish.voanews.com /Quiz/Start | ~25 KB ea | All 6 quiz questions + media IDs + option sets |
| `research_cache/voa/voa-lle1-*.mp4` (9 files) | voa-video.voanews.eu (VOA CDN) | ~3.5 MB | Quiz stems ×6, Speaking Practice, Pronunciation — PD, retained for inspection |

## LINK-ONLY SOURCES

| Source | Reason |
| --- | --- |
| englishprofile.org EGP/EVP online | Live database — query at point of use; non-commercial terms |
| writeandimprove.com / speakandimprove.com | Free tools, no downloadable assets needed |
| cambridgeonehelp.cambridge.org | Platform behavior documented from help articles |
| Alphabet song video `youtu.be/IpIhzFh0yw8` | Third-party YouTube, linked by VOA lesson plan — embed-only candidate |
| VOA main video `…5f00c78a…_240p.mp4` | PD but ~5 min; hotlink/embed decision deferred to implementation |

## FAILED / INACCESSIBLE SOURCES

| Source | Failure |
| --- | --- |
| `assets.cambridge.org` Empower frontmatter/sample PDFs | Host unreachable from research environment (timeout) on 2026-10-04 — content verified via search index + mirror docs; marked PARTIAL |
| `englishprofile.org` direct fetch | Webfetch returned empty/404 — content verified via peer-reviewed papers (Birmingham, Språkbanken) + Wikipedia; marked PARTIAL, needs a follow-up fetch |
| VOA quiz `/Quiz/Start` pages 2,4,6,8,10,12 | Duplicate of preceding question page (question + confirmation screen pattern) — resolved: 6 questions, 6 media IDs |
| `speakout-a1-sb.pdf` first attempt | Wrong working directory — resolved |
| Cambridge Empower official unit test PDF | `tests.pdf` download returned 16 bytes — no test paper obtained; assessment data comes from frontmatter + Cambridge One help docs |

## Hash / evidence notes

- VOA media in `research_cache/voa/` sha256 recorded at download time in session
  log; if these assets are later promoted to `public/media/` (implementation round,
  PD allows), evidence JSONs must be written then.
- Full-length conversation MP3 (`f9bd90ed…`, 29.6 s) was inspected but NOT kept —
  the repo already has the committed trimmed asset; replacement is an
  implementation-round decision.
