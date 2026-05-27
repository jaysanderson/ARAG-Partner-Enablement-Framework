# Build 4 — Quick Quiz: Multilingual & Voice Switching

> 5 multiple-choice + 1 short answer. Pass = 4/5 + credible SA.

---

### 1. To answer in French, the change to your `/ask` call is:

A. Add `lang: "fr"` to the body.
B. Switch to a French-trained LLM.
C. **Prepend `"Respond in French: "` to the user's query string.**
D. Provision a French-language KB.

---

### 2. A query prefix goes:

A. Into `prompt.system`.
B. Into `prompt.user` as part of the template.
C. **Concatenated onto the raw query string before the call.**
D. As a separate `prefix` body parameter.

---

### 3. Resource-scoped chat ("ask about this PDF") is implemented as:

A. A new `/ask-resource/{id}` endpoint.
B. A filter restricting `/find` to one resource id.
C. **A prefix `'Regarding the resource titled "X": '` on the user query — pseudo-scoping that biases the model toward that resource.**
D. A separate per-resource KB.

---

### 4. Multilingual answers require:

A. A separate KB per language.
B. A separate embedding model per language.
C. **Just the prefix — the LLM you're already paying for handles translation as part of generation.**
D. A `language` parameter on the body.

---

### 5. A customer says "we need each user's segment to influence how the AI frames its answer." The right approach is:

A. Build N prompt configurations, one per segment.
B. **A query prefix like "The user is a {segment}. Frame your answer accordingly." applied to the user query.**
C. Multiple KBs filtered by segment.
D. Train a custom model per segment.

---

## Short answer

**Q6.** A customer's CMO asks: "We're in 14 countries with 9 user segments. Do we need to provision separate AI infrastructure per market and per segment?" Write the 3-sentence reply that wins the meeting.

> *Pass rubric:* (1) No — the AI infrastructure is one KB. (2) Language and segment are query-prefix one-liners; the LLM handles translation and segment framing as part of generation. (3) Adding a new market or segment is a config change in the UI, not a deployment. Bonus for naming the operational consequence — *one* observability stack to maintain, *one* set of credentials to rotate, *one* surface to debug.

---

## Answer key

1. C • 2. C • 3. C • 4. C • 5. B

4+ correct → pass. Move to [Build 5](../build-5-structured-outputs/).

## Why these questions matter

- **Q1, Q2, Q4** are the multilingual reflex. CMOs ask about this in the first 10 minutes of every multinational customer demo.
- **Q3, Q5** test recognising prefix-shaped problems vs over-engineering them.
- **Q6** is the architecture-conversation closer. Get the framing right and you save the customer a six-figure infrastructure budget — which becomes a six-figure ARR budget for ARAG.
