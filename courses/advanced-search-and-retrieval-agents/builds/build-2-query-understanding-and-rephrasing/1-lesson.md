# Build 2 — Lesson: Query Understanding & Rephrasing

> Read time: 14 minutes. Companion to the 10-minute [video](video-script.md).

## Why partners learn this

The single most common production complaint from ARAG customers is *"the search doesn't understand us."* It's almost never an embedding-model problem and almost never a chunking problem. It's a **query understanding** problem — the user's question doesn't match the corpus's vocabulary, and the platform's default rephraser either over-corrects (paraphrasing away vertical-specific terms) or under-corrects (failing to bridge synonyms).

This Build is the cure. By the end the partner has a custom rephraser prompt, a query-archetype catalogue, and a query-expansion harness — every one of which is something the partner can re-use across customer engagements without re-thinking.

## What ARAG does by default

When you POST to `/ask` (or `/find` with the right flag), the platform:

1. Receives the user's raw query.
2. (Optionally) rephrases it — runs the query through an LLM with a built-in prompt that produces a *retrieval-optimised* version. The default prompt biases toward paraphrasing and synonym substitution.
3. Embeds the rephrased query.
4. Retrieves against the embedded query.
5. Generates the answer using the rephrased query as the LLM context.

The rephrase step is the one you'll tune. By default it's on. By default the prompt is generic. By default it assumes English-language consumer-grade questions.

## The four query archetypes

Every customer query falls into one of four shapes. Each shape rewards a different rephrasing strategy.

### Factoid

*"What's the warranty length on the Aurora TerraTrek 7?"*

Single fact. The user typed the right entity name. Rephrasing risks losing the entity. **Strategy:** rephrase off, or rephrase with a *"preserve entity names verbatim"* directive.

### Navigational

*"Aurora returns policy"*

The user knows what they want, often the document title. Rephrasing typically over-paraphrases (*"Aurora returns policy"* → *"information about returns at Aurora Outfitters"*) and drags retrieval away from the exact document. **Strategy:** rephrase off, or treat the query as a keyword search.

### Conceptual

*"What's your stance on environmental sustainability?"*

The user is asking about a theme, not a specific fact. The corpus probably doesn't use the user's phrasing verbatim. **Strategy:** rephrase on, default prompt is usually fine; query expansion helps.

### Exploratory

*"Tell me about your gear philosophy."*

Open-ended. The user doesn't know what's in the corpus. The right answer might span 5–10 documents. **Strategy:** rephrase on, expand aggressively, increase page_size.

The first deliverable from this Build is the **query-archetype catalogue** — a markdown doc with each archetype, a definition, sample queries, and the recommended rephrasing strategy. Re-use it across every customer engagement.

## Why the default rephraser hurts in vertical scenarios

The default rephraser is trained on consumer queries. It generalises. Consider:

- *"Does our process comply with GDPR Art. 17?"* — default rephraser might rewrite to *"Does our process follow the data deletion rules?"* The retrieval is now hunting for *"data deletion"* paragraphs and missing the *"GDPR Art. 17"* citations the corpus has.
- *"How does Apixaban interact with Warfarin?"* — default rephraser might rewrite to *"Drug interactions between blood thinners."* Recall goes up; precision goes through the floor.
- *"What's the lead time on the Atlas E-220 motor?"* — default might rewrite to *"How long until I can get the motor."* The SKU is gone; retrieval misses.

The fix is a **custom rephraser prompt** with explicit instructions:

```
Rephrase the user's question to improve retrieval against a corpus
containing technical documents in the {domain}.

Preserve verbatim:
- All product names (especially SKUs and model numbers).
- All citation references (e.g. "GDPR Art. 17", "ISO 9001 §4.2").
- All proper nouns of regulated entities or compounds.

Improve:
- Paraphrase casual phrasing into terminology the corpus is likely
  to use.
- Expand acronyms only if the expansion improves retrieval (don't
  expand acronyms the corpus uses verbatim).
- Add synonym candidates only when the user's phrasing is informal.

Return only the rephrased question, no explanation.
```

The `{domain}` slot is what gets customised per customer. For pharma, *"pharmaceutical literature"*. For policy, *"government regulation"*. For e-commerce, *"product catalog"*.

This prompt template — with its preserve / improve directives and its domain slot — is the second deliverable from this Build.

## Query expansion strategies

Beyond rephrasing, there are three query expansion strategies worth knowing:

### Synonym expansion

Generate 2–3 synonyms of the user's query, retrieve against all of them, merge the results. Improves recall on conceptual queries.

### Acronym expansion

If the user typed an acronym (CRM, AML, KYC), expand to *"CRM (Customer Relationship Management)"* — both forms search together. Improves recall when the corpus uses one form and the user typed the other.

### HyDE — Hypothetical Document Embeddings

Generate a *hypothetical answer* to the question with an LLM, embed *that*, and retrieve. The hypothetical answer is closer in embedding space to the actual answer than the question is. (Research term: *HyDE*. See arxiv.)

Each strategy has measurable lift on some archetypes and measurable hurt on others. The third deliverable from this Build is the **expansion experiment harness** — code that runs each strategy and measures per-archetype lift against the Build 1 baseline.

## What you'll do in the walkthrough

1. Tag your test query set with archetypes.
2. Run rephrasing on / off and measure per-archetype lift.
3. Write the custom rephraser prompt and deploy it.
4. Run the expansion experiment harness against synonym, acronym, and HyDE strategies.
5. Tabulate per-archetype recommendations.
6. Defend the recommendations against a customer scenario.

## Reference reading

- **[`/ask` parameter reference §5 — Query understanding](../../assets/ask-parameter-reference.md#5-query-understanding)** — the `rephrase`, `rephrase_prompt`, and `autofilter` parameters in full.
- HyDE paper: arxiv "Precise Zero-Shot Dense Retrieval without Relevance Labels" (Gao et al.).
- Foundations Build 7 — *Smart Filters* — for the relationship between rephrasing and filter semantics.
