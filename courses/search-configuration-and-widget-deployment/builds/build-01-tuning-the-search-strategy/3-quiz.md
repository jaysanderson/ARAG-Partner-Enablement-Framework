# Build 01 — Quick Quiz: Tuning the Search Strategy

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. By default, `/ask` runs which search modes?

A. Semantic and fulltext only
B. Semantic, keyword, and graph search
C. Keyword only
D. Semantic and graph only, no keyword

---

### 2. A user searches your English-language Knowledge Box in Spanish. Keyword search false-matches on words that look similar across languages. The right fix is:

A. Add a `query_prepend` in Spanish
B. Turn on reranking
C. Set `features` to semantic search only
D. Increase the `rank_fusion` `k` value

---

### 3. `rephrase: true` is most useful when:

A. The query is already phrased as a natural-language question
B. You need to filter results by language
C. You want to skip keyword search entirely
D. The query is a set of keywords that performs poorly on semantic search as-is

---

### 4. What is the main gotcha with `query_prepend`?

A. It applies to every query on that endpoint, including ones where the prepended text is irrelevant
B. It only works on `/ask`, never `/find`
C. It disables reranking automatically
D. It can only prepend a single word

---

### 5. `autofilters` in an `/find` response is:

A. A request parameter that turns on automatic filtering
B. A field reporting which filters the query engine applied automatically, e.g. from entities detected in the query
C. The same thing as `filter_expression`
D. A dashboard-only setting with no API equivalent

---

## Answer key

1. B · 2. C · 3. D · 4. A · 5. B

4+ correct → pass. Continue to [Build 02](../build-02-prompts-and-generative-answers/).
