# Build 02 — Quick Quiz: Prompts & Generative Answers

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. A customer says "the answer is wrong." What's the first move this Build recommends?

A. Rewrite the system prompt immediately
B. Switch to a different `generativeModel`
C. Set `generate_answer: false` and check whether the right paragraphs were retrieved
D. Raise `reasoning.effort` to `xhigh`

---

### 2. `prompt.rephrase` and `rephrase: true` (Build 01) are:

A. The exact same parameter under two different names
B. Unrelated — `prompt.rephrase` has nothing to do with query rephrasing
C. `prompt.rephrase` replaces `rephrase: true` in newer API versions
D. `rephrase: true` turns query rephrasing on; `prompt.rephrase` is a template for how that rephrase is worded, and only matters once rephrasing is on

---

### 3. Why is switching `generativeModel` not a drop-in swap?

A. It changes latency, cost, and answer style, so a prompt or RAG strategy tuned for one model may need retuning for another
B. It requires re-ingesting the whole corpus
C. It disables `reasoning` for every model
D. It automatically resets all saved search configurations

---

### 4. `preferMarkdown: true` is a bad idea when:

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

1. C · 2. D · 3. A · 4. B · 5. C

4+ correct → pass. Continue to [Build 03](../build-03-rag-context-strategies/).
