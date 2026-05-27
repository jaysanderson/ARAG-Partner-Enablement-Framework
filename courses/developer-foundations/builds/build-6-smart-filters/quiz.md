# Build 6 — Quick Quiz: Smart Filters & Labelsets

> 5 multiple-choice + 1 short answer. Pass = 4/5 + credible SA.

---

### 1. To filter `/find` to PDFs only, the `filters` array contains:

A. `["pdf"]`
B. **`["/icon/application/pdf"]`**
C. `["mime:application/pdf"]`
D. `["type:pdf"]`

---

### 2. A label-path filter looks like:

A. `audience=legal-team`
B. **`/classification.labels/audience/legal-team`**
C. `labels[audience]=legal-team`
D. `tags:audience:legal-team`

---

### 3. The right number of labels per labelset is:

A. As many as your content requires, no cap
B. Exactly 4
C. **5–9 (cognitive limit; less doesn't separate, more confuses)**
D. 20–30

---

### 4. Filtering for `["/icon/video", "/icon/audio"]` returns:

A. Documents that are both video AND audio (impossible).
B. **Documents that are video OR audio (multiple icon-paths in one array → OR).**
C. Documents tagged with both `video` and `audio` labels.
D. An error — you can't combine icon paths.

---

### 5. A customer's CMO says: "We have 8,000 product pages, 400 PDFs, 200 videos. How do we let users filter by content type without rebuilding the search?" Your answer:

A. Spin up three separate KBs and route between them.
B. **One `filters` array on `/find` with `/icon/*` paths — three icon-path values for the three types. Wire chips in the UI. 30 minutes of work.**
C. Train a model classifier per content type.
D. Use the URL routing layer to filter by content type before calling ARAG.

---

## Short answer

**Q6.** A customer has 10 labelsets and wants users to be able to compose any combination of labels across labelsets at query time. How do you brief the AI to wire this, in 3 sentences?

> *Pass rubric:* (1) Fetch the labelsets at mount via GET `/labelsets`; render one facet group per labelset. (2) Track the selected labels in component state as an array; build the `filters` array as `[...selectedIconPaths, ...selectedLabels.map(l => `/classification.labels/${l.labelset}/${l.value}`)]`. (3) Fire the `/find` query on any filter change. Bonus for noting labels across different labelsets compose as AND (and labels within the same labelset compose as AND too — which is usually undesired; tell the AI to enforce single-selection per labelset).

---

## Answer key

1. B • 2. B • 3. C • 4. B • 5. B

4+ correct → pass. Move to [Build 7](../build-7-knowledge-graph/).

## Why these questions matter

- **Q1, Q2, Q4** are filter-array muscle memory. Every Tier 1 customer engagement uses these.
- **Q3** stops you from over-designing labelsets. Customers will ask for 30 labels; you'll quietly cut to 9.
- **Q5** is the CMO closer. Three sentences buys you the demo meeting.
- **Q6** is the multi-labelset composition pattern — the most complex filter UI you'll ship in Foundations.
