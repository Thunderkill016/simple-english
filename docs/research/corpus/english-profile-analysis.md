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
  as an official .xlsx. EVP access terms UNKNOWN.
- **Empirical surprises the corpus produced** (O'Keeffe & Mark): mismatches
  between ELT syllabi and measured competence; e.g. learners producing past
  simple at A1; error and competence not mutually exclusive; adjective
  sequences marking the A1→A2 transition.

## Answers to the mission's questions

**Can it help SE decide vocabulary level?**
Yes — EVP is purpose-built for this; it is the single most authoritative
public level-map for English words. License check required before storing
any word list.

**Can it help SE decide grammar sequence?**
Yes — EGP gives empirical level + FORM/USE split per structure, i.e. it can
answer "is `be`-contraction realistic at beginner level?" with data rather
than intuition.

**What can legally be stored?**
EGP is free for *non-commercial* use — SE's reuse posture must be decided
(open product, no monetization yet) — flagged for ChatGPT decision. Corpus
itself: proprietary; nothing may be stored.

**What requires licensing/account/API?**
Full EVP database access (partial paywall per catalog descriptions);
Cambridge Learner Corpus (licensed research corpus).

**What can only be used as reference?**
The profiles' *methodology* and headline findings — freely citeable;
statement-level data only under the non-commercial terms.

## DEVIN ANALYSIS

English Profile is the strongest available answer to "what is level-
appropriate content" — and it is empirically built from what learners *do*,
not what teachers assume. Two implications for SE: (a) level claims in SE
content can be checked against EGP/EVP rather than guessed; (b) learner-error
evidence could eventually drive sequencing the same way Cambridge uses CLC —
but SE has no learner corpus today, so this is a reference layer now.

## OPEN QUESTIONS

- EVP/EGP exact license text and whether programmatic snapshotting is allowed.
- Pre-A1 coverage — EGP is A1–C2; VOA/Cambridge Starter-level material sits
  partly below the grid.
- Whether a public EGP→structure download endpoint exists (the .xlsx)
  or only UI search.
