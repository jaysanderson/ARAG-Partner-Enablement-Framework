# Build 4 — Quick Quiz: Reranking Strategies

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. Cross-encoder rerankers are more precise than bi-encoder embedding retrieval because they:

A. Use larger models.
B. See the full query-candidate pairwise interaction, not one side at a time.
C. Are slower.
D. Run in a different cloud region.

---

### 2. Your measurement shows: built-in reranker adds 80 ms p50 latency and lifts median rank from 3.4 to 2.1. External reranker adds 1,800 ms p50 latency and lifts to 1.4. For a public-facing chatbot with a 500 ms p95 latency budget, you should recommend:

A. External reranker — it has the best lift.
B. No reranking — the chatbot doesn't need precision.
C. Built-in reranker — captures most of the lift inside the latency budget.
D. Try both and let the customer pick.

---

### 3. Adaptive reranking applies the expensive reranker only to:

A. The bottom-K of the first-pass results.
B. The top-K of the first-pass results.
C. Every other result.
D. A random sample.

---

### 4. On factoid queries the first-pass retrieval often already has the correct answer at rank 1. The right reranking recommendation for factoid-dominated workloads is:

A. Always external reranker.
B. Always built-in reranker.
C. Skip reranking — first-pass is sufficient.
D. Adaptive reranking with K=1.

---

### 5. The shape of the latency-vs-quality curve typically shows:

A. Linear improvement — more reranking always helps proportionally.
B. Diminishing returns — built-in captures most of the lift, external adds marginal precision at high latency cost.
C. No improvement — reranking is theatre.
D. Exponential improvement — reranking always wins.

---

## Answer key

1. **B** — the pairwise interaction is the architectural difference. Cross-encoders see query + candidate as one input.

2. **C** — the latency budget rules out the external reranker; built-in captures ~70-80% of external's lift inside the budget.

3. **B** — adaptive reranks the top-K because that's where the correct answer most often is. Bottom-K spend is wasted.

4. **C** — when first-pass is sufficient, reranking is shuffle without lift. The decision matrix should reflect this.

5. **B** — diminishing returns is the canonical shape. The right operating point is where the curve flattens.

---

4+ correct → pass. Continue to [Build 5 — Multi-Turn Conversational Retrieval](../build-5-multi-turn-conversational-retrieval/).
