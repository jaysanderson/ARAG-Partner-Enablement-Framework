# Build 7 — Lesson: Retrieval Agents 101

> Read time: 16 minutes. Companion to the 12-minute [video](video-script.md).

## Why partners learn this

The Retrieval Agent endpoint is the highest-leverage primitive ARAG ships. Every Build prior to this one teaches a configuration; this Build teaches a *category*. Partners who don't internalise the agent loop default to over-engineered orchestration on top of `/ask` and lose to a competitor's two-line agent call.

The biggest mindset shift: agents are not *"a heavier `/ask`."* They are a different kind of program. Same question goes in. A loop runs. A structured answer comes out. The partner's responsibility is to design the loop's brief, schema, observability, and failure recovery — not to write the loop's code.

## What a Retrieval Agent actually does

The platform's agent endpoint accepts:

- A **natural-language brief** — the agent's system prompt, defining its role and the rules of engagement.
- A **structured output schema** — JSON-schema describing what the agent must produce.
- An **input** — the user's question, plus optional session context.
- (Optional) a **tool catalogue** — Build 8 covers this.

It returns:

- A **structured output object** matching the schema.
- An **execution trace** — every sub-query, every retrieved source, every tool call.

Internally the agent runs a loop:

1. **Plan** — read the question, generate a list of sub-queries needed to answer it.
2. **Execute** — run each sub-query against the KB.
3. **Merge** — combine the per-sub-query evidence into one working set.
4. **Synthesise** — produce the structured output the schema demands.

Each step is an LLM call. The whole loop is 5–30 s and 5–50× the cost of `/ask`. When the question deserves it, it's the best primitive ARAG ships. When the question doesn't, it's wildly over-spec.

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
