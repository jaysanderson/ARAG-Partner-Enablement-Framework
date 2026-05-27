# Build 4 — Lesson: Composite RAG (the on-ramp to agentic)

> Estimated reading time: 25 minutes. Read this before starting the [walkthrough](walkthrough.md). Requires passing Build 3.

## Why partners learn this

Single-shot `/ask` is great until the corpus is sparse, the question is hard, or the model is wrong. Then it isn't. The customer's first complaint about your Tier 1 or Tier 2 demo will be: *"It said 'I don't have enough information' on a question we definitely had the answer for."*

Composite RAG is the answer. It's also the bridge from "RAG implementation" to "agentic system." Customers who feel the difference between single-shot and composite in their demo room *understand* why ARAG is a platform — because composite RAG is what platforms do, and what every "generic LLM with RAG" startup cannot.

Build 4 ships the on-ramp. The Advanced course's Build 8 productionises it with three named recipes, observability, and cost analysis. Foundations Build 4 = "you know the pattern." Advanced Build 8 = "you can defend it in a customer's CTO meeting."

## The pattern, in three words

**Generate. Evaluate. Augment.**

In code:

```typescript
// Step 1: Generate
const initial = await ragClient.ask(query);

// Step 2: Evaluate
const confident = initial.citations.length >= 3 && initial.citations[0].confidence > 0.7;

// Step 3: Augment + re-ask (only if not confident)
if (!confident) {
  const additional = await searchResources(query, 0, 5);
  const augmentedContext = formatAsContext(additional);
  return await ragClient.ask(query, {
    user: `Existing answer was thin. Additional context:\n${augmentedContext}\n\nRe-answer: {question}`,
  });
}

return initial;
```

That's it. The whole "composite RAG" concept is *retry with more retrieval when the first answer is shaky.* Everything else — multi-pass synthesis, retrieve-then-rerank, graph-traversal-augmentation — is variations on that theme.

## Where the Sample ARAG App does this

The cleanest live example is `src/components/certification/ExamStudyPanel.tsx:35-115`. The pattern:

1. The user just failed an exam.
2. Stream a personalized study guide via `memberKnowledgeClient.stream(studyQuery)`.
3. **If the stream completes with zero citations**, fall back: call `searchResources(searchQuery, 0, 5)` to find related material directly, then synthesise pseudo-citations from the `KnowledgeResource` objects.

Read the file end-to-end. That's the canonical retry-on-low-citations recipe.

## The three named recipes

These aren't ARAG features. They're partner-shipped patterns. Three are common enough to standardise on; Advanced Build 8 will go deeper.

### Recipe 1 — Retry on low citations

The simplest one. The exam-study-panel pattern above.

- Generate.
- Count citations / check top-citation confidence.
- If below threshold, fetch more context via `/find` directly.
- Re-ask with the augmented context.

Typical lift in production: +20–35% on "hard query" subsets (queries that scored low on the Build 1 eval harness from Advanced course).

### Recipe 2 — Multi-pass synthesis

The Aurora Concierge capstone's `/abandoned-cart` flow is the canonical example.

1. Initial `/ask`: "Sara abandoned her cart with the TerraTrek 7. What should we send her?"
2. Extract entities from the answer + cart context: TerraTrek 7, Weekend Adventurer segment, NA region.
3. Graph-traverse from those entities: TerraTrek 7 → `pairs_with` → Skyline 45L; TerraTrek 7 → `featured_in` → Mara's Tasmania guide.
4. Re-ask with the entity-expanded context: now the model has cross-sells and ambassador content to use.

Multi-pass synthesis is where composite RAG starts to feel *agentic*. The model isn't just doing retrieval-augmented generation — it's making *decisions* about what additional context to pull.

### Recipe 3 — Retrieve-then-rerank

The default ARAG pipeline does retrieval, then generates. For some queries (especially ones with thousands of nominally-relevant resources), the retrieval pool is too broad and the model picks unevenly.

The recipe:

1. `/find` returns N candidates (e.g., 50).
2. A smaller LLM (or a cheap scoring function) reranks the candidates by relevance to the user's intent.
3. The top-K (e.g., 10) get passed to `/ask` via custom user template.

This recipe trades latency (one extra LLM call) for retrieval precision. Useful at scale.

## Three patterns matter; the rest are variations

Don't get fancy. Don't invent your own. The three recipes above cover 90% of customer needs. The Advanced course's Build 8 has the formal taxonomy; Foundations Build 4 teaches you to recognize and ship Recipe 1.

## The agentic boundary

When does "composite RAG" cross into "agentic"? You'll be asked this in customer meetings. Here's the honest answer:

| Composite RAG | Agentic |
|---|---|
| Linear pipeline of calls | Tool-using loop with reasoning between calls |
| Programmer decides the flow at write-time | Model decides the flow at run-time |
| Each step has a fixed input/output contract | Steps are selected from a tool palette |
| Failure modes: timeouts, low-citation results | Failure modes: tool selection, infinite loops, hallucinated tool calls |
| Single-purpose | Multi-purpose |

Composite RAG is *programmed agency*. True agentic systems are *delegated agency*. Both have their place. Foundations stays in composite-RAG territory. Advanced Build 8 covers where the boundary moves.

## Latency and cost trade-offs

Single-shot `/ask`: 1 LLM round-trip, ~1.5–3 seconds end-to-end.
Composite RAG (Recipe 1): up to 2 LLM round-trips + 1 `/find`, ~3–6 seconds.
Multi-pass synthesis (Recipe 2): 2 LLM round-trips + graph queries, ~4–8 seconds.

The math:

- 2x the LLM tokens per query (sometimes 3x).
- 1.5–2x the end-user latency.
- 2x the per-query API cost.

When is that justified? When the answer quality lift is measurable and the user-perceived latency stays under your UX threshold. Build 1 of the Advanced course will give you the eval harness to prove it. Foundations Build 4 teaches you to *recognise* when to reach for composite — typically: hard queries, regulated industries where wrong answers are expensive, high-stakes use cases.

## Common pitfalls in Build 4

1. **Composite-by-default.** Don't. Single-shot is faster and cheaper. Use composite when single-shot demonstrably under-performs.
2. **No exit condition on the retry.** A naive "re-ask if confidence < X" can loop forever if the corpus genuinely doesn't have the answer. Cap retries at 1.
3. **No timeout budget.** End-user latency is non-negotiable. If your composite pipeline exceeds (say) 5 seconds, return the partial answer with a "still searching..." UI affordance, not silence.
4. **Forgetting to merge citation lists.** When you augment with `/find` and re-ask, both the original `/ask` citations and the `/find` results are relevant. Merge them, dedupe by resource id, return all to the user.
5. **Inventing pseudo-citations that aren't real.** When falling back from `/find`, the resources you found *are* citations — surface them as such. Don't fabricate URLs the model might have mentioned.

## What you'll build in the walkthrough

A working Recipe 1 implementation against your sandbox KB:

- A composite-RAG wrapper that calls `/ask`, evaluates the response, falls back to `/find` + re-ask if citations are thin.
- A side-by-side comparison page: single-shot answer vs composite answer, for the same 5 hard queries.
- A short markdown cookbook (`composite-rag-cookbook.md`) explaining when to reach for composite and how to scope it for customers.

## Onward

[Build 5 — Knowledge graph & data-augmentation agents](../build-5-knowledge-graph/) is next. The graph is the structured-knowledge layer that makes multi-pass synthesis (Recipe 2) interesting in customer demos.
