# Build 02 — Lesson: Prompts & Generative Answers

> Read time: 12 minutes.

## Why this is in the course

Build 01 tuned what search hands the model. This Build tunes what the model does with it. The dashboard's **Generative answer and RAG** section — the product description is literally "allows you to define how the answer is generated" — actually covers two different jobs living in one tab: **generation** (the prompt, the model, how hard it reasons, how many tokens it spends) and **RAG strategies** (how the retrieved context gets assembled before it reaches the model). This Build is the generation half only. Build 03 is the RAG-strategies half of the same tab. If you came here looking for `hierarchy`, `neighbouring_paragraphs`, or `field_extension`, that's next Build, not this one.

## Prompts: config-level, per-call, and three prompt slots

A prompt can live in two places. **Config level** — set once on a stored `search_configuration` (Build 00) or the dashboard's Generative Answer tab, applies to every `/ask` call on that Knowledge Box. **Per-call** — passed inline in the `/ask` request body, overriding whatever the configuration has for that one call. Same pattern as everything else in this course: the dashboard writes the config-level version, the API accepts either.

The `prompt` parameter is a JSON object with three keys:

```json
{
  "system": "Your system prompt",
  "user": "Your user prompt",
  "rephrase": "Your rephrase prompt"
}
```

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "What boot should I bring on the Tour du Mont Blanc?",
    "prompt": {
      "system": "You are Aurora Outfitters'\'' shopping assistant. Answer concisely and recommend a specific product when relevant.",
      "user": "Context:\n{context}\n\nQuestion: {question}\n\nAnswer using only the context above."
    }
  }'
```

- **`system`** — the assistant's persona and standing instructions. This is what you saw Build 00 save into `shopper_default`.
- **`user`** — the template wrapping the retrieved context and the question before it reaches the model. Override it when you need a different answer shape (bulleted, one-sentence, cite-every-claim) than the platform default.
- **`rephrase`** — see the next section. This one trips people up.

> **Gotcha.** `prompt.rephrase` is **not** the same thing as `rephrase: true` from [Build 01](../build-01-tuning-the-search-strategy/). `rephrase: true` is a boolean that turns query rephrasing **on or off** — whether the platform rewrites your query into a better search string before retrieval runs. `prompt.rephrase` is a **prompt template** — text instructing the model *how* to do that rewrite, once rephrasing is already switched on. Setting `prompt.rephrase` while `rephrase` is unset or `false` does nothing; there's no rephrase step for the template to shape. Turn rephrasing on first, then customize its instructions if the default rewrite behaviour doesn't fit your corpus.

## `generate_answer` — the retrieval-vs-generation debugging switch

`generate_answer` (request parameter; the dashboard/widget-config name is `generateAnswer`) is a boolean. `true` — the default — runs the full pipeline: retrieve, then generate an LLM answer grounded in what was retrieved. `false` skips the LLM step entirely and returns retrieval only, same shape as `/find`.

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "What boot should I bring on the Tour du Mont Blanc?", "generate_answer": false}'
```

This is the single most useful debugging move in this Build. When a customer says "the answer is wrong," the instinct is to start rewriting the prompt. Don't — you don't yet know whether the problem is retrieval or generation. Set `generate_answer: false` first and read the retrieved paragraphs. If the right content came back, the fault is generation (prompt, model, reasoning) and you're in the right Build. If the wrong paragraphs came back, no prompt fix will save it — go back to Build 01. It also means you're not paying for or waiting on an LLM call while you isolate the problem.

## `generativeModel` — which LLM answers

```json
{ "query": "...", "generativeModel": "chatgpt-azure-4o" }
```

> **Gotcha.** Switching models changes latency, cost, and answer style all at once. A configuration you've tuned — prompt wording, `rag_strategies` (Build 03) — for one model may need retuning for another; a system prompt that reliably produces short, punchy answers on one model can produce long hedgy ones on a different model with no other change. Treat a model switch as a re-test event, not a drop-in swap.

## `reasoning` — effort and budget for reasoning-capable models

```json
{
  "query": "...",
  "reasoning": { "effort": "medium", "budget_tokens": 2000 }
}
```

- **`effort`** — `none | low | medium | high | minimal | xhigh`. Only meaningful for models that support explicit reasoning; ignored otherwise.
- **`budget_tokens`** — a numeric cap on how many tokens the model may spend reasoning before it has to answer.

There's also a `showReasoning` / `display` flag that surfaces the reasoning trace in the response — useful for debugging why a model landed on a particular answer, not something you'd normally expose to an end user.

> **Gotcha.** Higher effort and larger budgets buy real quality on genuinely multi-step questions — the kind where the model has to combine facts from more than one resource before it can answer. On a straightforward factual lookup, they mostly buy latency and cost for a marginal (often zero) quality gain. Reserve `high`/`xhigh` for the questions that need it; default to `low`/`medium` for everything else.

## Token limits — capping spend per call

```json
{
  "query": "...",
  "limitTokenConsumption": true,
  "tokenConsumptionLimit": 4000,
  "outputTokenConsumptionLimit": 500
}
```

`limitTokenConsumption` is the on/off gate. With it `true`, `tokenConsumptionLimit` (total tokens — input plus output) and `outputTokenConsumptionLimit` (output only) apply; either can be `number` or `null` (no cap on that dimension). This is a cost-control lever for high-QPS production widgets — cap spend per call before a single runaway prompt or a chatty model blows a monthly budget.

## `preferMarkdown` — formatted output

```json
{ "query": "...", "preferMarkdown": true }
```

Asks the model to format its answer in Markdown — headings, bold, bullet lists.

> **Gotcha.** This only helps if whatever renders the answer actually parses Markdown. A widget or chat UI built to render it looks noticeably better with `preferMarkdown: true`. A plain-text surface — an SMS integration, a bare `<p>` tag, a log line — renders the literal `**bold**` and `# Heading` characters, which reads worse than no formatting at all. Check the consuming surface before you flip this on.

## `askSpecificResource` / `specificResourceSlug` — chat with one document

```json
{ "query": "...", "askSpecificResource": true, "specificResourceSlug": "terratrek-7" }
```

Scopes generation to one specific resource by slug instead of the whole Knowledge Box — the "chat with this document" pattern rather than KB-wide search. The raw API equivalent is calling `/ask` directly on the resource's endpoint (`POST /kb/{kbId}/slug/{slug}/ask`) instead of the KB-level `/ask` — that call bypasses the RAG/`find` step entirely and hands the model the full resource content as context. Reach for this when the surface is explicitly "ask about this PDF," not a general search bar.

## `useImages` / `imageUsage` — one paragraph, deferred

`useImages` (boolean) and `imageUsage` (`query | context`) control whether and how images factor into an `/ask` call. That's genuinely all you need for this Build — full depth (page images, paragraph images, when an answer lives in a diagram rather than surrounding text) is [Build 04 — Visual RAG & Images](../build-04-visual-rag-and-images/).

## `usePrompt` / `useSystemPrompt` — keep the prompt saved, toggle it off

```json
{ "query": "...", "usePrompt": false }
```

Both booleans. They let you keep a prompt (or system prompt) saved on a widget configuration but temporarily disable it for a given call without deleting the saved text — useful when you want to A/B a call against the platform's default prompt behaviour without losing your tuned version.

## What this Build doesn't cover

Two things live nearby but aren't here:

- **Schema-constrained generation** (`answer_json_schema`, forcing the model's output into a JSON shape) is a separate, deeper topic — see [Developer Foundations Build 5](../../../developer-foundations/builds/build-05-structured-outputs/). Nothing in this Build touches it.
- **`rag_strategies`** — how retrieved context gets assembled (hierarchy, neighbouring paragraphs, field extension, and so on) — is [Build 03](../build-03-rag-context-strategies/), not this Build.

## What's next

[Build 03 — RAG Context Strategies](../build-03-rag-context-strategies/) — the other half of the Generative Answer tab: `rag_strategies`, the parameter that controls what context the model actually sees before the prompts and settings from this Build ever apply to it.
