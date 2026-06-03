# Build 3 — Hybrid Retrieval Tuning

> Part of [Advanced Extraction & Retrieval Strategies](../../README.md) — the AE&RS Specialist course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Prerequisite** | [Build 2 — Chunking strategy design](../build-2-chunking-strategy-design/) |
| **Estimated effort** | 8–12 hours focused |

## What the partner does

A/B tests dense-only vs keyword-only vs `features:['keyword','semantic']` hybrid against the Build 1 golden set. Builds a decision matrix mapping query archetypes (named-entity / conceptual / mixed / quantitative / temporal) to recommended retrieval mode. Wires hybrid into at least one production code path. Practises filter composition: stacking content-type filters (`/icon/video`, `/icon/application/pdf`), label classification filters (`/classification.labels/{labelset}/{label}`), and free filters.

## Pass rubric

1. A/B comparison for 3+ query archetypes with measured outcomes.
2. Decision matrix documented and tested.
3. At least one production code path migrated to hybrid with measured lift.
4. Filter composition working with 3+ stacked filters.
5. Score normalisation strategy documented (how to compare keyword scores to semantic scores).
6. Live demo explaining when to recommend hybrid (and when single-mode is enough).

## Asset delivered

Hybrid-retrieval decision matrix template + A/B test runner extending Build 1's harness.

## Workspace

This folder is the working space for everything supporting Build 3. Drop materials here as they are built:

- `walkthrough.md` — hybrid retrieval theory + tuning walkthrough
- `decision-matrix.md` — query-archetype → retrieval-mode mapping
- `ab-runner/` — code extending Build 1's harness for hybrid A/Bs
- `filter-composition/` — worked examples stacking filters
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Advanced Extraction & Retrieval Strategies](../../README.md)
- Previous build: [Build 2 — Chunking strategy design](../build-2-chunking-strategy-design/)
- Next build: [Build 4 — Custom labelsets & classifiers](../build-4-custom-labelsets-classifiers/)
