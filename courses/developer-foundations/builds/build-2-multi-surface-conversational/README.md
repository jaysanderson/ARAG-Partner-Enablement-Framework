# Build 2 — Multi-surface conversational intelligence

> Part of [Developer Foundations](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Owning track(s)** | Sell (Should), Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 2 |
| **Prerequisite** | [Build 1 — Grounded search & widgets](../build-1-grounded-search-widgets/) |
| **Estimated effort** | 8–12 hours focused |

## What the partner does

Builds a floating chat with two distinct prompt modes — *prospect* (concise + one CTA from the corpus) and *member* (detailed + multi-source citations). Both modes route to the same KB; the only difference is the prompt and the post-processing. Implements `{context}`/`{question}` placeholders, query-prefix language switching, and resource-scoped chat.

## Pass rubric

1. Two prompt modes demonstrably differ in voice, length, and CTA behaviour.
2. A `Respond in {language}: ` prefix produces a working multilingual answer.
3. Resource-scoped chat correctly focuses the model on a single document.
4. Deep-link share URLs auto-fire once and strip themselves cleanly.

## Asset delivered

A "Three voices, one KB" demo script with the partner's own copy.

**Reference:** `Sample-ARAG-App/src/components/chat/FloatingChat.tsx` (the canonical Tier 2 example), `ResourceChatTab.tsx`, `ResearchAssistantPage.tsx`.

---

## Workspace

This folder is the working space for everything supporting Build 2. Drop materials here as they are built:

- `walkthrough.md` — prompt-mode design, voice toggle wiring, language switch
- `prompts/` — prospect-mode and member-mode prompt templates (with `{context}`/`{question}` placeholders)
- `demo-script.md` — the "Three voices, one KB" deliverable
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Developer Foundations](../../README.md)
- Previous build: [Build 1 — Grounded search & widgets](../build-1-grounded-search-widgets/)
- Next build: [Build 3 — Schema-constrained generation](../build-3-schema-constrained-generation/)
