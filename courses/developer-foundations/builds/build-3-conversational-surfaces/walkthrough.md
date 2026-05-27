# Build 3 — Walkthrough: Conversational Surfaces

> Estimated time: 3 hours focused. Read the [lesson](lesson.md) first.

## Goal

A working React app with a custom chat component that streams answers, toggles between two prompt voices (prospect / member), and post-processes CTAs as pill buttons. Vibe-coded; you direct, the AI generates, you verify.

## 1. Scaffold a Vite + React app (10 min)

```bash
npm create vite@latest build-3-chat -- --template react-ts
cd build-3-chat
npm install
```

Add a `.env` in the project root:

```bash
VITE_NUCLIA_API_URL=https://aws-eu-1.rag.progress.cloud/api/v1
VITE_NUCLIA_KB_ID=<your-kb-id>
VITE_NUCLIA_API_KEY=<your-service-account-jwt>
```

(For Build 3 demo purposes we expose the JWT to the client. Production routes through the partner backend — Build 10.)

## 2. Vibe-code the ARAG client (15 min)

Open your AI assistant. Brief:

```
In my Vite + React + TypeScript project, create src/lib/ragClient.ts.

Export a function streamAsk(query, promptConfig) that:

1. POSTs to ${import.meta.env.VITE_NUCLIA_API_URL}/kb/${import.meta.env.VITE_NUCLIA_KB_ID}/ask
2. Sets X-NUCLIA-SERVICEACCOUNT: Bearer ${import.meta.env.VITE_NUCLIA_API_KEY}
3. Sends body { query, prefer_markdown: true, rephrase: true, max_tokens: 500, prompt: promptConfig }
4. Returns an async iterable that yields objects of shape:
   - { type: 'answer-chunk', text: string }
   - { type: 'citations', citations: Array<{id, title}> }
   - { type: 'done' }
5. Parses the NDJSON stream by tracking balanced JSON object boundaries
   (handle the case where one JSON object straddles two chunk boundaries).

Use the native fetch and ReadableStream. No SDK.
```

Read what the AI produces. Verify:

- Uses `fetch`, not an SDK.
- Auth header is `X-NUCLIA-SERVICEACCOUNT`.
- The NDJSON parser handles cross-chunk boundaries (counts braces or accumulates until valid).
- The async iterable yields objects of the documented shape.

Save the prompt as `prompt-log-1.md`.

## 3. Vibe-code the chat component (45 min)

Same AI session:

```
Now create src/components/MultiSurfaceChat.tsx. It's a React component that:

1. Has a persona toggle at the top: "Prospect" / "Member" (radio buttons).
2. Maintains chat history in component state — array of { role: 'user' | 'assistant', text: string, citations?: Array<{id,title}> }.
3. Has a text input + submit button.
4. On submit:
   - Append a user message.
   - Append an empty assistant message.
   - Pick the prompt config based on the active persona (PROMPTS.prospect or PROMPTS.member — define these as constants at the top of the file).
   - Call streamAsk(userMessage, promptConfig).
   - For each 'answer-chunk', append text to the latest assistant message.
   - For 'citations', set citations on the latest assistant message.
5. Display each message. For assistant messages, render markdown and pass through a formatAssistantHtml helper.

The PROMPTS constants:

PROMPTS.prospect = {
  system: "You are a knowledgeable assistant. STRICT RULES: (1) Maximum 3 sentences. (2) End with ONE call-to-action link from the context, in markdown link format. (3) STOP after the link.",
  user: "Context (includes CallToAction fields): {context}\n\nQuestion: {question}"
}

PROMPTS.member = {
  system: "You are an expert research assistant with full corpus access. Provide a detailed, well-cited answer. Reference specific resources. 3-4 sentences max.",
  user: "Based on: {context}\n\nAnswer: {question}"
}

formatAssistantHtml(markdown): returns HTML where the first [label](url) link
becomes a pill-style button (Tailwind classes are fine) and everything after
the first link is truncated.

Use TypeScript. Tailwind is installed.
```

The AI will produce the component. Read before running. Verify:

- The persona toggle switches the PROMPTS config used.
- Streaming chunks append correctly (not buffered).
- The post-processor `formatAssistantHtml` truncates after the first link.
- Citations render under the assistant message.

Save the prompt as `prompt-log-2.md`.

## 4. Wire it into App.tsx (10 min)

```
Update src/App.tsx to render the MultiSurfaceChat component inside a simple
layout: a hero header with the title "Multi-Surface Chat Demo", and the chat
component below.

Install Tailwind if not already installed; configure for Vite.
```

Run `npm run dev`. Open the URL. Confirm the page loads.

## 5. Test both voices (15 min)

In Prospect mode, ask: "What's a good first product to try?"
- Expected: 3 sentences, ending with a pill-style CTA button.

In Member mode, ask the same: "What's a good first product to try?"
- Expected: 5 paragraphs, multi-source citations, no pill CTA.

If the persona toggle doesn't work, the prompt config isn't being passed correctly. Brief the AI: *"The Member mode is producing prospect-style short answers. Verify the prompt config is being passed to streamAsk."*

If the CTA isn't rendering as a pill, the post-processor isn't running. Brief the AI: *"The CTA is rendering as a plain markdown link, not a pill button. The formatAssistantHtml helper isn't being applied. Fix it."*

## 6. Test edge cases (15 min)

Ask the same query 3 times in each mode. Confirm:

- Each response is fresh (no stale cached output).
- Streaming works in both modes.
- Citations land in both modes.
- The model doesn't keep talking past the CTA in Prospect mode (post-processor truncates if it tries).
- Switching persona mid-conversation works — the next message uses the new prompt config.

## 7. Write a "Three voices, one KB" demo script (15 min)

Open `demo-script.md` in this Build folder. Draft a 3-minute talk track:

- (0:00–0:30) "Most AI vendors give you one chatbot per audience. Watch what happens with one KB and two prompts."
- (0:30–1:30) Demo Prospect mode. Show the 3-sentence + CTA answer.
- (1:30–2:30) Toggle to Member. Same query. Show the 5-paragraph detailed answer with multi-source citations.
- (2:30–3:00) Close: "Same KB. Same model. Same code. Different prompt. Different audience. The customer just unlocked Tier 2 — twice the deal size."

## 8. Record (15 min)

Record yourself demoing the talk track. Upload to `#build-clinic-submissions`.

## Verification checklist

- [ ] `ragClient.ts` working — streams answers, parses NDJSON correctly.
- [ ] `MultiSurfaceChat.tsx` component with persona toggle.
- [ ] Prospect mode produces concise + CTA answers; pill button renders.
- [ ] Member mode produces detailed answers with citations.
- [ ] `formatAssistantHtml` truncates after first CTA in Prospect mode.
- [ ] `demo-script.md` written.
- [ ] `prompt-log-1.md` + `prompt-log-2.md` saved.
- [ ] 3-minute recording submitted.

## Next

[Build 4 — Multilingual & Voice Switching](../build-4-multilingual-and-voice/) — extend today's chat with three query-prefix levers: language switching, persona scoping, resource scoping. Each is 5–10 lines of code.
