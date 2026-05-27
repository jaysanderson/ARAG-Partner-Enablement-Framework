# Build 4 — Quick Quiz: Composite RAG

> 8 questions + 1 short answer. Open-book. Pass = 7/8 + a credible short answer.

---

### 1. The three-word summary of composite RAG is:

A. Retrieve, generate, return
B. Embed, search, answer
C. **Generate, evaluate, augment**
D. Index, query, render

---

### 2. The cleanest composite-RAG example in the Sample ARAG App is:

A. `pages/AssistantPage.tsx`
B. **`components/certification/ExamStudyPanel.tsx` (retry-on-low-citations)**
C. `pages/SearchResultsPage.tsx`
D. `components/chat/FloatingChat.tsx`

---

### 3. A naive "re-ask if confidence < X" loop without an exit condition can:

A. Hit the 2400 req/min rate limit
B. **Loop forever when the corpus genuinely lacks the answer**
C. Fail the schema validation
D. Bypass the citation extractor

---

### 4. The typical latency cost of composite RAG (Recipe 1) vs single-shot is approximately:

A. The same
B. 0.5x (faster, due to caching)
C. **1.5–2x (one extra `/find` plus one extra `/ask`)**
D. 5–10x

---

### 5. The "multi-pass synthesis" recipe (Recipe 2) is most useful when:

A. The corpus is over 100,000 documents
B. **The answer benefits from entity-driven graph expansion (e.g., "find related products via `pairs_with` and re-ask with that context")**
C. The user wants a streaming response
D. The query is a yes/no question

---

### 6. When does composite RAG cross into "true agentic"?

A. When more than 3 calls are chained
B. When the LLM is GPT-4 or higher
C. **When the model — not the programmer — decides what tool to call next at run-time**
D. When the response is streamed instead of sync

---

### 7. After augmenting via `/find` and re-asking, the right thing to do with the citation lists is:

A. Discard the initial citations; use only the augmented ones
B. **Merge and dedupe both lists by resource id; surface all unique citations to the user**
C. Keep them separate so the user can see which were "agentic"
D. Re-rank by confidence and keep only the top 3

---

### 8. A customer in legal-tech asks: "When the AI doesn't have enough info to answer with confidence, can it go look in adjacent doctrines instead of just saying 'I don't know'?" What's the right answer?

A. "No — ARAG always returns a single-shot response."
B. "Yes, but only with a Tier 4 enterprise plan."
C. **"Yes. This is composite RAG — Recipe 1 (retry on low citations). We design it into the workflow; when the initial retrieval is thin, the pipeline broadens its search and re-asks. Every step is logged for audit."**
D. "Yes, but you'll need a different vendor for that capability."

---

## Short answer

**Q9.** A customer's CTO objects: "Composite RAG sounds great but it costs 2x in LLM tokens and adds 2 seconds of latency per query. Why would I pay double for slightly better answers?" Give the 4-sentence response that wins this objection.

> *Pass rubric:* The answer must touch on (a) selective composition — composite isn't used for *every* query, only the ones where the initial answer fails the confidence check (typically 10–30% of queries); (b) the relationship between answer quality and customer trust in regulated industries (one wrong answer costs more than 1000 marginal LLM tokens); (c) the option to *not* cap retries at infinity — strict latency budgets keep the worst case under 5 seconds; (d) the fact that the customer's compliance team will treat "I don't know" + an augmented search as a better audit trail than a single-shot wrong answer. Bonus for mentioning the Advanced course's Build 8 introduces formal observability for cost analysis.

---

## Answer key

1. C • 2. B • 3. B • 4. C • 5. B • 6. C • 7. B • 8. C

7 or more correct → you've passed.

## Why these questions matter

- **Q1, Q2, Q3, Q4, Q7** are implementation reflexes. Get them wrong in production and you ship pipelines that loop, time out, or double-count citations.
- **Q5, Q6** are the conceptual scaffolding for Tier 4 conversations. The "what is agentic" question comes up in *every* enterprise CTO meeting.
- **Q8** is the most important commercial question. The composite-RAG framing in answer C is the language that converts "we already have RAG" objections into Tier 3/4 platform conversations.
