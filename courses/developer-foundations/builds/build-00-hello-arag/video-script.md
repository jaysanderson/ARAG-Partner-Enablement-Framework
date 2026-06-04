# Video Script — Build 0: Hello ARAG

> **Duration target:** 12 minutes
> **Format:** Screen recording + voiceover. 1080p, 30 fps. Single take preferred; cuts acceptable at section boundaries.
> **Audience:** Partner technical learners starting Developer Foundations.
> **Tools on screen:** Nuclia dashboard (Chrome), terminal (`curl`), AI coding assistant (Claude Code / Cursor), code editor (VS Code).
> **Branding:** Progress + Nuclia title card at open (3 sec); end card with "Build 1 — The Five Primitives" pointer (3 sec).

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 0 · Hello ARAG"*. Fade to a split screen — left: Nuclia dashboard; right: a terminal.

**VOICEOVER:**
> Welcome to Build 0 of the Progress Agentic RAG Developer Foundations course. Twelve minutes from now, you'll have a working ARAG Knowledge Box, you'll have made three API calls against it, and you'll have watched an AI write your first ARAG client in 90 seconds. That last part — the AI writing the code — is the entire mental model of this course. I'll come back to it. Let's start.

## Section 1: What ARAG is and what a KB is (0:30 – 2:00)

**ON SCREEN:** Diagram (simple): ARAG cloud → KB → documents. Annotations: "five primitives — find, ask, ask+schema, graph, resource". A list of "what a KB owns" appears next to the diagram.

**VOICEOVER:**
> ARAG is a platform. It exposes five primitives — Retrieve, Generate, Constrain, Reason over relations, and Stream media. Today we use two of them. The unit you'll provision is called a **Knowledge Box** — KB for short. A KB owns your ingested documents, your labelsets, your service-account credentials, your residency region, and your LLM endpoint. One application uses one KB. That's the default and that's what we'll do today.

## Section 2: Provision a KB (2:00 – 3:30)

**ON SCREEN:** Switch to Nuclia dashboard. Click "New Knowledge Box". Name it `foundations-sandbox`. Region: pick the option closest to you (EU for Europe / EMEA, USA for the Americas). Click create. Wait for provisioning (cut to fast-forward if it takes >10 seconds). Open the settings panel, copy the API key + KB ID + endpoint URL.

**VOICEOVER:**
> In the dashboard, new Knowledge Box, name it whatever you want — I'm going `foundations-sandbox`. For region, pick whichever option is closest to you geographically — EU if you're in Europe, USA if you're in the Americas — and **then stick with that same region for every Knowledge Box you provision in this course**. Mixing regions across builds will create confusion you don't need today. Default model. Provision. Takes a few seconds.
>
> Once it's ready, three things you'll grab: the API endpoint URL, your KB ID, and your service-account JWT. Put them in a local `.env` file. Don't commit the file. We'll use these in every call going forward.

## Section 3: Upload the corpus folder (3:30 – 4:30)

**ON SCREEN:** In the Nuclia dashboard, navigate to **Resources → Upload → Upload folder**. Pick the `corpus/content_type/` folder from the Build 0 directory. Enable the **"use folder names as label names"** toggle. Confirm. The processing indicator runs over 37 documents. Cut to fast-forward; cut back when all show "indexed". Briefly zoom on **KB → Labelsets** to show the auto-created `content_type` labelset with seven labels.

**VOICEOVER:**
> One folder, one click. The corpus we ship with this Build is at `corpus/content_type/` — 37 outdoor-retail documents organised into seven subfolders. I'm using Nuclia's **Upload folder** option with **use folder names as label names** turned on. That's the trick: Nuclia takes the parent folder name as the labelset and the subfolder names as label values. I get a labelset for free without tagging anything by hand.
>
> Processing takes about thirty seconds per document — Nuclia chunks, embeds, classifies, and extracts metadata from each one. That's the *platform* doing platform work. We don't touch any of it. Once the indicator hits zero, I have a Knowledge Box with 37 documents and a `content_type` labelset with seven values. Same workflow you'll re-use in every build past here — including the capstone.

## Section 4: First `/find` call (4:30 – 6:00)

**ON SCREEN:** Switch to terminal. `source .env`. Run the `curl -X POST .../find` command (have the command on screen via a text overlay too — partners may pause to copy). The raw JSON response prints. Highlight the `paragraphs.score` field and the `best_matches` array with red circles (use post-production overlays since the raw JSON is one long line).

**VOICEOVER:**
> Now the first API call. POST to `/find`. The `X-NUCLIA-SERVICEACCOUNT` header carries the JWT. The body is just a query, a page size, and a `show` list. Run it.
>
> Look at the response. **Resources**, with paragraphs, each with a score. **Best matches** — the ranked list. ARAG returns paragraph-level matches, not just documents. You can show the customer the exact line that matched, not "this document might contain it." That's a Tier 1 demo move.

## Section 5: First `/ask` streaming call (6:00 – 7:30)

**ON SCREEN:** Run the `curl -N -X POST .../ask` command. The NDJSON stream prints to the terminal. Highlight the `{item:{type:"answer"...}}` chunks scrolling, then the `{item:{type:"retrieval"...}}` block, then `{item:{type:"status","code":"0"}}`.

**VOICEOVER:**
> The second endpoint. POST to `/ask`. Same query. Notice the `-N` flag — that disables curl's buffering so we see the stream as it arrives.
>
> Watch the chunks. NDJSON — newline-delimited JSON. Each line is shaped `{item: type, payload}`. We get **answer** items as the LLM generates, then a single **retrieval** block at the end with the citations, then a **status** item to mark the end. This is the streaming format every chat surface in this course parses.

## Section 6: Vibe-code `ask.mjs` (7:30 – 10:30)

**ON SCREEN:** Open Claude Code (or Cursor — show whichever you're using; if you use Claude Code, show the CLI). Paste the brief from the walkthrough verbatim. Watch the AI generate `ask.mjs`. Cut to fast-forward during generation. When it stops, scroll through the file in the editor.

**VOICEOVER:**
> Here's where we shift modes. I want a Node.js script that does what `curl` just did, with streaming, and dumps the answer + citations. I'm not going to write it. I'm going to direct an AI to write it. This is **vibe coding** — and it's how every Build past here is structured.
>
> I open Claude Code. I paste a brief. The brief tells it the endpoint, the auth header, the body shape, the response shape, and what I want the output to look like. *Direct* and *specific*. Not "write me an ARAG client" — that's how you get hallucinated SDKs and broken code.

**ON SCREEN:** The brief from the walkthrough scrolls across the screen (overlay). The AI's generated file `ask.mjs` opens in the editor.

**VOICEOVER:**
> Here's the script it produced. Sixty lines. Reads `.env`. Takes a CLI argument. Posts to `/ask`. Parses the NDJSON balanced-brace style — it knows JSON objects can straddle chunk boundaries, so it counts braces. Streams `answer.text` to stdout. Captures `best_matches`. Prints citations at the end.
>
> I read this **before I run it**. Three checks. One — does it use `fetch`? Yes. (No fabricated SDK — failure mode number one.) Two — is the auth header right? Yes, `X-NUCLIA-SERVICEACCOUNT`. Three — does it stream, not buffer? The parsing logic looks right.
>
> Now I run it.

**ON SCREEN:** `npm install dotenv && node ask.mjs "what's in my corpus?"`. Watch the answer stream to the terminal. The `---` separator. The citations.

**VOICEOVER:**
> Streaming. Citations. Three queries, three successful answers. Done. The script was generated in 90 seconds. I spent another two minutes reading it. *That* is the loop you'll use for every Build past this one — direct, generate, verify.

## Section 7: The mental model — platform vs application (10:30 – 11:30)

**ON SCREEN:** Back to the diagram from Section 1. Annotate: left half is "PLATFORM — ARAG provides, you call" (KB, ingest, retrieval, generation, citations). Right half is "APPLICATION — you generate via AI" (your script, your UI, your workflows).

**VOICEOVER:**
> Here's the mental model. The **platform** is ARAG — the KB, the retrieval, the generation, the citation extraction. You don't build that. You provision it and call it.
>
> The **application** — the code that calls the platform — is commodity. You direct an AI to write it. You don't memorise the NDJSON parser. You don't memorise the fetch signature. You memorise the **endpoints, the body shapes, the auth header, and what the response means**. Those are what you brief the AI on. Everything else is generated.
>
> Internalise this distinction. Every customer engagement past today works this way.

## Wrap (11:30 – 12:00)

**ON SCREEN:** End card. *"Build 1 — The Five Primitives. Next."* QR code or short URL to the next Build's video.

**VOICEOVER:**
> Build 1 is next. We extend today's `/find` and `/ask` into the full primitive set — `/ask` with schema constraints, the typed knowledge graph at `/graph`, resource fetch at `/resource`, labelset enumeration. After Build 1, you've seen every endpoint at least once. From there it's just composition. See you in Build 1.

---

## Production notes

- **Voiceover:** record after the screen capture is done. Match cuts to the talk track so transitions don't feel rushed.
- **Pacing:** the 12-minute target is firm but flexible up to 13:30 if needed. Don't pad — if you finish in 11:00, even better.
- **Code overlays:** the brief in Section 6 should appear as a clean overlay (white text on dark background), not a screen-share of a text editor. Easier to read.
- **Live AI generation:** the AI's response in Section 6 will take 30–90 seconds in real time. Cut to a fast-forward indicator (×4 speed); the audience doesn't need to watch the cursor.
- **Subtitles / captions:** auto-generate from the voiceover then hand-edit. ARAG-specific terms (`X-NUCLIA-SERVICEACCOUNT`, `prefer_markdown`, `rephrase`) should be displayed as text overlays the first time they appear, not just spoken.
- **End card:** include the next Build's title + URL, and a "Get help in `#build-clinic-help` on partner Slack" link.
