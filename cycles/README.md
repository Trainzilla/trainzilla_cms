# cycles/

One directory per weekly SEO content cycle, named `YYYY-MM-DD` (the UTC date the
cycle ran). Created by the scheduled cloud agent following
`scripts/seo/PLAYBOOK.md`; applied to the CMS by a human with
`scripts/seo/apply-cycle.mjs`.

```
cycles/
  README.md
  TEMPLATE/            # the expected layout, with stub files (copy for reference only)
  2026-09-08/          # a real cycle
    inputs/            # generated CMS snapshot — do not hand-edit
    research/          # keywords.md, competitive.md
    drafts/            # *.json — what apply-cycle.mjs pushes (as drafts)
    social/            # linkedin-*.md, instagram-*.md (also copied to social/queue/<date>/)
    review-packet.md   # the PR description / human summary
```

## Lifecycle of one cycle

1. **Agent** creates `cycles/<date>/`, opens PR `SEO cycle <date> — <focus>`. Never merges.
2. **Human** reviews the PR, edits/deletes `drafts/*.json` as needed.
3. **Human** runs `node scripts/seo/apply-cycle.mjs cycles/<date>` locally → drafts land in CMS.
4. **Human** publishes approved drafts in the Payload admin, redeploys the site.
5. **Human** merges the PR — the cycle directory stays in history as the record.

`inputs/` is regenerable (`node scripts/seo/fetch-cms-state.mjs cycles/<date>`) and
is kept in the commit only so the PR diff shows what the drafts were written against.
