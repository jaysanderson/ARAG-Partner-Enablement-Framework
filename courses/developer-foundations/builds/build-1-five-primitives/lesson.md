# Build 1 — Lesson: The Five Primitives

> Read time: 15 minutes. Companion to the 15-minute [video](video-script.md).

## Why this is Build 1

Every Build past this one drills into one primitive. Today you see all five at once. The point isn't depth — it's recognition. When a customer says *"can it do X?"*, you should be able to map X to a primitive (or composition of primitives) in under five seconds.

## P1 — Retrieve  →  `POST /v1/kb/{id}/find`

**What it does:** Searches the KB. Returns paragraphs ranked by relevance, with scores, positions, and resource metadata.

**Body:**
```json
{
  "query": "what is X?",
  "page_size": 10,
  "show": ["basic", "values", "origin"],
  "features": ["keyword", "semantic"],
  "filters": ["/icon/application/pdf"]
}
```

**Key body params:**
- `query` — what you're searching for.
- `features` — `["keyword"]`, `["semantic"]`, or both (hybrid). Default is semantic. Hybrid lifts recall on named-entity queries (~15-25% improvement on those).
- `filters` — array of filter paths. Content-type filters look like `/icon/video`, `/icon/application/pdf`. Label filters look like `/classification.labels/<labelset>/<label>`. See Build 6 for depth.

**Response shape (simplified):**
```json
{
  "resources": {
    "<resource-id>": {
      "id": "...",
      "title": "...",
      "fields": {
        "<field-id>": {
          "paragraphs": {
            "<para-id>": {
              "score": 0.87,
              "text": "...",
              "position": { "start_seconds": [45.2] }
            }
          }
        }
      }
    }
  },
  "best_matches": [...]
}
```

**Customer signals to map to P1:** "we need search across our docs", "find the section about X", "video search that jumps to the moment" (the `position.start_seconds` field is your friend).

## P2 — Generate  →  `POST /v1/kb/{id}/ask`

**What it does:** Retrieval + LLM generation + citation extraction, in one round trip. The LLM is grounded in retrieved paragraphs; the response is the generated answer plus the citations it leaned on.

**Body:**
```json
{
  "query": "what is X?",
  "prefer_markdown": true,
  "rephrase": true,
  "max_tokens": 500,
  "prompt": {
    "system": "You are a concise assistant. 3 sentences max.",
    "user": "Based on: {context}\n\nAnswer: {question}"
  }
}
```

**Two modes:**
- **Streaming (default):** NDJSON. Items shaped `{item: {type: "answer"|"retrieval"|"status", ...}}`. Stream `answer` chunks for typewriter UIs.
- **Sync:** add header `x-synchronous: true`. Returns one blob with `answer`, `retrieval_results`, `retrieval_best_matches`.

**Prompt anatomy:**
- `system` — persona, voice, length, format rules.
- `user` — template with `{context}` and `{question}` placeholders. ARAG injects retrieved context where you put `{context}` and the user's query where you put `{question}`.

**Customer signals to map to P2:** "we want a chatbot", "AI summary of our docs", "Q&A on our policies", "explain X in plain English."

## P3 — Constrain  →  `POST /v1/kb/{id}/ask` with `answer_json_schema`

**What it does:** Same generation engine, but output is **bound to a JSON Schema**. Returns a typed object, not prose. This is where ARAG stops being a chatbot and becomes a programmable backend.

**Body:**
```json
{
  "query": "Generate 5 FAQ entries on topic X.",
  "answer_json_schema": {
    "name": "faqs",
    "description": "Generates FAQ entries grounded in the corpus",
    "parameters": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "faqs": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "question": { "type": "string" },
              "answer": { "type": "string" }
            },
            "required": ["question", "answer"]
          }
        }
      },
      "required": ["faqs"]
    }
  }
}
```

**Response (sync):**
```json
{ "answer_json": { "faqs": [ { "question": "...", "answer": "..." }, ... ] } }
```

**Critical rule:** every `object` schema needs `additionalProperties: false` at every nesting level. Strict mode. Build 5 covers the helper that injects this automatically.

**Customer signals to map to P3:** "we want AI to generate <a structured thing>" — FAQs, comparison tables, onboarding plans, OKRs, intake forms, taxonomies, exam questions, anything you'd otherwise build a form for.

## P4 — Reason over relations  →  `POST /v1/kb/{id}/graph`

**What it does:** Queries a **typed knowledge graph** that ARAG extracts from your corpus via a customer-specific data-augmentation agent. Returns entity nodes and the typed edges between them.

**Three sub-endpoints:**

1. **Get paths from a node:** `POST /v1/kb/{id}/graph`
   ```json
   { "query": {"prop": "path", "source": {"value": "Mara Chen", "group": "AMBASSADOR"}, "undirected": true}, "top_k": 50 }
   ```

2. **Get nodes by entity group:** `POST /v1/kb/{id}/graph/nodes`
   ```json
   { "query": {"prop": "node", "group": "PRODUCT"}, "top_k": 500 }
   ```

3. **Fuzzy node search:** same endpoint, different body
   ```json
   { "query": {"prop": "node", "value": "Mara", "match": "fuzzy"}, "top_k": 50 }
   ```

**The single most important filter:** wrap every graph query in `{prop: "generated", by: "data-augmentation"}` to exclude default NER noise (DATE, ORG, MONEY, etc.). See Build 7 for depth.

**Customer signals to map to P4:** "find connections between X and Y", "which experts touched these projects", "what's the impact path from policy A to outcome B", "relationship-shaped questions, not document-shaped questions."

## P5 — Stream & secure media  →  `GET /v1/kb/{id}/resource/{id}/...`

**What it does:** Fetches an individual resource (with all its bundles) and downloads media (video, audio, PDF) with auth headers passed through every segment of DASH streaming.

**Two patterns:**

1. **Get full resource:**
   ```bash
   GET /v1/kb/{id}/resource/{resourceId}?show=basic&show=origin&show=extra&show=values&show=extracted
   ```
   Returns: title, mimetype, extracted text, custom fields, paragraphs with timestamps.

2. **Download a field's file:**
   ```bash
   GET /v1/kb/{id}/resource/{resourceId}/file/{fieldKey}/download/field?inline=true
   ```
   Returns: the raw bytes (PDF, video MP4, audio MP3, etc.) with auth required.

For DASH video streaming the auth header must travel on every segment request. Your video player needs a request modifier that injects the header per segment.

**Customer signals to map to P5:** "PDF preview with auth", "video player that jumps to a timestamp", "secure media library", anything where the content is gated and the bytes need to flow.

## The orchestration endpoint: `GET /v1/kb/{id}/labelsets`

Not a primitive itself — it's the one you call to **discover what labelsets exist** on the KB. Returns the labelset names + their label values. You'll use this in Build 6 when you wire content-type and label filters into a search UI.

## A composition example (so you see why the five matter)

Customer ask: *"We want a chatbot that answers questions about our compliance policies, generates a checklist of next actions, and shows the matching policy clauses in a graph view of related regulations."*

Decompose:

1. P2 (`/ask`) — for the chat answer.
2. P3 (`askForJson` with a `{action: string, owner: string, deadline: date}[]` schema) — for the checklist.
3. P1 (`/find` with content-type filter `/icon/application/pdf`) — for the policy clauses.
4. P4 (`/graph` with REGULATION → REGULATION paths) — for the graph view.
5. P5 (`/resource/{id}/file/{key}/download`) — for the PDF preview when they click a clause.

Five primitives, one application. **That's the entire course in one slide.**

## Common pitfalls in Build 1

- **Treating `/find` and `/ask` as redundant.** They're not. `/find` is what you call when you want to *list* matches (e.g., a search results page). `/ask` is what you call when you want a *grounded answer*. Most apps use both.
- **Skipping `additionalProperties: false`.** Build 5 will pay for this if you don't internalise it now.
- **Forgetting the `by: 'data-augmentation'` filter.** Without it, your knowledge graph is full of NER noise.
- **Treating `/labelsets` as a primitive.** It's not. It's a discovery endpoint.

## What's next

[Build 2 — Drop-in Widgets](../build-2-drop-in-widgets/) — the fastest path from "I just provisioned a KB" to "we have a working chatbot live on a real URL." 30-minute build, no backend.
