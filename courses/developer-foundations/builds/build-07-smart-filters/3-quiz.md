# Build 7 — Quick Quiz: Smart Filters & Labelsets

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. To filter `/find` to PDFs only, the `filters` array contains:

A. `["pdf"]`
B. `["/icon/application/pdf"]`
C. `["mime:application/pdf"]`
D. `["type:pdf"]`

---

### 2. A label-path filter looks like:

A. `audience=legal-team`
B. `/classification.labels/audience/legal-team`
C. `labels[audience]=legal-team`
D. `tags:audience:legal-team`

---

### 3. The right number of labels per labelset is:

A. As many as the content requires, no cap
B. Exactly 4
C. 5–9
D. 20–30

---

### 4. Filtering for `["/icon/video", "/icon/audio"]` returns:

A. Documents that are both video AND audio
B. Documents that are video OR audio
C. Documents tagged with both labels
D. An error — icon paths cannot combine

---

### 5. To let users filter 8,000 pages, 400 PDFs, 200 videos by type:

A. Spin up three separate KBs and route between them
B. One `filters` array with three `/icon/*` paths
C. Train a model classifier per content type
D. Filter via URL routing before calling ARAG

---

## Answer key

1. B · 2. B · 3. C · 4. B · 5. B

4+ correct → pass. Continue to [Build 8](../build-08-knowledge-graph/).
