# Build 05 — Result Display & User Intent Routing

> Part of [Search Configuration & Widget Deployment](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Capability** | Configure the dashboard's Result Display tab (`ResultDisplayConfig`) to shape what a result list shows, and set up basic User Intent Routing (`RoutingConfig`) to give a rule-matched query a canned answer or a different model |
| **Tier mapped to** | Tier 2 |
| **Prerequisite** | [Build 04 — Visual RAG & Images](../build-04-visual-rag-and-images/) |
| **Estimated effort** | 2 hours focused |

## Start here

1. **[lesson.md](1-lesson.md)** — every `ResultDisplayConfig` field (`displayResults`, `showResultType`, `displayMetadata`, `displayThumbnails`, `hideAnswer`, `displayFieldList`, `showAttachedImages`, `relations`/`relationGraph`, `jsonOutput`/`jsonSchema`, `citationThreshold`/`customizeThreshold`, `sortResults`, `noScroll`, `metadatas`), then `RoutingConfig`/`Routing` — `useRouting`, rule `prompt`s, `direct_answer`, `generative_model`.
2. **[walkthrough.md](2-walkthrough.md)** — configure two Result Display setups for two audiences from the same Knowledge Box (shopper vs. staff), then wire one routing rule with a `direct_answer` for a predictable support query and confirm it bypasses generation. Save both as named search configurations.
3. **[quiz.md](3-quiz.md)** — 5 multiple-choice.

## What you can do after this Build

- Set every `ResultDisplayConfig` field and explain what each one changes about the rendered result list, not just the API response shape.
- Explain the `hideAnswer` vs. `generate_answer:false` gotcha precisely: `hideAnswer` still pays for generation and hides it client-side; `generate_answer:false` (Build 02) skips generation entirely and is the correct lever when the goal is cost, not just display.
- Configure `displayMetadata` + `metadatas` to show a curated metadata subset instead of everything, and use `citationThreshold`/`customizeThreshold` to control how aggressively low-confidence citations get filtered out.
- Cross-reference `relations`/`relationGraph` to Build 03's `graph_beta` and `jsonOutput`/`jsonSchema` to Foundations Build 5's `answer_json_schema` as the deeper API-level version of structured display.
- Turn on `useRouting`, write a natural-language rule `prompt` that detects a specific intent, and attach a `direct_answer` and/or a `generative_model` override to that rule.
- Explain precisely what Routing does and doesn't do: it matches on rule prompts and can return a canned answer or swap the model — it does not natively swap the entire `search_configuration`/retrieval strategy per rule.
- Recognize and avoid the over-broad-rule gotcha: test a routing rule against a spread of real queries, not just the one trigger phrase you designed it for.

## See also

- Parent: [Search Configuration & Widget Deployment](../../README.md)
- Previous: [Build 04 — Visual RAG & Images](../build-04-visual-rag-and-images/)
- Next: [Build 06 — RAG Lab & Prompt Lab](../build-06-rag-lab-and-prompt-lab/)
