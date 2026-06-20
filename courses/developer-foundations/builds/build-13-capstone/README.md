# Build 13 — The Capstone (pick your wow build)

> Part of [Developer Foundations](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).
>
> **This is one of the two top-priority assets** flagged in the framework's 90-day rollout (alongside Build 5). It is both the curriculum capstone and the sales-room closer.

> ## 🚦 Prerequisite gate: pass the [final exam](../../final-exam.md) first
>
> Build 13 is the capstone. You may only submit it for review-board defence *after* passing the Developer Foundations final exam (20 multiple-choice, pass = 16/20 / 80%).
>
> If you haven't passed the exam yet, do not start Build 13. Return to the lessons + walkthroughs for any Build whose quick quiz you didn't pass, then sit the final exam.

## Pick your variant

Build 13 ships with two worked briefs. Partners pick the one that matches their book of business; the second is built later if both customer segments are in play. Both share the same architecture, the same eight-week build plan, and the same re-skin playbook structure — they differ in corpus, graph schema, workflows, and demo buyer.

| Variant | Buyer | Persona corpus | Killer moment | Brief |
|---|---|---|---|---|
| **Enterprise / Operations** | CTO, CIO, Chief Data Officer | Atlas Global Industries (industrial manufacturer, single KB + business-unit labelsets) | Composite-RAG incident root cause + cross-functional typed graph | [`atlas-operations/`](atlas-operations/) |
| **Customer Experience** | CMO, Head of Digital, Chief Customer Officer | Aurora Outfitters (D2C outdoor retailer, single KB + content-type labelsets) | Two-voice floating chat + content-engineered CTAs + abandoned-cart composite RAG | [`aurora-concierge/`](aurora-concierge/) |

## At a glance (applies to both variants)

| | |
|---|---|
| **Owning track(s)** | All three tracks at Must for Elite tier |
| **Tier mapped to** | Capstone — combines Tiers 1–4 |
| **Prerequisite** | [Build 11 — Production readiness](../build-11-production-readiness/) + [Build 12 — Capstone prep](../build-12-capstone-prep/) |
| **Estimated effort** | 8 weeks for one strong full-stack engineer with Progress SE support; 4 weeks at 2 FTE |

## What the partner does

Builds one variant of the capstone: a single application that exercises every primitive and every tier in one branded surface. Grounded search + multi-surface chat + schema-constrained workflows + typed knowledge graph + multimodal media + custom field enrichment + production-grade ops. The capstone is what a partner walks into a Fortune 500 buyer's office with.

## Pass rubric

1. The capstone deployed at the partner's domain.
2. End-to-end demo runs in 25 minutes covering all four tiers without code edits.
3. At least one customer-specific data-augmentation agent in production.
4. Org-level demo passes a Progress-led review board (delivered live).

## What the build covers

The capstone is the flagship deliverable of the entire programme — both the curriculum capstone and the sales-room closer.

Each variant brief is a complete build spec. The application you ship covers:

- A Vite + React + TypeScript + Tailwind app (5-6 routes, all client libraries).
- The synthetic corpus + anchor entities + labelset schema (the corpus ships with this course).
- A seed approach + field-engineering (Aurora only) + a graph-extraction agent.
- A demo script + a re-skin playbook.
- Deploy config (e.g. `fly.toml` + `Dockerfile`).

### Corpus ingest — no scripts required

Both capstones use Progress Agentic RAG's **"Upload folder"** dashboard option with the **"use folder names as label names"** toggle. The bundled corpus folders (`corpus/business_unit/` for Atlas, `corpus/content_type/` for Aurora) are pre-organised so a partner picks the folder in the dashboard's "Upload folder" picker, enables the folder-names-as-labels option, and Progress Agentic RAG applies the primary labelset automatically — no Node.js, no env vars, no terminal commands required for the basic path. A seed script is an optional path for partners scaling beyond the bundled corpus or wanting to apply additional labelsets programmatically. Per-capstone ingest instructions are in each variant's `corpus/README.md`.

---

## See also

- Parent course: [Developer Foundations](../../README.md)
- Previous build: [Build 12 — Capstone prep](../build-12-capstone-prep/)
- Variant briefs: [Atlas Operations](atlas-operations/) (Enterprise) • [Aurora Concierge](aurora-concierge/) (CX)
