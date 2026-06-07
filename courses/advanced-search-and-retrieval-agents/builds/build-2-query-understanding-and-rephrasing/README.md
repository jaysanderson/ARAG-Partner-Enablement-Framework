# Build 2 — Query Understanding & Rephrasing

> Part of [Advanced Search & Retrieval Agents](../../README.md).
>
> **Why this matters:** Customers describe failures as *"the search doesn't understand us."* The fix is rarely a new retrieval engine — it's almost always a rephrasing configuration the partner can tune in an afternoon. This Build teaches the lever.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Prerequisite** | Build 1 of this course |
| **Estimated effort** | 10–14 hours focused |

## What the partner does

A/B tests rephrasing on / off against a corpus that contains domain-specific jargon (legal, pharma, industrial, retail — partner picks one). Designs a custom rephraser prompt that preserves domain terms verbatim while still helping retrieval on conceptual queries. Documents query archetypes (factoid, navigational, transactional, exploratory) and recommends a rephrasing strategy per archetype. Tests query expansion strategies (synonym, acronym, hyponym/hypernym) and measures lift per archetype.

The query-archetype catalogue is the durable artefact. Once a partner has it written down, every customer engagement starts with *"which archetype is this customer's traffic?"* and the rephrasing recommendation follows.

## Pass rubric

1. Rephrasing on / off A/B with measured results against at least 30 queries.
2. Custom rephraser prompt deployed and proven to preserve verbatim domain terms (e.g. a SKU like `AURORA-TT7`, a regulation citation like `GDPR Art. 17`, a drug name like `Apixaban`).
3. Query-archetype catalogue with at least 4 archetypes and a per-archetype rephrasing recommendation.
4. Query-expansion experiment documented with lift numbers per archetype.
5. Live demo explaining the recommendation to a CTO-grade audience without using the words *"prompt engineering"*.

## Asset delivered

- `rephraser-prompt.md` — custom rephraser prompt template with variable slots for vertical-specific terminology.
- `query-archetypes.md` — the catalogue.
- `expansion-experiment/` — the A/B harness for expansion-strategy tests.

## Workspace

- `walkthrough.md` — implementation + reasoning.
- `rephraser-prompt.md` — the prompt artefact.
- `query-archetypes.md` — the catalogue.
- `expansion-experiment/` — harness code.
- `verification.md` — reviewer checklist.

## Reference reading

- ARAG documentation: query rephrasing configuration on `/ask` and `/predict/chat`.
- Research: query rewriting in RAG (arxiv search terms: "query rewriting RAG," "HyDE," "query expansion").

## See also

- Previous build: [Build 1 — Search Primitives Deep Dive](../build-1-search-primitives-deep-dive/)
- Next build: [Build 3 — Filter Composition at Depth](../build-3-filter-composition-at-depth/)
