# Build 2 — Walkthrough: Multi-surface conversational intelligence

> Estimated time: 6–8 hours focused. Complete the [lesson](lesson.md) first.

## Prerequisites

- Build 0 + Build 1 complete and signed off.
- The Sample ARAG App cloned locally and running against your sandbox KB.
- Comfortable reading TypeScript / React (the Sample app is your reference).

## 1. Fork the FloatingChat component

The Sample ARAG App's `src/components/chat/FloatingChat.tsx` is the canonical Tier 2 reference. You'll port the patterns into your own component.

```bash
cd Sample-ARAG-App
mkdir -p src/components/chat/build-2
cp src/components/chat/FloatingChat.tsx src/components/chat/build-2/MultiSurfaceChat.tsx
```

Open the new file in your editor. You'll modify it through the walkthrough.

## 2. Set up two prompt configurations

At the top of `MultiSurfaceChat.tsx`, add a prompts object:

```typescript
const PROMPTS = {
  prospect: {
    system: `You are a knowledge assistant. STRICT RULES:
(1) Maximum 3 sentences for your answer.
(2) Then provide ONE call-to-action link from the context on a new line, in markdown link format.
(3) STOP after the link. Do not continue writing. Do not repeat information.`,
    user: `Context (includes CallToAction fields): {context}

Question: {question}

Respond concisely and include a relevant call-to-action link from the context.`,
  },
  member: {
    system: `You are a knowledge assistant with full access to the member library.
Provide detailed, expert-level answers. Reference specific resources, papers, and presentations when relevant.
Respond in 3-4 sentences maximum with multi-source citations.`,
    user: `Based on: {context}

Answer: {question}`,
  },
} as const;
```

## 3. Wire the prompt selection

Add component state to track which mode is active:

```typescript
const [mode, setMode] = useState<'prospect' | 'member'>('prospect');
const activePrompt = PROMPTS[mode];
```

When calling the streaming endpoint, pass the active prompt:

```typescript
const stream = ragClient.stream(query, activePrompt);
```

If your `ragClient.stream()` doesn't accept a prompt parameter yet, copy the signature from `Sample-ARAG-App/src/lib/ragApi.ts:598-732`. The streaming function takes `(query, config, isMemberMode, customPrompt)`. The `customPrompt` becomes the `prompt` field in the request body.

## 4. Add the persona switcher

Above the chat input, add a small toggle:

```tsx
<div className="flex gap-2 px-4 py-2 border-b text-xs">
  <button
    className={mode === 'prospect' ? 'font-bold' : 'text-gray-500'}
    onClick={() => setMode('prospect')}
  >
    Prospect (Shopper)
  </button>
  <button
    className={mode === 'member' ? 'font-bold' : 'text-gray-500'}
    onClick={() => setMode('member')}
  >
    Member (Pro)
  </button>
</div>
```

Verify: open the chat, ask "what should I buy?", note the answer length and CTA. Switch to Member, ask the same question. The answer should be longer, more detailed, with multi-source citations.

## 5. Add the language switch

Add a language dropdown:

```typescript
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Mandarin'] as const;
const [language, setLanguage] = useState<typeof LANGUAGES[number]>('English');
```

Render it next to the persona switcher.

When constructing the query:

```typescript
const langPrefix = language !== 'English' ? `Respond in ${language}: ` : '';
const finalQuery = `${langPrefix}${rawQuery.trim()}`;
```

Pass `finalQuery` to `stream()` instead of `rawQuery`.

Verify: ask "what should I buy?" with `language='French'`. The answer should be in French.

## 6. Wire the field-engineered CTA renderer

Copy the `formatAssistantHtml` function from `FloatingChat.tsx:22-45`. It does two things:

1. Converts `[label](url)` markdown into a pill-style `<a>` element.
2. Truncates everything written after the first CTA pill.

Apply it to the assistant's rendered message:

```tsx
<div dangerouslySetInnerHTML={{ __html: formatAssistantHtml(message.text) }} />
```

Verify: in Prospect mode, ask "what's a good first product to try?" The answer should end with a single pill-shaped CTA, and nothing should appear after it even if the LLM tried to keep talking.

## 7. Resource-scoped chat (preview)

For the resource-scope toggle, add an optional `resourceTitle` prop. When set:

```typescript
const scopePrefix = resourceTitle
  ? `Regarding the resource titled "${resourceTitle}": `
  : '';
const finalQuery = `${langPrefix}${scopePrefix}${rawQuery.trim()}`;
```

Test from a parent page that passes `resourceTitle="..." ` — the answer should focus on that resource. (Not 100% scoping; the retriever still sees the full KB. That's expected for Tier 2.)

## 8. Deep-link autosubmit

Add a `useEffect` block:

```typescript
import { useSearchParams, useNavigate } from 'react-router-dom';

const [searchParams] = useSearchParams();
const navigate = useNavigate();
const autoSubmittedRef = useRef(false);

useEffect(() => {
  const q = searchParams.get('q');
  if (q && !autoSubmittedRef.current) {
    autoSubmittedRef.current = true;
    submitQuery(q);
    navigate({ pathname: window.location.pathname }, { replace: true });
  }
}, [searchParams, navigate]);
```

Test: load your local URL with `?q=what+is+ARAG`. The query should auto-fire once; the URL should strip `?q=` after; reloading the bare URL should *not* re-fire.

## 9. Wire the component into a real page

In a page (e.g. `src/pages/Build2DemoPage.tsx`), import and render:

```tsx
import { MultiSurfaceChat } from '../components/chat/build-2/MultiSurfaceChat';

export function Build2DemoPage() {
  return (
    <div>
      <h1>Build 2 Demo</h1>
      <p>Use the chat in the corner. Toggle prospect vs member.</p>
      <MultiSurfaceChat />
    </div>
  );
}
```

Add a route. Open the page. Confirm:

- Persona switcher visible.
- Language dropdown visible.
- Chat opens, conversation works, citations render.
- Prospect mode: short + CTA.
- Member mode: long + detail.
- French language: French answer.
- Deep-link `?q=...` auto-fires once and strips.

## 10. Write the "Three voices, one KB" demo script

Create `demo-script.md` in this Build folder. Structure (3-minute demo):

- (0:00) "Most AI vendors give you one chatbot per audience. Watch this."
- (0:20) Ask a question in Prospect mode. Show the 3-sentence answer + CTA.
- (0:50) Click the persona switcher to Member. Ask the same question. Show the 5-paragraph detailed answer.
- (1:30) Click the language switcher to French. Same question. French answer.
- (2:00) Show the URL bar — share the deep link. Paste in a new browser tab; same conversation pre-fired.
- (2:30) Close: "Same KB. Same model. Same code. Different prompt. Different surface. Different audience. *Same engineering team.*"

This script is the asset partners use to introduce the Tier 2 conversation in customer demos.

## Verification checklist

- [ ] Two prompt configs deployed (prospect + member).
- [ ] Persona switcher visible and functional.
- [ ] Language dropdown switches answer language end-to-end.
- [ ] Field-engineered CTA renders as a pill button; nothing renders after it.
- [ ] Resource-scope query prefix works (if implemented).
- [ ] `?q=` deep-link auto-fires once and strips.
- [ ] 3-minute demo script written.
- [ ] Recorded walkthrough submitted to `#build-clinic-submissions`.

## Next

[Build 3 — Schema-constrained generation](../build-3-schema-constrained-generation/) is where the moat-building begins. `/ask` stops being a chat endpoint and becomes a typed API.
