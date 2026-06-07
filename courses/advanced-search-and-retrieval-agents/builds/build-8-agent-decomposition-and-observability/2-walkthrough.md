# Build 8 — Walkthrough: Agent Decomposition, Tool Use & Cost Observability

> Estimated time: 18–24 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

- A **planner step** as a dedicated LLM call with structured plan output.
- A **custom tool** wired and called by the agent.
- **Cost budget enforcement** with documented fallback.
- **Per-step latency budgets** enforced.
- A **tracing dashboard** showing actuals over ≥ 50 queries.
- A **pricing-conversation script** for customer-facing conversations.

## Step 1 — Implement the planner step (3 hours)

Replace Build 7's fixed-template decomposition with a dedicated planner LLM call:

```typescript
const PLANNER_PROMPT = `
You are the planning step of a Retrieval Agent.

Given the user's question and session context, produce a plan with:
- 3-8 sub-queries (no more than 8).
- A merge strategy: 'union' / 'intersect' / 'sequential_synthesis'.
- Estimated total steps including merge.
- Estimated cost in USD based on $0.01 per sub-query for retrieval +
  $0.05 per LLM step.
- Estimated latency in milliseconds based on 800 ms per retrieval +
  2 s per LLM step.
- Per-sub-query: id, question, depends_on (prerequisite ids),
  recommended search profile ('explore_broad' or 'verify_deep').

Domain priors: {domain_priors}

Return ONLY a JSON object matching the AgentPlan schema.
`;

async function plan(question: string, context: SessionContext): Promise<AgentPlan> {
  const response = await llm.complete({
    prompt: PLANNER_PROMPT
      .replace('{domain_priors}', context.tenant.domainPriors),
    schema: AgentPlanSchema,
    user_message: question,
  });
  return response.parsed;
}
```

Save to `planner/`.

## Step 2 — Wire one custom tool (3 hours)

Pick a tool the agent in your scenario would benefit from. Examples:

- Date-range resolver.
- Inventory lookup.
- Currency conversion.
- Document classification.

Implement:

1. **Tool schema** — typed JSON-schema.
2. **Tool handler** — the function that actually does the work.
3. **Tool registration** — wire it into the agent's tool catalogue.
4. **Brief update** — tell the agent when to use the tool.

```typescript
const tools: ToolCatalogue = {
  compute_date_range: {
    schema: { /* JSON schema */ },
    handler: async (params) => {
      const { phrase, reference_date } = params;
      return resolveRelativeDate(phrase, new Date(reference_date));
    },
  },
};
```

Wire into the runner so the agent can call it during execution.

Save to `custom-tool/`. Verify the agent actually calls the tool — check the trace.

## Step 3 — Implement cost budget enforcement (3 hours)

```typescript
interface Budget {
  max_tokens: number;
  max_dollar_cost: number;
  max_steps: number;
}

async function runAgentWithBudget(question: string, budget: Budget): Promise<AgentResult> {
  let cumulativeCost = 0;
  let stepCount = 0;
  let result: any = null;

  const plan = await this.plan(question, context);
  cumulativeCost += plan.cost_estimate;

  if (cumulativeCost > budget.max_dollar_cost) {
    return await fallback(question, 'partial', cumulativeCost);
  }

  for (const subQuery of plan.sub_queries) {
    if (stepCount >= budget.max_steps) {
      return await fallback(question, 'partial', cumulativeCost);
    }

    const subResult = await executeSubQuery(subQuery);
    cumulativeCost += subResult.cost;
    stepCount++;

    if (cumulativeCost > budget.max_dollar_cost) {
      result = await synthesisePartial(subQueryResults, 'budget_exhausted');
      return { output: result, cost_usd: cumulativeCost, budget_exhausted: true };
    }

    subQueryResults.push(subResult);
  }

  result = await synthesise(subQueryResults);
  return { output: result, cost_usd: cumulativeCost, budget_exhausted: false };
}
```

Three fallback strategies, documented:

- **`partial`** — return whatever sub-queries completed before exhaustion.
- **`ask_only`** — abandon the agent, call `/ask` once with the original question.
- **`error`** — return an error response; let the surface decide how to handle.

Save to `cost-budget/`.

## Step 4 — Implement per-step latency budgets (1 hour)

```typescript
async function withLatencyBudget<T>(
  step: () => Promise<T>,
  budgetMs: number,
): Promise<T> {
  return Promise.race([
    step(),
    new Promise<T>((_, reject) => setTimeout(
      () => reject(new Error('step_latency_budget_exceeded')),
      budgetMs,
    )),
  ]);
}

// usage:
const planResult = await withLatencyBudget(() => plan(question, context), 8000);
```

Per-step budget catches runaway tool calls that wouldn't trigger the cumulative cost budget.

Save to `latency-budget/`.

## Step 5 — Build the tracing dashboard (4 hours)

Aggregate the per-call traces from Build 7 plus the new planner / tool / budget data. Render:

| Section | Content |
|---|---|
| **Cost histogram** | Per-query cost distribution over last 100 calls |
| **Latency p50 / p95** | Per-step and per-call |
| **Step-type breakdown** | Fraction of total spend on planner / retrieve / tool / synthesise |
| **Budget-exhausted rate** | % of queries hitting the budget |
| **Tool-call success rate** | % of tool calls that returned without error |
| **Top scenarios** | Cost + latency by scenario archetype |

Implementation options:

- **Static report.** A markdown file generated nightly from the traces. Sufficient for the cert pass.
- **Interactive dashboard.** A web UI (Grafana, custom React) reading from the trace store. Worth building if the customer needs it.

Save to `tracing-dashboard/`.

## Step 6 — Run ≥ 50 queries (2 hours)

Run a representative sample of queries through the agent. Capture actuals. The dashboard should populate.

The cert-pass bar: 50 queries with measured cost, latency, and step breakdown. The customer can ask any question about agent performance and you have a number.

Save the corpus of test queries + the trace folder to `production-sample/`.

## Step 7 — Author the pricing-conversation script (1 hour)

Customer procurement will ask:

- *"What's the median cost per query?"*
- *"What's the worst-case cost?"*
- *"How often does the budget exhaust?"*
- *"What's the trade-off if we change the budget cap?"*

Write the answers + the dashboard pointers in `pricing-conversation-script.md`. Three to five paragraphs is enough; the dashboard does the heavy lifting.

## Pass-rubric self-check

- [ ] Planner step implemented; agent picks its own sub-queries.
- [ ] Custom tool wired and called.
- [ ] Cost budget enforces; documented fallback proven.
- [ ] Per-step latency budget enforces.
- [ ] Tracing dashboard with ≥ 50 queries' actuals.
- [ ] Pricing-conversation script committed.
- [ ] Asset copied to `../../assets/agent-tracing-template.md`.

## Getting unstuck

**Planner returns inconsistent JSON.** Tighten the planner prompt with explicit *"Return ONLY a JSON object. No prose. No code fences."* + schema validation in the runner; reject and retry once on validation failure.

**Tool calls hang.** Per-step latency budget catches this. Set per-tool timeouts in the handler too as defence-in-depth.

**Cost budget never exhausts.** Set the budget low for testing (e.g. $0.05/query). The cert pass needs you to demonstrate the budget firing.

**Tracing dashboard is empty.** The trace writer isn't flushing. Common cause: the runner doesn't await the trace write. Use `await` or a synchronous append.

---

## Next

[Capstones overview](../../capstones/) — pick the one matching your customer book of business and ship it. The cert is one capstone shipped + all 8 Builds passed + the 90-minute defence.
