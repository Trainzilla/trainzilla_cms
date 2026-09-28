# SEO cycle 2026-09-28 — Recovery-aware programming

## 1. Focus area

**Recovery-aware programming** — ISO week 40, `40 % 6 = 4` → item 4 in the
"Rotating focus areas" list in `docs/feature-inventory.md` (tracking sync →
recovery signals → AI dial-back).

CMS snapshot used: the committed snapshot at `scripts/seo/_snapshot/`
(`fetchedAt: 2026-09-21`). A live refresh was attempted
(`node scripts/seo/fetch-cms-state.mjs cycles/2026-09-28`) and failed as
expected — every endpoint returned `403 Forbidden` (the sandbox's egress
policy blocks `cms.trainzilla.in`). The live-fetch script overwrote
`inputs/content-index.md` and `inputs/_meta.json` with empty placeholders on
that failure (all data endpoints reported 0 items); the underlying
`inputs/*.json` data files were untouched, and I restored the two summary
files from the committed snapshot before using them.

## 2. Feature anchors used

- **Recovery signals feeding the AI Coach** — `[GAP]` (primary anchor)
- **Apple Health / Health Connect sync** — `[PARTIAL]` (the data pipe)
- **Guardrails on AI plan changes** — `[GAP]` (the safety/trust mechanism)

## 3. Keyword targets

| Keyword | Role | Intent |
| --- | --- | --- |
| recovery tracking software for personal trainers | Primary | transactional/decision |
| training load and recovery app for coaches | Supporting | commercial |
| HRV guided training for coaches | Supporting | informational/commercial |
| Whoop / Oura integration coaching software | Supporting | commercial |
| how to adjust training program based on recovery data | Supporting | informational |
| overtraining warning signs client | Supporting | informational |
| sleep and recovery for personal trainers | Supporting | informational |
| Apple Health integration training app | Supporting | commercial/navigational |
| readiness score training software | Supporting | commercial |
| AI coach adjusts plan based on recovery | Supporting | informational (near-zero competition) |

Full detail, difficulty/volume estimates and PAA list: `research/keywords.md`.
Competitive landscape and content gap: `research/competitive.md`.

## 4. Changes in this cycle

| file | collection | op | target | rationale (one line) |
| --- | --- | --- | --- | --- |
| `drafts/article-new.json` | articles | create | `recovery-tracking-software-personal-trainers` (new) | First article on recovery/wearable data; ties AI Coach auto-adjust to a bounded, coach-approved mechanism no competitor describes |
| `drafts/seo-refresh-agent.json` | seoPages | update | `agent` | Was meal-swap-only in copy; now surfaces the recovery-signal + guardrails mechanism |
| `drafts/seo-refresh-ai-coach.json` | seoPages | update | `ai-coach` | Same gap — added recovery signals alongside existing meal-swap copy |
| `drafts/seo-refresh-progressTracking.json` | seoPages | update | `progressTracking` | Help page described only workout/diet logs; now includes the recovery-signal dashboard view |
| `drafts/seo-refresh-mobileApp.json` | seoPages | update | `mobileApp` | Health data sync was one throwaway word in the old description; now the lead feature |
| `drafts/seo-refresh-ai-integration.json` | seoPages | update | `ai-integration` | Description omitted recovery/wearable data as a data source the AI agent can use |
| `drafts/webinar-topic.md` | — (proposal only) | — | — | New webinar brief on reading recovery data without overreacting |
| `social/linkedin-1..4.md`, `social/instagram-1..4.md` | — (proposal only) | — | — | 8-post batch; see Images section for credits |

## 5. Funnel

New article `funnelStage`: **decision** — primary keyword follows the
"… software for …" transactional pattern (Step 4 intent mapping). The site
will render the standard decision-stage CTA under the article, **and** the
article body includes exactly one in-body `ctaCard` as its last child
(heading: "Let recovery data adjust the plan for you", tied to the Recovery
signals feature anchor, button → `https://app.trainzilla.in/register`).

## 6. Author / category to attach

For `drafts/article-new.json`, in the Payload admin, set:
- **author**: `vikram-singh` (Vikram Singh) — the author used for the three
  most recent `ai-technology` articles (`ai-coaching-client-experience`,
  `connect-trainzilla-to-claude`, `ai-agents-mcp-coaching`), for consistency.
- **category**: `ai-technology`

## 7. How to apply

```
export TRAINZILLA_CMS_MCP_KEY=...        # from MCP_LOCAL_NOTES.md
node scripts/seo/apply-cycle.mjs cycles/2026-09-28 --dry-run
node scripts/seo/apply-cycle.mjs cycles/2026-09-28
```

The five `seoPages` refreshes above go **live immediately** when that command
succeeds (`src/hooks/mcpDraftGuard.ts` exempts `seoPages` from the draft
guard). The new article lands as an **unpublished draft version** — publish
it at `https://cms.trainzilla.in/admin` after attaching the author/category
named above and confirming `funnelStage: decision` is set.

## 8. Images

Full table: `images.md`. All 7 images used (article hero reused once by
LinkedIn 1) are from the committed `scripts/seo/_images/recovery-aware.json`
pool — Wikimedia Commons, CC BY-SA 4.0 / CC BY 2.0, attribution strings
carried verbatim into the article's `_image` block and every post's
`image_credit`.

- **Article hero**: "The women netball team players stretching" —
  https://upload.wikimedia.org/wikipedia/commons/f/ff/The_women_netball_team_players_stretching.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original
  — Photo: Rwebogora / Wikimedia Commons — CC BY-SA 4.0.

No `TODO` images this cycle. Two LinkedIn posts (3 and 4) ship without an
image — allowed, since LinkedIn images are optional per the playbook, rather
than stretching the pool's 6 usable entries further or reusing the hero more
than once.

## 9. Review checklist

- [x] Keyword intent matches page + `funnelStage` (transactional → decision)
- [x] Every draft has a feature anchor
- [x] No invented stats, customer names, testimonials or benchmarks anywhere
      in the article, seoPages refreshes, webinar brief, or social posts
- [x] Global English — no country-specific framing or currency (topic is not
      geo-specific; Coach Pro pricing not referenced, since it's not central
      to this topic)
- [x] Internal links present (article links to `/agent` and
      `/blog/ai-coaching-client-experience`)
- [x] Social posts have no unverifiable claims; posts derived from the new
      article link to `https://trainzilla.in/blog/recovery-tracking-software-personal-trainers`
      (not the homepage); posts derived from a refreshed seoPage link to
      that page's path; the webinar-derived post links to `/webinars`
- [x] Every image is a pool entry matching the topic, attribution carried
      through to `images.md`, the article `_image` block, and each social
      post's `image_credit`

## 10. Risks / notes

- **Image pool is thin and off-topic for this specific cluster.** The
  `recovery-aware` pool was built from a single query ("stretching
  exercise") and contains generic stretching photos, not anything depicting
  wearables, sleep tracking, or app UI. I used the 6 photos that read as
  generic, professional fitness images and skipped 2 animal photos (a lion,
  a cheetah) and 1 identifiable-named-person photo also in that pool as poor
  fits for commercial use, rather than stretching the definition of "usable
  match." No fallback pool was needed since ≥3 usable matches existed, but a
  reviewer should judge whether "stretching" imagery is close enough to a
  recovery/wearable-data article, or whether the image pool needs a broader
  query set for this focus area next time it's rebuilt.
- **Live CMS fetch is still fully blocked** (403 on every endpoint, as
  expected in this sandbox) — this cycle is built entirely from the
  2026-09-21 committed snapshot. If the CMS has changed materially since
  then (new pages, renamed keys), the 5 `seoPages` keys targeted here should
  be spot-checked against the current admin before applying.
- **No Ahrefs data** — all volume/difficulty/KD figures in
  `research/keywords.md` are estimates from SERP inspection, clearly marked
  as such, with the `## AHREFS (when connected)` stub left in place.
- **This PR is not merged and the CMS has not been written to.** Per
  `scripts/seo/PLAYBOOK.md` ("Do not merge it. Do not write to the CMS.")
  and its Hard Rules, this routine has no MCP key, cannot reach
  `cms.trainzilla.in`, and stops at opening this PR. A human applies
  `drafts/*.json` with `apply-cycle.mjs` after reviewing the diff (Section 7).
