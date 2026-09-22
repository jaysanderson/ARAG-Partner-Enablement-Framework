# Build 03 — Quick Quiz: RAG Context Strategies

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. `/find` returns the correct matched paragraph, but the generated answer is still wrong. What kind of problem is this?

A. A retrieval problem — fix it in Build 01's filters
B. Always a prompt problem, fix it in Build 02
C. An authentication problem
D. A context-construction problem — the paragraph was right, the surrounding context wasn't enough

---

### 2. A Knowledge Box has contracts with a main field and a separate `updates` field for amendments. Which strategy pulls the amendments in even when they aren't the best semantic match for the query?

A. `field_extension`
B. `prequeries`
C. `hierarchy`
D. `metadata_extension`

---

### 3. Why might `full_resource` be the wrong first choice for a 40-page document?

A. It's not a valid strategy name
B. It maximizes context size, which can hit the model's token limit fast
C. It only works on PDFs
D. It requires a Graph data-augmentation agent first

---

### 4. What does `graph_beta` require before it can return useful results?

A. Nothing — it works on any Knowledge Box immediately
B. A `field_extension` strategy configured first
C. A knowledge graph that already exists, via a Graph data-augmentation agent or manual `user_metadata` annotation
D. The Prompt Lab

---

### 5. You want to boost ambassador-authored content over generic support docs for one specific question, without permanently changing your default search behavior. Which strategy fits?

A. `metadata_extension`
B. `neighbouring_paragraphs`
C. `hierarchy`
D. `prequeries`, with a weighted sub-query

---

## Answer key

1. D · 2. A · 3. B · 4. C · 5. D

4+ correct → pass. Continue to [Build 04](../build-04-visual-rag-and-images/).
