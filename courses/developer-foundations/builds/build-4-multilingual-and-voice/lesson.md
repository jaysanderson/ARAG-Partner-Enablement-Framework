# Build 4 — Lesson: Multilingual & Voice Switching

> Read time: 8 minutes. Companion to the 8-minute [video](video-script.md).

## Why this Build exists

Build 3 ships two prompt voices. Customers immediately ask for three more things:

1. **Multilingual answers.** "Our users are in 8 countries; can it answer in their language?"
2. **Persona / segment scoping.** "Same query, different framing depending on user role."
3. **Resource scoping.** "Ask about this specific PDF / video / document."

Each one **looks** like it should require new infrastructure. Each one is actually a **query-prefix one-liner**. This Build is about recognising when prefixing solves the problem you were about to over-engineer.

## The query-prefix pattern

Everything in this Build follows the same shape:

```typescript
const prefix = buildPrefix(language, persona, resourceTitle);
const finalQuery = `${prefix}${userQuery}`;
streamAsk(finalQuery, promptConfig);
```

That's it. Same endpoint, same prompt config, just a prefix on the query string. The LLM treats the prefix as part of the question and acts on it.

## Lever 1 — Language switching

```typescript
const langPrefix = language !== 'English' ? `Respond in ${language}: ` : '';
```

That's the entire mechanism. The LLM you're already paying for handles translation as part of generation. **No separate KB, no separate embeddings, no separate model**, no `lang` body parameter (there isn't one). Just a prefix.

Hard-code a list of languages in your UI: English, Spanish, French, German, Japanese, Mandarin. Add more as the customer requires. As long as the LLM supports the language (GPT-4, Claude, Gemini all do for the major languages), the prefix works.

**Customer reaction to this demo:** "Wait, that's it?" Yes. That's it.

## Lever 2 — Persona / segment scoping

```typescript
const personaPrefix = userSegment
  ? `The user is a ${userSegment}. Frame your answer accordingly. `
  : '';
```

A weekend hiker asking "what should I buy?" gets a different answer than an alpine guide asking the same. Same prompt config; the prefix nudges the model on framing.

Combine with the persona toggle from Build 3 and you have **two prompts × many segments** combinatorially — without any new prompt configs.

## Lever 3 — Resource scoping

```typescript
const scopePrefix = resourceTitle
  ? `Regarding the resource titled "${resourceTitle}": `
  : '';
```

"Ask about this PDF" / "Chat with this video." The retrieval still searches the full KB — but the model sees the resource title in the query and biases toward paragraphs from that resource.

This is **pseudo-scoping**. It's not strict (the retriever can still pull paragraphs from other documents if they're relevant). For 90% of "ask about this resource" customer asks, that's fine. For strict scoping (only retrieve from one resource), use a `filter` on the `/find`-style endpoint with a resource-id filter. Build 6 covers filter composition.

## Composing the three

```typescript
function buildPrefix(language: string, segment: string, resourceTitle: string): string {
  const lang = language !== 'English' ? `Respond in ${language}: ` : '';
  const persona = segment ? `The user is a ${segment}. ` : '';
  const scope = resourceTitle ? `Regarding "${resourceTitle}": ` : '';
  return `${lang}${persona}${scope}`;
}

const finalQuery = `${buildPrefix(lang, segment, title)}${userQuery}`;
```

Three optional prefixes. ~15 lines of code total. Vibe-coded in 3 minutes.

## What's not a prefix

Some things look like prefixes but aren't:

- **Verbosity / "research mode."** Could be a prefix (`"Provide a comprehensive multi-source analysis: "`). Often better as a different prompt config — because verbosity changes the *system* persona, not just the question framing.
- **Output format control** (e.g., "respond as JSON"). Don't. Use `answer_json_schema` — Build 5.
- **Hard scoping to one resource.** Use a filter, not a prefix.

Recognise the difference. Prefixes are cheap; sometimes a different prompt config is the right answer.

## What you'll vibe-code in the walkthrough

Extend the Build 3 chat with:

1. A language dropdown (5–6 languages) → injects `Respond in {language}:` prefix.
2. A "user segment" radio selector (3–4 segments specific to your KB content) → injects persona-framing prefix.
3. A resource-context input (optional) → injects "Regarding…" prefix.

Plus a recorded demo flipping each lever and showing the answer change in real time.

## Common pitfalls

- **Over-engineering language.** Don't build a translation service. The prefix and the LLM are enough.
- **Confusing prefix with prompt.** The prefix goes on the **query string**. The prompt config (`{system, user}`) is separate.
- **Putting the prefix in `prompt.system`.** Wrong. The prefix is part of the *question*, not the *persona*.
- **Hard-coding the language list and not updating it.** Make the list configurable so customer brand teams can add languages without partner code changes.

## What's next

[Build 5 — Structured Outputs](../build-5-structured-outputs/) — the most important single Build in the course. `answer_json_schema` is where ARAG stops being a chatbot and becomes a programmable backend. Tier 3 unlocks.
