# Build 12 — Walkthrough: Capstone Prep

> Estimated time: 2–3 hours focused. Read the [lesson](1-lesson.md) first. **Final exam must be passed before starting this Build.**
>
> **This Build is all planning, no coding.** It's the synthesis. You produce three artefacts that turn Build 13 (the actual capstone) from a 12-week discovery exercise into 8 weeks of focused execution.

## What you'll build

Three planning artefacts ready for review-board sign-off:

1. **`variant-choice.md`** — which capstone (Atlas Operations or Aurora Concierge) you'll build, why, and which customers you'd take it to.
2. **`master-prompts.md`** — 8 detailed prompts (200-500 words each) that will direct your AI through Build 13.
3. **`demo-script.md`** — the 25-minute demo arc sketched in 7 sections.

Submit all three to the review board. **Build 13 can't start until they pass.**

## What you'll need open

- **Both capstone briefs** (links below).
- **Your working folders from Builds 0-11** — you'll inventory your existing artefacts.
- **Your AI assistant** — you'll be drafting prompts with its help.
- **Your editor**.

This is a writing Build. No terminals, no `curl`, no Node. Just markdown.

---

## Step 1 — Set up your capstone-prep folder (5 min)

```bash
cd ~/Desktop
mkdir foundations-build-12
cd foundations-build-12
code .
```

We'll create three markdown files in here over the next 2 hours.

---

## Step 2 — Choose your variant (25 min)

### 2a. Read both capstone briefs in full

Open each in your editor (or in GitHub web view):

- **[Atlas Operations](../build-13-capstone/atlas-operations/README.md)** — Enterprise / Operations buyer (CTO, CIO, Head of Infrastructure). Pitch: *"our ops team can't find anything fast enough; incidents take 4x as long as they should."*
- **[Aurora Concierge](../build-13-capstone/aurora-concierge/README.md)** — CX / Digital buyer (CMO, Head of Digital, VP CX). Pitch: *"our customers ask the same questions over and over and our agents can't keep up."*

**Read both completely.** Don't skim. Each is ~2,000 words and lays out the customer pain, the demo flow, the technical spec, the rubric.

### 2b. Choose based on your partner book

Now write `variant-choice.md`. **6-10 sentences.** Answer these specifically:

1. **Which variant are you building?**
2. **Why this one?** Map to your partner org's actual customer book. (Not "I think this one is cooler" — *"my partner's top 3 deals are with insurance ops teams; Atlas fits their CTOs.")*
3. **Three named customers** you'd take this demo to. Real or strongly-prospective. Names, not personas.
4. **The objection from each customer** that this variant kills. *(E.g., "MegaInsurance's CIO said 'AI doesn't work for us.' Atlas's incident-resolution flow shows it does, in their vocabulary.")*

Example template:

```markdown
# Variant choice: <Atlas Operations | Aurora Concierge>

I'm building **<variant>** because <one-sentence rationale tied to my book>.

## Why this variant
<2-3 sentences explaining the fit. Reference specific customer-pain
patterns from your book.>

## Target customers
1. **<Customer 1>**. <Their CTO/CMO/VP CX>. Objection killed: <specific>.
2. **<Customer 2>**. <Their stakeholder>. Objection killed: <specific>.
3. **<Customer 3>**. <Their stakeholder>. Objection killed: <specific>.

## What I expect to win
<1-2 sentences: deal size, timeline, why this gets it.>
```

**This is page 1 of your review-board submission.**

### 2c. Common mistakes to avoid

- ❌ *"I want to build both — they're both interesting."* Pick one. The capstone is 8 weeks; you don't have time to build both.
- ❌ *"My customers are technical so I'll build Atlas."* Atlas isn't "for technical customers" — it's for **Operations buyers**. Aurora isn't "for non-technical customers" — it's for **CX/Digital buyers**. The buyer's persona matters more than their technical depth.
- ❌ Generic customers. *"Three insurance companies"* is not three named customers. Be specific or be unconvincing.

---

## Step 3 — Inventory your prior Builds (15 min)

Walk through each Build folder. Confirm you have working artefacts:

| Build | Expected artefact |
|---|---|
| 0 | `ask.mjs` — streaming client demo |
| 1 | `primitives-demo.mjs` — 5-primitive tour |
| 2 | `index.html` — branded widgets page (deployed publicly) |
| 3 | `MultiSurfaceChat.tsx` — two-voice chat |
| 4 | `buildPrefix.ts` — language + segment + scope levers |
| 5 | `askForJson.mjs` + FAQ + taxonomy + comparison generators |
| 6 | Three augmentation agents configured + `agent-status.mjs` |
| 7 | Search UI with content-type chips + topic facet sidebar |
| 8 | `graphClient.ts` + `GraphPage.tsx` |
| 9 | Custom fields + post-processor + `content-team-guide.md` |
| 10 | `compositeRag.ts` + side-by-side comparison page |
| 11 | `rateLimitedRagClient.mjs` + residency statement + production checklist |

In `variant-choice.md`, append a section "Inventory" listing each artefact with a ✅ next to those you have working, or a 🔧 next to ones that need cleanup before Build 13.

**Anything missing or broken — fix before starting Build 13.** The capstone composes these; if a building block is broken, the capstone is fragile.

---

## Step 4 — Draft the 8 master prompts (75 min)

This is the meaty step. Open `master-prompts.md` and create 8 numbered sections.

### 4a. The 8 prompts

Each prompt is **200-500 words**. Don't shortchange this — the difference between a 100-word vague prompt and a 400-word specific one is **the difference between Build 13 taking 8 weeks or 16**.

| # | Prompt brief topic | What it produces |
|---|---|---|
| 1 | **Scaffold the app** | Vite + React + TypeScript + Tailwind + 6 routes + a shared design system (colors, typography, brand). |
| 2 | **`ragClient.ts` wrapper** | Streaming `streamAsk`, sync `ask`, schema-constrained `askForJson`, composite `compositeAsk` — all in one client. |
| 3 | **Header + landing page** | Brand hero, residency badge, ingested-corpus stats (resources + paragraphs + graph node count from the live KB), navigation to the 6 routes. |
| 4 | **`/search` route** | Filterable search with content-type chips + labelset facets + an AI summary at the top (uses /ask). |
| 5 | **`/concierge` route** (or `/incidents` for Atlas) | Two-voice chat with multilingual lever + persona scope + CTA pills from custom fields. |
| 6 | **`/workflows` route** | Three schema-constrained generators wired as UI (e.g., FAQ-gen, comparison-gen, taxonomy-gen for Aurora; or root-cause-gen, runbook-gen, incident-summary for Atlas). |
| 7 | **`/graph` route** | Graph viewer with fuzzy search + click-expand + right sidebar with hybrid related-resources. |
| 8 | **Flagship composite flow** | `/incident-root-cause` (Atlas) or `/abandoned-cart` (Aurora) — composite RAG with measurable lift over single-shot. |

### 4b. Use the prompt anatomy

Every prompt should follow this anatomy (from the lesson):

```markdown
## Prompt 1: Scaffold the app

### Goal
One sentence — what this prompt produces.

### Builds on
- Build 0 (vibe-coding loop)
- Build 3 (Vite + React setup)
- Build 11 (residency statement; we'll surface it in the UI)

### Specific bullets
- Use Vite + React + TypeScript template.
- Install Tailwind.
- Configure these 6 routes: /search, /concierge, /workflows, /graph,
  /incident-root-cause, / (landing).
- Shared design system in src/styles/tokens.ts: primary, secondary,
  background, text, border colors; font family; spacing scale.
- Header component with brand logo, navigation, residency badge.
- Footer with "Powered by Progress Agentic RAG" and a link to the
  residency statement.
- Read VITE_NUCLIA_API_URL, VITE_NUCLIA_KB_ID, VITE_NUCLIA_API_KEY
  from import.meta.env.

### Conventions
- All ARAG calls go through src/lib/ragClient.ts (which we'll write
  next — Prompt 2). Don't make direct fetch calls anywhere else.
- All routes lazy-load via React.lazy + Suspense.

### Verification
- npm run dev → http://localhost:5173 → landing page renders with header,
  residency badge, footer.
- All 6 routes return a placeholder page (we'll fill them in subsequent
  prompts).
```

### 4c. The depth matters

Three signs of a good prompt:
- **Names files explicitly.** *"src/lib/ragClient.ts"*, not *"a client module."*
- **Names existing artefacts.** *"Reuse buildPrefix from Build 4."*, not *"build a prefix helper."*
- **Names verification.** *"npm run dev → /search renders → submit query → /find request visible in DevTools Network."*

### 4d. Use your AI to help draft

Open your AI assistant. For each prompt, you can ask:

> *"I'm writing a prompt to direct an AI through building [X] for an ARAG capstone. The prompt should be 200-400 words. Here's what it builds on: [Build N artefact]. Here's what it produces: [specific bullets]. Help me draft it."*

Use the AI to refine — but **you must be the editor**. The prompt is in your voice; you'll know if it's tight enough.

### 4e. The deliverable

`master-prompts.md` with all 8 prompts written out. **This is page 2 of your review-board submission.**

---

## Step 5 — Sketch the 25-minute demo (30 min)

Open `demo-script.md`. Lay out the 7-section talk track:

```
0:00–2:00   Hero + residency badge + ingested-corpus stats (live numbers from your KB)
2:00–6:00   Search demo (Aurora) / Incident dashboard (Atlas)
6:00–10:00  Concierge / Conversational ops
10:00–15:00 Structured workflows
15:00–20:00 Knowledge graph
20:00–23:00 Composite flagship flow
23:00–25:00 Close + invitation
```

For each section, write **4-6 bullets**:

- What you'll click / type on screen.
- A 30-second talk-track sketch (full script comes later).
- The customer-objection-killing moment in that section.

Example:

```markdown
## 6:00–10:00 — Concierge demo

### What I'll click
1. Open /concierge.
2. Toggle language to Spanish.
3. Type "¿Cómo cancelo mi póliza?"
4. Show the streaming Spanish answer with citations.
5. Toggle Persona from "Public" to "Member."
6. Re-ask. Show the depth difference.

### 30-second talk-track sketch
"One KB. One model. One codebase. The customer chooses language;
the customer chooses persona. Three filter axes from a UI a sales
rep added in one afternoon — Build 4 of our partner curriculum."

### Objection killed
CMO: "We'd have to redo all our content for Spanish-speaking customers."
Answer: Watch this 5 seconds. (Toggle Spanish.) That's the answer.
```

Save the file. **This is page 3 of your review-board submission.**

---

## Step 6 — Bundle and submit (15 min)

### 6a. Bundle the three artefacts

Combine `variant-choice.md`, `master-prompts.md`, `demo-script.md` into a single submission. Two options:

- **PDF.** Export each markdown to PDF via your editor (or use a tool like `pandoc`). Concatenate.
- **Notion / Confluence doc.** Paste each into a new doc with section headings.

### 6b. Submit to the review board

Post in `#capstone-review-board` (or whichever channel your partner program uses) with:

```
Capstone Prep Submission — <your name>

Variant: <Atlas Operations | Aurora Concierge>
Target customers: <name 1>, <name 2>, <name 3>

Attached:
- variant-choice.md
- master-prompts.md (8 prompts, ~3,500 words total)
- demo-script.md (7 sections, 25-minute arc)

Requesting review-board sign-off to start Build 13.
```

### 6c. Expect feedback within 5 business days

Common revision asks:

| Feedback | What to do |
|---|---|
| "Variant doesn't match your partner book" | Pick the other one; rewrite `variant-choice.md` |
| "Prompts are too vague" | Re-write the weakest 2-3 prompts with more specific bullets |
| "Demo doesn't book a follow-up meeting" | Add an explicit invitation in the closing 2 minutes |
| "Timeline is unrealistic" | Adjust to 10-12 weeks or commit a 2-FTE plan |

Iterate until pass. **Don't start Build 13 without the sign-off** — you'll waste weeks.

---

## Verification checklist

- [ ] `variant-choice.md` written — variant chosen, named customers, objections specified.
- [ ] All 11 prior Builds' deliverables inventoried; broken/missing ones flagged + fixed.
- [ ] `master-prompts.md` with 8 prompts of 200-500 words each.
- [ ] Each prompt follows the prompt anatomy (Goal, Builds on, Specific bullets, Conventions, Verification).
- [ ] `demo-script.md` with 7 sections sketched (what to click + 30-sec talk-track + objection killed).
- [ ] All three bundled into a single submission.
- [ ] Submitted to `#capstone-review-board`.
- [ ] **Review-board pass signed off.**

Then take the [Build 12 quiz](3-quiz.md). Pass → start [Build 13 — the Capstone](../build-13-capstone/).

---

## Getting unstuck

**Can't decide between Atlas and Aurora.**
- Look at your partner org's top 5 deals **by buyer persona, not by industry**. If the buyers are CIOs/Heads of Ops → Atlas. If the buyers are CMOs/Heads of CX/Digital → Aurora. If your book is mixed, pick the one with the **larger ACV** in the top 5 deals.

**Master prompts feel generic.**
- You're not writing with enough specificity. Re-read your Build 3 brief from the walkthrough — that's the level of detail. File paths, env var names, specific verification steps. Generic = "build the chat component"; specific = "create src/components/MultiSurfaceChat.tsx with a persona toggle (Prospect/Member radio buttons) that switches PROMPTS config..."

**Demo script feels like a feature list, not a story.**
- A demo isn't a feature tour. It's a story. **Each section should kill an objection.** If a section doesn't kill an objection, cut it. Start every section with "the customer is sceptical about X. Watch."

**Review board asked for revision.**
- Don't argue. Revise. The reviewer has seen 50+ capstone preps; they know what works. If you disagree, ask for a 10-min sync to discuss — but apply the feedback first.

**Anything else.**
- Ping your assigned reviewer directly. They want you to pass — this is their KPI too.

---

## Next

[Build 13 — The Capstone](../build-13-capstone/). Pick your variant folder ([atlas-operations](../build-13-capstone/atlas-operations/) or [aurora-concierge](../build-13-capstone/aurora-concierge/)) and start building. This is what the whole course was for.
