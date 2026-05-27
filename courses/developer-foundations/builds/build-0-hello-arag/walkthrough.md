# Build 0 — Walkthrough: Hello ARAG

> Estimated time: 2–3 hours focused. Read the [lesson](lesson.md) (or watch the [video](video-script.md)) first.
>
> **New to terminals, Node.js, or curl?** That's fine. We explain every command. If anything's confusing, paste it into your AI assistant and ask *"what does this do?"* — that's a legitimate part of vibe coding.

## What you'll need open

Before you start, have these open on your screen:

- **The Nuclia dashboard** (link in your partner-onboarding email).
- **A terminal** — macOS Terminal app, Windows PowerShell, or Linux shell. Open a new tab.
- **A code editor** — VS Code is the easiest. We'll only edit two small files.
- **Your AI assistant** — Claude Code, Cursor, Claude.ai, or ChatGPT. Have a chat window ready.

If you don't have Node.js installed, install it now: [nodejs.org](https://nodejs.org) → download the LTS version → run the installer. Then close and reopen your terminal so it picks up Node.

To verify Node works, type this in your terminal and press Enter:

```bash
node --version
```

**Expected output:** something like `v20.11.0` or higher. If you see "command not found," Node didn't install correctly — reinstall from the link above.

You also need a folder of **~10 documents** to upload. Anything works — PDFs of meeting notes, markdown files, plain text, a few blog posts saved as text. If you don't have anything handy, save 10 articles from your company's website as PDFs. The content quality doesn't matter for Build 0 — you just need *something* in the KB.

---

## Step 1 — Create your Knowledge Base (5 min)

Open the Nuclia dashboard.

1. Click **"New Knowledge Base"** (or "Create KB" — wording varies).
2. **Name:** `<your-initials>-foundations` (e.g., `jay-foundations`).
3. **Region:** **EU**. We'll cover residency in Build 11; for now EU is fine.
4. **Generative model:** leave on **"Default Nuclia model."** We'll cover BYO-LLM in Build 11.
5. Click **Create**.

Wait ~30 seconds. The KB appears in your dashboard.

**You should see:** a fresh KB with 0 documents, listed under your account.

---

## Step 2 — Grab your three credentials (5 min)

Inside your new KB, find the **Settings** or **API Keys** panel. You need three values. They're long strings — be careful copy-pasting.

| Value | What it is | Looks like |
|---|---|---|
| **API URL** | The base URL of the Nuclia API for your region | `https://aws-eu-1.rag.progress.cloud/api/v1` |
| **KB ID** | The unique ID of this specific KB | `a1b2c3d4-...-1234567890ab` (a UUID) |
| **Service-account JWT** | Your auth token (treat like a password) | `eyJhbG...` (a long random-looking string starting with `eyJ`) |

Copy all three somewhere safe — a sticky note app, an encrypted notes app, anywhere you can find them in 30 seconds. Don't email them. Don't paste them into a public chat.

**If the dashboard doesn't show a service-account JWT:** create one. In your KB settings there's an "API Keys" or "Service Accounts" section with a "Create" button. Make one with read+write permissions.

---

## Step 3 — Set up your working folder (5 min)

Open your terminal. Pick a location for your course work:

```bash
cd ~/Desktop
mkdir foundations-build-0
cd foundations-build-0
```

**What that did:**
- `cd ~/Desktop` — moved into your Desktop folder.
- `mkdir foundations-build-0` — made a new folder called `foundations-build-0`.
- `cd foundations-build-0` — moved into it.

You're now "inside" the folder. Anything you create from here lands inside.

Now create a file called `.env` (the dot at the front is important). The easiest way:

```bash
touch .env
```

**What that did:** created an empty file named `.env`.

Open the file in your editor. The fastest way:

```bash
code .env
```

(That's the command-line shortcut to open in VS Code. If you don't have `code` set up, just open VS Code, then File → Open → navigate to your `foundations-build-0` folder → open `.env`. If `.env` looks hidden, press `Cmd+Shift+.` on macOS to show hidden files.)

Paste this into the file, **replacing the placeholder values with the three credentials from Step 2**:

```bash
NUCLIA_API_URL=https://aws-eu-1.rag.progress.cloud/api/v1
NUCLIA_KB_ID=paste-your-kb-uuid-here
NUCLIA_API_KEY=paste-your-jwt-here
```

Save the file.

> **Important:** never share this file. Never commit it to git. We'll explain why in Build 11.

---

## Step 4 — Ingest 10 documents (10 min)

Back in the Nuclia dashboard, open your KB. You should see an **upload area** (drag-and-drop zone).

1. **Drag 10 files into the upload area.** PDFs, markdown, plain text — anything text-shaped.
2. Watch the progress indicator. Each document goes from "processing" → "indexed."
3. Wait until **all 10** show as "indexed."

**You should see:** 10 documents listed in your KB, each with a title, mimetype, and status "indexed."

**If processing is slow** (>2 minutes per doc), grab a coffee. Some PDFs take time. If a document gets stuck on "processing" for >10 minutes, click into it to see if there's an error message; if it failed, just delete and skip — 9 documents is fine.

---

## Step 5 — Make your first API call from the terminal (10 min)

We're going to call the `/find` endpoint — ARAG's search endpoint — using `curl`. `curl` is a built-in tool on every Mac and Linux machine (and most Windows installs). You don't need to install anything.

This is the **simplest possible test** that your KB is reachable and your credentials work.

### 5a. Pick a query

Look at the 10 documents you uploaded. Think of a 4–6-word question your content could answer. Examples:

- "What is our return policy?"
- "How does the onboarding process work?"
- "What did Mara recommend for hiking?"

Whatever fits your content. Write it down.

### 5b. Run the call

Here's the command. **You will paste your three credentials in directly** (the easy way). Copy this template into a scratchpad:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT_HERE" \
  -H "Content-Type: application/json" \
  -d '{"query":"YOUR QUESTION HERE","page_size":5,"show":["basic","values","origin"]}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/find"
```

Replace **three things**:

- `YOUR_JWT_HERE` → your service-account JWT (the long `eyJhbG...` string).
- `YOUR_QUESTION HERE` → your 4–6-word question.
- `YOUR_API_URL/kb/YOUR_KB_ID` → e.g., `https://aws-eu-1.rag.progress.cloud/api/v1/kb/a1b2c3d4-...`

Paste the modified command into your terminal and press Enter.

**What the command does (in plain English):**
- `curl` is a "make an HTTP request" tool.
- `-X POST` says "this is a POST request."
- `-H "..."` adds a header. The first header is your auth; the second tells the server you're sending JSON.
- `-d '...'` is the JSON body — the search query.
- The URL at the end is the endpoint.

**You should see:** a wall of JSON. It'll be ugly. Look for:

- The word `"resources"` near the top.
- Inside `resources`, a few documents listed by ID.
- Inside each document, `"paragraphs"` with `"score"` and `"text"` fields.

If you see all that, **the API works**. Congratulations — you just made your first ARAG call.

**If you got an error instead:**

| Error | What it means | Fix |
|---|---|---|
| `{"detail": "Forbidden"}` or HTTP 401/403 | The JWT is wrong or doesn't have permission | Re-copy the JWT from the dashboard. Make sure no characters got cut off. |
| `{"detail": "..."}` mentioning the URL | The API URL is wrong | Re-copy from the dashboard. The URL ends in `/api/v1`, not just `/api`. |
| Empty `resources` | The query didn't match anything | Try a different query that more obviously relates to your content. |
| `curl: command not found` | curl isn't installed (rare) | On Windows, install curl: [curl.se/windows](https://curl.se/windows/). |

**To make the JSON readable**, pipe it through a tool called `jq`. If you have it installed, add `| jq .` at the end of the command:

```bash
curl -s -X POST ... | jq .
```

If you don't have `jq`, ignore this — the ugly JSON is fine.

### 5c. Read the response

Take 2 minutes to actually read what came back. Scroll through. Find:

- One paragraph with a `score` field. The score is a number between 0 and 1. Higher = more confident match. Anything above 0.6 is a good match.
- The `text` field next to the score — that's the paragraph from your document that matched.
- The `best_matches` list — the top resource IDs in ranked order.

This is what every search-based feature in ARAG returns. Same shape across every Build past here.

---

## Step 6 — Make your first `/ask` call (10 min)

Now the **generation** endpoint. Same auth, different URL, different body.

Same template:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT_HERE" \
  -H "Content-Type: application/json" \
  -H "x-synchronous: true" \
  -d '{"query":"YOUR QUESTION HERE","prefer_markdown":true,"rephrase":true,"max_tokens":500}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/ask"
```

Same three replacements as before. The new thing is the `x-synchronous: true` header — that asks for the response as one JSON blob instead of a streaming chunk-by-chunk response. Easier to read for Build 0.

Run it.

**You should see:**

- A field called `answer` — a few sentences of generated text answering your question.
- A field called `retrieval_results` — the documents the answer was grounded in (same shape as `/find`'s response).
- A field called `retrieval_best_matches` — the ranked list of source IDs.

**If the answer says "I don't have enough information to answer that question":** that's *correct behaviour* on a small corpus. The model is refusing to hallucinate. Try a different query, or ingest more documents.

---

## Step 7 — Make your first streaming `/ask` call (10 min)

Same call, but without the `x-synchronous` header, you get **streaming** — answer chunks arrive as they're generated. Watch:

```bash
curl -N -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT_HERE" \
  -H "Content-Type: application/json" \
  -d '{"query":"YOUR QUESTION HERE","prefer_markdown":true,"rephrase":true,"max_tokens":500}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/ask"
```

The `-N` flag tells `curl` not to buffer — it streams the response as it arrives.

**You should see:** a series of JSON lines scrolling past, each looking like:

```
{"item":{"type":"answer","text":"The"}}
{"item":{"type":"answer","text":" return policy"}}
{"item":{"type":"answer","text":" allows..."}}
...
{"item":{"type":"retrieval","results":{"resources":{...},"best_matches":[...]}}}
{"item":{"type":"status","code":"0"}}
```

Notice:

- Each line is one JSON object (this format is called **NDJSON** — newline-delimited JSON).
- Lines with `"type":"answer"` are chunks of the answer being typed out.
- The single `"type":"retrieval"` line near the end has the citations.
- The final `"type":"status"` line marks the end.

This is what every chat UI in the course parses. You'll see it again in Build 3 when you build a streaming chat — but you won't parse it by hand. The AI will.

---

## Step 8 — Vibe-code your first ARAG client (30 min)

Now the fun part. We'll get the AI to write a small Node.js script that does what step 7's `curl` did, in a more reusable way.

### 8a. Initialise the Node project

Back in your terminal, **make sure you're still in `~/Desktop/foundations-build-0`** (run `pwd` to check — it should print the folder path).

Then:

```bash
npm init -y
npm install dotenv
```

**What that did:**
- `npm init -y` created a file called `package.json` describing your project. The `-y` means "accept all defaults."
- `npm install dotenv` installed the `dotenv` package, which lets Node.js read your `.env` file automatically.

**You should see:** a `package.json` file appears in your folder, plus a `node_modules` folder (which holds installed packages). Both can be ignored — Node manages them.

### 8b. Brief your AI

Open your AI coding assistant (Claude Code, Cursor, ChatGPT, Claude.ai — whichever you picked in the vibe-coding guide).

Copy this brief and paste it in. **Don't edit it.** It's specific on purpose:

```
Write me a Node.js script called ask.mjs (using ES modules / import syntax).

It should:
1. Use the dotenv package to read NUCLIA_API_URL, NUCLIA_KB_ID, and NUCLIA_API_KEY
   from a .env file in the same folder.
2. Take a query string as a command-line argument: `node ask.mjs "what is X?"`
3. POST to {NUCLIA_API_URL}/kb/{NUCLIA_KB_ID}/ask with:
   - Header: X-NUCLIA-SERVICEACCOUNT: Bearer {NUCLIA_API_KEY}
   - Header: Content-Type: application/json
   - Body: { query, prefer_markdown: true, rephrase: true, max_tokens: 500 }
4. The response is NDJSON — each line is a JSON object shaped:
   { "item": { "type": "answer" | "retrieval" | "status", ... } }
5. As {item:{type:"answer", text}} arrives, print the text to stdout immediately
   (don't buffer the whole thing).
6. When {item:{type:"retrieval", results}} arrives, capture results.best_matches.
7. After the stream ends, print "---" then list the citation resource IDs.
8. Handle the case where one JSON object straddles two stream chunks (use
   balanced-brace counting to find complete objects in the buffer).

Use plain fetch. No SDK. No external HTTP library beyond what's built into Node.
```

Click send. Wait for the AI to produce the file.

### 8c. Save the AI's output

The AI will give you a file. Two ways to save it:

- **If you're using Claude Code or Cursor:** ask them to write the file directly. *"Save this as `ask.mjs` in my current folder."*
- **If you're using the web chat (ChatGPT / Claude.ai):** copy the code, open VS Code, create a new file called `ask.mjs` in your project folder, paste, save.

### 8d. Read the code before running it

Open `ask.mjs` in your editor and scan it. Three checks:

1. Does it use `fetch(...)` (built into Node 18+) — **not** an `import` of some SDK like `nuclia`?
2. Does the auth header say `X-NUCLIA-SERVICEACCOUNT`? (Not `Authorization`.)
3. Does the URL look like `${NUCLIA_API_URL}/kb/${NUCLIA_KB_ID}/ask`?

If yes → run it. If no → tell the AI: *"This uses [whatever's wrong]. Please rewrite using [what should be correct]."* The AI will fix it.

### 8e. Save your prompt

Create a file `prompt-log.md` in your project folder. Paste the brief you used, plus the AI's final working code. This is required for review-board sign-off and will save you hours later when you need a similar component.

---

## Step 9 — Run your script (10 min)

In your terminal, still in `~/Desktop/foundations-build-0`:

```bash
node ask.mjs "your question here"
```

**You should see:**

- Your question reflected back (optional, depending on how the AI implemented it).
- Then the answer streaming in, word by word, top of your terminal scrolling.
- Then a `---` separator.
- Then 1–5 resource IDs of the citations.

That's it. End-to-end ARAG client, vibe-coded.

### Try three different questions

Run it three times with three different queries. Each time, watch the streaming. Notice:

- Some queries return more citations than others.
- Some queries make the model say "I don't have enough information" — that's grounded refusal.
- The streaming feels fast for short answers, slower for long ones.

If something doesn't work, see "Getting unstuck" below.

---

## Getting unstuck

**The script just exits with no output.**
- Did you replace the placeholder credentials in `.env`? Open `.env` and check.
- Did `npm install dotenv` finish without errors? Run it again. If it errors, paste the error into your AI.

**HTTP 401 or 403.**
- Your JWT is wrong or expired. Re-copy from the Nuclia dashboard. The JWT must be the full string (often 500+ characters).

**Answer comes through, but no citations.**
- Your query didn't strongly match anything. Try a more obvious question.

**"Cannot find module 'dotenv'."**
- Run `npm install dotenv` from inside the project folder (run `pwd` first to confirm you're in the right folder).

**The streaming dumps everything at once at the end instead of token-by-token.**
- The AI's parser is buffering. Tell the AI: *"The output isn't streaming — it all arrives at once at the end. The parser is buffering until all chunks arrive. Fix it so each `{item:{type:"answer", text}}` is printed as it parses."*

**Anything else.**
- Copy the entire error message + the command that produced it.
- Paste both into your AI with: *"I ran [command] and got [error]. What's wrong?"*
- The AI explains and proposes a fix. You apply it. Re-run.

---

## Step 10 — Record your walkthrough (15 min)

Record yourself (Loom, QuickTime, OBS — any screen recorder) doing:

1. **(60 sec)** Show your Nuclia dashboard with the KB and 10 ingested documents.
2. **(60 sec)** Run one of the `curl /find` commands. Narrate what you see in the response — point at `score`, point at `text`.
3. **(90 sec)** Run `node ask.mjs "your question"` for three different questions. Narrate the streaming and citations.
4. **(30 sec)** Close: *"This is the simplest end-to-end ARAG client. Every Build past this is a richer version of these calls."*

Upload to `#build-clinic-submissions` in the partner Slack.

---

## Verification checklist

Before moving to Build 1, confirm:

- [ ] KB provisioned in EU region with 10 indexed documents.
- [ ] `.env` file with three credentials saved (and **not** committed to git).
- [ ] `curl /find` call returns at least one paragraph with `score > 0.6`.
- [ ] `curl /ask` (sync mode, with `x-synchronous: true`) returns an `answer` plus citations.
- [ ] `curl /ask` (streaming, with `-N`) shows NDJSON chunks scrolling past.
- [ ] `ask.mjs` script generated by your AI, reviewed by you, runs and streams.
- [ ] Three queries run through `ask.mjs` with citations appearing.
- [ ] `prompt-log.md` saved with your brief + the AI's working code.
- [ ] 5-minute walkthrough recording submitted.

Then take the [Build 0 quiz](quiz.md). Pass → start [Build 1](../build-1-five-primitives/).

## Next

[Build 1 — The Five Primitives](../build-1-five-primitives/) — extends today's `/find` and `/ask` into the full ARAG endpoint surface. After Build 1 you'll have hit every endpoint at least once.
