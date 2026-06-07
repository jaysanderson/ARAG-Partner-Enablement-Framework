# Video Script — Build 8: Agent Decomposition, Tool Use & Cost Observability

> **Duration target:** 12 minutes

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Build 8 · Agent Decomposition, Tool Use & Cost Observability."*

**VOICEOVER:**
> Twelve minutes. Build 7 was the simplest agent loop. Build 8 is where you stop being an agent user and become an agent designer. Planner. Tools. Budgets. Tracing dashboard. By the end you can answer the customer's procurement team about cost per query.

## Section 1: The planner step (0:30 – 3:00)

**ON SCREEN:** Side-by-side. Build 7's fixed decomposition vs Build 8's structured planner output with dependencies and cost estimates.

**VOICEOVER:**
> Build 7's agent decomposed via a fixed template — break it into 3 to 8 parts. Build 8's agent has a dedicated planner. An LLM call that returns a structured plan. Sub-queries with dependencies. Recommended search profile per sub-query. Cost and latency estimates up front.
>
> The plan is inspectable. The plan is editable. The plan is explicable. That's the difference between a black box and a system.

## Section 2: Custom tools (3:00 – 5:30)

**ON SCREEN:** Sample tool catalogue. Date-range resolver, inventory lookup, currency conversion.

**VOICEOVER:**
> A tool is a typed function the agent decides to call. The schema makes the call safe. The description tells the agent when to reach for it.
>
> Customer-shaped examples. Date-range resolver. Inventory lookup. Currency conversion. Document classification. Regulatory-jurisdiction lookup.
>
> The tool catalogue is what stops the agent from hallucinating about facts it can look up.

## Section 3: Cost budgets and fallback (5:30 – 8:00)

**ON SCREEN:** Code snippet showing cost budget enforcement + three fallback strategies — partial, ask_only, error.

**VOICEOVER:**
> A cost budget caps the agent's spend per query. When the budget exhausts, the runner terminates cleanly and falls back to one of three strategies.
>
> Partial — return whatever sub-queries completed, mark budget_exhausted in the response. Default for most use cases.
>
> Ask_only — abandon the agent, call /ask once with the original question. For cases where a partial result is worse than a simple one.
>
> Error — return an error; let the surface decide. For cases where the customer prefers no answer over a partial one.
>
> Choose one. Document it. The customer's procurement team has a worst case.

## Section 4: Per-step latency budgets (8:00 – 9:30)

**ON SCREEN:** Diagram showing a runaway tool call stalling the agent. Per-step budget catches it.

**VOICEOVER:**
> A cumulative budget catches expensive agents. A per-step budget catches stalled agents. The runaway tool call. The hanging inventory API. The cumulative budget never trips; the agent just stops responding.
>
> Per-step budgets are the catch.

## Section 5: The tracing dashboard (9:30 – 11:30)

**ON SCREEN:** Sample dashboard. Cost histogram, latency p50/p95, step-type breakdown, budget-exhausted rate, tool-call success rate.

**VOICEOVER:**
> The tracing dashboard is the customer's audit surface. Per-query cost distribution. Per-step latency. Step-type breakdown. Budget-exhausted rate. Tool-call success rate.
>
> *"What did the agent do this week?"* — the dashboard answers. *"What's the average cost?"* — the dashboard answers. *"Where are queries failing?"* — the dashboard answers.
>
> A partner who ships an agent without a tracing dashboard ships a black box. A partner who ships the dashboard ships a product the customer's team can operate.

## Close (11:30 – 12:00)

**VOICEOVER:**
> Build 8 ships the planner, the tools, the budgets, the dashboard, the pricing conversation script. Eight Builds done. The capstones are next. Pick the one matching your customer book of business and ship it. The cert is one capstone shipped, all eight Builds passed, ninety-minute defence with a Progress Solution lead. See you on the other side.
