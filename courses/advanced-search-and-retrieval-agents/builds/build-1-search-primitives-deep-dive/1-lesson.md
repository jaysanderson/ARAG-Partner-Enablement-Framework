# Build 1 — Lesson: Search Primitives Deep Dive

> Read time: 18 minutes. Companion to the 12-minute [video](video-script.md).
>
> This is the conceptual foundation for the whole course. If the partner cannot tell you which primitive to reach for in any given customer scenario, every later Build's lever is wasted. Take the time.

## Why partners learn this

Most partner-delivered ARAG solutions in the field today over-reach for `/ask` because that's the primitive Foundations Build 0 introduces first. The result is slow, expensive grounded-answer surfaces wired into use cases that wanted a fast filterable list. The result is also under-reaches for the Retrieval Agent endpoint because most partners don't internalise that it's a different *category* of primitive, not just a heavier `/ask`. The result there is hand-rolled orchestration on top of `/ask` that a competitor replaces with two lines of agent config.

This Build is the cure. By the end of it the partner has a measured trade-off matrix, a selection flowchart, and the discipline to defend their primitive choice in any customer scoping conversation.

## The five primitives, deep

Foundations Build 1 named the five. This lesson goes through what each is *actually* good and bad at.

### `/find` — retrieval-only, no LLM

`/find` returns a ranked list of resources (and paragraphs) that match the query. No generated answer. No LLM cost. Latency is dominated by vector + keyword search, typically 100–400 ms p50.

**Reach for it when:**

- The UX is search-as-you-type / instant search.
- The user expects a list, not an answer.
- The downstream surface renders cards or rows, not prose.
- Cost budgets per query are sub-cent.
- The customer's product is filter-heavy (e-commerce catalogue, document repository, knowledge browser).

**Don't reach for it when:**

- The user asked a question expecting a sentence-grade answer.
- The customer wants citations *and* a synthesised summary in one round-trip.

### `/ask` — grounded generation, with citations

`/ask` runs retrieval, sends the retrieved context to the LLM, and returns a synthesised answer with citation pointers. Sync mode returns the full response in one POST; streaming mode trickles tokens as the LLM produces them.

**Reach for it when:**

- The user asked a question.
- The right surface is a single grounded answer with explicit sources.
- Latency budget is 2–6 seconds (sync) or perceived-instant via streaming.
- Cost budget is single-digit cents per query.
- The structured-output need is low (the answer is prose, not JSON).

**Don't reach for it when:**

- The question is multi-part and needs decomposition (use an agent).
- The user wants a filtered list, not a synthesised answer (use `/find`).
- The customer is paying per-token and the question is repeatable enough to cache the answer outside ARAG.

**Sync vs streaming sub-choice:** Sync is correct when the downstream system needs the full response before doing anything (server-to-server pipelines, batch generation, structured-output post-processing). Streaming is correct when a human is watching and the perceived latency is the product. The cost is identical; the choice is purely UX.

### `/search` — catalog-style filterable retrieval

`/search` is `/find`'s richer cousin. It returns the same ranked resource set plus richer per-resource metadata — labels, custom fields, summaries, classifications — packaged for a catalog renderer. Most partners conflate it with `/find`; the differentiator is *the metadata payload shape*.

**Reach for it when:**

- The UX is a filterable catalog (product cards, document browser, media library).
- The renderer needs per-resource labels and custom fields without a second roundtrip.
- The customer's product is sales catalogue / knowledge library / media archive.

**Don't reach for it when:**

- The user asked a question (`/ask` or agent).
- The product is a chat surface (`/predict/chat` or agent).

### `/predict/chat` — conversational, multi-turn

`/predict/chat` is a chat-shaped retrieval primitive. It manages conversation state, accepts a turn at a time, and returns a grounded answer with citations. Crucially, it manages the rolling context window for the partner — the conversation history is in the platform's hands, not the partner's.

**Reach for it when:**

- The UX is a conversational surface.
- Follow-ups are expected.
- The customer wants pronoun resolution and topic continuity out of the box.
- The partner doesn't want to build conversation-state plumbing (the platform does it).

**Don't reach for it when:**

- The use case is one-shot — a single question with no follow-ups expected.
- The customer wants to own the conversation state (multi-channel routing, server-side analytics on conversation graphs, etc.).
- The question is hard enough that decomposition is required — an agent is a better fit even in a chat-shaped UI.

### Retrieval Agent — decomposed, multi-step

The Retrieval Agent endpoint is a *category* shift. It accepts a natural-language brief (the agent's system prompt) plus a structured output schema, and runs a multi-step loop: plan → execute sub-queries → merge → synthesise. It can call custom tools. It can be instrumented with cost and latency budgets. It can be traced step-by-step.

**Reach for it when:**

- The question requires decomposition. *"Is X compliant with Y in jurisdiction Z given last quarter's amendment?"* will never be answered correctly by a single retrieval pass.
- The output needs to be structured (JSON / typed).
- The customer wants explainability — *"show me what the agent did to get this answer."*
- The use case is research, compliance, multi-criteria recommendation, or any multi-part workflow.

**Don't reach for it when:**

- The question is single-shot and the answer fits in one paragraph (use `/ask`).
- The latency budget is sub-second (agents are 5–30 s).
- The cost budget is sub-cent (agents are 5–50× the cost of `/ask`).

## The five trade-off dimensions

When you build the comparison harness in the walkthrough, you'll measure each primitive against five dimensions:

| Dimension | What it measures |
|---|---|
| **Cost per call** | LLM tokens + retrieval + reranking, in cents. Median across the test set. |
| **Latency p50 / p95** | Wall-clock time from POST to last byte. p50 is *"how does it feel"*; p95 is *"what's the worst it'll feel."* |
| **Citation density** | Number of distinct cited sources per response, normalised by response length. Tells you how well-grounded the output is. |
| **Structured-output support** | Does the primitive natively produce typed JSON? `/find` and `/search` yes; `/ask` no (prose); agent yes (schema-constrained). |
| **Conversational state** | Does the primitive manage rolling context? `/predict/chat` yes; agent in conversational mode yes; everything else no. |

A measured matrix across these five dimensions is your defence in any customer scoping conversation. *"Why agent and not /ask?"* — point at the matrix.

## The selection flowchart

The deliverable from this Build is a primitive-selection flowchart. The shape of it should be:

```
Q: Does the user expect a sentence-grade answer?
├── NO → Does the user expect a filterable list of resources?
│        ├── YES, with per-resource metadata → /search
│        └── YES, just a ranked list → /find
└── YES → Is the question multi-part / does it need decomposition?
         ├── YES → Retrieval Agent
         └── NO → Is the UX conversational (follow-ups expected)?
                  ├── YES → /predict/chat
                  └── NO → Is the latency budget perceived-instant?
                           ├── YES → /ask streaming
                           └── NO → /ask sync
```

That's the minimum shape. The full flowchart you'll commit in Step 3 of the walkthrough will have 8+ branches; the trade-off matrix is what tells you where to add the next branch.

## A note on `/predict/chat` vs Retrieval Agent in conversational mode

The single most common confusion at this level: *both* `/predict/chat` and the agent endpoint can run multi-turn. Why pick one over the other?

- **`/predict/chat`** is the right choice when the *questions are single-shot per turn* but the *conversation needs continuity*. Each turn is a single retrieval + generation; the platform manages the conversation state. Cheap, fast, sufficient for most chatbots.
- **Retrieval Agent in conversational mode** is the right choice when *each turn might need decomposition*. The user asks a follow-up; the agent re-plans, runs sub-queries, merges. Expensive, slower, but answers questions `/predict/chat` cannot.

The rule of thumb: if a single turn ever needs an agent, the whole surface should be agent-based. If a single turn always fits in a `/ask`, the whole surface should be `/predict/chat`.

## What you'll do in the walkthrough

The walkthrough has you:

1. Set up the comparison harness — one test query set, all five primitives wired.
2. Run the harness against the partner's KB.
3. Tabulate the measured trade-off matrix.
4. Build the primitive-selection flowchart from the measured numbers.
5. Defend the flowchart against three real customer scenarios.

The flowchart and the matrix get committed to the course-level `assets/` folder so every later Build can reference them.

## Reference reading

- Foundations Build 1 — *Five Primitives* (the conceptual baseline).
- ARAG documentation: each primitive's API reference.
- Research: "retrieval primitives in production RAG" — recent arxiv survey papers cover the trade-off shape.
