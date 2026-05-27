# Build 6 — Quick Quiz: Data-Augmentation Agents

> 6 multiple-choice + 1 short answer. Pass = 5/6 + credible SA.

---

### 1. ARAG's three named data-augmentation agents are:

A. Embedder, Retriever, Reranker.
B. **Generator, Labeller, Graph.**
C. Indexer, Classifier, Linker.
D. Chunker, Tagger, Mapper.

---

### 2. The customer signal *"our search isn't finding things even when the answer is clearly in the corpus"* most directly points to:

A. The Labeller agent.
B. The Graph agent.
C. **The Generator agent — vocabulary mismatch; pre-generate Q&A pairs and summaries so retrieval matches user vocabulary too.**
D. A new BYO-LLM endpoint.

---

### 3. The customer signal *"users need to filter results by content type, region, audience"* points to:

A. **The Labeller agent — design the taxonomy, populate via labelsets, expose as filter chips.**
B. The Generator agent.
C. The Graph agent.
D. The composite-RAG pattern.

---

### 4. The customer signal *"surface connections between concepts that no single document contains"* points to:

A. The Labeller agent.
B. The Generator agent.
C. **The Graph agent — extract typed entities and relations into a queryable knowledge graph.**
D. Re-indexing the corpus.

---

### 5. Data-augmentation agents are configured:

A. Globally for the entire Nuclia account.
B. **Per KB, via the dashboard or API. Each KB can have different agent configurations.**
C. Per HTTP request as a body parameter.
D. By the Nuclia ops team only.

---

### 6. The Labeller agent supports two modes:

A. Synchronous and asynchronous.
B. **Rule-based (deterministic patterns) and model-based (LLM prompt).**
C. Eager and lazy.
D. Server-side and client-side.

---

## Short answer

**Q7.** A pharma customer comes to you with three concerns: (a) "clinical trial documents use jargon our medical-affairs team doesn't know"; (b) "our 12,000 trial reports need filtering by phase, indication, regulator"; (c) "we want to find investigators who worked on both COMPOUND-X and COMPOUND-Y trials." Map each concern to the right agent in 3 sentences.

> *Pass rubric:* (a) Generator — pre-generate plain-language Q&A pairs / summaries so retrieval works against both jargon and lay vocabulary. (b) Labeller — design labelsets for phase, indication, regulator; populate via labeller; expose as filter facets. (c) Graph — extract `INVESTIGATOR`, `COMPOUND`, `TRIAL` as typed entities with `tested_in` relations; the cross-compound traversal becomes a `/graph` query. Bonus for noting that a real pharma customer needs all three configured per KB.

---

## Answer key

1. B • 2. C • 3. A • 4. C • 5. B • 6. B

5+ correct → pass. Move to [Build 7 — Smart Filters & Labelsets](../build-7-smart-filters/) where the Labeller comes alive in UI.

## Why these questions matter

- **Q1** stops you from talking about "the data-augmentation agent" as one thing. There are three.
- **Q2–Q4** are the customer-signal → agent mapping. If a partner can do this in five seconds in a discovery meeting, they scope the right engagement.
- **Q5, Q6** are operational configuration facts every Solution-track partner needs.
- **Q7** is the composition reality. Real customers usually need all three; recognising that turns a Tier 1 search engagement into a Tier 4 platform commitment.
