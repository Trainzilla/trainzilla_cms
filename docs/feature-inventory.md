# TrainZilla feature inventory (for SEO / content anchoring)

Every piece of content produced by the SEO pipeline **must anchor on at least one
real feature from this list** — preferably one tagged `[GAP]`. This file is the
bridge between "what marketing keywords are hot" and "what the product actually
does".

Source of truth: the `tzilla-be` backend (GraphQL schema + service code) and the
coach / client apps. Reverse-engineered 2026-09-03. When the backend ships
something new, add a row here in the same PR cadence.

Tags:
- `[MARKETED]` — already covered well on the site; use as supporting proof, not the headline.
- `[PARTIAL]` — mentioned somewhere but thin; a content piece can go deeper.
- `[GAP]` — real, shipped, and barely marketed. **Prioritise these.** These are the
  "cutting-edge features we're not able to market" the pipeline exists to surface.

---

## AI coaching

| Feature | Tag | One-line hook | Notes for writers |
| --- | --- | --- | --- |
| AI Coach agent — weekly auto-adjust of workout & diet plans | `[GAP]` | "Your plans update themselves every week, based on what actually happened." | Uses check-in + tracking + habit data. Not a chatbot — it rewrites the plan. |
| Coach-in-the-loop review | `[GAP]` | "Every AI change waits for the coach's one-tap approval." | Key differentiator vs fully-automated apps. Trust / safety angle. |
| "Why this changed" rationale on every AI edit | `[GAP]` | "The AI shows its reasoning in plain language, per change." | Explainability. Good for skeptical-coach and trust-focused keywords. |
| Guardrails on AI plan changes | `[GAP]` | "Volume, intensity and calorie swings are bounded — no wild jumps." | Safety / injury-prevention angle. |
| AI credit metering (transparent per-action cost) | `[PARTIAL]` | "You see exactly what each AI action costs." | Pricing-transparency angle. Ties to `USD_TO_INR` = 86 conversion. |
| In-dashboard AI Assistant (`coach_agent`, MCP-based) | `[GAP]` | "Ask your dashboard: 'who's slipping this week?' and it answers." | Natural-language ops over the coach's own book of business. |
| Client-facing AI chat | `[PARTIAL]` | "Clients get 24/7 answers that stay on-plan." | Retention / responsiveness angle. |

## Workout

| Feature | Tag | One-line hook | Notes |
| --- | --- | --- | --- |
| Multi-modality programming (gym, home, hybrid, calisthenics, etc.) | `[MARKETED]` | — | Supporting proof only. |
| Training-split templates | `[PARTIAL]` | "Start from a proven split, not a blank page." | Speed-to-first-plan angle. |
| Plan templates (save & reuse whole plans) | `[PARTIAL]` | "Build once, deploy to 50 clients in a tap." | Scale angle for growing coaches. |
| Client-initiated exercise swap | `[GAP]` | "Client hits a broken machine — they swap the exercise, macros/targets hold." | Autonomy without losing plan integrity. |

## Diet

| Feature | Tag | One-line hook | Notes |
| --- | --- | --- | --- |
| Per-ingredient macro breakdown | `[PARTIAL]` | "Macros down to the ingredient, not just the meal." | Precision-nutrition keywords. |
| Meal swap with macro-delta preview | `[GAP]` | "Swap a meal and see the macro difference before you commit." | Adherence / flexibility angle. Very demo-able. |

## Habits & check-ins

| Feature | Tag | One-line hook | Notes |
| --- | --- | --- | --- |
| Habit streaks & milestones | `[MARKETED]` | — | Supporting proof. |
| Master habits (define once, assign to many) | `[GAP]` | "One habit definition, rolled out across your whole roster." | Scale angle. |
| Photo check-ins with Q&A | `[PARTIAL]` | "Progress photos come with structured questions, not just an image." | |
| Recurring check-ins | `[PARTIAL]` | "Set the cadence once; the app chases the client, not you." | Time-saving angle. |

## Tracking & recovery

| Feature | Tag | One-line hook | Notes |
| --- | --- | --- | --- |
| Apple Health / Health Connect sync | `[PARTIAL]` | "Steps, sleep, HR flow in automatically." | |
| Recovery signals feeding the AI Coach | `[GAP]` | "Bad sleep week? The plan dials back before you ask." | Ties tracking → AI auto-adjust. Strong combined story. |

## Sessions, payments, payouts

| Feature | Tag | One-line hook | Notes |
| --- | --- | --- | --- |
| Sessions & availability booking | `[MARKETED]` | — | |
| Payments: Razorpay UPI/card, Google Play, Apple IAP | `[MARKETED]` | — | Multi-rail. |
| Razorpay Route payouts (automatic coach payouts / revenue share) | `[GAP]` | "Gym takes its cut automatically; coaches get paid without an invoice." | Franchise / multi-coach money-flow angle. |
| Marketplace — sell plans & templates | `[PARTIAL]` | "Turn a plan you already wrote into a product." | Passive-revenue keywords. |

## Organizations (gyms / studios / franchises)

| Feature | Tag | One-line hook | Notes |
| --- | --- | --- | --- |
| Multi-location / franchise management | `[PARTIAL]` | "Run 12 locations from one console." | Newly on /pricing (Gym tiers). |
| Per-location & per-coach revenue dashboards | `[GAP]` | "See which location and which coach is actually profitable." | Owner / operator keywords. |
| Coach attendance tracking | `[GAP]` | "Know which coaches showed up, per shift." | Ops angle. |
| Bulk CSV client import | `[PARTIAL]` | "Migrate 300 clients in one upload." | Switching-cost / onboarding angle. |
| Seat tiers: GYM_STARTER / GYM_PRO / ENTERPRISE | `[PARTIAL]` | — | Matches /pricing. |

## Coach branding

| Feature | Tag | One-line hook | Notes |
| --- | --- | --- | --- |
| Public coach slug / landing page | `[PARTIAL]` | "A shareable page that sells you while you sleep." | |
| 20 specialties, transformations, testimonials | `[PARTIAL]` | — | Social-proof angle. |
| Verified badge | `[GAP]` | "A trust signal clients recognise." | |

## Plans / tiers (for pricing-adjacent content)

- Client-side: `NONE` / `FREE_FOREVER` / `PREMIUM` (marketed as **"Coach Pro"**).
- **Coach Pro = ₹499/mo for a single coach.** (Keep in lockstep with /pricing and the
  backend. USD conversion anchor: ₹86 = $1.)
- Free coach + free client apps exist — real acquisition hook, lightly marketed → `[GAP]`.

---

## Rotating focus areas (6-week cycle)

The pipeline picks the focus area by ISO week number: `week % 6`.

0. **AI auto-adjust & coach-in-the-loop** — the flagship GAP cluster.
1. **Gym / franchise operations** — per-location revenue, payouts, attendance, bulk import.
2. **Nutrition flexibility** — meal swap + macro-delta, per-ingredient macros, adherence.
3. **Scale for solo → small team** — plan/habit templates, marketplace, public pages.
4. **Recovery-aware programming** — tracking sync → recovery signals → AI dial-back.
5. **Trust & transparency** — "why this changed", guardrails, verified badge, AI cost metering.
