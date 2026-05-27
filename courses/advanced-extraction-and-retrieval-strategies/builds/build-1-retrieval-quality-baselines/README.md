# Build 1 — Retrieval Quality Baselines & Metrics

> Part of [Advanced Extraction & Retrieval Strategies](../../README.md) — the AE&RS Specialist course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).
>
> **Why this is Build 1:** Every subsequent build in this course is judged against measurable lift from this build's baseline. No baseline, no Build 2.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Prerequisite** | Developer Foundations Practitioner cert |
| **Estimated effort** | 10–14 hours focused |

## What the partner does

Builds a retrieval-quality measurement harness for the partner's KB. Computes precision@k, recall@k, MRR (mean reciprocal rank), nDCG, hit-rate, and end-to-end citation-rate. Designs a 30–60-query golden set with difficulty tagging (easy/medium/hard) and known-good resource IDs. Where the KB spans multiple content domains (via labelsets), the golden set must sample queries that exercise at least 3 content types or labelset values. Captures a baseline before any tuning happens.

## Pass rubric

1. Harness runnable on demand against the KB.
2. Golden set of 30+ queries committed with expected resource IDs and difficulty tags.
3. At least 3 content-type or labelset value sub-baselines computed (to spot retrieval gaps that hide in cross-domain averages).
4. Both retrieval-only (`/find`) and end-to-end (`/ask`) metrics captured.
5. Noise threshold defined (how much lift counts as real).

## Asset delivered

Eval-harness template (TypeScript or Python) + golden-set markdown template + scoreboard layout.

## Reference reading

- ARAKS RP-002 (RAG Evaluation Methods, ARAKS RAGAS-compatible scoring framework). Lives at `Sample-ARAG-App/knowledge-base/kb-member-knowledge/research/rp-002-evaluation-methods.md`.

---

## Workspace

This folder is the working space for everything supporting Build 1. Drop materials here as they are built:

- `walkthrough.md` — metric definitions + harness design walkthrough
- `harness/` — eval-harness template (TS + Python variants)
- `golden-set-template.md` — the golden-set markdown format
- `scoreboard.md` — sample scoreboard with sub-baseline breakdown
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Advanced Extraction & Retrieval Strategies](../../README.md)
- Next build: [Build 2 — Chunking strategy design](../build-2-chunking-strategy-design/)
