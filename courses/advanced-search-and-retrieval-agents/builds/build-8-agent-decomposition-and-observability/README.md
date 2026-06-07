# Build 8 — Agent Decomposition, Tool Use & Cost Observability

> Part of [Advanced Search & Retrieval Agents](../../README.md).
>
> **Why this matters:** Build 7's agent is the simplest possible loop. Real customer scenarios need **decomposition** (multi-step plans), **tool use** (the agent calls external APIs), and **explicit cost budgeting** (the agent stops before the customer's tenant bill blows up). This Build is where the partner stops being an agent *user* and becomes an agent *designer*.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Prerequisite** | Build 7 of this course |
| **Estimated effort** | 18–24 hours focused |

## What the partner does

Extends the Build 7 agent with:

1. **A planner step** — the agent picks its own sub-queries based on the question shape, instead of running a fixed template. The planner is an LLM call with a structured output schema (`{sub_queries: [...], merge_strategy: '...', estimated_steps: N}`).
2. **At least one custom tool** — the agent calls an external function. Examples: a date-range computation, an inventory lookup, a currency conversion, a regulatory-jurisdiction resolver. The tool gets wired into the agent's tool catalogue with a typed schema.
3. **A cost budget** — a per-conversation token budget (or per-conversation dollar budget) terminates the agent loop when exceeded, with a graceful degradation back to single-shot `/ask`. The fallback behaviour is documented.
4. **A latency budget per step** — if any step exceeds its budget, the agent terminates with a partial-result response rather than hanging.
5. **A tracing dashboard** (or static report) showing the agent's actual cost and latency per scenario over a representative sample of queries (≥ 50).

The partner walks away knowing how to *price* an agent-based deployment to a customer, not just how to build one. That is the commercial differentiator.

## Pass rubric

1. Planner step implemented — the agent picks its sub-queries.
2. At least one custom tool wired and called by the agent in a recorded session.
3. Cost budget terminates the loop cleanly with documented fallback behaviour. The partner can demo a query that exceeds the budget and falls back gracefully.
4. Latency budget per step enforced.
5. Tracing dashboard showing actual numbers per scenario across ≥ 50 queries.
6. Live explanation of when an agent is worth the cost vs when a single-shot call is the right answer. The explanation is grounded in the partner's own measured numbers, not in vendor marketing.

## Asset delivered

- `planner/` — the planner-step LLM call + schema.
- `custom-tool/` — at least one wired tool with its typed schema.
- `cost-budget/` — the budget enforcement + graceful fallback.
- `latency-budget/` — the per-step enforcement.
- `tracing-dashboard/` — the actuals dashboard.
- `pricing-conversation-script.md` — how to talk about agent cost with a customer's procurement team.

## Workspace

- `walkthrough.md`
- `planner/`
- `custom-tool/`
- `cost-budget/`
- `latency-budget/`
- `tracing-dashboard/`
- `pricing-conversation-script.md`
- `verification.md`

## Reference reading

- ARAG documentation: tool catalogue schema, agent observability, cost reporting.
- Research: agent planning (arxiv search terms: "LLM planner," "task decomposition," "tool augmented language models"); the *Toolformer* and *ReAct* papers are the canonical starting points.

## See also

- Previous build: [Build 7 — Retrieval Agents 101](../build-7-retrieval-agents-101/)
- Capstones: [Capstones overview](../../capstones/)
- Capstone D — Research Portal: leverages **everything in this Build** at full depth (planner + tools + cost + observability). The most natural next step after passing Build 8.
