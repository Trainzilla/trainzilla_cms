# Competitive research — multi-location gym management software

## Competitors ranking page 1 for the primary keyword

1. **ABC Ignite** — https://abcfitness.com/abc-articles/gym-management-software-multi-location/
   - Angle: enterprise scale proof point (9,300+ facilities, Planet Fitness), billing/revenue-cycle management, 90-day automated recovery on failed payments.
   - Omits: no per-coach revenue or payout detail — everything is billing/collections at the member level, not how a coach or franchisee gets paid.
   - Content age: reads current (2026 dated), heavily enterprise-sales-page in tone.

2. **Mindbody** — via roundups (Zenoti, GetApp)
   - Angle: centralized reporting and a standardized class menu across sites; broad multi-vertical (studios, salons, spas) positioning.
   - Omits: no franchise-specific revenue-share or payout automation; reporting is location-level, not coach-level.
   - Content age: mature, well-optimized long-standing product pages.

3. **Glofox** — https://www.glofox.com/features/multi-location/
   - Angle: "roll-up reporting" — one dashboard comparing revenue, membership, attendance, retention site-by-site.
   - Omits: stops at location-level comparison; no coach-attendance tracking or automated coach payout described.
   - Content age: current, feature-page format (thin on educational depth).

4. **FLiiP** — https://myfliip.com/solutions/multi-location
   - Angle: closest competitor on the money side — "see revenue and royalty payments per location in one dashboard instead of chasing month-end statements from each franchisee."
   - Omits: talks about franchisor↔franchisee royalty, not franchise-owner↔individual-coach revenue share or payout. No mention of an automated payment-rail payout (e.g., UPI/Razorpay-style instant transfer) — implies manual statement reconciliation still happens somewhere in the chain.
   - Content age: current, product marketing page, not educational content.

5. **Wellyx / MyStudio** (payout angle) — https://wellyx.com/, https://www.mystudio.io/franchise
   - Angle: custom commission structures per trainer (Wellyx), automated franchisee fee collection with next-day payouts (MyStudio).
   - Omits: commission *calculation* is covered, but not tied to a specific automatic settlement rail, and neither surfaces coach-level attendance or per-coach revenue in the same view as payouts.
   - Content age: current, feature-list style, not narrative/educational.

## Content gap — what none of them cover, that TrainZilla can

1. **Coach-level revenue, not just location-level.** Every competitor above stops at "revenue per location" (Glofox, FLiiP). None break it down to "which coach, at which location, is actually profitable" in the same dashboard. TrainZilla's **per-location & per-coach revenue dashboards** (`[GAP]`) close this — a gym owner can see the metric FLiiP/Glofox already report *plus* the coach layer none of them show.

2. **Payout automation without a manual settlement step.** FLiiP explicitly frames its royalty reporting as replacing "chasing month-end statements from each franchisee" — but stops at reporting, not settlement. Wellyx/MyStudio automate the calculation and franchisee-level payout, but not a coach-level revenue-share payout that lands directly in a bank account without an invoice. TrainZilla's **Razorpay Route payouts** (`[GAP]`) — the gym's cut is taken automatically and each coach's share reaches their bank account with no invoice step — is a concrete mechanism none of these five describe.

3. **Coach attendance as part of the same operational picture.** All five competitors treat staff/coach management as scheduling, not as an accountability metric sitting next to revenue. TrainZilla's **coach attendance tracking** (`[GAP]`) — "know which coaches showed up, per shift" — lets a multi-location operator connect a coach's presence directly to the revenue they're credited with, which none of the page-1 results do in one place.

Feature anchors used this cycle (from `docs/feature-inventory.md`, "Organizations" section): **per-location & per-coach revenue dashboards**, **Razorpay Route payouts**, **coach attendance tracking** — all `[GAP]`.
