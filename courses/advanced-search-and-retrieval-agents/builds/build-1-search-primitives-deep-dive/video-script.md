# Video Script — Build 1: Search Primitives Deep Dive

> **Duration target:** 12 minutes
> **Format:** Screen recording + voiceover. Mix of slide content + live harness run.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Advanced Search & Retrieval Agents · Build 1 · Search Primitives Deep Dive."*

**VOICEOVER:**
> Twelve minutes. By the end of this video you'll know which primitive to reach for in every customer scenario you'll see this quarter, and you'll have a measured trade-off matrix to defend the choice in any scoping conversation.

## Section 1: Why partners over-reach for /ask (0:30 – 2:00)

**ON SCREEN:** Bar chart: across 100 partner-delivered ARAG surfaces, 78% used `/ask` as the primary primitive. 4% used the Retrieval Agent. The rest split across `/find`, `/search`, `/predict/chat`.

**VOICEOVER:**
> Foundations introduced `/ask` first because it's the most teachable. The unintended consequence: most partners now reach for `/ask` first in production. The result is over-specced, expensive surfaces. And under-reaching for the agent endpoint when the question needs decomposition.
>
> This Build fixes both ends of that. Measured trade-off matrix. Defensible selection flowchart. No instincts.

## Section 2: The five primitives, in one slide each (2:00 – 6:00)

**ON SCREEN:** One slide per primitive. Each has a *"reach for it when / don't when"* split.

**VOICEOVER:**
> /find. Retrieval-only. No LLM. Reach for it when the UX is a list. Don't reach for it when the user asked a question expecting a sentence.
>
> /ask. Grounded generation with citations. Sync mode for server-to-server pipelines; streaming for human-watching UX. Reach for it when the question fits in one paragraph. Don't reach when the question is multi-part — that's an agent.
>
> /search. Catalog-style retrieval with rich per-resource metadata. Reach for it when the renderer is a catalog. Don't when the user wants prose.
>
> /predict/chat. Conversational, multi-turn, platform-managed state. Reach for it when each turn is single-shot but follow-ups are expected. Don't when any single turn needs decomposition.
>
> Retrieval Agent. A different category. Plan, execute sub-queries, merge, synthesise. Reach for it when the question is multi-part, the output needs structure, or the customer wants explainability. Don't when single-shot `/ask` fits.

## Section 3: The trade-off matrix (6:00 – 8:30)

**ON SCREEN:** Live shot of the harness's results CSV. Highlight the cost column, the latency column, the citation-density column.

**VOICEOVER:**
> The matrix has five dimensions. Cost per call. Latency p50 and p95. Citation density. Structured-output support. Conversational state.
>
> Notice the numbers. /find: cents-and-tenths-of-cents, sub-second. /ask sync: under a cent, 2 to 5 seconds. Agent: ten to twenty cents, 10 to 30 seconds. That spread is not subtle. A customer scenario answered by /ask doesn't get answered by an agent — it gets answered fifty times more expensively, with worse latency.
>
> That spread is your scoping defence. *"Why /ask and not the agent?"* — point at the matrix.

## Section 4: The selection flowchart (8:30 – 10:30)

**ON SCREEN:** Selection flowchart, animated branch-by-branch.

**VOICEOVER:**
> The flowchart starts with: does the user expect a sentence-grade answer? If no, does the user expect a filterable list — with rich metadata? /search. Just a ranked list? /find.
>
> If yes — sentence-grade answer expected — does the question need decomposition? Agent. Conversational? /predict/chat. Otherwise /ask, streaming if a human is watching, sync if a pipeline is.
>
> Eight branches at minimum. The full flowchart in your workspace will have twelve. Every customer scenario in your pipeline should resolve to a branch in under thirty seconds.

## Section 5: Defending the choice (10:30 – 11:30)

**ON SCREEN:** Slide showing the structure of a defence: *"customer scenario → flowchart branch → matrix-backed reason."*

**VOICEOVER:**
> Three customer scenarios. Each one is a defence rehearsal.
>
> *"Customer wants a chatbot answering policy questions."* Flowchart: sentence-grade yes, decomposition no, conversational yes. /predict/chat. Matrix: at 2 to 5 seconds and under a cent per turn, the budget closes.
>
> *"Customer wants a compliance-question answering surface."* Flowchart: sentence-grade yes, decomposition yes. Agent. Matrix: 10-30 second latency is fine because the alternative is the analyst spending forty minutes by hand.
>
> *"Customer wants instant search on a 50k-document repository."* Flowchart: sentence-grade no, ranked list yes. /find. Matrix: sub-second p95 is what makes the UX work.
>
> Three customer scenarios. Three matrix-backed defences. That's the cert bar.

## Close (11:30 – 12:00)

**ON SCREEN:** End card with the next-Build pointer.

**VOICEOVER:**
> Build 1 ships the harness, the matrix, the flowchart. Build 2 starts measuring lift against the matrix — query rephrasing is the first lever. See you there.
