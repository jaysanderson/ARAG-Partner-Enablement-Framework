# Video Script — Build 9: Composite RAG

> **Duration target:** 10 minutes
> **Format:** Screen recording + voiceover. Live build with side-by-side comparison demo.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 9 · Composite RAG."* Subtitle: *"The on-ramp to agentic."*

**VOICEOVER:**
> Ten minutes. By the end you'll have a composite-RAG pipeline running against your KB, a side-by-side comparison page showing single-shot vs composite, and a clear answer to the CTO question "where does composite RAG end and true agentic begin?" Let's go.

## Section 1: The three-word pattern (0:30 – 1:30)

**ON SCREEN:** Slide: *"GENERATE → EVALUATE → AUGMENT."* Below, a small flow diagram — `/ask` arrow `if low confidence` arrow `/find` arrow re-`/ask` arrow `merged answer`.

**VOICEOVER:**
> Three words. Generate — run the standard `/ask`. Evaluate — check the citations. Are there enough? Is the top one confident? Augment — if not, fire `/find` to broaden retrieval, re-ask with the new context.
>
> That's the whole pattern. Cap retries at one. Always.

## Section 2: When to use it (1:30 – 2:30)

**ON SCREEN:** Two columns. Left: "USE COMPOSITE WHEN — hard queries / regulated industries / sparse corpus." Right: "DON'T WHEN — single-shot already works / latency budget below 2 sec / agentic would be better."

**VOICEOVER:**
> When to reach for composite. Hard queries — where single-shot returns thin citations or "I don't know." Regulated industries — where wrong answers cost more than tokens. Sparse corpora — where broadening retrieval might find what single-shot missed.
>
> When NOT to — easy queries, tight latency budgets, or scenarios where you'd build it once agentically instead of programming the flow.

## Section 3: Vibe-code the composite function (2:30 – 4:30)

**ON SCREEN:** Claude Code. Paste the `compositeAsk` brief from the walkthrough. AI generates `src/lib/compositeRag.ts`. Fast-forward. Open the finished file. Highlight (1) the confidence-check evaluator, (2) the augmented user template, (3) the 1-retry cap, (4) the timeout, (5) the steps log.

**VOICEOVER:**
> Vibe-code the pipeline. Initial `/ask`, confidence evaluator, conditional `/find`, augmented re-ask, merged citations, step logging, timeout, retry cap. Sixty seconds of generation.
>
> Five things to verify in the code. Confidence check — yes, three citations and top score above point seven. Augmented user template — references the new context inline. Retry cap — only one re-ask, no recursion. Timeout — five-second budget on the whole pipeline. Step log — every step records its duration so you can debug.

## Section 4: Build the comparison UI (4:30 – 6:00)

**ON SCREEN:** Claude Code. Paste the comparison-page brief. AI generates `CompositeComparison.tsx`. Fast-forward. Open the page in the browser.

**VOICEOVER:**
> Comparison UI. Two panels — single-shot on the left, composite on the right. Bar chart of citation counts. Step log on the composite side showing what happened.

## Section 5: Live A/B on hard queries (6:00 – 8:30)

**ON SCREEN:** Browser. Type a known-hard query (one of the 5 from your `hard-queries.md`). Watch both panels populate. Left panel: 1 citation, generic answer, 1.2 seconds. Right panel: 3 steps in the log (initial-ask → find → re-ask), 5 citations, much better answer, 2.8 seconds total.

Repeat with two more hard queries. Show consistent lift.

**VOICEOVER:**
> Live demo. Query one — single-shot returns one citation and a vague answer. The model wasn't sure. Composite ran three steps. Initial-ask, came back thin. Find, fetched five more candidates. Re-ask with augmented context. Final answer — five citations, specific recommendations.
>
> Query two — same pattern. Query three — same pattern. Three for three.
>
> Latency cost — composite is 2x. Token cost — composite is roughly 2x. Justified on hard queries. *Not* justified on easy ones — which is why the confidence check matters; on easy queries the pipeline exits at step 2 and you only pay single-shot cost.

## Section 6: The agentic boundary (8:30 – 9:30)

**ON SCREEN:** Two columns. Left: "COMPOSITE RAG — programmer decides the flow at write-time." Right: "AGENTIC — model decides at run-time from a tool palette."

**VOICEOVER:**
> The question every CTO asks: *where does composite end and agentic begin?*
>
> Composite RAG — *you* decide what happens. Initial ask. Check citations. Either return or augment. Three steps, written in code, deterministic.
>
> Agentic — the *model* decides. Given a query and a tool palette — find, ask, graph, summarise — the model picks which tool to call next based on what it's seen so far. Non-deterministic. More powerful. Also harder to debug.
>
> Foundations stops at composite. The Advanced course's Build 8 covers true agentic — when to design that way, how to constrain the model so it doesn't loop, what observability you need.

## Wrap (9:30 – 10:00)

**ON SCREEN:** End card. *"Build 10 — Production Readiness. Next."*

**VOICEOVER:**
> Build 10 is the production-grade conversation — residency, BYO-LLM, rate limits, observability. The language you use when the customer's CTO joins the meeting in week three of the POC. Ten minutes. See you there.

---

## Production notes

- **Side-by-side comparison demo (Section 5):** the visual lift between the two panels is the headline. Make sure both panels are visible simultaneously — not in tabs. Highlight the citation count difference with a small visual cue.
- **Step log:** show it briefly but clearly. Partners need to see that composite is observable, not magic.
- **Section 6 (agentic boundary):** keep the slide minimal. This is the conceptual close — don't overstuff it.
