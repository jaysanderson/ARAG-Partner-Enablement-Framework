# Build 5 — Lesson: Structured Outputs

> Read time: 12 minutes.
>
> **This is the most important Build in Foundations.** Tier 3 deals open here.

## Why this Build matters more than the others

Builds 0–4 make ARAG look like a great chatbot. Build 5 is where ARAG stops being a chatbot.

A chatbot returns a string. A platform returns a **typed object**. The moment an AI call returns `{ subject, body, cta_url, recommended_send_window }` instead of a paragraph of prose, the entire customer conversation changes:

- They stop thinking about UX (where to display the answer).
- They start thinking about workflows (what to *do* with the structured output).
- They start thinking about which existing system in their stack consumes it (email platform, CRM, CMS, case management).
- Budget shifts from "AI experiment" to "platform integration."

Tier 1 deal sizes cap around $80K. Tier 3 deals open at $80K and run to $250K+. **The lever that moves them is this Build.**

## The primitive: `answer_json_schema`

Same `/ask` endpoint as Build 3. Add one body field — `answer_json_schema` — and the LLM's output is bound to your schema. You get a typed object back, not prose.

```json
POST /v1/kb/{kbId}/ask
Headers: X-NUCLIA-SERVICEACCOUNT, Content-Type, x-synchronous: true
Body:
{
  "query": "Generate 5 FAQ entries on topic X.",
  "answer_json_schema": {
    "name": "faqs",
    "description": "FAQ entries grounded in the corpus",
    "parameters": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "faqs": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "question": { "type": "string" },
              "answer": { "type": "string" }
            },
            "required": ["question", "answer"]
          }
        }
      },
      "required": ["faqs"]
    }
  }
}
```

Response:

```json
{ "answer_json": { "faqs": [{"question":"...","answer":"..."}, ...] } }
```

That's it. Send → typed object back. Done.

## The rule that breaks everything if you forget it

**Every `object` schema must include `additionalProperties: false`.** At every nesting level. Strict mode.

Without it, the model adds extra keys you didn't specify and your downstream code crashes on the unexpected shape. Your AI assistant will forget this rule about 70% of the time. Always check. Build the helper function below into your `ragClient.ts` so the helper auto-injects it.

```typescript
function injectAdditionalPropertiesFalse(obj: any): any {
  if (obj && obj.type === 'object') {
    obj.additionalProperties = false;
    if (obj.properties) {
      for (const v of Object.values(obj.properties)) {
        injectAdditionalPropertiesFalse(v);
      }
    }
  }
  if (obj && obj.items) injectAdditionalPropertiesFalse(obj.items);
  return obj;
}
```

15 lines, walks the schema tree, injects `additionalProperties: false`. Use it on every schema before sending.

## Three response shapes the wrapper handles

ARAG returns one of three shapes depending on streaming mode and content-type negotiation:

1. **`data.answer_json`** — sync mode. The cleanest case. Just `return data.answer_json`.
2. **`data.item.object`** — streamed NDJSON. Final answer came as `{item: {type: "answer_json", object: {...}}}`. Capture it from that item.
3. **Text-parse fallback** — the JSON arrived embedded in a string answer (because the model occasionally returns it as prose despite the schema). Strip ` ```json ` fences. Regex-match `\{[\s\S]*\}`. Parse.

Most partners write the happy-path handler and ship. Two weeks later their app crashes when shape #3 occurs. **Write all three from day one** — your AI will produce the wrapper correctly if you brief it on the three shapes.

## Schema permissive, code strict

A common Tier 3 ask: "generate a mix of items of different types." E.g., an exam with multiple-choice questions and free-text questions in one response.

```json
{
  "name": "exam_questions",
  "parameters": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "questions": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "id": { "type": "string" },
            "question": { "type": "string" },
            "questionType": { "type": "string", "enum": ["multipleChoice", "freeText"] },
            "options": { "type": "array", "items": { "type": "string" } },
            "correct": { "type": "string" },
            "rubric": { "type": "string" }
          },
          "required": ["id", "question", "questionType", "options", "correct", "rubric"]
        }
      }
    },
    "required": ["questions"]
  }
}
```

Notice — **every field is required**, even though MC items use `options/correct` and FT items use `rubric`. The model fills in whatever applies per row. Your validation code then filters by `questionType` and prunes empty fields:

```typescript
const mcQuestions = result.questions
  .filter(q => q.questionType === 'multipleChoice' && q.options.length > 0 && q.correct);
const ftQuestions = result.questions
  .filter(q => q.questionType === 'freeText' && q.rubric);
```

**Schema permissive, code strict.** Let the model return everything; your code enforces the actual contract. This is the pattern for mixed-shape generation.

## When to use schema vs prompt-+-regex

Two ways to get structured output. Both work. The choice matters.

### `answer_json_schema` (sync, schema-validated)

- One round trip → typed object.
- Schema validated by ARAG.
- Can't stream the JSON as it's generated.
- **Use when:** the next consumer is *code* (a UI, an API, another ARAG call).

### Manual JSON via prompt + regex (streaming)

- Stream the response (UI sees progress).
- Use a strict system prompt: *"Respond ONLY with valid JSON in this exact format: {...}"*
- Concatenate `answer` chunks, strip ```json fences, regex-extract `\{[\s\S]*\}`, `JSON.parse`.
- **Use when:** the next consumer is code AND the user needs streaming feedback (e.g., live grading panel).

**Default to `answer_json_schema`** unless you specifically need streaming + structure.

## Customer-signal → Tier 3 workflow examples

Every one of these is a vibe-coded askForJson workflow. Recognise them in customer meetings; scope as Tier 3 engagements.

| Customer says | Workflow |
|---|---|
| "Generate FAQs from our docs" | FAQ generator (schema: `{faqs: [{question, answer, source_resource_id}]}`) |
| "Pre-fill the intake form from the customer's history" | Intake-form pre-filler (schema = your form's fields) |
| "Compare these three products and give me a table" | Comparison-table generator (schema: `{rows: [{attribute, product_a, product_b, product_c}]}`) |
| "Generate quarterly OKRs from our docs" | OKR generator (schema: `{okrs: [{objective, key_results, owner}]}`) |
| "Suggest next-best-actions for this customer" | NBA generator (schema: per your CRM contract) |
| "Generate a personalised onboarding plan" | Onboarding-path generator (schema: `{day_30, day_60, day_90, required_reading, assigned_intros}`) |
| "Pre-classify this incoming ticket" | Triage classifier (schema: `{category, priority, suggested_owner, missing_info}`) |

Pattern: customer wants AI to generate a *structured thing*. You design the schema; the AI generates the workflow code; the customer's system consumes the typed output.

## What you'll vibe-code in the walkthrough

Three Tier 3 workflows:

1. **FAQ generator** — input: a topic; output: 5 FAQ entries with source resource IDs.
2. **Taxonomy generator** — input: nothing; output: 6–8 distinct knowledge domains the KB covers.
3. **Comparison-table generator** — input: list of items; output: structured comparison table.

Plus the `additionalProperties: false` injector helper + the three-shape fallback in the wrapper.

## Embedding citations inside an answer_json_schema

Build 5 taught schema-constrained generation but didn't show how to make the structured output *traceable*. Without an in-schema citation field, the partner gets a beautiful JSON payload with no way to link any item back to its source — the antithesis of the "grounded" promise. A typed object that can't prove where it came from is just a confident hallucination with good formatting. The fix is a one-field addition + a system-prompt discipline line.

API surface:

- Add a string `citation_resource_id` field to every array-item schema you want traceable.
- Mark it `required` alongside the rest of the row.
- Pair it with a system-prompt rule that forces verbatim retrieved IDs — no invention.

```ts
const SCHEMA = {
  type: 'object',
  properties: {
    picks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          why: { type: 'string' },
          citation_resource_id: { type: 'string' },  // <-- the trace link
        },
        required: ['name', 'why', 'citation_resource_id'],
      },
    },
  },
};

// And on the system prompt:
const SYSTEM =
  'For every item, set citation_resource_id to a VERBATIM resource id ' +
  'from the retrieved context. Do NOT invent ids, slugs, hostnames or ' +
  'paths. If you cannot cite a real id, omit the item entirely.';
```

> **ID discipline in system prompts.** The "verbatim, do NOT invent" instruction is essential whenever your client builds deterministic click-throughs from a structured output. Without it, the model will helpfully fabricate plausible-looking ids like `aurora-helios-down-jacket` that 404 on click. The discipline is the difference between a CTA that works and a CTA that breaks in front of a CMO.

Common failure mode: ship the schema field, forget the system-prompt line. The model returns invented IDs that look real, every click 404s, and the demo dies on stage. Always pair the field with the discipline rule — they are one feature, not two.

**See it in the capstone:** `Capstone-Aurora-Concierge/src/lib/askForJson.ts` (additionalProperties injector + verbatim-id system prompt) and `Capstone-Aurora-Concierge/src/pages/Personalize.tsx` → `CitationLink` / `CitationInline` renderers.

## Common pitfalls

- **Forgetting `additionalProperties: false`.** The model returns garbage shapes; your code crashes. Inject it automatically.
- **One happy-path handler.** Handle all three response shapes from day one.
- **Marking only "common" fields required in a mixed-shape schema.** Mark everything required; filter in code.
- **Streaming + regex by default.** Only use that when you need streaming progress. Otherwise schema is cleaner.
- **Not validating in TypeScript / Zod after parsing.** Even with schema enforcement, runtime issues happen. Validate again before rendering.

## What's next

[Build 6 — Data-Augmentation Agents](../build-06-data-augmentation-agents/) — content-type + label-based filtering for search UIs. Cheap precision lever.
