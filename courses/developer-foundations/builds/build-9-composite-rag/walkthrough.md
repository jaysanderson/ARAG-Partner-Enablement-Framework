# Build 9 — Walkthrough: Composite RAG

> Estimated time: 2.5 hours focused. Read the [lesson](lesson.md) first.

## Goal

A working `compositeAsk` function in your project. A side-by-side comparison page showing single-shot vs composite for 5 hard queries. Measurable lift in citation count or answer quality on at least 3 of the 5.

## 1. Identify 5 hard queries (20 min)

In your existing chat, ask 10–15 queries. For each, note:

- Did the answer return ≥ 3 citations?
- Did the answer say "I don't have enough information" when the corpus actually had something?
- Was the answer vague when you expected detail?

Pick 5 that scored worst. Save as `hard-queries.md` — one query per line with a brief note on why each was thin.

## 2. Vibe-code the `compositeAsk` function (45 min)

Brief your AI:

```
In src/lib/compositeRag.ts, export:

async function compositeAsk(query: string): Promise<{
  answer: string;
  citations: Array<{ id: string; title: string; confidence: number }>;
  steps: Array<{ step: string; durationMs: number; outcome: string }>;
}>

Logic:

Step 1 — Initial /ask. Standard sync mode. Capture citations + top confidence.
Step 2 — Evaluate: confident = (citations.length >= 3 && topConfidence >= 0.7).
Step 3 — If confident, return the initial result with steps logged.
Step 4 — If not confident, fire POST /find with the same query, page_size=5.
Step 5 — Format the find results as a context block (titles + first 200 chars
         of each top paragraph).
Step 6 — Re-ask /ask with a custom user template:
         "The initial answer was thin. Additional context:\n<context block>\n\nRe-answer: {question}"
Step 7 — Merge citations from both responses, dedupe by id.
Step 8 — Return augmented answer + merged citations + steps log.

Cap retries at 1. Add a 5-second timeout on the whole pipeline; if exceeded,
return whatever has been received so far.

Each step in the steps array should record: {step: "initial-ask"|"find"|"re-ask",
durationMs, outcome: brief description}.
```

Save prompt as `prompt-log.md`. Read the AI's code. Test by calling it once from a Node script before wiring to the UI.

## 3. Build the comparison page (45 min)

Brief the AI:

```
Create src/pages/CompositeComparison.tsx. It:

1. Has a query input.
2. On submit, fires TWO calls in parallel — ragClient.ask(query) (single-shot)
   AND compositeAsk(query).
3. Shows side-by-side panels:
   - Left: "Single-shot" — the answer + citations + total response time.
   - Right: "Composite" — the answer + steps log (with durations) + merged
     citations + total response time.
4. Below the panels, a small bar chart: citation count comparison (left vs right).

Tailwind. TypeScript. Wire into the app's router at /composite-compare.
```

Run the dev server. Test with each of your 5 hard queries.

## 4. Measure lift (20 min)

For each of your 5 hard queries:

- Single-shot citation count vs composite citation count.
- Did the composite answer feel measurably better? (1–5 reviewer score.)
- Latency difference (composite should be 2–4 seconds slower than single-shot).

Save results in `comparison-results.md`. The composite should win on at least 3 of 5. If it doesn't, your confidence threshold is wrong — try lowering it from 0.7 to 0.6 or raising the citation count from 3 to 2.

## 5. Tune the threshold (10 min)

If composite is firing too often (running on every query), raise the bar — make `confident` harder to achieve. If it's not firing when it should (the model says "I don't have enough information" but composite isn't triggering), lower the bar.

Document the final threshold in `tuning.md` with your reasoning. This is the per-customer tuning the partner does during POC.

## 6. Record 3-minute demo (15 min)

1. (30 sec) "Most RAG vendors stop at single-shot. Watch the lift on hard queries."
2. (60 sec) Run query 1 in the comparison page. Show single-shot returns 1 citation, low confidence. Composite ran 3 steps, returns 5 citations, better answer.
3. (60 sec) Repeat for query 2 and 3.
4. (15 sec) Show the steps panel — `initial-ask` (650ms) → `find` (200ms) → `re-ask` (1850ms). Total: 2.7s vs 1.4s for single-shot.
5. (15 sec) "2x the LLM cost. Justified when single-shot is failing. This is the on-ramp to true agentic — Tier 4 conversation opens here."

Upload to `#build-clinic-submissions`.

## Verification checklist

- [ ] `hard-queries.md` with 5 queries + notes.
- [ ] `compositeRag.ts` with retry-on-low-citations + timeout + step logging.
- [ ] Side-by-side comparison page deployed.
- [ ] Composite wins on ≥ 3 of 5 hard queries.
- [ ] Threshold tuned and documented in `tuning.md`.
- [ ] `prompt-log.md` saved.
- [ ] 3-minute demo recorded.

## Next

[Build 10 — Production Readiness](../build-10-production-readiness/) — residency, BYO-LLM, rate limits, observability. The CTO-meeting language.
