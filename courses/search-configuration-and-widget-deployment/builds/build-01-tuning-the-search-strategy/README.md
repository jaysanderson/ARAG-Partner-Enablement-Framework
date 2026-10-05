# Build 01 — Tuning the Search Strategy

> Part of [Search Configuration & Widget Deployment](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Capability** | Tour the dashboard's Search tab and its full API surface — `features`, `rephrase`, `query_prepend`, `rank_fusion`, reranking, `filters`/`filter_expression` — and save a tuned setup as a named search configuration |
| **Tier mapped to** | Tier 1 |
| **Prerequisite** | [Build 00 — Named Search Configurations](../build-00-named-search-configurations/) |
| **Estimated effort** | 2 hours focused |

## Start here

1. **[lesson.md](1-lesson.md)** — search modes and `features`, `rephrase`, `query_prepend`, `rank_fusion`/RRF, reranking, the full filter attribute list, `filter_expression`, and `autofilters`.
2. **[walkthrough.md](2-walkthrough.md)** — tour the Search tab against the Aurora Outfitters corpus, test each parameter with curl, build a `filter_expression`, save the result as a named search configuration.
3. **[quiz.md](3-quiz.md)** — 5 multiple-choice.

## What you can do after this Build

- Explain what `features` controls on `/find` and `/ask`, and when to drop to semantic-only search (cross-language queries) instead of the default mode mix.
- Use `rephrase` to turn a keyword-heavy query into a natural-language question before semantic search runs, and know when it helps vs. when it's unnecessary overhead.
- Apply `query_prepend` to pin domain context onto every query, and explain the gotcha — it's a blunt instrument that touches every query, including ones where it doesn't belong.
- Tune `rank_fusion` (RRF) and know it's dataset- and query-dependent — something to A/B test, not set once and forget.
- Decide when reranking's latency/cost tradeoff is worth it and when it isn't.
- Write a `filters` array or a `filter_expression` using the full confirmed attribute list — origin tags, classification labels, mime type, processing status, entities, language, origin metadata, and path — and know how `filter_expression`'s boolean composition differs from the flat `filters` array.
- Read `autofilters` off an `/find` response as a diagnostic signal, not a setting.
- Save a tuned Search-tab configuration as a named `search_configuration`, tying this Build directly to Build 00's `config` block.

## See also

- Parent: [Search Configuration & Widget Deployment](../../README.md)
- Previous: [Build 00 — Named Search Configurations](../build-00-named-search-configurations/)
- Next: [Build 02 — Prompts & Generative Answers](../build-02-prompts-and-generative-answers/)
