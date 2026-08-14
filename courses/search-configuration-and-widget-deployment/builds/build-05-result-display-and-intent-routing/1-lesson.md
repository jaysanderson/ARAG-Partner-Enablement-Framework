# Build 05 — Lesson: Result Display & User Intent Routing

> Read time: 12 minutes.

## Why this is in the course

Builds 01–04 tuned what the platform retrieves and generates. None of that controls what the end user actually *sees* on the page — a shopper widget and an internal staff tool can run the exact same retrieval and generation and still need to render completely different result lists. That's the dashboard's **Result Display** tab (`ResultDisplayConfig`), the first half of this Build. The second half, **User Intent Routing** (`RoutingConfig`), is a different problem: catching a query whose *intent* is already known before it reaches the default flow, and giving it a canned answer or a different model instead. Both live in the same `search_configuration` `config` block from Build 00.

## Result Display: what the result list shows

Every field below is a key in `ResultDisplayConfig`, settable on the dashboard's Result Display tab or inline on `/find`/`/ask`.

### The on/off switch

`displayResults` (boolean) — whether results render at all. Off is a legitimate choice for a chat-only widget where you never want the underlying retrieval list visible, only the generated answer.

### What kind of list

`showResultType` — `citations | all-resources | llmCitations`:

- **`citations`** — a citation-only view: just the sources the answer actually referenced.
- **`all-resources`** — the full retrieved resource list, whether or not the answer cited it.
- **`llmCitations`** — citations specifically as generated/formatted by the LLM, distinct from the raw retrieval citation list.

Pick `citations` for a clean shopper-facing answer surface; `all-resources` when the user benefits from seeing everything retrieval found, cited or not (research and internal tools).

### Row content

- **`displayMetadata`** (boolean) — show resource metadata on each result row.
- **`metadatas`** (optional string array) — when `displayMetadata` is on, which specific fields to show. Leave unset to show everything available; set it to curate (e.g. just `["author", "publish_date"]`) instead of dumping every field a resource carries.
- **`displayThumbnails`** (boolean) — show a thumbnail image per result row.
- **`displayFieldList`** (boolean) — show the list of resource fields (useful when a resource has multiple fields, e.g. a main field plus an updates field — see Build 03's `field_extension`).
- **`showAttachedImages`** (boolean) — show images attached to a matched result, distinct from `displayThumbnails` (row-level thumbnail) and from Build 04's `rag_images_strategies` (images pulled into the *generation* context, not the display list).

### The generative answer, hidden vs. skipped

> **Gotcha.** `hideAnswer` (boolean) hides the generated answer client-side — the widget still calls the LLM, still pays for the generation, and just doesn't render it. It's a display choice, not a cost choice: use it when a surface wants retrieval-only results visually but the underlying `search_configuration` is shared with another surface that needs the answer too. If the actual goal is "don't pay for generation," the correct lever is Build 02's `generate_answer: false`, which skips the LLM call entirely. Partners regularly reach for `hideAnswer` when they mean `generate_answer: false` — the visual result looks identical (no answer shown) but one of them is quietly burning tokens on every call.

### Structured display

- **`jsonOutput`** (boolean) + **`jsonSchema`** (string) — render results as structured JSON against a schema instead of free text. This is the display-tab version of the idea; [Developer Foundations Build 5](../../../developer-foundations/builds/build-05-structured-outputs/)'s `answer_json_schema` is the deeper API-level primitive that actually binds the LLM's *generation* to a schema. Reach for `jsonOutput`/`jsonSchema` when you just need the display layer to render structured fields from what's already being returned; reach for `answer_json_schema` when the model itself needs to be constrained to produce that shape.

### Relations and the knowledge graph

**`relations`** (boolean) + **`relationGraph`** (boolean) — show a result's relation data, and optionally a visual relation-graph, when the underlying resource has graph relations attached. This connects directly to Build 03's `graph_beta` RAG strategy: a resource only has relations to show here if something (ingestion, `graph_beta` extraction) put them there first. Turning `relations` on against a KB with no extracted graph data just shows nothing — it's a display switch, not an extraction trigger.

### Citation confidence

**`citationThreshold`** (number) + **`customizeThreshold`** (boolean) — `citationThreshold` is the minimum relevance/confidence score a citation needs to be shown at all; `customizeThreshold` is the gate that decides whether that threshold is even adjustable per call/config, versus locked to the platform default. Raise the threshold for an internal/staff view where a wrong citation is embarrassing; leave it at platform default for a shopper view where recall matters more than precision.

### Layout

- **`sortResults`** (boolean) — whether the end user can re-sort the result list (vs. a fixed relevance order).
- **`noScroll`** (boolean) — disable scrolling inside the widget's own result area. Use this when the widget is embedded in a layout tight enough that you want the *parent page* to scroll instead of a nested scroll region — a common fix for widgets embedded inside another product's panel.

## User Intent Routing: catching intent before the default flow runs

Routing is a genuinely different mechanism from anything in Builds 01–04. It doesn't tune retrieval or generation — it intercepts a query, checks whether it matches a described intent, and if so, changes what happens next.

### Turning it on

```json
{ "useRouting": true, "routing": { "rules": [ /* ... */ ] } }
```

`useRouting` is the on/off gate for the whole feature. `routing` carries the actual rule set, an object with three confirmed properties.

### Rules: natural-language prompts, not keyword matches

```json
{
  "routing": {
    "rules": [
      {
        "prompt": "the user is asking about return or refund policy",
        "direct_answer": "Aurora Outfitters accepts returns within 90 days of delivery, in resale condition with original packaging and receipt. See our Returns Policy page for details."
      }
    ]
  }
}
```

Each rule is defined by a **`prompt`** — a natural-language description of the intent to detect (*"the user wants pricing information"*, *"the user is asking to file a support ticket"*), not a keyword list or regex. When an incoming query matches a rule's described intent, that rule's behaviour applies instead of the default retrieve-and-generate flow.

### What a matching rule can do

Two confirmed levers, usable independently or together:

- **`direct_answer`** (optional string) — the widget returns this exact canned answer, bypassing generation entirely. Right for a known, frequently-asked intent — "what are your business hours," a returns policy summary — where the answer never changes and a fresh LLM call every time is pure waste. Zero generation cost, perfectly consistent wording, every time.
- **`generative_model`** (optional string) — override which LLM handles the query when this rule matches, instead of the widget's default `generativeModel` (Build 02). Right for routing complex or ambiguous intents to a stronger, more expensive model while everything else stays on the cheaper default — or the inverse: route simple, well-understood intents to a cheap model (or to `direct_answer`, skipping the model call altogether).

> **Be precise about what Routing is.** The confirmed schema gives a matching rule exactly two levers: a canned `direct_answer` and/or a `generative_model` override. There is no documented `Routing` field that swaps the entire retrieval strategy or `search_configuration` per rule. If you want different audiences to hit different `search_configuration`s entirely (different filters, different `rag_strategies`, different prompts), that's a pattern partners build on top of Routing using their own application logic — e.g. detecting audience some other way and choosing which named `search_configuration` to call — **not a native `Routing` field.** Don't tell a customer Routing does per-rule retrieval swapping; it doesn't, as confirmed.

### Gotcha: a rule that's too broad hijacks queries it shouldn't

> **Gotcha.** Routing rules evaluate before or alongside the main query — a rule prompt scoped too broadly can match queries you never intended, silently replacing a real generated answer with a stale `direct_answer` or routing a nuanced question to a model it doesn't need. *"The user is asking about returns"* might also match *"can I return a defective item I bought as a gift for someone in another country"* — a case where a canned answer misses real nuance the customer needed answered. Test every routing rule against a range of real queries pulled from actual usage or support logs, not just the one trigger phrase you designed it around, before shipping it live.

## What's next

[Build 06 — RAG Lab & Prompt Lab](../build-06-rag-lab-and-prompt-lab/) — where you stop configuring one option at a time and start comparing whole setups (models, prompts, RAG strategies) side by side before committing a winner to production.
