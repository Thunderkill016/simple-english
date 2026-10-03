# English Profile Analysis — R1.1

Special research round (mission §28). Sources: englishprofile.org (indirect —
direct fetch failed, PARTIAL), O'Keeffe & Mark 2017 (Birmingham archive),
NLP-verification paper (Cambridge Core, CC-BY 2025), Harrison & Barker 2015
catalog entry, Wikipedia programme summary.

## SOURCE FACT

- **Programme**: collaborative Reference-Level-Description project —
  founding partners CUP, Cambridge English, Cambridge Theoretical & Applied
  Linguistics, CRELLA (Bedfordshire), British Council, English UK; endorsed
  by Council of Europe; EU Lifelong Learning funding 2007–2013.
- **EGP (English Grammar Profile)**: 4-year quasi-longitudinal study over the
  Cambridge Learner Corpus (55M words, 200k+ exam scripts, 200+ countries,
  140+ L1s). Output = 1,200+ corpus-based grammar competency statements
  ("can"-statements, FORM and USE separated) mapped A1–C2.
- **EVP (English Vocabulary Profile)**: words/phrases learners know and use
  per CEFR level (documented in *English Profile in Practice*, CUP 2015,
  ISBN 9781107493988).
- **Access**: EGP described as "publicly available free-of-charge for
  non-commercial use" (Wikipedia/programme docs); EGP Online also circulates
  as an official .xlsx.
- **Empirical surprises the corpus produced** (O'Keeffe & Mark): mismatches
  between ELT syllabi and measured competence; e.g. learners producing past
  simple at A1; error and competence not mutually exclusive; adjective
  sequences marking the A1→A2 transition.

## RIGHTS — CHATGPT REVIEW DECISION (2026-10-04): REFERENCE_ONLY

Official English Profile Terms of Use located by reviewer:

- EVP Terms (`https://englishprofile.org/?menu=evp-terms-of-use`): material
  may be used for **personal non-commercial research/teaching or internal
  circulation**; use beyond that scope requires Cambridge consent.
- Contact/Terms (`https://englishprofile.org/?menu=contact-us`): Cambridge
  **does not license EVP/EGP data for commercial purposes**.
- EGP page (`https://englishprofile.org/?menu=english-grammar-profile`):
  free online resource under its own Terms of Use.

**Locked policy:**

```text
EGP = REFERENCE_ONLY
EVP = REFERENCE_ONLY
commercial_use:            NO
bulk production ingestion: NO
repository snapshot:       NO
runtime dependency:        NO
"English Profile informed" marketing claim: NO (requires permission)
```

Allowed: researcher queries EGP/EVP → checks a proposed grammar/vocabulary
decision → records a high-level finding + citation.
Forbidden: downloading profiles into the repo, exposing them through the
product, building a runtime leveling engine on them. Open substitutes must be
found in R1.3 (language-data-landscape) for any production leveling.

## Answers to the mission's questions

**Can it help SE decide vocabulary level?**
Yes for *research-level checks*: EVP is purpose-built as a level-map —
citable findings, no stored data (see rights policy above). Any production
leveling needs open substitutes (R1.3).

**Can it help SE decide grammar sequence?**
Yes at research level — EGP gives empirical level + FORM/USE split per
structure, i.e. it can answer "is `be`-contraction realistic at beginner
level?" with data rather than intuition, recorded as a cited finding.

**What can legally be stored?**
Nothing at statement/data level (Terms: personal non-commercial
research/teaching or internal circulation only; no commercial licensing).
Only citations + high-level findings.

**What requires licensing/account/API?**
Full EVP database access (partial paywall per catalog descriptions);
Cambridge Learner Corpus (licensed research corpus).

**What can only be used as reference?**
Everything — per the locked policy above.

## DEVIN ANALYSIS

English Profile is the strongest available answer to "what is level-
appropriate content" — and it is empirically built from what learners *do*,
not what teachers assume. For SE it is a **research-time check layer only**
(per the locked rights policy): proposed level decisions can be validated
against EGP/EVP findings and cited — the production leveling mechanism must
come from open substitutes (R1.3) or SE's own learner-error data later.

## OPEN QUESTIONS

- Pre-A1 coverage — EGP is A1–C2; VOA/Cambridge Starter-level material sits
  partly below the grid.
- Whether a public EGP→structure download endpoint exists (the .xlsx)
  or only UI search (moot for production — research queries only).
- Open substitutes for level-appropriate vocabulary/grammar lists — moved to
  R1.3 language-data-landscape.
