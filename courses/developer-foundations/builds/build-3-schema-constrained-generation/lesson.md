# Build 3 — Lesson: Schema-constrained generation (the agent workshop)

> Estimated reading time: 35 minutes. Read this before starting the [walkthrough](walkthrough.md). Requires passing Build 2.
>
> **Top-priority Build.** This is the asset that converts "we already use ChatGPT" objections into Tier 3 platform conversations. Partners who can't ship this don't sell past $80K ACV.

## Why partners learn this

Build 2 makes ARAG look like a great chatbot. Build 3 is where ARAG stops being a chatbot.

A chatbot returns a string. A platform returns a *typed object*. The moment an AI call returns `{ subject: "...", body: "...", cta_url: "...", recommended_send_window: "..." }` instead of a paragraph of prose, the entire conversation with the customer changes:

- They stop thinking about UX (where to display the answer).
- They start thinking about workflows (what to *do* with the structured output).
- They start thinking about which existing system in their stack would consume it (the email platform, the CRM, the CMS, the case-management tool).
- Budget shifts from "AI experiment" line item to "platform integration" line item.

Tier 1 deal sizes: $30–80K. Tier 3 deal sizes: $80–250K. The lever that moves them is this Build.

## The primitive: `answer_json_schema`

The `/ask` endpoint accepts an optional `answer_json_schema` field. When set, ARAG binds the LLM's output to your schema and returns a parsed object instead of a prose answer.

```json
{
  "query": "Suggest 4 follow-up questions for this query.",
  "answer_json_schema": {
    "name": "follow_up_questions",
    "description": "Generates relevant follow-up questions",
    "parameters": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "questions": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["questions"]
    }
  }
}
```

The response comes back with an `answer_json` field:

```json
{
  "answer_json": {
    "questions": [
      "How do I provision a sandbox?",
      "What's the auth header?",
      "When should I use streaming vs sync?",
      "What does P3 mean?"
    ]
  }
}
```

That's it. The model generated, ARAG validated against the schema, you got typed JSON back.

## The strict-mode requirement: `additionalProperties: false`

Every `object` schema you pass must include `additionalProperties: false`. Every nested object too. The Sample ARAG App's `askForJson` wrapper at `src/lib/ragApi.ts:758-776` walks the schema tree and injects this property recursively:

```typescript
function addAdditionalPropertiesFalse(obj: Record<string, unknown>) {
  if (obj.type === 'object') {
    obj.additionalProperties = false;
    if (obj.properties) {
      for (const val of Object.values(obj.properties)) {
        if (typeof val === 'object' && val !== null) {
          addAdditionalPropertiesFalse(val);
        }
      }
    }
  }
  if (obj.items && typeof obj.items === 'object') {
    addAdditionalPropertiesFalse(obj.items);
  }
  if (obj.parameters && typeof obj.parameters === 'object') {
    addAdditionalPropertiesFalse(obj.parameters);
  }
}
```

**Copy that helper. Use it.** Forgetting `additionalProperties: false` is the single most common reason `askForJson` calls return malformed data — the model adds extra keys the schema didn't anticipate, and your downstream code crashes on the unexpected shape.

## Three response shapes the wrapper falls back through

ARAG returns one of three shapes depending on streaming mode and content-type negotiation. The Sample ARAG App's `askForJson` at `src/lib/ragApi.ts:751-875` handles all three:

1. **`data.answer_json`** — sync mode, content-type `application/json`. The cleanest case. Just `return data.answer_json`.
2. **`data.item.object`** — streamed NDJSON where the final answer_json arrived as an `item` event with type `"answer_json"` and an `object` payload. Common when streaming an `askForJson` call.
3. **Text-parse fallback** — the JSON is embedded in a string answer (because the model occasionally returns it as prose despite the schema). The wrapper strips ```json fences and regex-matches the first `[…]` or `{…}` block.

Most partners write the happy-path handler and ship to production, then break two weeks later when shape #3 occurs. Use the full three-shape wrapper from day one.

## Mixed-shape schemas: schema permissive, code strict

A common Tier 3 use case is "generate items of mixed type" — e.g., an exam containing both multiple-choice and free-text questions. The Sample ARAG App's `ExamPage.tsx:69-146` is the canonical example:

```typescript
const schema = {
  name: 'exam_questions',
  parameters: {
    type: 'object',
    properties: {
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            question: { type: 'string' },
            questionType: { type: 'string', enum: ['multipleChoice', 'freeText'] },
            options: { type: 'array', items: { type: 'string' } }, // MC only
            correct: { type: 'string' },                           // MC only
            rubric: { type: 'string' },                            // FT only
          },
          required: ['id', 'question', 'questionType', 'options', 'correct', 'rubric'],
        },
      },
    },
    required: ['questions'],
  },
};
```

Notice: **every field is required**, even though only some apply per row. The model fills `options`/`correct` for MC rows and `rubric` for FT rows. Your validation code then filters by `questionType` and prunes whatever doesn't apply:

```typescript
const mcQuestions = result.questions
  .filter(q => q.questionType === 'multipleChoice' && Array.isArray(q.options) && q.correct);
const ftQuestions = result.questions
  .filter(q => q.questionType === 'freeText' && q.rubric);
```

This is the **schema permissive, code strict** pattern. The schema lets the LLM return everything; your code enforces the actual contract. Teach this verbatim.

## When to use `askForJson` vs manual JSON via prompt + regex

There are two ways to get structured output. Both work. The choice matters.

### `askForJson` (the `answer_json_schema` parameter)

- Sync-friendly (one round trip → typed object).
- Schema-validated by ARAG before return.
- Can't stream the JSON object as it's generated.
- Use when: the next consumer is *code* (a UI, an API call, another ARAG call).

### Manual JSON via prompt + regex (the streaming path)

The Sample ARAG App's `ExamPage.tsx:174-225` grades each free-text question with a *streaming* response that's also JSON. The pattern:

1. System prompt: `"You are an exam grader. Respond ONLY with valid JSON in this exact format: {...}. No markdown, no explanation outside JSON."`
2. Stream the response token-by-token (so the UI can show progress).
3. Concatenate the streamed `answer` chunks into a string.
4. Strip ` ```json ` fences. Regex-match `\{[\s\S]*\}`. Parse.

```typescript
const fullText = await accumulateStream(ragClient.stream(prompt, { system }));
const cleaned = fullText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
const match = cleaned.match(/\{[\s\S]*\}/);
if (!match) throw new Error('No JSON found');
const result = JSON.parse(match[0]);
```

- Streaming-friendly (UI gets progress).
- Schema is enforced by prompt instructions, not by ARAG.
- Use when: the next consumer is *code* but the *user* needs streaming feedback (e.g., live grading, live drafting).

**Default to `askForJson` unless you specifically need streaming + structure.** Partners default to the wrong pattern all the time. Don't.

## Eight live use cases in the Sample ARAG App

These eight `askForJson` patterns are all in the Sample ARAG App. Study them; you'll re-implement variants of all eight in customer engagements.

| Pattern | File | What it generates |
|---|---|---|
| Dashboard suggestions | `pages/DashboardPage.tsx:117-156` | 5 search-query suggestions personalized to topics |
| Certification program metadata | `context/CertificationContext.tsx:75-118` | Program name, tagline, pass %, duration, prerequisites |
| Domain taxonomy | `context/CertificationContext.tsx:120-170` | 6–8 knowledge domains from the corpus |
| Learning module structure | `context/CertificationContext.tsx:172-225` | 3 modules × 5 topics each, non-overlapping |
| Per-domain sub-topics | `pages/CertificationPage.tsx:84-116` | 6–8 sub-topics per parent domain |
| Mixed-type exam | `pages/ExamPage.tsx:69-146` | MC + FT questions in one schema |
| People Also Ask | `pages/SearchResultsPage.tsx:33-44` | 4 follow-up questions in parallel with search |
| Free-text grading | `pages/ExamPage.tsx:174-225` | Per-question score + feedback + key-points-hit/missed |

All eight use the same primitive. The schema is the variable.

## Common pitfalls in Build 3

1. **Skipping `additionalProperties: false`.** Schema accepts garbage. Code crashes. Fix the wrapper, not the schema.
2. **Writing one happy-path response handler.** The model returns one of three shapes; you need to handle all three.
3. **Marking only the "common" fields required in a mixed-shape schema.** The model leaves fields empty when they're not required, and your validation logic gets confused. Mark everything required; filter in code.
4. **Defaulting to streaming + regex when sync + schema would do.** Streaming is for UI feedback. If the next consumer is code, skip the streaming pattern.
5. **Returning the raw `answer_json` to a customer-facing UI without UI-side validation.** Even with schema validation in ARAG, runtime issues can produce edge cases. Validate again in your Zod / io-ts / Yup schema before rendering.

## What you'll build in the walkthrough

Three live `askForJson` workflows against your sandbox KB:

1. A **follow-up question generator** — input: a query; output: `{ questions: string[] }`.
2. A **dynamic FAQ generator** — input: a topic; output: `{ faqs: [{ question, answer, source_url }] }`.
3. A **domain taxonomy generator** — input: nothing (uses the whole corpus); output: `{ domains: [{ name, description }] }`.

Plus a recorded comparison demo where you show the same query handled via `askForJson` (sync, schema-bound) and via prompt + regex (streamed, parsed), with commentary on when to use each.

## Onward

[Build 4 — Composite RAG](../build-4-composite-rag/) is where you start chaining calls together — generate, evaluate, retrieve more, re-ask. The bridge from chatbot to agent.
