# SEO content cycle — 2026-09-07

## 1. Focus area

**Gym / franchise operations** — ISO week 37, `37 % 6 = 1` → index 1 in the
"Rotating focus areas" table in `docs/feature-inventory.md` ("per-location
revenue, payouts, attendance, bulk import").

## 2. Feature anchors used

| Feature | Tag | Where used |
| --- | --- | --- |
| Per-location & per-coach revenue dashboards | `[GAP]` | New article (2 sections), `solutions` refresh, `linkedin-1`, `instagram-3` |
| Razorpay Route payouts (automatic coach payouts) | `[GAP]` | New article, `paymentsBilling` refresh, `instagram-1`, `instagram-2` |
| Coach attendance tracking | `[GAP]` | New article, webinar topic, `linkedin-4`, `instagram-4` |
| Multi-location / franchise management | `[PARTIAL]` | New article (supporting), `solutions`/`successStories` refresh, `linkedin-2` |
| Bulk CSV client import | `[PARTIAL]` | New article (supporting), `clientManagement` refresh, `linkedin-3`, webinar topic |

## 3. Keyword targets

| Keyword | Intent | Difficulty | Volume band |
| --- | --- | --- | --- |
| **multi-location gym management software** (primary) | transactional/comparison | high | moderate |
| gym franchise management software | commercial | high | moderate |
| best gym management software for multiple locations | commercial | high | moderate |
| per-location revenue dashboard gym | informational/commercial | low | nascent |
| gym franchise revenue reporting software | commercial | low | nascent |
| coach payout software gym | commercial | low | nascent |
| automatic coach payouts fitness business | commercial | low | nascent |
| multi-location fitness studio software | commercial | high | moderate |
| bulk import clients gym software | transactional | low | nascent |
| coach attendance tracking software gym | commercial | low | nascent |
| how to manage multiple gym locations | informational | medium | moderate |

Full set + PAA + SERP notes: `research/keywords.md`. Competitor breakdown + content gap: `research/competitive.md`.

## 4. Changes in this cycle

| file | collection | op | target | rationale (short) |
| --- | --- | --- | --- | --- |
| `drafts/article-new.json` | articles | create | `multi-location-gym-management-software` (new slug) | New buyer's-guide article targeting the primary keyword; decision-stage. |
| `drafts/seo-refresh-solutions.json` | seoPages | update | `solutions` | Lead with primary keyword; name per-coach dashboard explicitly. |
| `drafts/seo-refresh-pricing.json` | seoPages | update | `pricing` | Add franchise-buyer language to title/keywords; no price figures changed. |
| `drafts/seo-refresh-paymentsBilling.json` | seoPages | update | `paymentsBilling` | Surface the automatic, no-invoice payout mechanism. |
| `drafts/seo-refresh-clientManagement.json` | seoPages | update | `clientManagement` | Target bulk-import + cross-location reassignment keywords. |
| `drafts/seo-refresh-successStories.json` | seoPages | update | `successStories` | Retitle toward gym/franchise proof point; no new claims added. |
| `drafts/webinar-topic.md` | — (proposal) | — | new topic | "Running Multiple Gym Locations Without Losing Control" — fills a gap in the existing 6-webinar catalog. |
| `social/linkedin-1.md`, `instagram-1.md` | — | — | new article | Derived from the new article; link to `/blog/multi-location-gym-management-software`. |
| `social/linkedin-2.md` | — | — | `solutions` | Derived from the solutions refresh. |
| `social/instagram-2.md` | — | — | `paymentsBilling` | Derived from the payments/payouts refresh. |
| `social/linkedin-3.md` | — | — | `clientManagement` | Derived from the client-management refresh. |
| `social/instagram-3.md` | — | — | `successStories` | Derived from the success-stories refresh. |
| `social/linkedin-4.md`, `instagram-4.md` | — | — | webinar topic | Derived from the webinar proposal; link to `/webinars`. |

## 5. Funnel

- **`funnelStage: "decision"`** — the primary keyword `multi-location gym
  management software` is a transactional/"software" head term (buyer actively
  comparing vendors, per Step 6 of the playbook: "…software" → decision).
- The site will render the **hard CTA** under this article, plus the one
  in-body `ctaCard` block added as the last child of `body.root.children`
  ("See every location's revenue in one dashboard" → Start free →
  `https://app.trainzilla.in/register`, style `gradient`), per Step 6c.
- No `pullQuote` or other block types were used besides the single `ctaCard`.

## 6. Author / category to attach

For `drafts/article-new.json` (not set in the JSON — relationships, human
attaches in admin):

- **Suggested author:** `arun-malhotra` (Arun Malhotra — "Financial Technology
  Expert & Business Consultant specializing in digital payments for small
  businesses," from `inputs/authors.json`) — closest existing bio to the
  payments/payouts and business-operations angle of this article.
- **Suggested category:** `business-growth` (Business & Growth) from
  `inputs/blogCategories.json`.

## 7. How to apply

```
export TRAINZILLA_CMS_MCP_KEY=...        # from MCP_LOCAL_NOTES.md
node scripts/seo/apply-cycle.mjs cycles/2026-09-07 --dry-run
node scripts/seo/apply-cycle.mjs cycles/2026-09-07
# then publish the good drafts at https://cms.trainzilla.in/admin
```

## 8. Images

Full table: `images.md`. Article hero:

- **URL:** https://upload.wikimedia.org/wikipedia/commons/2/20/Personal_Training_at_a_Gym_-_Pushups.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled
- **Alt:** A personal trainer coaching a client through push-ups on a gym floor
- **Attribution:** Photo: www.localfitness.com.au / Wikimedia Commons — CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)

All 8 social posts (4 LinkedIn + 4 Instagram) have images — the hero is reused
once (`linkedin-1`), the other 7 are distinct. No `TODO` images this cycle;
`gym-operations.json` didn't have quite enough clearly on-topic entries for 8
distinct images, so 2 came from the `trust-transparency` fallback pool per
Step 6b — see the note at the bottom of `images.md`.

## 9. Review checklist

- [x] Keyword intent matches page + `funnelStage` (transactional "software" keyword → `decision`)
- [x] Every draft has a feature anchor (see section 2)
- [x] No invented stats, customer names, or testimonials
- [x] Global English — no country-specific framing beyond the ₹499/mo, single-coach Coach Pro price point (with $1 ≈ ₹86 shown) and the Razorpay Route payout mechanism, both cited as factual product details, not as India-only framing of the article's angle
- [x] Internal link present (article links to `https://trainzilla.in/pricing`)
- [x] Social posts have no unverifiable claims and link to the article/page, not the homepage
- [x] Every image is a pool entry that matches the topic, with its attribution string carried through (`images.md`)

## 10. Risks / notes

- **CMS access:** the sandbox cannot reach `cms.trainzilla.in` — confirmed
  again this cycle (`node scripts/seo/fetch-cms-state.mjs` returned 403 on
  every endpoint). This cycle used the **committed snapshot**
  (`scripts/seo/_snapshot/inputs/`, `fetchedAt: 2026-09-03T10:09:28.285Z`).
  **Note for whoever reviews this:** the live-fetch script overwrites
  `cycles/<date>/inputs/` with empty data even when every request 403s — after
  running it, this cycle had to re-copy the committed snapshot over the
  clobbered copy before continuing. Worth a look at
  `scripts/seo/fetch-cms-state.mjs`'s error handling for a future cycle (not
  changed here — out of scope per the hard rule against editing `scripts/`).
- **`ai-fitness-revolution` article body** in `scripts/article-bodies/` (used
  only as a shape reference, not copied) contains an invented `pullQuote`
  attributed to a named person — flagging in case that seed record itself
  needs a look; nothing from it was reused in this cycle's draft.
- **Trainzilla product MCP tools** (`list_clients`, `calc_macros`, etc.)
  appeared connected in this session's tool list. Per the hard rules, this
  routine has no CMS key, must not write to the CMS or product, and none of
  these tools were called — flagging only so a reviewer knows they were
  available but unused.
- **Image pool quality:** several `gym-operations.json` entries (the
  "Szemlőhegystrasse" apartment-building photos) are mismatched to their
  `gym interior members` query tag — not used this cycle, but the weekly
  image-pool Action might benefit from a relevance check.
- **Ahrefs:** still not connected; all volume/difficulty in `research/keywords.md` is SERP-estimated, and the PAA list is reconstructed from vendor FAQ/roundup subheadings rather than a verbatim Google PAA scrape (noted in that file).
