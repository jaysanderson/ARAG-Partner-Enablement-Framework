# Build 9 — Capstone: Production-Grade Tuning Engagement

> Part of [Advanced Extraction & Retrieval Strategies](../../README.md) — the AE&RS Specialist course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).
>
> **Top-priority asset.** The deliverable of this Build — the **tuning report** — is the commercial artefact partners use to sell ongoing tuning engagements to existing customers. Typical quarterly tuning retainer: $15–40K per customer per quarter. Build 9 exists to make that the default outcome of every AE&RS Specialist's first year.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Format** | Written tuning report (5–10 pages) + recorded review-board defence |
| **Prerequisite** | All prior Builds (1–8) of this course + a deployed [Developer Foundations Build 7 capstone](../../../developer-foundations/builds/build-7-capstone/) |
| **Estimated effort** | 20–30 hours focused, plus a half-day review-board defence |

## What the partner does

Picks one of the two existing capstone deployments from Developer Foundations Build 7 ([Atlas Operations](../../../developer-foundations/builds/build-7-capstone/atlas-operations/) or [Aurora Concierge](../../../developer-foundations/builds/build-7-capstone/aurora-concierge/) — whichever the partner shipped). Instruments it with the Build 1 eval harness against a 30-query golden set. Identifies the three biggest retrieval-quality gaps (with metric citations from Build 1). Proposes three improvements drawn from Builds 2–8: at minimum, one extraction-side change (Build 2 chunking or Build 7 multimodal), one retrieval-quality change (Build 3 hybrid or Build 4 labelsets), and one generation-quality change (Build 5 field engineering or Build 8 composite RAG). Deploys all three changes against the capstone. Re-measures. Writes a 5–10-page tuning report covering: baseline, identified gaps, proposed changes with rationale, deployment notes, measured lift vs Build 1's noise threshold, residual gaps, and a recommendation for ongoing tuning cadence.

## Pass rubric

1. Capstone instrumented with Build 1 harness, baseline captured.
2. Three improvements proposed with clear rationale tied to measured gaps.
3. All three deployed against the capstone.
4. Measurable lift on at least 2 of 3 changes (lift > Build 1's noise threshold).
5. Tuning report submitted (5–10 pages) and passes Progress-led review board.
6. The report names a quarterly tuning cadence the partner can sell to customers.

## Asset delivered

**Tuning-report template** — used by every AE&RS Specialist thereafter when scoping a paid tuning engagement with a customer. This is the commercial deliverable of the cert.

## Reference reading

- All prior Builds in this course (1–8).
- Both [Atlas Operations](../../../developer-foundations/builds/build-7-capstone/atlas-operations/) and [Aurora Concierge](../../../developer-foundations/builds/build-7-capstone/aurora-concierge/) capstones.
- ARAKS RP-010 (Production RAG Ops).

---

## Workspace

This folder is the working space for everything supporting Build 9. Drop materials here as they are built:

- `walkthrough.md` — tuning-engagement methodology walkthrough
- `report-template.md` — the tuning-report template (the asset)
- `examples/` — anonymised completed tuning reports from past partner engagements
- `review-board-rubric.md` — what the review board scores against
- `commercial-pack/` — proposal templates partners use to sell tuning retainers from this artefact
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Advanced Extraction & Retrieval Strategies](../../README.md)
- Previous build: [Build 8 — Composite & agentic retrieval patterns](../build-8-composite-agentic-patterns/)
- Capstones being tuned: [Atlas Operations](../../../developer-foundations/builds/build-7-capstone/atlas-operations/), [Aurora Concierge](../../../developer-foundations/builds/build-7-capstone/aurora-concierge/)
