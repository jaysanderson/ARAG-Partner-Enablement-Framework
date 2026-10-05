# Build 01 — Lesson: Tuning the Search Strategy

> Read time: 12 minutes.

## Why this is in the course

"The answers are too generic" is almost never a generation problem. It's a retrieval problem wearing a generation costume — the model can only ground an answer in what search handed it, and every default in this Build exists because the out-of-the-box mix doesn't fit every corpus or every query shape. The dashboard's **Search tab** — under **Search options** — is where a partner tunes retrieval without touching code, and everything it exposes has a direct `/find`/`/ask` parameter underneath it. This lesson covers that parameter surface; the walkthrough puts it in the dashboard's hands and yours.

## Search modes and `features`

`/ask` runs **semantic, keyword, and graph search** by default. `/find` runs **semantic and fulltext search** by default.

Those are four distinct `features` values, and the two lexical ones are not the same thing:

| Feature | What it matches |
|---|---|
| `semantic` | Meaning — vector similarity against the query's embedding |
| `keyword` | Individual terms within paragraphs, BM25-scored |
| `fulltext` | Terms across the whole document's indexed text |
| `relations` | Entity relationships in the knowledge graph |

Keep `keyword` and `fulltext` straight — the quiz depends on it, and so does reading a `features` array correctly when a customer sends you one.

The `features` parameter overrides which modes run. The clearest reason to override it: **cross-language search**. If your Knowledge Box is in English and a user searches in Spanish, keyword search can false-match — words that look identical across languages but mean different things will score as hits they shouldn't be. Passing semantic-only features sidesteps that:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "bota impermeable para lluvia", "features": ["semantic"]}'
```

> **Gotcha.** Dropping keyword search isn't free — you lose exact-match precision for SKUs, model numbers, and proper nouns. Use `features` deliberately, per query shape, not as a permanent setting.

## `rephrase` — fixing keyword-shaped queries

Semantic search compares meaning, and it does that best against a natural-language question. A query that's really a keyword list — `"prune apple tree period"` — often scores worse on semantic search than the same intent phrased as a question. `rephrase: true` rewrites the query into something like *"When is the best time to prune an apple tree?"* before semantic search runs:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "terratrek 7 waterproof rating", "rephrase": true}'
```

It costs an extra model call, so it's a lever for corpora and audiences where users type keywords rather than questions — internal search bars, technical documentation portals — not a blanket default.

## `query_prepend` — pinning context onto every query

`query_prepend` is hard-coded text the platform prepends to the user's query before search runs. It's the way to pin a domain or brand context onto every search without asking the user to type it:

```json
{ "query": "best boot for wet rock", "query_prepend": "Aurora Outfitters gear:" }
```

Every query effectively becomes `"Aurora Outfitters gear: best boot for wet rock"`.

> **Gotcha.** `query_prepend` is a blunt instrument — it changes semantic search behaviour for **every** query on that endpoint, including queries where the prepended text is irrelevant or actively distracting (a support question about a return policy doesn't need "Aurora Outfitters gear:" glued to the front). It fits a single-purpose widget scoped to one intent far better than a general-purpose search box.

## `rank_fusion` — merging ranked lists with RRF

When more than one search mode runs, you get more than one ranked list — keyword search scores with BM25, semantic search scores with a distance metric. Those scores aren't comparable on the same scale. **Reciprocal Rank Fusion (RRF)** merges the lists by **rank position**, not raw score: an item ranked #1 in two different lists is worth more than an item ranked #1 in only one. This is what unifies keyword-search results and semantic-search results into a single ordered list.

`rank_fusion` is tunable on both `/find` and `/ask` — you can adjust the `k` parameter (how aggressively RRF discounts lower ranks) and add boosting/weights to specific search modes:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "waterproof hiking boot",
    "rank_fusion": {"name": "rrf", "k": 60}
  }'
```

> **Gotcha.** There's no universal right value for `k` or the mode weights — the correct tuning is dataset- and query-dependent. Treat `rank_fusion` as something you A/B test against real queries on your corpus, not something you set once from a blog post and forget. Build 06's RAG Lab is where that comparison happens formally.

## Reranking — a second pass for order quality

Reranking is a step **after** rank fusion: a cross-encoder model re-reads the unified candidate list and reorders it. Where RRF only looks at rank position, a reranker actually re-scores relevance against the query.

**It is on by default.** The parameter is `reranker`, and the two values you'll use are:

| Value | Effect |
|---|---|
| `predict` | The default — cross-encoder reranking runs |
| `noop` | Reranking off |

So in practice you are not switching reranking *on*; you are deciding whether to switch it *off* to buy latency back:

```json
{ "query": "waterproof boot for wet rock", "reranker": "noop" }
```

> **Gotcha.** `reranker: true` is accepted by the API and returns **zero results** — it is not a boolean. Use the string values above.

> **Gotcha.** Reranking is a second model pass over every candidate, so it adds latency and cost. It's worth it when result **ordering** quality matters more than speed — e.g. showing a user the top 3 results and needing #1 to actually be the best one. It's less worth it for high-QPS backend use where the extra round-trip adds up fast.

You'll measure that latency cost yourself in the walkthrough rather than take it on faith — it's the one option in this Build whose tradeoff you can only judge against your own corpus and your own latency budget.

## Filters — the full attribute list

`filters` narrows results by resource property. This is the canonical, full list:

| Filter path | Matches on |
|---|---|
| `/origin.tags/<tag>` | Tags set on the resource's origin property |
| `/classification.labels/<labelset>/<label>` | Labelset values |
| `/icon/<mimetype>` | Resource MIME type, e.g. `/icon/application/pdf` |
| `/metadata.status/<status>` | Processing status: `PROCESSED`, `PENDING`, `ERROR` |
| `/entities/<entity-type>/<entity-id>` | Resource entities, e.g. `/entities/CITY/Barcelona` |
| `/metadata.language/<code>` | Primary document language |
| `/metadata.languages/<code>` | Any other detected language on the document |
| `/origin.metadata/<fieldname>/<value>` | User-provided origin metadata |
| `origin.path` | Matches any resource path starting with the given value |

**Cross-reference:** [Developer Foundations Build 2](../../../developer-foundations/builds/build-02-drop-in-widgets/1-lesson.md) taught a narrower subset — `/icon/`, `/classification.labels/`, and a widget-specific `/n/s/<slug-fragment>` slug-substring filter — for the widget configurator specifically. `/n/s/` is a widget convenience, not part of this canonical filter-path list; everything above is what `/find` and `/ask` actually accept.

## `filter_expression` — boolean-composable filtering

`filters` is a flat array (OR within a filter type, AND across types — see Foundations Build 7 for the exact combination rules). `filter_expression` is the newer, richer form: it composes `field` and `paragraph` properties with an explicit `operator` (`and`/`or`), and it's what you'll see inside stored search configurations. Filtering to English-language paragraphs that aren't OCR output:

```json
{
  "filter_expression": {
    "field": {"prop": "language", "language": "en"},
    "paragraph": {"not": {"prop": "kind", "kind": "OCR"}},
    "operator": "and"
  }
}
```

Reach for `filter_expression` once a filter needs more than "match this path" — negation, mixing field-level and paragraph-level conditions, or combining conditions with an explicit boolean operator.

To filter by classification label in `filter_expression`, the prop is **`label`** (singular) with `labelset` and `label` keys:

```json
{ "filter_expression": { "field": {"prop": "label", "labelset": "content_type", "label": "product"} } }
```

Compose it with other conditions using a nested `and`:

```json
{ "filter_expression": { "field": {"and": [
    {"prop": "label", "labelset": "content_type", "label": "product"},
    {"prop": "language", "language": "en"}
]}}}
```

> **Gotcha — `filters` and `filter_expression` are mutually exclusive.** Send both on the same request and you get **zero results**, with no error. Each works perfectly alone (`filters` with a path, `filter_expression` with a prop), but the combination silently returns nothing. Pick one mechanism per call and express every condition in it. This is the single most common way to get an inexplicably empty result set on a filter you're sure is correct.

> **Gotcha — invalid filters fail silently.** A misspelled `prop`, a wrong key name, or an unsupported value does **not** return a 400. It returns `0` results, exactly like a valid filter that matched nothing. So an empty result set never tells you whether your filter is wrong or merely restrictive. Debug by removing the filter entirely to confirm the query itself matches, then adding conditions back one at a time.

## `autofilters` — a response field, not a setting

`autofilters` shows up in the `/find` **response**, not the request. It's an array of strings reporting which filters the query engine applied automatically — most commonly filters derived from entities the engine detected in the query text itself. Read it as a diagnostic: if a result set looks narrower than expected, check `autofilters` before assuming your own filter is misbehaving. It isn't a toggle you set.

> **Precondition — you will not see this on a fresh Knowledge Box.** Auto-filtering is driven by *detected entities*, so it only appears once entity extraction has actually run and populated the KB's entity groups. On a KB whose entity groups exist but are empty — the default state after a plain folder upload — the `autofilters` key is simply absent from every response, no matter what you query or whether you pass `autofilter: true`. Check with `GET /kb/{kbId}/entitiesgroups`: if every group reports 0 entities, there is nothing to auto-filter on. Extraction is covered in [Developer Foundations Build 6](../../../developer-foundations/builds/build-06-data-augmentation-agents/) and [Build 8](../../../developer-foundations/builds/build-08-knowledge-graph/). The same precondition governs Build 07's `autocompleteFromNERs`.

## Where this lives in the dashboard

The dashboard's **Search** tab (**Search options** section) exposes every parameter above as a no-code UI — the product description for it is literally "allows you to define how retrieval is done." A **New Search Configuration UI** was added to the Search tab so partners can tune this visually and save it as a named configuration. That's not a separate concept from Build 00 — every change you make in the Search tab and save **is** the `config` block a `search_configuration` stores. Build 01's walkthrough makes that link concrete.

## What's next

[Build 02 — Prompts & Generative Answers](../build-02-prompts-and-generative-answers/) — once retrieval is tuned, the next lever is what the model does with what it retrieved: system/user prompts, model choice, reasoning, token limits.
