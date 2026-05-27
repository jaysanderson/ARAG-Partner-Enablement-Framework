# Build 4 — Custom Labelsets & Classifiers

> Part of [Advanced Extraction & Retrieval Strategies](../../README.md) — the AE&RS Specialist course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Prerequisite** | [Build 3 — Hybrid retrieval tuning](../build-3-hybrid-retrieval-tuning/) |
| **Estimated effort** | 10–14 hours focused |

## What the partner does

Designs and deploys three labelsets against the partner's corpus. Each labelset has 5–9 labels (cognitive limit), maps to user intent rather than internal taxonomy, and avoids overlap. Trains classifiers (rule-based, model-based, or hybrid) to populate the labels. Wires filter composition into a production search surface using the `/classification.labels/{labelset}/{label}` filter path. Implements dynamic labelset resolution to handle scenarios where labelset names vary across customer deployments.

## Pass rubric

1. 3 labelsets designed and documented with rationale.
2. Classifiers trained and labels populated against the corpus.
3. Filter UI wired into at least one production surface.
4. Measured UX improvement (session length, click-through) vs unlabelled baseline.
5. Multi-label AND query working.
6. Per-paragraph labels demonstrated (paragraphs can carry their own classifications independent of the parent resource).

## Asset delivered

Labelset design template + classifier training guide.

## Reference reading

- Sample ARAG App `src/lib/ragApi.ts:1285-1340` (label-driven filter composition).
- Sample ARAG App `src/lib/ragApi.ts:1625-1660` (`fetchTopicLabels` — dynamic labelset resolution pattern).

---

## Workspace

This folder is the working space for everything supporting Build 4. Drop materials here as they are built:

- `walkthrough.md` — labelset design walkthrough
- `design-template.md` — labelset design template
- `classifier-training.md` — classifier training guide
- `examples/` — 6+ worked labelset examples across verticals
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Advanced Extraction & Retrieval Strategies](../../README.md)
- Previous build: [Build 3 — Hybrid retrieval tuning](../build-3-hybrid-retrieval-tuning/)
- Next build: [Build 5 — Custom field engineering](../build-5-custom-field-engineering/)
