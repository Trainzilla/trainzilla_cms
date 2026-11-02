# Competitive research — Scale for solo → small team (2026-11-02)

Primary keyword: `habit tracking software for personal trainers`. Competitors
identified via SERP inspection (web search), not Ahrefs.

## Page-1 competitors

1. **FitBudd** — https://www.fitbudd.com/insights/best-habit-coaching-habit-tracking-apps-for-trainers
   Angle: a vendor-run "best habit apps for trainers" listicle that (unsurprisingly)
   ranks FitBudd itself favourably. Covers assigning custom daily habits and
   reviewing completion/compliance trends. Omits: any detail on *bulk* assignment
   across a whole roster, or what happens when you update a habit definition
   after it's already assigned to clients.

2. **HubFit** — https://hubfit.com/feature/habits, https://hubfit.com/blog/top-5-habit-coaching-apps-for-online-coaches
   Angle: habit coaching bundled with workout programming, nutrition, messaging.
   Marketed hard at "online coaches." Omits: no documented bulk/roster-wide
   assignment; content doesn't address multi-trainer teams at all.

3. **Gymkee** — https://gymkee.com/help/coach/habits-on-gymkee-complete-guide-for-personal-trainers/
   Angle: the most concrete bulk workflow on page 1 — "Select All" in a client
   picker, choose a habit template, set start date/duration. Caps at 12 habits
   per client. Strongest documented bulk-assign competitor. Omits: nothing in
   its help docs addresses what happens to *already-assigned* clients if the
   coach edits the master habit definition later (push an update vs. one-time
   push) — this is exactly where "master habits" differentiates.

4. **Trainerize (ABC Trainerize)** — https://ideas.abcfitness.com/forums/.../assign-habits-to-multiple-clients
   Angle: large, established brand, ranks on brand strength more than content
   depth for this specific query. A live feature-request thread asking for
   "assign a habit to all clients at once" suggests roster-wide habit
   assignment is a known gap even for an established competitor.

5. **TrainerFu / MyPTHub** — https://help.trainerfu.com/..., https://www.mypthub.net/?p=19162
   Angle: help-center documentation ranking organically (thin content, not
   written to target the keyword). TrainerFu's own docs describe assigning one
   habit to selected clients one action at a time, not a reusable master
   definition. MyPTHub advertises "assign to multiple clients or client groups"
   but with no detail on groups-as-templates.

## Content gap

None of the five describe a habit as a **reusable, centrally-edited
definition** that then propagates to everyone it's assigned to — they describe
*bulk assignment* (a one-time action applied to many clients), not a *master
record* a coach edits once and has it reflected everywhere downstream. That is
exactly TrainZilla's **Master habits** feature (`docs/feature-inventory.md`,
`[GAP]`): "one habit definition, rolled out across your whole roster."

Two concrete things none of the five page-1 competitors cover, which TrainZilla
can, because of real shipped features:

1. **Editing a master habit updates every client it's assigned to** — not a
   one-time bulk push. None of Gymkee, Trainerize, TrainerFu, MyPTHub, HubFit,
   or FitBudd document this as a workflow.
2. **Scaling the habit definition alongside a growing team** — none of the
   five address what happens when a solo trainer brings on a second coach and
   needs the same habit library to apply consistently across both coaches'
   client lists. This ties the habit-template mechanism directly to the
   "solo → small team" scale narrative (not just a client-count problem).

A secondary, smaller gap: the "onboarding a second trainer" research cluster
(Wodify, Fisikal, Health & Fitness Association) is almost entirely about
30/60/90-day people-process onboarding, not about handing a new coach a
ready-made, reusable plan/habit library on day one — a natural internal link
from this article to TrainZilla's plan-template and client-management pages.
