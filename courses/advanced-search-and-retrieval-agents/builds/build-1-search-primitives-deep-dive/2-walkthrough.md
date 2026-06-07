# Build 1 — Walkthrough: Search Primitives Deep Dive

> Estimated time: 8–12 hours focused. Read the [lesson](1-lesson.md) first.
>
> **This is the foundation Build of the course.** Every later Build's primitive choice depends on the matrix and flowchart you produce here.

## What you'll build

- A **primitive-comparison harness** that issues the same query through all five ARAG search primitives against the same Knowledge Box.
- A **measured trade-off matrix** with five dimensions per primitive (cost, latency p50/p95, citation density, structured-output, conversational state).
- A **primitive-selection flowchart** derived from the measured matrix.
- A **defence rehearsal** — you'll pitch the flowchart against three customer scenarios distinct from the harness's test set.

## What you'll need open

- An ARAG Knowledge Box with at least 50 ingested resources (your customer's KB, your sandbox, or a Foundations Build 13 capstone KB).
- `.env` with `NUCLIA_API_URL`, `NUCLIA_KB_ID`, `NUCLIA_API_KEY`.
- Your editor and AI assistant.
- A modern browser for the dashboard.
- A test-query design doc (you'll fill it in Step 1).

---

## Step 1 — Design the test query set (45 min)

The harness is only as good as the queries it runs. Bad query design produces a meaningless matrix; good query design exposes the primitive trade-offs cleanly.

### 1a. Pick 12 queries that exercise distinct primitive strengths

The test set should be a balanced mix:

| # | Archetype | Example | Tests which primitive strengths |
|---|---|---|---|
| 1–3 | Factoid (single fact) | *"What's the warranty length on Product X?"* | `/find`, `/ask` sync — both should ace this |
| 4–6 | Conceptual (paraphrasable) | *"What is your stance on environmental sustainability?"* | `/ask`, `/predict/chat` — exercises semantic retrieval |
| 7–9 | Catalog browse | *"PDFs about onboarding"* | `/find`, `/search` — exercises the catalog payload shape |
| 10 | Multi-part hard | *"Which products are recommended for thru-hiking AND have a recycled-content rating above 30%?"* | Retrieval Agent — should outperform single-shot |
| 11 | Conversational follow-up | Turn 1 + a pronoun follow-up | `/predict/chat`, agent in conv mode |
| 12 | Structured output | *"Generate a 3-bullet FAQ about Product X"* | `/ask` with JSON schema, agent |

Pick queries against the actual KB. If a query doesn't have a satisfying answer in the KB, replace it — the matrix will lie if the queries are unanswerable.

### 1b. Commit `test-queries.md` to the workspace

Format:

```markdown
# Test query set — Build 1 comparison harness

## Q1 — Factoid
Query: "What's the warranty length on the Aurora TerraTrek 7?"
Expected to ace: /find, /ask sync
Notes: ...

## Q2 — Factoid
...
```

Keep it brief; this doc is for the partner's own reference.

---

## Step 2 — Vibe-code the harness (3–4 hours)

> **Honest framing.** A reference harness has not yet shipped in `assets/`. Until it does, every partner who works this Build produces a slightly different harness, which means the trade-off matrix's credibility rides on the partner's harness implementation. The walkthrough that follows is a brief for the partner's AI assistant to produce a *first cut*; Step 2d below is **the correctness gate** that catches the bug classes that silently produce wrong numbers. Do not skip Step 2d.

The harness is a script (TypeScript or Python) that:

1. Reads each query from `test-queries.md`.
2. Issues the query through each of the five primitives.
3. Captures: response payload, wall-clock latency, returned token count (for cost estimation).
4. Writes results to a CSV / JSON per query × primitive.

### 2a. Brief your AI

Paste the harness brief — adapt this template:

```
Create primitive-comparison-harness in TypeScript (or Python — pick one).

Read NUCLIA_API_URL, NUCLIA_KB_ID, NUCLIA_API_KEY from .env.

For each query in test-queries.md, fire requests against all five primitives:

1. POST /kb/{id}/find  — { query, page_size: 10, features: ['keyword','semantic'] }
2. POST /kb/{id}/ask   — { query, top_k: 20, prefer_markdown: true, rephrase: false }  with x-synchronous: true. (Default `rephrase` on `/ask` is `false` — see the parameter reference.)
3. POST /kb/{id}/ask   — same body, no x-synchronous (streaming); aggregate the stream into a final response
4. POST /kb/{id}/search — same shape as /find but request show:['basic','values','origin','relations']
5. POST /kb/{id}/predict/chat — single-turn version; capture the response
6. POST /kb/{id}/retrieval-agent — minimal agent brief: "Answer the user's question grounded in the KB."

Note: `/ask` uses `top_k` (max 200), not `page_size`. `/find` and `/search` use page-based pagination. Cross-reference the parameter doc for the exact body shape per primitive.

For each call, capture:
- response payload (just the answer/results, not the full body)
- wall-clock latency in milliseconds
- estimated token count (use a tokeniser library or rough heuristic)

Write the results to results/{query-id}-{primitive}.json.

Aggregate a summary CSV: query-id, primitive, latency_ms, est_tokens,
result_summary (first 200 chars), citation_count (count of unique
resource ids in the response).

Headers in every call: X-NUCLIA-SERVICEACCOUNT: Bearer ${NUCLIA_API_KEY}
+ Content-Type: application/json.

Plain fetch. No SDK.
```

### 2b. Save the AI's output

Save it under `harness/` in this Build's workspace folder.

### 2c. Sanity-test against one query

Pick query 1 (the factoid). Run the harness against just it. Open the results/ folder. Confirm you have one JSON file per primitive plus a row in the summary CSV.

**You should see:** five JSON files, latencies in a plausible range (`/find` fastest, agent slowest), and a citation count in each.

If `/predict/chat` or the agent call fails — check that your KB has them enabled (some tenants gate the agent endpoint).

### 2d. **Correctness gate — bugs that make your numbers lie**

Run through this checklist *before* running the full 12-query harness. Every bug in the list silently produces wrong numbers; if any of them are present, the trade-off matrix from Step 3 will mislead every customer scoping conversation you take it into.

1. **Streaming `/ask` latency measured wrong.** The harness must capture *last-byte* time, not first-byte. Bug: starting the timer on the connection and stopping it on the first chunk of streamed answer text. Fix: stop the timer when the stream signals `done` (NDJSON `{"type": "done"}` or SSE `event: done`).
2. **Agent token counting misses the planner.** The agent endpoint makes multiple LLM calls — planner + per-sub-query synthesis + final merge. A naive counter only counts the final merge's tokens and reports the agent as ~5× cheaper than it is. Fix: sum tokens across *every* trace step, not just the synthesis output. Use `x-show-consumption: true` and read the `consumption.input_tokens` + `consumption.output_tokens` from the response, which the platform tallies correctly across all steps.
3. **Sync `/ask` measured without the `x-synchronous: true` header.** Without the header, `/ask` streams by default. A "sync" measurement that actually streamed will look faster than it should. Fix: confirm the header is present on the sync configuration.
4. **`top_k` confused with pagination.** `/ask` does not have `page_size`. The single retrieval-cardinality lever on `/ask` is `top_k` (max 200, default 20). Fix: confirm the harness sends `top_k`, not `page_size`, to `/ask`.
5. **Token-count overestimated by including the system prompt.** Some tokenisers count the system prompt + all messages, not just the answer-generation cost the partner is trying to measure. Fix: use the platform's `consumption` block in the response — it splits input vs output tokens and is the canonical count.
6. **`/predict/chat` measured without conversation state.** The platform manages conversation state when a session ID is provided. Measuring `/predict/chat` *without* a session means the rephraser runs on every turn as if it were the first — that's not the real production cost. Fix: include a session ID in `/predict/chat` calls for the multi-turn test queries.
7. **Cost computed without per-model rate sheet.** `(input_tokens + output_tokens) * $0.001` is wrong — output tokens are typically 3–4× the price of input tokens on most models. Fix: use the per-model rate sheet from your tenant's BYO-LLM configuration (Foundations Build 11 covers this).
8. **Cold-start latency conflated with steady-state.** First call to a primitive in a cold tenant takes longer than warm calls. Fix: discard the first call to each primitive (warm-up), then measure the next 12.

If any of those bugs are present, the matrix lies. Re-run after fixing.

---

## Step 3 — Run the full harness + tabulate the matrix (2–3 hours)

Run the harness against all 12 test queries. The runtime is dominated by agent calls (5–30 s each); budget 30–40 minutes for the full run.

### 3a. Aggregate the matrix

For each primitive, compute across the 12 queries:

- **Cost per call (median)** — use a $/1M-token rate sheet (Anthropic / OpenAI / your tenant's BYO-LLM provider's rate sheet — Build 11 of Foundations covers this).
- **Latency p50 and p95.**
- **Citation density (median)** — unique cited resource IDs per response, normalised by response length.
- **Structured-output support** — boolean: did the primitive return parseable JSON in queries 12?
- **Conversational state** — boolean: does the primitive carry conversation state for query 11's follow-up turn?

Commit `trade-off-matrix.md` to the workspace as a markdown table.

### 3b. Spot-check the numbers

If the matrix shows surprising results — `/find` slower than `/ask`, agent cheaper than `/ask`, etc. — your harness has a bug. Common ones:

- Streaming `/ask` measured wrong (counted from first byte instead of last).
- Token count overestimated (the tokeniser includes prompt tokens, not just completion).
- Agent's tool-call tokens not counted.

Fix the harness, re-run, re-tabulate.

---

## Step 4 — Build the selection flowchart (1–2 hours)

The matrix tells you what each primitive is good at. The flowchart tells the customer which to pick.

### 4a. Start from the lesson's minimum-shape flowchart

The lesson laid out the 8-branch core. Copy it into `flowchart.md` in the workspace.

### 4b. Add branches grounded in your measured numbers

For each customer scenario you've worked recently, ask:

- *Did the lesson's flowchart land on the right primitive?*
- *If not, what dimension of the matrix justifies a different choice?*

Add a branch that captures that decision. The flowchart should grow to ~12 branches before the next Step.

### 4c. Commit the flowchart in two formats

- `flowchart.md` — markdown with the branch logic.
- (Optional) `flowchart.png` — rendered via [Mermaid](https://mermaid.js.org) or your tool of choice. Helpful for customer slide decks.

---

## Step 5 — Defence rehearsal (1 hour)

Now defend the flowchart against three customer scenarios *distinct from your test queries*. Pick three from current pipeline. For each, do the partner's internal rehearsal:

- *What primitive does the flowchart recommend?*
- *Why? What dimension of the matrix drove it?*
- *What would change the recommendation?*

Record the rehearsal in `defence-rehearsal.md`. The Solution lead reviewing your pass will pick three scenarios from the rehearsal doc and ask you to defend live.

---

## Step 6 — Publish to the course-level assets folder (15 min)

Copy `flowchart.md` and `trade-off-matrix.md` to:

```
courses/advanced-search-and-retrieval-agents/assets/
├── primitive-selection-flowchart.md
└── primitive-tradeoff-matrix.md
```

Every later Build's lesson references these. Keeping them in `assets/` (not just in this Build's workspace) avoids the *"which version is the canonical one?"* problem.

---

## Pass-rubric self-check

Before submitting to the Solution lead for review:

- [ ] Harness committed and runnable on demand.
- [ ] 12 test queries committed in `test-queries.md`.
- [ ] Trade-off matrix with **measured** numbers (cost, latency p50/p95, citation density, structured-output, conversational state) in `trade-off-matrix.md`.
- [ ] Selection flowchart with at least 8 branches in `flowchart.md`.
- [ ] Defence rehearsal against 3 customer scenarios in `defence-rehearsal.md`.
- [ ] Flowchart + matrix published to `../../assets/`.

If all green: book the 60-minute live review with a Progress Solution lead.

## Getting unstuck

**`/retrieval-agent` returns 404.** The endpoint may not be enabled on your tenant. Ping `#partner-onboarding`.

**Streaming `/ask` produces a wildly different latency from sync.** Check that the harness measures *last-byte* time, not first-byte.

**Agent latency dominates the runtime.** Run agent calls in parallel using `Promise.all` or asyncio.gather; the API tolerates concurrency up to your tenant's rate limit.

**Cost numbers feel wrong.** The biggest miss is usually the agent's internal LLM calls (the planner + the synthesiser are both LLM calls; partner harnesses sometimes count only the synthesiser).

---

## Next

[Build 2 — Query Understanding & Rephrasing](../build-2-query-understanding-and-rephrasing/) — the first lever you'll measure against this Build's matrix.
