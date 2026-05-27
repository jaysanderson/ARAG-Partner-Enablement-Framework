# Build 1 — Walkthrough: The Five Primitives

> Estimated time: 2 hours focused. Complete Build 0 and read the [lesson](lesson.md) first.

## Goal

Hit every ARAG endpoint at least once. Save a one-line summary of each response. By the end, you should be able to recite from memory what each primitive returns and when to reach for it.

## 1. Build a Postman / Thunder Client / Bruno collection (15 min)

Create a new request collection called `ARAG Primitives`. Add three environment variables:

- `NUCLIA_API_URL` (from Build 0)
- `NUCLIA_KB_ID` (from Build 0)
- `NUCLIA_API_KEY` (from Build 0)

Add a default header on the collection: `X-NUCLIA-SERVICEACCOUNT: Bearer {{NUCLIA_API_KEY}}`. Every request inherits it.

Save 6 requests in the collection — one per endpoint. The walkthrough below covers each.

## 2. Hit `/find` (10 min)

```
POST {{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/find
Body:
{
  "query": "<your question>",
  "page_size": 5,
  "features": ["keyword", "semantic"],
  "show": ["basic", "values", "origin"]
}
```

Save the response. Note:
- Number of resources returned.
- Top paragraph score.
- Whether any paragraphs have `position.start_seconds` (only true for video/audio resources).

## 3. Hit `/ask` (sync) (10 min)

```
POST {{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/ask
Headers (override): x-synchronous: true
Body:
{
  "query": "<your question>",
  "prefer_markdown": true,
  "rephrase": true,
  "max_tokens": 300
}
```

Sync mode returns one JSON blob with `answer`, `retrieval_results`, `retrieval_best_matches`. Save it. Compare to your `/find` response — note that the `retrieval_results.resources` from `/ask` looks very similar to the `resources` from `/find`. That's intentional: `/ask` is `/find` + LLM generation in one round trip.

## 4. Hit `/ask` (streaming with custom prompt) (15 min)

```
POST {{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/ask
Body:
{
  "query": "<your question>",
  "prefer_markdown": true,
  "rephrase": true,
  "max_tokens": 300,
  "prompt": {
    "system": "You are a concise assistant. 2 sentences max.",
    "user": "Context: {context}\n\nQuestion: {question}"
  }
}
```

If your tool can stream NDJSON, run it as streaming. Otherwise, the response will arrive as concatenated NDJSON in the body — you can still see all the `{item:...}` chunks.

Compare this answer to the one from Step 3. Same query, different prompt → different voice, different length. The custom prompt is your tier-2 lever — Build 3 goes deeper.

## 5. Hit `/ask` with `answer_json_schema` (P3) (15 min)

```
POST {{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/ask
Headers: x-synchronous: true
Body:
{
  "query": "Suggest 4 follow-up questions based on the corpus.",
  "answer_json_schema": {
    "name": "follow_ups",
    "description": "Generates follow-up questions",
    "parameters": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "questions": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["questions"]
    }
  }
}
```

Response should include `answer_json.questions = ["...", "...", "...", "..."]`. If it doesn't, double-check `additionalProperties: false` is on the object schema.

## 6. Hit `/labelsets` (5 min)

```
GET {{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/labelsets
```

Returns the labelsets configured on your KB. For a fresh sandbox, this is likely empty or near-empty (you haven't designed any yet). Save the response — you'll wire labelsets in Build 6.

## 7. Hit `/graph` (P4) (15 min)

If your KB doesn't have a data-augmentation agent configured (the default for new sandbox KBs), `/graph` will return an empty result. **That's expected.** Build 7 covers configuring the agent.

For now, just see the call shape:

```
POST {{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/graph
Body:
{
  "query": {
    "and": [
      { "prop": "path" },
      { "prop": "generated", "by": "data-augmentation" }
    ]
  },
  "top_k": 20
}
```

Save the response (likely `{"paths": []}` for now). Recognise the request shape — you'll use it again in Build 7.

## 8. Hit `/resource/{id}` (P5) (10 min)

Grab a resource ID from your earlier `/find` response. Then:

```
GET {{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/resource/{resourceId}?show=basic&show=origin&show=extra&show=values&show=extracted
```

Save the response. Notice:
- Full extracted text body.
- Origin metadata (filename, mimetype, URL).
- Any field values (custom fields you've added — for now, just default fields).

## 9. Vibe-code a "primitives demo" tool (30 min)

Open your AI assistant. Brief:

```
Build me a Node.js CLI tool primitives-demo.mjs that:

1. Reads NUCLIA_API_URL, NUCLIA_KB_ID, NUCLIA_API_KEY from .env.
2. Takes two args: the primitive ("find" | "ask" | "ask-schema" | "graph" | "resource") and a query/id.
3. Calls the appropriate endpoint with sensible defaults:
   - find: page_size 5, hybrid features
   - ask: sync mode, prefer_markdown true, rephrase true
   - ask-schema: a hard-coded follow-up-questions schema (3 questions)
   - graph: data-augmentation filtered paths, top_k 20
   - resource: GET /resource/{id} with all show flags
4. Prints a one-line summary of what came back. For find: "5 resources, top score 0.87". For ask: "Answer (143 chars), 3 citations". For ask-schema: "3 questions generated". For graph: "{n} paths". For resource: "Resource title: ..., extracted_text length: ...".

Auth via X-NUCLIA-SERVICEACCOUNT header. Use plain fetch, no SDK.
```

The AI will produce ~150 lines of code. Read it before running. Run each command:

```bash
node primitives-demo.mjs find "what is X?"
node primitives-demo.mjs ask "what is X?"
node primitives-demo.mjs ask-schema "<irrelevant>"
node primitives-demo.mjs graph "<irrelevant>"
node primitives-demo.mjs resource <a-resource-id-from-find>
```

Verify each prints a sensible one-line summary.

Save the AI's response and your prompt as `prompt-log.md` in this Build folder.

## 10. Map the customer signals (10 min)

Open `primitives-map.md` in this folder. Write down — in your own words — the customer signal that should make you reach for each primitive. Reuse the framing from the lesson but in your own language. This is the muscle memory you need for the final exam and for customer scoping calls.

## Verification checklist

- [ ] Postman/Thunder/Bruno collection with all 6 endpoints saved.
- [ ] One successful response per endpoint, captured in your prompt log or a notes file.
- [ ] `primitives-demo.mjs` working against all five primitives.
- [ ] `prompt-log.md` saved.
- [ ] `primitives-map.md` saved with customer-signal phrases.
- [ ] 3-minute recording: walk through one query going through `find`, `ask`, `ask-schema`. Show how the same query produces three different shapes of response.

## Next

[Build 2 — Drop-in Widgets](../build-2-drop-in-widgets/) — the fastest "we have a chatbot" demo, no backend, in 30 minutes.
