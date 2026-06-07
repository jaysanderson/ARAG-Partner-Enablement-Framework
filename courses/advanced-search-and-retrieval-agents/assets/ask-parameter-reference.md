# `/ask` — Exhaustive Parameter Reference

> Part of [Advanced Search & Retrieval Agents](../README.md). The canonical reference for every parameter, header, and response field of ARAG's `/ask` endpoint.
>
> Every Build in this course tunes one or more of these parameters. This reference is what partners flip to during scoping conversations and during the in-the-weeds tuning work. Read it once cover-to-cover during Build 1, then return to it per Build.

---

## Contents

1. [Endpoint shape](#1-endpoint-shape)
2. [Headers](#2-headers)
3. [Query inputs](#3-query-inputs)
4. [Retrieval-mode control](#4-retrieval-mode-control)
5. [Query understanding](#5-query-understanding)
6. [Filters](#6-filters)
7. [Reranking](#7-reranking)
8. [Result shaping](#8-result-shaping)
9. [Generation control](#9-generation-control)
10. [Schema-constrained output](#10-schema-constrained-output)
11. [Multi-turn / conversational context](#11-multi-turn--conversational-context)
12. [Observability and debug](#12-observability-and-debug)
13. [Response shape](#13-response-shape)
14. [Streaming response format](#14-streaming-response-format)
15. [Related endpoints — what they share](#15-related-endpoints--what-they-share)
16. [Worked examples per Build](#16-worked-examples-per-build)
17. [Common errors and fixes](#17-common-errors-and-fixes)

---

## 1. Endpoint shape

```
POST {NUCLIA_API_URL}/kb/{NUCLIA_KB_ID}/ask
```

Request: JSON body. Response: JSON (sync mode) or NDJSON / SSE stream (streaming mode).

All other parameters covered below live in the request body or in headers, with a handful in the query string.

---

## 2. Headers

| Header | Required | Purpose | Notes |
|---|---|---|---|
| `X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>` | **Yes** | Auth. The service-account JWT issued for the KB. | Treat as a password. Use a per-environment account. |
| `Content-Type: application/json` | **Yes** | Body format. | Always JSON. |
| `x-synchronous: true` | No (recommended) | Force sync mode — full response in one POST. Without this, the endpoint streams. | Use for server-to-server pipelines, structured-output extraction, batch generation. Build 1 covers the sync-vs-stream choice in depth. |
| `x-ndb-client: <string>` | No | Identifies the calling client for tenant analytics. | Customary values: `"web"`, `"mobile"`, `"backend"`, partner-specific identifiers. |
| `x-show-consumption: true` | No | Equivalent to `show_consumption` in the body — surfaces token-usage stats. | See §12. Useful for cost dashboards (Build 8). |
| `Accept-Language: <locale>` | No | Locale hint for the LLM's response language. Optional; usually best controlled via the prompt. | If set, the platform will prefer answers in the requested language. |
| `User-Agent: <string>` | Auto | Standard HTTP. Logged for traffic analytics. | |

---

## 3. Query inputs

### `query` (string, **required**)

The user's question. Free text. Length limit is tenant-dependent (typically 4–8 KB of text).

**Notes:**
- Whitespace is preserved.
- Markdown is treated as plain text.
- Code fences and quotes are not specially interpreted.

**Gotcha:** Empty or whitespace-only queries return a 422.

### `context` (array of `{author, text}`, optional)

Prior conversation turns. Each entry: `{author: "USER" | "NUCLIA", text: "..."}`. Build 5 covers this in depth.

```json
{
  "query": "What about its waterproofing?",
  "context": [
    { "author": "USER", "text": "Tell me about the Aurora TerraTrek 7." },
    { "author": "NUCLIA", "text": "The Aurora TerraTrek 7 is..." }
  ]
}
```

When `context` is set, the platform's history-aware rephraser uses it to resolve pronouns and follow-ups.

### `extra_context` (array of strings, optional)

Partner-supplied context that the LLM should consider alongside retrieved content. Typical uses:
- Customer-session metadata (current user role, active workspace).
- Brand voice or tone guidance.
- Pre-computed facts the partner wants surfaced (current date, exchange rate, etc.).

```json
{
  "query": "...",
  "extra_context": [
    "The current user is a Trail Club Pro member.",
    "Today's date is 2027-09-14."
  ]
}
```

`extra_context` does not affect retrieval — it only modifies the LLM's generation step.

### `query_image` (object, optional, multimodal)

Image input alongside the textual query. Shape: `{ uri: string, alt?: string }` or `{ base64: string, mime_type: string }`.

```json
{
  "query": "Is this product in stock?",
  "query_image": { "uri": "https://example.com/photo.jpg" }
}
```

Used for visual-grounding scenarios. Tenant-gated; not all deployments expose it.

---

## 4. Retrieval-mode control

These parameters control the **retrieval** step that happens before the LLM generates.

### `features` (array, default `["semantic", "keyword"]`)

Which retrieval engines run. Accepted values:

| Value | What it does |
|---|---|
| `semantic` | Dense-vector retrieval over the KB's embeddings. The default. |
| `keyword` | BM25 / inverted-index retrieval. Catches named entities, IDs, exact strings the embedding may miss. |
| `relations` | Graph-traversal retrieval over the KB's typed-entity graph (populated by the data-augmentation graph agent). |
| `fulltext` | Full-text scan. Slower; useful when keyword-tokenisation misses (e.g. customer's content has unusual whitespace handling). |

```json
{ "features": ["semantic", "keyword"] }    // hybrid — recommended default
{ "features": ["semantic"] }               // pure-vector — for conceptual queries
{ "features": ["keyword"] }                // pure-keyword — for entity-heavy queries
{ "features": ["semantic", "relations"] }  // graph-augmented — Build 8 capstone surface
```

Build 1's trade-off matrix measures these. Build 2 tunes them per query archetype.

### `vectorset` (string, optional)

Which embedding model to retrieve against. KBs can have multiple vectorsets (e.g. one English-tuned, one multilingual). Default is the KB's primary vectorset.

```json
{ "vectorset": "multilingual-e5-large" }
```

Use this when the KB is configured with a domain-specific or multilingual embedding model. Build 1 covers when this matters.

### `top_k` (integer, default platform-dependent, typically 20)

How many candidates the retrieval step returns *before* reranking.

```json
{ "top_k": 30 }
```

Higher `top_k` gives the reranker more material to work with (helpful for high-precision use cases). Lower `top_k` is faster.

### `page_size` (integer, default 20) and `page_number` (integer, default 0)

How many *resources* to return *after* reranking, and which page.

```json
{ "page_size": 10, "page_number": 0 }
```

Note: `page_size` is per-resource, not per-paragraph. A single resource may contribute multiple paragraphs to the answer's grounding.

### `min_score` (object, optional)

Minimum relevance score per retrieval mode. Filters out low-confidence candidates before the LLM sees them.

```json
{
  "min_score": {
    "semantic": 0.6,
    "bm25": 0.3
  }
}
```

Raising `min_score` improves precision at the cost of recall. Build 4's reranker work pairs naturally with `min_score` tuning.

### `shards` (array, optional)

For sharded KBs, restrict retrieval to specific shards. Rarely used at the partner level; tenant-dependent.

### `highlight` (boolean, default `true`)

If `true`, the response includes per-paragraph highlight markers showing which spans matched the query. Useful for rendering match-highlighting in the UI.

---

## 5. Query understanding

### `rephrase` (boolean, default `true` on `/ask`)

If `true`, the platform runs the user's query through an LLM with a built-in rephraser prompt before embedding + retrieval. The rephrased query is what gets embedded and matched.

```json
{ "rephrase": true }
```

Build 2 covers when this helps and when it hurts. The two-line summary:

- **Helps:** conceptual and exploratory queries; corpus uses different vocabulary from the user.
- **Hurts:** factoid and navigational queries; corpus uses the user's exact terms.

### `rephrase_prompt` (string, optional)

Custom rephraser prompt. Overrides the platform's default rephraser. Build 2's deliverable is exactly this prompt with verbatim-preserve directives for vertical terminology.

```json
{
  "rephrase_prompt": "Rephrase the user's question to improve retrieval against a corpus containing pharmaceutical research. Preserve verbatim: all compound names, regulatory citations (e.g. 'FDA 21 CFR Part 820'), and proper nouns. Return only the rephrased question."
}
```

### `autofilter` (boolean, default `false`)

If `true`, the platform auto-detects filter intent from the query and applies inferred filters automatically. *"Show me PDF guides about onboarding"* might infer `content_type:application/pdf`.

```json
{ "autofilter": true }
```

Useful for casual-user surfaces (shopper profile in Build 6). Not appropriate for analyst surfaces where the user expects to apply filters explicitly.

---

## 6. Filters

### `filters` (array of strings, optional)

Explicit filter expressions. Each entry is a filter path string. Stacked filters compose with **AND** by default.

```json
{
  "filters": [
    "/icon/application/pdf",
    "/classification.labels/topic/onboarding",
    "/origin.tags/region/emea"
  ]
}
```

Build 3 covers the filter syntax in depth + the reusable UI component that emits these strings.

### `filter_expression` (object, optional, advanced)

A boolean tree of filter clauses with explicit AND / OR / NOT semantics. Use when `filters` (which is AND-only) isn't expressive enough.

```json
{
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

Build 3's reusable UI component renders `filter_expression` trees end-to-end.

**Gotcha:** `filters` and `filter_expression` can be combined; if both are present, they're AND-ed together.

### `security` (object, optional)

Security-tag-based access control. The platform enforces that the requesting principal has at least one matching tag.

```json
{
  "security": {
    "groups": ["analysts", "compliance-officers"]
  }
}
```

Used in enterprise scenarios where access boundaries are enforced at retrieval time. Capstone B leans on this.

### Hidden resources

`show_hidden: true` includes resources marked hidden. Default is `false`. Hidden resources are typically WIP or staged content the customer hasn't published yet.

---

## 7. Reranking

### `reranker` (string, default `"default"`)

Which reranker runs over the retrieved candidates. Accepted values are tenant-dependent; canonical options:

| Value | What it does |
|---|---|
| `"default"` | Platform's built-in reranker. Sub-second. Most production use cases. |
| `"multi_match_booster"` | Boosts candidates that match multiple retrieval features (semantic + keyword + relations). |
| `"noop"` | No reranking. Returns first-pass order. |
| `"external"` | Hands off to an external reranker (BGE, Cohere, etc.) configured at the KB level. |

```json
{ "reranker": "default" }
```

Build 4 measures these against each other and documents the decision matrix.

For **adaptive reranking** (Build 4's deliverable), the partner runs `reranker: "noop"` on `/ask`, then post-processes the top-K through an external cross-encoder before the LLM-generation step. The adaptive logic lives in partner code, not in this parameter.

---

## 8. Result shaping

### `show` (array of strings, default `["basic", "values"]`)

Which sections of each retrieved resource the response includes.

| Value | Includes |
|---|---|
| `"basic"` | Title, slug, icon, summary. |
| `"values"` | Custom fields (Foundations Build 9 — Field Engineering). |
| `"origin"` | Source URL, ingest metadata, tags. |
| `"extracted"` | Extracted text content. |
| `"classification"` | Applied labels and label sets. |
| `"errors"` | Per-resource error states (rare). |
| `"security"` | Security tags and groups. |

```json
{ "show": ["basic", "values", "origin", "classification"] }
```

The renderer uses these. Catalog-style surfaces want `["basic", "values", "origin", "classification"]`. Grounded-answer surfaces typically need only `["basic", "extracted"]`.

### `extracted` (array of strings, optional)

If `show` includes `"extracted"`, this controls which extracted fields come back. Common values: `["text"]`, `["text", "metadata"]`, `["all"]`.

### `prefer_markdown` (boolean, default `false`)

If `true`, the LLM-generated answer comes back as markdown. Tables, lists, bold, italic all preserved. Default returns plain text.

```json
{ "prefer_markdown": true }
```

Set this for any UI that renders markdown. Don't set it for surfaces that expect plain prose.

### `citations` (boolean, default `true`)

If `true`, the response includes per-claim citation pointers. Default is on — turn it off only for stripped-down surfaces.

### `citation_threshold` (number, default tenant-dependent, typically `0.5`)

Minimum confidence below which the platform suppresses a citation. Lower → more citations, including low-confidence ones. Higher → fewer, higher-confidence citations.

```json
{ "citation_threshold": 0.65 }
```

For high-stakes surfaces (compliance, medical), raise this to ~0.7. For exploratory surfaces, lower to ~0.4.

---

## 9. Generation control

### `generative_model` (string, optional)

Which LLM generates the answer. Override of the KB's configured default (BYO-LLM — Foundations Build 11).

```json
{ "generative_model": "azure-gpt-4o" }
```

Common values are tenant-specific. Examples: `"openai-gpt-4o"`, `"anthropic-claude-3-5-sonnet"`, `"azure-gpt-4-turbo"`, `"vertex-gemini-1-5-pro"`, `"bedrock-claude-3-haiku"`.

Use this for:
- A/B-testing model choice for the customer's scenarios.
- Cost optimisation (cheaper model for low-stakes queries via search-profile selection — Build 6).
- Latency optimisation (smaller model for latency-tight surfaces).

### `prompt` (string, optional)

Full custom generation prompt. Overrides the platform's default `/ask` prompt entirely. Use with care — losing the platform's grounding discipline is easy if the partner writes a sloppy prompt.

```json
{
  "prompt": "You are a compliance researcher. Use ONLY the retrieved context to answer. Every claim must cite a source. If you cannot ground a claim, say so explicitly.\n\nContext:\n{context}\n\nQuestion:\n{question}"
}
```

The `{context}` and `{question}` placeholders are replaced by the platform.

### `system_prompt` (string, optional) and `user_prompt` (string, optional)

Finer-grained versions of `prompt` for tenants that expose them. `system_prompt` becomes the system message; `user_prompt` is the user-role message template.

```json
{
  "system_prompt": "You are an Aurora Outfitters expert. Answer using only the provided context.",
  "user_prompt": "Question: {question}\n\nContext:\n{context}\n\nAnswer:"
}
```

Tenant-gated; not all deployments expose them. Prefer `prompt` if available.

### `max_tokens` (integer, optional, default tenant-dependent)

Maximum tokens for the generated answer. Caps length and cost.

```json
{ "max_tokens": 400 }
```

Latency and cost scale roughly linearly with `max_tokens`. Build 8's cost budgeting uses this lever.

---

## 10. Schema-constrained output

### `answer_json_schema` (object, optional)

If set, the platform forces the LLM to produce JSON matching the schema. The answer comes back as a parsed object instead of prose.

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

This is the lever Foundations Build 5 introduced. The advanced course uses it in Build 7 (agent structured output) and every capstone.

**Three failure modes when this fires** (and the fixes):

1. **LLM produces extra fields not in the schema.** Fix: add `additionalProperties: false` at every object level. Foundations Build 5 covers this pattern.
2. **LLM produces empty arrays.** Fix: add a `minItems: 1` constraint or instruct the LLM to omit the field entirely rather than emit an empty array.
3. **LLM produces non-existent citation IDs.** Fix: explicit verbatim-id discipline in the prompt (Foundations Build 5's pattern).

---

## 11. Multi-turn / conversational context

The `context` parameter (covered in §3) carries prior turns. Build 5 covers the full multi-turn surface design.

### Context-window-management considerations

The platform's history-aware rephraser uses `context` for co-reference resolution. As `context` grows, the platform applies an internal context-window strategy. The partner-side strategy (Build 5's hybrid summarisation) is what produces the `context` array sent on each turn.

A common pattern:

```typescript
function buildContextForAsk(state: ConversationState): { author: string; text: string }[] {
  const recent = state.turns.slice(-6);
  const older = state.turns.slice(0, -6);

  const summary = older.length > 0
    ? [{ author: 'NUCLIA', text: summariseOlder(older, state.citationLedger) }]
    : [];

  return [
    ...summary,
    ...recent.map(t => ({ author: t.role === 'user' ? 'USER' : 'NUCLIA', text: t.text })),
  ];
}
```

### `chat_history` (alias, deprecated on some tenants)

Older tenants accept `chat_history` instead of `context`. The shape is the same. Prefer `context` on new builds.

---

## 12. Observability and debug

### `debug` (boolean, default `false`)

If `true`, the response includes a `debug` section with:
- The rephrased query (after any rephrasing).
- Per-feature retrieval scores.
- Reranker scores.
- Prompt used (after any `prompt` substitution).

```json
{ "debug": true }
```

Indispensable during the Build 1 / Build 4 measurement work. Turn off in production for cost reasons (the debug payload is large).

### `show_consumption` (boolean, default `false`)

If `true`, the response includes token-usage and cost stats.

```json
{ "show_consumption": true }
```

Equivalent to the `x-show-consumption: true` header. Required for Build 8's tracing dashboard.

---

## 13. Response shape

Sync mode (`x-synchronous: true`) returns a single JSON object. Structure:

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
        "classification": { ... },
        "origin": { ... }
      }
    },
    "best_matches": ["resource-id-1/t/body/12-340", "resource-id-2/..."],
    "query": "<rephrased query, if rephrase was on>",
    "min_score": { "semantic": 0.6, "bm25": 0.3 },
    "next_page": false,
    "page_size": 10
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
  "answer_json": { ... },               // present only if answer_json_schema was set
  "consumption": {                       // present only if show_consumption was true
    "input_tokens": 1245,
    "output_tokens": 187,
    "estimated_cost_usd": 0.0042
  },
  "debug": { ... },                      // present only if debug was true
  "trace_id": "..."                      // always present; useful for support tickets
}
```

### `retrieval_results.resources`

Object keyed by resource ID. Each resource contains the fields you requested via `show`. Build 5's citation ledger uses this — every citation in the answer references a resource ID in this map.

### `retrieval_results.best_matches`

An array of strings shaped like `"<resource-id>/<field>/<paragraph-id>"`. The first segment is the resource ID; the splitter pattern Foundations Build 0 teaches uses `.split('/')[0]` to extract just the resource ID.

### `citations`

Per-claim citation pointers. Each entry references a resource ID + paragraph ID + the cited text excerpt + a relevance score. The `citation_threshold` parameter filters this list.

### `answer_json`

Present only when `answer_json_schema` was set. The parsed structured output.

---

## 14. Streaming response format

Without `x-synchronous: true`, the endpoint streams. The stream format depends on tenant configuration:

### NDJSON (newline-delimited JSON)

One JSON object per line, each carrying a `type` field:

```
{"type": "answer", "text": "The Aurora TerraTrek 7"}
{"type": "answer", "text": " is a four-season"}
{"type": "citation", "resource_id": "...", "paragraph_id": "..."}
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

The streaming wrapper code parses either format. Foundations Build 0 covers the parser pattern. Build 1 measures streaming-mode latency from first-byte and last-byte.

---

## 15. Related endpoints — what they share

The `/ask` parameter surface is the broadest. Sibling endpoints share much of it:

### `/find`

Shares: `query`, `features`, `filters`, `filter_expression`, `vectorset`, `top_k`, `page_size`, `page_number`, `min_score`, `reranker`, `show`, `extracted`, `highlight`, `security`, `shards`, `autofilter`, `debug`.

Doesn't have: `rephrase`, `rephrase_prompt`, `generative_model`, `prompt`, `system_prompt`, `user_prompt`, `max_tokens`, `answer_json_schema`, `prefer_markdown`, `citations`, `citation_threshold`, `context`, `extra_context`, `chat_history` (no LLM call).

### `/search`

Shares everything `/find` does, plus richer `show` defaults (always includes `classification`).

### `/predict/chat`

Shares: `query` (as the current turn), `context` (conversation history), `features`, `vectorset`, `top_k`, `min_score`, `reranker`, `generative_model`, `prompt`, `system_prompt`, `user_prompt`, `max_tokens`, `prefer_markdown`, `citations`, `extra_context`, `debug`, `show_consumption`.

Adds: conversation-state-id management (the platform tracks state automatically across calls when a session ID is provided).

### `/retrieval-agent` (Retrieval Agent endpoint)

Shares: `query` as the user question, `context`, `extra_context`, `filters`, `filter_expression`, `security`, `features` (per sub-query), `vectorset`, `generative_model`, `debug`, `show_consumption`.

Adds: `brief` (agent system prompt), `schema` (`answer_json_schema` equivalent), `tools` (tool catalogue — Build 8), `cost_budget`, `latency_budget`, `include_trace` (returns the planner output + per-step trace).

Builds 7 and 8 cover these in detail.

---

## 16. Worked examples per Build

### Build 1 — measuring trade-offs

```json
{
  "query": "your test query",
  "prefer_markdown": false,
  "rephrase": true,
  "features": ["semantic", "keyword"],
  "page_size": 10,
  "debug": true,
  "show_consumption": true
}
```

`debug: true` reveals per-feature retrieval scores; `show_consumption: true` gives the cost number for the trade-off matrix.

### Build 2 — custom rephraser

```json
{
  "query": "Apixaban-Warfarin interaction profile",
  "rephrase": true,
  "rephrase_prompt": "Rephrase the user's question to improve retrieval against a pharmaceutical research corpus. Preserve verbatim: all compound names (e.g. 'Apixaban'), all regulatory citations (e.g. 'FDA 21 CFR Part 820'), and all proper nouns of trials or studies. Return only the rephrased question.",
  "features": ["semantic", "keyword"]
}
```

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

### Build 4 — measuring reranker A/B/C

```json
// Config A — no rerank
{ "query": "...", "reranker": "noop", "page_size": 20, "show_consumption": true }

// Config B — built-in
{ "query": "...", "reranker": "default", "page_size": 20, "show_consumption": true }

// Config C — external (post-process in partner code)
{ "query": "...", "reranker": "noop", "top_k": 50, "show_consumption": true }
// then partner code reranks top-K via external cross-encoder
```

### Build 5 — multi-turn

```json
{
  "query": "What about its waterproofing?",
  "context": [
    { "author": "USER", "text": "Tell me about the Aurora TerraTrek 7." },
    { "author": "NUCLIA", "text": "The Aurora TerraTrek 7 is a four-season..." }
  ],
  "prefer_markdown": true,
  "citations": true
}
```

### Build 6 — per-profile config (shopper)

```json
{
  "query": "<shopper query>",
  "rephrase": true,
  "rephrase_prompt": "<shopper-casual prompt>",
  "filters": ["/classification.labels/visibility/public"],
  "reranker": "default",
  "generative_model": "azure-gpt-4o-mini",
  "max_tokens": 200,
  "prefer_markdown": true,
  "citation_threshold": 0.5
}
```

### Build 7 — schema-constrained answer

```json
{
  "query": "Is our process compliant with GDPR Art. 17?",
  "rephrase": false,
  "features": ["semantic", "keyword"],
  "answer_json_schema": {
    "type": "object",
    "properties": {
      "verdict": { "type": "string", "enum": ["compliant", "partial", "non_compliant", "unknown"] },
      "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
      "sub_findings": { "type": "array", "items": { "...": "..." } }
    },
    "required": ["verdict", "confidence", "sub_findings"]
  },
  "citations": true,
  "show_consumption": true
}
```

### Build 8 — full observability

```json
{
  "query": "<scenario question>",
  "rephrase": true,
  "features": ["semantic", "keyword"],
  "filters": [...],
  "filter_expression": { ... },
  "reranker": "default",
  "generative_model": "azure-gpt-4o",
  "max_tokens": 500,
  "answer_json_schema": { ... },
  "citations": true,
  "citation_threshold": 0.65,
  "show": ["basic", "extracted", "classification"],
  "debug": true,
  "show_consumption": true
}
```

---

## 17. Common errors and fixes

| HTTP status | Body | Cause | Fix |
|---|---|---|---|
| 401 | `{"detail": "Unauthorized"}` | JWT missing, malformed, or expired. | Re-copy from the dashboard. Confirm `Bearer ` prefix. |
| 403 | `{"detail": "Forbidden"}` | Auth is valid but the service account lacks access to this KB. | Issue a new SA bound to the correct KB. |
| 404 | `{"detail": "Not Found"}` | KB ID is wrong, or the KB is in a different region. | Re-copy KB ID. Confirm the API URL matches the KB's region. |
| 422 | `{"detail": [{"type": "json_invalid", "msg": "JSON decode error", "ctx": {"error": "Expecting value"}}]}` | Body is malformed JSON. **Common on Windows cmd.exe** — single quotes don't strip. | Use PowerShell or WSL; save the body to a file and `-d @body.json`; or use the dashboard's Search panel. The course's vibe-coding-guide covers this in depth. |
| 422 | `{"detail": [{"type": "value_error", "loc": ["body", "query"]}]}` | `query` is empty or whitespace-only. | Send a non-empty query. |
| 422 | `{"detail": [{"type": "value_error", "loc": ["body", "answer_json_schema"]}]}` | Schema is invalid. | Validate the schema against JSON Schema spec. Foundations Build 5 covers the common shapes. |
| 429 | `{"detail": "Rate limit exceeded"}` | Tenant rate limit hit. | Back off + retry; or upgrade tenant tier. |
| 500 / 503 | various | Platform issue. | Retry with exponential backoff. Open a support ticket with the `trace_id`. |

---

## See also

- Foundations Build 0 — *Hello ARAG* — first introduction to `/ask`.
- Foundations Build 5 — *Structured Outputs* — schema-constrained answers.
- Foundations Build 11 — *Production Readiness* — BYO-LLM configuration.
- Course Build 1 — *Search Primitives Deep Dive* — trade-off matrix across primitives.
- Course Build 2 — *Query Understanding & Rephrasing* — `rephrase` + `rephrase_prompt`.
- Course Build 3 — *Filter Composition at Depth* — `filters` + `filter_expression`.
- Course Build 4 — *Reranking Strategies* — `reranker` + adaptive post-processing.
- Course Build 5 — *Multi-Turn Conversational Retrieval* — `context` parameter.
- Course Build 6 — *Search Profiles* — per-profile parameter bundles.
- Course Build 7 — *Retrieval Agents 101* — agent-endpoint parameters that share with `/ask`.
- Course Build 8 — *Agent Decomposition, Tool Use & Cost Observability* — `debug` + `show_consumption` for tracing.
