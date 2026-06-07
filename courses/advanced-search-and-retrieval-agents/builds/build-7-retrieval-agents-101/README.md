# Build 7 — Retrieval Agents 101

> Part of [Advanced Search & Retrieval Agents](../../README.md).
>
> **Why this matters:** The Retrieval Agent endpoint is the highest-leverage primitive ARAG ships. Every Build prior to this one teaches a configuration; this Build teaches a *category*. Partners who don't internalise the agent loop default to over-engineered orchestration on top of `/ask` and lose to a competitor's two-line agent call.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Prerequisite** | Builds 1–6 of this course (the agent composes everything that came before) |
| **Estimated effort** | 16–20 hours focused |

## What the partner does

Stands up a Retrieval Agent end-to-end against a real customer-shaped scenario. Specifically:

1. Writes the agent's **natural-language brief** (its system prompt) with a structured output schema.
2. Designs the agent's **planning step** — how it decomposes a question into sub-queries.
3. Designs the agent's **execution step** — how it runs each sub-query and merges the results.
4. Wires **observability** — every agent step is traced so the partner can show the customer *what the agent did*.
5. Documents the agent's **failure modes** (loop, hallucination, sub-query that returns no results) and the recovery patterns for each.

The agent should target a real customer-shaped hard question. *"Find me product X"* is not the bar. *"Which of our compliance policies in the EMEA region were amended in the last 90 days and conflict with the new EU AI Act clauses we received from legal last week?"* is the bar.

## Pass rubric

1. Agent deployed and running against the partner's KB.
2. Natural-language brief + structured output schema both committed.
3. At least one agent step traced and visible in a logs panel.
4. Three failure modes documented with recovery patterns.
5. Side-by-side demo: same hard question through `/ask` and through the agent. The partner explains why the agent answer is materially better and what the latency / cost trade-off was.

## Asset delivered

- `agent-brief.md` — the system prompt and structured schema.
- `agent-execution/` — the harness running the planning + execution steps.
- `observability/` — the tracing instrumentation.
- `failure-mode-playbook.md` — three failure modes + recovery patterns.
- `comparison-demo.md` — the side-by-side script.

## Workspace

- `walkthrough.md`
- `agent-brief.md`
- `agent-execution/`
- `observability/`
- `failure-mode-playbook.md`
- `comparison-demo.md`
- `verification.md`

## Reference reading

- ARAG documentation: Retrieval Agents endpoint, agent configuration, agent observability.
- Research: agentic RAG (arxiv search terms: "agentic RAG," "self-RAG," "ReAct," "tool-using agents"); the survey papers on "ReAct" and "Reflexion" are the right starting points.

## See also

- Previous build: [Build 6 — Search Profiles & Per-Use-Case Tuning](../build-6-search-profiles-and-per-use-case-tuning/)
- Next build: [Build 8 — Agent Decomposition, Tool Use & Cost Observability](../build-8-agent-decomposition-and-observability/)
