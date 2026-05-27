# Build 0 — Quick Quiz: Hello ARAG

> 8 questions + 1 short answer. Open-book. Pass = 7/8 + a credible short answer. Take it after the [walkthrough](walkthrough.md).
>
> The same material is covered (more deeply) in the [final exam](../../final-exam.md). Treat this quiz as practice — if you can't pass it now, you won't pass the final.

---

### 1. ARAG's five primitives map 1:1 to ARAG API endpoints. Which primitive corresponds to `/v1/kb/{id}/find`?

A. Generate (P2)
B. **Retrieve (P1)**
C. Constrain (P3)
D. Reason over relations (P4)

---

### 2. What does the `X-NUCLIA-SERVICEACCOUNT` header carry?

A. The end-user's OAuth access token
B. A short-lived API key, rotated hourly
C. **A long-lived service-account JWT scoped to one KB**
D. A session cookie tied to the partner's dashboard login

---

### 3. When you call `/ask` without setting `x-synchronous: true`, ARAG returns:

A. A single JSON object with `answer` and `citations`
B. **An NDJSON stream of `{"item": {...}}` lines containing `answer`, `retrieval`, and `status` events**
C. A WebSocket connection
D. A Server-Sent Events (SSE) stream with `event:` and `data:` lines

---

### 4. In a `/find` response, where do paragraph-level match scores appear?

A. At the top level of the response
B. In `best_matches[].score`
C. **In `resources.<id>.fields.<field-id>.paragraphs.<paragraph-id>.score`**
D. In a separate `/scores` endpoint

---

### 5. Which body parameter on `/ask` causes ARAG to rewrite the user query before retrieval?

A. `prefer_markdown: true`
B. **`rephrase: true`**
C. `enhance_query: true`
D. `query_expansion: true`

---

### 6. Which of these is the *correct* mental model to pitch ARAG to a customer's CTO?

A. "ChatGPT for your data"
B. "A vector search engine with a generation layer bolted on"
C. **"A platform exposing five primitives — retrieve, generate, constrain, reason, stream — composable into every AI feature the customer will ever ship"**
D. "An open-source RAG framework you self-host"

---

### 7. A `/find` response contains a paragraph with `position.start_seconds: [45.2]`. What does this tell you about the source resource?

A. The document was uploaded 45.2 seconds ago
B. The model spent 45.2 seconds generating an answer
C. **The matching paragraph is at the 45.2-second mark of a video or audio resource**
D. The retrieval confidence is 45.2%

---

### 8. A partner stands up a new sandbox KB, ingests 10 documents, and asks "What's our return policy?" — but their corpus is product specs only. The model replies: *"I don't have enough information to answer."* What is the right interpretation?

A. The KB is broken and needs re-provisioning.
B. The service-account JWT is expired.
C. **The model is doing the right thing — grounded retrieval failed, so it refuses to hallucinate. This is a feature.**
D. The `rephrase: true` flag must be missing.

---

## Short answer

**Q9.** In your own words, explain why ARAG's "single `/ask` call wraps retrieval + generation + citation extraction" is a competitive advantage over a custom RAG stack that stitches together a vector store + an LLM API. Three sentences maximum.

> *Pass rubric:* The answer must touch on (a) the eliminated integration/glue work, (b) the maintenance cost shifted off the partner, and (c) consistent citation handling. Bonus for mentioning the implications for partner gross margin on customer engagements (no custom code to maintain = higher margin on the same SOW).

---

## Answer key

1. B • 2. C • 3. B • 4. C • 5. B • 6. C • 7. C • 8. C

If you got 7 or more correct and your short answer hits the three rubric points, you've passed Build 0's quiz. Submit your 30-minute walkthrough recording to `#build-clinic-submissions` for reviewer sign-off, then start [Build 1](../build-1-grounded-search-widgets/lesson.md).

## Why these questions matter

- **Q1, Q3, Q4, Q5, Q7** test the API surface you'll be using all course — get them in muscle memory now.
- **Q2** kills the "but we already use OAuth" objection partners get from customer IT teams. It's the foundation of the BYO-LLM and residency conversations later.
- **Q6** is the most important question in this quiz. If you can't say this sentence verbatim to a CTO, every customer engagement you run will cap at $80K instead of $500K+.
- **Q8** tests one of the most counter-intuitive things about ARAG vs other vendors: refusing to answer when grounded retrieval fails is the *correct* behaviour. Customers in regulated industries (financial services, legal, healthcare) buy ARAG specifically for this. Hallucination-by-default loses them. Grounded refusal wins them.
