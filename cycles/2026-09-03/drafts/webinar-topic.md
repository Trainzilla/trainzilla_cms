# Webinar topic proposal — 2026-09-03 cycle

**This is a proposal only — not a CMS write.** A human decides whether to
schedule/produce it.

## Working title

**"Inside the AI Coach Agent: What It Changes, Why, and When You Have to Say No"**

## Abstract (2 sentences)

A walkthrough of exactly what TrainZilla's AI Coach agent does to a client's
workout and diet plan every week — the data it reads, the guardrails that
bound its changes, and the one-tap review queue that stops any edit from
reaching a client without a coach's sign-off. Aimed at coaches who are
curious about the AI agent but hesitant to hand over plan-writing without
understanding exactly how much control they keep.

## 5-point outline

1. **What actually triggers a change** — check-ins, logs, missed sessions,
   habit data; the weekly cadence, not a random re-roll.
2. **Reading the review queue** — live look at a proposed change, the plain-
   language "why this changed" note, and the diff view.
3. **Guardrails, in numbers** — how volume/intensity/calorie bounds are set
   per client, and what happens when a proposed change would exceed them
   (it's flagged, not auto-applied).
4. **When to override it** — real scenarios where a coach should reject or
   edit an AI-proposed change (injury not yet logged, upcoming travel,
   a client under extra stress).
5. **Live Q&A** — coaches submit their own "would the AI have caught this?"
   scenarios in advance.

## Primary keyword it would target

**AI workout builder for coaches** (same as `drafts/article-new.json`) — the
webinar page reinforces the same cluster and can internally link to/from the
new article and the `agent` / `ai-coach` seoPages.

## Feature anchor

Coach-in-the-loop review `[GAP]` and Guardrails on AI plan changes `[GAP]`
(both from `docs/feature-inventory.md`), with "Why this changed" rationale
`[GAP]` as the connecting thread across the outline.

## Relationship to existing webinars

Closest existing webinar in the snapshot: **`ai-fitness-coaching`** — "AI-
Powered Fitness Coaching for Indian Trainers" ("Master the Future of Personal
Training with Artificial Intelligence"). This proposal **complements** it
rather than replacing it: the existing webinar is broad, future-of-the-
industry framing; this one is a narrow, mechanics-first walkthrough of one
specific feature (the AI Coach agent's weekly loop) aimed at coaches already
past the "should I use AI at all" question and evaluating whether they'd
trust it with their own client roster. Global-English framing (no
India-specific angle) since none of the target keywords are geo-specific,
unlike the existing webinar.
