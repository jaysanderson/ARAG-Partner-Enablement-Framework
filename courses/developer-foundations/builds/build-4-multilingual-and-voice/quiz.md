# Build 4 — Quick Quiz: Multilingual & Voice Switching

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. To answer in French, the change to your `/ask` call is:

A. Add `lang: "fr"` to the body
B. Switch to a French-trained LLM
C. Prepend "Respond in French:" to the query
D. Provision a French-language KB

---

### 2. A query prefix goes:

A. Into `prompt.system`
B. Into `prompt.user` as part of the template
C. Concatenated onto the raw query string
D. As a separate `prefix` body parameter

---

### 3. Resource-scoped chat ("ask about this PDF") is implemented as:

A. A new `/ask-resource/{id}` endpoint
B. A filter restricting `/find` to one resource id
C. A prefix naming the resource in the user query
D. A separate per-resource KB

---

### 4. Multilingual answers require:

A. A separate KB per language
B. A separate embedding model per language
C. Just the prefix; the LLM handles translation
D. A `language` parameter on the body

---

### 5. To make a user segment influence answer framing, use:

A. N prompt configurations, one per segment
B. A query prefix naming the user's segment
C. Multiple KBs filtered by segment
D. A custom model trained per segment

---

## Answer key

1. C · 2. C · 3. C · 4. C · 5. B

4+ correct → pass. Continue to [Build 5](../build-5-structured-outputs/).
