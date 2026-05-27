# Build 0 — Quick Quiz: Hello ARAG

> 6 multiple-choice + 1 short answer. Open-book. Pass = 5/6 + credible short answer.

---

### 1. The auth header on every ARAG API request is:

A. `Authorization: Bearer <jwt>`
B. **`X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>`**
C. `X-API-Key: <key>`
D. `Cookie: session=...`

---

### 2. The two endpoints you used in Build 0 are:

A. `/search` and `/chat`
B. `/embed` and `/generate`
C. **`/find` and `/ask`**
D. `/retrieve` and `/answer`

---

### 3. A streaming `/ask` response is delivered as:

A. A single JSON blob
B. **NDJSON — `{"item": {"type": "answer"|"retrieval"|"status", ...}}` per line**
C. Server-Sent Events
D. WebSocket frames

---

### 4. Two `/ask` body parameters that should be set on essentially every call:

A. `temperature: 0.7` + `top_p: 0.9`
B. **`prefer_markdown: true` + `rephrase: true`**
C. `stream: true` + `cache: true`
D. `verify_citations: true` + `max_retries: 3`

---

### 5. Which response field carries the **score** for a paragraph match in a `/find` response?

A. Top-level `relevance`
B. `resources[id].score`
C. **`resources[id].fields[fieldId].paragraphs[paraId].score`**
D. `best_matches[i].score`

---

### 6. The mental model for vibe coding in this course says:

A. The AI does both the design and the implementation; you observe.
B. **You design (which primitive, which schema, which prompt) + verify; the AI writes the code.**
C. You hand-write the production code; the AI writes the demo code.
D. The AI is only used for documentation generation.

---

## Short answer

**Q7.** Your AI assistant generates a Node.js script for the `/ask` endpoint that uses `import { Nuclia } from 'nuclia'`. What's wrong with this, and how do you correct it in 1–2 sentences?

> *Pass rubric:* The answer must note (a) ARAG has no first-party SDK package — the AI is fabricating one, and (b) the correction is to instruct the AI to use plain `fetch` against the documented endpoints with the `X-NUCLIA-SERVICEACCOUNT` header. Bonus for noting this is failure mode #1 in the vibe-coding guide.

---

## Answer key

1. B • 2. C • 3. B • 4. B • 5. C • 6. B

5+ correct → you've passed. Submit your Build 0 recording + prompt log + this quiz to `#build-clinic-submissions` for reviewer sign-off, then start [Build 1 — The Five Primitives](../build-1-five-primitives/lesson.md).

## Why these questions matter

- **Q1, Q3, Q4, Q5** are API muscle memory. Every subsequent Build assumes you can recite these.
- **Q2** confirms you know which two endpoints carry today's load. The full set of five comes in Build 1.
- **Q6** is the most important question. If the vibe-coding mental model isn't clear, the rest of the course will feel like magic and you won't be able to direct the AI in customer engagements.
- **Q7** tests the most common AI failure mode in the course — fabricating an SDK that doesn't exist. Catching it the first time saves you debugging at every Build.
