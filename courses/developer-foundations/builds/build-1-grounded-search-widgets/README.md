# Build 1 — Grounded search & drop-in widgets

> Part of [Developer Foundations](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Owning track(s)** | Sell (Should), Deliver (Must) |
| **Tier mapped to** | Tier 1 |
| **Prerequisite** | [Build 0 — Hello ARAG](../build-0-hello-arag/) |
| **Estimated effort** | 6–8 hours focused |

## Start here

Work through the three course-material files for this Build in order:

1. **[lesson.md](lesson.md)** — concepts, ARAG patterns, why this Build matters. Read first.
2. **[walkthrough.md](walkthrough.md)** — step-by-step build instructions with code and verification checklist.
3. **[quiz.md](quiz.md)** — 8 MC + 1 short answer; pass = 7/8 + credible short answer.

The rest of this README is a quick-reference summary. The full content lives in the three files above.

---

## What the partner does

Embeds `<nuclia-search-bar>`, `<nuclia-chat>`, `<nuclia-popup>` on a real partner website with branded theming (`--nuclia-color-primary`, base64'd CSS via `csspath`). Configures content-type filters and label filters. Ships a `?q=` deep-link experience.

## Pass rubric

1. Widgets live on a public URL.
2. Branded styling matches the partner brand.
3. Search results return content-type-filtered and topic-filtered.
4. Demo-ready in under five minutes.

## Asset delivered

A "Demo a chatbot in 30 minutes" playbook with the partner's branded widget HTML snippet and a slide describing how the same KB powers both the search bar and the chat.


---

## Workspace

This folder is the working space for everything supporting Build 1. Drop materials here as they are built:

- `walkthrough.md` — embed exercise (theme, filters, deep links)
- `snippets/` — branded HTML snippets and CSS variations
- `slides/` — slide deck
- `playbook.md` — the "30-minute demo" playbook deliverable
- `verification.md` — reviewer checklist

## See also

- Parent course: [Developer Foundations](../../README.md)
- Previous build: [Build 0 — Hello ARAG](../build-0-hello-arag/)
- Next build: [Build 2 — Multi-surface conversational intelligence](../build-2-multi-surface-conversational/)
