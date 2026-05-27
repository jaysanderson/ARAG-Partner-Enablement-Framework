# Build 1 — Quick Quiz: The Five Primitives

> 7 multiple-choice + 1 short answer. Open-book. Pass = 6/7 + credible short answer.

---

### 1. Which primitive returns paragraph-level matches with scores and (for video/audio) timestamps?

A. P2 — `/ask`
B. **P1 — `/find`**
C. P3 — `/ask` with `answer_json_schema`
D. P4 — `/graph`

---

### 2. The `/ask` endpoint's streaming response is delivered as:

A. Server-Sent Events
B. WebSocket frames
C. **NDJSON with `{item: {type, ...}}` objects per line**
D. Chunked HTML

---

### 3. The two placeholders ARAG substitutes inside a custom `prompt.user` template are:

A. `{retrieval}` and `{query}`
B. **`{context}` and `{question}`**
C. `${context}` and `${question}`
D. `<<context>>` and `<<question>>`

---

### 4. A customer says: "we want AI to generate a structured form letter with subject line, body, and call-to-action URL." This is:

A. P1 — semantic search
B. P2 — free-form chat
C. **P3 — schema-constrained generation (`answer_json_schema`)**
D. P5 — secure media

---

### 5. To exclude default NER noise (DATE, ORG, MONEY) from a graph query, you wrap the query with:

A. `{ "exclude_ner": true }`
B. `{ "source": "manual" }`
C. **`{ "prop": "generated", "by": "data-augmentation" }`**
D. `{ "filter": "domain-specific" }`

---

### 6. A customer says: "show me the relationship between Judge Smith's rulings and the precedents she cited." This is most directly:

A. P1 — `/find` for "Judge Smith rulings"
B. P2 — `/ask` with a prompt mentioning Judge Smith
C. **P4 — `/graph` traversal from JUDGE → CITES → PRECEDENT**
D. P5 — `/resource` for the judge's bio

---

### 7. Hybrid retrieval is invoked by setting which body field on `/find`?

A. `mode: "hybrid"`
B. **`features: ["keyword", "semantic"]`**
C. `retrieval_type: "both"`
D. `query_strategy: "fuzzy_and_dense"`

---

## Short answer

**Q8.** A customer's CTO asks: "Walk me through which ARAG endpoint we'd use for each of these four asks: (a) search box on our docs site, (b) AI summary of a long PDF, (c) jump to the moment in a video where X is mentioned, (d) generate an intake form pre-filled from the customer's history." Map each to the right primitive in 4 sentences.

> *Pass rubric:* (a) P1 `/find` (search results page). (b) P2 `/ask` (grounded summary). (c) P1 `/find` + use `position.start_seconds` on the matched paragraph, plus P5 `/resource/{id}/file/.../download` to stream the video. (d) P3 `/ask` with `answer_json_schema` defining the form fields, grounded in the customer's history KB. Bonus for noting (c) requires both P1 and P5 — composition is the whole game.

---

## Answer key

1. B • 2. C • 3. B • 4. C • 5. C • 6. C • 7. B

6+ correct → you've passed. Move to [Build 2](../build-2-drop-in-widgets/).

## Why these questions matter

- **Q1, Q2, Q3, Q7** are pure API muscle memory. Every Build past this one assumes you have them.
- **Q4, Q6** are the "customer signal → primitive" mapping that lets you scope an engagement in five seconds. Get these wrong in a customer meeting and you commit to the wrong scope.
- **Q5** is the single most important graph-query parameter in the entire programme. Forget it and your graph view is full of NER garbage.
- **Q8** is composition. Real customer asks are almost always two or three primitives together. If you can decompose smoothly, you can scope a Tier 3 engagement on the spot.
