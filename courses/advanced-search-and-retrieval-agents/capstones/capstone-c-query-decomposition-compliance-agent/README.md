# Capstone C — Query-Decomposition Compliance Agent

> Part of [Advanced Search & Retrieval Agents — Capstones](../README.md).

> **Status:** Brief shipped. Reference implementation lands in subsequent passes.

## At a glance

| | |
|---|---|
| **Effort** | 8–10 days focused |
| **Builds leveraged** | 4 (reranking), 7 + 8 (agents, decomposition, observability) |
| **Customer shape** | Regulated industry (financial services, healthcare, energy, public sector) |
| **Failure being solved** | *"Our compliance officer asks multi-part questions and our search returns one document at a time. We do the synthesis by hand and it takes hours."* |

## 1. Customer shape

A regulated-industry customer where compliance officers ask multi-part questions of the form:

- *"Is our process for X compliant with regulation Y in jurisdiction Z, given last quarter's amendment to clause N?"*
- *"Which of our active product offerings have a feature affected by the new EU AI Act Article 5 prohibition, and do we have a documented mitigation?"*
- *"For each of the three audit findings from Q3, identify the responsible internal policy, the regulatory clause it traces to, and the current remediation status."*

A single-shot retrieval call cannot answer these. The end-user is currently:

1. Decomposing the question by hand.
2. Running each sub-query against the search system.
3. Reading each result manually.
4. Synthesising a verdict in a Word document.

This takes hours per question and is the single biggest hidden cost in the compliance team. The partner's deliverable replaces it with a deployed agent.

## 2. Deliverable

A deployed retrieval agent that:

- Accepts a multi-part compliance question.
- Decomposes it into sub-questions (using Build 8's planner).
- Retrieves evidence per sub-question with **reranking** (Build 4) — compliance questions reward precision over recall.
- Evaluates each sub-question's answer against the source regulation (a custom evaluator tool from Build 8).
- Synthesises a final compliance verdict with **explicit per-clause citation** — every claim in the verdict points to a paragraph in either an internal policy or an external regulation.
- Surfaces an audit-friendly trace of every sub-question, every retrieval, every reranking, and every evaluation step.

## 3. Architecture

- **One Knowledge Box** containing internal policies + external regulations (or two federated KBs — partner's choice; the federation pattern from Capstone B applies if used).
- **A custom Retrieval Agent** (Build 7) with:
  - A planner step (Build 8) that decomposes the compliance question into sub-questions.
  - An execution step that runs each sub-question with adaptive reranking (Build 4).
  - An evaluator tool (Build 8) that scores each sub-answer against its source regulation for clause-level alignment.
  - A merge step that synthesises the per-clause verdict.
- **Cost + latency budgets** (Build 8) — compliance questions are expensive; the agent must stop before the customer's tenant bill blows up. Graceful degradation to a partial-result verdict.
- **An audit-trace surface** — every sub-question, retrieval, reranking, and evaluation is logged with a stable ID; the compliance officer can click any claim in the verdict to see the trace.

## 4. Scope

### In scope (must ship)

- Agent deployed against a real KB (or sandboxed regulatory corpus).
- At least 5 distinct compliance scenarios tested with measured success rate.
- Per-clause citation in the final verdict — every claim points to a paragraph.
- Audit-trace surface accessible from the verdict UI.
- Cost + latency budget enforcement with documented fallback.
- 20-minute customer demo rehearsed.

### Out of scope (explicitly)

- Real-time regulatory ingestion (the regulation corpus is assumed to be ingested via standard processes).
- Legal review of the agent's output (the agent supports the compliance officer; it does not replace them).
- Cross-jurisdictional reasoning beyond what the regulation corpus contains. If the corpus doesn't have the jurisdiction, the agent reports that it doesn't know rather than guessing.
- A signed off legal-advice service. This is decision support, not legal advice. The capstone brief explicitly frames it that way to the customer.

## 5. Demo script (20 min)

1. **Setup (1 min)** — compliance portal. Active user persona is a compliance officer.
2. **Hard multi-part question** (1 min) — partner types *"For each of our three active high-risk AI deployments, identify which EU AI Act Article 5 prohibitions apply, the current internal policy covering it, and whether we have a documented mitigation."*
3. **Planner step revealed** (3 min) — partner expands the trace panel; agent's sub-question list appears: (1) identify high-risk AI deployments, (2) for each, identify applicable Art. 5 prohibitions, (3) for each prohibition, find the covering internal policy, (4) for each policy, find a documented mitigation. Partner explains the decomposition.
4. **Per-sub-question retrieval + reranking** (4 min) — partner expands one sub-question; the trace shows the candidate set, the reranking scores, the chosen evidence.
5. **Evaluator output** (3 min) — partner shows the per-clause alignment score between the internal policy and the regulation clause. Partner shows the case where alignment is weak — the verdict explicitly flags it.
6. **Final verdict** (3 min) — three-deployment-by-three-prohibition matrix. Each cell either green (compliant + mitigation cited) or amber (gap with explicit citation of what's missing).
7. **Cost + latency** (2 min) — partner shows the actual cost and latency of this question. Compares against the customer's current "by hand" cost.
8. **CTO + GC Q&A** (3 min) — defence against *"how do you guarantee this is accurate?"* and *"what happens when the agent runs out of budget?"*

## 6. Pass rubric

1. Agent deployed and answering compliance scenarios with measured success rate ≥ 80% on a 5-scenario test set.
2. Per-clause citation visible in every verdict.
3. Audit-trace surface accessible from the verdict UI.
4. Cost + latency budget enforcement working and documented fallback proven.
5. Planner + reranker + evaluator all in the agent loop and traceable.
6. Demo delivered in under 20 minutes.
7. Workspace deliverables (architecture, agent brief, planner output, reranker config, evaluator tool, audit-trace schema, cost budget config, demo script, decision-support framing doc) all committed.

## 7. Effort breakdown

| Day | Activity |
|---|---|
| 1 | KB selection / provisioning; regulation + internal-policy corpus structure. |
| 2 | Agent brief + structured output schema. |
| 3 | Planner step implementation. |
| 4 | Adaptive reranker wiring (from Build 4). |
| 5 | Evaluator tool (per-clause alignment scoring). |
| 6 | Audit-trace surface — every step logged with stable IDs. |
| 7 | Cost + latency budget enforcement + graceful fallback. |
| 8 | Demo script rehearsal + 5-scenario success measurement. |
| 9 | Polish + verification checklist. |
| 10 (optional) | Solution-lead defence prep. |

## 8. Reskinning notes

The default capstone targets EU AI Act compliance for a hypothetical AI-product company. To reskin:

- Swap the regulation corpus (e.g. to GDPR, HIPAA, NERC CIP, GLBA, NIST 800-53).
- Swap the internal-policy corpus to the customer's actual policy stack.
- Swap the demo scenarios to the customer's actual outstanding compliance questions.
- Swap the evaluator tool's scoring rubric to the customer's preferred alignment standard (Higg, MCM, internal control framework, etc.).
- The agent loop, audit-trace surface, and cost/latency enforcement do not change.

A complete reskin typically takes 3–4 days because the regulation + policy corpus ingestion is the slow part.

## 9. Decision-support framing (read this before the demo)

The agent's output is **decision support, not legal advice**. The compliance officer remains the decision-maker. The capstone brief explicitly:

- Surfaces uncertainty (the verdict shows alignment scores, not boolean "compliant / not compliant").
- Surfaces gaps explicitly (a sub-question that returned weak evidence is flagged, not hidden).
- Surfaces the agent's reasoning (the audit-trace shows what was retrieved and what was rejected).
- Surfaces budget failures explicitly (if the agent ran out of budget, the partial verdict says so).

Get this framing right with the customer's general counsel in the first 30 minutes of the demo. Get it wrong and the demo becomes a legal review of an agent's output, which is the wrong conversation.

## Workspace

- `architecture.md` — KBs, agent, evaluator, audit surface.
- `agent-brief.md` — system prompt + structured output schema.
- `planner/` — planner step implementation.
- `reranker-config.md` — adaptive reranker configuration for compliance scenarios.
- `evaluator-tool/` — per-clause alignment scoring.
- `audit-trace-schema.md`.
- `cost-budget/` — budget config + fallback behaviour.
- `demo-script.md` — the 20-min script.
- `decision-support-framing.md` — the legal-not-legal-advice framing doc.
- `verification.md`.

## See also

- Capstones overview: [`../README.md`](../README.md)
- Build 4: [Reranking Strategies](../../builds/build-4-reranking-strategies/)
- Build 7: [Retrieval Agents 101](../../builds/build-7-retrieval-agents-101/)
- Build 8: [Agent Decomposition, Tool Use & Cost Observability](../../builds/build-8-agent-decomposition-and-observability/)
