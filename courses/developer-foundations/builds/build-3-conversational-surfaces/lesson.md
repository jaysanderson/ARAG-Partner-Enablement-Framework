# Build 3 — Lesson: Conversational Surfaces

> Read time: 12 minutes. Companion to the 12-minute [video](video-script.md).

## Why this is in the course

Build 2 ships a chatbot. Build 3 ships **multiple conversational experiences over one KB**. The customers worth $250K+ don't have one audience — they have prospects and members, shoppers and pros, employees and execs. Same content, different voice, different next-action. The widgets can't do this. A custom UI can — and you'll vibe-code it in 90 minutes.

## The architecture in one sentence

**One KB. Two prompt configurations. One UI with a persona toggle.**

That's it. The thing partners over-engineer is the wrong thing — they reach for two KBs, two service accounts, a routing layer. Don't. The two voices are a **prompt** decision, not an infrastructure decision.

## Prompt anatomy on `/ask`

```json
{
  "query": "what should I buy?",
  "prefer_markdown": true,
  "rephrase": true,
  "max_tokens": 500,
  "prompt": {
    "system": "<persona, voice, length, format rules>",
    "user": "<template with {context} and {question} placeholders>"
  }
}
```

Two fields: `system` and `user`.

### `system` — persona + format rules

This is the LLM's character and constraints. It's where you tell the model:

- *Who* it is ("You are a knowledgeable concierge for an outdoor retailer").
- *How long* its answers should be ("Maximum 3 sentences").
- *What format* ("End with one call-to-action link in markdown").
- *What never to do* ("Do not continue writing after the link").

The model is bad at following soft hints. Use **STRICT RULES**. List them. Repeat.

### `user` — context-injection template

ARAG substitutes two placeholders at request time:

- `{context}` — replaced by the retrieved paragraphs.
- `{question}` — replaced by the user's query (rephrased if `rephrase: true`).

A minimal user template:

```
Context: {context}

Question: {question}
```

That's enough for most cases. Add per-call instructions when needed: *"Answer based ONLY on this context, never your training data:"*.

## The two-voice pattern

| | Prospect (unauthenticated) | Member (authenticated) |
|---|---|---|
| **System prompt** | Max 3 sentences. End with ONE CTA link from context. STOP. | Detailed expert answer. Multi-source citations. 3–4 sentences max. |
| **Goal** | Conversion — get them to click. | Retention — make them feel served. |
| **KB** | Same | Same |
| **Model** | Same | Same |

Two prompt configurations. Same KB. Same endpoint. One UI component with a `mode` toggle.

The commercial moment: customers see this demo and **immediately** understand they've been sold a feature, not a platform, by their previous AI vendor. That's the Tier 2 unlock.

## Query prefixing — the cheapest extra lever

Sometimes you don't need a different prompt — just a prefix on the user's query. Three live examples you'll wire today or in the next Build:

- **Verbosity:** `"Provide a comprehensive, multi-source analysis: <user query>"`
- **Language:** `"Respond in {language}: <user query>"`
- **Resource scope:** `"Regarding the resource titled '<title>': <user query>"`

Same endpoint. Same prompt config. Just a different prefix on the query string. Free.

## CTA post-processing

The prospect-mode system prompt ends with "end with ONE call-to-action link." The model obeys *most* of the time. The trick is the **post-processing layer** on the front-end:

1. Stream the assistant's response into a markdown buffer.
2. Find the first `[label](url)` in the buffer.
3. Render everything before the link as normal markdown.
4. Render the link as a **pill-style button** (branded, colour-of-day).
5. **Truncate everything written after the link** — the model occasionally keeps talking past "STOP". You don't.

Two layers — prompt enforces it; code guarantees it. Always both.

## Field-engineered CTAs (preview)

The CTAs the model picks aren't conjured from thin air. They come from a custom field — typically called `callToAction` — that the customer's content team adds to each resource. The retriever pulls that field into `{context}`, the model picks the most relevant one, and your CTA renderer turns the `[label](url)` into a branded pill.

This is the highest-leverage recurring-revenue lever in the entire framework — content engineering as a service. Build 8 goes deep on it.

## Streaming response parsing — recap

You wrote a streaming parser in Build 0. You'll reuse the same logic:

1. Read response body as a stream.
2. Maintain a buffer; parse out balanced JSON objects as they complete.
3. For each `{item: {type: "answer", text: "..."}}`, append to the displayed answer.
4. For `{item: {type: "retrieval", results: {...}}}`, save citations.
5. For `{item: {type: "status", code: "0"}}`, mark the stream complete.

Your AI assistant will reproduce this pattern in React. You verify it works.

## What you'll vibe-code in the walkthrough

A React component `MultiSurfaceChat.tsx` that:

- Maintains a chat history (in component state).
- Renders a persona toggle: Prospect / Member.
- Renders a chat input.
- On submit, calls `/ask` with the prompt config matching the current persona.
- Streams the assistant response into the UI token-by-token.
- Post-processes the assistant's last message — first `[label](url)` becomes a pill button; everything after it is truncated.
- Displays citations under each assistant message.

Plus a parent `App.tsx` that imports the component and wires it into a page. Plus a `ragClient.ts` that holds the fetch + streaming logic.

## Common pitfalls

- **Switching KBs instead of prompts.** Stop. Same KB. Different prompt.
- **Forgetting `{context}` / `{question}` in the user template.** Retrieval still runs but the model can't see it. You get vague answers and blame the retriever.
- **Letting the model keep talking past the CTA.** The prompt says STOP. The model sometimes doesn't. Truncate in code.
- **Hand-writing the streaming parser.** Don't. Brief the AI; it knows the NDJSON pattern.

## What's next

[Build 4 — Multilingual & Voice Switching](../build-4-multilingual-and-voice/) — extend today's chat with language switching, persona scoping, and resource scoping. All implemented via query prefixes. The cheapest, highest-leverage extensions to a Tier 2 chat.
