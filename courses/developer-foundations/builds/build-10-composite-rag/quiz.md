# Build 9 — Quick Quiz: Composite RAG

> 5 multiple-choice + 1 short answer. Pass = 4/5 + credible SA.

---

### 1. Composite RAG, in three words:

A. Embed, search, answer.
B. **Generate, evaluate, augment.**
C. Retrieve, rerank, return.
D. Index, augment, deploy.

---

### 2. The maximum recommended retry depth for composite RAG is:

A. Unlimited; let the model decide.
B. **1 retry. Cap it. Always.**
C. 5 retries.
D. Until confidence > 0.9.

---

### 3. Typical latency cost of composite (Recipe 1) vs single-shot:

A. Same.
B. **1.5–2x (one extra `/find` + one extra `/ask`).**
C. 0.5x (faster, due to caching).
D. 5–10x.

---

### 4. The boundary between composite RAG and true agentic is:

A. The number of LLM calls.
B. The latency budget.
C. **Whether the model (run-time) or the programmer (write-time) decides the next step.**
D. Whether the response is streamed.

---

### 5. A customer's CTO objects: "Composite RAG costs 2x in tokens. Why pay?" The right reframe is:

A. "It produces better answers on every query."
B. **"Selective composition — composite isn't used for every query, only the ones where single-shot fails the confidence check (10–30% of queries). On those, the alternative is a wrong answer, which costs more than 1000 marginal LLM tokens — especially in regulated industries."**
C. "It's a Tier 4 enterprise feature; it's bundled."
D. "Your alternative is to switch to a more expensive model."

---

## Short answer

**Q6.** A customer wants composite RAG but their UX requires sub-2-second responses for every query. How do you scope this in 4 sentences?

> *Pass rubric:* (1) Selective composition — only fire composite on queries that fail the confidence check; most queries stay single-shot and meet the 2s budget. (2) Set a hard timeout on the composite pipeline (e.g., 3s) and return the partial single-shot answer if composite exceeds. (3) Pre-compute / cache results for the top-N most common queries so composite is hit only on long-tail. (4) If even those mitigations aren't enough, the customer's choice becomes "fast and sometimes wrong" vs "slower and more grounded" — they own that trade-off, document it. Bonus for noting the Advanced course goes deeper on this with observability + tuning.

---

## Answer key

1. B • 2. B • 3. B • 4. C • 5. B

4+ correct → pass. Move to [Build 10](../build-11-production-readiness/).

## Why these questions matter

- **Q1–Q3** are composite-RAG mechanics. Get them in muscle memory.
- **Q4** is the conceptual scaffolding for the Tier 4 conversation. CTOs ask about agentic in every enterprise meeting.
- **Q5** is the cost-vs-quality objection that determines whether composite ships. The "selective composition" framing wins it.
- **Q6** is the operational reality. UX budgets are real; composite isn't free. The mitigations matter.
