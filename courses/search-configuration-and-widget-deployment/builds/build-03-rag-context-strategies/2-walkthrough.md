# Build 03 — Walkthrough: RAG Context Strategies

> Estimated time: 2.5 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

Five short exercises against your Aurora Outfitters Knowledge Box, one per strategy family: a context-size/quality comparison across `full_resource`, `hierarchy`, and `neighbouring_paragraphs`; a `metadata_extension` call; a `prequeries` boosting example; a two-field API resource that only answers correctly with `field_extension`; and a small `graph_beta` extraction and query.

## What you'll need open

- Your `.env` from Developer Foundations (`NUCLIA_API_URL`, `NUCLIA_KB_ID`, `NUCLIA_API_KEY`).
- A terminal.
- Your dashboard, for the Data Augmentation Agents step.

---

## Step 1 — Compare `full_resource`, `hierarchy`, and `neighbouring_paragraphs` (25 min)

Ask a question that depends on knowing which trail guide you're reading, with no strategy:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "What should I pack for the third destination this guide recommends?"}'
```

This is deliberately vague without document context — "this guide" means nothing to the model without knowing which resource matched. Now try the same query three times, once per strategy:

```bash
# hierarchy — cheap, adds title + summary
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "What should I pack for the third destination this guide recommends?", "rag_strategies": [{"name": "hierarchy"}]}'

# neighbouring_paragraphs — adds 1 paragraph before/after
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "What should I pack for the third destination this guide recommends?", "rag_strategies": [{"name": "neighbouring_paragraphs", "before": 1, "after": 1}]}'

# full_resource — the whole document
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "What should I pack for the third destination this guide recommends?", "rag_strategies": [{"name": "full_resource"}]}'
```

**What to look for:** `hierarchy` should be enough to ground "this guide" in a title. Whether `neighbouring_paragraphs` resolves "the third destination" depends on whether the matched paragraph is near a numbered list of destinations. `full_resource` should resolve it reliably but costs the most tokens — compare response latency across the three calls and note it.

---

## Step 2 — `metadata_extension` (15 min)

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "Who wrote the TerraTrek 7 field report, and what is it called?", "rag_strategies": [{"name": "metadata_extension", "types": ["origin", "classification_labels"]}]}'
```

Compare against the same call with no `rag_strategies`. The origin metadata (title, author) should make the answer more precise and less likely to guess at a title from body text alone.

---

## Step 3 — `prequeries` (20 min)

Boost ambassador-authored content over generic content when asking a recommendation question:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "What boot should I bring on the Tour du Mont Blanc?",
    "rag_strategies": [{
      "name": "prequeries",
      "queries": [
        { "weight": 2, "request": { "query": "TerraTrek 7", "features": ["keyword"], "fields": ["a/title"] } }
      ]
    }]
  }'
```

Compare the citations returned with and without the prequery — with a weighted prequery favoring the boot's own title match, ambassador field-note content (`field_notes/mara-chen-terratrek7-tasmania.md`, `theo-sundberg-tmb-guiding.md`) should surface more prominently alongside the product page.

---

## Step 4 — `field_extension`: build the two-field warranty resource (35 min)

This is the exercise the lesson's contract/updates example maps onto directly. You have two source files already in your corpus:

- `courses/developer-foundations/builds/build-00-hello-arag/corpus/content_type/field_demo/skyline-45l-warranty-main.md`
- `courses/developer-foundations/builds/build-00-hello-arag/corpus/content_type/field_demo/skyline-45l-warranty-updates.md`

Open both — the main file says "2 years, original purchaser only"; the updates file supersedes hardware coverage to Repair-for-Life as of March 2026. Ingested as two separate markdown resources (the normal folder-upload path), retrieval would treat them as two unrelated documents. Instead, create **one resource with two text fields**, main and updates, via the API:

```bash
curl -s -X POST "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/resources" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "title": "Aurora Skyline 45L — Warranty (main + updates)",
    "texts": {
      "main": { "format": "MARKDOWN", "body": "<paste skyline-45l-warranty-main.md body here>" },
      "updates": { "format": "MARKDOWN", "body": "<paste skyline-45l-warranty-updates.md body here>" }
    }
  }'
```

Wait for processing, then ask the question the lesson set up:

```bash
# Without field_extension — answers from the matched field alone
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "Is hardware failure on my Skyline 45L still covered after 2 years?"}'

# With field_extension — pulls the updates field in as context
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "Is hardware failure on my Skyline 45L still covered after 2 years?", "rag_strategies": [{"name": "field_extension", "fields": ["main", "updates"]}]}'
```

**Expected result:** the first call should answer from the main field alone — likely "no, coverage is 2 years" — the stale answer. The second call should resolve correctly: hardware failures are now covered under Repair-for-Life. If both calls give the same answer, double check the resource actually has two separate `texts` fields (not one field with both bodies concatenated) and that `fields` in the strategy names them correctly.

---

## Step 5 — `graph_beta` (35 min)

Your corpus has four short field-note documents built for this exercise, in `content_type/field_notes/`: `mara-chen-terratrek7-tasmania.md`, `jonah-reyes-skyline45l-cdt.md`, `theo-sundberg-tmb-guiding.md`, `anya-patel-fit-lab.md`. Each states explicit ambassador → product → trail relations in prose.

1. **Ingest the folder** if you haven't already (Upload folder, `content_type` labelset, same pattern as Build 0).
2. **Create a Graph data-augmentation agent** on your Knowledge Box via the dashboard's Data Augmentation Agents section. This is exactly the workflow [Developer Foundations Build 6 — Data-Augmentation Agents](../../../developer-foundations/builds/build-06-data-augmentation-agents/) and [Build 8 — Knowledge Graph 101](../../../developer-foundations/builds/build-08-knowledge-graph/) cover in depth — if you haven't done those builds, do the dashboard steps there first; this walkthrough assumes you can create a Graph agent, it doesn't re-teach it. Define entity types: `Ambassador`, `Product`, `Trail`.
3. **Run the agent** against your KB (or at minimum the `field_notes/` and `product`/`trail_guide`/`ambassador_video` folders) and wait for it to finish.
4. **Ask a relationship question** that plain semantic search struggles with:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "Which ambassadors have tested gear recommended for the Tour du Mont Blanc?", "rag_strategies": [{"name": "graph_beta"}]}'
```

**Expected result:** the answer should connect Theo Sundberg (who guides the TMB and recommends TerraTrek 7 + Skyline 45L + Helios), Mara Chen (who tested the TerraTrek 7), and Jonah Reyes (who tested the Skyline 45L) — a chain no single document states end-to-end, assembled from relations across three field notes and two product pages.

---

## Verification checklist

- [ ] Ran the same query under `hierarchy`, `neighbouring_paragraphs`, and `full_resource`, and can explain the token-cost/context-completeness tradeoff between them from what you observed.
- [ ] `metadata_extension` call returned origin metadata (author/title) in the answer.
- [ ] `prequeries` call visibly shifted which resources got cited, compared to the same query with no `rag_strategies`.
- [ ] Two-field warranty resource created via the API; the `field_extension` call resolves the warranty question correctly and the no-strategy call gives the stale answer.
- [ ] Graph agent created and run; a `graph_beta` query surfaced a multi-hop ambassador/product/trail relationship.
- [ ] `prompt-log.md` saved with any debugging prompts used.

Then take the [Build 03 quiz](3-quiz.md). Pass → start [Build 04](../build-04-visual-rag-and-images/).

---

## Getting unstuck

**`field_extension` gives the same answer with or without the strategy.**
- Confirm the resource truly has two separate field keys under `texts` (`main` and `updates`), not one field. Check the resource in the dashboard's resource browser — you should see two field entries.
- Confirm the `fields` array in the strategy names both field IDs exactly as they were created.

**Graph agent finds no relations.**
- Confirm the agent ran *after* the `field_notes/` folder finished ingesting, not before. Re-run the agent if you ingested content after creating it.
- Entity types are case-sensitive and description-driven — vague entity descriptions (e.g. just "Person") extract less reliably than specific ones ("Alpine guide or thru-hiker who tests Aurora Outfitters gear").

**`prequeries` call errors with an unrecognized field.**
- The `fields` array inside a prequery's `request` uses field-path syntax like `a/title` (title field) — check it matches the field you intend to search.

**`full_resource` call times out or errors on a large document.**
- You've hit the model's token limit. This is the gotcha the lesson warned about — switch to `hierarchy` or `neighbouring_paragraphs` for that resource.

## Next

[Build 04 — Visual RAG & Images](../build-04-visual-rag-and-images/) — the image half of context construction, `page_image` and `paragraph_image`, against two new PDFs built specifically to need them.
