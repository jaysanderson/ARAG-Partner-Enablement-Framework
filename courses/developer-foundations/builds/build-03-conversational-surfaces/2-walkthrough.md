# Build 3 — Walkthrough: Conversational Surfaces

> Estimated time: 1.5–2 hours focused. Read the [lesson](1-lesson.md) first.
>
> **Vibe-code-centric.** This Build is the first one where you ship a real React app — but you don't set up Vite, install Tailwind, or wire up React Router by hand. You give your AI a comprehensive brief, the AI scaffolds the entire project end-to-end, and you read what it produces. This course is about Progress Agentic RAG. The tooling is the AI's job.

## What you'll build

A working React app with a custom chat experience against your Knowledge Box that:

- **Streams answers token-by-token** — no widget abstraction; you control the rendering.
- **Toggles between two prompt voices**: "Prospect" (3-sentence + CTA) and "Member" (detailed + citations).
- **Post-processes the answer** to turn the first markdown link into a pill-styled call-to-action button — the demo move customers notice.
- **Mounts two surfaces** — an inline chat page and a floating chat button — both reusing the same ARAG client.

## What you'll need open

- Your Build 0 credentials at hand (`NUCLIA_API_URL`, `NUCLIA_KB_ID`, `NUCLIA_API_KEY`).
- An AI assistant. **Claude Code** and **Cursor** can run commands + edit files directly — they execute the scaffolding end-to-end. **ChatGPT / Claude.ai (web)** emit the commands + file contents for you to paste; the work is the same, you just copy across.
- A modern browser.
- A code editor (VS Code recommended — only to read what the AI wrote and edit the `.env` file).
- Node.js 18+ already installed (from Build 0).

> **Vibe-coding refresher.** Read the [vibe-coding guide](../../vibe-coding-guide.md) if you haven't — especially the [citizen-developer principle](../../vibe-coding-guide.md#what-the-ai-handles-for-you-the-citizen-developer-principle). The principle this Build relies on: the AI handles every command-line / config-file / package-install operation. Your job is to give a precise brief and verify what comes back.

---

## Step 1 — Have your credentials ready (2 min)

Open your Build 0 `.env` file (or wherever you stored the three credentials). You'll need them in Step 3, after the AI scaffolds the project. They are:

- `NUCLIA_API_URL` — your API endpoint (e.g. `https://aws-eu-1.rag.progress.cloud/api/v1`).
- `NUCLIA_KB_ID` — your Knowledge Box UUID.
- `NUCLIA_API_KEY` — your service-account JWT.

Don't paste them anywhere yet. Just have them ready.

That's the entire prep step. Everything else is the AI's job.

---

## Step 2 — Vibe-code the whole app in one brief (40 min)

This is the meaty step — but most of it is "paste and watch". You give the AI one comprehensive brief; the AI scaffolds a fresh Vite + React + TypeScript project, installs and configures Tailwind, writes the ARAG client (`ragClient.ts`), writes the multi-voice chat component (`MultiSurfaceChat.tsx`), and wires the app together. The brief is long because it's specific — don't paraphrase it.

Open your AI assistant. Paste this brief **verbatim**:

```
Build me a Vite + React + TypeScript app called `foundations-build-3` in
~/Desktop that demonstrates a multi-surface chat experience against a
Progress Agentic RAG (ARAG / Nuclia) Knowledge Box.

PROJECT SETUP:
1. Scaffold a fresh Vite + React + TS project (`npm create vite@latest
   foundations-build-3 -- --template react-ts`), `cd` into it,
   `npm install`.
2. Install and configure Tailwind CSS end-to-end:
   - Install tailwindcss + postcss + autoprefixer as dev dependencies.
   - Run `npx tailwindcss init -p` to create config files.
   - Set tailwind.config.js content array to:
       ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
   - Replace src/index.css contents with the three @tailwind directives
     (base, components, utilities).
3. Create a .env file in the project root with these three lines and the
   placeholder values shown (the student will paste their real
   credentials in afterwards — you do NOT need to ask for them):
     VITE_NUCLIA_API_URL=PASTE_YOUR_URL_HERE
     VITE_NUCLIA_KB_ID=PASTE_YOUR_KB_ID_HERE
     VITE_NUCLIA_API_KEY=PASTE_YOUR_JWT_HERE
   The VITE_ prefix is required so Vite exposes them to client code.

VERIFY THE API BEFORE CODING:
This hits the ARAG /ask streaming endpoint. Do NOT trust my description
of the response schema below — confirm against the current Nuclia /
Progress ARAG docs (the AskResponse and FindResults interfaces). State
the verified assumptions in a header comment on src/lib/ragClient.ts.

CREATE src/lib/ragClient.ts:
Export an async generator function streamAsk(query, promptConfig) that:
1. POSTs to ${import.meta.env.VITE_NUCLIA_API_URL}/kb/${import.meta.env.VITE_NUCLIA_KB_ID}/ask
2. Headers:
     X-NUCLIA-SERVICEACCOUNT: Bearer ${import.meta.env.VITE_NUCLIA_API_KEY}
     Content-Type: application/json
3. Body: { query, prefer_markdown: true, rephrase: true,
   max_tokens: 500, prompt: promptConfig, citations: true }
4. Reads the streaming NDJSON response with native fetch + ReadableStream.
   Tracks balanced JSON object boundaries (handle the case where one
   JSON object straddles two stream chunks — accumulate the buffer until
   a complete object is parseable, then yield).
5. Yields:
   - { type: 'answer-chunk', text: string } for each fragment of
     answer text the model emits
   - { type: 'citations', citations: Array<{ id: string; title: string }> }
     once, when the retrieval block arrives — derive titles from
     results.resources[id].title
   - { type: 'done' } when status.code === '0' lands
6. Fail loud (console.warn) if a field has an unexpected shape or empty
   citations come back — don't swallow it. The student needs to see when
   extraction breaks.
7. Full TypeScript types. No SDK. Native fetch only.

CREATE src/components/MultiSurfaceChat.tsx:
A React component that:
1. Has a persona toggle at the top: two radio buttons, "Prospect"
   (default) and "Member".
2. Maintains chat history in state — Array of
   { role: 'user' | 'assistant'; text: string;
     citations?: Array<{id: string; title: string}> }.
3. Has a text input + submit button below the history.
4. On submit:
   - Append a user message to history.
   - Append an empty assistant message.
   - Pick the prompt config based on active persona.
   - Call streamAsk(userMessage, promptConfig).
   - For each 'answer-chunk', append text to the latest assistant
     message.
   - For 'citations', set citations on the latest assistant message.
   - On 'done', stop.
5. Chat-bubble style — user on the right, assistant on the left.
6. Renders assistant text through a formatAssistantHtml() helper:
   - Finds the first markdown link [label](url).
   - Replaces it with a Tailwind-styled pill button (inline-block
     rounded-full px-4 py-1 bg-blue-600 text-white no-underline).
   - Truncates everything AFTER the first link — the model often keeps
     talking past the CTA; we cut that off.
   - Converts **bold** markers to <strong>.
   - Returns the resulting HTML string. Render with
     dangerouslySetInnerHTML.
7. Renders citations under each assistant message as small links
   ("Source: [title]").
8. Disables the submit button while a response is streaming.
9. Auto-scrolls to the bottom on new messages.

Constants at the top of the chat file:

const PROMPTS = {
  prospect: {
    system: "You are a knowledgeable assistant. STRICT RULES: (1) Maximum 3 sentences. (2) End with ONE call-to-action link from the context, in markdown link format. (3) STOP immediately after the link.",
    user: "Context (includes CallToAction fields): {context}\n\nQuestion: {question}"
  },
  member: {
    system: "You are an expert research assistant with full corpus access. Provide a detailed, well-cited answer. Reference specific resources. 3-4 sentences max.",
    user: "Based on: {context}\n\nAnswer: {question}"
  }
};

UPDATE src/App.tsx:
- Render <MultiSurfaceChat /> inside a centred max-width-3xl container
  with comfortable padding.
- Add a header reading "Build 3 — Multi-Surface Chat" and a small
  subtitle "Streaming chat with two prompt voices, powered by Progress
  Agentic RAG."
- Plain Tailwind layout. No router, no other pages.

DELIVERABLE:
After scaffolding everything, run `npm run dev` and report the localhost
URL. Tell the student to paste their credentials into .env (replacing
the three PASTE_* placeholders) and then refresh the browser.

If anything errors at any step, fix it and continue — don't ask
clarifying questions about the brief; just keep moving.

If you're Claude Code or Cursor: execute everything directly.
If you're ChatGPT or Claude.ai web: emit the commands + file contents
in order so I can paste them. Be explicit about which files I create
and what goes in each.
```

Send the brief. Watch the AI work (Claude Code / Cursor) or paste through the AI's emitted commands one at a time (ChatGPT / Claude.ai web).

**Roughly what should happen:**

1. The AI scaffolds `foundations-build-3/` with Vite.
2. Installs all dependencies (including Tailwind + postcss + autoprefixer).
3. Generates `tailwind.config.js`, `postcss.config.js`, edits `src/index.css`.
4. Writes `src/lib/ragClient.ts` with the streaming-NDJSON parser.
5. Writes `src/components/MultiSurfaceChat.tsx` with the two-voice toggle + post-processor.
6. Updates `src/App.tsx` to render the chat.
7. Creates `.env` with the three `PASTE_*` placeholder values.
8. Starts `npm run dev` and reports `http://localhost:5173`.

If you used ChatGPT / Claude.ai web, you'll have done that work via copy-paste — same end state.

### If the AI's output errors

Copy the entire error message + the command that produced it. Paste both back into the same chat: *"I ran [command] and got [error]. Fix."* The AI iterates. This is the four-step vibe-coding loop from the [vibe-coding guide](../../vibe-coding-guide.md#the-four-step-loop-this-is-the-whole-course) — brief, read, run, iterate.

---

## Step 3 — Paste your credentials into `.env` (3 min)

Open the `.env` file the AI created at the root of the `foundations-build-3` folder. Replace the three `PASTE_*` placeholder values with your real credentials from Build 0:

```bash
VITE_NUCLIA_API_URL=https://aws-eu-1.rag.progress.cloud/api/v1
VITE_NUCLIA_KB_ID=<your KB UUID here>
VITE_NUCLIA_API_KEY=<your service-account JWT here>
```

Save. Refresh `http://localhost:5173` in your browser. (If the dev server stopped, run `npm run dev` again — or ask the AI to restart it.)

> **Important:** the JWT is in client-side code for this Build. **Fine for demo.** In production you proxy through your backend so the JWT never leaves your servers — Build 11 covers that pattern.

**You should see:** the header "Build 3 — Multi-Surface Chat", the Prospect/Member toggle, an empty chat area, and a text input.

---

## Step 4 — Test both voices (15 min)

This is the moment the Build's point lands.

### 4a. Test Prospect mode

Make sure the toggle is on **Prospect**. Ask a question your corpus can answer — same kind of query you used in Build 0. Submit.

**You should see:** an answer streams in word-by-word. It's roughly 2–3 sentences. **At the end is a pill-styled button** linking to one of your KB's resources — the post-processor caught the first markdown link and converted it. Anything the model wrote after that link was truncated.

### 4b. Test Member mode

Flip the toggle to **Member**. Ask the same question. Submit.

**You should see:** a longer, more detailed answer. References to specific sources. Citation chips appear below the assistant message ("Source: [doc title]"). No pill button — Member mode doesn't post-process the answer the same way.

### 4c. The punchline

Same Knowledge Box. Same question. **Two completely different conversational experiences.** One prompt config, one toggle, one streaming client. Customers will ask *"how much extra engineering for the member version?"* — the answer is zero. You ship both with one component and a toggle.

This is the moment you stop pitching ARAG as "chat over docs" and start pitching it as a **programmable conversational substrate**.

### If something doesn't look right

| Symptom | Quick check |
|---|---|
| Page loads but submit does nothing | DevTools → Network tab. Look for the `/ask` request. If it's 401/403, your JWT is wrong — re-check `.env`. |
| Answer streams but no pill button appears | The post-processor isn't matching. Paste a sample answer into your AI: *"this answer didn't get the pill button — here's the response text, fix `formatAssistantHtml`."* |
| Citations don't show in Member mode | The `citations` event isn't firing. Open the network tab, look at the NDJSON response, find the `retrieval` block. Paste the actual response into your AI: *"the citations event isn't firing — here's the actual response, fix the parser."* |
| Page renders unstyled (no Tailwind) | The Tailwind config didn't take. Paste the symptom to your AI: *"my Tailwind classes aren't applying — check `tailwind.config.js`, `postcss.config.js`, and `src/index.css` and fix whatever's off."* |

---

## Step 5 — Add the floating-chat surface (20 min) — optional but recommended

The Build is called "Conversational *Surfaces*" — plural. The inline chat from Step 2 is one surface. A floating chat button is the second — same underlying client + chat panel, different anchor on the page.

Paste this add-on brief into the same AI session:

```
Now add a FloatingChat surface to the app:

CREATE src/components/FloatingChat.tsx:
- A button fixed bottom-right (bottom-6 right-6), rounded-full, primary
  colour (Tailwind bg-blue-600), 48x48px touch target.
- Clicking the button opens a chat panel above it (320px wide, 480px
  tall, slide-up animation, Tailwind shadow + rounded).
- The chat panel reuses the message rendering + streamAsk logic from
  MultiSurfaceChat — extract whatever shared logic you need into a
  helper so we're not duplicating code.
- For this surface, hardcode the persona to "Prospect" (it's a
  shopper-facing surface — short answer with CTA pill).
- Esc key closes the panel. Clicking outside the panel closes it.
- Persists open/closed state in localStorage so reloads remember.

UPDATE src/App.tsx:
- Mount <FloatingChat /> at the root of the layout, so it floats above
  everything else.

After updating, restart the dev server if needed and tell me to refresh.
```

Send. Reload the dev server URL.

**You should see:** the inline chat from Step 2 still works AND there's a small floating button bottom-right of the page. Click it. A chat panel opens. Ask a query. Stream the answer. The pill button renders the same way. Close the panel with Esc. Reload the page — the panel's open/closed state is remembered.

**The point:** same chat component logic, two anchors on the page. That's the "multi-surface" promise.

---

## Step 6 — Save your prompts (5 min)

Create `prompt-log.md` in your project root using your text editor (VS Code → File → New File → save as `prompt-log.md`). Paste:

1. The big "Build me a Vite + React + TypeScript app..." brief from Step 2.
2. The "Add a FloatingChat surface" brief from Step 5 (if you did it).
3. Any debugging prompts you used.

This is the institutional knowledge for the next partner who has to ship a similar surface. Two months from now you'll be asked to build something identical for a customer — `prompt-log.md` is what reproduces this in 40 minutes instead of three hours.

---

## Verification checklist

- [ ] `foundations-build-3/` exists on your Desktop. `npm run dev` runs and the app loads at localhost.
- [ ] `.env` has your three real credentials (not the `PASTE_*` placeholders).
- [ ] **Prospect mode**: answer is 3 sentences max + a pill-styled CTA button at the end.
- [ ] **Member mode**: detailed answer + citation chips. No pill button.
- [ ] Same question, two different experiences — you can describe the difference in one sentence.
- [ ] (Optional) Floating chat surface works in Prospect mode, anchored bottom-right.
- [ ] `prompt-log.md` saved with all your briefs.

Then take the [Build 3 quiz](3-quiz.md). Pass → start [Build 4](../build-04-multilingual-and-voice/).

---

## Getting unstuck

The pattern for everything in this Build is the same: **paste the symptom + the relevant code into your AI and ask it to fix.** The AI scaffolded the project; the AI can fix the project.

**Tailwind classes aren't applying.**
- Paste to AI: *"Tailwind classes aren't applying — check tailwind.config.js, postcss.config.js, src/index.css, and fix whatever's off."*

**Search returns 0 results no matter what I type.**
- DevTools → Network → look at the `/ask` response. If `resources` is empty, your KB is empty (re-confirm Build 0). If you get 401/403, JWT is wrong in `.env`. If you get 200 but the chat shows nothing, paste the response body into your AI with: *"got this response, chat shows nothing — fix the parser."*

**Streaming dumps everything at the end instead of token-by-token.**
- The parser is buffering. Paste: *"my chat answer arrives all at once at the end instead of streaming — the parser is over-buffering, fix it so each answer-chunk renders as it arrives."*

**Citations show up in Member mode but not Prospect mode (or vice versa).**
- Open `src/components/MultiSurfaceChat.tsx`. Find where citations attach to the assistant message. Paste the file + symptom into your AI: *"citations attach in one mode but not the other — fix the logic."*

**`npm run dev` fails on start.**
- Copy the entire error. Paste into AI: *"npm run dev failed with: [error]. Fix."*

**Something else.**
- Paste the symptom + your `.env` (with the JWT redacted) + the relevant file into your AI. Ask it to fix. Re-test.

---

## Next

[Build 4 — Multilingual & Voice Switching](../build-04-multilingual-and-voice/) — same chat surface, now with multilingual responses driven by a query prefix pattern. You'll see how a one-line prepended instruction in the user prompt changes the AI's response language entirely, with no infrastructure changes. Another Tier 2 demo move customers don't expect.
