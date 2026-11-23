# Competitive research — 2026-11-23

Focus area: AI auto-adjust & coach-in-the-loop. Primary keyword: **best AI
coaching software for personal trainers**.

## Competitors found ranking / being cited for this cluster

1. **Trainerize** — https://www.trainerize.com
   Angle: positions itself as the category leader for coaches running a
   business; publishes its own "best AI workout builder software for coaches"
   roundup and a post specifically framed as "Can AI create personalized
   workouts and meal plans while you stay in control?" It is the only vendor
   we found publicly using the term **"coach-in-the-loop"**: AI drafts a
   workout, meal plan, or check-in reply, and a human coach reviews/approves
   before the client sees it. Cites its own survey: 52% of trainers already
   use AI for programming (vendor-reported, not independently verified).
   What it omits: no public detail on a per-change plain-language rationale,
   and no stated numeric cap on how far one AI-proposed change can move.

2. **Everfit** — positioned (via secondary coverage) as the best all-in-one
   coaching-business platform; AI programming pitched as helping trainers
   build and adjust programs faster, bundled with nutrition and habit
   tracking. Angle is speed and breadth, not a documented review/explain step
   per change.

3. **PT Distinction** — recent updates let coaches auto-generate progressive
   training programs from a client's goals and training age; one roundup
   calls it the best option for "structured automation." This describes
   *generating* a program, not an ongoing, bounded, weekly re-adjustment loop
   with a visible reason per edit.

4. **Virtuagym (MAX AI Coach)** — https://business.virtuagym.com/ai-coach-business/
   Markets AI-generated personalized plans "in seconds" for trainers, with
   trainer control over the output — the closest to coach-in-the-loop among
   the group, but its public page doesn't describe a rationale shown per
   change or a quantified guardrail on how much a change can move.

5. **Fitbod** — consumer-facing (not coach-facing); adjusts future workout
   difficulty based on post-workout feedback. Notable because its own founder
   told TechRadar that "it's no longer enough for an app to tell you what to
   do — people want to know why," which is the explainability gap this
   cycle's article argues for — but Fitbod has no coach-review step at all,
   since there's no coach in the product.

6. **Caliber** — cited in passing as the opposite-positioning competitor:
   leads with "expert human coaching" and no visible AI-adjustment feature at
   all, used here only as a contrast point, not a direct SEO competitor for
   this keyword.

## Content gap

Across every vendor page and roundup we could find, **no competitor documents
all three of these together**: (1) a per-change approval gate in front of
every AI-drafted edit, (2) a plain-language reason attached to that specific
change (not a confidence score or generic "personalized" copy), and (3) a
numeric bound on how far volume, intensity, or calories can move in one
adjustment. Trainerize comes closest on (1); Fitbod's own founder is on record
wanting (2) industry-wide; none of the material we found states (3) at all.

Feature anchors this content gap points at (from `docs/feature-inventory.md`):

- **Coach-in-the-loop review** `[GAP]` — matches gap (1), sharpened beyond
  Trainerize's framing with the one-tap approval mechanic.
- **"Why this changed" rationale on every AI edit** `[GAP]` — matches gap (2),
  the exact thing a Fitbod founder said the category needs and no competitor
  page documents for coaches specifically.
- **Guardrails on AI plan changes** `[GAP]` — matches gap (3), not stated by
  any competitor we found.
- **AI credit metering (transparent per-action cost)** `[PARTIAL]` — used as a
  secondary, supporting mention (pricing-transparency angle), not a primary
  anchor this cycle.

## Caveats

Several sources above are vendor blogs or affiliate roundups with an obvious
interest in their own positioning (flagged inline where used); the 52% survey
figure and similar vendor-reported stats are **not** repeated as fact anywhere
in this cycle's drafts — they're reported here, attributed, for the reviewer's
context only. No customer names, benchmarks, or figures from these sources
were carried into `drafts/article-new.json` or the social posts.
