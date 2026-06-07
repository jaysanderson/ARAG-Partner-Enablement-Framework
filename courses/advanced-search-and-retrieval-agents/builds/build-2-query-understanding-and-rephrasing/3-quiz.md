# Build 2 — Quick Quiz: Query Understanding & Rephrasing

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. A user types `"What's the warranty on the Aurora TerraTrek 7?"` Your default rephraser rewrites it to `"How long does Aurora's warranty last on their hiking boots?"` What's wrong?

A. Nothing — the rephrasing is more natural.
B. The SKU-grade entity (*"Aurora TerraTrek 7"*) was lost, dragging retrieval to generic hiking-boot results.
C. The rephrasing is too short.
D. ARAG doesn't support custom rephrasing.

---

### 2. Which query archetype is *most* likely to benefit from HyDE (Hypothetical Document Embeddings)?

A. Factoid — *"What's the warranty length?"*
B. Navigational — *"Aurora returns policy"*
C. Conceptual / exploratory — *"Tell me about your gear philosophy"*
D. All archetypes equally.

---

### 3. Your custom rephraser prompt should explicitly tell the LLM to preserve:

A. All proper nouns of regulated entities, SKUs, and citation references (e.g. *"GDPR Art. 17"*).
B. Nothing — the LLM knows best.
C. The exact user wording — never rephrase.
D. Only English-language terms.

---

### 4. You measure rephrase-on vs rephrase-off A/B. On factoid queries, rephrase-off has slightly better citation density and the same rank-of-first-correct-source. What's the recommendation?

A. Keep rephrasing on — it doesn't hurt.
B. Turn rephrasing off for factoid queries, or use a custom prompt that preserves entity names.
C. Switch to a different embedding model.
D. The measurement is wrong; re-run with more queries.

---

### 5. Which of these is *not* a query-expansion strategy?

A. Synonym expansion — generate 2 synonyms, retrieve against all, merge.
B. Acronym expansion — detect acronyms, expand to full form.
C. HyDE — generate a hypothetical answer, embed *that*, retrieve.
D. Reranker substitution — replace the platform's reranker with a custom one.

---

## Answer key

1. **B** — the entity name is the strongest retrieval signal for a factoid; rephrasing that loses it is a measurable hit. The cure is a custom rephraser prompt with verbatim-preserve directives.

2. **C** — conceptual / exploratory queries are precisely where HyDE earns its keep. The hypothetical-answer embedding lands in the right neighbourhood; the factoid query already does.

3. **A** — explicit preserve directives are the differentiator. Without them the default rephraser paraphrases away the highest-signal tokens.

4. **B** — when rephrase-off matches or beats rephrase-on on factoids, the right move is to skip rephrasing for that archetype (or write a custom prompt). Universal rephrasing wastes lift on archetypes that don't need it.

5. **D** — reranker substitution is covered in Build 4 (Reranking Strategies). It's a separate lever from query expansion.

---

4+ correct → pass. Continue to [Build 3 — Filter Composition at Depth](../build-3-filter-composition-at-depth/).
