# Build 03 — Lesson: RAG Context Strategies

> Read time: 16 minutes.

## Why this is in the course

Build 01 got you the *right paragraphs*. Build 02 got you a well-behaved *generation* step. There's a gap between them: once `/find` has matched a paragraph, how does that paragraph become the context the LLM actually reads? By default, it's just the paragraph text — nothing else. Most of the time that's not enough. The matched paragraph says "before the 1st of January 2023," but the date that changed is two paragraphs away. The matched paragraph is from a 40-page manual with no title attached. The matched paragraph is the main warranty terms, but a separate field on the same resource has the update that supersedes it.

`rag_strategies` is the `/ask` parameter that controls this. It's an array — you can combine more than one — and each entry names a strategy for expanding a matched paragraph into better context before the LLM ever sees it. This is, per the platform's own docs, "one of the highest-leverage parameters on `/ask` and almost never tuned by default-shipping partners." This build is you tuning it.

**Retrieval vs. context construction — keep these separate.** If `/find` isn't returning the right paragraphs at all, that's a Build 01 problem (filters, rank fusion, rephrase). If `/find` returns the right paragraph but the *answer* is still wrong or incomplete, that's a `rag_strategies` problem — the paragraph was right, the context around it wasn't enough.

## The seven strategies

| Strategy | What it does | Reach for it when |
|---|---|---|
| `full_resource` | Passes the entire resource, not just the matched paragraph | The answer could be anywhere in a short document and you can afford the token cost |
| `hierarchy` | Prepends the resource's title and summary to the matched paragraph, optionally extends with what follows | You need "what document is this from" context without the full document |
| `neighbouring_paragraphs` | Appends N paragraphs before and after the match | The answer is split across adjacent paragraphs (a step in a numbered list, a table split by a page break) |
| `field_extension` | Appends the content of one or more *other fields* on the same resource | The resource has more than one field and the answer lives in a field other than the one that matched |
| `metadata_extension` | Appends resource metadata (origin, labels, entities, or custom extra metadata) to the matched paragraph | The answer needs a fact that lives in metadata, not body text — a URL, an author, a price, a label |
| `prequeries` | Runs extra queries before the main one and folds their results into context, with optional prefiltering and weighting | You need to boost one source or label over another, or gather context the main query alone wouldn't surface |
| `graph_beta` | Detects entities in the query and pulls in the knowledge graph's relations for them | The question is about a relationship between entities — who worked on what, what pairs with what |

## `full_resource` — pass entire resources as context

> **What it does.** Passes the entire resource that contains the matched paragraph as context, not just the paragraph. Similar to `hierarchy` but "a bit more radical" — the context becomes maximal semantically, but also maximal in size.

> **Gotcha.** Depending on the model, you can hit the token limit fast. Reserve this for short-to-medium resources where the answer could plausibly be anywhere in the document — not for your 40-page enterprise runbooks.

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "What conditions is the TerraTrek 7 rated for?", "rag_strategies": [{"name": "full_resource"}]}'
```

Every other `rag_strategies` example below is the same `curl` shape — only the JSON body changes, so from here on only the body is shown.

## `hierarchy` — include textual hierarchy

> **What it does.** Prepends the matched paragraph with the resource's title and summary (if one exists), and may optionally extend the paragraph with the text that follows it.

> **When to use it.** The cheapest fix for "the model doesn't know what document this paragraph is from" — much smaller token cost than `full_resource`, and usually enough. This is a reasonable default to reach for first before escalating to `full_resource`.

```json
{ "rag_strategies": [{"name": "hierarchy"}] }
```

## `neighbouring_paragraphs` — include surrounding paragraphs

> **What it does.** Appends the previous and next paragraphs from the same resource to the matched one. You configure how many paragraphs before and after: `{"name": "neighbouring_paragraphs", "before": 1, "after": 2}`.

> **When to use it.** Numbered steps, tables split across paragraph boundaries, any content where the answer genuinely spans more than one paragraph but you don't want the cost of `full_resource`.

> **Gotcha.** Too many neighbouring paragraphs and you've reconstructed `full_resource` at a worse ratio of relevant-to-irrelevant tokens. Start at 1 before / 1 after and increase only if answers are still cutting off mid-thought.

## `field_extension` — pass specific field(s) as context

> **What it does.** Most resources have one main field (a File, Text, or Link field). Agentic RAG lets a resource carry multiple fields — `field_extension` appends the content of one or more *other* fields on the matched resource to the context, even if that other field didn't itself match the query.

> **The canonical example** (from the platform docs): a Knowledge Box of contracts has a main field (the contract) and a separate `updates` field listing amendments. A question like "When does clause 3.2.1 apply?" matches the original contract clause. If that clause was later amended, the amendment lives in `updates` — a field that may not be a better semantic match than the original clause, so it wouldn't get pulled in by retrieval alone. `field_extension` appends it anyway, because it's a *named field on the same resource*, not because it matched the query.

> **Gotcha.** This strategy is scoped to fields on the *same resource*. If the answer lives on a different resource entirely, you want `prequeries` or better filtering, not `field_extension`.

You'll build exactly this scenario in the walkthrough — Aurora's own version of the contract/updates example, using the Skyline 45L pack's warranty terms.

## `metadata_extension` — add metadata

> **What it does.** Appends resource metadata to each matched paragraph. Four metadata types, selectable via `types`:
> - `origin` — URL, title, author, publication date
> - `classification_labels` — every label assigned to the resource
> - `ners` — named entities extracted from the resource
> - `extra_metadata` — custom metadata you've stored (price, stock, delivery time, discount codes, anything)

```json
{ "rag_strategies": [{"name": "metadata_extension", "types": ["origin"]}] }
```

> **When to use it.** The answer needs a fact that lives in metadata, not prose — "link me to the product page," "who wrote this," "what's the SKU." Without it, the model can only answer from body text and will either omit the fact or hallucinate a plausible-looking one.

## `prequeries` — run queries before the main query

> **What it does.** Runs a set of queries *before* the main query and folds their results into context. Each prequery can carry a `prefilter` (restrict the search scope to specific resources before running) and a `weight` (boost that prequery's results in the final ranking).

```json
{
  "query": "How do I care for my down jacket?",
  "rag_strategies": [{
    "name": "prequeries",
    "queries": [
      { "prefilter": true, "request": { "query": "Helios", "features": ["keyword"], "fields": ["a/title"] } }
    ]
  }]
}
```

> **When to use it.** Boosting one source over another (e.g. weight ambassador field notes higher than generic support docs for a "who recommends this" question), or gathering supporting context the main query alone wouldn't surface. Without `prefilter`, a prequery adds matching content to context but doesn't restrict the main query's scope; with `prefilter:true`, it narrows the main query to the prequery's matched resources first.

> **Gotcha.** Every prequery is an extra retrieval pass — more latency, more cost. Reach for this when a single query genuinely can't express what you need, not as a default.

## `graph_beta` — knowledge graph search

> **What it does.** Identifies entities mentioned in the user's query and searches the knowledge graph for relations matching those entities, pulling the matched relations into context.

> **When to use it.** Questions shaped like relationships, not facts: "which ambassadors tested gear used on the Tour du Mont Blanc," "what products pair with the Skyline 45L." Plain semantic search finds documents *about* an entity; `graph_beta` finds *connections between* entities — often connections that no single document states directly, because they're assembled from relations spread across several documents.

> **Prerequisite.** `graph_beta` searches a knowledge graph that has to exist first — either auto-extracted by a Graph data-augmentation agent or manually annotated via `user_metadata` on resources. See [Developer Foundations Build 8 — Knowledge Graph 101](../../../developer-foundations/builds/build-08-knowledge-graph/) for the `/graph` and `/graph/nodes` endpoints this strategy draws on; if you haven't done Build 8, the walkthrough's graph-extraction step will feel new — that's expected, it's covered there in depth and only used here.

```json
{ "query": "Which ambassadors have tested gear recommended for the Tour du Mont Blanc?", "rag_strategies": [{"name": "graph_beta"}] }
```

## Not `field_extension`: a naming collision to watch for

[Developer Foundations Build 9](../../../developer-foundations/builds/build-09-field-engineering/) and [Advanced Extraction & Retrieval Strategies Build 5](../../../advanced-extraction-and-retrieval-strategies/builds/build-5-custom-field-engineering/) both teach **custom JSON-encoded fields** (`callToAction`, `searchResultDisplay`, `videoInfo`) that get consumed through prompt templating to drive UI/AI behavior. That's a different mechanism from `field_extension` here, which is a `rag_strategies` entry that pulls a named field's *content* into the LLM's context automatically. Related idea — multi-field resources — different tool. If you've done Build 9, don't assume it already covered this; it covered the fields, not this strategy for surfacing them.

## Combining strategies

`rag_strategies` is an array — combine what you need:

```json
{ "rag_strategies": [{"name": "hierarchy"}, {"name": "metadata_extension", "types": ["origin"]}] }
```

Every strategy you add is more tokens per call. Start with the cheapest one that could plausibly fix the problem (`hierarchy` before `full_resource`; one `neighbouring_paragraphs` pair before `prequeries`), and only combine when a single strategy's output is still missing something specific.

## Images are a separate strategy family

`rag_strategies` covers text context. There's a parallel `rag_images_strategies` parameter (`page_image`, `paragraph_image`) for when the answer lives in a diagram or photo, not surrounding text — that's Build 04, not this one.

## What's next

[Build 04 — Visual RAG & Images](../build-04-visual-rag-and-images/) — the image half of context construction, against two new PDFs built specifically to need it.
