# Build 7 — Quick Quiz: Knowledge Graph 101

> 6 multiple-choice + 1 short answer. Pass = 5/6 + credible SA.

---

### 1. The single most important filter in every ARAG graph query is:

A. `{ "exclude_ner": true }`
B. `{ "filter": "custom" }`
C. **`{ "prop": "generated", "by": "data-augmentation" }`**
D. `{ "source": "agent" }`

---

### 2. A good ARAG entity/relation schema has roughly:

A. 3–5 entity types and 3–5 relation types
B. **8–15 entity types and 8–15 relation types**
C. 50+ entity types covering every noun in the corpus
D. As many types as the LLM identifies during extraction

---

### 3. `undirected: true` on a path query does what?

A. Returns paths in random order
B. **Returns paths in both directions from the source entity (incoming + outgoing)**
C. Bypasses the data-augmentation filter
D. Returns unranked results

---

### 4. To bridge a clicked graph entity to "documents that mention it," the right API call is:

A. A second `/graph` query with `prop: "resource"`
B. **`/find` with `features: ["keyword", "semantic"]` using the entity value as query**
C. A `/catalog` query filtered by entity name
D. A `/resource` lookup

---

### 5. A customer's CTO asks: "We have a Neo4j cluster already. Why ARAG's graph?" The right reframe is:

A. ARAG's graph is faster than Neo4j.
B. Neo4j can't handle this many nodes.
C. **ARAG's graph is extracted from your unstructured content by a custom agent — capturing relationships your curated Neo4j doesn't have. They coexist; most customers run both.**
D. ARAG's graph supports more relation types than Neo4j.

---

### 6. A pharma customer asks: "Which investigators have run trials on COMPOUND-X AND COMPOUND-Y, ranked by recency?" This is:

A. A single-shot `/ask` problem.
B. A `/find` with hybrid retrieval problem.
C. **A `/graph` traversal — INVESTIGATOR connected to both compounds via `tested_in` TRIAL paths, then sorted by TRIAL date.**
D. A schema-constrained generation problem.

---

## Short answer

**Q7.** A customer's CTO asks: "Walk me through the difference between when you'd recommend graph traversal vs schema-constrained generation vs hybrid retrieval." Three sentences each.

> *Pass rubric:* (1) Graph traversal — relationship-shaped questions (who connects to what across hops). (2) Schema-constrained generation — questions where the answer has shape (a form, a checklist, an OKR object). (3) Hybrid retrieval — content questions where named entities appear (boost keyword + semantic together to catch exact-string + paraphrase matches). Bonus for noting they often compose — graph traversal returns entity IDs; hybrid retrieval fetches the documents discussing each; schema-constrained generation formats the synthesised answer for downstream consumption.

---

## Answer key

1. C • 2. B • 3. B • 4. B • 5. C • 6. C

5+ correct → pass. Move to [Build 8](../build-8-field-engineering/).

## Why these questions matter

- **Q1** is the single most important parameter in the entire programme. Forget it and your graph demos collapse.
- **Q2** sets sane expectations for schema design. Customers will demand 30 entity types; you'll quietly cut to 12.
- **Q3, Q4** are pure pattern recognition.
- **Q5** is the Neo4j objection — the most common Tier 4 customer pushback. The coexistence framing wins every time.
- **Q6, Q7** are the composition questions. Recognising graph-shaped vs schema-shaped vs hybrid-shaped problems is the entire judgment skill of Tier 3+ engagement scoping.
