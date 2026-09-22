# Build 04 — Quick Quiz: Visual RAG & Images

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. A page has two images: one next to the matched paragraph, one next to an unrelated paragraph further down. Which strategy gives the model access to both?

A. `page_image`
B. `paragraph_image`
C. `full_resource`
D. `hierarchy`

---

### 2. Why shouldn't you enable image strategies by default on every `/ask` call?

A. They are deprecated
B. They cost more and take longer — reserve them for documents where the answer is genuinely visual
C. They only work on markdown files
D. They disable `rag_strategies`

---

### 3. What does `useImages:false` do when `rag_images_strategies` is still configured?

A. Nothing — `rag_images_strategies` always applies
B. It switches from `page_image` to `paragraph_image` automatically
C. It disables image context entirely; `rag_images_strategies` needs `useImages:true` to take effect
D. It deletes the images from the Knowledge Box

---

### 4. `imageUsage: "query"` means:

A. Images are appended to generation context — the normal case
B. Images are ignored entirely
C. It has no effect
D. An image is treated as part of the input query itself, a different use case than in-context answering

---

### 5. A spec sheet's answer is fully describable in words and appears in the paragraph right after the matched one. What should you reach for first?

A. Build 03's `neighbouring_paragraphs` — cheaper, and the answer isn't actually visual
B. `paragraph_image`
C. `page_image`
D. Both image strategies combined

---

## Answer key

1. A · 2. B · 3. C · 4. D · 5. A

4+ correct → pass. Continue to [Build 05](../build-05-result-display-and-intent-routing/).
