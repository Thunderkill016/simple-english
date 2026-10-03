# ADR 0002 — V1 web architecture

- Status: Accepted
- Date: 2026-10-03
- Supersedes: nothing (stands alongside ADR-0001)
- Evidence record: [`docs/research/2026-10-03-v1-stack-audit.md`](../research/2026-10-03-v1-stack-audit.md)

## Context

SE needs a V1 web architecture before any application code is written. The
canonical constraints are SPEC §9 (local-first, network off the interaction
path), the reuse-first decision rule (ADR-0001), and the learner context:
initially Vietnam, predominantly mobile, variable connectivity. A proposed
stack existed but was explicitly a proposal, not a conclusion — this ADR
records its validation against official sources.

## Requirements

1. Normal learning interactions feel immediate; no network on the
   interaction path.
2. First-run learning works with no account; progress persists locally.
3. Optional account later → cross-device sync/backup in the background.
4. Static educational content served as versioned CDN assets, never through
   the runtime database.
5. Every dependency justifiable by the canonical decision test (SPEC §4).

## Constraints

- No Supabase capacity available → cloud backend evaluated = Firebase (Spark
  free plan).
- Hobby-tier hosting is non-commercial only → exit path must be cheap.
- Firestore location is immutable once provisioned → region choice needs
  evidence, not guessing.
- Bundle/runtime budget: mid-tier Android on VN mobile networks.

## Candidates considered

Per-component candidates and scoring are in the research record. Headline
alternatives: Preact/Lit/vanilla vs React; React Router Data/Framework modes;
JSON Schema vs Zod; raw IndexedDB vs Dexie; Firestore-only vs Dexie+sync;
1EdTech formats vs normalized JSON; Netlify/CF Pages vs Vercel.

## Evidence

From official documentation (all verified 2026-10-03, cited in the research
record):

- React Router docs explicitly recommend **Declarative mode** for "local
  first, background data replication/sync" data layers.
- Vite 7 requires Node 20.19+/22.12+; static output; Baseline-Widely-Available
  browser target.
- Firestore web offline persistence is an opt-in IndexedDB **cache** of cloud
  data — usable only in a signed-in context (any sign-in is a network call);
  it is not a standalone local database.
- Firebase Spark: Google/email auth and anonymous auth are no-cost products;
  passwordless email-link capped at 5 emails/day (unusable on Spark);
  Firestore free quota 50K reads/20K writes/day.
- Firestore locations include `asia-southeast3` Bangkok (region launched
  Jan 2026), `asia-southeast1` Singapore, `asia-east2` Hong Kong.
- shadcn/ui is MIT-licensed copy-in code (Radix + Tailwind), not a dependency.
- Dexie is Apache-2.0, ~25–30 kB gzip, actively maintained.

## Decision

```text
Frontend           React 19 + TypeScript + Vite 7
Routing            React Router — Declarative mode
Styling            Tailwind CSS v4 (@tailwindcss/vite)
Components         native/simple first; shadcn/ui selectively when a11y
                   primitives justify it
Content            versioned normalized JSON (JSON-Schema-validated at
                   import/build time) via static assets/CDN
Local persistence  IndexedDB via Dexie — canonical learner-state store
Cloud              Firebase Auth (Google + email/password, optional,
                   post-first-use) + Cloud Firestore — background sync only
Hosting            GitHub + Vercel (static SPA)
Testing            Vitest + Playwright
```

## Deferred decisions

- Firestore region: `asia-southeast3` (Bangkok) is the primary candidate;
  must pass a real-world RTT test from VN ISPs (HCMC + Hanoi) against
  `asia-southeast1` and `asia-east2` at provisioning time. Nothing is
  provisioned yet.
- Firestore Lite vs full SDK inside the lazy sync chunk; whether to enable
  `persistentLocalCache` inside the sync adapter.
- Sync data model (doc shape, conflict rules, schema versioning on the wire).
- Runtime validation inside the client (Zod or lighter) — only if incoming
  data ever crosses an untrusted boundary at runtime.
- Analytics choice (none decided; SPEC non-goal remains).
- PWA/service-worker strategy (explicitly out of scope for now).

## Rejected alternatives

- **React Router Data/Framework mode** — pending-state machinery built for
  network-bound routing; contradicts local-first.
- **Firestore as the canonical learner store** — fails account-free first
  run, hardens vendor lock-in, puts the heaviest SDK on every learner.
- **Zod as primary content schema** — a library, not a standard; JSON Schema
  covers the contract with zero runtime cost. (Runtime use stays permitted
  later where warranted.)
- **1EdTech formats (Common Cartridge/QTI/xAPI) as the internal content
  format** — interop/packaging standards for system-to-system exchange, not
  in-app render models; kept for future import/export via R1.
- **Preact** — smaller runtime, but compat-shim risk against React-tested
  ecosystem packages; retained as documented exit path.
- **Passwordless email-link auth** — Spark quota of 5 emails/day makes it
  non-viable.

## Performance model

Two tiers (full table in research record §12):

**Hard architectural requirements** — violations are bugs:

- exercise feedback, navigation, progress writes, progress restore:
  no network round-trip;
- cloud SDKs absent from the initial bundle;
- first-run learning = static assets + local DB only.

**Measurement goals** — CI-checked as the app is built:

- initial JS ≤ 180 kB gzip (250 kB hard cap), CSS ≤ 25 kB;
- LCP < 2.5 s on Fast-4G-class throttling;
- interaction feedback < 100 ms; local writes < 50 ms typical.

## Data ownership model

```text
STATIC EDUCATIONAL CONTENT
→ versioned repository assets + CDN (source of truth: this repo)

LOCAL LEARNER STATE (canonical, account-free)
→ browser IndexedDB via Dexie

CLOUD LEARNER STATE (derived projection)
→ Cloud Firestore: sync/backup of local state for signed-in users

IDENTITY
→ Firebase Authentication (optional, deferred until learner opts in)

SOURCE PROVENANCE
→ version-controlled registry metadata (docs/sources)
```

Firestore is deliberately not a general data store for SE — it stores only
the cloud projection of learner state.

## Cloud/local boundary

```text
tap → update UI → persist to Dexie → enqueue sync → Firestore later
```

The learning domain reads and writes the local store only. Sync is an
adapter, not a feature of the learning runtime.

## Exit strategy

- **Firebase exit:** all learner state lives in Dexie (standard IndexedDB) —
  exportable without Firebase. Application code must reach Firebase only
  through a thin sync/auth adapter (`learning domain → storage/sync
  interface → local | cloud`), so a replacement backend (Supabase, a small
  self-hosted API, or another BaaS) swaps the adapter, not the app.
  Firebase APIs must not be imported across UI components.
- **Hosting exit:** build output is plain static files; Netlify, Cloudflare
  Pages, or GitHub Pages are near-drop-in replacements if Vercel's
  non-commercial Hobby terms stop fitting.
- **React exit:** Preact/`preact/compat` is a known near-compatible fallback
  if bundle pressure ever demands it.
- **Dexie exit:** data is standard IndexedDB; Dexie is a wrapper, not a
  format.

## Revisit triggers

Reopen this decision if any of these occur:

- RTT testing shows `asia-southeast3` measurably worse or Firestore features
  missing there → pick `asia-southeast1`/ `asia-east2` per results.
- Firebase Spark quotas become binding (e.g., >20K writes/day) → evaluate
  Blaze cost vs backend replacement.
- SE usage becomes commercial → Vercel Pro cost vs alternate static host.
- Sync requirements outgrow a document sync model (e.g., real-time collab —
  currently a non-goal).
- Initial-payload budget cannot be met → revisit heavy deps (React→Preact,
  Dexie→raw IDB, Router→lighter).
