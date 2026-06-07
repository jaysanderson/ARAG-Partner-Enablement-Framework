# Build 5 — Multi-Turn Conversational Retrieval

> Part of [Advanced Search & Retrieval Agents](../../README.md).
>
> **Why this matters:** Single-shot retrieval is solved. The unsolved problem is *"the customer asked a follow-up and the retrieval forgot the original entity."* Partners who treat each turn as independent miss the conversational win; partners who carry conversation state correctly land a Tier-3 differentiator.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Should) |
| **Prerequisite** | Build 4 of this course |
| **Estimated effort** | 14–18 hours focused |

## What the partner does

Builds a multi-turn retrieval surface using ARAG's conversational endpoints (`/predict/chat` or the Retrieval Agent endpoint in conversational mode). Implements **citation continuity** — citations from turn 1 remain addressable in turn 3. Designs context-window management: when to summarise, when to drop, when to expand. Tests adversarial follow-ups (pronoun resolution, topic switch, clarification request). Publishes a conversation-state schema partners can re-use across customer projects.

The conversation-state schema is the durable artefact — every later customer engagement starts from it.

## Pass rubric

1. Multi-turn surface deployed against a real KB.
2. Citation continuity working — a turn-3 citation pointer refers correctly back to a turn-1 source. Verifiable by clicking through.
3. Context-window management strategy documented and tested. The strategy must handle a conversation that exceeds the LLM context window without dropping citation continuity.
4. Adversarial follow-ups covered: pronoun resolution (*"What about its predecessor?"*), topic switch (*"Actually, tell me about Y instead"*), clarification (*"What do you mean by X?"*).
5. Conversation-state schema published in the workspace.

## Asset delivered

- `multi-turn-surface/` — the deployed implementation.
- `conversation-state-schema.md` — the schema.
- `adversarial-test-cases.md` — the test inputs that cover pronouns, topic switches, clarifications.
- `context-window-strategy.md` — when to summarise / drop / expand.

## Workspace

- `walkthrough.md`
- `multi-turn-surface/`
- `conversation-state-schema.md`
- `adversarial-test-cases.md`
- `context-window-strategy.md`
- `verification.md`

## Reference reading

- ARAG documentation: `/predict/chat` conversational mode, conversation state.
- Research: multi-turn RAG (arxiv search terms: "conversational retrieval," "multi-turn RAG," "history-aware query rewriting").

## See also

- Previous build: [Build 4 — Reranking Strategies](../build-4-reranking-strategies/)
- Next build: [Build 6 — Search Profiles & Per-Use-Case Tuning](../build-6-search-profiles-and-per-use-case-tuning/)
