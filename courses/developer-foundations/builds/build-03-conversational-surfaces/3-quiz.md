# Build 3 — Quick Quiz: Conversational Surfaces

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. To serve two audiences (prospect, member) over one KB, you should use:

A. Two KBs routed by auth state
B. One KB, two prompt configurations
C. Two LLM endpoints, one cheap and one premium
D. Two ARAG service accounts

---

### 2. The two placeholders ARAG substitutes inside `prompt.user` are:

A. `${context}` and `${query}`
B. `{context}` and `{question}`
C. `<<context>>` and `<<question>>`
D. `[CTX]` and `[Q]`

---

### 3. To enforce "stop after the CTA link," in production you must:

A. Increase `max_tokens` so the model can obey
B. Switch to a smaller, more compliant model
C. Truncate the streamed response in code after the link
D. Re-run the query if the model writes past the link

---

### 4. Streaming chunks from `/ask` arrive as:

A. SSE-formatted lines
B. NDJSON objects, one per line
C. Length-prefixed binary frames
D. WebSocket text frames

---

### 5. A query prefix like "Respond in French:" should be added:

A. To `prompt.system`
B. To `prompt.user`
C. Concatenated onto the raw query string
D. As a separate `language` body parameter

---

## Answer key

1. B · 2. B · 3. C · 4. B · 5. C

4+ correct → pass. Continue to [Build 4](../build-04-multilingual-and-voice/).
