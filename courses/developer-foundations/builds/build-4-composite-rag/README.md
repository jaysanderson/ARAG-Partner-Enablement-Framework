# Build 4 — Composite RAG (the on-ramp to agentic)

> Part of [Developer Foundations](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Should), Deliver (Must) |
| **Tier mapped to** | Tier 3 → Tier 4 bridge |
| **Prerequisite** | [Build 3 — Schema-constrained generation](../build-3-schema-constrained-generation/) |
| **Estimated effort** | 8–10 hours focused |

## Start here

Work through the three course-material files for this Build in order:

1. **[lesson.md](lesson.md)** — concepts, ARAG patterns, why this Build matters. Read first.
2. **[walkthrough.md](walkthrough.md)** — step-by-step build instructions with code and verification checklist.
3. **[quiz.md](quiz.md)** — 8 MC + 1 short answer; pass = 7/8 + credible short answer.

The rest of this README is a quick-reference summary. The full content lives in the three files above.

---

## What the partner does

Implements "generate → evaluate citations → if low confidence, fire `/find` → synthesise augmented context → re-ask" in a real workflow. Builds at least one production pattern: study-guide-with-fallback, low-confidence-answer-retry, or multi-step research synthesis.

## Pass rubric

1. Working composite flow with measurable improvement over single-shot `/ask`.
2. Latency budget documented and within target.
3. Recorded explanation of where the boundary sits between "augmenting retrieval" and "running a true agent."

## Asset delivered

A composite-RAG cookbook with three recipes — retry-on-low-citations, multi-pass synthesis, retrieve-then-rerank.

**Reference:** `Sample-ARAG-App/src/components/certification/ExamStudyPanel.tsx` (the cleanest live example).

> The [Advanced Extraction & Retrieval Strategies course](../../../advanced-extraction-and-retrieval-strategies/README.md) goes much deeper on these patterns in its [Build 8](../../../advanced-extraction-and-retrieval-strategies/builds/build-8-composite-agentic-patterns/) with cost analysis, failure-mode taxonomy, and observability.

---

## Workspace

This folder is the working space for everything supporting Build 4. Drop materials here as they are built:

- `walkthrough.md` — composite-RAG design walkthrough
- `cookbook/` — three recipe implementations
- `slides/` — slide deck
- `verification.md` — reviewer checklist + sample A/B comparison

## See also

- Parent course: [Developer Foundations](../../README.md)
- Previous build: [Build 3 — Schema-constrained generation](../build-3-schema-constrained-generation/)
- Next build: [Build 5 — Knowledge graph & data augmentation agents](../build-5-knowledge-graph/)
- Deeper treatment: [Advanced Build 8](../../../advanced-extraction-and-retrieval-strategies/builds/build-8-composite-agentic-patterns/)
