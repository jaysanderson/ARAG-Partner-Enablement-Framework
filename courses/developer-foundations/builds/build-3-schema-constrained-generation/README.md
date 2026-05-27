# Build 3 — Schema-constrained generation (the agent workshop)

> Part of [Developer Foundations](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).
>
> **This is one of the two top-priority assets** flagged in the framework's 90-day rollout (alongside the Build 7 capstone). It is the build that converts a "we already use ChatGPT" objection into a Tier 3 platform conversation.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 3 |
| **Prerequisite** | [Build 2 — Multi-surface conversational](../build-2-multi-surface-conversational/) |
| **Estimated effort** | 10–14 hours focused |

## Start here

Work through the three course-material files for this Build in order:

1. **[lesson.md](lesson.md)** — concepts, ARAG patterns, why this Build matters. Read first.
2. **[walkthrough.md](walkthrough.md)** — step-by-step build instructions with code and verification checklist.
3. **[quiz.md](quiz.md)** — 8 MC + 1 short answer; pass = 7/8 + credible short answer.

The rest of this README is a quick-reference summary. The full content lives in the three files above.

---

## What the partner does

Designs and ships three `askForJson` workflows against the partner's own KB: a follow-up question generator, a dynamic FAQ generator, and a domain taxonomy generator. Learns to handle the strict-mode `additionalProperties:false` requirement, the three response-shape fallbacks, and the "schema permissive, code strict" pattern (mixed-type schemas with client-side validation).

## Pass rubric

1. Three schemas committed to the partner's repo.
2. Each schema validated against at least 20 production inputs.
3. Mixed-shape schema (MC + free-text) generated correctly.
4. Recorded demo explaining the difference between `askForJson` and the manual-JSON-via-prompt-with-regex pattern, and when to use each.

## Asset delivered

**The Agent Workshop notebook** — a reusable Jupyter / TypeScript template with five worked schema examples.

**Reference:** `Sample-ARAG-App/src/pages/ExamPage.tsx` (six distinct generation patterns in one file — the canonical Tier 3 reference) and `src/context/CertificationContext.tsx`.

---

## Workspace

This folder is the working space for everything supporting Build 3. Drop materials here as they are built:

- `walkthrough.md` — schema design walkthrough
- `notebook/` — the Agent Workshop notebook (TypeScript + Jupyter variants)
- `schemas/` — five worked schema examples
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Developer Foundations](../../README.md)
- Previous build: [Build 2 — Multi-surface conversational](../build-2-multi-surface-conversational/)
- Next build: [Build 4 — Composite RAG](../build-4-composite-rag/)
- Related advanced topic: [Advanced Build 8 — Composite & agentic retrieval patterns](../../../advanced-extraction-and-retrieval-strategies/builds/build-8-composite-agentic-patterns/)
