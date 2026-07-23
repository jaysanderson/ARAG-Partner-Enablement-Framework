# Build 12 — Lesson: Capstone Prep

> Read time: 15 minutes.
>
> This is the synthesis Build. Everything from Builds 0–11 composes here.

## Why Build 12 exists

The capstone is eight weeks of focused work for one engineer. Without a plan, that eight weeks turns into twelve. With a plan, four. Build 12 is the plan.

Specifically, you'll:

1. Pick the capstone variant — Atlas Operations (Enterprise) or Aurora Concierge (CX).
2. Write the master prompt set — 8 briefs the AI will execute to produce the capstone.
3. Sketch the 25-minute customer demo arc.
4. Get review-board sign-off on the plan before you start building.

The capstone itself is documented in [`../build-13-capstone/`](../build-13-capstone/). This Build is the *preparation* for it.

## Choose your variant

The capstone ships in two pre-designed variants. You pick the one matching your partner book of business.

| Variant | Buyer | Persona corpus | Killer demo moment |
|---|---|---|---|
| **Atlas Operations** | CTO, CIO, Chief Data Officer | Atlas Global Industries (industrial manufacturer, one KB + business-unit labelsets) | Composite-RAG incident root-cause + cross-functional typed graph |
| **Aurora Concierge** | CMO, Head of Digital, Chief Customer Officer | Aurora Outfitters (D2C outdoor retailer, one KB + content-type labelsets) | Two-voice floating chat + content-engineered CTAs + abandoned-cart composite RAG |

Both build the same underlying architecture (one KB, labelsets, a data-augmentation agent, three Tier 3 workflows, one composite RAG flow, residency badge + live KB stats in the header). They differ in **buyer**, **demo script**, and **commercial framing**.

If you're not sure, default to Atlas — it's the broader applicable demo and works for CTO and CMO audiences in adapted form.

Read the full brief for your chosen variant before this Build's walkthrough.

## The capstone architecture (recap)

Whichever variant you pick, the capstone is built on:

- **One KB** (`kb-atlas-operations` or `kb-aurora-concierge`).
- **One labelset** at minimum (e.g., `business_unit` for Atlas, `content_type` for Aurora) — additional labelsets are optional add-ons for the full persona-driven demo.
- **A data-augmentation agent** producing a typed knowledge graph.
- **A single Vite + React app** at the partner's domain.
- **Six demo surfaces**: a landing page, search, conversational concierge, structured-workflows, knowledge-graph viewer, and a flagship composite-RAG flow.
- **A residency badge + live ingested-corpus stats** in the header — visible proof the KB exists and is in the region the customer expects.

Build 13 (the capstone itself) is just composition of everything from Builds 1–11. Nothing fundamentally new. The art is in the orchestration.

## The 8 master prompts

To vibe-code the capstone, you'll run 8 AI prompts in sequence. Each produces one major chunk. Each builds on the previous.

| # | Prompt brief | What it produces |
|---|---|---|
| 1 | Scaffold the app | Fresh Vite + React + TypeScript project; Tailwind configured; routing for 6 surfaces; design-system palette applied |
| 2 | ARAG client wrapper | `src/lib/ragClient.ts` — the wrapper from Builds 0+3+5+10 with streaming, sync, schema, and composite support |
| 3 | Header + landing page | Brand header with residency badge + live ingested-corpus stats; landing page with hero copy + featured-content carousel |
| 4 | Search surface | `/search` route with content-type chips + labelset facets (Build 7) + AI-summary card (Build 5 schema) + paginated results |
| 5 | Conversational concierge | `/concierge` route with two-voice toggle (Build 3) + multilingual switch (Build 4) + field-engineered CTAs (Build 9) |
| 6 | Workflows page | `/workflows` route with the three Tier 3 schema-constrained workflows (Build 5) |
| 7 | Knowledge graph viewer | `/graph` route with the graph navigation UI (Build 8) |
| 8 | Composite flagship flow | `/incident-root-cause` or `/abandoned-cart` route (depending on variant) — the flagship composite-RAG pipeline (Build 10) with step-by-step visualisation |

Each prompt is 200–500 words. Each will produce 100–600 lines of generated code. The AI will get some things wrong; you iterate. Plan for 2–3 hours of vibe-coding per prompt for a total of 16–24 hours pure AI-direction time — plus ingest, labelset config, agent config, demo rehearsal.

## Anatomy of a good master prompt

```
Goal:
  <one-sentence outcome>

Context:
  - I'm building <X variant> capstone. Single KB at <env var>.
  - Existing files: <what's already in the project>.
  - This builds on prompt <N>'s output.

Spec:
  - <bullet 1>
  - <bullet 2>
  - <bullet 3>
  ...

Conventions:
  - Use ragClient (already exported from src/lib/ragClient.ts).
  - Use the design system in tailwind.config.ts.
  - All routes use React Router v7.

Verification:
  After generation, I'll check: <list of things to verify>
```

The AI is good at the *implementation*. You direct on *contract* — what goes in, what comes out, what conventions to follow. Build 12's walkthrough has you write all 8 prompts before you start building.

## The 25-minute customer demo arc

Every capstone runs to a 25-minute talk track. The structure is the same across variants:

| Minute | Section | Purpose |
|---|---|---|
| 0–2 | Hero + residency badge + live KB stats | Show this is a real, live KB in the customer's region — not a static demo. |
| 2–6 | Search demo | Tier 1 reflex; show grounded search with filters. |
| 6–10 | Concierge demo | Tier 2 differentiation; two voices + multilingual. |
| 10–15 | Structured workflows | Tier 3 unlock; show 3 workflows producing typed outputs. |
| 15–20 | Knowledge graph | Tier 4 wow; navigate the typed graph; show a question only the graph can answer. |
| 20–23 | Composite flagship flow | The headline moment; multi-step pipeline visualised. |
| 23–25 | Close + invitation | Pitch the co-engineered POC. Book the next meeting. |

Build the demo script in parallel with the code. Don't leave it to the end.

## The review-board gate

Before you start the 8 vibe-coding sessions, your plan needs sign-off from a Progress Solution lead. The review board checks:

- Variant choice matches the partner's customer book.
- Master prompts are explicit, not vague.
- Demo script arc is logical and ends in a clear next-step ask.
- Build estimate is realistic (8 weeks solo / 4 at 2 FTE).
- Production-readiness checklist (Build 10) is folded into the plan.

A passing review-board sign-off gates the capstone build itself. Plan first, build second.

## What you'll write in the walkthrough

Three deliverables:

1. **`variant-choice.md`** — which variant + why + your partner's customer-book mapping.
2. **`master-prompts.md`** — all 8 prompts written out, ready for the AI sessions.
3. **`demo-script.md`** — the 25-minute talk track sketched section by section.

Then submit all three for review-board sign-off before starting Build 12.

## Common pitfalls

- **Skipping the planning Build and diving into vibe-coding.** Eight weeks expands to twelve.
- **Vague master prompts.** "Build me a chat surface" doesn't work. "Build a `/concierge` route with two prompt modes, language switch, CTA pill rendering, deep-link autosubmit, using the existing ragClient" does.
- **Building before the demo script exists.** You end up with a working app and no story. Demo first; code follows the demo.
- **Skipping review board.** Saves you four weeks of mistakes.

## What's next

[Build 13 — The Capstone](../build-13-capstone/). Pick your variant: [Atlas Operations](../build-13-capstone/atlas-operations/) or [Aurora Concierge](../build-13-capstone/aurora-concierge/). Eight weeks of focused vibe-coding (or 4 at 2 FTE). Final review-board defence at the end. Cert awarded on pass.

This is what the whole course has been preparing for.
