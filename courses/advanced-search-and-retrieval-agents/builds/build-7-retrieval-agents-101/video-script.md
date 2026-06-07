# Video Script — Build 7: Retrieval Agents 101

> **Duration target:** 12 minutes

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Build 7 · Retrieval Agents 101."*

**VOICEOVER:**
> Twelve minutes. Retrieval Agents are not a feature. They are a category. By the end of this video you'll know how to design one — brief, schema, observability, failure recovery.

## Section 1: What the agent actually does (0:30 – 3:00)

**ON SCREEN:** The internal loop visualised. Plan → execute → merge → synthesise.

**VOICEOVER:**
> The platform's agent endpoint accepts a natural-language brief, a structured output schema, and a question. It returns a structured object plus an execution trace.
>
> Internally a loop runs. Plan — generate sub-questions. Execute — retrieve per sub-question. Merge — combine the evidence. Synthesise — produce the structured output.
>
> Five to thirty seconds. Five to fifty times the cost of `/ask`. When the question deserves it, the best primitive ARAG ships.

## Section 2: The brief (3:00 – 5:00)

**ON SCREEN:** A sample 250-word brief annotated with its components — role, rules, domain priors, output discipline.

**VOICEOVER:**
> The brief is the system prompt. Role: what you are. Rules of engagement: always cite, never speculate, mark ungrounded findings. Domain priors: the decomposition axes for your customer's vertical. Output discipline: match the schema exactly.
>
> Under 100 words is generic. Over 500 is over-prescriptive. Two to three hundred words is the sweet spot.

## Section 3: The schema (5:00 – 7:00)

**ON SCREEN:** Sample JSON schema with `verdict` enum, `citation_resource_ids` per sub-finding, `grounding_status` per sub-finding, top-level `budget_exhausted`.

**VOICEOVER:**
> Three things the schema must have. An enum on the top-level outcome — the renderer switches on it. Citation IDs as first-class fields per sub-finding — not embedded in prose. Grounding status per sub-finding — the explicit signal for when the agent couldn't fully ground a claim.
>
> A schema with these three properties is renderable, defensible, and customer-facing.

## Section 4: Three failure modes (7:00 – 10:00)

**ON SCREEN:** Three rows — loop, hallucination, dead-end sub-query. Each row shows the failure pattern and the recovery.

**VOICEOVER:**
> Loop — the planner generates more sub-questions every iteration and never converges. Recovery: explicit step-count cap in the brief, hard kill in the runner.
>
> Hallucination — synthesis produces a confident claim with no citation backing. Recovery: the schema demands citation IDs; the runner validates; ungrounded claims are dropped.
>
> Dead-end sub-query — the sub-question retrieves nothing; synthesis answers anyway. Recovery: the schema's `grounding_status: "ungrounded"` is the signal; the renderer surfaces the gap rather than hiding it.
>
> A partner who ships an agent without documenting these three failure modes ships an agent that embarrasses them in production.

## Section 5: The side-by-side demo (10:00 – 11:30)

**ON SCREEN:** Two-pane comparison. Same hard question. Left pane: `/ask` returns a generic single-paragraph answer with limited citations. Right pane: agent returns the structured verdict with per-sub-finding breakdown and per-sub-finding grounding.

**VOICEOVER:**
> The side-by-side is the cert-bar defence. Hard multi-part question. `/ask` returns a paragraph that punts on half the question. The agent returns a structured verdict with per-sub-finding evidence.
>
> *"Why an agent and not /ask?"* — point at the side-by-side.

## Close (11:30 – 12:00)

**VOICEOVER:**
> Build 7 ships the brief, the schema, the observability, the failure playbook, the comparison demo. Build 8 takes the agent further — planner depth, custom tools, cost and latency budgets, tracing dashboards. See you there.
