# Build 10 — Walkthrough: Composite RAG

> Estimated time: 2.5–3 hours focused. Read the [lesson](lesson.md) first.
>
> **This Build is the on-ramp to agentic patterns.** You'll chain ARAG calls — single-shot `/ask`, then if-confidence-is-low add `/find` context, then re-ask. It's the bridge between Tier 3 (structured outputs) and Tier 4 (knowledge graph + agentic). The customer signal is *"single-shot RAG keeps disappointing — can we do better?"*

## What you'll build

1. **A `compositeAsk` function** that chains calls: initial `/ask` → evaluate confidence → if low, `/find` more context → re-ask with augmented context.
2. **A side-by-side comparison page** showing single-shot vs composite for the same query.
3. **A measurement step** — pick 5 hard queries, prove composite wins on at least 3 of them.

This is **measurable lift**, not vibe. Reviewers want to see the citation-count delta in writing.

## What you'll need open

- **Your Build 0 KB** (10 documents).
- **Your Build 3 React project** (we'll extend it) — composite logic + a new comparison page.
- **Your `.env` with VITE_NUCLIA_* credentials**.
- **Terminal, editor, AI, browser.**

You'll also re-use the `ragClient.ts` from Build 3 (the single-shot streamer). If you don't have it, you'll vibe-code a sync version below.

---

## Step 1 — Identify 5 "hard" queries (20 min)

The point of composite RAG is to **fix queries that single-shot fails on**. So first find some failures.

### 1a. Run 10-15 queries through your existing chat

In your Build 3 chat (single-shot mode), ask 10-15 questions across your corpus. For each, note:

- **Citation count.** How many sources did the answer cite? (Often 0-2 on weak queries.)
- **Refusal.** Did the model say *"I don't have enough information"* when you suspect the corpus does?
- **Vagueness.** Was the answer non-specific where you expected detail?

Use a notepad. Score each query 1-5 on "answer quality."

### 1b. Pick the 5 worst

The 5 queries that scored worst become your **hard queries** — the ones composite needs to beat.

In a new Build 10 folder:

```bash
cd ~/Desktop
mkdir foundations-build-10
cd foundations-build-10
```

Create `hard-queries.md`:

```markdown
# 5 hard queries

1. "<query>" — single-shot returned 0 citations, said "no info"
2. "<query>" — single-shot returned 1 citation, answer was vague
3. "<query>" — single-shot answer was technically right but missed an obvious source
4. "<query>" — single-shot refused; we suspect the corpus has the answer
5. "<query>" — single-shot returned 2 citations; we expected 5+
```

These are your before-data.

---

## Step 2 — Set up the project (10 min)

You can either extend Build 3 (recommended) or scaffold fresh.

### Option A — Extend Build 3 (recommended)

```bash
cd ~/Desktop/foundations-build-3
npm run dev
```

Confirm Build 3 still works. Stop the dev server.

### Option B — Fresh project

```bash
cd ~/Desktop
npm create vite@latest foundations-build-10 -- --template react-ts
cd foundations-build-10
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# (configure Tailwind same as Build 3)
```

Set up `.env` with `VITE_NUCLIA_*`. You'll also need a basic `ragClient.ts` with a sync `ask()` function — easier than re-implementing streaming. The AI will scaffold this if you ask in the next step.

---

## Step 3 — Vibe-code `compositeAsk` (50 min)

This is the main file. Brief your AI:

```
In my Vite + React + TypeScript project, create src/lib/compositeRag.ts.

Export an async function:

  compositeAsk(query: string): Promise<{
    answer: string;
    citations: Array<{ id: string; title: string; confidence: number }>;
    steps: Array<{ step: string; durationMs: number; outcome: string }>;
  }>

The function chains ARAG calls. Logic:

Step 1 — INITIAL /ask:
  POST to ${VITE_NUCLIA_API_URL}/kb/${VITE_NUCLIA_KB_ID}/ask
  Header: X-NUCLIA-SERVICEACCOUNT: Bearer ${VITE_NUCLIA_API_KEY}
  Header: x-synchronous: true
  Body: { query, prefer_markdown: true, rephrase: true, max_tokens: 400 }

  Extract:
  - answer (data.answer)
  - citations (from data.retrieval_results.resources, map id+title;
    confidence = top paragraph score for that resource)

  Record step: { step: "initial-ask", durationMs, outcome: "N citations, top score X" }

Step 2 — EVALUATE confidence:
  const confident = citations.length >= 3 && topConfidence >= 0.7

  If confident, RETURN the initial result immediately
  (with steps array containing just step 1).
  Record step: { step: "evaluate", outcome: "confident, returning initial" }.

Step 3 — Otherwise, AUGMENT via /find:
  POST to /kb/{kbId}/find with body:
    { query, page_size: 5, features: ["keyword","semantic"], show: ["basic","values","origin"] }

  Format the top 5 results into a context block string:
    "Source 1: <title>\n<first 200 chars of top paragraph>\n\n
     Source 2: <title>\n<first 200 chars of top paragraph>\n
     ..."

  Record step: { step: "find", durationMs, outcome: "N additional resources" }.

Step 4 — RE-ASK with augmented context:
  POST to /ask with body:
  {
    query,
    prefer_markdown: true,
    rephrase: true,
    max_tokens: 600,
    prompt: {
      system: "You are a knowledgeable assistant. Use the additional context provided to give a more complete answer than the initial retrieval allowed.",
      user: "Initial context (from default retrieval): {context}\n\nAdditional context (from broader search):\n<context block from step 3>\n\nQuestion: {question}\n\nProvide a complete, well-cited answer."
    }
  }
  Header x-synchronous: true.

  Extract the new answer + citations.

Step 5 — MERGE citations:
  Combine citations from initial-ask AND re-ask. Dedupe by id.
  Keep the higher confidence value per id.

  Record step: { step: "re-ask", durationMs, outcome: "merged to M total citations" }.

Step 6 — RETURN:
  { answer: re-ask answer, citations: merged, steps: [step1, step2, step3, step4, step5] }

TIMEOUTS:
  Wrap the entire pipeline in a 15-second timeout (use Promise.race
  with a setTimeout-based reject). If timeout hits, return whatever
  was successfully completed so far + a step recording "timeout".

CAP RETRIES at 1 — only one augment-and-reask, no recursive composite.

Use plain fetch. TypeScript. Add JSDoc comments explaining the
confidence threshold tuning lever at the top of the file.
```

Send.

### 3a. Save the output

- **Claude Code / Cursor:** *"Save this as src/lib/compositeRag.ts."*
- **Web chat:** create the file in VS Code, paste, save.

### 3b. Read the code

Four checks:

1. The function has all 6 steps (initial-ask, evaluate, find, re-ask, merge, return).
2. Citations are **deduped by id** during merge.
3. The 15-second timeout is wrapped around the whole pipeline.
4. Auth header is `X-NUCLIA-SERVICEACCOUNT`.

### 3c. Smoke test from Node

Create `test-composite.mjs` in the project root:

```js
// Note: this is Node-side, so we substitute import.meta.env
// with process.env via a tiny shim. For a true UI test, skip
// this and use the comparison page from Step 4.

import 'dotenv/config';
process.env.VITE_NUCLIA_API_URL = process.env.NUCLIA_API_URL;
process.env.VITE_NUCLIA_KB_ID = process.env.NUCLIA_KB_ID;
process.env.VITE_NUCLIA_API_KEY = process.env.NUCLIA_API_KEY;

// You can't directly import .ts files in plain Node — either:
// 1. Run the comparison page from Step 4 instead (cleaner)
// 2. Use tsx: npx tsx test-composite.mjs (after npm install -D tsx)

console.log("Use the comparison page (Step 4) to test compositeAsk.");
```

Skip the smoke test for now — the comparison page in Step 4 is the proper test surface.

### 3d. Save prompt log

Create `prompt-log.md` in the project root. Paste the Step 3 brief.

---

## Step 4 — Build the side-by-side comparison page (45 min)

This is where you'll **see the lift**.

### 4a. Brief your AI

Paste:

```
Create src/pages/CompositeComparison.tsx in my Vite + React + TS project.

Layout (Tailwind):

  [ Query input + Submit button ]   <- top, full width

  ┌─────────────────────────┬─────────────────────────┐
  │  SINGLE-SHOT            │  COMPOSITE              │
  │                         │                         │
  │  Answer:                │  Answer:                │
  │  <text>                 │  <text>                 │
  │                         │                         │
  │  Citations: N           │  Citations: M           │
  │  - <title>              │  - <title>              │
  │  - <title>              │  - <title>              │
  │  ...                    │  ...                    │
  │                         │                         │
  │  Time: 1.4s             │  Steps:                 │
  │                         │  - initial-ask (650ms): N citations
  │                         │  - find (200ms): X resources
  │                         │  - re-ask (1850ms): merged
  │                         │  Time: 2.7s             │
  └─────────────────────────┴─────────────────────────┘

  Citation count bar chart (simple HTML bars; no chart lib needed):
  Single-shot: ████ 2
  Composite:   ███████ 5

Behaviour:
1. On submit, run TWO calls in parallel:
   - singleShotAsk(query) — a basic sync /ask call (define this inline
     or import from existing ragClient).
   - compositeAsk(query) — from src/lib/compositeRag.ts.
2. Show loading state on each panel until its call resolves.
3. Show results side-by-side.
4. Show citation-count bar chart below.

Wire into App.tsx — render <CompositeComparison /> as the main page
(or add a route at /composite-compare).

Tailwind for styling. TypeScript. Show error states if either call fails.
```

Send. Apply.

### 4b. Save and test

```bash
npm run dev
```

Open the URL. **You should see:**

- Query input + submit at top.
- Two empty panels labelled "Single-shot" and "Composite."
- An empty bar chart area.

Submit one of your hard queries. **You should see:**

- Both panels show "Loading..." briefly.
- Single-shot panel populates ~1-2 seconds in.
- Composite panel populates 3-5 seconds in (it's doing more work).
- The bar chart shows the citation count delta.

If composite is **slower** than single-shot, that's expected (it's making 2-3 API calls vs 1). The trade is **better answer for more latency**.

### 4c. Append to prompt log

---

## Step 5 — Test all 5 hard queries (20 min)

Run each of your 5 hard queries through the comparison page. For each, record:

| Query | Single-shot citations | Composite citations | Single-shot quality (1-5) | Composite quality (1-5) | Latency delta |

Save the table in `comparison-results.md`.

**You want composite to win on at least 3 of 5.** If it doesn't:

- Your **confidence threshold** is wrong. Open `src/lib/compositeRag.ts`. Find the line `confident = citations.length >= 3 && topConfidence >= 0.7`. Try `>= 2` and `>= 0.6` — that makes composite fire more often.
- Or your corpus is too small. Composite shines on richer corpora.

### Tuning iterations

Tune the threshold, re-test, record. Document your final values in `comparison-results.md`:

```markdown
## Final threshold

After tuning: citations.length >= 2 && topConfidence >= 0.65
- Composite fires on 4 of 5 hard queries.
- Wins on 3 of 4 fires (1 ties).
- Win definition: more citations OR more specific answer.
```

---

## Step 6 — Document the tuning (10 min)

Create `tuning.md`:

```markdown
# Composite RAG threshold tuning

## What confidence means
Two factors:
- citations.length — how many sources the initial /ask grounded in
- topConfidence — the highest paragraph score in the retrieval

## When to lower the threshold (more composite firing)
- Customer's corpus is sparse — initial retrieval misses
- Users ask vague questions — initial /ask refuses too often

## When to raise the threshold (less composite firing)
- LLM cost is a concern — composite uses 2-3x more tokens
- Single-shot is mostly winning — composite is wasted

## Our final values
- citations.length: <N>
- topConfidence: <X>
- Reasoning: <brief>
```

This is the **per-customer tuning artefact** a partner does during a POC.

---

## Step 7 — Write a 3-minute demo script (15 min)

Open your AI:

```
Write a 3-minute demo script for showing customers the
Composite Comparison page. Story:

0:00–0:30 — Hook:
  "Most RAG vendors stop at single-shot. The customer asks
   a hard question, gets a thin answer, blames AI. Watch what
   happens when we chain calls."

0:30–1:30 — Run hard query 1:
  Single-shot panel populates first — 1 citation, vague answer.
  Composite panel populates 2 seconds later — 5 citations, specific
   answer.
  Narrate: "Composite ran 3 calls. First /ask returned thin. We
   evaluated, found low confidence, broadened the search via /find,
   re-asked with the extra context."

1:30–2:30 — Repeat with queries 2-3:
  Same pattern. Show citation count delta each time.

2:30–3:00 — Close:
  "2x the LLM cost. Justified when single-shot is failing.
   This is the on-ramp to true agentic — Tier 4 conversation
   opens here."

Format: markdown with timing headings + specific narration.
```

Save as `demo-script.md`.

---

## Step 8 — Record a 3-minute walkthrough (15 min)

Record yourself running 3 queries through the comparison page. Narrate the citation count delta and the steps panel. Close with the Tier-4 framing.

Upload to `#build-clinic-submissions`.

---

## Verification checklist

- [ ] `hard-queries.md` with 5 queries + notes on why each was thin.
- [ ] `src/lib/compositeRag.ts` — chains initial-ask → evaluate → find → re-ask → merge, with timeout + steps logging.
- [ ] `src/pages/CompositeComparison.tsx` side-by-side page deployed.
- [ ] Composite wins on at least 3 of 5 hard queries (citation count or quality).
- [ ] Threshold tuned and documented in `tuning.md`.
- [ ] `comparison-results.md` with the 5-query result table.
- [ ] `demo-script.md` saved.
- [ ] `prompt-log.md` saved.
- [ ] 3-minute Loom recording submitted.

Then take the [Build 10 quiz](quiz.md). Pass → start [Build 11](../build-11-production-readiness/).

---

## Getting unstuck

**Composite always returns the same answer as single-shot.**
- Your threshold is too high — composite is never firing. Lower it (e.g., `citations.length >= 1 && topConfidence >= 0.4`) to force it to fire. Confirm the re-ask step actually runs.

**Composite is much slower than expected.**
- Each step is doing a full round-trip. 3-5 seconds total is normal. If it's >10 seconds, the LLM is slow or the context block is huge. Trim the context block to 500 chars per resource.

**Composite gives WORSE answers than single-shot.**
- The re-ask context block is overwhelming the model. Trim it. Or the system prompt isn't clear enough about what to do with the additional context. Tighten the prompt.

**Citations array has duplicates.**
- Dedupe logic in merge step is broken. Tell AI: *"Citations are appearing twice. Dedupe by id in the merge step."*

**The timeout fires every time.**
- 15 seconds is generous; if you're hitting it, your KB or LLM is slow. Bump to 30s for the demo; investigate why at production.

**Anything else.**
- Copy the steps log + the citation counts + the symptom.
- Paste into AI: *"My compositeAsk does X but should do Y. Fix."*

---

## Next

[Build 11 — Production Readiness](../build-11-production-readiness/) — residency, BYO-LLM, rate limits, observability. The CTO-meeting language. This is the Build that gets you in the room with the customer's security and platform teams.
