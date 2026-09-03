# Social queue

Drafts for LinkedIn and Instagram, produced by the weekly SEO content cycle
(`scripts/seo/PLAYBOOK.md`). One folder per cycle date.

```
social/queue/
  2026-09-08/
    linkedin-1.md … linkedin-4.md
    instagram-1.md … instagram-4.md
```

## Post file format

Each file is Markdown with YAML front matter:

```markdown
---
platform: linkedin            # or: instagram
status: draft                 # draft | approved | scheduled | posted
source: cycles/2026-09-08/drafts/article-new.json
feature_anchor: "AI Coach weekly auto-adjust [GAP]"
suggested_post_date: 2026-09-10
---

<post body — ready to paste, including hashtags>
```

## Workflow for the social team

1. New folder shows up when a `SEO cycle <date>` PR merges.
2. Edit bodies freely. Flip `status:` as a post moves through
   `draft → approved → scheduled → posted`.
3. Nothing here posts automatically — this is a copy bank, not an integration.
4. Keep posted files in place (history); they double as a content log.

## Rules

- No invented metrics, customer names, or testimonials.
- Every post names one real feature (see `docs/feature-inventory.md`).
- Link LinkedIn posts to the specific page the cycle refreshed, not the homepage.
