# Build 1 — Quick Quiz: Search Primitives Deep Dive

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. A customer wants a search-as-you-type experience on a 50,000-document policy library, returning ranked resources in under 300 ms p95. The user is expected to click through to read the source — no synthesised answer is needed. Which primitive is the right reach?

A. `/ask` sync — gives them an answer plus citations.
B. `/ask` streaming — same, but with a typewriter feel.
C. `/find` — retrieval-only, no LLM cost or latency.
D. Retrieval Agent — most flexible.

---

### 2. A customer asks: *"Is our employee handbook policy on remote work compliant with the new EU work-from-home directive, given the amendment our legal team flagged last week?"* This is a single user-typed question. What's the right primitive?

A. `/ask` sync — single grounded answer, fast.
B. `/predict/chat` — handles the follow-up automatically.
C. `/find` — return the matching documents and let the user read.
D. Retrieval Agent — multi-part question needs decomposition.

---

### 3. The trade-off matrix shows your tenant's `/ask` sync at $0.008 per call median, p95 at 5.2 s, citation density 4.1 sources per response. The Retrieval Agent runs $0.18 per call median, p95 at 28 s, citation density 11.3. For a public-facing high-volume chatbot answering single-fact product questions, what does the matrix tell you?

A. Use the agent — higher citation density is always better.
B. Use `/ask` sync — the agent is 22× the cost and 5× the latency for a use case `/ask` handles fine.
C. Use `/find` — it's the cheapest.
D. The matrix is wrong — re-run the harness.

---

### 4. Your customer wants a chatbot that handles follow-up questions with pronoun resolution and topic continuity, but every single turn could be answered with a one-shot retrieval. Which primitive should drive the surface?

A. Retrieval Agent in conversational mode — always pick the most powerful primitive.
B. `/ask` per turn with the partner managing conversation history manually.
C. `/predict/chat` — single-shot per turn with platform-managed conversation state.
D. `/find` per turn with no LLM — cheapest.

---

### 5. Which of these is *not* a dimension of the primitive-comparison matrix you build in Step 3?

A. Cost per call.
B. Latency p50 / p95.
C. Citation density.
D. Number of paragraphs returned per query.

---

## Answer key

1. **C** — `/find` is the right reach. The user expects a list, the latency budget is sub-second, and no LLM-grade synthesis is needed. `/ask` is over-spec; the agent is wildly over-spec.

2. **D** — multi-part questions ("X compliant with Y given amendment Z") cannot be answered by single-shot retrieval. This is the canonical case for a Retrieval Agent that decomposes.

3. **B** — the matrix tells you `/ask` sync is the right primitive. 22× cost and 5× latency for a use case `/ask` handles is the textbook over-reach the lesson warns against. (*The specific dollar figures in the question are illustrative — every partner measures their own. The judgement is what the question tests.*)

4. **C** — `/predict/chat` is the right primitive when each turn is single-shot but the conversation needs continuity. Agent-in-conversational-mode is the right choice only when at least one turn needs decomposition.

5. **D** — paragraphs-returned-per-query is a `/find` characteristic but not one of the five dimensions of the comparison matrix. The five are: cost, latency, citation density, structured-output support, conversational state.

---

4+ correct → pass. Continue to [Build 2 — Query Understanding & Rephrasing](../build-2-query-understanding-and-rephrasing/).
