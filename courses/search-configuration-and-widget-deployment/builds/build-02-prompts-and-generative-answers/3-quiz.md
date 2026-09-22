# Build 02 — Quick Quiz: Prompts & Generative Answers

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. A customer says "the answer is wrong." What's the first move this Build recommends?

A. Rewrite the system prompt immediately
B. Switch to a different `generative_model`
C. Set `generate_answer: false` and check whether the right paragraphs were retrieved
D. Raise `reasoning.effort` to `xhigh`

---

### 2. `prompt.rephrase` and `rephrase: true` (Build 01) are:

A. The exact same parameter under two different names
B. Unrelated — `prompt.rephrase` has nothing to do with query rephrasing
C. `prompt.rephrase` replaces `rephrase: true` in newer API versions
D. `rephrase: true` turns query rephrasing on; `prompt.rephrase` is a template for how that rephrase is worded, and only matters once rephrasing is on

---

### 3. You configure a token limit in the dashboard, then hand a customer's backend team the field name `limitTokenConsumption` to put in their `/ask` request body. What goes wrong?

A. Nothing — dashboard field names and request-body parameters are always identical
B. `camelCase` names are widget/dashboard configuration fields; `/ask` request bodies are `snake_case`, so the backend team needs the API spelling — use **Get code** to get it
C. The field only works on `/find`, so they should call that instead
D. Token limits can't be set from a backend at all, only from a widget

---

### 4. `prefer_markdown: true` is a bad idea when:

A. The Knowledge Box is in a single language
B. The consuming surface doesn't render Markdown, so literal `**` and `#` characters show up in the answer
C. `generate_answer` is set to `false`
D. The corpus contains PDFs

---

### 5. `askSpecificResource` + `specificResourceSlug` are for:

A. Filtering search results by content type
B. Limiting how many tokens a single resource can consume
C. Scoping generation to one specific resource — a "chat with this document" experience — instead of the whole Knowledge Box
D. Setting the reasoning budget for one resource only

---

## Answer key

1. C · 2. D · 3. B · 4. B · 5. C

4+ correct → pass. Continue to [Build 03](../build-03-rag-context-strategies/).
