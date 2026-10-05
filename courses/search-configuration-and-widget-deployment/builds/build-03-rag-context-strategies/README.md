# Build 03 — RAG Context Strategies

> Part of [Search Configuration & Widget Deployment](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Capability** | `rag_strategies` deep-dive: how retrieved paragraphs get turned into LLM context — `full_resource`, `hierarchy`, `neighbouring_paragraphs`, `field_extension`, `metadata_extension`, `prequeries`, `graph_beta` |
| **Tier mapped to** | Tier 3–4 |
| **Prerequisite** | [Build 02 — Prompts & Generative Answers](../build-02-prompts-and-generative-answers/) |
| **Estimated effort** | 2.5 hours focused |

## Start here

1. **[lesson.md](1-lesson.md)** — what `rag_strategies` is for, and all seven strategies: what each does, when to reach for it, and its gotcha.
2. **[walkthrough.md](2-walkthrough.md)** — compare context-construction strategies against the Aurora Outfitters corpus, build a two-field API resource for `field_extension`, and run a small knowledge-graph extraction for `graph_beta`.
3. **[quiz.md](3-quiz.md)** — 5 multiple-choice.

## What you can do after this Build

- Explain the difference between a retrieval problem (wrong or missing paragraphs — Build 01's territory) and a context-construction problem (right paragraphs, insufficient surrounding context — this Build's territory).
- Pick the correct `rag_strategies` entry for a given context problem, and explain why the wrong choice either bloats the context past the token budget or leaves the model without what it needs.
- Ingest a resource with more than one field via the API and use `field_extension` to pull a secondary field into context.
- Run a small `graph_beta` knowledge-graph extraction and ask an entity-relationship question that plain semantic search can't answer.

## See also

- Parent: [Search Configuration & Widget Deployment](../../README.md)
- Builds on: [Developer Foundations Build 8 — Knowledge Graph 101](../../../developer-foundations/builds/build-08-knowledge-graph/) (the `/graph` endpoint), [Build 9 — Field Engineering](../../../developer-foundations/builds/build-09-field-engineering/) and [Advanced Extraction & Retrieval Strategies Build 5 — Custom Field Engineering](../../../advanced-extraction-and-retrieval-strategies/builds/build-5-custom-field-engineering/) (custom fields, a different mechanism than `field_extension` — see the lesson for the distinction)
- Previous: [Build 02 — Prompts & Generative Answers](../build-02-prompts-and-generative-answers/)
- Next: [Build 04 — Visual RAG & Images](../build-04-visual-rag-and-images/)
