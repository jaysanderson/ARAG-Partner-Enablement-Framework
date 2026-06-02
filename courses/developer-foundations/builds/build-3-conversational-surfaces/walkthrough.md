# Build 3 — Walkthrough: Conversational Surfaces

> Estimated time: 3–4 hours focused. Read the [lesson](lesson.md) first.
>
> **First time using React?** That's fine. You're not writing the React — the AI is. Your job is to scaffold the project, paste a brief, read the output, and run it. We explain every step.

## What you'll build

A working **React app** with a custom chat component that:

- Streams answers token-by-token (no widget abstraction this time — you're in control of rendering).
- Toggles between **two prompt voices**: "Prospect" (3-sentence + CTA) and "Member" (detailed + citations).
- Post-processes the answer to turn the first markdown link into a **pill-style call-to-action button**.

This is the Build where the widget abstraction goes away. You go from *"paste a snippet"* (Build 2) to *"render every pixel yourself."* You'll feel the difference — and so will customers when you demo.

## What you'll need open

- **Your `.env` from Build 0** (same three credentials).
- **Your Nuclia dashboard** (KB still ingested).
- **Your terminal**.
- **Your editor** (VS Code).
- **Your AI assistant**.
- **A modern browser**.

You also need **Node.js 18 or later** (you installed this in Build 0). Verify:

```bash
node --version
```

**Expected output:** `v18.x.x` or higher. If it's older, reinstall from [nodejs.org](https://nodejs.org/) (LTS version).

---

## Step 1 — Scaffold a Vite + React project (10 min)

[Vite](https://vitejs.dev/) is a fast modern build tool that gives you a working React project in one command. You don't need to know what Vite does under the hood — you just type the command.

### 1a. Create the project

Open your terminal:

```bash
cd ~/Desktop
npm create vite@latest foundations-build-3 -- --template react-ts
```

**What that did:**
- `npm create vite@latest` runs Vite's setup wizard.
- `foundations-build-3` is the folder name it'll create.
- `--template react-ts` says "use the React + TypeScript template" (TypeScript = JavaScript with type hints; the AI handles all the types).

The setup runs ~10 seconds. **You should see:** a new folder `foundations-build-3` containing `src/`, `index.html`, `package.json`, etc.

### 1b. Move into the folder and install dependencies

```bash
cd foundations-build-3
npm install
```

**What that did:**
- `cd` moves you into the new project folder.
- `npm install` downloads all the libraries the project depends on (React, Vite, TypeScript). Look at the progress bar.

This takes 30–60 seconds. **You should see:** a new `node_modules/` folder and a `package-lock.json` file appear. Ignore both — npm manages them.

### 1c. Test the scaffold

Run the dev server:

```bash
npm run dev
```

**You should see:** terminal prints something like `Local: http://localhost:5173/`. Open that URL in your browser.

**Expected page:** the default Vite + React starter page with the Vite and React logos, a counter button, and "Edit src/App.tsx and save to test HMR."

If you see this, **scaffold works**. Press `Ctrl+C` in the terminal to stop the dev server for now.

If you don't see this — copy the terminal error into your AI: *"npm run dev failed with this error: [paste]. Fix."*

---

## Step 2 — Set up environment variables (5 min)

Create a `.env` file in the project root (same level as `package.json`):

```bash
touch .env
code .env
```

Paste the following, **replacing the placeholders with your Build 0 credentials**:

```bash
VITE_NUCLIA_API_URL=https://aws-eu-1.rag.progress.cloud/api/v1
VITE_NUCLIA_KB_ID=paste-your-kb-uuid-here
VITE_NUCLIA_API_KEY=paste-your-jwt-here
```

**Why the `VITE_` prefix?** Vite only exposes environment variables that start with `VITE_` to your client-side code. It's a safety feature so server-only secrets don't leak.

> **Important:** for Build 3 we put the JWT in the client. **This is fine for demo.** In production you'd proxy through your partner backend so the JWT never leaves your servers — Build 11 covers that pattern.

Save the file.

---

## Step 3 — Install Tailwind CSS (10 min)

Tailwind is a styling system that lets you write CSS using short class names directly in your markup. The AI will produce Tailwind-styled components — you just need to install it.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**What that did:**
- Installed Tailwind and two helper packages.
- `npx tailwindcss init -p` created two config files (`tailwind.config.js` and `postcss.config.js`).

Now tell Tailwind which files to scan. Open `tailwind.config.js` in your editor. Replace the `content` line:

```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

Open `src/index.css`. Replace its entire contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Save both files.

**Verify Tailwind works:** run `npm run dev` again. Reload the browser. The default Vite page should still load (it'll look a bit different because Tailwind reset some styles). If you see an error, paste it into your AI: *"I configured Tailwind for Vite and now get this error. Fix."*

Stop the dev server (`Ctrl+C`) before the next step.

---

## Step 4 — Vibe-code the ARAG client (20 min)

This is the file that talks to ARAG. The AI does the work.

### 4a. Brief your AI

Open your AI assistant. Paste **exactly**:

```
In my Vite + React + TypeScript project, create src/lib/ragClient.ts.

Export an async generator function streamAsk(query, promptConfig) that:

1. POSTs to ${import.meta.env.VITE_NUCLIA_API_URL}/kb/${import.meta.env.VITE_NUCLIA_KB_ID}/ask
2. Sets header X-NUCLIA-SERVICEACCOUNT: Bearer ${import.meta.env.VITE_NUCLIA_API_KEY}
3. Sets header Content-Type: application/json
4. Sends body { query, prefer_markdown: true, rephrase: true, max_tokens: 500, prompt: promptConfig }
5. Reads the streaming NDJSON response.
6. Yields objects of these shapes:
   - { type: 'answer-chunk', text: string }
   - { type: 'citations', citations: Array<{ id: string; title: string }> }
   - { type: 'done' }
7. Parses NDJSON by tracking balanced JSON object boundaries
   (handle the case where one JSON object straddles two stream chunks —
   accumulate the buffer until you find a complete object, then yield it).
8. Yields 'citations' when it sees { item: { type: 'retrieval', results: ... } }
   — extract resources[id].title for the citations array.
9. Yields 'done' when it sees { item: { type: 'status', code: '0' } }.

Use native fetch and ReadableStream. No SDK. Full TypeScript types.
```

Send.

### 4b. Save the AI's output

- **Claude Code / Cursor:** *"Save this as src/lib/ragClient.ts. Create the lib folder if it doesn't exist."*
- **Web chat:** in VS Code, create `src/lib/ragClient.ts` (you'll need to create the `lib` folder first — right-click on `src/`, "New Folder", name it `lib`, then "New File" inside it).

### 4c. Read the code

Open `src/lib/ragClient.ts`. Three checks:

1. Uses `fetch(...)`, not some SDK like `import { Nuclia } from 'nuclia'`.
2. Auth header is `X-NUCLIA-SERVICEACCOUNT: Bearer ...`, not `Authorization`.
3. The NDJSON parser handles cross-chunk boundaries (look for a `buffer` variable that accumulates partial chunks, and balanced-brace counting or a JSON.parse-in-try-catch loop).

If anything's off, tell the AI: *"This uses [wrong thing] — it should use [right thing]. Rewrite."*

### 4d. Save your prompt

Create `prompt-log.md` in the project root. Paste the brief above. We'll keep adding to this file as the Build progresses.

---

## Step 5 — Vibe-code the chat component (45 min)

This is the meaty step. The AI builds the React component that uses your `ragClient`.

### 5a. Brief your AI

Paste **exactly**, same chat session:

```
Now create src/components/MultiSurfaceChat.tsx. It's a React component that:

1. Has a persona toggle at the top: two radio buttons,
   "Prospect" and "Member". Default to "Prospect".
2. Maintains chat history in component state — an array of
   { role: 'user' | 'assistant'; text: string; citations?: Array<{id: string; title: string}> }.
3. Has a text input + submit button below the history.
4. On submit:
   - Append a user message to history.
   - Append an empty assistant message.
   - Pick the prompt config based on the active persona
     (PROMPTS.prospect or PROMPTS.member — define these as constants
     at the top of the file).
   - Call streamAsk(userMessage, promptConfig).
   - For each 'answer-chunk', append text to the latest assistant message.
   - For 'citations', set citations on the latest assistant message.
   - For 'done', stop.
5. Display each message in a chat-bubble style. User messages on the right;
   assistant messages on the left.
6. For assistant messages, run text through a formatAssistantHtml() helper
   (defined below) and render with dangerouslySetInnerHTML.
7. Render citations under each assistant message as small links
   ("Source: [title]").

Constants:

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

formatAssistantHtml(markdown):
  - Find the first markdown link [label](url).
  - Replace it with an HTML <a> styled as a pill button using Tailwind classes
    (inline-block, rounded-full, px-4, py-1, bg-blue-600, text-white, no-underline).
  - Truncate everything AFTER the first link
    (the model often keeps talking past the CTA — we cut that off).
  - Convert any **bold** markers to <strong>.
  - Return the resulting HTML string.

Use TypeScript. Tailwind classes for styling. Disable the submit button
while a response is streaming. Auto-scroll to the bottom on new messages.
```

Send.

### 5b. Save the AI's output

- **Claude Code / Cursor:** *"Save this as src/components/MultiSurfaceChat.tsx. Create the components folder if it doesn't exist."*
- **Web chat:** create `src/components/MultiSurfaceChat.tsx` in VS Code.

### 5c. Read the code

Three checks:

1. The persona toggle switches the `PROMPTS` config that gets passed to `streamAsk`.
2. Streaming chunks append directly to the latest assistant message (not buffered).
3. `formatAssistantHtml` truncates the text after the first markdown link.

If anything's off, fix via AI conversation.

### 5d. Update prompt-log.md

Append this Step 5 brief to your `prompt-log.md`.

---

## Step 6 — Wire it into App.tsx (10 min)

The AI's component needs to be rendered by the app. Paste this brief:

```
Update src/App.tsx to:

1. Import MultiSurfaceChat from ./components/MultiSurfaceChat.
2. Render a simple layout:
   - A hero header (h1) "Multi-Surface Chat Demo"
   - A subtitle (p) "Same KB. Different prompts. Different audiences."
   - The <MultiSurfaceChat /> component centered below.
3. Center the layout with a max-width 800px container.
4. Use Tailwind classes for layout. No other dependencies.
5. Remove all the default Vite starter content.
```

Save the result as `src/App.tsx` (overwriting the existing one).

### Run the dev server

```bash
npm run dev
```

**You should see:** the terminal prints `Local: http://localhost:5173/`. Open it.

**Expected page:**
- A heading "Multi-Surface Chat Demo".
- A subtitle.
- A persona toggle (Prospect / Member).
- An empty chat area.
- A text input and submit button at the bottom.

If you see this, **the wiring works**.

If you see errors in the browser or in the terminal, copy them into your AI: *"npm run dev shows this error: [paste]. Fix it."*

---

## Step 7 — Test both voices (20 min)

The whole point of this Build is **same KB, two voices, two audiences**.

### 7a. Test Prospect mode

With "Prospect" selected, type:

> *"What's a good place to start?"*

(or any question your corpus can answer)

Hit submit. **You should see:**

- The assistant message streams in **3 sentences max**.
- It ends with a **pill-shaped button** (rounded, coloured) that links to one of the documents.
- **Nothing comes after the button** — the post-processor truncates.

### 7b. Test Member mode

Switch the toggle to "Member". Ask **the same question**.

**You should see:**

- A **longer, more detailed answer** — multiple sentences, more depth.
- **Citations** listed underneath ("Source: ...").
- **No pill button** (Member mode doesn't push CTAs).

### 7c. The punchline

You just demoed two completely different chat experiences against **the same KB, with the same model, using the same code**. The only thing that changed was the system prompt.

**This is Tier 2 work.** Customers pay materially more for "we have two audiences and we want them to feel different" — and you've proven it can be a 5-line prompt swap, not a separate platform.

### Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| Member mode produces a 3-sentence answer with a CTA | Persona toggle isn't passing the right prompt config | Tell AI: *"Member mode is producing prospect-style answers. The PROMPTS.member config isn't being used. Fix the persona-to-prompt mapping."* |
| The CTA renders as a plain `[text](url)` markdown link instead of a pill button | `formatAssistantHtml` isn't being applied | Tell AI: *"The CTA renders as raw markdown. The formatAssistantHtml helper isn't running. Check it's called and the HTML is set via dangerouslySetInnerHTML."* |
| The streaming arrives all at once at the end | The NDJSON parser is buffering | Tell AI: *"Answers arrive all-at-once, not streaming. The NDJSON parser is over-buffering. Each {item: {type: 'answer'}} should yield as soon as it parses."* |
| 401/403 in the browser's DevTools Network tab | Wrong JWT | Re-paste from dashboard into `.env`. Restart `npm run dev` (it doesn't always pick up `.env` changes automatically). |
| 0 citations in Member mode | The model didn't ground in enough sources, or the retrieval extraction is wrong | Ask a more specific question. If still 0, tell AI: *"Citations aren't appearing in Member mode. The 'retrieval' NDJSON item isn't being parsed. Fix."* |

---

## Step 8 — Handle the streaming citations event (15 min)

Your `streamAsk` already yields `{ type: 'citations', citations: [...] }` once per turn — but `MultiSurfaceChat` consumes the stream with a `switch` inside a `for await`, which can drift when a partner copies the pattern without thinking. This step locks in the **explicit** for-await pattern so the streaming-vs-sync citation envelope difference (covered in the lesson) is muscle memory.

### 8a. Open the consumer

Open `src/components/MultiSurfaceChat.tsx`. Find the loop that consumes `streamAsk`. It should look something like:

```tsx
for await (const evt of streamAsk(userMessage, promptConfig)) {
  if (evt.type === 'answer-chunk') {
    // append evt.text to the latest assistant message
  } else if (evt.type === 'citations') {
    // set citations on the latest assistant message
  }
}
```

If the AI wrote it with a `switch` on `evt.type`, that's fine — same shape. The point is: **two distinct branches**, and the `citations` branch runs **once** per turn.

### 8b. Add a one-time-assignment guard

Just before the citations assignment, log an explicit marker:

```tsx
else if (evt.type === 'citations') {
  console.log('[citations] arrived', evt.citations.length, 'sources');
  // existing assignment
}
```

### 8c. Verify the event fires exactly once

`npm run dev`. Open DevTools Console. Submit any question that returns sources (Member mode is easiest — it always cites).

**You should see:** the answer streams in token-by-token, then **exactly one** `[citations] arrived N sources` log line appears after the answer finishes, then the citations list renders under the assistant bubble. If you see the log line fire multiple times, your parser is yielding partial citation events — re-read the lesson's "Common failure mode" callout and fix in `src/lib/ragClient.ts`: only yield `{ type: 'citations' }` when you see a complete `{ item: { type: 'retrieval', results: ... } }` object.

Remove the `console.log` once verified.

---

## Step 9 — Build a minimal hand-rolled FloatingChat (45 min)

`MultiSurfaceChat` is a panel that lives on one page. The graduation pattern from the lesson is a **floating** chat: a FAB in the corner, a slide-out panel, and a `CustomEvent` bus so any route in the app can deep-link a question into it. This step builds that.

### 9a. Brief your AI

Same chat session:

```
Create src/components/FloatingChat.tsx. It's a React component that:

1. Renders a fixed-position FAB (floating action button) in the
   bottom-right corner. Tailwind: fixed bottom-6 right-6, rounded-full,
   bg-blue-600, text-white, p-4, shadow-lg, z-50.
2. Clicking the FAB toggles an open/closed state. When open, render a
   panel above the FAB (fixed bottom-24 right-6, w-96, h-[32rem],
   bg-white, shadow-xl, rounded-lg, flex flex-col, z-50).
3. The panel contains: header with "Concierge" + close button;
   scrollable history of turns; text input + submit at the bottom.
4. State: open (boolean), turns (array of
   { question: string; answer: string; citations: Array<{id, title}> }).
5. A useRef<boolean> 'streaming' guard prevents re-entering runQuery
   while a previous stream is in-flight.
6. async runQuery(q): push a new turn with empty answer/citations;
   for await on streamAsk(q, PROMPTS.member); on 'answer-chunk' append
   to turn.answer; on 'citations' replace turn.citations; setTurns after
   each event so the UI re-renders.
7. useEffect: addEventListener on window for a custom event named
   'aurora.concierge.prefill'. On fire, read e.detail.question, set
   open=true, call runQuery(question). Remove listener on unmount.
8. Reuse the PROMPTS constant and streamAsk import from the existing
   MultiSurfaceChat / ragClient code.

Use TypeScript, Tailwind, native fetch. No new dependencies.
```

Save as `src/components/FloatingChat.tsx`.

### 9b. Mount it globally

Open `src/App.tsx`. Import `FloatingChat` and render it once at the bottom of the layout, **outside** the centered container so it floats over everything:

```tsx
import { FloatingChat } from './components/FloatingChat';
// ... existing layout ...
<FloatingChat />
```

### 9c. Verify with a console dispatch

`npm run dev`. Open the app. You should see the FAB in the bottom-right corner. Open DevTools Console and paste:

```js
window.dispatchEvent(new CustomEvent('aurora.concierge.prefill', { detail: { question: 'What do you have for beginners?' } }));
```

**You should see the chat panel open and the answer stream in within ~1 second of dispatching the event.** Citations should appear under the answer once the stream completes. If the panel opens but no stream starts, the listener fired but `runQuery` didn't — check the `streaming` ref isn't stuck on `true` from a prior run.

### 9d. Update prompt-log.md

Append the Step 9 brief to your `prompt-log.md`.

---

## Step 10 — Test edge cases (15 min)

Push the chat to find bugs:

- **Ask the same question 3 times in each mode.** Each response should be fresh — no stale cached text appearing.
- **Switch persona mid-conversation.** Ask a question in Prospect; toggle to Member; ask the same question. The Member answer should be detailed.
- **Ask a vague question** ("tell me everything"). Both modes should still respect their length constraints.
- **Try asking something not in the corpus.** ("What's the weather today?") The model should say *"I don't have information about that"* — that's grounded refusal working correctly.

Fix any bug you find by talking to the AI.

---

## Step 11 — Write a 3-minute demo script (15 min)

In your project folder, create `demo-script.md`. Open your AI:

```
Write me a 3-minute demo script for a sales rep showing a customer
the "Multi-Surface Chat Demo" page. The story arc:

0:00–0:30 — Setup the problem:
  "Most AI vendors sell you one chatbot per audience. Marketing has to
   buy three. Watch what happens when you change just the prompt."

0:30–1:30 — Prospect mode:
  Toggle to Prospect. Type a real customer question. Show the 3-sentence
  answer ending in the pill CTA. Narrate: "Three sentences. One CTA.
  Nothing else. This is the public-facing voice."

1:30–2:30 — Member mode:
  Toggle to Member. Ask the same question. Show the longer, cited answer.
  Narrate: "Same KB. Same model. Same code. Three lines of prompt different.
  Now I have a research assistant for paid members."

2:30–3:00 — Close:
  "One KB. Two products. The customer just unlocked Tier 2 revenue —
   twice the deal size, same engineering effort."

Format: plain markdown with the timings as headings. Include
specific things to say at each beat — not just "demo the feature."
```

Save the result as `demo-script.md`.

---

## Step 12 — Save your prompts (5 min)

Make sure `prompt-log.md` has all five briefs:

1. The `ragClient.ts` brief (Step 4).
2. The `MultiSurfaceChat.tsx` brief (Step 5).
3. The `App.tsx` brief (Step 6).
4. The `FloatingChat.tsx` brief (Step 9).
5. The demo script brief (Step 11).
6. Any debugging prompts you used.

---

## Verification checklist

- [ ] Vite + React + TypeScript project running on `localhost:5173`.
- [ ] `src/lib/ragClient.ts` — uses fetch, X-NUCLIA-SERVICEACCOUNT header, parses NDJSON correctly.
- [ ] `src/components/MultiSurfaceChat.tsx` with persona toggle.
- [ ] **Prospect mode** produces 3-sentence + pill CTA (visually rounded button).
- [ ] **Member mode** produces longer answer with citations listed underneath.
- [ ] `formatAssistantHtml` truncates Prospect-mode text after the first CTA link.
- [ ] Streaming is token-by-token, not all-at-once.
- [ ] The `citations` event fires **exactly once** per turn (verified via Console log).
- [ ] `src/components/FloatingChat.tsx` — FAB + slide-out panel + `streamAsk` loop + `aurora.concierge.prefill` `CustomEvent` listener.
- [ ] Dispatching `aurora.concierge.prefill` from the browser console opens the chat and streams the answer within ~1 second.
- [ ] `demo-script.md` saved.
- [ ] `prompt-log.md` saved with all briefs.

Then take the [Build 3 quiz](quiz.md). Pass → start [Build 4](../build-4-multilingual-and-voice/).

---

## Getting unstuck

**`npm run dev` fails with "command not found".**
- You're not in the project folder. Run `pwd` — should end in `foundations-build-3`. If not, `cd` into it.

**`npm install` fails.**
- Older Node.js version. Run `node --version`. If less than 18, install LTS from [nodejs.org](https://nodejs.org/).

**Page is blank.**
- Browser DevTools → Console. Red errors usually identify which file/import broke. Paste into AI.

**`import.meta.env.VITE_*` is undefined.**
- The `.env` file isn't in the right place (must be in project root, same level as `package.json`), or you didn't restart `npm run dev` after creating it. Stop with `Ctrl+C`, restart.

**Tailwind classes do nothing.**
- The `tailwind.config.js` `content` array doesn't include your component path. Confirm it lists `./src/**/*.{js,ts,jsx,tsx}`.

**Anything else.**
- Copy the error + the command/code that triggered it.
- Paste both into your AI: *"I'm trying to [goal]. I ran [X] and got [Y]. Fix."*
- Re-test.

---

## Next

[Build 4 — Multilingual & Voice Switching](../build-4-multilingual-and-voice/) — extend today's chat with three query-prefix levers: **language switching**, **persona scoping**, **resource scoping**. Each is 5–10 lines of code. The customer signal is *"can this also work in Spanish? And for our internal team? And only on the policy docs?"* — Build 4 says yes to all three in one afternoon.
