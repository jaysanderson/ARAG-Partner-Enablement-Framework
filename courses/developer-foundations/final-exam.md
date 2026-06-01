# Developer Foundations — Final Exam

> **Format.** 20 multiple-choice. Open-book. Pass = **16/20 (80%)**.
>
> **Gate.** This exam must be passed before you submit your Build 12 (Capstone Prep) plan for review-board sign-off, and before you may start the Build 13 capstone.
>
> **Drawn from.** The per-Build quick quizzes across Builds 0–12. If you passed each quiz, you have already seen the concept tested here.
>
> **Submission.** Send your answers to `#exam-submissions`. A Progress Solution lead grades within 5 business days.

---

### 1. The auth header on every ARAG API request is:

A. `Authorization: Bearer <jwt>`
B. `X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>`
C. `X-API-Key: <key>`
D. `Cookie: session=...`

---

### 2. The vibe-coding mental model for this course says:

A. The AI does design and implementation; you observe.
B. You design and verify; the AI writes the code.
C. You hand-write production code; AI writes demos.
D. The AI is only used for documentation.

---

### 3. A customer wants AI to generate a structured form letter with fixed fields. This is:

A. P1 — semantic search
B. P2 — free-form chat
C. P3 — schema-constrained generation
D. P5 — secure media

---

### 4. A customer wants to traverse "Judge Smith → cited precedents." This is:

A. P1 — `/find` for "Judge Smith"
B. P2 — `/ask` with a Judge Smith prompt
C. P4 — `/graph` traversal
D. P5 — `/resource` for the judge's bio

---

### 5. The Nuclia widget library ships as:

A. A React component package on npm
B. Standard Web Components from a CDN script
C. A jQuery plugin
D. An iframe embed

---

### 6. To serve two audiences (prospect, member) over one KB, you should use:

A. Two KBs routed by auth state
B. One KB, two prompt configurations
C. Two LLM endpoints, one cheap and one premium
D. Two ARAG service accounts

---

### 7. To answer in French, the change to your `/ask` call is:

A. Add `lang: "fr"` to the body
B. Switch to a French-trained LLM
C. Prepend "Respond in French:" to the query
D. Provision a French-language KB

---

### 8. Which body field binds output to a JSON Schema?

A. `output_schema`
B. `answer_json_schema`
C. `response_format`
D. `json_mode`

---

### 9. Every `object` schema passed to ARAG must include:

A. `strict: true`
B. `additionalProperties: false` at every level
C. `$schema: "draft-2020-12"`
D. `mode: "structured"`

---

### 10. ARAG's three named data-augmentation agents are:

A. Embedder, Retriever, Reranker
B. Generator, Labeller, Graph
C. Indexer, Classifier, Linker
D. Chunker, Tagger, Mapper

---

### 11. "Search isn't finding things even when the answer is in the corpus" points to:

A. The Labeller agent
B. The Graph agent
C. The Generator agent
D. A new BYO-LLM endpoint

---

### 12. To filter `/find` to PDFs only, the `filters` array contains:

A. `["pdf"]`
B. `["/icon/application/pdf"]`
C. `["mime:application/pdf"]`
D. `["type:pdf"]`

---

### 13. The single most important filter in every ARAG graph query is:

A. `{ "exclude_ner": true }`
B. `{ "filter": "custom" }`
C. `{ "prop": "generated", "by": "data-augmentation" }`
D. `{ "source": "agent" }`

---

### 14. How do you A/B test a CTA without a code deploy?

A. Switch to a different LLM.
B. Edit the field value in the dashboard.
C. Modify the front-end prompt config.
D. Recompile the React app.

---

### 15. Composite RAG, in three words:

A. Embed, search, answer.
B. Generate, evaluate, augment.
C. Retrieve, rerank, return.
D. Index, augment, deploy.

---

### 16. The boundary between composite RAG and true agentic is:

A. The number of LLM calls.
B. The latency budget.
C. Who decides the next step: model or programmer.
D. Whether the response is streamed.

---

### 17. ARAG data residency is configured:

A. Per service-account JWT.
B. Per partner organisation.
C. Per KB, at provisioning time.
D. Per HTTP request.

---

### 18. What does BYO-LLM let the customer point the KB at?

A. Their own LLM tenant.
B. Their database.
C. Their CDN.
D. Their dashboard.

---

### 19. The key observability metric for retrieval-quality regression is:

A. p99 latency.
B. Citation rate on `/ask` responses.
C. Total request volume.
D. Average answer length.

---

### 20. A "master prompt" should be:

A. A one-line bullet.
B. 200–500 words with goal, context, and verification.
C. A full pseudocode implementation.
D. A reference to an external spec doc.

---

## Answer key

1. B · 2. B · 3. C · 4. C · 5. B · 6. B · 7. C · 8. B · 9. B · 10. B

11. C · 12. B · 13. C · 14. B · 15. B · 16. C · 17. C · 18. A · 19. B · 20. B

16+ correct → pass. Submit your Build 12 plan to the review board, then start [Build 13 — The Capstone](builds/build-13-capstone/).
