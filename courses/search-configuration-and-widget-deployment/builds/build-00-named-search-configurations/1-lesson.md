# Build 00 — Lesson: Named Search Configurations

> Read time: 5 minutes.

## Why this is in the course

Every build after this one hands you a new dashboard tab or a new API parameter and asks "where does this live in production?" The answer is always the same place: a **named search configuration**. This build exists to establish that one concept before you need it nine times.

## What you already know

You already know `/find` and `/ask` from [Developer Foundations Build 0](../../../developer-foundations/builds/build-00-hello-arag/) and [Build 1](../../../developer-foundations/builds/build-01-five-primitives/): `/find` retrieves matching paragraphs, `/ask` retrieves and generates a grounded answer with citations, both authenticated with the same `X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>` header. That's not being re-taught here — if any of the last sentence was news to you, go do Foundations Build 0 first.

## The one new concept: stored search configurations

Every build from here on adds parameters to `/find` or `/ask`: filters, rank fusion, prompts, `rag_strategies`, result display flags, routing. Passed inline, a call gets long fast:

```bash
curl -s "https://{zone}.rag.progress.cloud/api/v1/kb/{kbId}/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $JWT" \
  -H "content-type: application/json" \
  -d '{
    "query": "How does the TerraTrek 7 handle wet rock?",
    "filter_expression": {"field": {"prop": "language", "language": "en"}},
    "rag_strategies": [{"name": "neighbouring_paragraphs"}],
    "prompt": {"system": "Answer like a gear-fit specialist."}
  }'
```

Every application that calls this KB needs the same parameters, kept in sync, forever. That's the problem stored search configurations solve.

A **search configuration** is a named, stored bundle of `/find` or `/ask` parameters, created once on the Knowledge Box:

```bash
curl -s -X POST "https://{zone}.rag.progress.cloud/api/v1/kb/{kbId}/search_configurations/shopper_default" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $JWT" \
  -H "content-type: application/json" \
  -d '{
    "kind": "ask",
    "config": {
      "filter_expression": {"field": {"prop": "language", "language": "en"}},
      "rag_strategies": [{"name": "neighbouring_paragraphs"}],
      "prompt": {"system": "Answer like a gear-fit specialist."}
    }
  }'
```

- **`kind`** — `find` or `ask`. A configuration is scoped to one endpoint shape.
- **`config`** — any parameter that endpoint accepts: `filter_expression`, `prompt`, `rag_strategies`, `security`, and everything Builds 01–06 of this course cover.

Once it exists, every caller just passes the name:

```bash
curl -s "https://{zone}.rag.progress.cloud/api/v1/kb/{kbId}/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $JWT" \
  -H "content-type: application/json" \
  -d '{"query": "How does the TerraTrek 7 handle wet rock?", "search_configuration": "shopper_default"}'
```

Everything from the stored config loads automatically. The caller doesn't need to know — or keep in sync — any of it.

## Why this is the production pattern

Three reasons partners ship this way instead of hand-carrying parameters:

1. **One place to change, not N.** Tune the prompt or add a filter once, on the configuration; every application calling `search_configuration: "shopper_default"` picks it up on the next call — no redeploy, no code change.
2. **Switch behaviour without touching code.** A widget, a mobile app, and an internal tool can all reference the same named configuration, or each reference a different one (`shopper_default` vs `staff_internal`) for different audiences from the same Knowledge Box.
3. **It's what the dashboard already does.** When you click **Create widget** in the dashboard (you did this in Foundations Build 2), the dashboard saves your Search-tab and Generative-Answer-tab choices as a named search configuration behind the scenes, then points the generated widget snippet at it. Builds 01 through 08 of this course are, mechanically, "what goes into that stored configuration, and how."

## Gotcha

A configuration's `kind` locks it to one endpoint. A `kind: "find"` configuration can't be referenced from `/ask`, and vice versa — if you need the same filter logic on both endpoints, you create two configurations (or, more commonly, just create the `ask` one and call `/find` with `generate_answer:false`, which Build 02 covers).

## What's next

[Build 01 — Tuning the Search Strategy](../build-01-tuning-the-search-strategy/) — the first real content that goes into a stored configuration's `config` block: everything that controls how retrieval itself works.
