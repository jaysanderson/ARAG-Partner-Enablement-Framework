# Build 5 — Quick Quiz: Knowledge graph & data-augmentation agents

> 8 questions + 1 short answer. Open-book. Pass = 7/8 + a credible short answer.

---

### 1. The single most important filter in every ARAG graph query is:

A. `{ "prop": "verified" }`
B. **`{ "prop": "generated", "by": "data-augmentation" }`**
C. `{ "prop": "indexed", "after": "2024-01-01" }`
D. `{ "prop": "source", "type": "manual" }`

---

### 2. ARAG also extracts a default NER (named-entity recognition) layer with types like DATE, ORG, PERSON, MONEY, GPE. What should you do with these in your customer-facing graph view?

A. Display alongside your domain entities for completeness
B. **Filter them out — they're noise; client-side filtering plus the `by: 'data-augmentation'` filter excludes them**
C. Use them as fallback when domain entities aren't found
D. Map them to your domain types via a lookup table

---

### 3. A good ARAG knowledge graph has roughly:

A. 1–3 entity types and 1–3 relation types
B. **8–15 entity types and 8–15 relation types**
C. 50+ entity types covering every noun in the corpus
D. As many types as the LLM identifies during ingest

---

### 4. The `undirected: true` parameter on a graph path query does what?

A. Returns paths in random order
B. Excludes paths that haven't been verified
C. **Returns paths in both directions from the source entity (incoming + outgoing)**
D. Bypasses the data-augmentation filter

---

### 5. To bridge a clicked graph entity to "documents discussing this entity," the correct API call is:

A. A second `/graph` query with `prop: 'resource'`
B. A `/find` query on the entity value using semantic mode only
C. **A `/find` query on the entity value with `features: ['keyword', 'semantic']` (hybrid retrieval)**
D. A `/catalog` query filtered by the entity name

---

### 6. Why does  still apply client-side `isExcludedNode` filtering *in addition to* the `by: 'data-augmentation'` server-side filter?

A. The server-side filter doesn't work in EU region
B. **Belt and braces — occasional default-NER nodes and GUID-shaped values slip through; client-side filtering catches the residual**
C. Client-side filtering is faster
D. It's required for compliance auditing

---

### 7. A customer's CTO says: "We already have a Neo4j cluster. Why would we use ARAG's graph instead?" The right reframe is:

A. "ARAG's graph is faster than Neo4j."
B. "Neo4j is for relational data only; ARAG is for unstructured."
C. **"ARAG's graph is extracted *from the same content* you're already retrieving over, by a custom agent you don't have to maintain. Your Neo4j cluster is curated by hand; this one stays in sync with your documents automatically. They coexist — most customers run both."**
D. "ARAG's graph supports more relation types than Neo4j."

---

### 8. A pharma customer asks: "We want to find investigators who have run trials on COMPOUND-X *and* COMPOUND-Y, ranked by recency." What's the right architecture?

A. A single `/ask` call with a detailed prompt
B. A `/find` with hybrid retrieval on "COMPOUND-X COMPOUND-Y investigator"
C. **A graph query: find INVESTIGATOR entities connected to both COMPOUND-X and COMPOUND-Y via `tested_in` paths through TRIAL entities, then sort by TRIAL.date.**
D. A schema-constrained generation with the LLM doing the reasoning

---

## Short answer

**Q9.** A customer in financial services asks: "Our matter-management system already has 12 million case records with tagged relationships. How does ARAG's data-augmentation agent fit in — does it replace what we have, augment it, or duplicate work?" Give the 4-sentence response that wins this conversation.

> *Pass rubric:* The answer must distinguish (a) the customer's existing relational system as the canonical source of truth for known, curated relationships, (b) ARAG's data-augmentation agent as the layer that extracts *additional* relationships from *unstructured* documents that the relational system doesn't capture (case briefs, depositions, internal memos, expert reports), (c) the integration story — feed ARAG-extracted entities back to the relational system as suggested relationships pending review, or query both layers in parallel, (d) the recurring-revenue hook — the agent gets retrained as the customer's vocabulary evolves; the partner runs that. Bonus for noting the Advanced course's Build 6 covers schema evolution.

---

## Answer key

1. B • 2. B • 3. B • 4. C • 5. C • 6. B • 7. C • 8. C

7 or more correct → you've passed.

## Why these questions matter

- **Q1** is the single most important filter parameter in this entire course. Forget it and your demos collapse.
- **Q2, Q6** are the "why does my graph look like garbage" debugging reflex.
- **Q3** sets realistic expectations for schema design — partners over-engineer (50+ types) and under-engineer (4 types) about equally. Get them to 8–15.
- **Q4, Q5** are implementation reflexes used in every graph viewer you'll ship.
- **Q7** is the most common Tier 4 objection. The reframe in answer C — "they coexist" — is what closes the deal.
- **Q8** is the question that demonstrates partners can recognise graph-shaped problems vs retrieval-shaped problems. Critical for scoping customer engagements correctly.
