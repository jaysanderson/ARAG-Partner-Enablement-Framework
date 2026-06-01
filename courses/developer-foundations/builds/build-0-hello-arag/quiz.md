# Build 0 — Quick Quiz: Hello ARAG

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. The auth header on every ARAG API request is:

A. `Authorization: Bearer <jwt>`
B. `X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>`
C. `X-API-Key: <key>`
D. `Cookie: session=...`

---

### 2. The two endpoints you used in Build 0 are:

A. `/search` and `/chat`
B. `/embed` and `/generate`
C. `/find` and `/ask`
D. `/retrieve` and `/answer`

---

### 3. A streaming `/ask` response is delivered as:

A. A single JSON blob
B. NDJSON, one JSON object per line
C. Server-Sent Events
D. WebSocket frames

---

### 4. Two `/ask` body parameters you should set on most calls:

A. `temperature` and `top_p`
B. `prefer_markdown` and `rephrase`
C. `stream` and `cache`
D. `verify_citations` and `max_retries`

---

### 5. The vibe-coding mental model for this course says:

A. The AI does design and implementation; you observe.
B. You design and verify; the AI writes the code.
C. You hand-write production code; AI writes demos.
D. The AI is only used for documentation.

---

## Answer key

1. B · 2. C · 3. B · 4. B · 5. B

4+ correct → pass. Continue to [Build 1](../build-1-five-primitives/).
