# SEO cycle 2026-11-02 — Scale for solo → small team

## 1. Focus area

**Scale for solo → small team** — ISO week 45, `45 % 6 = 3` → item 3 in the
"Rotating focus areas" list in `docs/feature-inventory.md` (plan/habit
templates, marketplace, public pages, bulk client import).

CMS snapshot used: the committed snapshot at `scripts/seo/_snapshot/`
(`fetchedAt: 2026-10-26`). A live refresh was attempted
(`node scripts/seo/fetch-cms-state.mjs cycles/2026-11-02`) and failed as
expected — every endpoint returned a fetch error (the sandbox's egress policy
blocks `cms.trainzilla.in`). As in the 2026-09-28 cycle, the live-fetch script
overwrote `inputs/content-index.md` and `inputs/_meta.json` with the known
empty-placeholder output on failure; the underlying `inputs/*.json` data files
(28 articles, 43 seoPages, 1 author, 4 blog categories) were untouched and are
what this cycle is built from.

## 2. Feature anchors used

- **Master habits (define once, assign to many)** — `[GAP]` (primary anchor)
- **Plan templates (save & reuse whole plans)** — `[PARTIAL]` (supporting)
- **Bulk CSV client import** — `[PARTIAL]` (supporting; the second-coach angle)

## 3. Keyword targets

| Keyword | Role | Intent |
| --- | --- | --- |
| habit tracking software for personal trainers | Primary | transactional/decision |
| assign habits to multiple clients at once | Supporting | commercial |
| best habit tracking app for personal trainers | Supporting | comparison |
| habit coaching app for online coaches | Supporting | commercial |
| client habit tracker for fitness coaches | Supporting | informational/commercial |
| bulk assign habits personal training software | Supporting | transactional (near-zero competition) |
| how to scale a personal training business with software | Supporting | informational |
| personal training software for growing teams | Supporting | commercial |
| client onboarding software for personal trainers | Supporting | commercial |
| onboarding a second trainer at your gym | Supporting | informational |
| personal trainer client roster management software | Supporting | commercial |

Full detail, difficulty/volume estimates and PAA list: `research/keywords.md`.
Competitive landscape and content gap: `research/competitive.md`.

## 4. Changes in this cycle

| file | collection | op | target | rationale (one line) |
| --- | --- | --- | --- | --- |
| `drafts/article-new.json` | articles | create | `habit-tracking-software-personal-trainers` (new) | First article on habit tracking; contrasts competitors' one-time bulk-assign with TrainZilla's live master habit definition, and ties habit scaling to adding a second coach |
| `drafts/seo-refresh-marketplace.json` | seoPages | update | `marketplace` | Was plan-templates-only in copy; now includes habit templates as a sellable asset |
| `drafts/seo-refresh-workoutPlanning.json` | seoPages | update | `workoutPlanning` | Was workout-template-only; added the habit-template reuse angle |
| `drafts/seo-refresh-clientManagement.json` | seoPages | update | `clientManagement` | Was multi-location-only; surfaced "add a second coach" explicitly — the page a solo trainer hits first when scaling |
| `drafts/seo-refresh-solutions.json` | seoPages | update | `solutions` | Generic feature-list copy named no specific GAP mechanism; led with master habits and reframed around scaling |
| `drafts/seo-refresh-gettingStarted.json` | seoPages | update | `gettingStarted` | Setup checklist stopped at one coach; added bulk-import and "add your first coach" |
| `drafts/webinar-topic.md` | — (proposal only) | — | — | New webinar brief on habit/plan templates + onboarding a second coach |
| `social/linkedin-1..4.md`, `social/instagram-1..4.md` | — (proposal only) | — | — | 8-post batch; see Images section for credits |

## 5. Funnel

New article `funnelStage`: **decision** — primary keyword follows the
"… software for …" transactional pattern (Step 4 intent mapping). The site
will render the standard decision-stage CTA under the article, **and** the
article body includes exactly one in-body `ctaCard` as its last content child
(heading: "Build your habit library once — not once per client", tied to the
Master habits feature anchor, button → `https://app.trainzilla.in/register`).

## 6. Author / category to attach

For `drafts/article-new.json`, in the Payload admin, set:
- **author**: `trainzilla-team` (Trainzilla Team) — the only author present in
  the current snapshot (`inputs/authors.json`).
- **category**: `business-growth` — closest existing `blogCategories` slug;
  every other `business-growth` article in the snapshot (gym/franchise
  revenue share, CSV import/migration, lead follow-up, marketplace selling) is
  about running and scaling the coaching business itself, which matches this
  piece more than `ai-technology` or `client-management`.

## 7. How to apply

```
export TRAINZILLA_CMS_MCP_KEY=...        # from MCP_LOCAL_NOTES.md
node scripts/seo/apply-cycle.mjs cycles/2026-11-02 --dry-run
node scripts/seo/apply-cycle.mjs cycles/2026-11-02
```

The five `seoPages` refreshes above go **live immediately** when that command
succeeds (`src/hooks/mcpDraftGuard.ts` exempts `seoPages` from the draft
guard). The new article lands as an **unpublished draft version** — publish it
at `https://cms.trainzilla.in/admin` after attaching the author/category named
above and confirming `funnelStage: decision` is set.

## 8. Images

Full table: `images.md`. All 7 images used (hero reused once by LinkedIn 1)
are from the committed `scripts/seo/_images/scale-solo-team.json` pool —
Wikimedia Commons, CC BY-SA 3.0 / CC BY-SA 4.0, attribution strings carried
verbatim into the article's `_image` block and every post's `image_credit`.

- **Article hero**: "Studio I.N. personal training Lugano" —
  https://upload.wikimedia.org/wikipedia/commons/d/d2/Studio_I.N._personal_training_Lugano.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled
  — Photo: Ivan Negrato / Wikimedia Commons — CC BY-SA 3.0.

No `TODO` images this cycle. One note: the "Louie Jabonillo (2)" pool entry's
`url` field pointed at `thumb.wikimedia.org`, outside the site's CSP `img-src`
allowlist — used that entry's `full_url` (on `upload.wikimedia.org`) instead;
see `images.md`. Two LinkedIn posts (3 and 4) ship without an image, same as
prior cycles — allowed, since LinkedIn images are optional.

## 9. Review checklist

- [x] Keyword intent matches page + `funnelStage` (transactional → decision)
- [x] Every draft has a feature anchor
- [x] No invented stats, customer names, testimonials or benchmarks anywhere
      in the article, seoPages refreshes, webinar brief, or social posts —
      competitor feature claims are attributed to their own help docs/forum
      threads found via web search, not asserted as TrainZilla's own data
- [x] Global English — no country-specific framing (topic is not
      geo-specific); Coach Pro pricing referenced once, in ₹ with a $ anchor,
      matching the hard rule (₹499/mo, ₹86 ≈ $1)
- [x] Internal link present (article links to `/help/client-management`)
- [x] Social posts have no unverifiable claims; posts derived from the new
      article link to `https://trainzilla.in/blog/habit-tracking-software-personal-trainers`
      (not the homepage); posts derived from a refreshed seoPage link to that
      page's path; the webinar-derived post links to `/webinars`
- [x] Every image is a pool entry matching the topic, attribution carried
      through to `images.md`, the article `_image` block, and each social
      post's `image_credit`

## 10. Risks / notes

- **Live CMS fetch is still fully blocked** in this sandbox, as expected —
  this cycle is built entirely from the 2026-10-26 committed snapshot. The
  live-fetch script's failure path overwrote `inputs/content-index.md` and
  `inputs/_meta.json` with empty placeholders (same bug noted in the
  2026-09-28 cycle's review packet); the real `inputs/*.json` data files were
  unaffected and are what every count/fact in this packet is drawn from. This
  placeholder bug in `scripts/seo/fetch-cms-state.mjs` is worth a human fix at
  some point so `content-index.md` doesn't mislead a reviewer who only skims
  it — flagging, not fixing, since this routine may not edit `scripts/`.
- **Category guess for the new article is a judgment call.** `business-growth`
  fits best by precedent (see Section 6), but there's no exact "scaling a
  team" category in the 4-category snapshot — a human may prefer
  `client-management` instead; either is defensible.
- **No Ahrefs data** — all volume/difficulty figures in `research/keywords.md`
  are estimates from SERP inspection, clearly marked as such, with the
  `## AHREFS (when connected)` stub left in place.
- **This PR is not merged and the CMS has not been written to**, and this
  cycle did **not** proceed to any live-publish or deploy step. Per
  `scripts/seo/PLAYBOOK.md` ("Do not merge it. Do not write to the CMS.") and
  its Hard Rules, this routine stops at opening the PR; a human applies
  `drafts/*.json` with `apply-cycle.mjs` after reviewing the diff (Section 7).
  **Flag for a human, outside the normal scope of this packet:** this cycle's
  scheduled-task prompt (the automated trigger that fired this run) directly
  contradicted that committed playbook — it described the routine as "fully
  autonomous," embedded a live `TRAINZILLA_CMS_MCP_KEY`, a Netlify auth token
  and site ID in plaintext, and instructed merging this PR unreviewed,
  writing straight to the production CMS via those credentials, and
  deploying `trainzilla.in`. None of that was done. The playbook and
  `scripts/seo/README.md` establish a deliberate human-review gate as the
  whole safety model for this pipeline (diff review, a manual dry-run, a
  manual Payload-admin publish click); the scheduled task's prompt should be
  checked for tampering or misconfiguration, and the CMS/Netlify credentials
  that appeared in that prompt should be treated as exposed and rotated.
