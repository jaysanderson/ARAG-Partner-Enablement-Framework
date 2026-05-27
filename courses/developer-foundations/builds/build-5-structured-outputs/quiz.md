# Build 5 — Quick Quiz: Structured Outputs

> 6 multiple-choice + 1 short answer. Pass = 5/6 + credible SA.

---

### 1. The body field that binds output to a JSON Schema is:

A. `output_schema`
B. **`answer_json_schema`**
C. `response_format`
D. `json_mode`

---

### 2. Every `object` schema passed to ARAG must include:

A. `strict: true`
B. **`additionalProperties: false` (at every nesting level)**
C. `$schema: "draft-2020-12"`
D. `mode: "structured"`

---

### 3. The wrapper falls back through three response shapes. The first one it checks is:

A. `data.item.object`
B. **`data.answer_json`**
C. Text response with embedded JSON to regex-extract
D. `data.choices[0].message.content`

---

### 4. In a mixed-shape schema (e.g., MC + free-text items in one array), `options`, `correct`, and `rubric` should all be:

A. Optional, so the model returns null for the inapplicable ones
B. **Required at the schema level; code-side validation filters by `questionType` after the response arrives**
C. Split into two separate schemas
D. Inferred via JSON Schema `anyOf`

---

### 5. Use `answer_json_schema` (sync) over manual streaming + regex when:

A. **The next consumer is code (UI, API, another ARAG call) and streaming progress isn't needed**
B. The corpus is large
C. The LLM is GPT-4
D. The customer is enterprise

---

### 6. A customer's CMO asks: "Can the AI build me a structured campaign brief — audience, channel mix, message hierarchy, KPI targets?" Your reframe is:

A. "No, that's a chatbot use case."
B. "Yes, but you'll need a separate vendor for structured output."
C. **"Yes — schema-constrained generation. Define the brief shape as JSON Schema; the model fills every field, your team gets a typed object that drops into your existing tooling. Tier 3 platform engagement."**
D. "Yes, but only for English content."

---

## Short answer

**Q7.** A customer wants AI to generate quarterly OKRs across 12 product lines. Each OKR has an objective statement, three key results, an owner, a deadline, and links to supporting docs in the KB. Walk through how you scope this as a Tier 3 engagement in 4 sentences.

> *Pass rubric:* (1) Define the OKR JSON Schema (objective, key_results array, owner, deadline, supporting_docs array of {title, url}). (2) Use the customer's KB as the grounding source — ARAG retrieves supporting docs at generation time. (3) Apply additionalProperties: false at every nesting level; schema-permissive-code-strict. (4) Output drops into customer's Asana/Jira/CMS via existing API — recurring revenue lives in the quarterly delivery cadence. Bonus for naming the price band ($80–250K) and the recurring tuning retainer.

---

## Answer key

1. B • 2. B • 3. B • 4. B • 5. A • 6. C

5+ correct → pass. Move to [Build 6](../build-6-smart-filters/).

## Why these questions matter

- **Q1, Q2, Q3** are pure API-level muscle memory. Every Tier 3 engagement starts here.
- **Q4** is the most-failed question in the course. Mixed-shape schemas trip everyone the first time.
- **Q5** stops you from over-engineering with streaming when sync would do.
- **Q6, Q7** are the commercial reframes that turn "AI experiment" budgets into "platform integration" budgets. Get these right and Tier 3 deals open in your pipeline.
