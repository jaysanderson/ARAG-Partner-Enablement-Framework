# `/ask` — Exhaustive Parameter Reference

> Part of [Advanced Search & Retrieval Agents](../README.md). The canonical reference for every parameter, header, and response field of ARAG's `/ask` endpoint, mirroring the Nuclia API contract verbatim.
>
> Every Build in this course tunes one or more of these parameters. Read it cover-to-cover during Build 1, then return to it per Build.

> **Required role:** `READER`. Requests without an authenticated `READER` (or higher) role return `403`.

---

## Contents

1. [Endpoint shape](#1-endpoint-shape)
2. [Path parameters](#2-path-parameters)
3. [Headers](#3-headers)
4. [Required body — `query`](#4-required-body--query)
5. [Audit metadata — `audit_metadata`](#5-audit-metadata)
6. [Retrieval scope & filters](#6-retrieval-scope--filters)
7. [Retrieval-mode control](#7-retrieval-mode-control)
8. [Rank fusion & reranking](#8-rank-fusion--reranking)
9. [Citations](#9-citations)
10. [Result shaping](#10-result-shaping)
11. [Conversation history — `chat_history`](#11-conversation-history--chat_history)
12. [Multimodal & extra context](#12-multimodal--extra-context)
13. [Query rephrasing](#13-query-rephrasing)
14. [RAG context-building strategies — `rag_strategies`](#14-rag-context-building-strategies--rag_strategies)
15. [RAG image strategies — `rag_images_strategies`](#15-rag-image-strategies--rag_images_strategies)
16. [Generation control](#16-generation-control)
17. [Schema-constrained output — `answer_json_schema`](#17-schema-constrained-output--answer_json_schema)
18. [Security](#18-security)
19. [Search-configuration preset — `search_configuration`](#19-search-configuration-preset--search_configuration)
20. [Reasoning](#20-reasoning)
21. [Generate answer toggle](#21-generate-answer-toggle)
22. [Observability and debug](#22-observability-and-debug)
23. [Response shape (sync mode)](#23-response-shape-sync-mode)
24. [Streaming response format](#24-streaming-response-format)
25. [Related endpoints — what they share](#25-related-endpoints--what-they-share)
26. [Worked examples per Build](#26-worked-examples-per-build)
27. [Common errors and fixes](#27-common-errors-and-fixes)

---

## 1. Endpoint shape

```
POST {NUCLIA_API_URL}/kb/{kbid}/ask
```

Request: JSON body. Response: NDJSON / SSE stream (default) or single JSON (with `x-synchronous: true`).

---

## 2. Path parameters

| Param | Type | Notes |
|---|---|---|
| `kbid` | string (**required**) | Knowledge Box ID. The UUID for the KB. |

---

## 3. Headers

| Header | Type | Default | Purpose |
|---|---|---|---|
| `X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>` | string | (required) | Auth. Service-account JWT issued for the KB. Treat as a password. |
| `Content-Type: application/json` | string | (required) | Body format. |
| `x-ndb-client` | enum: `api`, `widget`, `web`, `dashboard`, `desktop`, `chrome_extension` | `api` | Identifies the calling client. Drives tenant analytics + per-client billing breakouts. |
| `x-show-consumption` | boolean | `false` | If `true`, surfaces token-usage and cost stats. Equivalent to the body-level `show_consumption` flag if exposed; this header form is the canonical one. |
| `x-nucliadb-user` | string | empty | Optional user identifier propagated into audit logs. Distinct from the service-account JWT — this is the *end-user's* identity, not the API caller's. |
| `x-forwarded-for` | string | empty | Standard proxy header; propagated into audit logs. |
| `x-synchronous` | boolean | `false` | If `true`, response is a single JSON object instead of a stream. Slower (waits for full answer) but easier for server-to-server pipelines. |

---

## 4. Required body — `query`

### `query` (string, **required**, max 20,000 characters)

The user's question. Free text.

**Gotcha:** empty / whitespace-only queries return 422.

---

## 5. Audit metadata

### `audit_metadata` (object or null)

Optional dictionary for filtering and analysing activity logs. Examples: `user_id`, `environment`, customer-session attributes.

```json
{
  "audit_metadata": {
    "user_id": "u-12345",
    "environment": "production",
    "persona": "trail_club_pro"
  }
}
```

Used downstream for audit dashboards + per-cohort analytics.

---

## 6. Retrieval scope & filters

### `fields` (array of strings, default `[]`)

Restrict retrieval to specific fields. Format: `<resource-type-letter>/<field-name>`. Example: `a/title` searches only on the title field.

Reference: [search-in-a-specific-field](https://docs.nuclia.dev/docs/rag/advanced/search/#search-in-a-specific-field).

### `filters` (array of strings, default `[]`)

The list of filter paths. Multiple filters in the array compose with **AND**. Each entry is either a string (filter path) or an object form.

```json
{
  "filters": [
    "/icon/application/pdf",
    "/classification.labels/topic/onboarding"
  ]
}
```

Build 3 covers single-axis filtering depth. Reference: [search-filters](https://docs.nuclia.dev/docs/rag/advanced/search-filters).

### `filter_expression` (object or null)

A nested boolean tree of filter clauses with explicit AND / OR / NOT semantics. **Replaces and supersedes `fields`, `filters`, `range_*`, `resource_filters`, `keyword_filters`** when complex composition is needed.

Build 3's reusable UI component emits `filter_expression` trees. See [search-filters](https://docs.nuclia.dev/docs/rag/advanced/search-filters) for the full syntax.

### `keyword_filters` (array of strings or objects, default `[]`)

Keyword filter expressions applied at retrieval time. Text-block search only runs against documents that contain the specified keywords. Case-insensitive; only alphanumeric characters and spaces allowed.

```json
{ "keyword_filters": ["compliance", "EU AI Act"] }
```

### `resource_filters` (array of strings, default `[]`)

Restrict retrieval to a known list of resource IDs. Only paragraphs from these resources are eligible for return.

```json
{ "resource_filters": ["abc123-uuid", "def456-uuid"] }
```

Useful for *"answer using only these documents"* customer-facing controls.

### `field_type_filter` (array, default `["text","file","link","conversation","generic","key_value"]`)

Restrict which **field types** are serialised on resources of search results. Enum: `text`, `file`, `link`, `conversation`, `generic`, `key_value`.

### Resource creation / modification date ranges

| Param | Type | Behaviour |
|---|---|---|
| `range_creation_start` | ISO-8601 string or null | Resources created **before** this date are filtered out. |
| `range_creation_end` | ISO-8601 string or null | Resources created **after** this date are filtered out. |
| `range_modification_start` | ISO-8601 string or null | Resources modified **before** this date are filtered out. |
| `range_modification_end` | ISO-8601 string or null | Resources modified **after** this date are filtered out. |

Date format: `2008-09-15T15:53:00+05:00`.

```json
{
  "range_modification_start": "2027-01-01T00:00:00Z"
}
```

### `show_hidden` (boolean, default `false`)

If `false` (default), hidden resources are excluded from search. Hidden resources are typically WIP or staged content.

---

## 7. Retrieval-mode control

### `features` (array, default `["semantic", "keyword"]`)

Which retrieval engines run. Enum:

| Value | Behaviour |
|---|---|
| `semantic` | Dense-vector retrieval over KB embeddings. |
| `keyword` | BM25 / inverted-index retrieval. Catches named entities, IDs, exact strings. |
| `relations` | Graph-traversal retrieval over the KB's typed-entity graph (populated by the data-augmentation graph agent). |

```json
{ "features": ["semantic", "keyword"] }                  // hybrid — the default
{ "features": ["semantic"] }                              // pure-vector — conceptual queries
{ "features": ["keyword"] }                               // pure-keyword — entity-heavy queries
{ "features": ["semantic", "keyword", "relations"] }      // hybrid + graph — agent surfaces
```

> **Deprecation note:** older docs reference `paragraphs` and `vectors` as feature values. These are deprecated — use `keyword` and `semantic` respectively.

### `vectorset` (string or null)

Which embedding model / vector index to retrieve against. KBs can have multiple vectorsets (e.g. one English-tuned, one multilingual). Default: the KB's primary vectorset.

```json
{ "vectorset": "multilingual-e5-large" }
```

### `top_k` (integer, range `[1..200]`, default `20`)

How many most-relevant results to fetch at the retrieval step. **Max 200.** Higher → reranker has more material; lower → faster.

> **There is no `page_size` / `page_number` on `/ask`.** `top_k` is the single retrieval-cardinality lever on this endpoint. `/find` has different pagination.

### `min_score` (number or object or null)

Minimum relevance score to filter results before they reach the LLM.

- **Number:** interpreted as the minimum score for the vector (semantic) index.
- **Object:** distinct thresholds per index:

```json
{
  "min_score": { "bm25": 0.3, "semantic": 0.65 }
}
```

Raising `min_score` improves precision at the cost of recall. Build 4 pairs naturally with `min_score` tuning.

### `highlight` (boolean, default `false`)

If `true`, query terms are wrapped in `<mark>...</mark>` style spans in the returned text. Useful for in-UI match highlighting.

---

## 8. Rank fusion & reranking

### `rank_fusion` (string or object, default `"rrf"`)

Algorithm for merging results from multiple retrievers (keyword + semantic + relations). Default is RRF (reciprocal rank fusion).

```json
{ "rank_fusion": "rrf" }
```

When the partner overrides this, they're usually building a custom-weighted hybrid for a high-precision use case. Build 4 covers when this matters.

### `reranker` (string or object, default `"predict"`)

The reranker that runs over the fused candidates. Default: `"predict"` (Nuclia Predict's built-in reranker).

Common values:

| Value | Behaviour |
|---|---|
| `"predict"` | Default — Nuclia Predict's reranker. Sub-second. |
| `"noop"` | No reranking. Returns the fused-rank-fusion order. |
| (custom) | Tenant-specific external reranker if configured at the KB level. |

```json
{ "reranker": "predict" }  // default
{ "reranker": "noop" }      // skip rerank
```

For **adaptive reranking** (Build 4's deliverable), set `reranker: "noop"`, expand `top_k` to ~50, then post-process the top-K through an external cross-encoder in partner code before passing to the LLM. The adaptive logic lives outside this parameter.

---

## 9. Citations

### `citations` (boolean, string `"llm_footnotes"`, or null, default `null`)

Controls whether citations are included in the response.

- `null` / `false`: no citations computed.
- `true` / `"default"`: citations computed after answer generation and sent as a separate `CitationsGenerativeResponse` chunk.
- `"llm_footnotes"`: citations rendered inline in the LLM answer as markdown footnotes. A `FootnoteCitationsGenerativeResponse` chunk maps footnote IDs back to context keys.

```json
{ "citations": true }                       // separate citations chunk
{ "citations": "llm_footnotes" }            // inline markdown footnotes
```

The `"llm_footnotes"` mode is the right pick for surfaces that render markdown and want citations woven into prose (research portal, conversational surfaces). The default `true` mode is right for surfaces that render citations as chips beneath the answer.

### `citation_threshold` (number or null, range `[0, 1]`)

Similarity threshold below which citations are suppressed. Lower → more citations (including low-confidence). Higher → fewer, higher-confidence citations. If unset, the platform uses an optimised default.

```json
{ "citations": true, "citation_threshold": 0.65 }
```

For high-stakes surfaces (compliance, medical) raise to ~0.7. For exploratory surfaces, lower to ~0.4.

---

## 10. Result shaping

### `show` (array, default `["basic"]`)

Which metadata sections are serialised on each resource. Enum:

| Value | Includes |
|---|---|
| `basic` | Title, slug, icon, summary. |
| `origin` | Source URL, ingest metadata, tags. |
| `extra` | Extra application-specific metadata blob. |
| `relations` | Per-resource relations from the typed graph. |
| `values` | Custom fields (Foundations Build 9 — Field Engineering). |
| `extracted` | Extracted text content. |
| `errors` | Per-resource error states. |
| `security` | Security tags and groups. |

```json
{ "show": ["basic", "values", "origin", "relations"] }
```

### `extracted` (array, **deprecated**)

> ⚠️ **Deprecated.** Use the `GET /resource/{id}` endpoint instead to fetch extracted metadata. Leave this parameter empty or omit it.

---

## 11. Conversation history — `chat_history`

### `chat_history` (array of objects or null)

Prior conversation turns. The platform uses these to rephrase the new query so the LLM and retrieval are aware of the conversation. Each entry: `{ author: "USER" | "NUCLIA", text: "..." }`.

```json
{
  "query": "What about its waterproofing?",
  "chat_history": [
    { "author": "USER", "text": "Tell me about the Aurora TerraTrek 7." },
    { "author": "NUCLIA", "text": "The Aurora TerraTrek 7 is..." }
  ]
}
```

Build 5 covers multi-turn surfaces and the session-scoped citation ledger that wraps this parameter.

### `context` (array, **deprecated**)

> ⚠️ **Deprecated.** Use `chat_history` instead. Same shape; older builds may still see `context` in customer code — migrate when you touch it.

---

## 12. Multimodal & extra context

### `extra_context` (array of strings or null, default empty)

Additional textual context appended to the retrieval context sent to the LLM. Lets the partner inject content that *isn't in the KB* (current date, session attributes, computed facts).

```json
{
  "query": "...",
  "extra_context": [
    "The current user is a Trail Club Pro member.",
    "Today's date is 2027-09-14."
  ]
}
```

`extra_context` does **not** affect retrieval — only the LLM's generation step.

### `extra_context_images` (array of objects or null)

Same idea as `extra_context` but for images. The partner-supplied images get appended to the LLM's context. Only meaningful for vision-capable LLMs; ignored otherwise.

### `query_image` (object or null)

An image alongside the textual query. Used for visual-grounding scenarios (*"is this product in stock?"* with a product photo).

```json
{
  "query": "Is this in stock?",
  "query_image": { "uri": "https://example.com/photo.jpg" }
}
```

> **Mutually exclusive with strategies:** when `query_image` is set, `extra_context_images` and `rag_images_strategies` are disabled.

---

## 13. Query rephrasing

### `rephrase` (boolean, default `false`)

If `true`, runs the query through an LLM with a rephraser prompt before embedding + retrieval. **Default is OFF on `/ask`.**

```json
{ "rephrase": true }
```

> **Note for partners:** rephrasing consumes LLM tokens and adds latency. Build 2's per-archetype recommendation table covers when it pays for itself (conceptual / exploratory queries) and when it hurts (factoid / navigational). The default of `false` is the right starting point — turn it on per-profile / per-archetype.

### `chat_history_relevance_threshold` (number or null, range `[0, 1]`)

When `chat_history` is set and `rephrase: true`, this threshold controls how aggressively the rephraser uses prior turns.

- `0` — always treat previous messages as relevant (always rephrase with full history).
- `1` — always treat previous messages as irrelevant (never rephrase based on history).
- In between — sensitivity dial.

```json
{
  "rephrase": true,
  "chat_history_relevance_threshold": 0.5
}
```

Tune this in Build 5 when adversarial follow-up patterns (topic switch in particular) expose context bleed.

---

## 14. RAG context-building strategies — `rag_strategies`

### `rag_strategies` (array, default `[]`)

> **One of the highest-leverage parameters on `/ask` and almost never tuned by default-shipping partners.** This array controls how the context for the LLM is *constructed* from the retrieval results. Empty array = use plain text of matching paragraphs. Non-empty = enrich the context per the strategies below.

Available strategies:

| Strategy | Behaviour | When to reach for it |
|---|---|---|
| `full_resource` | Include the **full text** of matching resources in the context, not just the matching paragraphs. | When the question's answer requires reading the whole document, not a fragment. Cannot combine with `hierarchy`, `neighbouring_paragraphs`, or `field_extension`. |
| `field_extension` | Add text of **specified additional fields** from the matching resources. | When a resource has structured fields (custom values from Foundations Build 9) that contain the answer the matching paragraph hints at. |
| `hierarchy` | Add the **title + summary of the parent resource** to each matching paragraph's context. | When the paragraph alone is ambiguous — the parent title disambiguates which document the paragraph came from. |
| `neighbouring_paragraphs` | Add the **paragraphs immediately before and after** the matching one. | When the matching paragraph references something defined in the surrounding context (*"as mentioned above"*, *"the next section explains"*). |
| `metadata_extension` | Add **metadata** of the matching paragraphs and/or resources to the context. | When labels / classifications / custom values should influence the LLM's answer (e.g. *"this resource is in audience: clinician"*). |
| `prequeries` | Run **multiple retrieval queries before the main query** and add their results to the context; results from specific prequeries can be weighted. | When the question is multi-faceted and one query won't surface all the relevant context — *"find context about X, find context about Y, then answer the question about both."* |

Concrete example — pre-query strategy:

```json
{
  "query": "How does the Aurora TerraTrek 7 compare to the Skyline 45L?",
  "rag_strategies": [
    {
      "name": "prequeries",
      "queries": [
        { "query": "Aurora TerraTrek 7 specifications", "weight": 1.0 },
        { "query": "Aurora Skyline 45L specifications", "weight": 1.0 }
      ]
    },
    {
      "name": "hierarchy"
    }
  ]
}
```

This is the parameter that turns *"the LLM has the right context"* from a hope into a contract. **Build 7 + Capstone D leverage `prequeries` heavily; Build 5's surfaces benefit from `hierarchy` and `neighbouring_paragraphs`.**

---

## 15. RAG image strategies — `rag_images_strategies`

### `rag_images_strategies` (array, default `[]`)

How **images** from matching resources get added to the LLM context. Only meaningful for vision-capable LLMs; ignored otherwise.

| Strategy | Behaviour |
|---|---|
| `page_image` | Include the full-page image of matching resources. |
| `tables` | Include table images for paragraphs that contain tables and matched the query. |
| `paragraph_image` | Include images embedded in matching paragraphs (excluding tables; tables go via the strategy above). |

```json
{ "rag_images_strategies": [{ "name": "tables" }, { "name": "paragraph_image" }] }
```

> **Disabled when `query_image` is set.**

---

## 16. Generation control

### `generative_model` (string or null)

Which LLM generates the answer. Overrides the KB's configured default (BYO-LLM — Foundations Build 11).

```json
{ "generative_model": "azure-gpt-4o" }
```

Common values are tenant-specific (`openai-gpt-4o`, `anthropic-claude-3-5-sonnet`, `azure-gpt-4o-mini`, `vertex-gemini-1-5-pro`, `bedrock-claude-3-haiku`, etc.).

### `generative_model_seed` (integer or null)

Seed for deterministic generation. Only supported by some models (most don't honour seed reliably).

```json
{ "generative_model_seed": 42 }
```

### `max_tokens` (integer, object, or null)

Caps tokens. Two shapes:

- **Integer:** interpreted as max tokens for the answer.
- **Object `MaxTokens`:** split caps for context vs answer:

```json
{ "max_tokens": { "context": 4000, "answer": 500 } }
```

Cost and latency scale roughly linearly with answer tokens. Build 8's cost-budget logic uses this.

### `prompt` (string, `CustomPrompt` object, or null)

Custom generation prompt. Two shapes:

- **String:** interpreted as the *user* prompt template (system prompt stays as the platform default).
- **CustomPrompt object:** customise both system and user prompts:

```json
{
  "prompt": {
    "system": "You are an Aurora Outfitters expert. Answer using only the provided context.",
    "user": "Question: {question}\n\nContext:\n{context}\n\nAnswer:"
  }
}
```

Or the simple string form:

```json
{ "prompt": "Question: {question}\n\nGround your answer in:\n{context}" }
```

The `{question}` and `{context}` placeholders are replaced by the platform.

### `prefer_markdown` (boolean, default `false`)

If `true`, the LLM-generated answer comes back as markdown.

```json
{ "prefer_markdown": true }
```

Set for any UI that renders markdown.

---

## 17. Schema-constrained output — `answer_json_schema`

### `answer_json_schema` (object or null)

If set, the platform forces the LLM to produce JSON matching the schema. Returned as a parsed object rather than prose.

```json
{
  "answer_json_schema": {
    "type": "object",
    "properties": {
      "faqs": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "question": { "type": "string" },
            "answer": { "type": "string" },
            "citation_resource_id": { "type": "string" }
          },
          "required": ["question", "answer", "citation_resource_id"]
        }
      }
    },
    "required": ["faqs"]
  }
}
```

> **Two important behaviour changes when this is set:**
> 1. The generative response is **not streamed in chunks** — the whole answer is returned as one block.
> 2. The `citations` parameter is **disabled**. Citations must be modelled into the schema itself (e.g. `citation_resource_id` per item).

Foundations Build 5 covers the schema-design patterns (additionalProperties: false at every level, verbatim-id discipline, the three common failure modes).

> **Tip:** include a `description` for each schema field. The LLM uses descriptions to disambiguate.

---

## 18. Security

### `security` (object or null)

Security-tag-based access control. The platform enforces that the requesting principal has at least one matching tag.

```json
{
  "security": {
    "groups": ["analysts", "compliance-officers"]
  }
}
```

Reference: [restrict-access](https://docs.rag.progress.cloud/docs/management/how-to/restrict-access).

Capstone B (Cross-KB Federated Search) leans on this when per-KB visibility is profile-driven.

---

## 19. Search-configuration preset — `search_configuration`

### `search_configuration` (string or null)

Load pre-defined `/ask` parameters from a named configuration. Parameters in the request override parameters from the configuration.

```json
{
  "query": "...",
  "search_configuration": "shopper-profile-v2"
}
```

> **Architecture note:** this is the *platform-native* way to ship Build 6's search profiles. Define each profile as a search configuration on the KB; the partner's front-end sets `search_configuration` based on the active profile; per-query overrides on top of that handle the dynamic bits (custom filters, computed values, etc.).
>
> Use it. Build 6's walkthrough should commit each profile as a `search_configuration` entry on the KB so the front-end's job is just *"pick the right name"* — no per-profile parameter wrangling in client code.

---

## 20. Reasoning

### `reasoning` (boolean or object, default `false`)

Reasoning options for the generative model. Three shapes:

- `false` — default; reasoning disabled.
- `true` — enable default reasoning.
- Object — custom reasoning config (model-dependent).

```json
{ "reasoning": true }
```

Only meaningful for reasoning-capable models (OpenAI o-series, Anthropic Claude 4.x with thinking, etc.). Adds latency and cost; pays back when the question genuinely benefits from chain-of-thought.

For Build 7 and Capstone C (compliance agent), `reasoning: true` is often the right pick — multi-step compliance evaluations benefit from explicit reasoning.

---

## 21. Generate answer toggle

### `generate_answer` (boolean, default `true`)

If `false`, the platform performs retrieval but does **not** call the LLM. The response contains only `retrieval_results`. Useful for retrieval-only testing / debugging — the same body shape as a full `/ask`, just without the LLM cost.

```json
{ "query": "...", "generate_answer": false }
```

> **Why this matters:** Build 4's reranking A/B/C can use `generate_answer: false` to isolate retrieval-quality measurement from LLM-cost measurement. Cleaner than reaching for `/find`.

---

## 22. Observability and debug

### `debug` (boolean, default `false`)

If `true`, includes a `debug` section with queried nodes + extra diagnostic metadata.

```json
{ "debug": true }
```

Indispensable during Build 1 / Build 4 measurement. Turn off in production for cost reasons.

### `show_consumption` (via header `x-show-consumption: true`)

Surfaces token-usage + cost stats in the response.

The header form is canonical. Required for Build 8's tracing dashboard.

---

## 23. Response shape (sync mode)

Sync mode (`x-synchronous: true`) returns a single JSON. Structure:

```json
{
  "answer": "The Aurora TerraTrek 7 is a four-season hiking boot...",
  "status": "success",
  "retrieval_results": {
    "resources": {
      "<resource-id>": {
        "id": "...",
        "title": "...",
        "icon": "...",
        "summary": "...",
        "fields": { ... },
        "extracted": { "text": "..." },
        "relations": { ... },
        "origin": { ... }
      }
    },
    "best_matches": ["resource-id-1/t/body/12-340", "resource-id-2/..."],
    "query": "<rephrased query, if rephrase was on>",
    "min_score": { "semantic": 0.6, "bm25": 0.3 },
    "next_page": false
  },
  "citations": [
    {
      "resource_id": "...",
      "field_id": "...",
      "paragraph_id": "12-340",
      "text": "<cited paragraph excerpt>",
      "score": 0.87
    }
  ],
  "answer_json": { ... },        // present only if answer_json_schema was set
  "consumption": {                // present only if x-show-consumption: true
    "input_tokens": 1245,
    "output_tokens": 187,
    "estimated_cost_usd": 0.0042
  },
  "debug": { ... },               // present only if debug was true
  "trace_id": "..."               // always present; use for support tickets
}
```

### Key fields

- **`retrieval_results.resources`** — keyed by resource ID. Each resource contains the fields requested via `show`. Build 5's citation ledger uses these IDs.
- **`retrieval_results.best_matches`** — array of `"<resource-id>/<field>/<paragraph-id>"` strings. Splitter pattern: `.split('/')[0]` extracts the resource ID (Foundations Build 0 pattern).
- **`citations`** — per-claim citation pointers. `citation_threshold` filters this list.
- **`answer_json`** — present only when `answer_json_schema` was set. Parsed structured output.

---

## 24. Streaming response format

Without `x-synchronous: true`, the endpoint streams. Format depends on tenant configuration; NDJSON is the modern default.

### NDJSON

One JSON object per line, each carrying a `type`:

```
{"type": "answer", "text": "The Aurora TerraTrek 7"}
{"type": "answer", "text": " is a four-season"}
{"type": "retrieval", "resources": { ... }, "best_matches": [...]}
{"type": "citations", "citations": [...]}
{"type": "consumption", "input_tokens": 1245, "output_tokens": 187}
{"type": "done"}
```

### Server-Sent Events (SSE)

```
event: answer
data: {"text": "The Aurora TerraTrek 7"}

event: citation
data: {"resource_id": "...", "paragraph_id": "..."}

event: done
data: {}
```

Foundations Build 0 covers the parser pattern. Build 1 measures streaming latency from first-byte to last-byte.

---

## 25. Related endpoints — what they share

### `/find`

Shares: `query`, `features`, `filters`, `filter_expression`, `keyword_filters`, `resource_filters`, `fields`, `field_type_filter`, `vectorset`, `top_k`, `min_score`, `rank_fusion`, `reranker`, `show`, `range_*`, `show_hidden`, `security`, `highlight`, `debug`.

Doesn't have: `rephrase`, `chat_history`, `extra_context*`, `query_image`, `prompt`, `generative_model`, `max_tokens`, `answer_json_schema`, `prefer_markdown`, `citations`, `citation_threshold`, `rag_strategies`, `rag_images_strategies`, `reasoning`, `generate_answer` (no LLM step).

### `/predict/chat`

Shares: `query` (current turn), `chat_history`, `features`, `vectorset`, `top_k`, `min_score`, `reranker`, `generative_model`, `prompt`, `max_tokens`, `prefer_markdown`, `citations`, `extra_context`, `extra_context_images`, `rag_strategies`, `debug`.

Adds: platform-managed conversation state (when a session ID is provided).

### `/retrieval-agent` (Retrieval Agent endpoint)

Shares: `query`, `chat_history`, `extra_context*`, `filters`, `filter_expression`, `security`, `features`, `vectorset`, `generative_model`, `rag_strategies`, `debug`.

Adds: `brief` (agent system prompt), `schema` (the agent's structured output schema, equivalent to `answer_json_schema`), `tools` (tool catalogue — Build 8), `cost_budget`, `latency_budget`, `include_trace` (returns planner + per-step trace).

Builds 7 and 8 cover these in detail.

---

## 26. Worked examples per Build

### Build 1 — primitive trade-off measurement

```json
{
  "query": "<test query>",
  "top_k": 20,
  "rephrase": false,
  "features": ["semantic", "keyword"],
  "debug": true
}
```

`debug: true` reveals per-feature retrieval scores. `x-show-consumption: true` header gives the cost number. Build 1 also runs the same query with `rephrase: true` to A/B the trade-off matrix.

### Build 2 — custom rephraser prompt

```json
{
  "query": "Apixaban-Warfarin interaction profile",
  "rephrase": true,
  "prompt": "<custom rephraser prompt template with verbatim-preserve directives>",
  "features": ["semantic", "keyword"]
}
```

> Note: `/ask` does not expose a dedicated `rephrase_prompt` field — Build 2's custom rephraser typically lands as platform-side configuration on the KB (via a `search_configuration`), or the partner runs an explicit rephrase step in their own code before calling `/ask` with `rephrase: false`.

### Build 3 — composed filters

```json
{
  "query": "onboarding materials",
  "filter_expression": {
    "and": [
      {
        "or": [
          { "prop": "icon", "value": "application/pdf" },
          { "prop": "icon", "value": "video" }
        ]
      },
      { "prop": "label", "labelset": "region", "value": "emea" },
      { "not": { "prop": "label", "labelset": "classification", "value": "confidential" } }
    ]
  }
}
```

### Build 4 — reranking A/B/C

```json
// Config A — no rerank, retrieval-only for clean measurement
{ "query": "...", "reranker": "noop", "top_k": 50, "generate_answer": false }

// Config B — built-in
{ "query": "...", "reranker": "predict", "top_k": 20, "generate_answer": false }

// Config C — top-K to external reranker in partner code
{ "query": "...", "reranker": "noop", "top_k": 50, "generate_answer": false }
// then partner code reranks top-K via external cross-encoder before
// calling /ask with the reranked top-K as resource_filters and
// generate_answer: true
```

### Build 5 — multi-turn

```json
{
  "query": "What about its waterproofing?",
  "chat_history": [
    { "author": "USER", "text": "Tell me about the Aurora TerraTrek 7." },
    { "author": "NUCLIA", "text": "The Aurora TerraTrek 7 is..." }
  ],
  "rephrase": true,
  "chat_history_relevance_threshold": 0.3,
  "rag_strategies": [
    { "name": "hierarchy" },
    { "name": "neighbouring_paragraphs" }
  ],
  "prefer_markdown": true,
  "citations": "llm_footnotes"
}
```

### Build 6 — per-profile config (shopper)

```json
{
  "query": "<shopper query>",
  "search_configuration": "shopper-profile-v2",
  "filters": ["/classification.labels/visibility/public"]
}
```

> Build 6's deliverable is to *commit each profile as a `search_configuration` on the KB* so the front-end's per-profile job is just *"set the right name"* — most of the lever-tuning happens server-side.

### Build 7 — schema-constrained answer for compliance scenario

```json
{
  "query": "Is our process compliant with GDPR Art. 17?",
  "rephrase": false,
  "features": ["semantic", "keyword"],
  "rag_strategies": [
    {
      "name": "prequeries",
      "queries": [
        { "query": "GDPR Article 17 text", "weight": 1.0 },
        { "query": "data deletion policy", "weight": 1.0 }
      ]
    }
  ],
  "answer_json_schema": {
    "type": "object",
    "properties": {
      "verdict": { "type": "string", "enum": ["compliant", "partial", "non_compliant", "unknown"] },
      "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
      "sub_findings": { "type": "array", "items": { "...": "..." } }
    },
    "required": ["verdict", "confidence", "sub_findings"]
  },
  "reasoning": true
}
```

### Build 8 — full observability + RAG-strategy stack

```json
{
  "query": "<scenario question>",
  "rephrase": true,
  "features": ["semantic", "keyword", "relations"],
  "filter_expression": { ... },
  "rank_fusion": "rrf",
  "reranker": "predict",
  "rag_strategies": [
    {
      "name": "prequeries",
      "queries": [
        { "query": "<planner sub-question 1>", "weight": 1.0 },
        { "query": "<planner sub-question 2>", "weight": 0.7 }
      ]
    },
    { "name": "hierarchy" },
    { "name": "metadata_extension" }
  ],
  "generative_model": "azure-gpt-4o",
  "max_tokens": { "context": 6000, "answer": 600 },
  "answer_json_schema": { ... },
  "show": ["basic", "extracted", "relations", "values"],
  "audit_metadata": {
    "scenario_id": "compliance-eu-ai-act-art-5",
    "tenant_persona": "compliance_officer"
  },
  "debug": true
}
```

Plus header: `x-show-consumption: true`.

---

## 27. Common errors and fixes

| HTTP | Body | Cause | Fix |
|---|---|---|---|
| 401 | `{"detail": "Unauthorized"}` | JWT missing / malformed / expired. | Re-copy from dashboard. Confirm `Bearer ` prefix. |
| 403 | `{"detail": "Forbidden"}` | Authed but service account lacks `READER` (or higher) role on the KB. | Issue a new SA with the right role. |
| 404 | `{"detail": "Not Found"}` | `kbid` wrong, or KB is in a different region than the API URL. | Re-copy KB ID. Confirm region match. |
| 422 | `{"detail": [{"type": "json_invalid", "msg": "JSON decode error", "ctx": {"error": "Expecting value"}}]}` | Body is malformed JSON. **Common on Windows cmd.exe** — single quotes don't strip. | Use PowerShell / WSL; or `-d @body.json` from a file; or use the dashboard. See the vibe-coding-guide's *"A note for Windows users on `curl` and the dashboard"*. |
| 422 | `{"detail": [{"type": "value_error", "loc": ["body", "query"]}]}` | `query` empty / whitespace-only. | Send a non-empty query (max 20,000 chars). |
| 422 | `{"detail": [{"type": "value_error", "loc": ["body", "top_k"]}]}` | `top_k` outside `[1..200]`. | Cap at 200. |
| 422 | `{"detail": [{"type": "value_error", "loc": ["body", "answer_json_schema"]}]}` | Invalid JSON schema. | Validate against JSON Schema spec. Foundations Build 5 covers common shapes. |
| 429 | `{"detail": "Rate limit exceeded"}` | Tenant rate limit. | Exponential backoff. Foundations Build 11 covers the rate-limit conversation. |
| 500 / 503 | various | Platform issue. | Retry with backoff. Open a support ticket with `trace_id`. |

---

## See also

- Foundations Build 0 — *Hello ARAG* — first `/ask` introduction.
- Foundations Build 5 — *Structured Outputs* — `answer_json_schema` patterns.
- Foundations Build 11 — *Production Readiness* — BYO-LLM, rate limits, residency.
- Course Build 1 — *Search Primitives Deep Dive* — trade-off matrix.
- Course Build 2 — *Query Understanding & Rephrasing* — `rephrase` + custom prompts.
- Course Build 3 — *Filter Composition at Depth* — `filters` + `filter_expression`.
- Course Build 4 — *Reranking Strategies* — `rank_fusion` + `reranker` + adaptive post-processing.
- Course Build 5 — *Multi-Turn Conversational Retrieval* — `chat_history`.
- Course Build 6 — *Search Profiles* — `search_configuration` as the native shipping mechanism.
- Course Build 7 — *Retrieval Agents 101* — `answer_json_schema` + `rag_strategies.prequeries`.
- Course Build 8 — *Agent Decomposition, Tool Use & Cost Observability* — `debug` + `x-show-consumption` for tracing.
- Nuclia docs: [search-filters](https://docs.nuclia.dev/docs/rag/advanced/search-filters), [search-in-a-specific-field](https://docs.nuclia.dev/docs/rag/advanced/search/#search-in-a-specific-field), [restrict-access](https://docs.rag.progress.cloud/docs/management/how-to/restrict-access).
