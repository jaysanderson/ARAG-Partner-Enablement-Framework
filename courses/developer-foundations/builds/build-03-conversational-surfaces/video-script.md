# Video Script — Build 3: Conversational Surfaces

> **Duration target:** 12 minutes
> **Format:** Screen recording with AI assistant on screen. Live vibe-coding session start to finish.
> **Tools on screen:** Claude Code (or Cursor), terminal, browser, code editor.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 3 · Conversational Surfaces"*.

**VOICEOVER:**
> Twelve minutes. By the end I'll have a React app with a custom chat — two prompt voices, persona toggle, streaming, citations, CTA pill buttons. I won't write a single line of JavaScript. Claude Code will. This is what "vibe coding" looks like at Tier 2.

## Section 1: Why we leave the widgets (0:30 – 1:30)

**ON SCREEN:** Quick diagram — left side: Build 2 widget (one chat); right side: Build 3 (two prompt voices over one KB). Annotations: "Same KB, different prompts, different audiences."

**VOICEOVER:**
> Build 2 ships a chatbot. That's Tier 1. The customers worth $250K-plus have prospects and members, shoppers and pros, employees and execs. Same content, different voice, different next-action. The widgets can't toggle voices on the fly. A custom UI can — and we're going to vibe-code it now.
>
> One KB. Two prompts. One UI with a persona toggle. That's the architecture. Three minutes from now I'll be talking to my AI assistant; nine minutes from now we'll have a working demo.

## Section 2: Scaffold (1:30 – 2:30)

**ON SCREEN:** Terminal. `npm create vite@latest build-3-chat -- --template react-ts && cd build-3-chat && npm install`. Open `.env` in editor; paste the three env vars from Build 0.

**VOICEOVER:**
> Vite, React, TypeScript. Install. Drop my KB credentials into a `.env`. Standard. Sixty seconds.

## Section 3: Brief the AI for the ARAG client (2:30 – 4:30)

**ON SCREEN:** Open Claude Code. Paste the brief from the walkthrough (the `streamAsk` brief) verbatim. The AI reads it, asks no clarifying questions (or asks one — depending on the day), and generates `src/lib/ragClient.ts`. Cut to fast-forward during the generation.

**VOICEOVER:**
> Open Claude Code. First brief — the ARAG client. I tell it: POST to `/ask`, this auth header, this body shape, the streaming response is NDJSON shaped like so, expose it as an async iterable that yields answer-chunks then citations then done.
>
> Notice what I'm doing. I'm not saying "write me an ARAG client." That's how you get hallucinated SDKs. I'm specifying — the endpoint, the auth, the body, the response shape, the iterable contract. Direct and specific.

**ON SCREEN:** AI finishes. Open the generated `ragClient.ts`. Scroll through it. Highlight three lines with red circles: (1) the `fetch` call (not an SDK), (2) the `X-NUCLIA-SERVICEACCOUNT` header, (3) the balanced-brace NDJSON parser.

**VOICEOVER:**
> Three things to check on every AI-generated file. One — does it use `fetch` and not some made-up SDK? Yes. Two — is the auth header right? Yes. Three — does it parse the NDJSON cross-chunk-boundary-correctly? Yes — it counts braces. Move on.

## Section 4: Brief the AI for the chat component (4:30 – 7:00)

**ON SCREEN:** Claude Code. Paste the second brief from the walkthrough — `MultiSurfaceChat.tsx` with the persona toggle, the PROMPTS constants, the formatAssistantHtml helper. AI generates the component (~150 lines).

**VOICEOVER:**
> Second brief — the chat component. Persona toggle at the top. Chat history in state. PROMPTS object with `prospect` and `member` configs — and crucially I give it the *exact* system prompts I want. Watch.
>
> Prospect system prompt: "STRICT RULES: maximum three sentences. End with ONE call-to-action link. STOP." Member system prompt: "Detailed expert answer, multi-source citations, three to four sentences max." Two distinct voices.
>
> The `formatAssistantHtml` helper does two things: first `[label](url)` becomes a Tailwind-styled pill button; everything after the first link is truncated. The prompt asks the model to stop. The post-processor guarantees it.

**ON SCREEN:** AI finishes. Scroll through the component. Briefly review the toggle rendering, the submit handler, the streaming loop, the formatAssistantHtml implementation. Cut to fast-forward.

## Section 5: Wire and run (7:00 – 8:30)

**ON SCREEN:** Update `App.tsx` to render the component. Terminal: `npm run dev`. Open the browser at `http://localhost:5173`. Page loads.

**VOICEOVER:**
> Wire the component into App. Start the dev server. Page loads.

## Section 6: Demo Prospect mode (8:30 – 9:30)

**ON SCREEN:** Browser. Persona toggle showing "Prospect" selected. Type: "what should I try first?". Press Enter. The answer streams in word-by-word. Three sentences. A pill button at the end says "Get Started →".

**VOICEOVER:**
> Prospect mode. "What should I try first?" Watch the answer stream — three sentences, then a pill button at the end. The pill is the model's CTA. The text after the link, if it tried to write any, got truncated. That's the post-processor doing its job.

## Section 7: Demo Member mode (9:30 – 10:30)

**ON SCREEN:** Click the persona toggle to "Member". Type the same question. Press Enter. The answer streams — this time five paragraphs with inline citation chips, no pill button, multi-source.

**VOICEOVER:**
> Switch to Member. Same question. Same KB. Same model. Different prompt. Different answer — five paragraphs, multi-source citations, the detail level you'd give a paying member.
>
> This is the Tier 2 moment. The customer's CMO watches this and immediately understands they bought a feature, not a platform, from their last AI vendor. Twice the deal size opens here.

## Section 8: One iteration to show vibe-coding mid-loop (10:30 – 11:30)

**ON SCREEN:** Notice the citations in Member mode are rendering as plain text bullets, not chips. Type into Claude Code: *"In Member mode the citations should render as small pill chips with the resource title, not bullet points. Fix the rendering."* AI updates. Reload. Citations now render as chips.

**VOICEOVER:**
> One more thing. The citations in Member mode are rendering as bullet points; I want chips. Tell Claude. *Citations should render as small pill chips, not bullets, with the resource title.* Apply. Reload.
>
> Chips. Done. That's the loop — direct, generate, verify, iterate. Five seconds of typing, fifteen seconds of generation, two seconds of verification.

## Wrap (11:30 – 12:00)

**ON SCREEN:** End card. *"Build 4 — Multilingual & Voice Switching. Next."*

**VOICEOVER:**
> Build 4 takes this further — language switching, persona scoping, resource scoping. All implemented as query-prefix one-liners. The cheapest, highest-leverage extensions to a Tier 2 chat. Eight minutes. See you there.

---

## Production notes

- **Live AI runs:** generation will take 30–90 seconds. Fast-forward (×4) during generation; never bore the viewer with a cursor.
- **Cuts:** Section 3 and Section 4 both have AI runs — cut between them cleanly so the video doesn't drag.
- **Subtitles:** the AI's output scrolls fast. Don't pause; partners can pause the recording. But put the *brief* on screen as a stable text overlay so they can read it later.
- **The CTA pill moment in Section 6** is the single most important visual in this video. Make sure it lands clearly — pause for one full second after the pill renders before continuing.
- **End card:** include the Build 4 URL or QR code.
