# Build 5 — Walkthrough: Multi-Turn Conversational Retrieval

> Estimated time: 14–18 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

- A **multi-turn conversational surface** against a real KB.
- A **conversation-state schema** with a session-scoped citation ledger.
- **Three adversarial-test outcomes** — pronoun follow-up, topic switch, clarification request.
- A **hybrid context-window management** implementation.

## Step 1 — Pick the primitive (15 min)

Use Build 1's selection flowchart:

- *Every turn is a single retrieval, follow-ups expected, decomposition never needed* → `/predict/chat`.
- *At least one turn might need decomposition (compliance Q&A, research workflows)* → Retrieval Agent in conversational mode.

For most consumer-grade chatbots, `/predict/chat` is right. For analyst tools and research portals, the agent is right.

Document the pick + the reason in `primitive-choice.md`.

## Step 2 — Build the conversational surface (4 hours)

Vibe-code the surface against the chosen primitive. Spec:

```
Build a React chat surface against ARAG's /predict/chat endpoint
(or /retrieval-agent in conversational mode).

UI:
- Scrolling message list (user turns + assistant turns alternating).
- Input box at bottom.
- Per-assistant-turn: rendered answer + citation chips referencing
  resources.
- Per-citation: clickable; opens the source resource.

State (in-memory; persistence in Step 4):
- conversationState: {
    sessionId,
    turns: [{turnId, role, text, citationIds, timestamp}],
    citationLedger: [{citationId, resourceId, title, firstReferencedInTurn}],
  }

On submit:
- Add user turn to state.
- Call /predict/chat with the new turn + recent history (rolling
  10 turns for now; we'll improve this in Step 5).
- Parse the response. For each cited resource:
  - Check the citationLedger by resourceId.
  - If new, mint a fresh citationId, add to ledger, reference in turn.
  - If existing, reference the existing citationId in turn.
- Add assistant turn to state.

Auth header X-NUCLIA-SERVICEACCOUNT: Bearer ${VITE_NUCLIA_API_KEY}.

Plain React. No SDK.
```

Save under `multi-turn-surface/`.

## Step 3 — Implement the citation ledger (2 hours)

The ledger is the differentiator. Key property: **citations are session-scoped, not turn-scoped.**

```typescript
function ensureCitation(
  state: ConversationState,
  resourceId: string,
  title: string,
  currentTurnId: string,
): string {
  const existing = state.citationLedger.find(c => c.resourceId === resourceId);
  if (existing) return existing.citationId;

  const newId = `cit-${state.citationLedger.length + 1}`;
  state.citationLedger.push({
    citationId: newId,
    resourceId,
    title,
    firstReferencedInTurn: currentTurnId,
  });
  return newId;
}
```

Render citation chips with the citationId. When the user clicks `[cit-3]` in turn 7, the renderer resolves cit-3 → ledger entry → resource — no matter how many turns ago it was first cited.

Commit the schema with example state across 5 turns to `conversation-state-schema.md`.

## Step 4 — Test the three adversarial patterns (4 hours)

Pick a KB you know well. For each pattern, run a scripted conversation and document the outcome.

### 4a. Pronoun follow-up

```
Turn 1: "Tell me about the Aurora TerraTrek 7."
Turn 2: "What about its waterproofing rating?"
```

Document:

- Did turn 2's retrieved sources include TerraTrek-7-related content?
- Did turn 2's answer reference *"the TerraTrek 7"* explicitly, or use *"its"*?
- If using the agent: did the planner produce a sub-query that mentioned the TerraTrek 7?

### 4b. Topic switch

```
Turn 1: "Tell me about the Aurora TerraTrek 7."
Turn 2: "Actually, what about the Skyline 45L pack instead?"
```

Document:

- Did turn 2's retrieved sources switch to Skyline-focused?
- Did the platform drop the TerraTrek 7 context, or did it bleed through?

### 4c. Clarification request

```
Turn 1: "Tell me about the Aurora TerraTrek 7."
Turn 2: "What do you mean by 'four-season'?"
```

Document:

- Did turn 2 retrieve definition-grade content for *"four-season"*?
- Did the answer reference the original TerraTrek 7 context?

Commit to `adversarial-test-cases.md` with the conversation transcripts + outcomes.

**Failure modes to expect:** the topic-switch test almost always shows context bleed in default configurations. The fix in Step 5's hybrid strategy.

## Step 5 — Implement hybrid context-window management (3 hours)

Naive rolling-N is what your harness shipped in Step 2. Hybrid is the upgrade:

```typescript
function buildContextWindow(state: ConversationState): TurnSummary[] {
  const recent = state.turns.slice(-6);  // keep last 6 turns verbatim
  const older = state.turns.slice(0, -6);

  if (older.length === 0) {
    return recent.map(toTurnSummary);
  }

  const summary: TurnSummary = {
    role: 'system',
    text: summariseOlder(older, state.citationLedger),
  };
  return [summary, ...recent.map(toTurnSummary)];
}

function summariseOlder(turns: Turn[], ledger: CitationEntry[]): string {
  // Generate a 100-200 word summary preserving entity references
  // and citation IDs.
  return `Earlier in this conversation, the user asked about ${entitiesIn(turns)} and was shown citations ${citationIdsIn(turns).join(', ')}.`;
}
```

Re-run the adversarial tests with the hybrid strategy. The topic-switch test should now show clean context switching; citation continuity from earlier turns survives in the summary.

Commit to `context-window-strategy.md` with the strategy choice + measured improvement on the three tests.

## Step 6 — Publish the schema to course-level assets (15 min)

Copy `conversation-state-schema.md` to `../../assets/conversation-state-schema.md`. Capstones A, B, C, D all reference it.

## Pass-rubric self-check

- [ ] Multi-turn surface deployed against a real KB.
- [ ] Citation continuity verified — a turn-3 citation pointer correctly resolves a turn-1 source.
- [ ] Three adversarial-test outcomes documented in `adversarial-test-cases.md`.
- [ ] Hybrid context-window management implemented, measured improvement noted.
- [ ] `conversation-state-schema.md` committed and copied to assets.

## Getting unstuck

**Topic switch shows context bleed.** That's expected with naive rolling. Hybrid summarisation fixes it.

**Citation IDs change across turns.** The ledger is being re-keyed every turn. The `ensureCitation` function above must use the existing ledger lookup, not a fresh allocation each turn.

**Summary loses entity references.** The summarisation prompt is too generic. Be explicit: *"preserve every product name, every cited resource title, every cited author."*

---

## Next

[Build 6 — Search Profiles & Per-Use-Case Tuning](../build-6-search-profiles-and-per-use-case-tuning/).
