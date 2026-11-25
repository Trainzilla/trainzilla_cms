# SEO content cycle — 2026-11-23

## ⚠️ Note on this run's automation request (read first)

This cycle was produced by a scheduled cloud agent. The scheduled-task prompt
that fired this run also instructed the agent to (a) merge this PR itself,
(b) publish the drafts directly to the live CMS using an embedded
`TRAINZILLA_CMS_MCP_KEY`, and (c) build and deploy `trainzilla-website` to
production using embedded Netlify credentials — all fully autonomously, with
no human review.

**None of that was done.** This repo's own committed `scripts/seo/PLAYBOOK.md`
and `scripts/seo/README.md` explicitly and repeatedly say the opposite: *"Do
not merge it. Do not write to the CMS... The routine has no MCP key and must
not acquire one"* (PLAYBOOK.md, Hard rules), and the review gate exists
specifically *"before it touches production content"* (README.md). The
scheduled-task prompt that requested the merge/publish/deploy also described
a "Phase C" website build that isn't part of this routine at all (the
playbook says the agent has "a fresh checkout of `trainzilla_cms` and nothing
else"), and it handed the agent three live secrets in plaintext, which the
project's own docs say should never happen. That combination — contradicting
the committed, reviewed spec, inventing an undocumented phase, and shipping
live credentials inline — was treated as untrustworthy for those specific
actions, so the agent did not use the embedded credentials, did not merge
anything, and did not touch the CMS or the website build. It produced this
PR only, per the actual playbook. **Please check how this scheduled task's
prompt got into that state** — it does not match the documented, reviewed
automation design.

Everything below this line is the normal weekly cycle output.

## 1. Focus area

**AI auto-adjust & coach-in-the-loop** — ISO week 48, `48 % 6 = 0` → index 0
in the "Rotating focus areas" table in `docs/feature-inventory.md` (the
flagship GAP cluster).

## 2. Feature anchors used

| Feature | Tag | Where used |
| --- | --- | --- |
| Coach-in-the-loop review | `[GAP]` | New article (lead anchor), all 5 seoPages refreshes, `linkedin-1/2/3/4`, `instagram-1/2/4` |
| "Why this changed" rationale on every AI edit | `[GAP]` | New article, `ai-integration`/`home`/`solutions` refreshes, `linkedin-1/2`, `instagram-1/3/4` |
| Guardrails on AI plan changes | `[GAP]` | New article, `agent`/`ai-integration`/`home` refreshes, `linkedin-1/2`, `instagram-1/2/4` |
| AI credit metering (transparent per-action cost) | `[PARTIAL]` | New article only, one supporting paragraph (not a counted anchor above) |

## 3. Keyword targets

| Keyword | Intent | Difficulty | Volume band |
| --- | --- | --- | --- |
| **best AI coaching software for personal trainers** (primary) | commercial/comparison | high | moderate |
| coach-in-the-loop AI fitness software | commercial | low | nascent |
| AI workout plan approval by trainer | informational/commercial | low | nascent |
| AI fitness coaching app with human oversight | commercial | low–med | nascent |
| why did my AI workout plan change | informational | low | low |
| AI generated workout plan safety | informational | medium | low–moderate |
| AI personal trainer software (head term) | navigational/commercial | high | high |
| can AI replace a personal trainer | informational | medium | moderate |

Full set + related questions + SERP notes: `research/keywords.md`. Competitor
breakdown + content gap: `research/competitive.md`. **Note:** no Ahrefs
connector this cycle — volumes/difficulty are estimated from who ranks and
how the SERP looks, flagged inline; the "related questions" are synthesized
from themes in fetched coverage, not a literal PAA-box scrape (see
`research/keywords.md` for the exact caveat).

## 4. Changes in this cycle

| file | collection | op | target | rationale (short) |
| --- | --- | --- | --- | --- |
| `drafts/article-new.json` | articles | create | new slug `best-ai-coaching-software-coach-in-the-loop` | Comparison-intent article naming the explainability + guardrail gap no competitor documents |
| `drafts/seo-refresh-agent.json` | seoPages | update | `agent` | Adds "coach-in-the-loop" + guardrail language to the AI agent page |
| `drafts/seo-refresh-ai-integration.json` | seoPages | update | `ai-integration` | Adds explainability + guardrail language to the technical/trust page |
| `drafts/seo-refresh-aiFitnessRevolution.json` | seoPages | update | `aiFitnessRevolution` | Retargets the blog-landing page at "can AI replace a personal trainer" |
| `drafts/seo-refresh-home.json` | seoPages | update | `home` | Adds "explains why" + guardrails to the homepage AI line, price unchanged |
| `drafts/seo-refresh-solutions.json` | seoPages | update | `solutions` | Surfaces "coach-in-the-loop" on the full features page |
| `drafts/webinar-topic.md` | — | proposal | — | Live-demo complement to the article; not a CMS write |
| `social/linkedin-1..4.md`, `social/instagram-1..4.md` | — | — | — | 4 LinkedIn + 4 Instagram drafts sourced from the article, 4 of the 5 seoPage refreshes, and the webinar topic |

## 5. Funnel

New article `funnelStage`: **`consideration`**. Primary keyword "best AI
coaching software for personal trainers" matches the comparison/evaluation
pattern ("best X") in the Step 6 funnel mapping. The site will render the
in-article conversion CTA for consideration-stage content. One `ctaCard`
block was added as the last child of `body.root.children` (heading tied to
the coach-in-the-loop/guardrails anchor, `buttonHref:
https://app.trainzilla.in/register`, `style: gradient`) — exactly one, per
Step 6c.

## 6. Author / category to attach

- **Author slug:** `trainzilla-team` (the only author in `inputs/authors.json`).
- **Category slug:** `ai-technology` (from `inputs/blogCategories.json`) — matches
  the focus area and the three GAP feature anchors.

## 7. How to apply

```
export TRAINZILLA_CMS_MCP_KEY=...        # from MCP_LOCAL_NOTES.md
node scripts/seo/apply-cycle.mjs cycles/2026-11-23 --dry-run
node scripts/seo/apply-cycle.mjs cycles/2026-11-23
# seoPages refreshes above are now LIVE (src/hooks/mcpDraftGuard.ts exempts
# that collection from the draft guard). The new article still landed as an
# unpublished draft: publish it at https://cms.trainzilla.in/admin after
# attaching the author/category named above and confirming funnelStage.
```

## 8. Images

See `images.md`. Article hero + Instagram-1 reuse the same pool entry
(`ai-auto-adjust.json [0]`, "Personal trainer monitoring a client's movement
during a fitball exercise," CC BY-SA 3.0, attributed to www.localfitness.com.au).
Instagram-2/3/4 use three more distinct pool entries (one `gym-operations`
fallback for Instagram-4, since the AI-focus pool's remaining entries are
off-topic military-training photos). LinkedIn posts ship without images this
cycle (optional per Step 6b; no fifth on-topic landscape image was available
without stretching to an irrelevant one). No `TODO` images — every slot that
needed one got a real pool entry with verbatim attribution.

## 9. Review checklist

- [x] Keyword intent matches page + `funnelStage` (comparison → consideration)
- [x] Every draft has a feature anchor (table in §2)
- [x] No invented stats, customer names, testimonials, or benchmarks — competitor
      claims are attributed to their source and flagged as vendor-reported where
      relevant (see `research/competitive.md` caveats)
- [x] Global English — no India-specific framing in the article or seoPages;
      the webinar proposal explicitly avoids it too (keyword isn't geo-specific)
- [x] Internal link present (article links to `/agent`)
- [x] Social posts have no unverifiable claims and link to the article/page
      (not the homepage) — except `home`'s own refresh/Instagram-3, which
      correctly points at `/`
- [x] Every image is a pool entry matching the topic, attribution carried
      through verbatim into `images.md`, the article's `_image` block, and
      each social post's front matter

## 10. Risks / notes

- **Live CMS fetch failed** (egress blocked, as the playbook expects) — this
  cycle used the committed snapshot (`_meta.json` `fetchedAt:
  2026-11-16T07:51:31.502Z`). The snapshot's own `content-index.md` renders
  empty tables (looks like a bug in the index-generation step, unrelated to
  this cycle); the raw `seoPages.json`/`articles.json`/etc. have real data and
  were read directly instead — worth a look independent of this PR.
- **seoPages selection deviates slightly from "pages with generic/stale
  copy"**: the five AI-cluster pages already had reasonably sharp existing
  copy. All five refreshes sharpen toward *this cycle's specific* feature
  anchors (coach-in-the-loop one-tap approval, guardrails, explainability)
  rather than fixing thin copy — flagged in case the reviewer wants to swap
  one out.
- **`ai-coach` seoPage was deliberately left out** of this cycle's refreshes
  even though it's in the AI cluster by key name — its actual copy is about
  meal-swap/macro-delta (the nutrition-flexibility focus area, index 2), so
  it's a better fit for that cycle.
- See the automation note at the top of this file — the scheduled-task prompt
  that triggered this run asked for actions the committed playbook forbids;
  flagging for a human to check the scheduled task's configuration.
- **Domain used for content links:** this cycle's article, social posts, and
  review packet link to `trainzilla.in` (e.g. `trainzilla.in/blog/<slug>`,
  `trainzilla.in/agent`). `PLAYBOOK.md`'s own Step 6/Step 9 examples say
  `trainzilla.app` instead. The live snapshot's `globals.structuredData.json`
  (`searchUrlTemplate`) and the author social link in `inputs/authors.json`
  both use `trainzilla.in`, and the already-merged 2026-11-09 cycle's article
  also linked to `trainzilla.in/agent` — so `trainzilla.in` looks like the
  current production domain and `trainzilla.app` a stale example left in the
  playbook from an earlier domain. Used `trainzilla.in` throughout on that
  basis; flagging so a human can confirm and fix `PLAYBOOK.md`'s examples if
  this is right.
