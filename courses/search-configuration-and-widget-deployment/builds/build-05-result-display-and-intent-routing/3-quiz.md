# Build 05 — Quick Quiz: Result Display & User Intent Routing

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. A partner wants to stop paying for LLM generation on a retrieval-only surface. Which setting actually achieves that?

A. `hideAnswer: true`
B. `generate_answer: false`
C. `showResultType: "citations"`
D. `displayResults: false`

---

### 2. `hideAnswer: true` differs from `generate_answer: false` in that:

A. They are two names for the exact same parameter
B. `hideAnswer` skips generation entirely; `generate_answer: false` only hides it client-side
C. `hideAnswer` still generates the answer server-side and just hides it client-side; `generate_answer: false` skips generation entirely
D. `hideAnswer` only works on `/find`, `generate_answer` only works on `/ask`

---

### 3. `relations` and `relationGraph` in `ResultDisplayConfig` will show meaningful data only when:

A. `citationThreshold` is set to 0
B. `jsonOutput` is enabled
C. `sortResults` is enabled
D. The underlying resource actually has extracted graph relations, e.g. from Build 03's `graph_beta` strategy

---

### 4. According to the confirmed `Routing` schema, a matching rule can:

A. Return a `direct_answer` and/or override the `generative_model`, but not natively swap the retrieval/search configuration
B. Swap the entire `search_configuration`, including retrieval filters and `rag_strategies`
C. Only change the display fields (`ResultDisplayConfig`), never touch generation
D. Change the Knowledge Box the query runs against

---

### 5. Why must a routing rule's `prompt` be tested against a range of real queries, not just its intended trigger phrase?

A. Rule prompts have a hard character limit that varies by query length
B. A too-broad rule prompt can match queries it shouldn't, silently replacing generation with a stale `direct_answer`
C. `useRouting` automatically disables itself after 100 calls
D. Rule prompts are case-sensitive and must match exact capitalization

---

## Answer key

1. B · 2. C · 3. D · 4. A · 5. B

4+ correct → pass. Continue to [Build 06](../build-06-rag-lab-and-prompt-lab/).
