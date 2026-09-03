# SEO content cycle — weekly playbook

You are a scheduled cloud agent. You have a fresh checkout of `trainzilla_cms`
and nothing else. This file is your complete brief. Follow it top to bottom,
then open one pull request. **Do not merge it. Do not write to the CMS.**

## What this produces

One `cycles/<YYYY-MM-DD>/` directory containing:

```
cycles/<date>/
  inputs/            # snapshot of current CMS content (generated, do not edit)
  research/
    keywords.md      # keyword + intent + SERP research for this week's focus area
    competitive.md   # what competitors rank for; content gaps
  drafts/            # the CMS changes, as JSON files a human later applies
    article-new.json         # 1 brand-new article (full record incl. Lexical body)
    seo-refresh-<key>.json   # 5 of these — seoPages metadata refreshes
    webinar-topic.md         # 1 webinar topic brief (proposal only, not a CMS write)
  social/
    linkedin-<n>.md  # LinkedIn posts
    instagram-<n>.md # Instagram captions
  review-packet.md   # the human summary; becomes the PR description
```

A human then reviews the PR, edits the `drafts/*.json` if needed, and runs
`node scripts/seo/apply-cycle.mjs cycles/<date>` locally to push them into the
CMS **as drafts**, then publishes the good ones in the Payload admin.

## Standard volume (per run)

- **1** new article
- **5** seoPages metadata refreshes
- **1** webinar topic brief
- **A batch of social posts**: 4 LinkedIn + 4 Instagram, drawn from the new
  article, the refreshed pages, and the webinar topic.

---

## Step 1 — Set up

```bash
corepack enable && pnpm install --frozen-lockfile   # only needed if you run TS; the seo scripts are zero-dep
node --version                                       # must be >= 18
DATE=$(date -u +%Y-%m-%d)
mkdir -p cycles/$DATE/research cycles/$DATE/drafts cycles/$DATE/social
```

Read these two files fully before doing anything else:
- `docs/feature-inventory.md` — the product features you must anchor content on.
- this file.

## Step 2 — Get the CMS content snapshot

The sandbox usually **cannot reach `cms.trainzilla.in`** (egress policy). A
committed snapshot is kept fresh by the `SEO CMS snapshot` GitHub Action
(`.github/workflows/seo-cms-snapshot.yml`, runs Mondays 01:00 UTC). Use it:

```bash
mkdir -p cycles/$DATE/inputs
cp -r scripts/seo/_snapshot/inputs/. cycles/$DATE/inputs/
# then TRY a live refresh — fine if it fails:
node scripts/seo/fetch-cms-state.mjs cycles/$DATE || echo "live fetch blocked — using committed snapshot"
```

If the live fetch succeeds it overwrites the copy with today's data (and adds
full article bodies). If it fails, you keep the committed snapshot — note in the
review packet which one you used and its `inputs/_meta.json` `fetchedAt` date.

Read `cycles/$DATE/inputs/content-index.md` — it lists every seoPages key, every
article, every webinar. You are refreshing *these* records. Never invent a
seoPages `key` or an article `slug`; only use ones present in the snapshot
(except the single new article, which gets a new slug).

**If neither snapshot is available** (no `scripts/seo/_snapshot/` and live fetch
blocked): you cannot safely target any page. Write `research/` and the new
article only, put a big NOTE in `review-packet.md` that the 5 seoPages refreshes
were skipped for lack of a snapshot, and still open the PR.

## Step 3 — Pick this week's focus area

```
WEEK=$(date -u +%V)          # ISO week number
FOCUS=$(( (10#$WEEK) % 6 ))
```

Map `FOCUS` to the rotating focus area in `docs/feature-inventory.md`
("Rotating focus areas"). Everything this cycle centres on that cluster. Record
which one you picked at the top of `review-packet.md`.

## Step 4 — Keyword & market research (web)

Use web search. Ahrefs is not connected yet (see "Ahrefs seam" below), so
volume/difficulty are **estimated from SERP inspection**, not pulled.

For the focus area, produce `cycles/$DATE/research/keywords.md`:

- **Primary keyword** — one head term the new article will target.
- **8–15 supporting keywords / long-tail variants**, each with:
  - a rough intent label (informational / commercial / transactional / navigational)
  - an estimated difficulty (low / med / high) with a one-line reason (who ranks now:
    forums? thin blogs? established SaaS? — that is your difficulty signal)
  - a rough monthly-volume band (nascent / low / moderate / high) — say it's an estimate
- **"People also ask" / related questions** — 6–10, verbatim from the SERP. These
  become article H2s and FAQ candidates.
- **SERP feature notes** — is there a featured snippet to win? video pack? Is the
  first page all listicles?
- An **`## AHREFS (when connected)`** section: leave a stub table with the columns
  `keyword | volume | KD | CPC | parent topic` and a note "filled from web SERP
  inspection this cycle; replace with Ahrefs data when the MCP is available."

And `cycles/$DATE/research/competitive.md`:

- 3–5 competitors ranking on page 1 for the primary keyword (name + URL).
- For each: what angle they take, what they omit, how old the content looks.
- **Content gap** — the 2–3 things none of them cover that TrainZilla can, because
  of a feature in `docs/feature-inventory.md`. Name the feature(s).

## Step 5 — Choose the feature anchor(s)

From `docs/feature-inventory.md`, pick 1–3 features — **at least one tagged
`[GAP]`** — that the focus area and the keyword research both point at. Every
draft you write must make at least one of these concrete (a sentence a reader
could act on, not a slogan). List them at the top of `review-packet.md`.

## Step 6 — Write the new article  → `drafts/article-new.json`

Shape (matches the `articles` collection; see real examples in
`scripts/article-bodies/*.json` and the seed in `scripts/seed-articles.ts`):

```json
{
  "collection": "articles",
  "op": "create",
  "data": {
    "title": "…",
    "slug": "…",                         // kebab-case, new, not in the snapshot
    "excerpt": "… 140–180 chars, contains the primary keyword …",
    "readTime": "7 min read",
    "publishedDate": "<date -u +%Y-%m-%d>",
    "updatedDate": "<same>",
    "tags": [{ "tag": "…" }, { "tag": "…" }],
    "body": { "root": { "type": "root", "format": "", "indent": 0, "version": 1, "children": [ … ] } }
  },
  "_rationale": "primary keyword, focus area, feature anchor, why now"
}
```

Do **not** set `author` or `category` to a raw string — they are relationships.
Leave them out; the review packet tells the human which existing author slug and
`blogCategories` slug to attach in the admin (pick from `inputs/authors.json` and
`inputs/blogCategories.json`).

### Lexical body rules

`body.root.children` is an array of nodes. You only need these node types:

- Paragraph: `{ "type": "paragraph", "version": 1, "children": [ { "type": "text", "version": 1, "text": "…" } ] }`
- Heading: `{ "type": "heading", "tag": "h2", "version": 1, "children": [ { "type": "text", "version": 1, "text": "…" } ] }` (use `h2` / `h3`)
- List: `{ "type": "list", "listType": "bullet", "start": 1, "tag": "ul", "version": 1, "children": [ { "type": "listitem", "version": 1, "value": 1, "children": [ { "type": "text", "version": 1, "text": "…" } ] } ] }` (`listType": "number"` + `"tag": "ol"` for ordered)
- Quote: `{ "type": "quote", "version": 1, "children": [ { "type": "text", "version": 1, "text": "…" } ] }`
- Bold text: add `"format": 1` to a text node.
- Link: `{ "type": "link", "version": 2, "fields": { "url": "https://trainzilla.in/…", "newTab": false }, "children": [ { "type": "text", "version": 1, "text": "…" } ] }`

Every non-text node also needs `"format": ""`, `"indent": 0`, `"direction": "ltr"`
if you want to exactly match existing records — but the CMS backfills those, so
they're optional. Keep it to the node types above; do not emit `block` nodes
(callout/statGrid/etc.) — those need exact field shapes and a human review.

### Article quality bar

- 900–1400 words. Primary keyword in the H1 (`title`), first paragraph, one H2,
  and the excerpt. Supporting keywords spread naturally across H2s.
- Answer the "people also ask" questions as H2/H3 sections.
- At least one concrete paragraph per feature anchor — what it does, in the
  reader's terms. No unverifiable claims (no invented numbers, customer names,
  or benchmarks). If you need a stat, phrase it as a mechanism ("the plan
  recalculates weekly from check-in data") not a metric.
- Global English. No country-specific framing, currency, or regulation unless the
  keyword itself is geo-specific. Prices only if central: Coach Pro is
  **₹499/mo, single coach** (₹86 ≈ $1).
- One internal link to a relevant existing page (`/pricing`, `/solutions/...`, a
  sibling article from the snapshot).

## Step 7 — Refresh 5 seoPages  → `drafts/seo-refresh-<key>.json`

Pick 5 keys from `inputs/content-index.md`, biased toward:
1. pages in the focus-area cluster,
2. pages with `inUse: true`,
3. pages whose current `description` is generic, keyword-thin, or > 12 months stale-sounding.

One file each:

```json
{
  "collection": "seoPages",
  "op": "update",
  "key": "<exact key from the snapshot>",
  "data": {
    "title": "≤ 60 chars, primary keyword near the front, ends with ' | TrainZilla' only if it fits",
    "description": "140–158 chars, one supporting keyword, one concrete feature reference, a reason to click",
    "keywords": "comma, separated, 6–10, from the research"
  },
  "_rationale": "what was weak before; which keyword cluster this now targets; feature referenced"
}
```

Do not change `canonicalPath`, `noindex`, `inUse`, or `key`. Metadata only.

## Step 8 — Webinar topic brief  → `drafts/webinar-topic.md`

Not a CMS write — a proposal. Include: working title, 2-sentence abstract, a
5-point outline, the primary keyword it would target, the feature anchor, and
which of the 6 existing webinars (from the snapshot) it complements or replaces.

## Step 9 — Social batch  → `cycles/$DATE/social/` and `social/queue/$DATE/`

Write 4 LinkedIn posts (`linkedin-1.md` … `-4.md`) and 4 Instagram captions
(`instagram-1.md` … `-4.md`). Source material: the new article, the 5 refreshed
pages, the webinar topic. Each post:

- Front matter: `platform`, `status: draft`, `source` (which cycle artefact),
  `feature_anchor`, `suggested_post_date`.
- LinkedIn: 120–200 words, hook in line 1, one concrete feature detail, a soft CTA
  to the relevant page URL, 3–5 hashtags.
- Instagram: 60–120 words, punchier, line breaks, 8–12 hashtags, CTA "link in bio".
- No invented metrics or testimonials.

Then copy the whole `social/` folder to `social/queue/$DATE/` (the durable queue
the social team pulls from — see `social/queue/README.md`).

```bash
mkdir -p social/queue/$DATE && cp cycles/$DATE/social/*.md social/queue/$DATE/
```

## Step 10 — Review packet  → `cycles/$DATE/review-packet.md`

This becomes the PR description. Sections:

1. **Focus area** (which of the 6, and the ISO week that selected it).
2. **Feature anchors used** (name + tag from the inventory).
3. **Keyword targets** — primary + the supporting set, as a table.
4. **Changes in this cycle** — a table: file | collection | op | target | one-line rationale.
5. **Author / category to attach** — for the new article, the exact existing
   `authors` slug and `blogCategories` slug the human should set in the admin.
6. **How to apply**:
   ```
   export TRAINZILLA_CMS_MCP_KEY=...        # from MCP_LOCAL_NOTES.md
   node scripts/seo/apply-cycle.mjs cycles/<date> --dry-run
   node scripts/seo/apply-cycle.mjs cycles/<date>
   # then publish the good drafts at https://cms.trainzilla.in/admin
   ```
7. **Review checklist** — [ ] keyword intent matches page, [ ] every draft has a
   feature anchor, [ ] no invented stats/names, [ ] global English, [ ] internal
   link present, [ ] social posts have no unverifiable claims.
8. **Risks / notes** — anything the reviewer should double-check.

## Step 11 — Open the PR

```bash
git checkout -b seo/cycle-$DATE
git add cycles/$DATE social/queue/$DATE
git commit -m "seo: content cycle $DATE (focus: <focus area>)"
git push -u origin seo/cycle-$DATE
```

Open the PR against `main` with `review-packet.md` as the body. Title:
`SEO cycle <date> — <focus area>`. **Stop there.** Do not merge, do not approve,
do not run `apply-cycle.mjs`, do not touch the CMS. Post a one-paragraph summary
as your final message.

**If `git push` or PR creation fails** (e.g. GitHub App not authorised for the
org): the sandbox is ephemeral, so the commit will be lost. In that case your
final message MUST include (a) the exact failure, (b) the full text of
`review-packet.md`, and (c) `git format-patch main --stdout` output for the
branch, so a human can recover the cycle. Still do everything else first.

---

## Ahrefs seam (for later)

When an Ahrefs MCP connector is attached to this routine:
- In Step 4, replace SERP-estimated volume/KD with real Ahrefs
  `keywords-explorer` data; fill the `## AHREFS (when connected)` table for real.
- Add a `research/ahrefs-raw.json` artefact with the raw pull.
- Everything else in the playbook is unchanged — the drafts and review packet
  have the same shape.

## Hard rules

- Never merge the PR. Never write to the CMS (no `apply-cycle.mjs`, no MCP calls,
  no admin). The routine has no MCP key and must not acquire one.
- Never invent metrics, customer names, testimonials, or benchmarks.
- Never introduce country-specific framing unless the target keyword is geo-specific.
- Only create files under `cycles/<date>/` and `social/queue/<date>/`. Do not edit
  anything in `scripts/`, `docs/`, `src/`, `.github/`, or config. (Copying the
  committed snapshot *into* `cycles/<date>/inputs/` in Step 2 is fine.)
- If a step can't complete (e.g. web search unavailable), write what you have,
  note the gap in `review-packet.md`, and still open the PR.
