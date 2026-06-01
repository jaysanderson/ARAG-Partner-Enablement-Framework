# Build 5 — Quick Quiz: Structured Outputs

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. Which body field binds output to a JSON Schema?

A. `output_schema`
B. `answer_json_schema`
C. `response_format`
D. `json_mode`

---

### 2. Every `object` schema passed to ARAG must include:

A. `strict: true`
B. `additionalProperties: false` at every level
C. `$schema: "draft-2020-12"`
D. `mode: "structured"`

---

### 3. The first response shape the wrapper checks is:

A. `data.item.object`
B. `data.answer_json`
C. Text with embedded JSON
D. `data.choices[0].message.content`

---

### 4. In a mixed-shape schema, optional-per-item fields should be:

A. Optional, so the model returns null
B. Required at schema level; filter in code
C. Split into two separate schemas
D. Inferred via JSON Schema `anyOf`

---

### 5. Use `answer_json_schema` over streaming + regex when:

A. The next consumer is code, not a human reader
B. The corpus is large
C. The LLM is GPT-4
D. The customer is enterprise

---

## Answer key

1. B · 2. B · 3. B · 4. B · 5. A

4+ correct → pass. Continue to [Build 6](../build-6-data-augmentation-agents/).
