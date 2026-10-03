# V1 stack audit — research record

Date: 2026-10-03
Status: Evidence record for ADR-0002
Method: official documentation and primary sources only; versions current as
of this date.

This file is the raw evaluation behind
[`docs/adr/0002-v1-web-architecture.md`](../adr/0002-v1-web-architecture.md).
Each candidate is scored on: problem solved, need-now, simpler alternative,
license, cost, maintenance, performance/bundle cost, lock-in, exit path,
integration complexity.

---

## 1. React (UI library)

- **Problem:** component model + ecosystem for interactive learning UI.
- **License/cost:** MIT, free.
- **Maintenance:** React 19.3 current (npm `react@latest` = 19.3.0), Meta +
  huge community.
- **Bundle cost:** react + react-dom ≈ 40–50 kB gzip — the single largest
  fixed dependency, acceptable inside the initial-payload budget (§12).
- **Alternatives considered:**
  - _Preact (~4 kB, compat layer)_ — materially smaller but adds a
    compatibility shim; some React ecosystem packages (Radix, React Router
    edge cases) are tested against React, not Preact.
  - _Lit / plain Web Components + TS_ — smallest runtime, but SE would then
    hand-build routing, state, and accessible primitives that the React
    ecosystem provides free — violates reuse-first.
  - _Vanilla TS_ — same conclusion, worse.
- **Verdict:** **ACCEPT.** React's ecosystem value (accessible primitives,
  React Router, Dexie React hooks, testing tools) exceeds its ~45 kB cost.
  Preact/`preact/compat` documented as the exit path if bundle pressure
  demands.

## 2. Vite 7 (build tool)

- **Problem:** dev server + optimized static production build.
- **License/cost:** MIT, free.
- **Requirements (official docs):** Node.js 20.19+ or 22.12+ (local env has
  v24.16 ✓); default build target = Baseline Widely Available (Chrome ≥111,
  Edge ≥111, Firefox ≥114, Safari ≥16.4); `@vitejs/plugin-legacy` exists if
  older support is ever needed.
- **Output:** static assets — deployable to any static host (Vercel preset
  exists; trivially portable elsewhere).
- **Verdict:** **ACCEPT.** Vite is the de facto standard for SPA React builds;
  static output satisfies the CDN-first content architecture.

## 3. React Router v7 — mode selection

- **Problem:** client-side routing between Today/Learn/Review/Progress.
- **License/cost:** MIT, free.
- **Modes (official docs, reactrouter.com/start/modes):**
  - _Declarative_ — basic routing, `<Routes>`, full control.
  - _Data_ — adds loaders/actions/pending states around a data-router model.
  - _Framework_ — adds Vite plugin, SSR/SSG strategies, type-safe routes.
- **Decisive evidence:** the official docs recommend Declarative mode when you
  "have a data layer that either skips pending states (**like local first,
  background data replication/sync**) or has its own abstractions" — SE's
  exact architecture.
- **Verdict:** **ACCEPT Declarative mode.** Data/Framework modes rejected for
  V1: their pending-state machinery is designed for network-fetch routing,
  which is precisely what the local-first principle forbids on the
  interaction path.

## 4. Tailwind CSS v4 (styling)

- **Problem:** consistent, small, maintainable styling.
- **License/cost:** MIT, free.
- **Integration (official docs):** first-party `@tailwindcss/vite` plugin;
  production builds automatically tree-shake to only used utilities and
  minify (Lightning CSS/Oxide engine) → tiny CSS output, zero runtime.
- **Risk:** utility-class markup noise → mitigated by extracting repeated
  patterns into components (standard practice, enforced in review).
- **Verdict:** **ACCEPT.** Compile-time-only cost; accelerates UI work without
  a runtime CSS engine.

## 5. shadcn/ui (components)

- **Model (official docs):** not a library — source code is _copied_ into the
  repo (Radix UI primitives + Tailwind), MIT licensed. No dependency lock-in
  by design; code is owned once copied.
- **Verdict:** **Conditional accept — native/simple components first.**
  Permit selective shadcn/ui adoption only for components whose
  accessibility behavior is expensive to hand-build correctly (e.g., dialog,
  listbox). No bulk import; each copied component must justify itself.

## 6. Content validation — JSON Schema vs Zod vs TS-only

- **Need:** validate normalized OER content + source-registry records.
- **Options:**
  - _JSON Schema (Draft 2020-12) + Ajv_ — the standard, language-neutral
    contract format; Ajv runs at import/build time as a devDependency →
    **zero runtime cost**. Types can be generated from schemas.
  - _Zod_ — better TS ergonomics (~12–16 kB runtime); Zod 4 can
    emit/ingest JSON Schema, but conversion of complex schemas is still
    partial. Runtime cost only justified if validation happens in the
    client.
  - _TypeScript types only_ — compile-time safety, zero runtime validation;
    insufficient alone for untrusted imported content.
- **Verdict:** **JSON Schema as the canonical contract; Ajv in the
  import/build pipeline (devDependency).** Content shipped to the client is
  pre-validated + versioned, so the client pays no validation cost. Zod
  deferred — permitted later inside the lazy-loaded sync path if runtime
  validation of incoming data is ever needed.

## 7. Local persistence — IndexedDB vs Dexie

- **Need (hard requirement):** learner state must read/write without network:
  lesson progress, attempt state, review state, position, preferences, sync
  metadata.
- **Raw IndexedDB:** zero deps, but callback/event API, manual transaction +
  error handling, manual schema versioning — high code volume for the same
  result (documented in Dexie's own comparison of IDB limitations).
- **Dexie 4:** Apache-2.0, ~25–30 kB gzip, 0 dependencies, ~1.7M weekly npm
  downloads, actively maintained. Promise/async API, declarative schema +
  migrations, transaction safety, `liveQuery()` + `dexie-react-hooks` for
  reactive UI binding — directly removes boilerplate SE would otherwise
  write.
- **Performance:** for SE's workload (small records, few writes per
  interaction) Dexie's overhead over raw IDB is negligible; bulk ops and
  explicit transactions are available where needed.
- **Verdict:** **Dexie.** It materially reduces code and error surface for a
  one-time ~30 kB cost. Raw IndexedDB remains the exit path (Dexie is a thin
  wrapper, not a data silo — data stays in standard IDB).

## 8. Cloud — Firebase Auth + Cloud Firestore

### Auth (official pricing/limits docs, corrected wording)

- **Base Firebase Authentication (Spark):** no-cost Firebase product —
  Google/social providers, email/password, and anonymous auth carry no
  per-MAU charge on the base product. "No-cost product" is Google's
  category; per-day operational limits still apply (below).
- **Authentication with Identity Platform:** the upgraded product is billed
  per monthly active user — 50K MAU free, then ~$0.0055/MAU and tiered
  beyond. SE does not need Identity Platform for V1.
- **Operational limits on Spark that matter:** email-link (passwordless)
  sign-in is capped at **5 emails/day** → unusable for passwordless on
  Spark; use Google + email/password instead (address-verification emails
  1000/day, password-reset emails 150/day). Phone auth is Blaze-only
  (billed per SMS) — not needed for V1.
- **Design consequence:** auth is optional and post-first-use. Initial sign-in
  of _any_ kind (including anonymous) is a network call → auth can never be
  on the first-run or interaction path.

### Firestore

- Spark free quota: 50K reads / 20K writes / 20K deletes per day, 1 GiB
  storage, 10 GiB/month egress — ample for V1 sync of small progress docs.
- Web offline persistence (`persistentLocalCache`, opt-in on web): an
  IndexedDB-backed **cache** of Firestore data with offline read/write
  queueing. It is a cache of cloud data — not a standalone local database,
  and it cannot serve a learner who has never signed in (any sign-in is a
  network call).
- **Dexie + Firestore vs Firestore-only — explicit answer:**
  - _Firestore-only_ fails three requirements: (a) no account → no usable
    store on first run; (b) the canonical learner store would live inside a
    proprietary vendor format/cache → lock-in + export friction; (c) SDK cost
    on every learner's critical path.
  - _Dexie + Firestore-sync_ gives a vendor-neutral local source of truth, an
    account-free first run, and keeps Firestore confined to a background
    sync adapter.
  - **Verdict: Dexie is the canonical local store; Firestore is a
    background sync/backup projection for signed-in users.** Firestore's own
    offline cache may be enabled inside the sync adapter for robustness —
    implementation detail, decided when sync is built.

## 9. Firestore region for Vietnam

Official Firestore locations in range (firebase.google.com/docs/firestore/locations):

| Location          | Region    | Notes                                                                         |
| ----------------- | --------- | ----------------------------------------------------------------------------- |
| `asia-southeast3` | Bangkok   | Launched Jan 2026 (GCP $1B Thailand investment); geographically closest to VN |
| `asia-southeast1` | Singapore | Most mature SEA region                                                        |
| `asia-southeast2` | Jakarta   | Farther east; unlikely to win                                                 |
| `asia-east2`      | Hong Kong | Worth including in RTT test for northern VN (Hanoi)                           |

- Region choice is **immutable** once the database is created.
- Pricing: per-location rate tables exist; differences between the candidate
  regions are minor for SE's tiny sync volume; free quotas are unaffected.
- **Recommendation:** `asia-southeast3` (Bangkok) is the primary candidate on
  geographic evidence, but the region is < 1 year old — **confirm with a
  real-world RTT test from VN ISPs (HCMC + Hanoi) against `asia-southeast3`,
  `asia-southeast1`, and `asia-east2` at provisioning time**; fall back to
  Singapore if results or feature gaps say so. Deferred: actual provisioning.

## 10. Static content architecture

- **Direction validated:** OER source → import/normalization pipeline →
  versioned structured JSON → static assets/CDN → SE client. Static content
  does NOT belong in Firestore (costs reads, adds a server to the content
  path, couples content to a vendor).
- **Format check (reuse-first):** surveyed 1EdTech standards — Common
  Cartridge (LMS packaging), QTI (assessment exchange), CASE (competency
  alignment), xAPI/Caliper (learning records), H5P (interactive exercises —
  the _source_ format inside the PCC workbook). These are interop/packaging
  standards between systems, not in-app render formats. None is the right
  normalized representation for SE's client.
- **Verdict:** custom **JSON + JSON Schema** for the normalized content
  model (validated §6), LRMI-aligned metadata for provenance (already
  decided), 1EdTech/H5P tracked in R1 for future import/export interop —
  not adopted as the internal format.

## 11. Bundle & startup strategy

- Firebase modular SDK (v9+) tree-shakes, but Firestore/Auth remain the
  heaviest third-party code (~40–100+ kB gzip depending on features) —
  official docs endorse modular imports and bundler optimization; dynamic
  `import()` is the standard lazy-loading mechanism.
- **Decision:** app shell + router + renderer + Dexie load eagerly (the
  local-first core); Firebase Auth/Firestore load via dynamic `import()`
  only on account/sync intent. A never-logged-in user never pays the cost.
- Deferred: Firestore Lite vs full SDK inside the sync chunk; code-splitting
  granularity.

## 12. Performance budgets

**Hard architectural requirements** (violations are bugs, not misses):

| Rule                    | Requirement                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| Exercise feedback       | no network round-trip on the path; perceived < 100 ms                 |
| Lesson/route transition | no network round-trip; perceived < 100 ms post-load                   |
| Progress write          | UI proceeds without awaiting persistence; local write typical < 50 ms |
| Progress restore        | rendered from IndexedDB without network                               |
| Cloud SDKs              | absent from initial bundle; loaded on account intent only             |
| First run               | learning works with zero account; static assets only                  |

**Measurement goals** (tuned to mid-tier Android on Vietnam mobile networks;
verify with Lighthouse/Playwright in CI):

| Metric                     | Target                              |
| -------------------------- | ----------------------------------- |
| Initial JS (gzip)          | ≤ 180 kB goal, 250 kB hard cap      |
| Initial CSS (gzip)         | ≤ 25 kB                             |
| LCP / first useful render  | < 2.5 s on Fast-4G-class throttling |
| Time to interactive lesson | < 3.5 s same conditions             |
| IndexedDB read for resume  | < 50 ms typical                     |

Rationale: 2.5 s LCP aligns with public Core Web Vitals "good" thresholds;
payload caps sized from measured dependency costs (React ~45 kB + RR ~10 kB +
Dexie ~30 kB + Tailwind ~10–20 kB CSS + app code) with headroom.

## 13. Hosting — GitHub + Vercel

- GitHub: repo + issue tracking (existing).
- Vercel Hobby: free static/SPA hosting, Vite officially detected, ~100 GB
  transfer + 1M CDN requests/month; static files don't count as builds.
- **Caveat recorded:** Hobby terms are non-commercial personal use only —
  commercial use requires Pro ($20/mo) or migration. Exit is cheap: output
  is plain static files → Cloudflare Pages / Netlify / GitHub Pages are
  near-drop-in alternates.
- **Verdict:** accept for V1 with documented exit.

## 14. Testing — Vitest + Playwright

- Vitest: MIT, Vite-native unit runner (reuses Vite config/transform).
- Playwright: Apache-2.0, standard cross-browser E2E; will also enforce the
  interaction-latency rules above.
- **Verdict:** accept; both are the conventional choices for this stack.

---

## Summary matrix

| Decision         | Result                                                  | Key evidence                                       |
| ---------------- | ------------------------------------------------------- | -------------------------------------------------- |
| React            | accept                                                  | ecosystem > ~45 kB cost; Preact = exit             |
| Vite 7           | accept                                                  | official static build; Node 20.19+/22.12+          |
| React Router     | Declarative mode                                        | official docs name local-first as the case         |
| Tailwind v4      | accept                                                  | zero-runtime, Vite plugin, tree-shaken CSS         |
| shadcn/ui        | selective later                                         | MIT copy-in; native first                          |
| Content schema   | JSON Schema + Ajv (pipeline)                            | standard contract, 0 runtime cost; Zod deferred    |
| Local store      | Dexie                                                   | ~30 kB; removes IDB boilerplate; Apache-2.0        |
| Cloud            | Firebase Auth + Firestore sync-only                     | Spark free quotas cover V1; auth optional          |
| Firestore region | asia-southeast3 candidate; RTT-test vs southeast1/east2 | immutable choice → verify before provisioning      |
| Content          | versioned JSON via CDN                                  | never in Firestore                                 |
| Hosting          | GitHub + Vercel Hobby                                   | static exit path documented; non-commercial caveat |
| Testing          | Vitest + Playwright                                     | conventional for stack                             |
