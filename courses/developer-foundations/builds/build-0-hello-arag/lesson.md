# Build 0 — Lesson: Hello ARAG

> Estimated reading time: 25 minutes. Read this before starting the [walkthrough](walkthrough.md).

## Why partners start here

Every partner programme that fails at ARAG fails because the partner pitched ARAG as "ChatGPT for your data" and lost to a free trial. Build 0 exists to give you the *correct* mental model from the first day: ARAG is not a chatbot. It is a platform with five primitives, and your job — across every customer engagement you'll ever run — is to compose those primitives into something a customer is willing to pay $250K+ a year for.

Build 0 has three concrete outcomes:

1. A sandbox knowledge base provisioned, with the partner's own content ingested.
2. The Sample ARAG App running locally against that KB.
3. A 30-minute recording of a working Q&A flow against the partner's content. This is the first thing you show in a customer meeting.

That last item is the commercial point. **By the end of Build 0 you have something to demo.** You won't have closed any customers yet, but you will have a demo, and a demo with the customer's own (or your own) content gets the next meeting booked.

## The five primitives

Memorise these. Every Build past this one is a deeper treatment of one or more of them.

| # | Primitive | Endpoint | What it does |
|---|---|---|---|
| **P1** | **Retrieve** | `POST /v1/kb/{kbId}/find` | Semantic + keyword search. Returns paragraphs with scores, positions (timestamps for video), and resource metadata. |
| **P2** | **Generate** | `POST /v1/kb/{kbId}/ask` | LLM answer grounded in retrieved context. Returns answer + citations. Streams as NDJSON or returns sync JSON with `x-synchronous: true` header. |
| **P3** | **Constrain** | `POST /v1/kb/{kbId}/ask` with `answer_json_schema` | Same as P2 but output is bound to a JSON Schema. Turns ARAG into a programmable backend. |
| **P4** | **Reason over relations** | `POST /v1/kb/{kbId}/graph` | Typed knowledge graph queries. Path traversal, fuzzy entity search, undirected expansion. |
| **P5** | **Stream & secure media** | `GET /v1/kb/{kbId}/resource/{id}/...` | Resource fetch with all bundles; DASH-MPD video streaming with auth headers injected per segment. |

Build 0 uses only P1 and P2. Builds 1–6 progressively introduce the others.

## What's actually happening in a `/ask` call

The single most under-appreciated fact about ARAG: when you call `/ask`, ARAG does **two things in one round trip**:

1. It runs retrieval (`/find`-equivalent) against your KB.
2. It passes the retrieved context to the configured LLM.
3. It returns the generated answer **plus the citations** from the retrieval step.

You did not have to wire retrieval and generation together yourself. You did not have to manage context-window stuffing. You did not have to build a citation extractor. **That entire integration is on the other side of the API.**

This is the source of ARAG's competitive moat against "LLM with RAG you stitched together yourself" — every partner-built RAG stack you'll meet in the field has a custom retrieval-to-LLM glue layer that someone has to maintain. ARAG doesn't.

## Authentication: the service-account header

All requests carry one header:

```
X-NUCLIA-SERVICEACCOUNT: Bearer <your-service-account-jwt>
```

That JWT is a long-lived token tied to a service account that you provision once per KB. It scopes to:

- The KB it was issued for.
- The operations the service account is permitted (read, write, admin).
- The region the KB lives in.

There is **no other auth scheme** to worry about for API access. SSO, OAuth, OIDC — those belong on top of *your* application, not on the ARAG API. When you talk to a customer's CTO about auth, the distinction matters: ARAG handles its own auth via the service-account model; how the end-user authenticates to *your* application is your concern.

## The two response shapes you'll encounter

### `/find` response (retrieval-only)

```json
{
  "resources": {
    "<resource-id>": {
      "id": "...",
      "title": "...",
      "origin": { "url": "...", "filename": "...", "mimetype": "..." },
      "fields": {
        "<field-id>": {
          "paragraphs": {
            "<paragraph-id>": {
              "score": 0.87,
              "order": 3,
              "text": "...the matching paragraph text...",
              "position": { "start_seconds": [45.2], "end_seconds": [67.8] }
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

Three things to notice:

1. **Paragraph-level matching.** ARAG returns the paragraph that matched, not just the resource. Use this to show "the line in the document that answers the question," not "the whole document that might contain the answer."
2. **Scores per paragraph.** Every match has a score. Build 1's eval harness in the Advanced course depends entirely on these.
3. **`position.start_seconds` for video/audio.** If the source was a video or audio file, the matching paragraph carries its timestamp. This is the foundation of deep-link-to-the-moment UX (see the Sample ARAG App's `KnowledgeDetailPage`).

### `/ask` streaming response (default)

The streaming response is NDJSON — newline-delimited JSON. Each line is a JSON object with shape:

```json
{ "item": { "type": "answer", "text": "Partial answer text..." } }
{ "item": { "type": "answer", "text": " continuing..." } }
{ "item": { "type": "retrieval", "results": { "resources": {...}, "best_matches": [...] } } }
{ "item": { "type": "status", "code": "0" } }
```

You accumulate the `answer` text chunks as they arrive (for streaming UI), capture the `retrieval` block for citations, and watch for `status` to know when the call completes.

The Sample ARAG App's NDJSON parser is at `Sample-ARAG-App/src/lib/ragApi.ts:469-559`. Read that code before the walkthrough — it's 90 lines and it handles every edge case (escape sequences, partial chunks, malformed JSON). You will not write this yourself; you will copy this pattern.

### Sync mode (`x-synchronous: true`)

Add the header `x-synchronous: true` and ARAG returns one JSON blob with the full answer + citations. Use this for non-streaming UIs (search-result cards, server-to-server scripts, batch jobs). It's identical content; just no streaming.

## What's a "Knowledge Base" in ARAG?

A KB is the unit of corpus + configuration. It owns:

- The documents you've ingested.
- The labelsets you've defined (Builds 4+ in the Advanced course).
- The data-augmentation agent (Build 5+).
- The custom indexed fields (Build 5+ in Advanced).
- The service-account credentials.
- The residency region (EU or USA).
- The LLM endpoint configuration (BYO-LLM in Build 6).

One application typically uses **one KB**. Multi-KB architectures exist (the Sample ARAG App's site-content + member-knowledge split is one example) but the default is single-KB, and you should design that way unless there's a clear gating or residency reason to split.

> **Where the Sample ARAG App lives.** Public repo at https://github.com/jaysanderson/Sample-ARAG-App. Clone it before the walkthrough.

## Common pitfalls in Build 0

1. **Ingesting too much content.** Start with 10 documents. You can grow later. Ingesting 1000 documents in your first hour means waiting 30+ minutes for processing before you can do anything useful.
2. **Forgetting `prefer_markdown: true`.** Without this in the `/ask` body, you get unformatted text. Always set it for any answer that might contain lists, tables, or code.
3. **Not setting `rephrase: true`.** ARAG's query rephrasing is a free quality lift. The LLM rewrites the user query before retrieval. Costs you nothing; helps recall.
4. **Trying to use OAuth or session cookies for API auth.** Stop. Use the service-account JWT in the `X-NUCLIA-SERVICEACCOUNT` header. That's the only auth path for the API.
5. **Pulling down the Sample ARAG App and pointing it at your KB without reading `src/lib/ragApi.ts` first.** The wrapper has every pattern you'll need for the next six Builds. Read it before you run it.

## What you'll build in the walkthrough

A 30-minute exercise:

1. Provision a sandbox KB in the EU region.
2. Ingest 10 documents of your own content (or use the sample corpus we provide).
3. Make a `/find` call from `curl` and inspect the response.
4. Make a streaming `/ask` call from `curl` and watch the NDJSON stream.
5. Clone the Sample ARAG App, point it at your KB via `.env`, run `npm run dev`, and open `/assistant`.
6. Record yourself asking three questions in `/assistant`. Three answers, with citations. That recording is the asset you deliver.

When you submit the recording for review, the reviewer is checking that you understand what you saw — not that the AI gave a perfect answer. (It won't, against 10 random documents.) Understanding is the goal.

## Onward

When you've finished the walkthrough and passed the [quiz](quiz.md), move to [Build 1 — Grounded search & drop-in widgets](../build-1-grounded-search-widgets/lesson.md).

Each subsequent Build deepens one of the five primitives, layers in one more pattern from the Sample ARAG App, and adds one more tool to the demo you walk into customer meetings with. By Build 6 you're production-ready. Build 7 is the capstone — a full-stack ARAG application demo that takes 25 minutes end-to-end and converts strategic-account CTOs.
