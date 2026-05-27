# Build 7 — The Capstone (pick your wow build)

> Part of [Developer Foundations](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).
>
> **This is one of the two top-priority assets** flagged in the framework's 90-day rollout (alongside Build 3). It is both the curriculum capstone and the sales-room closer.

> ## 🚦 Prerequisite gate: pass the [final exam](../../final-exam.md) first
>
> Build 7 is the capstone. You may only submit it for review-board defence *after* passing the Developer Foundations final exam (40 MC + 5 short answer, pass = 32/40 + 3/5 short answer).
>
> If you haven't passed the exam yet, do not start Build 7. Return to the lessons + walkthroughs for any Build whose quick quiz you didn't pass, then sit the final exam.

## Pick your variant

Build 7 ships with two worked examples. Partners pick the one that matches their book of business; the second is built later if both customer segments are in play. Both share the same chassis, the same eight-week build plan, and the same re-skin playbook structure — they differ in corpus, graph schema, workflows, and demo buyer.

| Variant | Buyer | Persona corpus | Killer moment | Brief |
|---|---|---|---|---|
| **Enterprise / Operations** | CTO, CIO, Chief Data Officer | Atlas Global Industries (industrial manufacturer, single KB + business-unit labelsets) | Composite-RAG incident root cause + cross-functional typed graph | [`atlas-operations/`](atlas-operations/) |
| **Customer Experience** | CMO, Head of Digital, Chief Customer Officer | Aurora Outfitters (D2C outdoor retailer, single KB + content-type labelsets) | Two-voice floating chat + content-engineered CTAs + abandoned-cart composite RAG | [`aurora-concierge/`](aurora-concierge/) |

## At a glance (applies to both variants)

| | |
|---|---|
| **Owning track(s)** | All three tracks at Must for Elite tier |
| **Tier mapped to** | Capstone — combines Tiers 1–4 |
| **Prerequisite** | [Build 6 — Production readiness](../build-6-production-readiness/) |
| **Estimated effort** | 8 weeks for one strong full-stack engineer with Progress SE support; 4 weeks at 2 FTE |

## What the partner does

Builds one variant of the capstone: a single application that exercises every primitive and every tier in one branded surface. Grounded search + multi-surface chat + schema-constrained workflows + typed knowledge graph + multimodal media + custom field enrichment + production-grade ops. The capstone is what a partner walks into a Fortune 500 buyer's office with.

## Pass rubric

1. The capstone deployed at the partner's domain.
2. End-to-end demo runs in 25 minutes covering all four tiers without code edits.
3. At least one customer-specific data-augmentation agent in production.
4. Org-level recorded demo passes a Progress-led review board.

## Asset delivered

The capstone reference build — the flagship asset of the entire programme. It is both the curriculum capstone and the sales-room closer.

**Reference:** composes patterns from every file in and .

---

## Workspace

This folder is the working space for everything supporting Build 7 across both variants. The variant-specific briefs live in the `atlas-operations/` and `aurora-concierge/` sub-folders. Cross-variant materials go here:

- `walkthrough.md` — capstone selection guide (when to pick which variant)
- `reskin-playbook.md` — generic re-skin patterns (extracted from both variant briefs)
- `review-board-rubric.md` — what the Progress-led review board scores against
- `recording-checklist.md` — what the 25-minute recorded demo must cover

## See also

- Parent course: [Developer Foundations](../../README.md)
- Previous build: [Build 6 — Production readiness](../build-6-production-readiness/)
- Variant briefs: [Atlas Operations](atlas-operations/) (Enterprise) • [Aurora Concierge](aurora-concierge/) (CX)
