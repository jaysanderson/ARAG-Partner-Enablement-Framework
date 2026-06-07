# Video Script — Build 5: Multi-Turn Conversational Retrieval

> **Duration target:** 10 minutes

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Build 5 · Multi-Turn Conversational Retrieval."*

**VOICEOVER:**
> Ten minutes. Single-shot retrieval is solved. The unsolved problem is *"the customer asked a follow-up and the retrieval forgot the original entity."* By the end of this video you'll know how to ship a multi-turn surface that doesn't fail on turn two.

## Section 1: The three requirements (0:30 – 2:30)

**ON SCREEN:** Three-row table — context propagation, citation continuity, state management.

**VOICEOVER:**
> Three requirements. Context propagation — turn two's retrieval has to know what turn one was about. Citation continuity — a citation in turn one stays addressable in turn seven. State management — when the conversation exceeds the context window, the strategy preserves continuity.
>
> A partner who only solves the first one ships a chatbot that hallucinates citations on turn three. A partner who solves all three ships a conversational surface.

## Section 2: The three adversarial patterns (2:30 – 5:00)

**ON SCREEN:** Three conversation transcripts side by side — pronoun, topic switch, clarification.

**VOICEOVER:**
> Three patterns most partners don't test. Pronoun — *"What about its waterproofing?"* — *its* must resolve to the turn-one entity. Topic switch — *"actually, what about the Skyline 45L instead?"* — context from turn one must be cleanly dropped. Clarification — *"what do you mean by four-season?"* — the platform retrieves a definition without losing the turn-one product context.
>
> Every partner has shipped a chatbot that fails one of these. The fix is testing every one, every time.

## Section 3: The conversation-state schema (5:00 – 7:00)

**ON SCREEN:** TypeScript schema with the citation ledger highlighted.

**VOICEOVER:**
> The schema is the durable artefact. Session ID. Turns array. Citation ledger — session-scoped, not turn-scoped.
>
> A citation referenced in turn one keeps its citation ID in turn seven. The renderer resolves citation ID through the ledger; the ledger resolves to the resource. Always.
>
> Partners who ship this schema once re-use it across every customer engagement.

## Section 4: Hybrid context-window management (7:00 – 9:00)

**ON SCREEN:** Diagram showing the conversation history split — last six turns verbatim, older turns replaced by a summary.

**VOICEOVER:**
> Rolling-only drops the oldest turns. Loses citation continuity. Wrong default.
>
> Summarised-only replaces all of history with a summary. Loses recent fidelity. Wrong default.
>
> Hybrid is the right default. Keep the last N turns verbatim. Replace older turns with a summary that preserves entity references and citation IDs.
>
> Re-run the adversarial tests with hybrid. Topic switch shows clean context dropping. Citation continuity survives the summary boundary. That's the cert bar.

## Close (9:00 – 10:00)

**VOICEOVER:**
> Build 5 ships the schema, the surface, the adversarial tests, the hybrid strategy. Build 6 composes profiles on top — same KB, three personas, three search configurations. See you there.
