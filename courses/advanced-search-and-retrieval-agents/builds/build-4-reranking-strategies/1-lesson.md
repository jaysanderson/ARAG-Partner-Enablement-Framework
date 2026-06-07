# Build 4 — Lesson: Reranking Strategies

> Read time: 12 minutes. Companion to the 9-minute [video](video-script.md).

## Why partners learn this

First-pass retrieval is fast and broad — milliseconds, broadly relevant results. Reranking is slow and precise — hundreds of milliseconds to seconds, surgical relevance. The partner who wields both correctly wins the technical bake-off against a competitor who either reranks everything (and is slow) or reranks nothing (and is sloppy).

This Build is the depth-of-mastery Build for reranking. By the end the partner has measured A/B/C numbers across three reranking configurations, an adaptive-reranking reference implementation, and a decision matrix that says *which* customer scenarios are worth which reranking spend.

## What reranking actually does

Retrieval returns the top-K resources (or paragraphs) by an initial scoring function — typically a combination of dense vector similarity + keyword scoring + filter compliance. Reranking takes that top-K and **reorders it** using a more expensive (and usually more accurate) scoring function.

The most common reranker architecture is the **cross-encoder**: a transformer that takes the query + each candidate paragraph as one input and outputs a relevance score. Cross-encoders see the full pairwise interaction; bi-encoders (the embedding model used for first-pass retrieval) see only one side at a time. Cross-encoders are slower per call but materially more precise on hard queries.

## The three reranking configurations

| Configuration | What it is | When it wins |
|---|---|---|
| **No reranking** | Return the first-pass top-K verbatim. | Fast UX, broad queries, customer is cost-sensitive. |
| **ARAG built-in reranker** | The platform's bundled reranker runs over the top-K. Fast (sub-second), platform-managed. | Most production use cases. The right default. |
| **External cross-encoder reranker** | A third-party reranker (BGE, Cohere, Voyage, etc.) wired in as a post-retrieval step. Slow (1–3 s) but state-of-the-art. | High-precision scenarios — compliance, medical, legal. Cost of being wrong is high. |

## Adaptive reranking — the partner differentiator

Reranking the entire first-pass result set is wasteful — the bottom of the list often doesn't deserve the spend. Adaptive reranking applies the expensive reranker only to the **top-K of the first pass** and returns the rest as-is.

Concretely:

- First pass returns 50 candidates.
- Top 10 get the external cross-encoder reranker.
- Bottom 40 are returned in the first-pass order.

The latency cost is amortised across the queries that actually need precision (where the top-of-list matters). The bottom-of-list shows up in fewer customer scenarios (the user usually clicks something in the top 5).

## The latency-vs-quality curve

For any reranker configuration there's a curve:

- **X-axis:** latency added per query.
- **Y-axis:** quality lift (measured by rank-of-first-correct-source, or precision@5 against a hand-labelled set).

The curve usually looks like:

```
Quality lift
   |
   |        ___________ ← diminishing returns
   |      /
   |    /
   |  /
   |/
   +───────────────── Latency added
   0    500ms   2s
```

The right operating point is where the curve flattens. For most production use cases that's ARAG built-in reranker. For high-precision use cases it's an external cross-encoder applied adaptively to the top-10.

A partner who measures this curve for the customer's specific scenarios wins the technical conversation. A partner who picks a reranker without measuring loses to a partner who didn't measure but happened to pick the same one.

## The decision matrix

The deliverable from this Build is a decision matrix that maps customer scenarios to reranking recommendations:

| Customer scenario | Recommendation | Why |
|---|---|---|
| Public chatbot, broad consumer questions | No reranking or built-in | Latency budget tight; lift on broad queries is marginal |
| Internal knowledge search, mixed-precision questions | Built-in | Sub-second cost, measurable lift on most archetypes |
| Compliance Q&A, hard multi-part questions | Adaptive external reranking on top-10 | Cost of being wrong is high; budget tolerates 1–3 s extra |
| Medical or legal research | Adaptive external reranking + recall-boosted first-pass | Same as compliance, plus the first-pass needs higher recall to make the rerank space worth it |

(The matrix you commit will have ≥ 3 scenarios drawn from your actual customer pipeline.)

## What you'll do in the walkthrough

1. Extend Build 1's harness with the three reranking configurations.
2. Measure latency + quality lift per configuration.
3. Implement adaptive reranking.
4. Build the decision matrix.
5. Publish the latency-vs-quality curve as a chart.

## Reference reading

- **[`/ask` parameter reference §7 — Retrieval-mode control](../../assets/ask-parameter-reference.md#7-retrieval-mode-control)** — `top_k`, `min_score`, `features` (the levers that feed reranking).
- **[`/ask` parameter reference §8 — Rank fusion & reranking](../../assets/ask-parameter-reference.md#8-rank-fusion--reranking)** — `rank_fusion` (default `"rrf"`) + `reranker` (default `"predict"`, with `"noop"` for adaptive-rerank setups) — the exact parameter shapes for the A/B/C measurement work.
- **[`/ask` parameter reference §21 — Generate answer toggle](../../assets/ask-parameter-reference.md#21-generate-answer-toggle)** — `generate_answer: false` isolates retrieval-quality measurement from LLM cost during the A/B/C runs.
- BGE reranker, Cohere reranker, Voyage reranker — comparison surveys on arxiv.
- Sibling course: [Advanced E&RS — Build 3 (Hybrid Retrieval Tuning)](../../../advanced-extraction-and-retrieval-strategies/builds/build-3-hybrid-retrieval-tuning/) — complementary measurement framing.
