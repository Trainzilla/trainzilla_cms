# SEO cycle 2026-09-03 — focus: AI auto-adjust & coach-in-the-loop

## 1. Focus area

ISO week **36** → `36 % 6 = 0` → focus area **0: "AI auto-adjust & coach-in-
the-loop"** (the flagship GAP cluster), per the rotation in
`docs/feature-inventory.md`.

## 2. Feature anchors used

All three are tagged `[GAP]` in `docs/feature-inventory.md`:

- **AI Coach agent — weekly auto-adjust of workout & diet plans**
- **Coach-in-the-loop review**
- **Guardrails on AI plan changes**

The closely related `[GAP]` feature **"Why this changed" rationale on every
AI edit** also appears throughout the drafts (it's the connective tissue for
"coach-in-the-loop" — a review queue is only useful if the reason for a
change is visible), and is the explicit anchor for `seo-refresh-
aiFitnessRevolution.json` and `instagram-2.md`.

## 3. Keyword targets

Full research: `research/keywords.md` (supporting set + PAA + SERP notes) and
`research/competitive.md` (competitor breakdown + content gap).

| Keyword | Role | Intent | Est. difficulty | Est. volume |
| --- | --- | --- | --- | --- |
| AI workout builder for coaches | Primary (new article) | commercial | med | moderate |
| AI workout plan generator for personal trainers | Supporting | commercial | high | high |
| AI workout builder guardrails | Supporting | informational | low | nascent |
| human-in-the-loop AI coaching | Supporting | informational | low–med | low |
| AI adjusts workout plan automatically | Supporting | informational | med | moderate |
| can AI replace a personal trainer | Supporting | informational | high | high |
| why did my AI workout plan change | Supporting | informational | low | nascent |
| coach approval AI workout plan | Supporting | commercial | low | nascent |
| AI training plan explainability | Supporting | informational | low | nascent |

(Full 14-term list with reasons in `research/keywords.md`.) No Ahrefs
connector this cycle — volume/difficulty are SERP-inspection estimates; see
the `## AHREFS (when connected)` stub in that file.

## 4. Changes in this cycle

| File | Collection | Op | Target | Rationale (one line) |
| --- | --- | --- | --- | --- |
| `drafts/article-new.json` | articles | create | new slug `ai-workout-builder-coach-approval` | New article claiming the "coach approval / guardrails / explainability" content gap no page-1 competitor covers |
| `drafts/seo-refresh-agent.json` | seoPages | update | `agent` | Sharpened toward guardrails + plain-language reason; added "human-in-the-loop AI coaching" / "coach approval AI workout plan" |
| `drafts/seo-refresh-ai-coach.json` | seoPages | update | `ai-coach` | De-duplicated from `agent`'s copy; named the weekly-rewrite mechanism + guardrails explicitly |
| `drafts/seo-refresh-ai-integration.json` | seoPages | update | `ai-integration` | Added the safety/guardrails signal for technical searchers evaluating the data-access integration |
| `drafts/seo-refresh-aiFitnessRevolution.json` | seoPages | update | `aiFitnessRevolution` | Tightened this existing article's metadata to name the weekly cadence + explainability concretely, targeting adjacent long-tail to the new article rather than duplicating it |
| `drafts/seo-refresh-home.json` | seoPages | update | `home` | Added the explainability + approval trust signal to the homepage description without touching the title or the existing payments/app/CTA content |
| `drafts/webinar-topic.md` | — (proposal) | — | new webinar idea | Mechanics-first walkthrough of the AI Coach agent's weekly loop, complementing (not replacing) the existing `ai-fitness-coaching` webinar |
| `social/linkedin-1.md` … `-4.md` | — (proposal) | — | LinkedIn queue | Drawn from the new article, the `ai-coach` refresh, the `agent` refresh, and the webinar proposal |
| `social/instagram-1.md` … `-4.md` | — (proposal) | — | Instagram queue | Drawn from the new article, `aiFitnessRevolution` refresh, `ai-integration` refresh, and the webinar proposal |
| `social/queue/2026-09-03/*` | — | — | durable social queue | Copy of the above 8 posts for the social team |

## 5. Author / category to attach (new article only)

`drafts/article-new.json` intentionally omits `author` and `category`
(relationships) — attach in the admin:

- **Category:** `ai-technology` (AI & Technology) — matches the sibling
  article `ai-fitness-revolution`.
- **Author:** `priya-sharma` (Dr. Priya Sharma — "AI Researcher & Fitness
  Technology Expert") — closest existing author bio to a mechanics-of-the-
  AI-agent piece. `arun-malhotra` or another author slug from
  `inputs/authors.json` also works if you want a different byline.

## 6. How to apply

```bash
export TRAINZILLA_CMS_MCP_KEY=...        # from MCP_LOCAL_NOTES.md
node scripts/seo/apply-cycle.mjs cycles/2026-09-03 --dry-run
node scripts/seo/apply-cycle.mjs cycles/2026-09-03
# then publish the good drafts at https://cms.trainzilla.in/admin
# — attach author/category on the new article per section 5 above
```

## 7. Review checklist

- [ ] Keyword intent matches page (informational article vs. commercial
      product pages vs. transactional webinar sign-up)
- [ ] Every draft has a feature anchor made concrete (not just name-dropped)
- [ ] No invented stats, customer names, testimonials, or benchmarks
- [ ] Global English — no country-specific framing (deliberately dropped the
      India-specific framing style of the older seed article
      `ai-fitness-revolution.json` body, since none of this cycle's target
      keywords are geo-specific)
- [ ] Internal link present in the new article (`/agent`)
- [ ] Social posts have no unverifiable claims
- [ ] `seo-refresh-agent.json` and `seo-refresh-ai-coach.json` descriptions
      read as distinct from each other (both target the same cluster —
      check they don't cannibalize)

## 8. Risks / notes

- **CMS snapshot:** live refresh (`node scripts/seo/fetch-cms-state.mjs`) was
  attempted and failed as expected (403 Forbidden — sandbox can't reach
  `cms.trainzilla.in`). The cycle used the **committed snapshot**
  (`scripts/seo/_snapshot/inputs/`, `fetchedAt: 2026-09-03T10:09:28.285Z`),
  which was already same-day fresh. Note: the failed live-fetch attempt
  regenerated `inputs/content-index.md` with empty (0-doc) tables before this
  was caught — it was restored from the committed snapshot's copy, and the
  restored `inputs/` directory was diffed file-for-file against
  `scripts/seo/_snapshot/inputs/` to confirm it matches exactly. The
  per-collection JSON files (`articles.json`, `seoPages.json`, etc.) were
  never at risk — `fetch-cms-state.mjs` only overwrites those on a
  successful fetch.
- **New article vs. existing article:** `ai-fitness-revolution` (existing)
  and the new `ai-workout-builder-coach-approval` cover the same broad
  cluster (AI + personal training) but at different funnel stages —
  thought-leadership vs. mechanics-and-trust. Worth a skim to confirm they
  don't feel redundant once the metadata refresh (item 4 above) is also
  live.
- **`ai-integration` title change** ("Connect Coaching Data to an AI Agent,
  Safely") is a bigger wording shift than the others on that page — flagged
  for a closer look since `/solutions/ai-agent` may have more technical
  search traffic where "Safely" changes the framing more than intended.
- **No Ahrefs this cycle** — all volume/difficulty figures in
  `research/keywords.md` are SERP-inspection estimates, explicitly labelled
  as such.
- **Trainzilla MCP tool access:** a `Trainzilla` MCP server (client/session
  data — `list_clients`, `get_client_profile`, `billing_summary`, etc.)
  connected mid-session but was **not used** for this cycle — it exposes
  live production/customer data, which is out of scope for a public content
  pipeline and unrelated to the playbook's web-research + feature-inventory
  method. Flagging in case its presence in this environment is unexpected.
