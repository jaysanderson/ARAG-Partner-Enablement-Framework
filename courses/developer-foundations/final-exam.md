# Developer Foundations — Final Exam

> **Format.** 40 multiple-choice + 5 short answer. Open-book. Pass = **32/40 MC (80%) plus 3/5 short answer**.
>
> **Gate.** This exam must be passed *before* you may submit your Build 11 (Capstone Prep) plan for review-board sign-off, and before you may start the Build 12 capstone. Each Build's quick quiz was practice; this is the real assessment.
>
> **Time.** Plan ~90 minutes of focused work. No time limit — accuracy over speed.
>
> **Drawn from.** Lessons + walkthroughs + quizzes across Builds 0–10. Plus the [vibe-coding guide](vibe-coding-guide.md) and the [umbrella framework](../../README.md).
>
> **Submission.** Send your responses to `#exam-submissions`. A Progress Solution lead grades within 5 business days.

---

## Section A — Vibe-coding & mental model (8 questions)

### 1. The vibe-coding mental model in this course says:

A. The AI designs and implements; you observe.
B. **You design (which primitive, which schema, which prompt) + verify; the AI writes the code.**
C. You hand-write production code; the AI writes only demo code.
D. The AI is only used for documentation generation.

---

### 2. The single most common AI-assistant failure mode in this course is:

A. Generating overly-verbose code.
B. **Fabricating an SDK package that doesn't exist (e.g., `import { Nuclia } from 'nuclia'`).**
C. Using TypeScript instead of JavaScript.
D. Refusing to write streaming code.

---

### 3. The five ARAG primitives are:

A. Index, Search, Generate, Tune, Deploy.
B. **Retrieve, Generate, Constrain, Reason over relations, Stream & secure media.**
C. Embed, Retrieve, Generate, Validate, Audit.
D. Ingest, Index, Query, Answer, Cite.

---

### 4. The four-tier ARAG capability ladder positions Tier 1 as:

A. Custom data-augmentation agents.
B. **Grounded search + Q&A (the "feature" tier; $30–80K ACV ceiling).**
C. Multi-surface conversational intelligence.
D. Production-grade agentic platforms.

---

### 5. Tier 3 (Structured AI Workflows) is unlocked by which Build of the Foundations course?

A. Build 2 (Drop-in Widgets).
B. Build 3 (Conversational Surfaces).
C. **Build 5 (Structured Outputs / `answer_json_schema`).**
D. Build 7 (Knowledge Graph 101).

---

### 6. Strategic-account ACV ($500K–$2M, multi-year) is unlocked at:

A. Tier 1.
B. Tier 2.
C. Tier 3.
D. **Tier 4 (Agentic & Knowledge-Graph Platform).**

---

### 7. The capstone (Build 12) builds against:

A. A starter template Progress provides.
B. **8 master prompts the partner writes in Build 11, executed in sequence against an AI coding assistant.**
C. A fixed React component library Progress maintains.
D. A new ARAG SDK Progress releases for the capstone.

---

### 8. Before starting the Build 12 capstone, the gate is:

A. Approval from the customer's CTO.
B. Six months of partner tenure.
C. **Passing this final exam + a review-board sign-off on the Build 11 plan (variant + master prompts + demo arc).**
D. A Tier 1 customer signed.

---

## Section B — API surface (12 questions)

### 9. The auth header on every ARAG API request is:

A. `Authorization: Bearer <jwt>`.
B. **`X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>`.**
C. `X-API-Key: <key>`.
D. `Cookie: session=...`.

---

### 10. The streaming `/ask` response is delivered as:

A. Server-Sent Events with `event:` / `data:` lines.
B. WebSocket frames.
C. **NDJSON — one JSON object per line, each shaped `{"item": {"type": ..., ...}}`.**
D. Chunked HTML.

---

### 11. To force a synchronous (non-streaming) `/ask` response, add the request header:

A. `Accept: application/json`.
B. **`x-synchronous: true`.**
C. `streaming: false`.
D. `mode: sync`.

---

### 12. In a `/find` response, where do paragraph match scores appear?

A. Top-level `relevance`.
B. `best_matches[i].score`.
C. **`resources[id].fields[fieldId].paragraphs[paraId].score`.**
D. In a separate `/scores` endpoint.

---

### 13. The two placeholders ARAG substitutes inside `prompt.user`:

A. `${context}` and `${query}`.
B. `{{retrieval}}` and `{{question}}`.
C. **`{context}` and `{question}`.**
D. `<<context>>` and `<<question>>`.

---

### 14. To filter `/find` to PDFs only, the `filters` array contains:

A. `["pdf"]`.
B. **`["/icon/application/pdf"]`.**
C. `["mime:application/pdf"]`.
D. `["filetype:pdf"]`.

---

### 15. A label-path filter is shaped:

A. `audience=legal-team`.
B. **`/classification.labels/audience/legal-team`.**
C. `labels[audience]=legal-team`.
D. `tags:audience:legal-team`.

---

### 16. The body field that binds output to a JSON Schema is:

A. `output_schema`.
B. **`answer_json_schema`.**
C. `response_format`.
D. `json_mode`.

---

### 17. Every `object` schema must include:

A. `strict: true`.
B. **`additionalProperties: false` at every nesting level.**
C. `$schema: "draft-2020-12"`.
D. `mode: "structured"`.

---

### 18. The single most important filter on every ARAG graph query:

A. `{ "verified": true }`.
B. **`{ "prop": "generated", "by": "data-augmentation" }`.**
C. `{ "source": "agent" }`.
D. `{ "exclude_ner": true }`.

---

### 19. Hybrid retrieval is invoked by:

A. `mode: "hybrid"`.
B. **`features: ["keyword", "semantic"]` on the `/find` body.**
C. `retrieval_type: "both"`.
D. `query_strategy: "fuzzy_and_dense"`.

---

### 20. To get the labelsets configured on a KB:

A. `GET /v1/kb/{id}/metadata`.
B. **`GET /v1/kb/{id}/labelsets`.**
C. `POST /v1/kb/{id}/find` with `show=["labels"]`.
D. `POST /v1/kb/{id}/labels`.

---

## Section C — Patterns & composition (10 questions)

### 21. To serve two audiences (prospect, member) over one KB, the right architecture:

A. Two KBs routed by auth state.
B. **One KB, two prompt configurations, route by user state in the front-end.**
C. Two LLM endpoints (cheap vs premium).
D. Two ARAG service accounts.

---

### 22. The multilingual answer pattern is implemented by:

A. A separate KB per language.
B. A separate embedding model per language.
C. **A query prefix — `Respond in {language}: <user query>` — the LLM handles translation as part of generation.**
D. A `language` body parameter.

---

### 23. Composite RAG, in three words:

A. Embed, search, answer.
B. **Generate, evaluate, augment.**
C. Retrieve, rerank, return.
D. Index, augment, deploy.

---

### 24. The maximum retry depth for composite RAG (Recipe 1) is:

A. Unlimited.
B. **1 retry — fire the augmented re-ask once; if still thin, return what you have.**
C. 5 retries.
D. Until confidence > 0.9.

---

### 25. The "schema permissive, code strict" pattern says:

A. Schema is loose; code adds runtime checks.
B. **All fields marked required at the schema level; code filters by `questionType` (or similar) to prune empties after the response arrives.**
C. The schema disables `additionalProperties: false`.
D. The schema uses `anyOf` for multiple shapes.

---

### 26. Resource-scoped chat ("ask about this PDF") is implemented as:

A. A new endpoint `/ask-resource/{id}`.
B. A `filters` array restricting to one resource id.
C. **A prefix `'Regarding the resource titled "X": '` on the user query — pseudo-scoping that biases the model toward that resource.**
D. A separate per-resource KB.

---

### 27. Field-engineered CTAs (e.g., `callToAction`) work because:

A. ARAG has a special CTA-rendering API.
B. **The field is indexed as text and appears in `{context}`; the prompt instructs the model to use it; the front-end post-processes the model's `[label](url)` markdown into a branded pill.**
C. The widget library has a CTA renderer.
D. They're configured per-organisation in the dashboard.

---

### 28. The boundary between composite RAG and true agentic is:

A. Number of LLM calls.
B. **Whether the model (run-time) or the programmer (write-time) decides the next step.**
C. Latency budget.
D. Whether streaming is enabled.

---

### 29. A pharma customer asks: "Which investigators ran trials on COMPOUND-X AND COMPOUND-Y, sorted by recency?" Which ARAG primitive does this?

A. P1 (`/find`) with hybrid mode.
B. P2 (`/ask`) with a detailed prompt.
C. **P4 (`/graph`) — INVESTIGATOR connected to both compounds via `tested_in` TRIAL paths, sorted by trial date.**
D. P3 (`answer_json_schema`) with the LLM doing the reasoning.

---

### 30. A customer's CTO asks how to switch the LLM. The right action is:

A. Switch ARAG accounts.
B. Migrate to a different KB.
C. **Change the BYO-LLM endpoint setting on the existing KB — point at the customer's own Azure / Vertex / Bedrock tenant.**
D. Upgrade to a Tier 4 plan.

---

## Section D — Production & sales (10 questions)

### 31. ARAG data residency is configured:

A. Per service account.
B. Per partner organisation.
C. **Per KB, at provisioning time.**
D. Per HTTP request.

---

### 32. The default rate limit on an ARAG service account is:

A. 600 req/min.
B. 1200 req/min.
C. **2400 req/min.**
D. Unlimited.

---

### 33. The single most important production observability metric for retrieval-quality regression is:

A. p99 latency.
B. **Citation rate (% of `/ask` responses returning non-empty citations).**
C. Total request volume.
D. Average answer length.

---

### 34. Why proxy ARAG calls through the partner's (or customer's) backend in production?

A. Latency improvements.
B. Caching.
C. **The service-account JWT must never reach client-side code; the backend holds the secret.**
D. ARAG's CORS policy requires it.

---

### 35. A customer says "we want a chatbot." Your correct response is:

A. "Yes — $30K, 30-minute integration."
B. **"Yes — but ARAG isn't 'a chatbot,' it's a platform. A chatbot is one of several surfaces we'll likely build. Let's scope all of them."**
C. "Yes — but it'll take 6 months."
D. "Yes — we'll deploy the widget today."

---

### 36. Pitching ARAG as "ChatGPT for your data" caps deal sizes at approximately:

A. $20K.
B. **$80K.**
C. $250K.
D. $1M.

---

### 37. Field engineering as a partner service is best positioned as:

A. One-off implementation, $40K fixed-fee.
B. Hosting fees.
C. **A recurring $5–15K/month per customer content-engineering retainer.**
D. A percentage of conversion uplift.

---

### 38. A customer's CTO objects: "Our security team needs to audit every LLM call." The reframe:

A. "Nuclia exports its own audit log."
B. **"BYO-LLM. Point the KB at your own Azure / Vertex / Bedrock tenant. LLM calls go through *your* tenant's logging."**
C. "Tier 4 plan only."
D. "We provide a webhook for that."

---

### 39. Drop-in widgets (Build 2) are the *wrong* choice when:

A. The customer is small.
B. **The interaction needs multiple prompt voices for different audiences (Build 3 / Tier 2 territory).**
C. The corpus has under 100 documents.
D. The customer requires EU residency.

---

### 40. The advanced-cert attach rate (Developer Foundations → AE&RS Specialist) is the framework's most important indicator of:

A. Partner satisfaction.
B. Cert revenue.
C. **Whether partners are producing platform-level (Tier 3+) competency or just chatbot resellers.**
D. Course-completion rates.

---

## Section E — Short answer (5 questions)

Each answer must be 3–5 sentences. Pass = 3 of 5 with credible reasoning.

### 41. A customer asks: "we already use ChatGPT, why pay for ARAG?" Explain what they're really asking and how you reframe it in 3 sentences.

---

### 42. Walk through the 4 things every production-readiness checklist must cover, in 4 bullets.

---

### 43. A customer's CTO asks: "Where does composite RAG end and true agentic begin?" Give the 3-sentence answer that demonstrates you understand both.

---

### 44. Your AI assistant generates a Node.js script for `/ask` that uses `import { Nuclia } from 'nuclia'`. What's wrong, what's your fix, and what other failure modes should you watch for in vibe-coding? Three sentences.

---

### 45. A customer wants the AI to generate quarterly OKRs grounded in their KB. Walk through scoping this as a Build-5-style schema-constrained workflow in 4 sentences.

---

## Grading rubric (for reviewers)

### Multiple choice (Sections A–D)
- 32 of 40 correct → **Pass.**
- 28–31 correct → **Re-take** after a week of remediation.
- < 28 correct → **Re-do the corresponding Builds** based on which sections failed.

### Short answer (Section E)
- 3 of 5 credible → **Pass.**
- 2 of 5 → re-write the failed answers with mentor guidance.
- < 2 of 5 → re-take after re-reading the relevant lessons.

### Section weighting if disputed
- Section A (vibe-coding & mental model) wrong is concerning — re-read the [vibe-coding guide](vibe-coding-guide.md) and the umbrella framework.
- Section B (API surface) wrong means the partner won't ship correctly — re-do the relevant Build walkthroughs.
- Section C (patterns & composition) wrong means scoping mistakes in customer meetings — pair with a Progress SE for the next deal.
- Section D (production & sales) wrong means caps on deal sizes — pair with a partner manager.
- Section E gaps reveal weak commercial framing — direct remediation by partner manager.

---

## Answer key (MC)

1. B • 2. B • 3. B • 4. B • 5. C • 6. D • 7. B • 8. C
9. B • 10. C • 11. B • 12. C • 13. C • 14. B • 15. B • 16. B • 17. B • 18. B • 19. B • 20. B
21. B • 22. C • 23. B • 24. B • 25. B • 26. C • 27. B • 28. B • 29. C • 30. C
31. C • 32. C • 33. B • 34. C • 35. B • 36. B • 37. C • 38. B • 39. B • 40. C

---

## What happens when you pass

1. The Progress Solution lead countersigns your exam result.
2. You submit your Build 11 plan (variant choice + master prompts + demo arc) to the review board.
3. Review board signs off → you start [Build 12 — The Capstone](builds/build-12-capstone/).
4. Your 12-month cert clock starts; **Developer Foundations Practitioner** is awarded on capstone delivery + review-board defence pass.
5. Your partner organisation becomes eligible for Authorized tier.

## What happens if you don't

1. Identify which section(s) you failed.
2. Re-read the corresponding Build lessons and watch the videos.
3. Re-take the failing Builds' quick quizzes.
4. Schedule a 30-minute office hour with a Progress Solution lead.
5. Re-sit the exam after 7 days.

The exam is designed so that a partner who actually did the 12 walkthroughs can pass with breadth; a partner who watched videos without building cannot.
