# Build 3 — Quick Quiz: Schema-constrained generation

> 8 questions + 1 short answer. Open-book. Pass = 7/8 + a credible short answer.

---

### 1. Which body parameter on `/ask` binds the LLM output to a JSON Schema?

A. `response_format`
B. `output_schema`
C. **`answer_json_schema`**
D. `json_mode`

---

### 2. Every `object` schema passed to ARAG must include:

A. `strict: true`
B. **`additionalProperties: false`** (at every nesting level)
C. `unevaluatedProperties: false`
D. `$schema: "draft-2020-12"`

---

### 3. `askForJson` wrapper falls back through three response shapes. The first shape it checks is:

A. `data.item.object`
B. **`data.answer_json`**
C. A text response with embedded JSON to regex-extract
D. `data.choices[0].message.content`

---

### 4. In the mixed-shape exam schema, `options`, `correct`, and `rubric` are all listed in `required`. Why aren't they optional?

A. ARAG doesn't support optional fields
B. **The schema is permissive on purpose — every row carries every key, and code-side validation filters by `questionType` after**
C. Optional fields cause the model to return null randomly
D. Marking them optional disables schema validation

---

### 5. When should a partner choose `askForJson` over the manual streaming-with-regex pattern?

A. When the corpus is over 1,000 documents
B. **When the next consumer is code (a UI render, an API call, another ARAG call) and streaming isn't needed**
C. When the LLM is GPT-4 or higher
D. When the customer is enterprise

---

### 6. The manual streaming-with-regex pattern is appropriate when:

A. The schema is too complex for `answer_json_schema`
B. ARAG is rate-limited and the schema path is unavailable
C. **The user needs streaming progress AND the next consumer is code (e.g., live grading panels)**
D. The LLM doesn't support function calling

---

### 7. A partner builds a `domains` taxonomy generator and the model occasionally returns the inner object directly (without the `{ domains: [...] }` wrapper). What's the right fix?

A. Switch to a different LLM
B. Add `"You must return the wrapper"` to the prompt
C. **Add a guard in code: `result.domains ?? (Array.isArray(result) ? result : [])`. Schema-permissive, code-strict.**
D. Discard the response and re-ask

---

### 8. A customer's CMO asks: "Can the AI build me a campaign brief — audience, channel mix, message hierarchy, KPI targets — as a structured document my team can edit?" What's the right answer?

A. "No, that's a chatbot use case."
B. "Yes, but you'll need a separate AI vendor for structured output."
C. **"Yes — schema-constrained generation. Define the brief shape as a JSON schema, the model fills every field, your team gets a typed object that drops into your existing tooling. This is a Tier 3 platform engagement."**
D. "Yes, but only for English content."

---

## Short answer

**Q9.** A customer says: "We want AI to generate quarterly OKRs across our 12 product lines. Each OKR needs an objective statement, three key results, an owner, a deadline, and links to supporting docs in our knowledge base." Describe — in 4–5 sentences — how you'd scope this as a Tier 3 engagement using Build 3 patterns. Mention the schema shape, the source of grounding, and where the customer's existing tools enter the picture.

> *Pass rubric:* The answer must touch on (a) defining a JSON schema for the OKR object (objective, key_results: array, owner, deadline, supporting_docs: array of {title, url}), (b) using the customer's own KB as the grounding source (ARAG retrieves supporting docs at generation time), (c) using `additionalProperties: false` and required-everything schema-permissive-code-strict pattern, (d) where the output drops into the customer's existing workflow (CMS, Asana, Jira, etc.). Bonus for naming a quarterly delivery cadence as the recurring-revenue hook.

---

## Answer key

1. C • 2. B • 3. B • 4. B • 5. B • 6. C • 7. C • 8. C

7 or more correct → you've passed Build 3, the top-priority Build for the entire programme.

## Why these questions matter

- **Q1, Q2, Q3** are the API-level facts every Tier 3 engagement starts from.
- **Q4** kills the most common partner mistake (marking only "common" fields required and getting nulls everywhere).
- **Q5, Q6** are the choice that separates good Tier 3 partners from great ones. Defaulting to the right path saves hours of debugging per engagement.
- **Q7** is the production-grade defensive coding mindset. Schema permissive, code strict. Repeat until reflex.
- **Q8** is the most important commercial question in this Build. The CMO who walks out of that meeting with a structured-output scoping doc becomes a $250K+ ACV customer. Without this question's framing, they buy from someone else who sounds more "structured."
