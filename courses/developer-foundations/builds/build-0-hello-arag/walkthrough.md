# Build 0 — Walkthrough: Hello ARAG

> Estimated time: 3–4 hours focused. Complete the [lesson](lesson.md) first.

## Prerequisites

- Progress ARAG sandbox account provisioned and accessible.
- `curl` installed locally.
- Node.js 18+ and `npm` installed.
- Git installed.
- A folder of ~10 documents to ingest. PDFs, Word docs, markdown, plain text — any of those work. If you don't have your own corpus, you can pull 10 markdown files from `https://github.com/jaysanderson/Sample-ARAG-App/tree/main/knowledge-base/kb-site-content` as a starter.

## 1. Provision your sandbox KB

In the Nuclia dashboard (link provided in your sandbox account email):

1. Create a new knowledge base. Name it something memorable like `<your-org>-foundations-sandbox`.
2. **Region:** choose EU (we'll use EU throughout the course unless a customer requires USA).
3. **LLM:** leave on default for Build 0; you'll wire BYO-LLM in Build 6.

After the KB is created, copy three values into a local `.env` file:

```bash
NUCLIA_API_URL=https://aws-eu-1.rag.progress.cloud/api/v1
NUCLIA_KB_ID=<the-uuid-of-your-kb>
NUCLIA_API_KEY=<the-service-account-jwt>
```

The exact `NUCLIA_API_URL` differs by region; copy it from the dashboard's "Endpoint" field. **Do not commit this `.env` to git.**

## 2. Ingest 10 documents

Use the Nuclia upload UI for Build 0. (Programmatic ingest comes later in the course.)

1. Drag-and-drop 10 documents into your KB.
2. Wait until processing completes — typically 30 seconds per document. The UI shows progress per resource.
3. Verify each document has a title, a non-empty text-extraction body, and a status of "indexed".

## 3. First `/find` call

Open a terminal and run:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"<a 4-6 word question about your content>","page_size":5,"show":["basic","values","origin"]}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" | jq .
```

What to inspect in the response:

- `resources` — the matching documents, keyed by resource id.
- For each resource, `fields.<field-id>.paragraphs.<paragraph-id>` — the paragraphs that matched, with `score`, `order`, `text`, and (for video/audio) `position.start_seconds`.
- `best_matches` — the top-ranked matches in order.

Read at least two complete resource entries in the response. Understand what's inside before moving on.

## 4. First sync `/ask` call

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-synchronous: true" \
  -d '{"query":"<your question>","prefer_markdown":true,"rephrase":true,"max_tokens":500}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" | jq .
```

Two things to inspect:

- `answer` — the generated answer, in markdown.
- `retrieval_results.resources` and `retrieval_best_matches` — the citations the answer was grounded in.

The model may say "I don't have enough information." That's a *correct* answer when the corpus is small. Don't worry about answer quality at this stage — verify the call works and the citations come back.

## 5. First streaming `/ask` call

```bash
curl -N -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"<your question>","prefer_markdown":true,"rephrase":true,"max_tokens":500}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask"
```

`curl -N` disables output buffering so you see the NDJSON stream as it arrives. Watch the `{"item":{"type":"answer","text":"..."}}` chunks accumulate, then the `{"item":{"type":"retrieval",...}}` block, then `{"item":{"type":"status","code":"0"}}` to mark completion.

This is the call shape the Sample ARAG App parses in `src/lib/ragApi.ts:598-732`.

## 6. Clone and configure the Sample ARAG App

```bash
git clone https://github.com/jaysanderson/Sample-ARAG-App.git
cd Sample-ARAG-App
npm install
```

Create a `.env` file in the repo root with these variables:

```bash
VITE_RAG_KB_SITE_CONTENT_API_URL=$NUCLIA_API_URL
VITE_RAG_KB_SITE_CONTENT_API_KEY=$NUCLIA_API_KEY
VITE_RAG_KB_SITE_CONTENT_ID=$NUCLIA_KB_ID
VITE_RAG_KB_MEMBER_KNOWLEDGE_API_URL=$NUCLIA_API_URL
VITE_RAG_KB_MEMBER_KNOWLEDGE_API_KEY=$NUCLIA_API_KEY
VITE_RAG_KB_MEMBER_KNOWLEDGE_ID=$NUCLIA_KB_ID
```

(Both "site content" and "member knowledge" point at your single KB for Build 0. The Sample ARAG App's two-KB pattern is a Tier-2 topic; for Build 0 we run both surfaces against one KB.)

Start the dev server:

```bash
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`). Click **AI Assistant** in the navigation.

## 7. Verify the assistant works

In the assistant text box, ask three questions about your ingested content. For each:

- Watch the answer stream in word-by-word.
- Confirm citations appear in the side panel.
- Click a citation to verify it links to (or surfaces) the source document.

If something is broken, check the browser console (`Cmd+Opt+I` on Mac, `F12` on Windows) for fetch errors. Most issues at this stage are env-var mismatches or service-account JWTs that didn't get pasted in full.

## 8. Record your 30-minute walkthrough

This is the deliverable. Record yourself:

1. Showing the Nuclia dashboard with your KB and the 10 documents.
2. Asking three questions in the Sample ARAG App's `/assistant` page.
3. For each question, narrating what's happening — what the streaming chunks are doing, what the citations are, where the answer came from.
4. Closing with one sentence on what a customer would do differently against their own 10,000 documents instead of your 10.

Use Loom, QuickTime, OBS — anything that records screen + voice. Upload to the partner Slack `#build-clinic-submissions` channel.

## Verification checklist

- [ ] Sandbox KB provisioned, 10 documents ingested, all indexed.
- [ ] `/find` call returns at least one paragraph with a non-zero score.
- [ ] Sync `/ask` call returns an answer and citation array.
- [ ] Streaming `/ask` call delivers NDJSON chunks; the answer accumulates from `answer` items; citations arrive in the `retrieval` item.
- [ ] Sample ARAG App `/assistant` page loads, accepts a query, streams an answer, and renders citations.
- [ ] 30-minute recording submitted.

When all six are checked, you're ready for the [Build 0 quiz](quiz.md). Pass the quiz and a reviewer signs off on your recording, and you're done with Build 0.

## Next

[Build 1 — Grounded search & drop-in widgets](../build-1-grounded-search-widgets/) → covers content-type filters, label filters, branded theming, and the Nuclia widget library — the patterns you'll embed on a real partner website.
