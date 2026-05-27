# Build 0 — Walkthrough: Hello ARAG

> Estimated time: 3–4 hours focused. Complete the [lesson](lesson.md) first.

## Prerequisites

- Progress ARAG sandbox account provisioned and accessible.
- `curl` installed locally.
- Node.js 18+ and `npm` installed.
- Git installed.
- A folder of ~10 documents to ingest. PDFs, Word docs, markdown, plain text — any of those work. If you don't have your own corpus, you can pull 10 markdown files from `/tree/main/knowledge-base/kb-site-content` as a starter.

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

This is the call shape every subsequent Build's streaming client parses.

## 6. Write a minimal Node.js streaming client

Build a tiny script that hits the streaming `/ask` endpoint and renders the answer + citations to the terminal. No frontend, no external repos — just enough code to verify you can drive ARAG from your own programme. You'll reuse and extend this scaffolding in later Builds.

```bash
mkdir build-0-client && cd build-0-client
npm init -y
npm install dotenv
```

Create `ask.mjs`:

```javascript
import 'dotenv/config';

const { NUCLIA_API_URL, NUCLIA_KB_ID, NUCLIA_API_KEY } = process.env;

const query = process.argv.slice(2).join(' ');
if (!query) {
  console.error('Usage: node ask.mjs "your question"');
  process.exit(1);
}

const res = await fetch(`${NUCLIA_API_URL}/kb/${NUCLIA_KB_ID}/ask`, {
  method: 'POST',
  headers: {
    'X-NUCLIA-SERVICEACCOUNT': `Bearer ${NUCLIA_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query,
    prefer_markdown: true,
    rephrase: true,
    max_tokens: 500,
  }),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const decoder = new TextDecoder();
let buffer = '';
let citations = [];

for await (const chunk of res.body) {
  buffer += decoder.decode(chunk, { stream: true });

  // Parse balanced JSON objects from the buffer
  let depth = 0, start = 0, inString = false, escape = false;
  for (let i = 0; i < buffer.length; i++) {
    const ch = buffer[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) {
      const text = buffer.slice(start, i + 1);
      start = i + 1;
      try {
        const { item } = JSON.parse(text);
        if (item?.type === 'answer' && item.text) {
          process.stdout.write(item.text);
        } else if (item?.type === 'retrieval' && item.results) {
          citations = item.results.best_matches.slice(0, 5);
        }
      } catch { /* malformed chunk; skip */ }
    }
  }
  buffer = buffer.slice(start);
}

console.log('\n\n--- Citations ---');
for (const c of citations) {
  console.log(`- ${c.id.split('/')[0]}`);
}
```

Copy your `.env` from earlier into this folder. Then run:

```bash
node ask.mjs "your question here"
```

You should see the answer stream out token-by-token, followed by the citations.

This is the smallest possible end-to-end ARAG client. The NDJSON-parsing logic — accumulate `answer` chunks, capture the `retrieval` item — is the foundation of every Tier 2+ chat surface you'll build in later Builds.

## 7. Verify across three queries

Run the script three times against your ingested content:

```bash
node ask.mjs "what does my corpus actually contain?"
node ask.mjs "summarise the key topic in document N"
node ask.mjs "find the section about X"
```

For each:

- Watch the streaming answer arrive token-by-token.
- Confirm the `--- Citations ---` section lists at least one resource id.
- Open the Nuclia dashboard and confirm those resource ids match documents you ingested.

If the citations list is empty, your content may not be relevant to the question — pick a question that *should* be in the corpus.

## 8. Record your 30-minute walkthrough

This is the deliverable. Record yourself:

1. Showing the Nuclia dashboard with your KB and the 10 documents.
2. Running `ask.mjs` three times with three different queries.
3. For each query, narrating what's happening — what the streaming chunks are doing, what the citations are, why the answer is grounded in your content.
4. Closing with one sentence on what a customer would do differently against their own 10,000 documents instead of your 10.

Use Loom, QuickTime, OBS — anything that records screen + voice. Upload to the partner Slack `#build-clinic-submissions` channel.

## Verification checklist

- [ ] Sandbox KB provisioned, 10 documents ingested, all indexed.
- [ ] `/find` call returns at least one paragraph with a non-zero score.
- [ ] Sync `/ask` call returns an answer and citation array.
- [ ] Streaming `/ask` call delivers NDJSON chunks; the answer accumulates from `answer` items; citations arrive in the `retrieval` item.
- [ ] `ask.mjs` runs against three queries with non-empty citations.
- [ ] 30-minute recording submitted.

When all six are checked, you're ready for the [Build 0 quiz](quiz.md). Pass the quiz and a reviewer signs off on your recording, and you're done with Build 0.

## Next

[Build 1 — Grounded search & drop-in widgets](../build-1-grounded-search-widgets/) → covers content-type filters, label filters, branded theming, and the Nuclia widget library — the patterns you'll embed on a real partner website.
