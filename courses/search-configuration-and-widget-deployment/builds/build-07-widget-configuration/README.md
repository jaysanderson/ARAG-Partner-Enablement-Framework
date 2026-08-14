# Build 07 — Widget Configuration

> Part of [Search Configuration & Widget Deployment](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Capability** | Full widget configuration option tour across all four Web Components — the Widget Builder's list view (preview, rename, duplicate, delete) and the complete `SearchBoxConfig` option set, plus how it connects to `GenerativeAnswerConfig`, `ResultDisplayConfig`, and `RoutingConfig` from earlier Builds |
| **Tier mapped to** | Tier 1 |
| **Prerequisite** | [Build 06 — RAG Lab & Prompt Lab](../build-06-rag-lab-and-prompt-lab/) (also assumes [Developer Foundations Build 2 — Drop-in Widgets](../../../developer-foundations/builds/build-02-drop-in-widgets/) as a soft prerequisite — this Build is its deep-dive expansion) |
| **Estimated effort** | 1.5 hours focused |

## Start here

1. **[lesson.md](1-lesson.md)** — the Widget Builder list view, then every field in `SearchBoxConfig`: what it does, when to set it, and how it changes the end-user experience.
2. **[walkthrough.md](2-walkthrough.md)** — build two widget variants against the Aurora Outfitters corpus, reusing the `shopper_display` and `staff_display` search configurations from Build 05, then preview, rename, and duplicate one through the Widget Builder list view.
3. **[quiz.md](3-quiz.md)** — 5 multiple-choice.

## What you can do after this Build

- Navigate the dashboard's Widget Builder list view to preview, rename, duplicate, and delete a widget — the management surface a partner needs when running several widget variants for one customer.
- Set every field in `SearchBoxConfig` — autocomplete, filters, pre-scoping, highlighting, paragraph limits, query rephrasing, rank-fusion boosting, and generation scope — and predict exactly what changes for the end user before you touch the dashboard.
- Distinguish `rephraseQuery` (on/off) from `rephrasePrompt` (the template) at the widget-config level — the same distinction Build 02 taught for the API-level `rephrase` and `prompt.rephrase` parameters.
- Explain that `GenerativeAnswerConfig`, `ResultDisplayConfig`, and `RoutingConfig` are the same objects Builds 01–02 and 05 already taught, just surfaced as widget-builder toggles instead of raw API parameters — one underlying model, two surfaces.
- Build a public, pre-scoped widget and a separate internal widget from the same Knowledge Box, each reusing a different named search configuration.

## See also

- Parent: [Search Configuration & Widget Deployment](../../README.md)
- Previous: [Build 06 — RAG Lab & Prompt Lab](../build-06-rag-lab-and-prompt-lab/)
- Next: [Build 08 — Widget Deployment](../build-08-widget-deployment/)
