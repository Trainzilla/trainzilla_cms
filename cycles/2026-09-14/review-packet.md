# SEO cycle 2026-09-14 — Nutrition flexibility

## 1. Focus area

**Nutrition flexibility** — ISO week 38, `38 % 6 = 2` → item 2 in the
"Rotating focus areas" list in `docs/feature-inventory.md` (meal swap +
macro-delta, per-ingredient macros, adherence).

## 2. Feature anchors used

- **Meal swap with macro-delta preview** — `[GAP]` (Diet section,
  feature-inventory.md). Primary anchor: no coaching-software competitor
  surfaced in this cycle's research shows the exact macro difference of a
  swap before it's confirmed.
- **Per-ingredient macro breakdown** — `[PARTIAL]` (Diet section). Supporting
  anchor: the mechanism that makes an accurate swap delta possible at all.

## 3. Keyword targets

| keyword | intent | est. difficulty | est. volume |
| --- | --- | --- | --- |
| how to let clients swap meals without breaking their macros (primary) | informational | low | nascent |
| meal swap software for coaches | commercial | low–med | nascent |
| macro delta meal swap | informational | low | nascent |
| flexible dieting app for coaches | commercial | medium | low |
| meal substitution nutrition coaching | informational | low | low |
| per-ingredient macro tracking app | informational/commercial | medium | low |
| best meal swap feature coaching software | commercial | medium | nascent |
| flexible meal planner for personal trainers | commercial | medium | low |

Full set with reasoning: `research/keywords.md`. Competitive landscape and
content gap: `research/competitive.md`.

## 4. Changes in this cycle

| file | collection | op | target | rationale (one line) |
| --- | --- | --- | --- | --- |
| `drafts/article-new.json` | articles | create | slug `meal-swap-without-breaking-macros` | New how-to article owning the swap + macro-delta angle no competitor covers |
| `drafts/seo-refresh-dietPlans.json` | seoPages | update | key `dietPlans` | Sharpen title/description around this cycle's exact keyword cluster |
| `drafts/seo-refresh-nutritionVegetarian.json` | seoPages | update | key `nutritionVegetarian` | Tie sibling vegetarian page to the macro-delta mechanic |
| `drafts/seo-refresh-client-app.json` | seoPages | update | key `client-app` | Surface where the client actually performs the swap |
| `drafts/seo-refresh-progressTracking.json` | seoPages | update | key `progressTracking` | Surface coach-side swap/adherence visibility |
| `drafts/seo-refresh-ai-coach.json` | seoPages | update | key `ai-coach` | Connect weekly AI plan adjustment to meal-swap awareness |
| `drafts/webinar-topic.md` | — (proposal) | — | — | Webinar brief extending the article's topic; complements existing "Vegetarian Sports Nutrition" webinar |
| `social/linkedin-1..4.md`, `social/instagram-1..4.md` | — (social queue) | — | — | 8 posts drawn from the new article, 4 of the 5 refreshed pages, and the webinar topic |

## 5. Funnel

`funnelStage: "awareness"` — the primary keyword ("how to let clients swap
meals without breaking their macros") is purely informational/how-to intent,
which the playbook maps to `awareness`. The site will render only the soft
newsletter CTA from `ArticleLayout`; **no in-body `ctaCard` was added**, per
Step 6c (awareness articles get no in-body CTA). If a human reviewer judges
the intent is closer to consideration (e.g. retitling toward "best meal-swap
software for coaches"), the funnel stage and CTA presence should be revisited
together.

## 6. Author / category to attach

- **Category**: `nutrition` (matches `inputs/blogCategories.json`).
- **Author**: `arjun-patel` (Dr. Arjun Patel — nutritionist & sports
  dietitian; closest existing author fit for a macro/meal-swap piece).

Neither is set on `drafts/article-new.json` itself — attach both in the
Payload admin per the playbook (Step 6: author/category are relationships,
not raw strings).

## 7. How to apply

```
export TRAINZILLA_CMS_MCP_KEY=...        # from MCP_LOCAL_NOTES.md
node scripts/seo/apply-cycle.mjs cycles/2026-09-14 --dry-run
node scripts/seo/apply-cycle.mjs cycles/2026-09-14
# then publish the good drafts at https://cms.trainzilla.in/admin
```

## 8. Images

Full table: `images.md`. Article hero: "Vegetables and Fruits served sliced
on various plates" (TudorTulok, CC BY-SA 4.0,
https://upload.wikimedia.org/wikipedia/commons/b/b5/Vegetables_and_Fruits_served_sliced_on_various_plates.jpg),
alt: "Assorted vegetables and fruits sliced and arranged on multiple plates,
representing flexible meal and ingredient choices." Reused once, on
`linkedin-1.md`. All 8 images are distinct pool entries from
`scripts/seo/_images/nutrition-flexibility.json`; no `TODO` images this
cycle. Every entry needs attribution (CC BY / CC BY-SA) — the attribution
string is carried into `images.md`, the article's `_image` block, and every
social post's `image_credit` front matter.

## 9. Review checklist

- [x] Keyword intent matches page + `funnelStage` (informational → awareness, no ctaCard).
- [x] Every draft has a feature anchor (meal swap w/ macro-delta preview `[GAP]`, or per-ingredient macro breakdown `[PARTIAL]`).
- [x] No invented stats, customer names, testimonials, or benchmarks — the "day-to-day" example in the article is illustrative, generic ("a client"), not a named case.
- [x] Global English — no country-specific framing; the ₹499/mo Coach Pro price is not mentioned (not central to this piece).
- [x] Internal links present — the article links to `/diet-plans` and the sibling `/blog/vegetarian-nutrition-planning`.
- [x] Social posts have no unverifiable claims and link to the article/page, not the homepage.
- [x] Every image is a pool entry matching its post's topic, with attribution carried through front matter / `_image`.

## 10. Risks / notes

- **Snapshot freshness**: the live CMS refresh (`fetch-cms-state.mjs`) returned
  403 on every endpoint (private/admin API needs auth this routine doesn't
  have) and would have overwritten the good committed snapshot with an empty
  one — it was restored from `scripts/seo/_snapshot/inputs/` (fetched
  2026-09-07) before continuing. All seoPages/article targeting in this cycle
  is against that 2026-09-07 snapshot, not live data.
- **Every seoPages record in the snapshot shows an `updatedAt` of
  2026-09-02/03** — i.e. everything was already refreshed recently, so none
  of the 5 pages chosen here are "stale" in the literal sense Step 7
  describes. Selection instead prioritized focus-area relevance (bias #1)
  among `inUse: true` pages (bias #2); two (`dietPlans`, `nutritionVegetarian`)
  are directly on-topic, three (`client-app`, `progressTracking`, `ai-coach`)
  are adjacent pages where the swap/macro-delta mechanic is a genuine,
  accurate addition rather than a stretch — a human should sanity-check that
  fit before publishing, especially for `ai-coach`.
- **PAA questions are SERP-synthesized, not a literal scraped Google "People
  also ask" box** — this session's WebSearch tool returns synthesized
  snippets, not a raw SERP with a PAA panel, so the 8 questions in
  `research/keywords.md` are drawn from patterns across multiple competitor
  pages rather than one literal PAA scrape. Flagged the same way as the
  Ahrefs stub.
- **Webinar topic keeps global English** even though the one existing sibling
  webinar in the snapshot ("Vegetarian Sports Nutrition for Indian Athletes")
  and several others use "for Indian Trainers/Athletes" framing — this is the
  site's convention for that specific set of webinars, not a requirement, and
  the keyword itself isn't geo-specific, so left as-is per the hard rules. A
  human can retitle to match the pattern if preferred.
- **`apply-cycle.mjs` was not run and the CMS was not written to** — per
  `scripts/seo/PLAYBOOK.md`'s hard rules ("Never write to the CMS... the
  routine has no MCP key and must not acquire one") and `scripts/seo/README.md`
  ("the cloud routine runs in an isolated environment ... it therefore cannot
  hold `TRAINZILLA_CMS_MCP_KEY`"). See this cycle's final summary message for
  a note on a scheduling-configuration discrepancy this session found and did
  not act on.
