# Developer Foundations — Final Exam

> **Format.** 40 multiple-choice + 5 short-answer. Open-book. Pass = **32/40 MC (80%) plus 3/5 short-answer**.
>
> **Gate.** This exam must be passed *before* you may submit your Build 7 capstone for review-board defence. Each Build's quick quiz was practice; this is the real assessment.
>
> **Time.** Plan ~90 minutes of focused work. There's no time limit — accuracy over speed.
>
> **Drawn from.** Lessons + walkthroughs + quizzes across [Build 0](builds/build-0-hello-arag/), [Build 1](builds/build-1-grounded-search-widgets/), [Build 2](builds/build-2-multi-surface-conversational/), [Build 3](builds/build-3-schema-constrained-generation/), [Build 4](builds/build-4-composite-rag/), [Build 5](builds/build-5-knowledge-graph/), [Build 6](builds/build-6-production-readiness/).
>
> **Submission.** Submit your responses to `#exam-submissions` in the partner Slack. A Progress Solution lead grades within 5 business days.

---

## Section A — Concepts (10 questions)

### 1. The five ARAG primitives are:

A. Index, Search, Generate, Tune, Deploy
B. **Retrieve, Generate, Constrain, Reason over relations, Stream & secure media**
C. Embed, Retrieve, Generate, Validate, Audit
D. Ingest, Index, Query, Answer, Cite

---

### 2. The four-tier ARAG capability ladder positions Tier 1 as:

A. Custom data-augmentation agents
B. **Grounded search + Q&A (the "feature" tier)**
C. Multi-surface conversational intelligence
D. Production-grade agentic platforms

---

### 3. Which tier doubles average customer ACV by adding multiple prompt voices, query-prefix language switching, and embedded widgets to a single KB?

A. Tier 1
B. **Tier 2 (Multi-Surface Conversational Intelligence)**
C. Tier 3
D. Tier 4

---

### 4. The framework's "moat-building" tier — where `askForJson` turns ARAG into a programmable backend — is:

A. Tier 1
B. Tier 2
C. **Tier 3 (Structured AI Workflows)**
D. Tier 4

---

### 5. Strategic-account ACV ($500K–$2M, multi-year) is unlocked at:

A. Tier 1
B. Tier 2
C. Tier 3
D. **Tier 4 (Agentic & Knowledge-Graph Platform)**

---

### 6. The three "non-negotiable principles" of the framework are:

A. Speed, quality, security
B. **Platform-not-feature; competency-before-commission; build-don't-slide**
C. Latency, accuracy, residency
D. Sell, deliver, retain

---

### 7. The 70-20-10 learning model says partner time should split as:

A. 70% formal classroom, 20% sandbox, 10% social
B. **70% experiential (sandbox builds), 20% social (office hours / peer review), 10% formal (decks)**
C. 70% sandbox, 30% real customer engagements
D. 50% reading, 30% coding, 20% reviewing

---

### 8. Composite RAG, in three words, is:

A. Embed, search, answer
B. Retrieve, rerank, return
C. **Generate, evaluate, augment**
D. Index, augment, deploy

---

### 9. The boundary between "composite RAG" and "true agentic" is:

A. Number of LLM calls
B. **Whether the model (run-time) or the programmer (write-time) decides the next step**
C. Latency budget
D. Whether streaming is enabled

---

### 10. The framework's "advanced-cert attach rate" is:

A. The fraction of partners who renew their contracts
B. The fraction of certs that auto-renew at year 12
C. **The fraction of Developer Foundations Practitioners who go on to earn AE&RS Specialist — the single most important leading indicator of platform-vs-feature competency**
D. The fraction of partners who hold Sell + Solution + Deliver certs simultaneously

---

## Section B — Implementation (15 questions)

### 11. The auth header on every ARAG API request is:

A. `Authorization: Bearer <jwt>`
B. **`X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>`**
C. `X-API-Key: <key>`
D. `Cookie: session=...`

---

### 12. The streaming `/ask` response is delivered as:

A. Server-Sent Events with `event:` / `data:` lines
B. WebSocket frames
C. **NDJSON — one JSON object per line, each shaped `{"item": {"type": "...", ...}}`**
D. Chunked HTML

---

### 13. To force a synchronous `/ask` response (one JSON object instead of a stream), add the request header:

A. `Accept: application/json`
B. **`x-synchronous: true`**
C. `streaming: false`
D. `mode: sync`

---

### 14. In a streaming `/ask` response, the citation list appears in:

A. The first `item` of type `answer`
B. The HTTP response headers
C. **An `item` of type `retrieval` containing `results.resources` and `results.best_matches`**
D. A separate `/citations` API call

---

### 15. To filter `/find` results to PDFs only, the `filters` array should contain:

A. `["pdf"]`
B. **`["/icon/application/pdf"]`**
C. `["mime:application/pdf"]`
D. `["filetype:pdf"]`

---

### 16. The `prompt` object on `/ask` has two keys:

A. `instruction` and `template`
B. **`system` and `user`**
C. `prefix` and `query`
D. `role` and `content`

---

### 17. In a custom user template, the two placeholders ARAG substitutes at request time are:

A. `${context}` and `${query}`
B. `{{retrieval}}` and `{{question}}`
C. **`{context}` and `{question}`**
D. `[context]` and `[question]`

---

### 18. The multilingual answer pattern in the Sample ARAG App is implemented by:

A. Switching to a language-specific KB
B. Calling a separate `/translate` endpoint
C. **Prepending `Respond in {language}: ` to the user's query — the LLM handles translation as part of generation**
D. Setting a `lang` parameter on the `/ask` body

---

### 19. The `answer_json_schema` body parameter on `/ask` requires that every `object` schema include:

A. `strict: true`
B. **`additionalProperties: false` (at every nesting level)**
C. `$schema: "draft-2020-12"`
D. `mode: "structured"`

---

### 20. The Sample ARAG App's `askForJson` wrapper falls back through three response shapes. They are, in order:

A. Stream → sync → error
B. **`data.answer_json` → `data.item.object` → text response with regex JSON extraction**
C. JSON → XML → plain text
D. Schema-validated → unvalidated → null

---

### 21. The mixed-shape schema pattern (e.g., exam with MC + free-text questions in one array) is "schema permissive, code strict" — meaning:

A. The schema is loosely typed, and code adds runtime type checks
B. **All fields are marked `required` at the schema level; code-side validation filters rows by `questionType` after the response arrives**
C. The schema disables `additionalProperties: false`
D. The schema uses `anyOf` to permit multiple shapes

---

### 22. When implementing composite RAG (Recipe 1 — retry on low citations), the maximum recommended retry depth is:

A. Unlimited; let the model decide when it's done
B. **1 retry — fire the augmented re-ask once; if still thin, return what you have**
C. 5 retries
D. As many retries as needed to cross the confidence threshold

---

### 23. The "data-augmentation filter" used in every ARAG graph query is:

A. `{ "prop": "verified" }`
B. **`{ "prop": "generated", "by": "data-augmentation" }`**
C. `{ "filter": "manual" }`
D. `{ "source": "agent" }`

---

### 24. To bridge a clicked graph entity to "documents discussing this entity," the correct API call is:

A. `/graph` with `prop: 'resource'`
B. `/catalog` with the entity name as the filter
C. **`/find` with `features: ['keyword', 'semantic']` (hybrid retrieval) using the entity value as query**
D. A second `/graph` call with `traversal: 'documents'`

---

### 25. The default rate limit on an ARAG service account is:

A. 600 req/min
B. 1200 req/min
C. **2400 req/min**
D. Unlimited

---

## Section C — Decisions & Trade-offs (10 questions)

### 26. A customer wants different chat experiences for prospects vs members. The right Tier 2 architecture is:

A. Two KBs, route by user auth state
B. One KB, two LLM endpoints
C. **One KB, two prompt configurations, route by user state in the front-end**
D. Two ARAG service accounts

---

### 27. When the next consumer of an AI-generated output is *code* (a UI, an API, another ARAG call), the right pattern is:

A. Streaming with regex JSON extraction
B. **`askForJson` with an `answer_json_schema`**
C. Free-form `/ask` with markdown rendering
D. `/find` followed by client-side formatting

---

### 28. When the next consumer is code BUT the user needs streaming feedback during generation (e.g., live grading panel), the right pattern is:

A. Switch to a faster LLM
B. **Streaming `/ask` with a JSON-strict system prompt and regex extraction in the client**
C. Pre-compute everything in sync mode and replay it as a fake stream
D. `askForJson` always — streaming is never worth the complexity

---

### 29. A customer wants the AI to "look in adjacent topics when the first answer is thin." The right framing is:

A. "You need a bigger model."
B. "You need to re-ingest your corpus with bigger chunks."
C. **"This is composite RAG — Recipe 1, retry on low citations. We design it into the workflow; every step is logged for audit."**
D. "You need a custom fine-tune."

---

### 30. A pharma customer asks: "Which investigators have run trials on COMPOUND-X *and* COMPOUND-Y, sorted by recency?" This is:

A. A single-shot `/ask` problem
B. A `/find` with hybrid retrieval problem
C. A schema-constrained generation problem
D. **A graph traversal problem — INVESTIGATOR connected to both COMPOUNDs via `tested_in` TRIAL paths, then sorted by TRIAL.date**

---

### 31. A customer's compliance team requires "all customer data and the LLM generating answers stay within EU jurisdiction." The right architecture is:

A. EU KB + Nuclia-default LLM (which is automatically EU-routed)
B. **EU KB + BYO-LLM endpoint pointed at the customer's own EU-region Azure / Vertex / Bedrock tenant**
C. US KB + EU LLM (cross-region permits this)
D. Two KBs in EU, sharded for load

---

### 32. A customer says: "We already have a Neo4j cluster with 12M curated relationships. Why ARAG's graph?" The right reframe is:

A. ARAG's graph is faster than Neo4j.
B. Neo4j can't handle 12M relationships at query time.
C. **ARAG's graph is extracted from your unstructured content by a custom agent — capturing relationships your curated Neo4j doesn't have. They coexist; most customers run both.**
D. You'll save infrastructure costs by deprecating Neo4j.

---

### 33. The trade-off cost of using composite RAG (Recipe 1) vs single-shot is approximately:

A. The same
B. **2x LLM tokens, 1.5–2x end-user latency**
C. 0.5x cost (composite is cheaper due to caching)
D. 5–10x cost

---

### 34. Composite RAG should be applied:

A. To every query
B. **Selectively — to the queries where single-shot demonstrably under-performs (typically 10–30% of queries, identified by low citation count / low top-citation confidence)**
C. Only at Tier 4
D. Only for streaming responses

---

### 35. A customer's CTO objects: "BYO-LLM sounds good but our security team needs to audit every LLM call." The right response is:

A. "Nuclia exports its own LLM audit log to your team."
B. "BYO-LLM forces all calls through your tenant's logging; nothing routes through Nuclia."
C. **"BYO-LLM points the KB at your own Azure / Vertex / Bedrock tenant. LLM calls go through your tenant's logging and audit. ARAG handles retrieval; you control everything downstream."**
D. "You'll need a Tier 4 contract for security audit access."

---

## Section D — Sales-readiness (5 questions)

### 36. A customer says "we want a chatbot." Your *correct* response is:

A. "Yes — we'll deploy that today via the widget library."
B. **"Yes — but ARAG isn't 'a chatbot,' it's a platform. A chatbot is one of five surfaces we'll likely build for you. Let's scope all five."**
C. "Yes — that's $30K for the integration."
D. "Yes — and we'll need 6 months for delivery."

---

### 37. Pitching ARAG as "ChatGPT for your data" caps deal sizes at approximately:

A. $20K
B. **$80K**
C. $250K
D. $1M

---

### 38. A partner whose individual reps lack Developer Foundations Practitioner certs cannot:

A. Run sandbox demos
B. **Reach Authorized tier with the partner organisation (and therefore cannot access MDF or premier margin)**
C. Use the Sample ARAG App
D. Receive customer leads

---

### 39. The recurring-revenue lever that the Advanced course's Build 5 (Custom Field Engineering) unlocks is:

A. Tuning retainers (quarterly, $15–40K)
B. Mission-critical SLA support
C. **Content-engineering retainers ($5–15K / month per customer, ongoing) — designing callToAction / searchResultDisplay / videoInfo fields and training the customer's content team to maintain them**
D. Re-ingestion-as-a-service

---

### 40. After a partner completes Developer Foundations Practitioner + AE&RS Specialist + ships a customer capstone, the natural next commercial conversation is:

A. Customer support contracts
B. **A quarterly tuning retainer ($15–40K per customer per quarter) using the AE&RS Build 9 tuning-report template as the deliverable**
C. A re-implementation discount
D. A reseller contract

---

## Section E — Short answer (5 questions)

Each answer must be 3–5 sentences. Pass = 3 of 5 with credible reasoning.

### 41. Explain why a customer asking "we already use ChatGPT, why pay for ARAG?" is *not* a question about the LLM. What is it actually asking, and how do you reframe it in 3 sentences?

---

### 42. A customer ingested 200,000 documents and is hitting the 2400 req/min rate limit during peak hours. Describe the four-step mitigation path you scope before opening a rate-limit-increase ticket with Progress support.

---

### 43. Walk through the four reasons a partner should never expose service-account JWTs in client-side code in production. Describe the alternative architecture.

---

### 44. A CMO asks: "How does ARAG let us improve answer quality on our customer-facing chatbot *without* asking my engineering team for a sprint cycle?" Describe the field-engineered CTA / searchResultDisplay loop as the answer.

---

### 45. A CTO asks: "If I sign with you and then realise in 2 years I want to switch to OpenAI's enterprise platform, how locked-in am I?" Give the honest 4-sentence answer that wins the deal *and* survives the post-contract reality.

---

## Grading rubric (for reviewers)

### Multiple choice (Sections A–D)
- 32 of 40 correct → **Pass**
- 28–31 correct → **Re-take** after a week of remediation
- < 28 correct → **Re-do the corresponding Build(s)** based on which sections failed

### Short answer (Section E)
- 3 of 5 credible → **Pass**
- 2 of 5 → re-write the failed answers with mentor guidance
- < 2 of 5 → re-take after re-reading the relevant lessons

### Section weighting if disputed
- Concepts (A) wrong is concerning — re-read framework Parts I–III.
- Implementation (B) wrong means the partner won't ship correctly — re-do the relevant Build walkthrough.
- Decisions (C) wrong means the partner will scope customer engagements wrongly — pair with a Progress Solution lead for the next deal.
- Sales-readiness (D) wrong means the partner will cap deal sizes — pair with a partner manager for a discovery session.
- Short answer (E) gaps reveal where commercial mental-model framing is weak — direct remediation by partner manager.

---

## Answer key (MC)

1. B • 2. B • 3. B • 4. C • 5. D • 6. B • 7. B • 8. C • 9. B • 10. C
11. B • 12. C • 13. B • 14. C • 15. B • 16. B • 17. C • 18. C • 19. B • 20. B
21. B • 22. B • 23. B • 24. C • 25. C • 26. C • 27. B • 28. B • 29. C • 30. D
31. B • 32. C • 33. B • 34. B • 35. C • 36. B • 37. B • 38. B • 39. C • 40. B

---

## What happens when you pass

1. The Progress Solution lead countersigns your exam result.
2. You're cleared to start the [Build 7 capstone](builds/build-7-capstone/) — pick your variant ([Atlas Operations](builds/build-7-capstone/atlas-operations/) for enterprise / operations buyers, [Aurora Concierge](builds/build-7-capstone/aurora-concierge/) for CX / digital buyers).
3. Your 12-month cert clock starts. **Developer Foundations Practitioner** is awarded on capstone delivery + review-board pass.
4. Your partner organisation becomes eligible for Authorized tier (assuming at least one of each track has passed).

## What happens if you don't

1. Identify which section(s) you failed.
2. Re-read the corresponding Build lesson(s) and walkthrough(s).
3. Re-take the failing Builds' quick quizzes for refresher practice.
4. Schedule a 30-minute office hour with a Progress Solution lead for the topics that gave you the most trouble.
5. Re-sit the exam after 7 days.

The exam is not designed to be hard for a partner who's actually done all 7 Builds. It *is* designed to be impossible for a partner who watched videos without building. That's intentional.
