# Build 7 — Lesson: Retrieval Agents 101

> Read time: 16 minutes. Companion to the 12-minute [video](video-script.md).

## Why partners learn this

The Retrieval Agent endpoint is the highest-leverage primitive ARAG ships. Every Build prior to this one teaches a configuration; this Build teaches a *category*. Partners who don't internalise the agent loop default to over-engineered orchestration on top of `/ask` and lose to a competitor's two-line agent call.

The biggest mindset shift: agents are not *"a heavier `/ask`."* They are a different kind of program. Same question goes in. A loop runs. A structured answer comes out. The partner's responsibility is to design the loop's brief, schema, observability, and failure recovery — not to write the loop's code.

## Two ways to build a Retrieval Agent on ARAG

> **Honest framing.** ARAG's *native* agent endpoint and its exact contract (which fields are settled, which are evolving) varies by tenant tier and platform version. Some tenants expose a `/retrieval-agent` endpoint that accepts a `brief` + structured `schema` + a `tools` catalogue and runs a planner-execute-merge loop server-side; other tenants do not yet expose that surface or expose only a subset of those fields. **Check your tenant's current API docs against the actual contract before relying on any specific field name.**
>
> The good news: a Retrieval Agent loop can be built **entirely from documented `/ask` primitives** without depending on a native agent endpoint. That's the pattern this Build teaches as the *default* — every partner can ship it today, regardless of tenant tier. The native endpoint, when it's available, is a convenience shortcut on top.

### The Retrieval Agent loop, conceptually

Every Retrieval Agent — whether you build it on `/ask` or on a native endpoint — runs the same four-step loop:

1. **Plan** — read the question, generate a list of sub-queries needed to answer it.
2. **Execute** — run each sub-query against the KB.
3. **Merge** — combine the per-sub-query evidence into one working set.
4. **Synthesise** — produce the structured output the schema demands.

Each step is an LLM call. The whole loop is roughly 5–30 s wall-clock and meaningfully more expensive than `/ask` (illustrative-of-shape numbers in lessons say *"5–50× the cost"* — verify against your own tenant). When the question deserves it, it's the best pattern ARAG supports. When the question doesn't, it's wildly over-spec.

### Pattern A — Partner-orchestrated agent on `/ask` (recommended default)

The partner writes the loop in client code (TypeScript or Python) and calls `/ask` per sub-question:

```
                  ┌─────────────────────────┐
   question  ───▶ │  planner LLM call       │ ───▶ sub-queries
                  └─────────────────────────┘
                              │
                              ▼ (one /ask call per sub-query)
                  ┌─────────────────────────┐
                  │  /ask per sub-query     │ ───▶ per-sub evidence
                  │  with prequeries strat. │
                  └─────────────────────────┘
                              │
                              ▼
                  ┌─────────────────────────┐
                  │  synthesis LLM call     │ ───▶ structured output
                  │  + answer_json_schema   │     (matches schema)
                  └─────────────────────────┘
```

Every step is a documented primitive:

- The planner is a standalone LLM call (use the partner's preferred LLM SDK; not a `/ask` call).
- Each sub-query is a `/ask` call with `answer_json_schema` constraining the sub-answer's shape and `rag_strategies.prequeries` letting the partner inject additional context queries.
- The synthesis is a final `/ask` call (or LLM-only call) that consumes all the sub-answers and produces the final schema-constrained output.

**This pattern is portable, debuggable, and works on every ARAG tenant today.** Builds 7 and 8's walkthroughs implement it.

### Pattern B — Native `/retrieval-agent` endpoint (when available)

When your tenant exposes the native agent endpoint, the platform runs the planner-execute-merge loop server-side and the partner skips the orchestration code. The native surface *typically* includes:

- A **natural-language brief** (the agent's system prompt) — equivalent to the partner-orchestrated planner's system prompt.
- A **structured output schema** — equivalent to `answer_json_schema` in `/ask`.
- An **input** — the user's question + optional `chat_history`.
- (Optional) a **tool catalogue** — Build 8 covers this when it's exposed.
- (Optional) **observability flags** — to return a trace of the platform's internal steps.

**Check the actual contract before assuming any specific field name or default.** The conceptual surface above is stable; the wire format is what moves.

### When to pick which

| Situation | Pick |
|---|---|
| You're shipping today, want portability across tenant tiers, want to debug per-step | Pattern A (partner-orchestrated) |
| You want absolute minimum code, your tenant exposes the native endpoint, you accept platform-version coupling | Pattern B (native) |
| You need custom tool calls *inside* the agent loop, and tool execution can stay in client code | Pattern A — easier to wire tools in your own runner than to negotiate with a native catalogue |
| The customer's procurement team needs per-call cost breakdowns | Pattern A — observability you fully control |

The walkthrough teaches Pattern A. If your tenant exposes Pattern B, the brief / schema / planner concepts all map across — the difference is which side of the network boundary the loop runs on.

## The agent's natural-language brief

The brief is the system prompt. It's where you put:

- **Role.** *"You are a compliance research agent for a financial-services firm."*
- **Rules of engagement.** *"Always cite the source paragraph. Never speculate beyond the retrieved evidence. If you cannot ground an answer, return `unanswered` rather than guessing."*
- **Domain priors.** *"Compliance questions decompose along these axes: jurisdiction, regulation citation, internal policy, mitigation."*
- **Output discipline.** *"Every claim must reference a `citation_resource_id` from the retrieved results."*

A brief under 100 words is usually too generic. A brief over 500 words is usually too prescriptive. The sweet spot is 200–300 words.

## The structured output schema

The schema is the contract between the agent and the surface that renders the result. It should be:

- **Typed end-to-end.** Every field has a type, every type matches what the renderer expects.
- **Citation-rich.** Citations should be first-class fields, not embedded in prose.
- **Failure-aware.** Include explicit fields for *"the agent could not ground this claim"* and *"the agent ran out of budget."*

A worked schema for a compliance agent:

```json
{
  "type": "object",
  "properties": {
    "verdict": { "type": "string", "enum": ["compliant", "partial", "non_compliant", "unknown"] },
    "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
    "sub_findings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "sub_question": { "type": "string" },
          "answer": { "type": "string" },
          "citation_resource_ids": { "type": "array", "items": { "type": "string" } },
          "grounding_status": { "type": "string", "enum": ["grounded", "weak", "ungrounded"] }
        },
        "required": ["sub_question", "answer", "citation_resource_ids", "grounding_status"]
      }
    },
    "budget_exhausted": { "type": "boolean" }
  },
  "required": ["verdict", "confidence", "sub_findings", "budget_exhausted"]
}
```

Notice three things:

- `verdict` is an enum, not free prose. The renderer can switch on it.
- `grounding_status` is per-sub-finding, so the renderer can flag weak evidence.
- `budget_exhausted` is a top-level field, so the renderer knows to show a partial-result banner.

The schema design is the partner's chief discipline in this Build. A bad schema makes the agent's output unrenderable.

## Three failure modes (and recovery patterns)

Every agent fails. The partner's job is to know how and to recover gracefully.

### 1. Loop — the agent keeps planning sub-queries forever

The planner step generates *more* sub-questions instead of *fewer* on each iteration. The loop runs out of budget.

**Recovery:** explicit step-count cap in the brief — *"Plan at most 6 sub-questions. If more come to mind, prioritise the top 6."* And a hard kill in the execution layer when steps exceed a threshold.

### 2. Hallucination — the agent synthesises beyond the retrieved evidence

The synthesis step produces a confident-sounding claim with no citation backing it.

**Recovery:** the schema demands `citation_resource_ids` per claim. The execution layer validates that every claim has at least one citation; claims without citations are dropped before the response leaves the agent.

### 3. Dead-end sub-query — the agent decomposes but a sub-query returns nothing

The planner produces a sub-question, the retrieval returns zero useful results, the synthesis tries to answer anyway.

**Recovery:** the schema's `grounding_status: "ungrounded"` is the explicit signal. The renderer surfaces ungrounded sub-findings rather than hiding them. The customer sees the gap; that's better than a confidently-wrong answer.

A partner who hasn't documented all three failure modes and shipped the recovery patterns is shipping an agent that will embarrass them in production.

## Observability — what to trace

Every step in the agent loop is instrumented. At minimum:

- **Planner output.** The list of sub-questions the planner produced.
- **Per-sub-question retrieval.** What was queried, what was returned, what was selected.
- **Per-sub-question synthesis.** What was input, what was output.
- **Final-merge step.** How the per-sub-question outputs were combined.

Each step has a stable ID so the renderer can let the user click a claim and see the trace.

Build 8 goes much deeper on observability — cost / latency budgets, tracing dashboards. This Build's discipline is: every step is logged.

## When the agent is the wrong primitive

Repeat from Build 1's lesson: agents are over-spec for single-shot questions. The cost matrix matters.

- `/ask` sync: $0.005, 2 s p50.
- Agent: $0.15, 15 s p50.

If the question's answer fits in one paragraph and the latency budget is sub-3-second, the agent is the wrong choice. Build 1's selection flowchart is the canonical reference; don't reach for the agent because it's the most powerful primitive — reach for it because the question demands decomposition or structured output or explicit explainability.

## What you'll do in the walkthrough

1. Pick a customer-shaped hard scenario (multi-part question that single-shot retrieval cannot answer).
2. Write the agent's natural-language brief.
3. Design the structured output schema.
4. Deploy the agent against your KB.
5. Wire step-level observability.
6. Document the three failure modes you observe + recovery patterns.
7. Side-by-side demo: same question through `/ask` and through the agent.

## Reference reading

- **[`/ask` parameter reference §17 — Schema-constrained output](../../assets/ask-parameter-reference.md#17-schema-constrained-output--answer_json_schema)** — `answer_json_schema` powers the agent's structured output discipline. Note the two behaviour changes: streaming is disabled when this is set, and `citations` becomes inert (model citations into the schema instead).
- **[`/ask` parameter reference §14 — RAG context-building strategies](../../assets/ask-parameter-reference.md#14-rag-context-building-strategies--rag_strategies)** — `rag_strategies` is the high-leverage Build-7 lever. The `prequeries` strategy is the platform-native version of Build 8's planner-emitted sub-queries: define them at retrieval-time so the LLM sees the right context. `hierarchy` and `metadata_extension` complement.
- **[`/ask` parameter reference §20 — Reasoning](../../assets/ask-parameter-reference.md#20-reasoning)** — `reasoning: true` is often the right pick for compliance / multi-step evaluations.
- **[`/ask` parameter reference §25 — Related endpoints](../../assets/ask-parameter-reference.md#25-related-endpoints--what-they-share)** — what the Retrieval Agent endpoint adds on top of `/ask` (the agent `brief`, `tools`, `cost_budget`, `latency_budget`, `include_trace` fields).
- Research foundations: *ReAct: Synergising Reasoning and Acting* (Yao et al.), *Reflexion: Language Agents with Verbal Reinforcement Learning* (Shinn et al.), *Self-RAG* (Asai et al.) — the canonical academic starting points.
- Build 1's selection flowchart — for confirming agent is the right primitive.
- Build 8 (next) — for the depth on planning, tool use, observability.
