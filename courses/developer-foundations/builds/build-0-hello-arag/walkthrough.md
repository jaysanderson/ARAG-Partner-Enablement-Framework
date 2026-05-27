# Build 0 — Walkthrough: Hello ARAG

> Estimated time: 2–3 hours focused. Complete the [lesson](lesson.md) (or watch the [video](video-script.md)) first.

## Prerequisites

- Progress ARAG sandbox account provisioned.
- Local terminal with `curl` and `jq`.
- A folder of ~10 documents (PDFs, markdown, plain text — your own corpus or a sample).
- One AI coding assistant set up (Claude Code, Cursor, GitHub Copilot, or ChatGPT).

## 1. Provision your KB (5 min)

In the Nuclia dashboard:

1. Create a new knowledge base. Name it `<your-org>-foundations`.
2. **Region:** EU (we'll cover residency in Build 10).
3. **Generative model:** leave on default for now; BYO-LLM lands in Build 10.

Save these into `.env` in a working folder:

```bash
NUCLIA_API_URL=https://aws-eu-1.rag.progress.cloud/api/v1
NUCLIA_KB_ID=<your-kb-uuid>
NUCLIA_API_KEY=<your-service-account-jwt>
```

Don't commit this file.

## 2. Ingest 10 documents (10 min)

Drag-and-drop 10 documents into the KB in the dashboard. Wait until all show as "indexed" — usually 30 seconds per document.

Pick documents you understand the content of. The point isn't quality of corpus — it's that you can sanity-check the model's answers.

## 3. First `/find` call (10 min)

Source your `.env`:

```bash
set -a; source .env; set +a
```

Run:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"<a 4-6 word question about your content>","page_size":5,"show":["basic","values","origin"]}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" | jq .
```

Inspect the response. Confirm:

- `resources` is populated.
- For each resource, at least one paragraph has a `score > 0.6`.
- `best_matches` lists the top resource ids.

## 4. First streaming `/ask` call (10 min)

```bash
curl -N -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"<your question>","prefer_markdown":true,"rephrase":true,"max_tokens":500}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask"
```

You'll see NDJSON chunks arrive: `answer` items first, then a single `retrieval` item, then a `status` item. Confirm the stream completes cleanly.

## 5. Vibe-code `ask.mjs` (30 min)

Open your AI coding assistant. Brief it with the prompt below (copy verbatim, swap in your environment specifics):

```
Build me a Node.js script ask.mjs that:

1. Reads NUCLIA_API_URL, NUCLIA_KB_ID, and NUCLIA_API_KEY from a .env file
   (use dotenv).
2. Takes a query as a CLI argument: node ask.mjs "your question"
3. Calls POST {NUCLIA_API_URL}/kb/{NUCLIA_KB_ID}/ask with header
   X-NUCLIA-SERVICEACCOUNT: Bearer {NUCLIA_API_KEY} and body
   {query, prefer_markdown: true, rephrase: true, max_tokens: 500}.
4. The response is NDJSON. Each line is shaped {item: {type: "answer"|"retrieval"|"status", ...}}.
5. As {item:{type:"answer", text}} arrives, print the text chunk to stdout immediately.
6. When {item:{type:"retrieval", results}} arrives, capture results.best_matches.
7. At end of stream, print "---" then list the citation resource IDs.

Use plain fetch, no SDK. Handle balanced JSON parsing from the streaming
buffer (objects may straddle chunk boundaries).

When you're done, show me the file. I'll review and run it.
```

The AI will produce a script. **Read it** before running. Check:

- It uses `fetch`, not an SDK.
- It uses the right auth header.
- It parses NDJSON correctly (handling cross-chunk boundaries).
- It streams the answer (not buffering until the end).

Save the AI's response and your prompt as `prompt-log.md` in this Build folder. The prompt is institutional knowledge — keep it.

## 6. Run and verify (15 min)

```bash
npm init -y
npm install dotenv
node ask.mjs "your question"
```

You should see:

- Answer text streaming in token-by-token.
- A `---` separator.
- 1–5 resource IDs of the citations.

Run it three times with three different questions. If it doesn't stream (i.e., the whole answer dumps at once), tell the AI: *"The output isn't streaming — each token should print as it arrives. The parser is buffering. Fix it."* Iterate until streaming works.

## 7. Record a 5-minute walkthrough (15 min)

Record yourself:

1. (60 sec) Showing the Nuclia dashboard with your KB and ingested docs.
2. (60 sec) Running the `curl /find` call. Narrating what's in the response.
3. (60 sec) Running the `curl /ask` streaming call. Narrating the NDJSON chunks.
4. (90 sec) Running `node ask.mjs "your question"` against two queries. Narrating the streaming behaviour + citations.
5. (30 sec) Closing: what would change against a customer's 10,000 documents vs your 10.

Use Loom, QuickTime, OBS. Upload to `#build-clinic-submissions`.

## Verification checklist

- [ ] KB provisioned, 10 documents ingested, all indexed.
- [ ] `/find` `curl` call returns paragraphs with `score > 0.6`.
- [ ] `/ask` streaming `curl` call delivers NDJSON chunks; `answer`, `retrieval`, `status` items observed.
- [ ] `ask.mjs` script written by AI, reviewed by you, streams correctly.
- [ ] Three queries run through the script; citations land.
- [ ] `prompt-log.md` saved with the prompt that produced the working code.
- [ ] 5-minute recording submitted.

## Next

[Build 1 — The Five Primitives](../build-1-five-primitives/) extends today's `/find` and `/ask` into the full surface: `/ask` with schema constraints, `/graph`, `/resource`, `/labelsets`. After Build 1 you'll have seen every endpoint at least once.
