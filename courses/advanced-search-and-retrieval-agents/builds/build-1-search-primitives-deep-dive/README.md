# Build 1 — Search Primitives Deep Dive

> Part of [Advanced Search & Retrieval Agents](../../README.md) — the AS&RA Specialist course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).
>
> **Why this is Build 1:** Every later Build picks one of these primitives. A partner who cannot articulate when to reach for `/find` vs `/ask` vs an agent ships the wrong shape of solution and pays the cost across every customer engagement.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Should) |
| **Prerequisite** | Developer Foundations Practitioner cert |
| **Estimated effort** | 8–12 hours focused |

## What the partner does

Builds a side-by-side comparison harness that issues the same query through every ARAG search primitive — `/find`, `/ask` (sync + streaming), `/search` (catalog), `/predict/chat`, and the Retrieval Agent endpoint — against the same Knowledge Box. Captures cost per call, latency p50/p95, citation density, structured-output support, and conversational state per primitive. Publishes a primitive-selection flowchart partners can re-use across customer scoping conversations.

The flowchart is the real deliverable — it should answer questions like:

- *"The customer wants instant search-as-you-type."* → `/find` (low latency, no LLM).
- *"The customer wants a grounded answer with citations."* → `/ask` (sync if you need the full response in one POST, streaming if you need a typewriter feel).
- *"The customer wants a hard multi-part question answered."* → Retrieval Agent (decomposition).
- *"The customer wants a catalog-style filterable result page."* → `/search` (richer per-resource metadata).
- *"The customer wants a multi-turn chat surface."* → `/predict/chat` (conversational state managed by ARAG).

## Pass rubric

1. Comparison harness committed and runnable against the partner's KB.
2. Trade-off matrix with **measured** numbers (cost / latency / citation density per primitive). No guessing — the harness must produce the matrix.
3. Primitive-selection flowchart with at least 8 decision branches.
4. Live explanation defending the recommendation for at least three customer scenarios different from the harness's test queries.
5. The flowchart is committed to the course-level `../../assets/primitive-selection.md` so every later Build can reference it.

## Asset delivered

- `harness/` — primitive-comparison harness (TypeScript + Python variants).
- `flowchart.md` (+ optional `.png` rendered version) — primitive-selection decision tree.
- `trade-off-matrix.md` — the measured comparison shipped as a markdown table.
- `slides/` — optional partner deck.

## Workspace

This folder is the working space for everything supporting Build 1. Drop materials here as they are built:

- `walkthrough.md` — narrated implementation walkthrough.
- `harness/` — harness code.
- `flowchart.md` — primitive-selection flowchart.
- `trade-off-matrix.md` — measured numbers per primitive.
- `verification.md` — reviewer checklist.

## Reference reading

- Foundations Build 1 — *Five Primitives* — the conceptual baseline this Build deepens.
- ARAG documentation: `/find`, `/ask`, `/search`, `/predict/chat`, `/retrieval-agent` endpoint references.

## See also

- Parent course: [Advanced Search & Retrieval Agents](../../README.md)
- Next build: [Build 2 — Query Understanding & Rephrasing](../build-2-query-understanding-and-rephrasing/)
