# Build 8 — Lesson: Agent Decomposition, Tool Use & Cost Observability

> Read time: 16 minutes. Companion to the 12-minute [video](video-script.md).

## Why partners learn this

Build 7's agent is the simplest possible loop. Real customer scenarios need decomposition (multi-step plans), tool use (the agent calls external APIs), explicit cost budgeting (the agent stops before the customer's tenant bill blows up), and tracing dashboards (the customer wants the audit trail). This Build is where the partner stops being an agent *user* and becomes an agent *designer*.

It is also where the conversation with the customer's procurement and finance team becomes possible. *"How much will this cost per query?"* and *"What happens when it costs too much?"* are questions Build 7 doesn't answer. This Build does.

## The planner step

Build 7's agent decomposes into sub-questions using a fixed template — *"break the question into 3–8 parts."* That's the entry-level pattern. The Build 8 pattern is a **dedicated planner LLM call** that:

- Takes the user's question + session context.
- Returns a structured plan: `{ sub_queries: [...], merge_strategy: "...", estimated_steps: N }`.
- The planner can annotate dependencies — sub-question 2 needs sub-question 1's output first, sub-question 3 can run in parallel with 4.

Pseudo-code:

```typescript
interface AgentPlan {
  sub_queries: SubQuery[];
  merge_strategy: 'union' | 'intersect' | 'sequential_synthesis';
  estimated_steps: number;
  estimated_cost_usd: number;
  estimated_latency_ms: number;
}

interface SubQuery {
  id: string;
  question: string;
  depends_on: string[];     // ids of prerequisite sub-queries
  recommended_profile: 'explore_broad' | 'verify_deep';
}

async function plan(question: string, context: SessionContext): Promise<AgentPlan> {
  // LLM call with the planner prompt + question + context
  return await callPlannerLLM(question, context);
}
```

A dedicated planner is what makes an agent feel like a *system* rather than a black-box. The plan is inspectable, editable, and explicable.

## Custom tools — what they are and when to wire them

A tool is a typed function the agent can call. The agent decides when to call it; the runner executes the call and returns the result to the agent's next step.

Customer-shaped examples:

- **Date-range computation.** *"What does 'last quarter' mean given today's date?"* — a tool that takes a relative-date phrase and returns a concrete ISO range.
- **Inventory lookup.** *"Is the Aurora TerraTrek 7 currently in stock in the EU warehouse?"* — a tool that calls the customer's inventory API.
- **Currency conversion.** *"What's $499 in EUR at last week's average?"* — a tool that hits an FX API.
- **Regulatory-jurisdiction resolver.** *"Which jurisdictions does the customer operate in?"* — a tool that reads the customer's organisational config.
- **Document classification.** *"Is this document classified as sensitive in the customer's policy?"* — a tool that calls a classifier service.

The tool catalogue is a typed schema:

```json
{
  "name": "compute_date_range",
  "description": "Resolve a relative date phrase like 'last quarter' to a concrete ISO range.",
  "parameters": {
    "type": "object",
    "properties": {
      "phrase": { "type": "string" },
      "reference_date": { "type": "string", "format": "date" }
    },
    "required": ["phrase", "reference_date"]
  },
  "returns": {
    "type": "object",
    "properties": {
      "start_date": { "type": "string", "format": "date" },
      "end_date": { "type": "string", "format": "date" }
    }
  }
}
```

The agent's brief tells it when to reach for the tool: *"For any relative-date phrase, call compute_date_range to resolve it before continuing."*

## Cost budgets and graceful degradation

Customer procurement asks: *"What's the most this can cost per query?"* The honest answer requires a cost budget enforced at the agent layer.

```typescript
interface Budget {
  max_tokens: number;
  max_dollar_cost: number;
  max_steps: number;
}

interface AgentResult {
  output: object;
  cost_usd: number;
  budget_exhausted: boolean;
  fallback_strategy: 'partial' | 'ask_only' | 'error';
}
```

The runner monitors cumulative cost during the agent's execution. When the budget is exhausted, the runner:

1. **Terminates the loop cleanly** — no more sub-queries.
2. **Synthesises a partial result** from whatever evidence is available.
3. **Sets `budget_exhausted: true`** in the response.
4. **Falls back to a documented strategy** — partial result by default; `ask_only` (single `/ask` call) for use cases where partial is worse than simple; `error` for use cases where the customer prefers no answer over a partial one.

Customer procurement can now ask *"what's the worst case"* and the partner has a concrete answer.

## Latency budgets per step

A cost budget is amortised across the whole agent call. A latency budget is per-step. *"No single step takes more than 8 seconds; if a step exceeds, terminate."*

Why per-step matters: a runaway tool call (the inventory API hangs) can stall the whole agent without ever exceeding the *total* budget — the agent is just stuck. Per-step latency budgets catch this class of failure.

## The tracing dashboard

The deliverable that closes the loop with the customer. A dashboard that shows:

- **Per-query cost** distribution over the last 100 queries.
- **Per-step latency** distribution.
- **Step type breakdown** (planner / retrieve / tool call / synthesise).
- **Budget-exhausted rate** (what fraction of queries hit the budget).
- **Tool-call success rate.**

The dashboard is the customer's audit surface. *"What did the agent do this week?"* — the dashboard answers. *"What's the average cost?"* — the dashboard answers. *"Where are queries failing?"* — the dashboard answers.

A partner who ships an agent without a tracing dashboard is shipping a black box. A partner who ships the dashboard is shipping a product the customer's team can operate.

## The pricing conversation

This Build is where the partner stops being able to handwave about cost. The partner needs to be able to say:

- *"Median query cost is $0.08."*
- *"P95 query cost is $0.22."*
- *"Budget-exhausted rate is 2.4% — those queries fall back to a single `/ask` call at $0.005."*
- *"You can change the budget cap; here's the trade-off curve between cap and budget-exhausted rate."*

When the partner can answer those four questions, the customer's procurement and finance teams have a budget conversation they can take to their CFO. That's the commercial unlock from this Build.

## What you'll do in the walkthrough

1. Implement a dedicated planner step with structured plan output.
2. Wire one custom tool with typed schema.
3. Implement cost budget enforcement with graceful degradation.
4. Implement per-step latency budget enforcement.
5. Build a tracing dashboard showing actual numbers over ≥ 50 queries.
6. Author the pricing-conversation script for customer-facing conversations.

## Reference reading

- ARAG documentation: tool catalogue schema, agent observability, cost reporting endpoints.
- Research foundations: *Toolformer* (Schick et al.), *ReAct* (Yao et al.), *Reflexion* (Shinn et al.) — the canonical academic starting points.
- Build 7's brief / schema / failure modes — this Build extends each.
