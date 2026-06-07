# Build 4 — Walkthrough: Reranking Strategies

> Estimated time: 12–16 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

- An **A/B/C reranking comparison** with measured latency + quality lift.
- An **adaptive-reranking implementation** that reranks only the top-K of the first pass.
- A **latency-vs-quality curve** chart.
- A **decision matrix** mapping customer scenarios to reranking recommendations.

## Step 1 — Extend Build 1's harness with reranking axes (3 hours)

Your harness already runs queries through `/find` and captures the result set. Add three configurations:

- **Config A: No reranking.** First-pass top-K returned as-is.
- **Config B: Built-in reranking.** Pass `reranker: "default"` (or whatever ARAG calls it) on the `/find` request.
- **Config C: External reranking.** Take the first-pass top-K, send each (query, candidate) pair to an external cross-encoder, re-sort by the cross-encoder's score.

For Config C, pick one external reranker. BGE-reranker-large is a good free choice; Cohere or Voyage if you have a tenant. Wire it via HTTP.

## Step 2 — Run the A/B/C against Build 2's tagged query set (2 hours)

Use Build 1's 12 queries + the additional queries Build 2 added. Run each through all three configurations.

For each query × configuration, capture:

- Wall-clock latency (added vs no-rerank baseline).
- Result-set ordering (the top-10 resource IDs).

## Step 3 — Measure quality lift (3 hours)

Quality lift = rank improvement of hand-labelled correct sources.

For each query, find where its hand-labelled correct source lands in each configuration:

| Query | No rerank | Built-in | External |
|---|---|---|---|
| Q1 | rank 1 | rank 1 | rank 1 |
| Q2 | rank 4 | rank 2 | rank 1 |
| Q3 | rank 8 | rank 3 | rank 1 |

Aggregate per archetype + overall:

| Archetype | Median rank, no rerank | Built-in | External |
|---|---|---|---|
| factoid | 1.2 | 1.1 | 1.0 |
| conceptual | 3.4 | 2.1 | 1.4 |
| hard multi-part | 5.8 | 3.7 | 1.9 |

Commit to `quality-lift-table.md`.

## Step 4 — Plot the latency-vs-quality curve (1 hour)

X-axis: median latency added (ms). Y-axis: median rank improvement.

Three points: no rerank (origin), built-in, external. Draw the curve.

The shape almost always shows diminishing returns. Built-in captures ~70-80% of external's lift at ~10% of the latency cost.

Save the chart as `latency-vs-quality.png` (Mermaid, gnuplot, matplotlib, your tool of choice).

## Step 5 — Implement adaptive reranking (2 hours)

Adaptive reranking applies the expensive reranker only to the top-K of the first pass. Pseudo-code:

```typescript
async function adaptiveRerank(
  query: string,
  firstPassResults: Result[],
  topK: number = 10,
): Promise<Result[]> {
  const top = firstPassResults.slice(0, topK);
  const rest = firstPassResults.slice(topK);

  const reranked = await externalRerank(query, top);

  return [...reranked, ...rest];
}
```

Wire this into Build 1's harness as a fourth configuration. Measure latency + quality lift the same way.

The expected result: adaptive captures ~90% of full-external's quality lift at ~30% of the latency cost. Commit the numbers to `adaptive-results.md`.

## Step 6 — Build the decision matrix (2 hours)

Pick 3+ customer scenarios from your current pipeline. For each, decide which reranking configuration is right based on the measured numbers + the customer's latency / cost budget.

| Scenario | Customer budget | Recommended config | Why |
|---|---|---|---|
| Public-facing chatbot, 500 ms p95 latency budget | $0.005/query target | Built-in | Latency budget rules out external; adaptive's 30% overhead is borderline |
| Internal compliance search, 5 s p95 budget | $0.10/query tolerable | Adaptive external (top-10) | Compliance Q&A rewards precision; the budget accommodates it |
| Knowledge browser, 1 s p95 budget | $0.01/query target | Built-in | Mixed-archetype use case, built-in captures most of the lift |

Commit to `decision-matrix.md` and copy to the course-level `../../assets/`.

## Step 7 — Defence rehearsal (45 min)

Walk through the decision matrix against a fourth customer scenario distinct from the three you used. Record the rehearsal.

## Pass-rubric self-check

- [ ] A/B/C comparison with measured latency + quality lift in `quality-lift-table.md`.
- [ ] Adaptive reranking implementation working, results in `adaptive-results.md`.
- [ ] Latency-vs-quality curve published as `latency-vs-quality.png`.
- [ ] Decision matrix with 3+ scenario rows in `decision-matrix.md`.
- [ ] Asset copied to `../../assets/reranking-decision-matrix.md`.

## Getting unstuck

**External reranker latency variance is huge.** Run each cross-encoder call 3× and take the median. Cold-start latency is the source of the variance.

**Quality lift is negative on factoid queries.** First-pass already has the right answer at rank 1; reranking is shuffling without improving. Document this in the decision matrix — *"skip reranking on factoid-dominated workloads."*

**Adaptive K=10 is too coarse.** Try K=5 and K=20. The right K depends on how often the correct answer is below position 10 in the first pass. Hand-label more queries to find out.

---

## Next

[Build 5 — Multi-Turn Conversational Retrieval](../build-5-multi-turn-conversational-retrieval/).
