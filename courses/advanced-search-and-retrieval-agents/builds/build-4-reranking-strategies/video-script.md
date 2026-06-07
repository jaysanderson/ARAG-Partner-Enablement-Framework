# Video Script — Build 4: Reranking Strategies

> **Duration target:** 9 minutes

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Build 4 · Reranking Strategies."*

**VOICEOVER:**
> Nine minutes. Reranking is the lever most partners under-spec or over-spec. By the end of this video you'll have a measured latency-vs-quality curve, an adaptive-reranking pattern, and the decision matrix to recommend the right configuration for any customer scenario.

## Section 1: Cross-encoders vs bi-encoders (0:30 – 2:00)

**ON SCREEN:** Diagram contrasting bi-encoder (two separate embeddings) vs cross-encoder (single pairwise input).

**VOICEOVER:**
> Bi-encoder retrieval — the first pass — embeds the query and each candidate separately, then takes the dot product. Fast. Bulk-friendly. Less precise on hard queries.
>
> Cross-encoder reranking takes query plus candidate as one input. Sees the full pairwise interaction. Slower. Materially more precise.
>
> Reranking is the pattern of running cross-encoder on the top-K of bi-encoder. You buy precision with latency.

## Section 2: The three configurations (2:00 – 4:00)

**ON SCREEN:** Three-row table — no reranking, built-in, external cross-encoder.

**VOICEOVER:**
> Three configurations. None — return first-pass verbatim. Built-in — ARAG's bundled reranker, sub-second, platform-managed. External — third-party cross-encoder wired as a post-retrieval step, one to three seconds.
>
> The right answer for most production use cases is built-in. The right answer for high-precision compliance and medical workloads is external, applied adaptively.

## Section 3: Adaptive reranking (4:00 – 6:00)

**ON SCREEN:** Diagram showing first-pass top-50 → external reranker on top-10 → return.

**VOICEOVER:**
> Adaptive reranking applies the expensive reranker only to the top-K of the first pass. The bottom of the list is returned as-is.
>
> Why does this work? Because customers click in the top-five. Spend reranking budget on positions one through ten; don't spend it on positions twenty through fifty.
>
> The result is roughly ninety percent of external's quality lift at thirty percent of the latency cost. That's a partner differentiator the customer recognises immediately.

## Section 4: The curve and the matrix (6:00 – 8:00)

**ON SCREEN:** Live shot of the latency-vs-quality curve chart. Then the decision matrix with three scenario rows.

**VOICEOVER:**
> The curve has diminishing returns. Built-in captures most of the available lift. External squeezes out the rest at material latency cost. Adaptive is the inflection.
>
> The decision matrix is your customer-conversation defence. Public chatbot, latency-tight: built-in. Compliance Q&A, precision-critical: adaptive external. Knowledge browser, mixed: built-in.

## Close (8:00 – 9:00)

**VOICEOVER:**
> Build 4 ships the curve, the adaptive implementation, the decision matrix. Build 5 brings multi-turn conversational state on top of all of this. See you there.
