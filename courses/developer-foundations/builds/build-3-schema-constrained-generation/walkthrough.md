# Build 3 — Walkthrough: Schema-constrained generation

> Estimated time: 8–12 hours focused. Complete the [lesson](lesson.md) first.

## Prerequisites

- Builds 0–2 complete and signed off.
- Comfortable with TypeScript + async generators.
- The Sample ARAG App running locally with your sandbox KB credentials in `.env`.

## 1. Port the `askForJson` wrapper

If you haven't already copied it from the Sample ARAG App, do it now. The wrapper is at `src/lib/ragApi.ts:751-875`. Save it to your Build 3 working folder:

```bash
cd Sample-ARAG-App
mkdir -p src/components/build-3
```

Open `src/lib/ragApi.ts` and read lines 751–875. Understand each section before you use it:

- Lines 758–776: the `addAdditionalPropertiesFalse` recursive injector.
- Lines 778–797: request construction with `answer_json_schema`.
- Lines 800–818: sync (content-type `application/json`) response handling, three-shape fallback.
- Lines 820–874: streaming NDJSON handling for `answer_json` items.

The wrapper is intentionally defensive. Every conditional handles a real edge case observed in production.

## 2. Workflow 1 — Follow-up question generator

Create `src/components/build-3/FollowUpQuestions.tsx`:

```tsx
import { useState } from 'react';
import { askForJson } from '../../lib/ragApi';

const FOLLOW_UP_SCHEMA = {
  name: 'follow_up_questions',
  description: 'Generates relevant follow-up questions for a given query and content',
  properties: {
    questions: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['questions'],
};

export function FollowUpQuestions() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const prompt = `Based on the query "${query}" and the content available, suggest 4 follow-up questions a user would likely ask next.`;
      const result = await askForJson<{ questions: string[] }>(prompt, FOLLOW_UP_SCHEMA);
      setResults(result.questions || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Initial query..." />
      <button onClick={generate} disabled={loading}>Generate follow-ups</button>
      <ul>
        {results.map((q, i) => <li key={i}>{q}</li>)}
      </ul>
    </div>
  );
}
```

Wire it into a page. Test with at least three different input queries. Verify:

- The response is always a JSON object with a `questions` array.
- The array has 3–5 items.
- Items are full English sentences ending in `?`.

If you ever get a string back instead of an object, the schema is missing `additionalProperties: false` somewhere — check the injector ran.

## 3. Workflow 2 — Dynamic FAQ generator

Create `src/components/build-3/DynamicFaqs.tsx`. Schema:

```typescript
const FAQ_SCHEMA = {
  name: 'dynamic_faqs',
  description: 'Generates FAQ entries from the available content on a given topic',
  properties: {
    faqs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
          source_resource_title: { type: 'string' },
        },
        required: ['question', 'answer', 'source_resource_title'],
      },
    },
  },
  required: ['faqs'],
};
```

Prompt template:

```typescript
const prompt = `Based on content related to "${topic}", generate 5 FAQ entries. Each entry must include a clear question, a 1-2 sentence answer, and the title of the source resource the answer is grounded in. Use only content available to you.`;
```

Test with 3 topics that exist in your corpus. Verify the `source_resource_title` field corresponds to a real document you ingested.

## 4. Workflow 3 — Domain taxonomy generator

Create `src/components/build-3/DomainTaxonomy.tsx`. This is the "let the KB tell us its own taxonomy" pattern.

```typescript
const TAXONOMY_SCHEMA = {
  name: 'domain_taxonomy',
  description: 'Identifies distinct knowledge domains in the corpus',
  properties: {
    domains: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['name', 'description'],
      },
    },
  },
  required: ['domains'],
};
```

Prompt:

```typescript
const prompt = 'Identify 6-8 distinct knowledge domains that best represent the content available to you. Each domain should be a coherent area of expertise. Return each with a 1-sentence description.';
```

Run this against your sandbox KB. The output is the *taxonomy* of your ingested corpus, generated. Use it to verify your understanding: do the named domains match what you actually ingested?

## 5. Test the three-shape fallback

To verify your wrapper handles all three response shapes, run each workflow:

- **Sync mode (current setup).** Most calls return `data.answer_json`. Confirm parsing works.
- **Stream the same call.** Modify a workflow to use streaming instead of sync, and verify the wrapper accumulates the `item.object` payload correctly.
- **Force text-fallback.** Modify one prompt to add `"Reply only in plain text"` and confirm the wrapper's regex fallback extracts the embedded JSON. This is the worst-case path; you want to know it works.

## 6. Mixed-shape exam schema (advanced)

For a stretch deliverable, implement the mixed-shape exam pattern from `ExamPage.tsx:69-146`. Schema fragment:

```typescript
const EXAM_SCHEMA = {
  name: 'exam_questions',
  description: 'Generate exam questions, mixed MC + free-text',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          question: { type: 'string' },
          questionType: { type: 'string', enum: ['multipleChoice', 'freeText'] },
          options: { type: 'array', items: { type: 'string' } },
          correct: { type: 'string' },
          rubric: { type: 'string' },
        },
        required: ['id', 'question', 'questionType', 'options', 'correct', 'rubric'],
      },
    },
  },
  required: ['questions'],
};
```

Test with `"Generate a 5-question certification exam. Mix multiple-choice and free-text."` Verify:

- Some rows have `questionType: 'multipleChoice'` with populated `options`.
- Some rows have `questionType: 'freeText'` with populated `rubric`.
- Your validation code filters each list correctly.

## 7. Comparison demo: schema vs prompt+regex

Build a side-by-side page. Same input query. Two output paths:

- **Left side:** `askForJson` (sync, schema-validated, structured output).
- **Right side:** `client.stream(...)` with a JSON-strict system prompt and regex extraction in JS.

Record yourself walking through both. Narration points:

1. "Left side: the JSON is enforced by ARAG. The model can't return prose; the schema makes it impossible."
2. "Right side: the JSON is enforced by *prompt*. The model could return prose, but the system prompt says 'JSON only,' and we regex-extract."
3. "Left side is what you ship when the next consumer is code. Right side is what you ship when the user needs streaming progress — like a live grading panel."

This recording is the deliverable that goes in your Tier 3 customer-facing collateral. Save it as `comparison-demo.md` + a video link in this folder.

## 8. Assemble the Agent Workshop notebook

Create `agent-workshop.md` in this folder. Structure:

1. The five `askForJson` recipes from this Build (follow-ups, FAQs, taxonomy, mixed-shape exam, comparison).
2. Per recipe: prompt + schema + sample input + sample output.
3. A "schema permissive, code strict" sidebar explaining the validation pattern.
4. A "when to use schema vs prompt+regex" sidebar.

This is the asset partners use to scope Tier 3 customer engagements. Treat it as production-quality.

## Verification checklist

- [ ] `askForJson` wrapper ported with three-shape fallback handling.
- [ ] Follow-up generator working end-to-end with at least 3 test queries.
- [ ] Dynamic FAQ generator returning grounded entries with source titles.
- [ ] Domain taxonomy generator returning 6–8 coherent domains.
- [ ] All three response shapes verified to parse correctly.
- [ ] Mixed-shape exam schema generates valid MC + FT rows with correct validation.
- [ ] Comparison demo (schema vs prompt+regex) recorded.
- [ ] Agent Workshop notebook (`agent-workshop.md`) written.

## Next

[Build 4 — Composite RAG](../build-4-composite-rag/) is where you chain `/ask` calls together with conditional retrieval — the on-ramp to true agentic patterns.
