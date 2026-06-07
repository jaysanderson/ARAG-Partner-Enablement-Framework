# Build 5 — Quick Quiz: Multi-Turn Conversational Retrieval

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. A user's turn 2 says *"What about its waterproofing?"* The conversational surface fails to retrieve TerraTrek-7-related content for the follow-up. The root cause is most likely:

A. The KB is missing data.
B. The pronoun *"its"* wasn't resolved against turn 1's context.
C. The reranker is misconfigured.
D. The user's intent is unclear.

---

### 2. Citation continuity across turns requires:

A. The citation IDs to be turn-scoped.
B. The citation IDs to be session-scoped via a citation ledger.
C. The platform to remember everything.
D. The user to re-ask.

---

### 3. The three context-window management strategies are:

A. Drop, ignore, refuse.
B. Rolling, summarised, hybrid.
C. Compress, expand, drop.
D. Cache, persist, evict.

---

### 4. The right default context-window strategy for conversational retrieval is:

A. Rolling — simplest.
B. Summarised — most efficient.
C. Hybrid — recent turns verbatim, older summarised.
D. Drop on overflow — fastest.

---

### 5. Which primitive should you reach for when the conversational surface needs to handle a turn that requires query decomposition?

A. `/predict/chat` — handles everything.
B. `/find` per turn with custom history threading.
C. Retrieval Agent in conversational mode.
D. `/ask` sync, called manually with the full history.

---

## Answer key

1. **B** — co-reference (pronoun) resolution is the single most common multi-turn failure. The fix is letting the platform's history-aware rephraser see the prior turn — or using a Retrieval Agent that bakes that into the planner.

2. **B** — session-scoped citation IDs are the architectural pattern. A citation referenced in turn 1 keeps its citationId in turn 7.

3. **B** — rolling drops oldest; summarised replaces older with a summary; hybrid keeps last N verbatim + summary of the rest.

4. **C** — hybrid is the right default. Recent turns retain full fidelity; older turns retain citation continuity through the summary + ledger.

5. **C** — the Retrieval Agent in conversational mode is the primitive that bakes decomposition into each turn. `/predict/chat` cannot.

---

4+ correct → pass. Continue to [Build 6 — Search Profiles & Per-Use-Case Tuning](../build-6-search-profiles-and-per-use-case-tuning/).
