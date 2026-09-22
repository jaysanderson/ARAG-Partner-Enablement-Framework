# Build 04 — Visual RAG & Images

> Part of [Search Configuration & Widget Deployment](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Capability** | `rag_images_strategies` — `page_image` and `paragraph_image` — for when the answer lives in a diagram or photo, not the surrounding text |
| **Tier mapped to** | Tier 3–4 |
| **Prerequisite** | [Build 03 — RAG Context Strategies](../build-03-rag-context-strategies/) |
| **Estimated effort** | 2 hours focused |

## Start here

1. **[lesson.md](1-lesson.md)** — `page_image` vs `paragraph_image`, `useImages`/`imageUsage`, and when text-only `rag_strategies` (Build 03) genuinely can't answer the question.
2. **[walkthrough.md](2-walkthrough.md)** — ingest two real multi-page PDFs built for this exercise and compare answers with and without image strategies enabled.
3. **[quiz.md](3-quiz.md)** — 5 multiple-choice.

## What you can do after this Build

- Explain the difference between `page_image` and `paragraph_image` and pick the right one for a given document layout.
- Recognise when a question genuinely needs image context — a diagram, a map, a labeled part — versus when better text `rag_strategies` (Build 03) would have been enough.
- Configure `useImages`/`imageUsage` and demonstrate a citation resolving to an embedded image, not text.

## See also

- Parent: [Search Configuration & Widget Deployment](../../README.md)
- Corpus: `content_type/spec_sheet/` in the [Build 0 corpus](../../../developer-foundations/builds/build-00-hello-arag/corpus/) — two PDFs with genuine embedded images, built for this Build
- Previous: [Build 03 — RAG Context Strategies](../build-03-rag-context-strategies/)
- Next: [Build 05 — Result Display & User Intent Routing](../build-05-result-display-and-intent-routing/)
