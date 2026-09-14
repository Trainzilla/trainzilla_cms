# Competitive research — cycle 2026-09-14

Focus area: Nutrition flexibility. Notes below are built from WebSearch SERP
snippets this cycle (the sandbox's egress policy blocks direct fetches of
competitor sites, same as it blocks `cms.trainzilla.in` — see
`scripts/seo/README.md`), so treat page-age and depth comments as inference
from snippet text, not a full read of the live page.

## Competitors ranking for the primary keyword cluster

1. **Trainerize (ABC Trainerize)** — <https://www.trainerize.com/blog/trainerize-update-flexible-meal-planner-coach-nutrition-your-way/>
   and <https://www.trainerize.com/features/nutrition/>
   Angle: product-announcement blog post + feature page for their "Flexible
   Meal Planner" — smart meal suggestions, coach-controlled permissions for
   client-side edits, auto-generated grocery lists, micronutrient tracking.
   Omits: no mention of showing the client a *macro delta* before they commit
   to a swap — the messaging is "substitutions that still align with targets,"
   not a live before/after comparison.

2. **WeStrive** — <https://www.westrive.com/features/nutrition>
   Angle: feature-list page — "flexible meal groups" (e.g. a "carb options"
   group of rice/quinoa/sweet potato) coaches build once and clients choose
   from daily. Omits: framed as coach-authored groups, not client-initiated,
   in-the-moment swaps with an explicit macro comparison.

3. **CoachRx** — <https://www.coachrx.app/articles/personalized-nutrition-coaching-meal-planspersonalized-nutrition-coaching-meal-plans>
   Angle: general personalized-nutrition-coaching content marketing piece.
   Omits: no meal-swap or macro-delta mechanic discussed at all — it's a
   positioning piece, not a feature explainer.

4. **Coachway** (content marketing, not a coaching platform itself) —
   <https://coachway.io/articles/nutrition-coaching-software/> and
   <https://coachway.io/articles/how-to-build-a-client-meal-plan/>
   Angle: "best nutrition coaching software" roundup + a general "how to build
   a meal plan" guide covering fixed plans, macro targets, and swap lists as a
   manual technique. Omits: software-side automation — it's advice for doing
   swaps by hand, no product does the macro math for the coach in real time.

5. **Consumer macro/meal-swap apps** (Prospre, MacroPlan, Hit My Macros, Eat
   This Much) — rank heavily for "meal swap" + "macro" queries generally, but
   target the *end dieter* self-tracking alone, not a coach managing many
   clients' plans. Angle: one-tap swap, plan recalculates instantly. Omits:
   any coach-in-the-loop layer, oversight, or per-client roster view — there is
   no "coach" role in these products at all.

## Content gap

None of the coaching-software competitors combine all three of:

1. **Per-ingredient macro breakdown** the coach builds (TrainZilla:
   `[PARTIAL]` — Diet section, feature-inventory.md) — Trainerize and WeStrive
   get close (meal-level substitution groups) but don't expose the
   ingredient-level breakdown the way TrainZilla's diet plan builder does.
2. **Meal swap with a macro-delta preview** (TrainZilla: `[GAP]`) — the
   consumer apps have the "swap and see the new macros" mechanic, but nothing
   in the *coaching-software* category shows the coach (or the client, before
   confirming) the exact macro difference of a swap against a coach-built,
   per-ingredient plan.
3. A coach-facing view of what clients are actually swapping, so plan
   adherence stays visible without manual back-and-forth — none of the
   coaching platforms surfaced this as a compliance/oversight feature.

That combination — coach builds the precise plan, client gets real flexibility
inside it, coach can still see what changed and by how much — is the angle no
competitor content currently owns.
