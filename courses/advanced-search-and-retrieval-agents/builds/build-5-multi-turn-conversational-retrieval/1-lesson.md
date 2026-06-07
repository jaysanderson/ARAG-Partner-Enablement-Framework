# Build 5 — Lesson: Multi-Turn Conversational Retrieval

> Read time: 14 minutes. Companion to the 10-minute [video](video-script.md).

## Why partners learn this

Single-shot retrieval is solved. The unsolved problem is *"the customer asked a follow-up and the retrieval forgot the original entity."* The partner who treats each turn as independent ships a chatbot that's broken on turn 2; the partner who carries conversation state correctly ships the kind of conversational surface that Tier-3 buyers recognise as differentiated.

This Build is the depth-of-mastery Build for conversational retrieval. By the end the partner has a working multi-turn surface, citation continuity across turns, a published conversation-state schema, and tested handling of three adversarial follow-up patterns (pronouns, topic switches, clarifications).

## What "conversational" actually requires

There are three things multi-turn retrieval has to get right:

### 1. Context propagation

The user said *"Tell me about the Aurora TerraTrek 7"* in turn 1, then *"What about its waterproofing?"* in turn 2. The retrieval for turn 2 needs to know turn 2 is about the TerraTrek 7, not some unrelated boot. This is the **co-reference resolution** problem. The platform's default `/predict/chat` solves it via a context window; the Retrieval Agent in conversational mode solves it via the planner step.

### 2. Citation continuity

A citation surfaced in turn 1 should remain addressable in turn 3. If the user asks *"can you cite that again?"* in turn 4, the citation pointer needs to resolve. This requires a citation-id ledger that persists across turns.

### 3. State management as the context window grows

Conversations exceed the LLM context window. Some strategy has to drop, summarise, or expand the rolling history. The wrong strategy loses citation continuity; the right strategy preserves it.

## Three adversarial patterns to test

Conversational surfaces fail on three patterns most partners don't test:

### Pronoun follow-up

```
Turn 1: "Tell me about the Aurora TerraTrek 7."
Turn 2: "What about its waterproofing rating?"
```

*Its* needs to resolve to *the Aurora TerraTrek 7*. Tested by checking that turn 2's retrieved sources include TerraTrek-7-related content.

### Topic switch

```
Turn 1: "Tell me about the Aurora TerraTrek 7."
Turn 2: "Actually, what about the Skyline 45L pack instead?"
```

The user explicitly switched topic. The platform should drop the TerraTrek 7 context for turn 2's retrieval. Tested by checking that turn 2's retrieved sources are Skyline-focused, not TerraTrek-focused.

### Clarification request

```
Turn 1: "Tell me about the Aurora TerraTrek 7."
Turn 2: "What do you mean by 'four-season'?"
```

The user is asking for clarification on a term from turn 1's answer. The platform should retrieve definition-grade content for *"four-season"* without losing the TerraTrek 7 context. Tested by checking that turn 2's answer cites a relevant definition source *and* references the original product.

A partner who tests all three patterns ships a surface that doesn't fail in the customer's hands. A partner who doesn't ships one that does.

## The conversation-state schema

The durable artefact from this Build is the conversation-state schema. A simple version:

```typescript
interface ConversationState {
  sessionId: string;
  turns: Turn[];
  citationLedger: CitationEntry[];
  contextWindow: {
    strategy: 'rolling' | 'summarised' | 'hybrid';
    maxTokens: number;
  };
  personaContext?: { /* ... */ };
}

interface Turn {
  turnId: string;
  role: 'user' | 'assistant';
  text: string;
  retrievedSources: string[]; // resource IDs
  citationIds: string[];      // ids into the ledger
  timestamp: string;
}

interface CitationEntry {
  citationId: string;       // stable across the session
  resourceId: string;
  paragraphId?: string;
  firstReferencedInTurn: string;
  title: string;
}
```

The crucial property: **the citation ledger is session-scoped, not turn-scoped.** A citation referenced in turn 1 keeps its citationId in turn 7. The renderer always resolves citationId → ledger entry → resource.

A partner who ships this schema once re-uses it across every customer engagement. The deliverable is `conversation-state-schema.md` with the typed schema + a worked example covering ≥ 5 turns.

## Context-window management — three strategies

When the conversation grows past the LLM's context window, three strategies:

| Strategy | What it does | Citation continuity |
|---|---|---|
| **Rolling** | Drop oldest turns when over budget | Citations from dropped turns become unresolvable |
| **Summarised** | Replace older turns with a summary | Citations from summarised turns survive if the ledger is session-scoped |
| **Hybrid** | Keep last N turns verbatim + summary of the rest | Best of both — recent turns retain full fidelity, older turns retain citation continuity |

The right default is hybrid. The wrong default is rolling — it loses citation continuity, which is the whole point of a conversational surface.

## What you'll do in the walkthrough

1. Pick a primitive (`/predict/chat` or Retrieval Agent in conversational mode — Build 1's flowchart tells you which).
2. Build the multi-turn surface.
3. Implement the conversation-state schema with session-scoped citation ledger.
4. Test the three adversarial patterns and document outcomes.
5. Implement hybrid context-window management.

## Reference reading

- **[`/ask` parameter reference §11 — Conversation history `chat_history`](../../assets/ask-parameter-reference.md#11-conversation-history--chat_history)** — `chat_history` is the live parameter (the `context` parameter is **deprecated**; check customer code on migrations).
- **[`/ask` parameter reference §13 — Query rephrasing](../../assets/ask-parameter-reference.md#13-query-rephrasing)** — `chat_history_relevance_threshold` is the sensitivity dial when adversarial topic-switch patterns expose context bleed.
- **[`/ask` parameter reference §14 — RAG context-building strategies](../../assets/ask-parameter-reference.md#14-rag-context-building-strategies--rag_strategies)** — `rag_strategies` with `hierarchy` and `neighbouring_paragraphs` are the canonical multi-turn enrichments.
- **[`/ask` parameter reference §25 — Related endpoints](../../assets/ask-parameter-reference.md#25-related-endpoints--what-they-share)** — what `/predict/chat` and the Retrieval Agent endpoint share with `/ask` and what they add.
- Research: *"Conversational Search Sessions Datasets"* — academic surveys on multi-turn evaluation; arxiv search.
- Build 1's selection flowchart for picking the primitive.
