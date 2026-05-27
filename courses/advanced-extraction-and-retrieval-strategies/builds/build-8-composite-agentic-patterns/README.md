# Build 8 — Composite & Agentic Retrieval Patterns

> Part of [Advanced Extraction & Retrieval Strategies](../../README.md) — the AE&RS Specialist course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).
>
> **Why this Build matters:** Developer Foundations Build 4 introduced composite RAG as the bridge to agentic. This Build productionises it with three named recipes, observability, cost analysis, and a failure-mode taxonomy. Partners ready for Tier 4 customer engagements should be sketching these patterns on whiteboards, not just demoing them.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Should), Deliver (Must) |
| **Prerequisite** | [Build 7 — Multimodal extraction](../build-7-multimodal-extraction/) + [Developer Foundations Build 4](../../../developer-foundations/builds/build-4-composite-rag/) |
| **Estimated effort** | 12–16 hours focused |

## What the partner does

Implements three composite-RAG recipes in a single test harness:

1. **Retry-on-low-citations** — `/ask` first; if citation count or confidence below threshold, fire `/find` for more context, then re-ask.
2. **Multi-pass synthesis** — initial `/ask`, extract entities/topics from the answer, traverse the graph for related concepts, re-ask with augmented context. This is the Aurora Concierge abandoned-cart pattern.
3. **Retrieve-then-rerank** — `/find` returns N candidates; a smaller LLM or scoring function reranks; pass top-K back to `/ask`.

A/B against single-shot for 20 hard queries selected from the Build 1 low-scoring tail. Documents failure modes (timeout cascades, infinite loops, citation drift) and the guards for each. Documents cost analysis (composite RAG is 2–4× the LLM token cost of single-shot; quantify when the lift justifies it).

## Pass rubric

1. All three recipes deployed and runnable.
2. A/B against single-shot on 20 hard queries with measured lift on at least 2 of 3 recipes.
3. Failure-mode handling documented and tested.
4. Cost analysis per recipe (LLM tokens, end-user latency, retrieval call volume).
5. Recorded explanation of when each recipe is appropriate vs when single-shot is enough.
6. Where the boundary sits between "augmenting retrieval" and "running a true agent" defined clearly.

## Asset delivered

Agentic-patterns cookbook + composite-flow observability template.

## Reference reading

- Sample ARAG App `src/components/certification/ExamStudyPanel.tsx:35-115` — the cleanest live example of retry-on-low-citations.
- [Aurora Concierge capstone](../../../developer-foundations/builds/build-7-capstone/aurora-concierge/) §5.5 — the multi-pass synthesis blueprint in the abandoned-cart pipeline.
- ARAKS RP-007 (Agentic RAG Patterns — multi-step reasoning, tool-use, failure-mode taxonomy).

---

## Workspace

This folder is the working space for everything supporting Build 8. Drop materials here as they are built:

- `walkthrough.md` — agentic-pattern theory + recipe walkthrough
- `cookbook.md` — agentic-patterns cookbook deliverable
- `recipes/` — three composite-RAG recipe implementations
- `observability/` — composite-flow observability template
- `cost-analysis.md` — token/latency budgets per recipe
- `failure-modes.md` — failure-mode taxonomy + guards
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Advanced Extraction & Retrieval Strategies](../../README.md)
- Previous build: [Build 7 — Multimodal extraction](../build-7-multimodal-extraction/)
- Next build: [Build 9 — Capstone: Production-grade tuning engagement](../build-9-capstone-tuning-engagement/)
- Foundational version: [Developer Foundations Build 4](../../../developer-foundations/builds/build-4-composite-rag/)
