# Build 5 — Typed knowledge graph & data augmentation agents

> Part of [Developer Foundations](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 4 |
| **Prerequisite** | [Build 4 — Composite RAG](../build-4-composite-rag/) |
| **Estimated effort** | 12–16 hours focused |

## Start here

Work through the three course-material files for this Build in order:

1. **[lesson.md](lesson.md)** — concepts, ARAG patterns, why this Build matters. Read first.
2. **[walkthrough.md](walkthrough.md)** — step-by-step build instructions with code and verification checklist.
3. **[quiz.md](quiz.md)** — 8 MC + 1 short answer; pass = 7/8 + credible short answer.

The rest of this README is a quick-reference summary. The full content lives in the three files above.

---

## What the partner does

Designs a bespoke entity/relation schema for the partner's domain (e.g., LEGAL: PARTY/MATTER/JURISDICTION/STATUTE/JUDGE; or PHARMA: COMPOUND/TARGET/TRIAL/PI). Configures a data-augmentation agent to extract that schema. Ships a graph navigation UI that filters to `{prop:'generated', by:'data-augmentation'}`, supports fuzzy entity search, undirected path traversal, and incremental in-place graph expansion. Wires entity-to-resources lookup using hybrid `features:['keyword','semantic']`.

## Pass rubric

1. A typed schema of at least 8 entity types and 8 relation types committed and documented.
2. Graph queries return clean results (no NER noise, no GUID-shaped values).
3. Click-to-expand graph traversal working end-to-end.
4. Recorded demo answering a customer question that *cannot* be answered by single-shot retrieval — only by traversing the graph.

## Asset delivered

A graph schema design template (12 worked vertical examples — legal, pharma, financial services, film production, compliance, etc.).

**Reference:** `Sample-ARAG-App/src/lib/graphApi.ts`, `graphConstants.ts`, and `pages/KnowledgeGraphPage.tsx`.

> The [Advanced Extraction & Retrieval Strategies course](../../../advanced-extraction-and-retrieval-strategies/README.md) goes much deeper on agent design at its [Build 6](../../../advanced-extraction-and-retrieval-strategies/builds/build-6-data-augmentation-agents/) — covering precision/coverage measurement, schema evolution, and per-vertical observability.

---

## Workspace

This folder is the working space for everything supporting Build 5. Drop materials here as they are built:

- `walkthrough.md` — graph schema design walkthrough
- `schemas/` — 12 worked vertical examples (legal, pharma, fin-svcs, healthcare, public-sector, retail, media, manufacturing, education, energy, film-production, compliance)
- `agent-config/` — sample data-augmentation agent configuration
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Developer Foundations](../../README.md)
- Previous build: [Build 4 — Composite RAG](../build-4-composite-rag/)
- Next build: [Build 6 — Production readiness](../build-6-production-readiness/)
- Deeper treatment: [Advanced Build 6 — Data-augmentation agents at depth](../../../advanced-extraction-and-retrieval-strategies/builds/build-6-data-augmentation-agents/)
