# SE Calm Learning System

Canonical internal design language for the Simple English app. The code is
the reference implementation; this document records the rules a reader
can't see by scanning one screen.

## Principles

- One screen → one purpose. One state → one obvious next action.
- Content > chrome. Hierarchy > decoration. Whitespace > containers.
- Learning feedback > gamification. Progressive disclosure > dumping.
- Fast > fancy. No gradients, glassmorphism, heavy shadows, brand-blue
  default, or Duolingo-style dashboard chrome.

## Tokens

Defined once in `src/styles/index.css` (`@theme`); components use the
semantic names only — no parallel vocabularies.

| Token                                        | Value                             | Use                                      |
| -------------------------------------------- | --------------------------------- | ---------------------------------------- |
| `canvas`                                     | `#F7F8F5`                         | page background                          |
| `surface`                                    | `#FFFFFF`                         | contained panels, nav chrome             |
| `ink`                                        | `#18201D`                         | primary text                             |
| `muted`                                      | `#66706B`                         | secondary text, translations, metadata   |
| `border`                                     | `#E1E6E2`                         | hairline boundaries                      |
| `primary` / `primary-hover` / `primary-soft` | `#176B4D` / `#125840` / `#E7F2EC` | actions, active states, example surfaces |
| `success` / `success-soft`                   | `#18794E` / `#E7F2EC`             | correct/completed feedback               |
| `warning` / `warning-soft`                   | `#9A6700` / `#FAF3E3`             | retry/persist warnings                   |
| `lesson` (text size)                         | 17px / 1.65 lh                    | lesson prose                             |

Spacing follows the Tailwind scale (4/8/12/16/24/32/48/64) — whitespace
establishes hierarchy before borders do. Radius is limited (lg/xl);
shadows are effectively absent — hierarchy comes from spacing, background
and type.

## Layout & navigation

- Content width: max `42rem`, centered — lesson lines stay readable.
- Mobile (<md): minimal brand header + **bottom navigation** (four items,
  safe-area padded, ≥44px targets, clear active state).
- Desktop (md+): compact left sidebar (13rem), same four items.
- **Lesson focus mode**: while a lesson is open, all top-level navigation
  disappears. The lesson header carries `← Back to Learn` as the way out.
- Canonical routes: `/` Today, `/learn` Learn, `/review` Review,
  `/progress` Progress. `/today` is not a route.

## Surface rules

- Prose sits on the canvas — headings, text, dialogue flow as a document.
- Contained surfaces (`.panel`) only for semantic boundaries: exercise,
  external media, completion, empty-state CTA.
- Dialogue/examples: English is visually primary; Vietnamese is smaller,
  muted secondary support — never equal weight.
- Exercise: prompt + choices + Check + feedback are one panel. Check is
  disabled until a selection exists; wrong → "Not quite — try again";
  correct → ✓ feedback then "Complete lesson". Feedback and the
  completion panel are separate elements.
- Completion: a panel with one next action (Back to Learn) — never a fake
  "next lesson".
- External media: click-to-load placeholder ("Watch video"), honest
  provider note + "Open original ↗" fallback. Never eager.
- Provenance: all license/attribution data behind a `Sources & license`
  `<details>` disclosure — intact, but out of the reading flow.

## Accessibility

Semantic headings, one h1 per view, fieldset/legend + radio semantics for
exercises, `role="status"`/`role="alert"` for feedback, labeled iframe
titles, keyboard-reachable disclosure, visible primary-color focus ring on
every interactive element. Active nav state is background + text color,
not color alone.

## What not to do

- Don't wrap prose in cards. Don't add a second token vocabulary.
- Don't add nav items inside a lesson. Don't fake progress denominators,
  streaks, XP, or review content that doesn't exist.
- Don't make third-party iframes eager for looks. Don't delete provenance
  to simplify design.
