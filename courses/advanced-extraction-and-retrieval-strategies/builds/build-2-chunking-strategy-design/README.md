# Build 2 — Chunking Strategy Design

> Part of [Advanced Extraction & Retrieval Strategies](../../README.md) — the AE&RS Specialist course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Should), Deliver (Must) |
| **Prerequisite** | [Build 1 — Retrieval quality baselines](../build-1-retrieval-quality-baselines/) |
| **Estimated effort** | 8–12 hours focused |

## What the partner does

Designs and deploys per-content-type chunking strategies. Compares fixed-size, semantic, structure-aware (markdown header-based, PDF section-based, transcript speaker-turn-based), and sliding-window approaches. A/B tests against the Build 1 baseline. Documents a chunking decision tree.

## Pass rubric

1. Chunking spec doc for 3 distinct content types (e.g. PDF, markdown, video transcript).
2. A/B comparisons with measured retrieval lift from the Build 1 harness.
3. Decision tree: when to recommend each chunking strategy.
4. Recorded explanation

## Asset delivered

Chunking spec template + per-content-type decision tree.

## Reference reading

- Lives at.

---

## Workspace

This folder is the working space for everything supporting Build 2. Drop materials here as they are built:

- `walkthrough.md` — chunking strategy walkthrough per content type
- `spec-template.md` — chunking spec template
- `decision-tree.md` — per-content-type decision tree
- `ab-runner/` — code extending Build 1's harness for chunking A/Bs
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Advanced Extraction & Retrieval Strategies](../../README.md)
- Previous build: [Build 1 — Retrieval quality baselines](../build-1-retrieval-quality-baselines/)
- Next build: [Build 3 — Hybrid retrieval tuning](../build-3-hybrid-retrieval-tuning/)
