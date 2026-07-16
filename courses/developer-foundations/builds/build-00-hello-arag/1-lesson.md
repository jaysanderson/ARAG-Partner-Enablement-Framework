# Build 0 — Lesson: Hello ARAG

> Read time: 12 minutes.

## Why you start here

Every customer engagement past this Build assumes you understand three things:

1. **What an ARAG Knowledge Box is** (a unit of corpus + configuration).
2. **How you authenticate to it** (one header, one JWT).
3. **What the two foundational endpoints return** (`/find` and `/ask`).

Without these, every subsequent Build feels like magic. With them, every subsequent Build is a small extension of the same pattern. By the end of this Build you'll have a working sandbox, made three different API calls against it, and watched an AI coding assistant write your first ARAG client in 90 seconds.

## What ARAG actually is

Progress Agentic RAG is a platform. The five primitives — **R**etrieve, **G**enerate, **C**onstrain (with a JSON schema), **R**eason over relations (the knowledge graph), and **S**tream-secure media — are exposed via a small set of HTTP endpoints. You'll learn all five in Build 1.

For Build 0, you only need two of them:

- **`/find`** — retrieval. Sends a query, returns the matching paragraphs ranked by score.
- **`/ask`** — retrieval & generation. Sends a query, returns an LLM answer **grounded in retrieved paragraphs**, plus the citation list, in a single round trip.

That last point is the platform's competitive position. ARAG doesn't make you wire retrieval to generation yourself. The `/ask` endpoint does retrieval + generation + citation extraction in one call. Every "we built RAG ourselves" competitor has glue code maintaining that integration. You don't.

## What a Knowledge Box is

A Knowledge Box — **KB** for short — owns:

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

> **`Authorization: Bearer <jwt>` also works** — ARAG accepts it as an alternative to `X-NUCLIA-SERVICEACCOUNT`. This course standardises on `X-NUCLIA-SERVICEACCOUNT` throughout so every example, screenshot, and troubleshooting step matches what you see on screen. Use it unless you have a specific reason to do otherwise.

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

### `/ask` — retrieval & generation

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

1. Provision a sandbox Knowledge Box in the region closest to you (then stick with that same region for every Knowledge Box you provision in this course).
2. Upload the sample corpus we provide (`corpus/content_type/` inside this Build's folder — 37 documents organised into seven subfolders) using the dashboard's **Upload folder** option with **"use folder names as label names"** enabled. Progress Agentic RAG auto-applies a `content_type` labelset so you've practised the workflow that every subsequent build, including the capstone, uses.
3. Make a `/find` call from `curl`. Read the response.
4. Make a streaming `/ask` call from `curl`. Watch the NDJSON stream.
5. Open Claude Code (or Cursor / Copilot / ChatGPT). Brief it on the streaming `/ask` shape. Have it write you `ask.mjs`.
6. Run the script. Verify the output streams correctly and the citations land.

## Common pitfalls

- **Authenticating with a header other than `X-NUCLIA-SERVICEACCOUNT`.** `Authorization` also works, but this course standardises on `X-NUCLIA-SERVICEACCOUNT` — use it so your setup matches the lessons.
- **Forgetting `rephrase: true`.** Free quality lift. Always set it.
- **Forgetting `prefer_markdown: true`.** Without it, your answers come back as wall-of-text, no formatting.
- **Asking the AI to write code before testing `curl` manually.** Always verify the endpoint behaviour with `curl` first. Then ask the AI to wrap it.
- **Letting the AI hallucinate an SDK.** There's no first-party `nuclia` npm package. Tell the AI to use `fetch`.

## Citations — extracting, de-duping, and resolving

Every `/ask` answer ships a `retrieval_results` block with two things: a `best_matches` array (paragraph references, ranked) and a `resources` map keyed by resource id. The first wall every partner hits is naively rendering `best_matches` as if its entries were resource ids. They're not — they're paragraph refs shaped `"<rid>/t/body/<start>-<end>"`, so `resources[bestMatchString]` always misses. You have to split the string and look up the resource by the leading `<rid>` segment.

API surface, concise:

- `/ask` response → `retrieval_results.best_matches: string[]` — ranked paragraph refs, one per cited paragraph.
- `/ask` response → `retrieval_results.resources: Record<rid, ResourceShape>` — full metadata for each cited resource (title, summary, origin).
- The contract: `rid = best_matches[i].split('/')[0]`. That `rid` is the key you use against `resources`.

Worked example. A ~12-line resolver: split each paragraph ref, de-dup by `rid` while preserving rank order, then look the resource up:

```ts
function extractCitations(retrieval) {
  const resources = retrieval?.resources ?? {};
  const seen = new Set<string>();
  const ordered = [];
  for (const ref of retrieval?.best_matches ?? []) {
    const rid = String(ref).split('/')[0];
    if (!rid || seen.has(rid)) continue;
    seen.add(rid);
    const r = resources[rid];
    if (!r) continue;
    const title = (r.title ?? '').replace(/^#+\s*/, '').trim() || rid.slice(0, 8);
    ordered.push({ id: rid, title });
  }
  return ordered;
}
```

Two details worth noticing. First, the de-dup: a single resource can contribute three or four paragraphs to one answer, so naive iteration shows the same source four times. Second, the title cleanup: ARAG sometimes prefixes titles with markdown heading syntax (`# Title`) — strip it before rendering, or your UI gets ugly hashes.

Common failure mode: the model occasionally returns plain markdown links **inside the answer body** (`[label](https://example.com/doc)`) instead of populating `retrieval_results`. When `best_matches` is empty but the answer renders, fall back to a one-paragraph HTML scan that mines `<a href="...">label</a>` from the rendered output and treats each unique URL as a citation. It's a belt-and-braces second source — never the primary path, but it stops the citation row from collapsing to zero on the rare run where the structured block goes missing.

**See it in the capstone:** `src/lib/ragClient.ts` → `extractCitations`, and `src/components/FloatingChat.tsx` → `deriveCitationsFromHtml`.

## What's next

Build 1 — [The Five Primitives](../build-01-five-primitives/) — extends today's `/find` and `/ask` into the full surface: `/ask` with schema constraints, `/graph` for typed knowledge graphs, `/resource` for media retrieval. After Build 1 you'll have seen every endpoint at least once.
