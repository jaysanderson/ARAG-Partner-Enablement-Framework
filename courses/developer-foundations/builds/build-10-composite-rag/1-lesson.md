# Build 10 — Lesson: Composite RAG

> Read time: 10 minutes.

## Why partners learn this

Single-shot `/ask` is great until the corpus is sparse, the question is hard, or the model is wrong. Then it isn't. The customer's first complaint about your Tier 1 or Tier 2 demo will be: *"It said 'I don't have enough information' on a question we definitely had the answer for."*

Composite RAG is the answer. It's also the bridge from "RAG implementation" to "agentic system." Customers who *feel* the difference between single-shot and composite in their demo room understand why ARAG is a platform — because composite RAG is what platforms do, and what every generic-LLM-with-RAG startup cannot.

## The pattern in three words

**Generate. Evaluate. Augment.**

```typescript
// Step 1: Generate
const initial = await ragClient.ask(query);

// Step 2: Evaluate
const confident = initial.citations.length >= 3 && (initial.citations[0]?.confidence ?? 0) > 0.7;

// Step 3: Augment + re-ask (only if not confident)
if (!confident) {
  const moreContext = await searchResources(query, { page_size: 5 });
  const augmentedPrompt = {
    user: `The initial answer was thin. Additional context:\n${formatAsContext(moreContext)}\n\nRe-answer: {question}`
  };
  return await ragClient.ask(query, augmentedPrompt);
}

return initial;
```

Three steps. Cap retries at 1. That's the whole concept.

## The three named recipes

These aren't ARAG features — they're patterns partners ship. Foundations covers Recipe 1; the Advanced course (`../../../../advanced-extraction-and-retrieval-strategies/`) productionises all three.

### Recipe 1 — Retry on low citations

The one you build today.

- Generate → check citation count and top-citation confidence.
- If below threshold, fetch more context via `/find` → re-ask.
- Cap retries at 1.

Typical lift on hard queries: +20–35% answer quality (measured against a curated set).

### Recipe 2 — Multi-pass synthesis

- Initial `/ask`.
- Extract entities or topics from the answer.
- Graph-traverse from those entities (Build 8).
- Re-ask with entity-expanded context.

This is the Aurora Concierge abandoned-cart pattern. Used when the model needs to know about *related* concepts to give a good answer, not just the directly-retrieved ones.

### Recipe 3 — Retrieve-then-rerank

- `/find` returns N candidates (50+).
- A smaller LLM (or a cheap scoring function) reranks them by relevance to user intent.
- Top-K (10) passed to `/ask` via custom user template.

Useful at scale, when retrieval recall is broad and you need to add a precision filter before generation.

## When to reach for composite

**Use composite when:**

- The query is "hard" (low citation count, low confidence on single-shot).
- The customer is regulated and wrong answers are expensive (legal, healthcare, finance).
- The corpus is sparse and you need to broaden retrieval.

**Don't use composite when:**

- Single-shot already produces good answers. Composite costs 1.5–2x latency and 2x LLM tokens. Don't pay that on easy queries.
- The customer needs sub-2-second responses for every query. Composite breaks that budget.
- You'd rather build it once *agentically* — but that's a Tier 4 architecture conversation (see the Advanced course's Build 8).

## The composite-vs-agentic boundary

Customers will ask. Here's the honest answer:

| Composite RAG | True agentic |
|---|---|
| Linear pipeline of calls | Tool-using loop with reasoning between calls |
| Programmer decides the flow at write-time | Model decides the flow at run-time |
| Each step has a fixed input/output contract | Steps are selected from a tool palette |
| Failure modes: timeouts, low citations | Failure modes: tool selection, loops, hallucinated tool calls |
| Single-purpose | Multi-purpose |

Composite RAG is **programmed agency**. True agentic systems are **delegated agency**. Both have their place. Foundations stops at composite; Advanced Build 8 covers the move into true agentic.

## Latency and cost math

| Pattern | LLM round trips | `/find` calls | Typical end-to-end latency |
|---|---|---|---|
| Single-shot `/ask` | 1 | (implicit) | 1.5–3 sec |
| Composite (Recipe 1) | 2 | 1 explicit | 3–6 sec |
| Multi-pass (Recipe 2) | 2 | 0 (uses graph instead) | 4–8 sec |
| Retrieve-then-rerank (Recipe 3) | 2 | 1 + rerank LLM call | 4–7 sec |

The math: 1.5–2x latency, 2x LLM tokens, 2x cost. Justified when **the answer-quality lift is measurable** *and* **the latency stays under the UX threshold** (typically 5 seconds end-to-end for chat).

## Cap retries at 1

Naive composite — "retry if confidence still low" without a cap — loops. The model genuinely doesn't know; you keep re-asking; the latency blows up; the customer's user gives up.

**Always cap at 1 retry.** If the augmented re-ask is still thin, return what you have and let the user re-phrase the query.

## What you'll vibe-code in the walkthrough

A `compositeAsk(query)` function that:

1. Runs single-shot `/ask`.
2. Checks citation count and confidence.
3. If thin, fires `/find` for additional context.
4. Re-asks with augmented context via a custom user template.
5. Caps at 1 retry.
6. Returns the better answer plus a step-trace (what happened).

Plus a side-by-side comparison page: single-shot vs composite, for 5 hard queries from your KB. Demonstrate the lift.

## Common pitfalls

- **Composite by default.** Don't. Single-shot is faster and cheaper. Use composite when single-shot demonstrably under-performs.
- **No exit condition.** Cap at 1 retry. Always.
- **No timeout budget.** End-user latency is non-negotiable. If composite exceeds 5 seconds, return partial.
- **Not merging citations.** Both the initial and the augmented response have citations. Merge and dedupe; surface all.

## What's next

[Build 11 — Production Readiness](../build-11-production-readiness/) — residency, BYO-LLM, rate limits, observability. The conversations you have with the customer's CTO.
