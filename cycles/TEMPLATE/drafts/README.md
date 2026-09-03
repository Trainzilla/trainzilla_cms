# Drafts

One JSON file per CMS change. Shapes: see `scripts/seo/PLAYBOOK.md` steps 6–7
and `scripts/seo/apply-cycle.mjs` header.

- `article-new.json` — 1 new article (op: create). Carries `funnelStage`
  (awareness/consideration/decision, from search intent) and, for
  consideration/decision, one in-body `ctaCard` block (Step 6c).
- `seo-refresh-<key>.json` — 5 seoPages metadata updates (op: update)

Also in this folder but NOT a CMS write: `../webinar-topic.md` (a proposal).
