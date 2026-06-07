# Build 8 — Quick Quiz: Agent Decomposition, Tool Use & Cost Observability

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. The planner step in this Build differs from Build 7's decomposition because:

A. It uses a smaller LLM.
B. It's a dedicated LLM call that returns a structured plan with dependencies, recommended profiles, and cost estimates.
C. It's hard-coded.
D. It doesn't exist.

---

### 2. A custom tool wired into a Retrieval Agent should have:

A. Free-form input — the agent figures it out.
B. A typed JSON schema for parameters + a description telling the agent when to use it.
C. No description — just the function name.
D. Only English documentation.

---

### 3. The cost budget exhausts on a query. The right default fallback is:

A. Error response.
B. Continue running until the agent finishes regardless of budget.
C. Synthesise a partial result from completed sub-queries with `budget_exhausted: true`.
D. Re-route to `/find`.

---

### 4. Why per-step latency budgets, not just a cumulative one?

A. They're easier to implement.
B. A runaway tool call (e.g. a hanging inventory API) stalls the agent without ever exceeding the total budget — per-step catches it.
C. The platform requires them.
D. They reduce hallucination.

---

### 5. The customer's procurement team asks *"what's the worst-case cost per query?"* The right answer comes from:

A. A guess based on the LLM's pricing.
B. The tracing dashboard's p95 cost number plus the budget cap.
C. Whatever the vendor quotes.
D. The agent's brief.

---

## Answer key

1. **B** — a dedicated planner LLM call that returns a structured plan is the architectural upgrade. Build 7 used fixed decomposition; this Build is a planning step.

2. **B** — typed schema + description. The schema makes the call safe; the description tells the agent when to reach for it.

3. **C** — partial synthesis with explicit `budget_exhausted: true` is the right default. The renderer can show the partial result with a banner; the customer sees what completed and what didn't.

4. **B** — runaway tool calls are the canonical case for per-step budgets. A stalled call never exceeds total budget but it stalls the whole agent.

5. **B** — the dashboard's p95 cost + the budget cap gives the worst-case. Anything else is a guess.

---

4+ correct → pass. Continue to [Capstones overview](../../capstones/) — pick your capstone and ship it.
