# Build 1 — Walkthrough: The Five Primitives

> Estimated time: 2–3 hours focused. Complete Build 0 and read the [lesson](lesson.md) first.
>
> **New to API testing tools?** That's fine. We give you two paths: a tool with a friendly UI (Postman), or plain `curl` commands you already know from Build 0. Pick whichever is less intimidating.

## What you'll need open

- **Your Nuclia dashboard** (with the KB from Build 0 still alive and ingested).
- **Your `.env` file from Build 0** — same three credentials.
- **An API testing tool** (we'll set one up in Step 1) OR a terminal if you'd rather stick with `curl`.
- **Your editor** — VS Code or similar.
- **Your AI assistant** — for the vibe-coded bits.

## What you'll do

Hit every one of ARAG's five primitive endpoints at least once. Save one screenshot or one-line summary of each response. By the end, you'll be able to **recite from memory** what each primitive returns and which customer signal triggers it. That's the muscle memory the final exam tests.

The five primitives (refresher from the lesson):

| # | Primitive | Endpoint | Customer signal |
|---|---|---|---|
| **P1** Retrieve | `/find` | "Find me documents about X." |
| **P2** Generate | `/ask` | "Answer the question with citations." |
| **P3** Constrain | `/ask` + `answer_json_schema` | "I need structured output, not prose." |
| **P4** Reason | `/graph` | "Show me connections between X and Y." |
| **P5** Stream-secure | `/resource/{id}` | "Give me the full document content." |

Plus one bonus endpoint, `/labelsets`, that supports primitives 1–3.

---

## Step 1 — Pick your API tool (10 min)

You have two options. **Pick one and stick with it through this Build.**

### Option A — Postman (recommended, free, well-known)

[Postman](https://www.postman.com/) is the canonical API client. Free for individuals, friendly UI for inspecting big JSON responses, and the workflow (collections + environments + saved requests) is industry standard.

1. Download from [postman.com](https://www.postman.com/downloads/).
2. Install. Open it.
3. Either sign up for a free account, or click **Skip and go directly to Workspace** to use the desktop app without logging in.
4. Create a new workspace called `Foundations`.
5. Click **New** → **Collection**. Name it `ARAG Primitives`.

### Option B — Just use `curl` (no setup)

If installing software is annoying, skip the GUI tool. Use the same `curl` pattern from Build 0. Every step below shows the equivalent `curl` command alongside the Postman version.

**Trade-off:** GUI tools make it easier to inspect big JSON responses. With `curl`, you'll want to pipe responses through `jq` (which prints JSON nicely):

```bash
# macOS — install jq once
brew install jq

# Linux — already there or:
sudo apt install jq

# Windows — download from https://stedolan.github.io/jq/download/
```

If you can't install `jq`, that's fine — the JSON will just be a wall of text.

---

## Step 2 — Set up your environment variables (5 min)

The whole point of an API client is **not pasting your credentials into every request**. You set them once as variables, then reference them everywhere.

### In Postman

1. Click the **Environments** tab (left sidebar).
2. **Create Environment** → name it `Build 1`.
3. Add three variables (use the **Initial Value** column):
   - `NUCLIA_API_URL` → paste the value from your `.env` (e.g., `https://aws-eu-1.rag.progress.cloud/api/v1`)
   - `NUCLIA_KB_ID` → paste your KB UUID
   - `NUCLIA_API_KEY` → paste your service-account JWT
4. Save. Select this environment from the top-right dropdown.

### Set a default auth header on the collection

This is the time-saver. Set the auth header **once on the collection** — every request inside inherits it automatically.

- **Postman:** open the collection → **Authorization** tab → Type: **API Key**. Key: `X-NUCLIA-SERVICEACCOUNT`. Value: `Bearer {{NUCLIA_API_KEY}}`. Add to: **Header**. Save.

If you're using plain `curl`, you'll just keep pasting the header in each command — no setup needed.

**You should see:** an environment dropdown with `Build 1` selected, and a collection that has the auth header configured at the collection level (so individual requests don't need it).

---

## Step 3 — P1 Retrieve: `/find` (15 min)

The simplest primitive. Returns documents matching your query. No LLM involved.

### Set up the request

| Field | Value |
|---|---|
| **Method** | `POST` |
| **URL** | `{{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/find` |
| **Headers** | (collection auth header is inherited) + `Content-Type: application/json` |
| **Body** (raw JSON) | see below |

```json
{
  "query": "your question here",
  "page_size": 5,
  "features": ["keyword", "semantic"],
  "show": ["basic", "values", "origin"]
}
```

**What each field does (in plain English):**
- `query` — the search phrase. Use something your 10 documents could answer.
- `page_size` — how many resources to return (max relevant matches). 5 is a sensible default.
- `features` — which retrieval engines to use. `keyword` is exact-match; `semantic` is meaning-based. Including both gives **hybrid retrieval** — generally best.
- `show` — which fields to include in the response. `basic` is metadata, `values` is custom fields, `origin` is the source filename/URL.

### Run it

Click **Send** (or run the `curl` below).

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"query":"your question","page_size":5,"features":["keyword","semantic"],"show":["basic","values","origin"]}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/find" | jq .
```

**You should see:** a JSON response containing:

- `resources` — an object keyed by resource ID. Each resource has its metadata, paragraphs with scores, and origin info.
- `best_matches` — a flat array of resource IDs, ranked best to worst.

### Inspect the response

Take 3 minutes. Look at:

- How many resources came back (probably 5 if your query was generic; could be fewer if specific).
- The **top paragraph score** — find the highest `score` value in any paragraph. Anything above 0.6 is good; above 0.8 is excellent.
- Any paragraphs with a `position` block containing `start_seconds` — only present for video/audio resources. Skip if your corpus is text-only.

**Save the response.** In Postman, just keep the tab open. In `curl`, redirect to a file: `... | jq . > find-response.json`.

---

## Step 4 — P2 Generate: `/ask` (sync mode) (15 min)

Same query, but now you want a **generated answer** with citations.

### Set up

| Field | Value |
|---|---|
| **Method** | `POST` |
| **URL** | `{{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/ask` |
| **Headers** | inherit auth + `Content-Type: application/json` + **`x-synchronous: true`** |
| **Body** | see below |

```json
{
  "query": "your question here",
  "prefer_markdown": true,
  "rephrase": true,
  "max_tokens": 300
}
```

**Why `x-synchronous: true`?** Without it, `/ask` returns NDJSON streaming chunks (one JSON object per line). For inspecting in a GUI tool, sync mode is much friendlier — you get one nice JSON blob.

`curl` equivalent:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -H "x-synchronous: true" \
  -d '{"query":"your question","prefer_markdown":true,"rephrase":true,"max_tokens":300}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/ask" | jq .
```

**You should see:**

- `answer` — a few sentences of generated text answering your question.
- `retrieval_results` — the same shape as `/find`: `resources` keyed by ID with paragraphs and scores.
- `retrieval_best_matches` — the ranked list of source IDs.
- `answer_json` — `null` for now (only populated when you use `answer_json_schema`).

**Key insight:** compare `retrieval_results.resources` to the `resources` from your Step 3 `/find` call. **They look almost identical.** That's because `/ask` is literally `/find` + LLM in one round trip. Same retrieval shape; new `answer` field on top.

If the answer says *"I don't have enough information to answer that question"* — that's correct behaviour. The model refuses to hallucinate. Try a different question that more obviously fits your corpus.

---

## Step 5 — P2 Generate with custom prompt (streaming) (15 min)

Same `/ask`, but now exercise two new things: **a custom prompt** and **streaming** (no `x-synchronous` header).

### Set up

Drop the `x-synchronous: true` header. Add a `prompt` field to the body:

```json
{
  "query": "your question here",
  "prefer_markdown": true,
  "rephrase": true,
  "max_tokens": 300,
  "prompt": {
    "system": "You are a concise assistant. Answer in 2 sentences maximum.",
    "user": "Context: {context}\n\nQuestion: {question}"
  }
}
```

**What's the `prompt` object?**
- `system` — instructions that shape the model's voice and behaviour.
- `user` — the template the model sees. `{context}` is replaced with the retrieved paragraphs; `{question}` is replaced with the query.

`curl` equivalent — use `-N` so streaming actually streams:

```bash
curl -N -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"query":"your question","prefer_markdown":true,"rephrase":true,"max_tokens":300,"prompt":{"system":"You are a concise assistant. Answer in 2 sentences maximum.","user":"Context: {context}\n\nQuestion: {question}"}}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/ask"
```

**You should see:** a series of NDJSON lines (one JSON object per line), each shaped like:

```
{"item":{"type":"answer","text":"The"}}
{"item":{"type":"answer","text":" return"}}
{"item":{"type":"answer","text":" policy is..."}}
...
{"item":{"type":"retrieval","results":{...}}}
{"item":{"type":"status","code":"0"}}
```

The answer arrives one chunk at a time, then one big retrieval object, then the status marker.

**Compare to Step 4:** same query, different prompt → different voice, different length. Notice how much terser this answer is than the Step 4 version. **That's the prompt lever.** Build 3 goes deeper.

If your GUI tool doesn't stream nicely, that's expected — Postman often concatenates the chunks. The raw NDJSON shape is still there to read. Use `curl -N` if you want to actually see the streaming behaviour.

---

## Step 6 — P3 Constrain: `/ask` with `answer_json_schema` (20 min)

Now the magic of structured output. You're going to tell the LLM: **"don't give me prose — fill out this exact JSON shape."**

### Set up

Method/URL same as before. Add the `x-synchronous: true` header back (easier to inspect). Body:

```json
{
  "query": "Suggest 4 follow-up questions based on the corpus.",
  "answer_json_schema": {
    "name": "follow_ups",
    "description": "Generates 4 follow-up questions based on the corpus.",
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

**What's `answer_json_schema`?**
- It's a JSON Schema describing the shape you want the model to fill.
- `name` and `description` are metadata the model reads to understand intent.
- `parameters` is the schema — type `object`, with a `questions` array of strings.
- `additionalProperties: false` is **critical** — it tells the model "no extra fields allowed." This forces the model into strict mode. Build 5 covers why.
- `required: ["questions"]` means the model **must** include this field.

`curl` equivalent:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -H "x-synchronous: true" \
  -d '{"query":"Suggest 4 follow-up questions based on the corpus.","answer_json_schema":{"name":"follow_ups","description":"Generates 4 follow-up questions based on the corpus.","parameters":{"type":"object","additionalProperties":false,"properties":{"questions":{"type":"array","items":{"type":"string"}}},"required":["questions"]}}}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/ask" | jq .
```

**You should see:** the response now has a populated `answer_json` field:

```json
{
  "answer": "...",
  "answer_json": {
    "questions": [
      "How does X compare to Y?",
      "What's the timeline for Z?",
      "..."
    ]
  },
  "retrieval_results": {...}
}
```

The model still produces a normal `answer` field with prose. The `answer_json` field is the structured output. **Both are grounded in the same retrieval.**

**If `answer_json` is null or empty:** double-check `additionalProperties: false`. The AI failure mode from the vibe-coding guide (#4) shows up here often.

**If the schema is rejected:** make sure every nested `object` in the schema also has `additionalProperties: false`. We've only got one level here, so it's straightforward — but Build 5's helper auto-injects this at every level.

This single feature — schema-constrained generation — is what unlocks Tier 3 work (workflow generation, structured extraction). Don't skip this step.

---

## Step 7 — Bonus: `/labelsets` (5 min)

Quick one. Returns the labelsets configured on your KB.

| Field | Value |
|---|---|
| **Method** | `GET` |
| **URL** | `{{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/labelsets` |

`curl`:

```bash
curl -s \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT" \
  "YOUR_API_URL/kb/YOUR_KB_ID/labelsets" | jq .
```

**You should see:** likely an empty object `{}` or a list with one or two default labelsets. For a fresh sandbox you haven't designed any labelsets yet — that's normal.

You'll wire labelsets properly in Build 7 (Smart Filters). Save this response now so you have a baseline to compare against later.

---

## Step 8 — P4 Reason: `/graph` (15 min)

The graph endpoint. Walks typed entity relationships extracted by the **Graph data-augmentation agent** (Build 6).

**Important:** if your KB doesn't have the Graph agent configured (the default for fresh sandbox KBs), `/graph` returns an empty `{"paths": []}`. That is **expected** for Build 1. You're just learning the call shape.

### Set up

| Field | Value |
|---|---|
| **Method** | `POST` |
| **URL** | `{{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/graph` |
| **Body** | see below |

```json
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

**What this asks:** "Give me up to 20 graph paths, where the path was *generated* by the *data-augmentation* agent." The second filter excludes ARAG's default NER noise (random DATE, ORG, MONEY entities). **Always include it.**

`curl`:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"query":{"and":[{"prop":"path"},{"prop":"generated","by":"data-augmentation"}]},"top_k":20}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/graph" | jq .
```

**You should see:** for a fresh KB without the graph agent, `{"paths": []}`. That's it. **Don't worry — Build 6 configures the agent and Build 8 walks the populated graph.**

Save the empty response. You'll re-run the same call in Build 8 and see it populate.

---

## Step 9 — P5 Stream-secure: `/resource/{id}` (10 min)

Final primitive. Returns the **full content** of a single resource — extracted text, all metadata, custom fields, the lot.

### Grab a resource ID

Go back to your Step 3 `/find` response. Pick any resource ID from the `best_matches` array. Copy it.

### Set up

| Field | Value |
|---|---|
| **Method** | `GET` |
| **URL** | `{{NUCLIA_API_URL}}/kb/{{NUCLIA_KB_ID}}/resource/{paste-resource-id-here}` |
| **Query params** | `show=basic&show=origin&show=extra&show=values&show=extracted` |

`curl`:

```bash
curl -s \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT" \
  "YOUR_API_URL/kb/YOUR_KB_ID/resource/PASTE_RESOURCE_ID?show=basic&show=origin&show=extra&show=values&show=extracted" | jq .
```

**You should see:** a big JSON blob with:

- `data.texts` (or similar) — the full extracted text from the document.
- `origin` — filename, mimetype, source URL.
- `metadata` — language, custom metadata.
- `extra` — any custom fields the document has (Build 9 covers these).

This is what powers document detail pages, citation expansion, and (when streaming media) the player surface. Save the response.

---

## Step 10 — Vibe-code a "primitives demo" CLI (40 min)

Time to glue all five primitives behind a single tool. Same vibe-coding loop from Build 0: brief → read → run → iterate.

### 10a. Make sure you're in the right folder

In your terminal:

```bash
cd ~/Desktop/foundations-build-0
pwd
```

The `pwd` (print working directory) should show your `foundations-build-0` path. If you'd rather keep Build 1 separate, create a sibling folder:

```bash
cd ~/Desktop
mkdir foundations-build-1
cd foundations-build-1
cp ../foundations-build-0/.env .
npm init -y
npm install dotenv
```

**What that did:** created a fresh project folder, copied your `.env` over, initialised `package.json`, installed `dotenv`.

### 10b. Brief your AI

Open your AI. Paste this **exactly** — don't edit:

```
Write a Node.js CLI tool called primitives-demo.mjs (ES modules / import syntax).

It should:
1. Use the dotenv package to read NUCLIA_API_URL, NUCLIA_KB_ID, NUCLIA_API_KEY from a .env file.
2. Take two command-line args: the primitive name and a query/id.
   Usage: node primitives-demo.mjs <primitive> <query-or-id>
   Where <primitive> is one of: find, ask, ask-schema, graph, resource
3. Implementation per primitive:
   - find: POST /kb/{kbId}/find with body {query, page_size: 5, features: ["keyword","semantic"], show: ["basic","values","origin"]}. Use sync (no streaming).
   - ask: POST /kb/{kbId}/ask with body {query, prefer_markdown: true, rephrase: true, max_tokens: 300}. Add header x-synchronous: true.
   - ask-schema: POST /kb/{kbId}/ask sync, with a hard-coded follow-up-questions schema (3 questions). The schema must include additionalProperties: false on every object.
   - graph: POST /kb/{kbId}/graph with body {query: {and: [{prop:"path"}, {prop:"generated", by:"data-augmentation"}]}, top_k: 20}.
   - resource: GET /kb/{kbId}/resource/{id} with query string show=basic&show=origin&show=extra&show=values&show=extracted
4. Every request uses the header X-NUCLIA-SERVICEACCOUNT: Bearer {API_KEY} and Content-Type: application/json (for POSTs).
5. Print ONE LINE summarising what came back:
   - find: "5 resources, top score 0.87"
   - ask: "Answer (143 chars), 3 citations"
   - ask-schema: "3 questions generated"
   - graph: "0 paths" (or "N paths" if populated)
   - resource: "Resource title: \"...\", extracted_text length: 2456 chars"

Use plain fetch. No SDK. No external HTTP libraries.
```

Click send. Wait for the file.

### 10c. Save the AI's output

- **Claude Code / Cursor:** ask them to save the file directly: *"Save this as primitives-demo.mjs in my current folder."*
- **Web chat (ChatGPT / Claude.ai):** copy the code, create `primitives-demo.mjs` in your editor, paste, save.

### 10d. Read the code

Open `primitives-demo.mjs`. Three checks:

1. **No fake SDK** — uses `fetch(...)`, not `import { Nuclia } from 'nuclia'`.
2. **Right auth header** — `X-NUCLIA-SERVICEACCOUNT: Bearer ...`, not `Authorization`.
3. **`additionalProperties: false`** on the ask-schema body's schema object.

If any fail, tell the AI: *"You did X but it should be Y. Fix it."*

### 10e. Run all five

```bash
node primitives-demo.mjs find "your question"
node primitives-demo.mjs ask "your question"
node primitives-demo.mjs ask-schema "anything"
node primitives-demo.mjs graph "anything"
node primitives-demo.mjs resource <paste-resource-id-from-find>
```

**You should see:** one line per primitive, e.g.:

```
5 resources, top score 0.84
Answer (287 chars), 4 citations
3 questions generated
0 paths
Resource title: "Onboarding Guide", extracted_text length: 4129 chars
```

If something errors, copy the error + the command into your AI: *"I ran [command] and got [error]. Fix it."*

### 10f. Save your prompt

Create `prompt-log.md` in the project folder. Paste:

1. The brief above.
2. The final working code from the AI.
3. Any fixes you had to ask for.

---

## Step 11 — Map customer signals to primitives (15 min)

This is the **scoping muscle** the final exam tests. In your project folder, create `primitives-map.md`. Fill in the table — **in your own words** (not copy-pasted from the lesson):

```markdown
# My Primitives Map

| Customer signal (their words) | Primitive | Why |
|---|---|---|
| "We need users to find documents fast." | P1 Retrieve (/find) | They want a search box, no generation. |
| "..." | ... | ... |
```

Fill in at least **5 rows** — one per primitive plus an extra. Use language your customers actually use. *"We want to ground our chatbot in our docs"* → P2. *"We need to generate workflow steps from technical specs"* → P3. *"Show us how our customers connect to our products"* → P4. Etc.

This file is **reviewed at the final exam**. Don't skip it. The map is the bridge between technical capability and customer conversation.

---

## Verification checklist

Before moving to Build 2, confirm:

- [ ] Postman collection with 6 saved requests, OR `curl` history with same coverage.
- [ ] One successful response per endpoint (`/find`, `/ask` sync, `/ask` streaming, `/ask` with schema, `/labelsets`, `/graph`, `/resource/{id}`).
- [ ] `primitives-demo.mjs` produces a sensible one-line summary for every primitive.
- [ ] `prompt-log.md` saved with brief + final code.
- [ ] `primitives-map.md` saved with at least 5 customer-signal entries in your own words.
- [ ] 3-minute Loom: walk through one query going through `find`, `ask`, `ask-schema`. Show how **the same query produces three different shapes of response** — that's the punchline of Build 1.

Then take the [Build 1 quiz](quiz.md). Pass → start [Build 2](../build-2-drop-in-widgets/).

---

## Getting unstuck

**`/find` returns 0 resources.**
- Your query didn't match anything. Try a more obvious question — something that's clearly in your corpus.
- Or check that all 10 documents still show "indexed" in the dashboard.

**`/ask` answer says "I don't have enough information."**
- That's the model **refusing to hallucinate** — good behaviour. Try a better-matched query.

**`/ask` with schema — `answer_json` is null.**
- Missing `additionalProperties: false`. Add it to every `object` in the schema.

**`/graph` returns paths I didn't expect.**
- You probably forgot the `{prop: "generated", by: "data-augmentation"}` filter. Without it, you'd get ARAG's default NER (DATE, ORG, MONEY noise). Always include the filter.

**Environment variables not loading in Postman.**
- Did you select the environment from the dropdown? Top-right in Postman.

**My JWT works in curl but not in Postman.**
- The collection-level auth header. Open collection settings → confirm `X-NUCLIA-SERVICEACCOUNT: Bearer {{NUCLIA_API_KEY}}` is set.

**Everything else.**
- Copy the entire error + the command/request that produced it.
- Paste both into your AI with: *"I ran [X] and got [Y]. What's wrong?"*
- Apply the fix. Re-run.

---

## Next

[Build 2 — Drop-in Widgets](../build-2-drop-in-widgets/) — the fastest "we have a chatbot" demo. No backend, no Node, no API keys in code. Embed-and-go in 30 minutes.
