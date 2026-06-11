# Build 10 — Composite RAG

> Part of [Developer Foundations](../../README.md).
>
> The bridge from "RAG implementation" to "agentic system."

## At a glance

| | |
|---|---|
| **Capability** | Chain ARAG calls — retry-on-low-citations, retrieve-then-rerank, multi-pass synthesis |
| **Tier mapped to** | Tier 3–4 bridge |
| **Prerequisite** | [Build 8](../build-09-field-engineering/) |
| **Estimated effort** | 2.5 hours focused |

## Start here

1. **[lesson.md](1-lesson.md)** — generate → evaluate → augment recipe; agentic boundary.
2. **[walkthrough.md](2-walkthrough.md)** — vibe-code a retry-on-low-citations flow.
3. **[quiz.md](3-quiz.md)** — 5 MC + 1 short answer.

## What you can do after this Build

- Recognise when single-shot RAG isn't enough (low citation count or low confidence).
- Vibe-code a composite pipeline that retries with augmented context.
- Quantify the latency + cost trade-off for composite RAG.
- Articulate the boundary between "composite RAG" and "agentic" to a customer's CTO.

## See also

- Previous: [Build 8](../build-09-field-engineering/)
- Next: [Build 11 — Production Readiness](../build-11-production-readiness/)
