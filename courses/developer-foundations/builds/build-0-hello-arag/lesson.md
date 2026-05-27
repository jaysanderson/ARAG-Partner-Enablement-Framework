# Build 0 — Lesson: Hello ARAG

> Read time: 12 minutes. Companion to the 12-minute [video](video-script.md). Either is sufficient; the video is the recommended path.

## Why you start here

Every customer engagement past this Build assumes you understand three things:

1. **What an ARAG knowledge base is** (a unit of corpus + configuration).
2. **How you authenticate to it** (one header, one JWT).
3. **What the two foundational endpoints return** (`/find` and `/ask`).

Without these, every subsequent Build feels like magic. With them, every subsequent Build is a small extension of the same pattern. By the end of this Build you'll have a working sandbox, made three different API calls against it, and watched an AI coding assistant write your first ARAG client in 90 seconds.

## What ARAG actually is

Progress Agentic RAG is a platform. The five primitives — **R**etrieve, **G**enerate, **C**onstrain (with a JSON schema), **R**eason over relations (the knowledge graph), and **S**tream-secure media — are exposed via a small set of HTTP endpoints. You'll learn all five in Build 1.

For Build 0, you only need two of them:

- **`/find`** — retrieval. Sends a query, returns the matching paragraphs ranked by score.
- **`/ask`** — generation. Sends a query, returns an LLM answer **grounded in retrieved paragraphs**, plus the citation list, in a single round trip.

That last point is the platform's competitive position. ARAG doesn't make you wire retrieval to generation yourself. The `/ask` endpoint does retrieval + generation + citation extraction in one call. Every "we built RAG ourselves" competitor has glue code maintaining that integration. You don't.

## What a Knowledge Base is

A KB owns:

- The documents you've ingested.
- The labelsets you've defined (Builds 6 and onwards).
- The data-augmentation agent that extracts the typed graph (Build 7).
- The custom indexed fields you've added (Build 8).
- The service-account credentials.
- The residency region (EU or USA — covered in Build 10).
- The LLM endpoint configuration (BYO-LLM, also Build 10).

One application typically uses **one KB**. Multi-KB architectures exist but the default — and your default — is one KB per customer. You'll provision yours today.

## Authentication: one header, one JWT

Every ARAG API call carries one header:

```
X-NUCLIA-SERVICEACCOUNT: Bearer <your-service-account-jwt>
```

That JWT is:

- Long-lived (you rotate it manually when staff changes).
- Scoped to **one KB**.
- Scoped to the operations the service account is permitted (read, write, admin).

There's no OAuth, no session token, no API-key-in-query-string. **One header, one JWT.** If you see your AI assistant generating anything else, stop it.

## The two endpoints you'll touch today

### `/find` — retrieval-only

```bash
POST /v1/kb/{kbId}/find
Headers: X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>, Content-Type: application/json

Body:
{
  "query": "what is X?",
  "page_size": 5,
  "show": ["basic", "values", "origin"]
}

Response:
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
              "text": "the matching paragraph text...",
              "position": { "start_seconds": [45.2] }
            }
          }
        }
      }
    }
  },
  "best_matches": [...],
  "next_page": false
}
```

Things to internalise:

- ARAG returns **paragraphs**, not just whole documents. You can show the exact line that matched.
- Every paragraph has a **score** between 0 and 1. Lower-bound it (~0.6) when you want high precision.
- For video/audio, the paragraph carries its **timestamp**. This is how Build 8 builds deep-link-to-the-moment UX.

### `/ask` — generation grounded in retrieval

```bash
POST /v1/kb/{kbId}/ask
Headers: X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>, Content-Type: application/json

Body:
{
  "query": "what is X?",
  "prefer_markdown": true,
  "rephrase": true,
  "max_tokens": 500
}
```

Two response modes:

**Streaming (default)** — newline-delimited JSON. Each line is `{"item": {"type": "answer"|"retrieval"|"status", ...}}`. Accumulate `answer.text` chunks for the streaming UI; capture the `retrieval` block for citations.

**Sync** — add header `x-synchronous: true`. Returns one JSON blob `{answer: "...", retrieval_results: {...}, retrieval_best_matches: [...]}`. Use for non-streaming UIs and server-to-server scripts.

Always set `prefer_markdown: true` (formatted output) and `rephrase: true` (the LLM rewrites your query before retrieval — free quality lift).

## The mental model: platform vs application

This is the core distinction in the entire course. Internalise it now.

- **Platform** = ARAG. Provisioned, configured, paid for. You don't build this; you call it.
- **Application** = the code that *calls* the platform. You direct an AI to write this. It's commodity. It's disposable.

The Build 0 walkthrough has you do both: provision a KB (platform) and ask an AI to write a 30-line script (application). Watching where the two boundaries are is the whole point of this Build.

## What you'll do in the walkthrough

1. Provision a sandbox KB in EU region.
2. Drag 10 documents into the dashboard.
3. Make a `/find` call from `curl`. Read the response.
4. Make a streaming `/ask` call from `curl`. Watch the NDJSON stream.
5. Open Claude Code (or Cursor / Copilot / ChatGPT). Brief it on the streaming `/ask` shape. Have it write you `ask.mjs`.
6. Run the script. Verify the output streams correctly and the citations land.
7. Record a 5-minute walk-through showing the three API calls plus your generated script.

## Common pitfalls

- **Authenticating with the wrong header.** It's `X-NUCLIA-SERVICEACCOUNT`. Not `Authorization`.
- **Forgetting `rephrase: true`.** Free quality lift. Always set it.
- **Forgetting `prefer_markdown: true`.** Without it, your answers come back as wall-of-text, no formatting.
- **Asking the AI to write code before testing `curl` manually.** Always verify the endpoint behaviour with `curl` first. Then ask the AI to wrap it.
- **Letting the AI hallucinate an SDK.** There's no first-party `nuclia` npm package. Tell the AI to use `fetch`.

## What's next

Build 1 — [The Five Primitives](../build-1-five-primitives/) — extends today's `/find` and `/ask` into the full surface: `/ask` with schema constraints, `/graph` for typed knowledge graphs, `/resource` for media retrieval. After Build 1 you'll have seen every endpoint at least once.
