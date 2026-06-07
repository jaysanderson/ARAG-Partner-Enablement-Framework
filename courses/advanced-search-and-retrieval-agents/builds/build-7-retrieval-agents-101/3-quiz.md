# Build 7 — Quick Quiz: Retrieval Agents 101

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. The internal loop of a Retrieval Agent is:

A. Retrieve, generate, return.
B. Plan, execute sub-queries, merge, synthesise.
C. Embed, search, rerank.
D. Ask, answer, follow up.

---

### 2. A natural-language brief for a Retrieval Agent should be roughly:

A. Under 50 words — keep it minimal.
B. 200–300 words — role, rules, domain priors, output discipline.
C. Over 1,000 words — exhaustive instructions are safest.
D. The same as a `/ask` query — no special format needed.

---

### 3. Your agent's structured output schema includes a `citation_resource_ids` field per sub-finding. The agent returns a sub-finding with an empty `citation_resource_ids` array. The right move is:

A. Hide the sub-finding from the user.
B. Show the sub-finding with `grounding_status: "ungrounded"` so the user sees the gap.
C. Re-run the agent until it returns citations.
D. Edit the brief to forbid empty arrays.

---

### 4. Which is *not* one of the three failure modes the lesson covers?

A. Loop — agent plans sub-queries forever.
B. Hallucination — synthesis beyond the evidence.
C. Dead-end sub-query — sub-question returns nothing.
D. Reranker drift — reranker scores degrade over time.

---

### 5. Your customer asks: *"What's the warranty length on Product X?"* You reach for the Retrieval Agent endpoint. What's wrong?

A. Nothing — agents are the most powerful primitive.
B. Single-shot factoid questions are over-spec for an agent; cost and latency are 50× higher than `/ask` sync without quality benefit.
C. Agents don't support warranty questions.
D. The agent will rephrase the question.

---

## Answer key

1. **B** — plan, execute, merge, synthesise. Four steps inside the loop.

2. **B** — 200–300 words is the sweet spot. Under 100 is generic; over 500 is over-prescriptive.

3. **B** — the whole point of `grounding_status` is to surface gaps. Hiding ungrounded findings is what produces the *"confidently wrong"* failure mode the lesson warns against.

4. **D** — reranker drift is a Build 4 concern, not an agent failure mode. The three agent failure modes are loop, hallucination, dead-end sub-query.

5. **B** — the agent is wildly over-spec. The selection flowchart from Build 1 says: single-shot factoid → `/ask`. Reaching for the agent because it's the most powerful is the exact mistake Build 1 warned about.

---

4+ correct → pass. Continue to [Build 8 — Agent Decomposition, Tool Use & Cost Observability](../build-8-agent-decomposition-and-observability/).
