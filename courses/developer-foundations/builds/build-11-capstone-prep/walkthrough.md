# Build 11 — Walkthrough: Capstone Prep

> Estimated time: 2 hours focused. Read the [lesson](lesson.md) first. Final exam must be passed before starting this Build.

## Goal

Three planning artefacts ready for review-board sign-off: variant choice + master prompts + demo script. With these in hand, Build 12 (the capstone itself) becomes 8 weeks of focused execution instead of 12 weeks of discovery.

## 1. Choose your variant (20 min)

Read the two capstone briefs in full:

- [Atlas Operations](../build-12-capstone/atlas-operations/README.md) — Enterprise / Operations buyer (CTO/CIO).
- [Aurora Concierge](../build-12-capstone/aurora-concierge/README.md) — CX / Digital buyer (CMO/Head of Digital).

Open `variant-choice.md` in this folder. Write 6–10 sentences covering:

1. Which variant you're building.
2. Why — map it to your partner's actual customer book (or your target customer profile).
3. Three named customers (real or prospective) you'd take this demo to.
4. The objection from each that this variant kills.

This becomes the first page of your review-board submission.

## 2. Skim Builds 0–10 outputs (15 min)

Walk through your own working folder from each Build. Confirm you have:

- Build 0: `ask.mjs` (streaming client demo)
- Build 1: `primitives-demo.mjs` (5-primitive tour)
- Build 2: `index.html` (widgets demo)
- Build 3: `MultiSurfaceChat.tsx` (two-voice chat)
- Build 4: `buildPrefix.ts` (multilingual + persona + scope)
- Build 5: `askForJson.ts` + the three workflow scripts
- Build 6: search UI with filters + `labelset-design.md`
- Build 7: `graphClient.ts` + `GraphPage.tsx`
- Build 8: custom fields configured + post-processor working
- Build 9: `compositeRag.ts` + comparison UI
- Build 10: `rateLimitedRagClient.ts` + residency statement + production checklist

These are your **building blocks**. The capstone composes them. Anything missing — go back and finish before starting Build 12.

## 3. Write the 8 master prompts (60 min)

Open `master-prompts.md`. For each of the 8 prompts in the table below, write 200–500 words of brief. Be explicit about:

- The goal (one sentence).
- Existing files this builds on.
- Specific bullets of what to produce.
- Conventions (ragClient usage, design-system reuse, routing patterns).
- Verification steps.

Use the prompt anatomy template from the lesson.

| # | Prompt brief topic |
|---|---|
| 1 | Scaffold the app (Vite + React + TS, Tailwind, 6 routes, design system) |
| 2 | `ragClient.ts` wrapper (streaming + sync + schema + composite) |
| 3 | Header + landing page (residency badge, BYO-LLM toggle, brand hero) |
| 4 | `/search` route (content-type chips + labelset facets + AI summary) |
| 5 | `/concierge` route (two-voice + multilingual + CTA pills) |
| 6 | `/workflows` route (three schema-constrained generators) |
| 7 | `/graph` route (graph viewer with fuzzy search + click-expand) |
| 8 | Flagship composite-RAG flow (`/incident-root-cause` for Atlas; `/abandoned-cart` for Aurora) |

Each prompt should reference the relevant Foundations Build's lesson for the underlying pattern.

This document is the second page of your review-board submission.

## 4. Sketch the 25-minute demo script (25 min)

Open `demo-script.md`. Lay out the 7-section talk track:

```
0:00–2:00  Hero + BYO-LLM toggle
2:00–6:00  Search demo
6:00–10:00 Concierge demo
10:00–15:00 Structured workflows
15:00–20:00 Knowledge graph
20:00–23:00 Composite flagship flow
23:00–25:00 Close + invitation
```

For each section, write 4–6 bullets:

- What you'll click / type on screen.
- The 30-second talk-track sketch (full script comes later).
- The customer-objection-killing moment in that section.

You're not writing the final video script here — that's a Build 12 task. You're sketching the *arc* so the code you generate follows it.

This is the third page of your review-board submission.

## 5. Review-board submission (15 min)

Bundle `variant-choice.md` + `master-prompts.md` + `demo-script.md` into a single PDF or Notion doc. Submit to your Progress Solution lead via `#capstone-review-board`.

Expect feedback within 5 business days. Common revision asks:

- **Variant choice doesn't match partner book.** Switch variants.
- **Prompts are too vague.** Add specific contract details.
- **Demo script doesn't book a next meeting.** Add an explicit invitation at minute 23–25.
- **Build estimate is unrealistic.** Increase to 10–12 weeks or commit a 2-FTE plan.

Iterate until pass.

## 6. Record a 5-minute pitch (10 min)

Once your review-board pass is signed, record yourself:

1. (60 sec) Read your variant-choice rationale.
2. (90 sec) Walk through the demo arc — 7 sections, 25-minute total.
3. (60 sec) Read prompt #1 (the scaffolding prompt) aloud — show the level of specificity in the briefs.
4. (60 sec) Read prompt #8 (the flagship composite-RAG prompt) — show how it composes everything from Builds 1–10.
5. (30 sec) Close: "Eight prompts. Eight weeks. The capstone vibe-codes from here."

Upload to `#build-clinic-submissions`. This recording is partly for the reviewer and partly for the partner's own team — when they pick up the capstone, your 5-minute summary is what gets them oriented.

## Verification checklist

- [ ] `variant-choice.md` written with named customers + objections.
- [ ] All 11 prior Builds' deliverables present in your working folder.
- [ ] `master-prompts.md` with 8 prompts of 200–500 words each.
- [ ] `demo-script.md` with 7 sections sketched.
- [ ] Review-board submission bundled and sent.
- [ ] Review-board pass signed off.
- [ ] 5-minute pitch recorded.

## Next

[Build 12 — The Capstone](../build-12-capstone/). Pick your variant and start building. This is what the whole course was for.
