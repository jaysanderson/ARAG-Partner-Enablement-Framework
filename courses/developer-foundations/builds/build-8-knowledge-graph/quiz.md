# Build 8 — Quick Quiz: Knowledge Graph 101

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. The single most important filter in every ARAG graph query is:

A. `{ "exclude_ner": true }`
B. `{ "filter": "custom" }`
C. `{ "prop": "generated", "by": "data-augmentation" }`
D. `{ "source": "agent" }`

---

### 2. A good ARAG entity/relation schema has roughly:

A. 3–5 entity types and 3–5 relation types
B. 8–15 entity types and 8–15 relation types
C. 50+ entity types
D. As many types as the LLM identifies

---

### 3. `undirected: true` on a path query does what?

A. Returns paths in random order
B. Returns paths in both directions from the source
C. Bypasses the data-augmentation filter
D. Returns unranked results

---

### 4. To bridge a clicked graph entity to documents that mention it:

A. A second `/graph` query with `prop: "resource"`
B. `/find` with hybrid features using the entity value
C. A `/catalog` query filtered by entity name
D. A `/resource` lookup

---

### 5. "Which investigators ran trials on COMPOUND-X AND COMPOUND-Y?" is:

A. A single-shot `/ask` problem
B. A `/find` with hybrid retrieval problem
C. A `/graph` traversal problem
D. A schema-constrained generation problem

---

## Answer key

1. C · 2. B · 3. B · 4. B · 5. C

4+ correct → pass. Continue to [Build 9](../build-9-field-engineering/).
