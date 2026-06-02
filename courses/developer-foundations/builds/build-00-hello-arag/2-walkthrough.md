# Build 0 — Walkthrough: Hello ARAG

> Estimated time: 2–3 hours focused. Read the [lesson](1-lesson.md) (or watch the [video](video-script.md)) first.
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

The **10 sample documents we provide for Build 0** — included with the course at `courses/developer-foundations/sample-corpus/build-0/` in the framework repo. (If you don't have the framework repo cloned locally yet, clone it from [the partner-enablement repo URL] first, or download just the `sample-corpus/build-0/` folder as a zip from the same location.) These are the documents you'll upload to your Knowledge Box in Step 4. Using the same corpus everyone else in the course uses means every query you try later behaves the way the lessons describe — your results will line up with the screenshots and example outputs in subsequent Builds.

---

## Step 1 — Create your Knowledge Box (5 min)

Open the Nuclia dashboard.

1. Click **"New Knowledge Box"** (or "Create KB" — wording varies).
2. **Name:** `<your-initials>-foundations` (e.g., `jay-foundations`).
3. **Region:** **pick the option geographically closest to you** — EU if you're in Europe / EMEA, USA if you're in the Americas. **Then stick with that same region for every Knowledge Box you provision in this course.** Knowledge Boxes in different regions can't share data, and switching mid-course adds confusion. Residency is covered in Build 11.
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

Now create a file called `.env` (the dot at the front is important) using your text editor — not the terminal. Open VS Code, then **File → New File**. Save it (Cmd/Ctrl + S) into the `foundations-build-0` folder you just created. Name it exactly `.env` — including the leading dot, with no extension after it. VS Code may warn that filenames starting with a dot are hidden — that's normal, accept it.

> **Why a text editor and not `touch .env` in the terminal?** Two reasons. First, you're going to paste secrets into this file in a moment — opening it in the editor where you'll work on it is one fewer step and one fewer place where the credentials could end up. Second, the terminal has its own gotchas around hidden filenames (the file looks like it doesn't exist when you `ls`, and `cat .env` shows nothing helpful), and Build 0 isn't the right time to fight that. The text editor shows you the file plainly.

If your editor isn't VS Code, the same flow works: New File → Save As → name it `.env` → save into the `foundations-build-0` folder. If `.env` looks hidden in the editor's file tree, press `Cmd+Shift+.` on macOS (or enable "Show hidden files" in your editor's settings).

With the empty `.env` file open in front of you, paste this in, **replacing the placeholder values with the three credentials from Step 2**:

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

1. **Drag the 10 files from `courses/developer-foundations/sample-corpus/build-0/` into the upload area.** Select all 10 files in your file explorer (Cmd/Ctrl+A inside that folder) and drag them onto the Nuclia dashboard drop zone.
2. Watch the progress indicator. Each document goes from "processing" → "indexed."
3. Wait until **all 10** show as "indexed."

> You can ingest your own documents later for experimentation, but the lessons, quizzes, and downstream Builds all assume the provided corpus is what's in your KB.

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

### 5b. Build your scratch curl in VS Code

Don't try to edit a 5-line curl command directly in the terminal — especially not with a 500+ character JWT in the middle of it. One stray character and the call silently breaks in a way that's hard to debug. Instead, you'll keep a **scratch file** in VS Code with your working command, do all the placeholder replacement there with Find & Replace, then copy the finished command into the terminal.

In VS Code, **File → New File**. Save it (Cmd/Ctrl + S) into your `foundations-build-0` folder as `scratch.sh`. Then paste this template in **exactly as-is** — do not edit anything yet:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT_HERE" \
  -H "Content-Type: application/json" \
  -d '{"query":"YOUR QUESTION HERE","page_size":5,"show":["basic","values","origin"]}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/find"
```

Now use VS Code's **Find & Replace** to swap in your real values from Step 2 — one placeholder at a time. Open Find & Replace with **Cmd/Ctrl + H**.

1. Find `YOUR_API_URL` → Replace with your API URL (e.g., `https://aws-eu-1.rag.progress.cloud/api/v1`). Click **Replace All**.
2. Find `YOUR_KB_ID` → Replace with your KB UUID. Click **Replace All**.
3. Find `YOUR_JWT_HERE` → Replace with your service-account JWT (the long `eyJhbG...` string). Click **Replace All**.

**Leave `YOUR QUESTION HERE` alone for now** — that one changes per call.

Save the file (Cmd/Ctrl + S).

> **Why this workflow.** The three credential placeholders (URL, KB ID, JWT) only need to be filled in once and they're the same for every API call in this build. Doing the swap in VS Code's Find & Replace — visually, character-perfect — eliminates the most common Build 0 error mode: a mis-pasted JWT. The scratch file then becomes your reusable pad for steps 6, 7, and 11.
>
> **Same warning as `.env`:** scratch.sh now contains a live credential. Don't share it. Don't commit it to git. We'll formalise this in Build 11.

### 5c. Run your first call

Back in `scratch.sh` in VS Code, replace `YOUR QUESTION HERE` with your 4–6-word question from 5a (just type over those three words). Save.

Then **select the entire curl command** (Cmd/Ctrl + A if scratch.sh has only this one command) and copy it (Cmd/Ctrl + C). Switch to your terminal, paste, and press Enter.

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

### 5d. Read the response

Take 2 minutes to actually read what came back. Scroll through. Find:

- One paragraph with a `score` field. The score is a number between 0 and 1. Higher = more confident match. Anything above 0.6 is a good match.
- The `text` field next to the score — that's the paragraph from your document that matched.
- The `best_matches` list — the top resource IDs in ranked order.

This is what every search-based feature in ARAG returns. Same shape across every Build past here.

---

## Step 6 — Make your first `/ask` call (10 min)

Now the **generation** endpoint. Same auth, different URL, different body.

Open `scratch.sh` from Step 5 in VS Code. Add a blank line below your `/find` curl, then paste this template **exactly as-is** below it:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT_HERE" \
  -H "Content-Type: application/json" \
  -H "x-synchronous: true" \
  -d '{"query":"YOUR QUESTION HERE","prefer_markdown":true,"rephrase":true,"max_tokens":500}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/ask"
```

Run **Find & Replace** (Cmd/Ctrl + H) on this block exactly as you did in 5b — swap `YOUR_API_URL`, `YOUR_KB_ID`, and `YOUR_JWT_HERE` for your real values. (If you used Replace All earlier, all three placeholders should already be filled in across the file — verify that's the case and re-run any that didn't take.) Then replace `YOUR QUESTION HERE` with your question. Save.

The new thing in this command is the `x-synchronous: true` header — that asks for the response as one JSON blob instead of a streaming chunk-by-chunk response. Easier to read for Build 0.

Select the whole `/ask` curl command in `scratch.sh` (Cmd/Ctrl + click-drag, or use shift-arrows), copy, paste into your terminal, and press Enter.

**You should see:**

- A field called `answer` — a few sentences of generated text answering your question.
- A field called `retrieval_results` — the documents the answer was grounded in (same shape as `/find`'s response).
- A field called `retrieval_best_matches` — the ranked list of source IDs.

**If the answer says "I don't have enough information to answer that question":** that's *correct behaviour* on a small corpus. The model is refusing to hallucinate. Try a different query, or ingest more documents.

---

## Step 7 — Make your first streaming `/ask` call (10 min)

Same call, but without the `x-synchronous` header, you get **streaming** — answer chunks arrive as they're generated. Same scratch-file pattern: open `scratch.sh`, add a blank line below your previous block, paste this template exactly as-is:

```bash
curl -N -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT_HERE" \
  -H "Content-Type: application/json" \
  -d '{"query":"YOUR QUESTION HERE","prefer_markdown":true,"rephrase":true,"max_tokens":500}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/ask"
```

If your Replace All in 5b already swapped the three credential placeholders across the whole file, they're already filled here too — just replace `YOUR QUESTION HERE` with your question, save, select-copy-paste into the terminal as before. If they didn't (e.g. you only replaced inside the first block), re-run Find & Replace now.

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

Copy this brief and paste it in. **Don't edit it.** It's specific on purpose — and it includes a "verify the API before coding" instruction up front so the AI can't guess the response shape:

```
Write me a Node.js script called ask.mjs (ES modules / import syntax).

IMPORTANT — verify the API before coding:
This hits the Progress Agentic RAG (ARAG / Nuclia) /ask streaming endpoint.
Do NOT trust my description of the response schema below — I may have it wrong.
Before writing code, confirm the current schema against the Nuclia/Progress ARAG
docs (the AskResponse and FindResults interfaces in particular):
  - the exact set of streaming item.type values emitted
  - the shape of every field you read — especially whether best_matches is
    string[] (paragraph-id strings) or object[]
State the verified assumptions in a header comment.

Requirements:
1. Use dotenv to read NUCLIA_API_URL, NUCLIA_KB_ID, NUCLIA_API_KEY from a .env
   file in the same folder. Exit with a clear error if any are missing.
2. Take a query string as a CLI argument: `node ask.mjs "what is X?"`.
   Exit with a usage message if absent.
3. POST to {NUCLIA_API_URL}/kb/{NUCLIA_KB_ID}/ask with:
   - Header: X-NUCLIA-SERVICEACCOUNT: Bearer {NUCLIA_API_KEY}
   - Header: Content-Type: application/json
   - Body: { query, prefer_markdown: true, rephrase: true, max_tokens: 500 }
   I want source attribution in the output, so also request it explicitly:
   add `citations: true` to the body (or `citations: "llm_footnotes"` if you
   determine that better suits inline footnotes — tell me which you chose and why).
4. The response is NDJSON: each object is shaped { "item": { "type": ..., ... } }.
   Treat the type list as open — handle the ones you need and ignore the rest;
   do not assume my list is complete or correct.
5. As answer items arrive, print their text to stdout immediately (stream it,
   don't buffer the whole answer).
6. Collect the sources that backed the answer. Be precise about the distinction:
   - "retrieval" items carry the PARAGRAPHS retrieved (best_matches).
   - "citations" items (only present because of step 3) carry the mapping of
     answer spans back to source paragraphs.
   Derive the resource id from each paragraph id correctly per the shape you
   verified — do not assume it's a property on an object.
7. After the stream ends, print "---" then the citations: prefer the answer-span
   -> source mapping if present, otherwise the deduped list of source resource IDs.
8. Handle a JSON object that straddles two stream chunks (balanced-brace counting
   to extract complete objects from the buffer; keep the partial remainder).

Robustness — fail loud, not silent:
- On non-2xx HTTP, print status + body and exit non-zero.
- If a field you read is empty or an unexpected type (e.g. best_matches is not
  what you expected, or zero sources came back), warn to stderr rather than
  silently producing "(no citations)". I need to see when extraction breaks.

Use plain fetch. No SDK. No external HTTP library beyond what's built into Node.
```

> **Why the "verify the API before coding" preamble matters.** The single most common AI failure mode in this course is the AI confidently writing code against an *imagined* response shape. The opening paragraph forces the assistant to ground its work in the actual current docs — the same discipline you'll teach customer engineers in a real engagement. Notice also the explicit `citations: true` body field: without it, the streaming response gives you `retrieval` items (paragraphs that *could* have backed the answer) but no "citations" item (the LLM's actual attribution of each claim to a source). For a real customer demo you want the second — inline source attribution that survives copy-paste.

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

## Step 11 — Render the citations for your first `/ask` answer (15 min)

You've watched the citations stream past in step 7 and you've printed the bare resource IDs at the end of `ask.mjs` in step 9. This step closes the loop: turn those IDs into a clean, de-duped, human-readable citation list. The lesson covers *why* the naive approach fails ([Citations — extracting, de-duping, and resolving](1-lesson.md#citations--extracting-de-duping-and-resolving)) — here you do it hands-on.

### 11a. Inspect `best_matches` in the raw response

Run your sync `/ask` call from step 6 again, but this time pipe it through `jq` to isolate just the `best_matches` array. Open `scratch.sh`, add a blank line below your previous blocks, paste this template:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer YOUR_JWT_HERE" \
  -H "Content-Type: application/json" \
  -H "x-synchronous: true" \
  -d '{"query":"YOUR QUESTION HERE","prefer_markdown":true,"rephrase":true,"max_tokens":500}' \
  "YOUR_API_URL/kb/YOUR_KB_ID/ask" \
  | jq '.retrieval_results.best_matches'
```

Same drill: if Find & Replace already swapped the three credential placeholders across the whole file, they're filled here too — just edit `YOUR QUESTION HERE`. Save, select the whole block, copy into the terminal, run.

(If you don't have `jq`, drop the trailing `| jq ...` part and scroll the raw output to find the `"best_matches"` key by eye.)

**You should see:** an array of strings shaped like `"a1b2c3d4-...-1234567890ab/t/body/12-340"`. Notice that the same resource id (the leading UUID) often repeats — one resource contributes several matching paragraphs.

### 11b. Implement the splitter

Open `ask.mjs` in your editor. Find the spot where you currently print the resource IDs (the `---` separator section from step 9). Add the splitter the lesson showed — for plain JS it looks like this:

```js
const seen = new Set();
const uniqueRids = [];
for (const ref of bestMatches ?? []) {
  const rid = String(ref).split('/')[0];
  if (!rid || seen.has(rid)) continue;
  seen.add(rid);
  uniqueRids.push(rid);
}
console.log('Unique resource IDs:', uniqueRids);
```

Run the script again: `node ask.mjs "your question"`.

**You should see:** a much shorter list than `best_matches.length` — typically 1–5 unique IDs even if `best_matches` had 10–20 entries. That's the de-dup working.

### 11c. Look up each rid in `resources` and print the title

Now resolve those IDs against the `resources` map. In the same `retrieval` block you already capture, there's a `results.resources` (or `retrieval_results.resources` in sync mode) object. Extend the loop:

```js
const resources = retrievalResults?.resources ?? {};
for (const rid of uniqueRids) {
  const r = resources[rid];
  const title = (r?.title ?? '').replace(/^#+\s*/, '').trim() || rid.slice(0, 8);
  console.log(`- ${title}  (${rid})`);
}
```

Run the script one more time.

**You should see:** one row per cited resource — N rows where N === unique rids in `best_matches`. Each row shows the cleaned-up document title followed by the resource id. This is what a real citation chip in a chat UI is built on top of.

If a title comes back as `undefined` or empty, the fallback to `rid.slice(0, 8)` keeps the row from looking broken. If *all* titles are empty, your KB documents were ingested without titles — open one in the Nuclia dashboard and check the "basic" metadata panel.

---

## Verification checklist

Before moving to Build 1, confirm:

- [ ] Knowledge Box provisioned in your chosen region (closest to you) with 10 indexed documents.
- [ ] `.env` file with three credentials saved (and **not** committed to git).
- [ ] `scratch.sh` file in your project folder with the three credential placeholders Find-and-Replaced for real values (also not committed to git).
- [ ] `curl /find` call returns at least one paragraph with `score > 0.6`.
- [ ] `curl /ask` (sync mode, with `x-synchronous: true`) returns an `answer` plus citations.
- [ ] `curl /ask` (streaming, with `-N`) shows NDJSON chunks scrolling past.
- [ ] `ask.mjs` script generated by your AI, reviewed by you, runs and streams.
- [ ] Three queries run through `ask.mjs` with citations appearing.
- [ ] `prompt-log.md` saved with your brief + the AI's working code.

Then take the [Build 0 quiz](3-quiz.md). Pass → start [Build 1](../build-01-five-primitives/).

## Next

[Build 1 — The Five Primitives](../build-01-five-primitives/) — extends today's `/find` and `/ask` into the full ARAG endpoint surface. After Build 1 you'll have hit every endpoint at least once.
