# Build 4 — Walkthrough: Composite RAG

> Estimated time: 6–8 hours focused. Complete the [lesson](lesson.md) first.

## Prerequisites

- Builds 0–3 complete.
- 20–30 documents ingested into your sandbox KB (Build 0 had 10; if you've only got 10, ingest more before this Build — composite RAG is hard to demonstrate against a tiny corpus).
- TypeScript familiarity.

## 1. Pick 5 "hard queries"

Composite RAG only shines on queries that single-shot answers poorly. Identify them first.

Run 10–15 queries through your existing `/assistant` page (from Build 0). For each, note:

- Did the answer return at least 3 citations?
- Did the answer say something like "I don't have enough information"?
- If you knew the answer was in the corpus, did the model find it?

The queries that fail those checks are your 5 hard queries. Save them in `hard-queries.md` in this Build folder.

## 2. Build the composite wrapper

Create `src/components/build-4/CompositeRagClient.ts`:

```typescript
import { siteContentClient, searchResources, type KnowledgeResource } from '../../lib/ragApi';

const CONFIDENCE_THRESHOLD = 0.7;
const MIN_CITATIONS = 3;

interface CompositeResult {
  answer: string;
  citations: Citation[];
  steps: Array<{ step: string; durationMs: number; outcome: string }>;
}

export async function compositeAsk(query: string): Promise<CompositeResult> {
  const steps: CompositeResult['steps'] = [];
  const t0 = Date.now();

  // Step 1: single-shot /ask
  const initial = await siteContentClient.ask(query);
  steps.push({
    step: 'initial-ask',
    durationMs: Date.now() - t0,
    outcome: `${initial.citations.length} citations, top confidence ${initial.citations[0]?.confidence ?? 0}`,
  });

  // Step 2: evaluate
  const confident =
    initial.citations.length >= MIN_CITATIONS &&
    (initial.citations[0]?.confidence ?? 0) >= CONFIDENCE_THRESHOLD;

  if (confident) {
    return { ...initial, steps };
  }

  // Step 3: augment via /find
  const t1 = Date.now();
  const findResult = await searchResources(query, 0, 5);
  const findResources = Object.values(findResult.resources);
  steps.push({
    step: 'augment-find',
    durationMs: Date.now() - t1,
    outcome: `${findResources.length} additional resources`,
  });

  if (findResources.length === 0) {
    return { ...initial, steps };
  }

  // Step 4: re-ask with augmented context
  const t2 = Date.now();
  const contextBlock = findResources
    .map(r => `- ${r.title}: ${r.metadata?.summary ?? r.searchResultDisplay?.description ?? ''}`)
    .join('\n');

  const augmentedPrompt = {
    user: `The initial answer was thin. Additional context:\n\n${contextBlock}\n\nRe-answer the question: {question}`,
  };
  const augmented = await siteContentClient.ask(query, augmentedPrompt);
  steps.push({
    step: 're-ask',
    durationMs: Date.now() - t2,
    outcome: `${augmented.citations.length} citations after augmentation`,
  });

  // Step 5: merge citations
  const mergedCitations = dedupeById([...initial.citations, ...augmented.citations, ...findResources.map(toCitation)]);

  return {
    answer: augmented.answer,
    citations: mergedCitations,
    steps,
  };
}

function dedupeById<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  return arr.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function toCitation(r: KnowledgeResource): Citation {
  return {
    id: r.id,
    title: r.title,
    category: 'Augmented',
    excerpt: r.metadata?.summary ?? r.matchExcerpt ?? '',
    url: `/knowledge/${r.id}`,
    confidence: 0.5, // synthesised — actual confidence not available
  };
}
```

Cap retries at 1 (the wrapper above does this implicitly). Cap total latency with a `Promise.race` against a 5-second timeout if you want production-grade.

## 3. Build the side-by-side comparison page

Create `src/components/build-4/CompositeComparison.tsx`:

```tsx
import { useState } from 'react';
import { siteContentClient } from '../../lib/ragApi';
import { compositeAsk } from './CompositeRagClient';

export function CompositeComparison() {
  const [query, setQuery] = useState('');
  const [singleShot, setSingleShot] = useState<any>(null);
  const [composite, setComposite] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setSingleShot(null);
    setComposite(null);

    const [s, c] = await Promise.all([
      siteContentClient.ask(query),
      compositeAsk(query),
    ]);

    setSingleShot(s);
    setComposite(c);
    setLoading(false);
  };

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Hard query..." />
      <button onClick={run} disabled={loading}>Compare</button>

      {singleShot && composite && (
        <div className="grid grid-cols-2 gap-8 mt-8">
          <Side title="Single-shot /ask" result={singleShot} steps={null} />
          <Side title="Composite RAG" result={composite} steps={composite.steps} />
        </div>
      )}
    </div>
  );
}

function Side({ title, result, steps }: any) {
  return (
    <div>
      <h3>{title}</h3>
      {steps && (
        <ul className="text-xs mb-4">
          {steps.map((s: any, i: number) => (
            <li key={i}>{s.step}: {s.durationMs}ms — {s.outcome}</li>
          ))}
        </ul>
      )}
      <div>{result.answer}</div>
      <ul>
        {result.citations.map((c: any) => (
          <li key={c.id}>{c.title} ({(c.confidence ?? 0).toFixed(2)})</li>
        ))}
      </ul>
    </div>
  );
}
```

Wire it into a route. Test with your 5 hard queries from Step 1.

## 4. Verify the lift

For each of your 5 hard queries, score:

- Single-shot: did the answer "feel" right? Did the citations cover the question?
- Composite: same questions.

A composite answer should win on at least 3 of 5 hard queries. If it doesn't, your `CONFIDENCE_THRESHOLD` is probably wrong for your corpus — adjust between 0.5 and 0.85 and re-test.

Save the comparison results as `comparison-results.md` in this folder. Reviewers will check this.

## 5. Document the latency budget

For each of your 5 hard queries, record:

- Single-shot end-to-end time (ms).
- Composite end-to-end time (ms).
- The cost ratio (composite / single-shot).

Single-shot baseline is usually 1.5–3 seconds. Composite should be 3–6 seconds. If your composite is >8 seconds, your `searchResources` page size is too high or your KB region is wrong. Fix.

## 6. Write the composite-RAG cookbook

Create `composite-rag-cookbook.md` in this folder. Three sections:

### Recipe 1 — Retry on low citations

- When to use.
- Pseudocode.
- Real implementation reference (your `CompositeRagClient.ts`).
- Typical lift.
- Latency budget.

### Recipe 2 — Multi-pass synthesis (preview)

A one-paragraph summary; you'll implement this fully in Build 5 once the knowledge graph is available.

### Recipe 3 — Retrieve-then-rerank

A one-paragraph summary; covered in depth in the Advanced course's Build 8.

The cookbook is the asset you hand to a Tier 4 customer architect. Treat it as production-quality.

## 7. Record the demo

Three-minute screen recording:

- (0:00) "Here's a hard query against my sandbox KB."
- (0:15) Run single-shot. Show the answer + citations. Narrate: "Two citations, both low confidence. The model isn't sure."
- (0:45) Run composite. Show the pipeline visualisation (step 1, step 2, step 3, step 4). Show the final answer + augmented citations. Narrate: "Five citations, model now confident. Three of those came from the find-fallback step."
- (1:30) Repeat with two more queries. Show the lift consistently.
- (2:30) Close: "Same KB. Same model. Same code. Different pipeline. This is what composite RAG buys you in production."

Submit the recording.

## Verification checklist

- [ ] 5 hard queries identified and saved.
- [ ] `compositeAsk` wrapper implemented with retry cap + timeout budget.
- [ ] Side-by-side comparison page working.
- [ ] Lift demonstrated on at least 3 of 5 hard queries.
- [ ] Latency budget documented.
- [ ] Composite-RAG cookbook written.
- [ ] 3-minute demo recorded.

## Next

[Build 5 — Knowledge graph & data-augmentation agents](../build-5-knowledge-graph/) introduces the typed graph that unlocks Recipe 2 (multi-pass synthesis with entity expansion).
