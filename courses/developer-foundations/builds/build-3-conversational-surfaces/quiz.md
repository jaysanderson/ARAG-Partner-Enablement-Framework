# Build 3 — Quick Quiz: Conversational Surfaces

> 6 multiple-choice + 1 short answer. Pass = 5/6 + credible SA.

---

### 1. To serve two audiences (prospect, member) over one KB, the right architecture is:

A. Two KBs routed by auth state
B. **One KB, two prompt configurations, route by user state in the front-end**
C. Two LLM endpoints (one cheap, one premium)
D. Two ARAG service accounts

---

### 2. The two placeholders ARAG substitutes inside `prompt.user` are:

A. `${context}` and `${query}`
B. **`{context}` and `{question}`**
C. `<<context>>` and `<<question>>`
D. `[CTX]` and `[Q]`

---

### 3. The system prompt instructs the model "STOP after the CTA link." In production, you must also:

A. Increase `max_tokens` so it has room to obey
B. Switch to a smaller, more compliant model
C. **Post-process the streamed response in code — truncate everything after the first `[label](url)` link**
D. Re-run the query if the model writes past the link

---

### 4. Streaming chunks from `/ask` arrive as:

A. SSE-formatted lines
B. **NDJSON objects shaped `{item: {type: "answer"|"retrieval"|"status", ...}}`**
C. Length-prefixed binary frames
D. WebSocket text frames

---

### 5. A query-prefix like `"Respond in French: <user query>"` is added:

A. To `prompt.system`
B. To `prompt.user`
C. **Concatenated onto the raw query string itself, before sending**
D. As a separate `language` body parameter

---

### 6. The cheapest way to extend a chat into "research mode" with longer, multi-source answers is:

A. Switch to a different LLM
B. Switch to a different KB
C. **Prefix the user's query with a verbosity directive like "Provide a comprehensive multi-source analysis: …"**
D. Modify the schema

---

## Short answer

**Q7.** A customer's CTO asks: "Can the AI sound like a regulated-language compliance officer for our internal team, and like a friendly health-literacy coach for our patient portal — off the same documents?" Walk through your 3-sentence answer.

> *Pass rubric:* (1) Yes — two prompt configurations against the same KB. (2) Voice, length, format, and CTA behaviour are all prompt-controlled, not infrastructure-controlled. (3) We design this in a 90-minute vibe-coded session in the Tier 2 POC and ship to staging the same day. Bonus for noting the customer's brand/comms team owns the prompt language going forward, not the partner.

---

## Answer key

1. B • 2. B • 3. C • 4. B • 5. C • 6. C

5+ correct → pass. Move to [Build 4 — Multilingual & Voice Switching](../build-4-multilingual-and-voice/).

## Why these questions matter

- **Q1** is the most common partner mistake — reaching for two KBs instead of two prompts. Get this wrong and you over-engineer every Tier 2 engagement.
- **Q2, Q4, Q5** are pure pattern muscle memory.
- **Q3** is the production-grade detail that separates working demos from broken demos.
- **Q6** is the query-prefix trick that you'll lean on in Build 4 — the cheapest extension lever in the entire course.
- **Q7** is the commercial reframe. Get the answer right and the CTO scopes a Tier 2 POC on the spot.
