# SEO content pipeline

A weekly, mostly-automated loop that keeps the marketing SEO surface (articles,
seoPages metadata, webinar topics) fresh against current keyword demand, anchored
on real `tzilla-be` product features — and spins the same research into
LinkedIn / Instagram drafts.

## Moving parts

| Piece | Who runs it | What it does |
| --- | --- | --- |
| `PLAYBOOK.md` | the scheduled cloud agent, weekly | full self-contained brief: research → drafts-as-files → PR |
| `fetch-cms-state.mjs` | the agent (and you, anytime) | read-only snapshot of published CMS content into `cycles/<date>/inputs/` |
| `_snapshot/` + `.github/workflows/seo-cms-snapshot.yml` | GitHub Action, Mondays 01:00 UTC | commits a fresh slim CMS snapshot into the repo, because the routine's sandbox can't reach `cms.trainzilla.in` directly |
| `_images/` + `build-image-pool.mjs` + `.github/workflows/seo-image-pool.yml` | GitHub Action, Mondays 01:10 UTC | commits a pre-verified pool of commercially-usable CC images (Wikimedia Commons), one file per focus area, for the routine to pick hero + social images from — sandbox can't reach image hosts either. Most are CC BY / CC BY-SA: the attribution string ships with every use. |
| `../docs/feature-inventory.md` | maintained by hand | the feature list content must anchor on; `[GAP]` = under-marketed, prioritise |
| a PR titled `SEO cycle <date> — …` | opened by the agent | the week's output; **never auto-merged** |
| `apply-cycle.mjs` | **you**, locally, after review | pushes the reviewed `drafts/*.json` into the CMS — `seoPages` writes **publish immediately**, everything else lands as a draft |
| Payload admin | **you**, a human | publish the non-`seoPages` drafts you approve (the new article, etc.) — the step that makes those live |

## Why the agent doesn't write to the CMS directly

The cloud routine runs in an isolated environment with no access to
`MCP_LOCAL_NOTES.md`, the project `.mcp.json`, or any secret — and its network
egress policy blocks `cms.trainzilla.in` outright regardless. It therefore
cannot hold or use `TRAINZILLA_CMS_MCP_KEY`. So it produces the cycle as
**files in a PR**, and a human applies them from a trusted machine. This also
gives every change a diff and a review gate before it touches production
content.

That review gate is a per-write server-side decision, not an all-or-nothing
one: `src/hooks/mcpDraftGuard.ts` forces every MCP create/update to land as an
unpublished draft *except* `seoPages`, which publishes immediately. The
reasoning is collection-specific risk, not urgency — a `seoPages` write only
ever touches `title`/`description`/`keywords` metadata on an existing page,
never `canonicalPath`/`noindex`/`inUse`/`key`, and a bad refresh is one more
MCP write away from being fixed. A bad article, by contrast, is customer-facing
long-form content — that stays gated behind a human admin click.

## Weekly human workflow (~15–20 min)

1. A PR `SEO cycle <date> — <focus>` appears. Read `review-packet.md` (the PR body).
2. Skim `research/keywords.md` + `research/competitive.md` — is the intent right?
3. Read the drafts. Edit any `drafts/*.json` in the PR branch as needed. Reject a
   draft by deleting its file.
4. Pull the branch and dry-run:
   ```bash
   git fetch origin && git checkout seo/cycle-<date>
   export TRAINZILLA_CMS_MCP_KEY=...      # from MCP_LOCAL_NOTES.md (gitignored)
   node scripts/seo/apply-cycle.mjs cycles/<date> --dry-run
   node scripts/seo/apply-cycle.mjs cycles/<date>
   ```
   The dry-run output marks each file `[PUBLISH]` or `[draft]` so you know
   what's about to go live before you run it for real. `seoPages` refreshes
   are now live on the site the moment this command succeeds — there's no
   separate publish step for those. If you want to review a `seoPages`
   refresh before it's live, pull it out of `drafts/` (or use `--only`) and
   apply it after checking it by hand.
5. Open <https://cms.trainzilla.in/admin>. For the new article, attach the author
   + category the review packet names and confirm its `funnelStage` (it drives
   which CTA the site renders under the article). Review each draft version, click
   **Publish changes** on the ones you want live.
6. Redeploy the marketing site (its content is fetched at build time) so the
   published changes appear.
7. Merge the PR (keeps `cycles/<date>/` + `social/queue/<date>/` in history).
8. The social team pulls `social/queue/<date>/*.md`.

## Changing cadence / focus

- Schedule + prompt live in the cloud routine (Claude Code → routines).
- The 6-week focus rotation is defined in `docs/feature-inventory.md`.
- Add a new backend feature: add a row to `docs/feature-inventory.md` in the same PR.
