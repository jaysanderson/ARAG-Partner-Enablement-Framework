# Build 2 — Lesson: Multi-surface conversational intelligence

> Estimated reading time: 30 minutes. Read this before starting the [walkthrough](walkthrough.md). Requires passing Build 1.

## Why partners learn this

Build 1 ships widgets. Widgets are great when the customer wants "a chatbot" — a single experience for one audience. But the customers worth $250K+ ACV don't have one audience. They have prospects and members. Shoppers and pros. Auditors and managers. Employees and executives. Each audience needs a different voice, a different level of detail, and a different next-action — but the underlying corpus is the same.

Build 2 is where you stop building "a chatbot" and start building *conversational surfaces* — multiple surfaces routed through a single KB, with prompt engineering as the routing mechanism.

Customers who see this demo in the room *immediately* understand they've been sold a feature, not a platform, by their previous AI vendor. That's the moment Tier 2 ACV unlocks.

## The architecture, in one sentence

**One KB. Multiple prompts. Multiple surfaces. Same auth token. Same model. Same code path.**

That's it. The thing partners often over-engineer is the wrong thing. You don't need multiple KBs to serve multiple audiences. You don't need separate ARAG accounts. You don't need a custom routing layer. You need different `prompt` parameters on the `/ask` body.

## Custom prompts on `/ask`

The `/ask` endpoint accepts a `prompt` object with two fields:

```json
{
  "query": "what should I buy?",
  "prompt": {
    "system": "You are ARAKS AI. Maximum 3 sentences. End with one call-to-action link from the context.",
    "user": "Context (includes CallToAction fields): {context}\n\nQuestion: {question}"
  },
  "prefer_markdown": true,
  "rephrase": true
}
```

Three things to internalise:

### 1. `system` controls voice + format

The system prompt is the LLM's persona, length budget, format rules, and behaviour constraints. The Sample ARAG App's `FloatingChat.tsx:251-259` has the canonical "prospect-mode" system prompt:

> *"You are ARAKS AI. STRICT RULES: (1) Maximum 3 sentences for your answer. (2) Then provide ONE call-to-action link from the context on a new line. (3) STOP after the link. Do not continue writing. Do not repeat information. Do not add additional paragraphs after the call-to-action."*

Notice the prescriptive tone. The model doesn't just need to know what you want — it needs to know what *not* to do. "STOP after the link" is the kind of rule you'll write often.

### 2. `user` is where retrieval gets injected

The user template can reference two placeholders:

- `{context}` — replaced by the retrieved paragraphs.
- `{question}` — replaced by the user's query (rephrased if `rephrase: true`).

Most partners skip the user template and let ARAG use its default. That's fine for basic cases. The user template becomes worth writing when you need to:

- Constrain *how* retrieval gets used: "Based ONLY on this context, never your training data: {context}\n\nAnswer: {question}"
- Inject extra structure: "Context (includes CallToAction fields): {context}\n\nQuestion: {question}"
- Add per-call instructions that aren't persona ("Respond as if to a 12-year-old: {question}")

### 3. Query prefixing — the cheapest trick in the book

Sometimes you don't need a custom prompt at all. You need to prefix the user's query with one phrase. Three examples from the Sample ARAG App:

**Research mode** (`ResearchAssistantPage.tsx:22-23`):
> `'Provide a comprehensive, multi-source analysis with detailed citations: '`

**Language switch** (`ResourceChatTab.tsx`):
> `` `Respond in ${language}: ` ``

**Resource scoping** (`ResourceChatTab.tsx:62-89`):
> `` `Regarding the ARAKS resource titled "${resourceTitle}": ${rawQuery}` ``

Query prefixing is the cheapest possible "multi-surface" pattern. The same `/ask` call. The same prompt. Just a different prefix on the query string. You'll use this constantly.

## The two-voice pattern

The flagship Tier 2 demo is the two-voice floating chat. The Sample ARAG App ships it (`FloatingChat.tsx`). The mechanic:

| | Prospect voice (unauthed) | Member voice (authed) |
|---|---|---|
| **System prompt** | Max 3 sentences. End with ONE CTA from context. STOP. | Detailed expert answer. Reference specific resources. 3–4 sentences max. |
| **User template** | `Context (includes CallToAction fields): {context}\n\nQuestion: {question}` | `Based on: {context}\n\nAnswer: {question}` |
| **Goal** | Conversion. Get the prospect to click a CTA. | Retention. Make the member feel served. |
| **KB** | Same | Same |
| **Model** | Same | Same |

That's the whole pattern. Two prompt configs. One KB. One UI component with a mode toggle.

## Field-engineered CTAs

The prospect-mode prompt references "CallToAction fields." These aren't a Nuclia feature — they're a **partner-engineered field design** that the Sample ARAG App pioneered.

How it works:

1. Every product/resource in the KB has a custom text field called `callToAction` with a short, branded sentence ("Try the TerraTrek 7 in your local store →").
2. That field is included in `/find` results because it's part of `data.texts.callToAction.value.body`.
3. The prompt instructs the model to use those CTAs in its answer.
4. The front-end intercepts the model's `[label](url)` markdown and renders it as a pill-shaped CTA button.

The Sample ARAG App's `formatAssistantHtml` at `FloatingChat.tsx:22-45` does the front-end intercept. It also *truncates* anything the model writes after the CTA — because "STOP after the link" in the system prompt isn't always honoured, but post-processing always wins.

**The commercial wedge:** the customer's content team owns the CTA copy. Every CTA improvement is a content edit, not a code deployment. Partners sell ongoing content-engineering retainers ($5–15K/month per customer) tied to this pattern. The Advanced course's Build 5 goes deep on it.

## Multilingual without re-indexing

Customers ask this in the first ten minutes of every multinational demo. The answer:

**A query prefix.**

```typescript
const langPrefix = language !== 'English' ? `Respond in ${language}: ` : '';
const finalQuery = `${langPrefix}${userQuery}`;
```

That's it. No separate KB. No separate embeddings. No separate model. The LLM handles the translation as part of generation.

When the customer asks "but what about Japanese / Mandarin / Arabic?" — same answer. As long as the LLM you've chosen supports the language (GPT-4, Claude, Gemini, Llama all do for the major languages), the prefix works.

The Sample ARAG App's `ResourceChatTab.tsx` has a hard-coded list — `English`, `Spanish`, `French`, `German`, `Mandarin`, `Japanese`. Add or remove as the customer requires.

## Resource-scoped chat

"Ask about this specific PDF" / "Chat with this video" is a common customer ask. The pattern, again, is a query prefix:

```typescript
const contextQuery = `Regarding the ARAKS resource titled "${resourceTitle}": ${rawQuery.trim()}`;
```

The retrieval still happens against the full KB — the model just sees the title in the query and is biased toward paragraphs from that resource. This is **pseudo-scoping**. It's not perfect (the retriever can still pull paragraphs from other documents if they match more strongly), but it's cheap and works for 90% of cases.

If a customer needs strict scoping (only retrieve from one resource), use the `filters` array with a resource-id filter — but that's a Tier 3+ topic.

## Deep-link sharing with autosubmit

Every conversation in your Tier 2 chat surface should be shareable. The pattern from `AssistantPage.tsx:101-109`:

```typescript
useEffect(() => {
  const query = searchParams.get('q');
  if (query && !autoSubmittedRef.current) {
    autoSubmittedRef.current = true;
    submitQuery(query);
    navigate('/assistant', { replace: true });
  }
}, [searchParams]);
```

Three details that matter:

1. **`autoSubmittedRef.current = true` *before* calling `submitQuery`.** Otherwise re-renders re-fire.
2. **`navigate('/assistant', { replace: true })`** strips `?q=` from the URL so a reload doesn't re-fire.
3. **Conversation state is React state**, not URL state. The `?q=` is for *initial seed only*.

This is the pattern every Tier 2 partner ships. Get it right once; reuse forever.

## Common pitfalls in Build 2

1. **Switching KBs based on user state instead of switching prompts.** Some partners (and the original Sample ARAG App) use a two-KB pattern for public-vs-member content. That's a *gating* decision, not a *voice* decision. For Tier 2 multi-surface chat over a *single* corpus, switch prompts, not KBs.
2. **Forgetting `{context}` and `{question}` in the user template.** Without these placeholders, retrieval still happens but the model doesn't see the context. Confusing failure mode — you get vague answers and assume the retriever is broken.
3. **Letting the model write past the CTA.** Always post-process. The system prompt says "STOP after the link"; the model sometimes ignores it. Truncate in code.
4. **Hard-coding language strings in the prompt instead of using a query prefix.** Then you can't switch languages without changing the prompt config. Use the prefix.
5. **Treating chat history as URL state.** It's not. The URL seeds *initial* state, then the app owns it.

## What you'll build in the walkthrough

A custom React floating-chat component with:

- Two voice modes (prospect, member), wired to two prompt configurations.
- A persona switcher at the top to flip between modes.
- A language dropdown that prepends `Respond in {language}:`.
- Field-engineered CTA rendering (markdown link → pill button + truncation).
- A resource-scope toggle that prepends the resource title to the query.
- `?q=` deep-link seeding with autosubmit-once + URL strip.

Forked from the Sample ARAG App's `FloatingChat.tsx`, customised against your Build 0 KB.

## Onward

When you've passed the [quiz](quiz.md) and shipped the deliverable, [Build 3 — Schema-constrained generation](../build-3-schema-constrained-generation/) is next. Build 3 is where `/ask` stops being a chat endpoint and becomes a programmable backend.
