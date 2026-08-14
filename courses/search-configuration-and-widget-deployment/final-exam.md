# Search Configuration & Widget Deployment — Final Exam

> **Format.** 20 multiple-choice. Open-book. Pass = **16/20 (80%)**.
>
> **Gate.** This exam must be passed before you start the [Build 09 capstone](builds/build-09-capstone/).
>
> **Drawn from.** The per-Build quick quizzes across Builds 00–08. If you passed each quiz, you have already seen the concept tested here.
>
> **Submission.** Send your answers to `#exam-submissions`. A Progress Solution lead grades within 5 business days.

---

### 1. A search configuration's `kind` field:

A. Scopes the configuration to `find` or `ask` — it can't be used on the other endpoint
B. Chooses which generative model to use
C. Is a free-text label with no functional effect
D. Sets whether the configuration is public or private

---

### 2. Why do partners ship named search configurations instead of hand-carrying parameters on every call?

A. Configurations are required for authentication
B. One place to change; every caller referencing the name picks up the update without a redeploy
C. Configurations are the only way to set a system prompt
D. Hand-carried parameters are rejected by the API

---

### 3. `/ask`'s default search modes are:

A. Keyword only
B. Whatever `/find` last used
C. Semantic, keyword, and graph
D. Semantic and fulltext only

---

### 4. `rephrase:true` and a stored `prompt.rephrase` template are:

A. Only available in the widget, not the API
B. The same parameter under two names
C. Both deprecated in favor of `query_prepend`
D. Unrelated — one turns rephrasing on/off, the other is the template used when it's on

---

### 5. RRF (Reciprocal Rank Fusion) is useful because:

A. It merges ranked lists by rank position, working even when underlying scores (like BM25 and dot-distance) aren't comparable
B. It only works with a single search mode
C. It replaces the need for filters
D. It requires all search modes to use the same scoring function

---

### 6. `generate_answer:false` (or the widget's `generateAnswer:false`) is most useful for:

A. Switching the generative model
B. Debugging whether a bad answer is a retrieval problem or a generation problem, without paying for an LLM call
C. Hiding citations from end users
D. Disabling the Knowledge Box entirely

---

### 7. `hideAnswer` (Result Display) and `generate_answer:false` differ because:

A. `hideAnswer` disables retrieval too
B. They're identical
C. `hideAnswer` still generates the answer server-side and hides it client-side; `generate_answer:false` skips generation entirely
D. `hideAnswer` is API-only, `generate_answer:false` is widget-only

---

### 8. `/find` returns the correct paragraph but the generated answer is still wrong. This points to:

A. Always a reranking problem
B. A retrieval problem, fix it with filters
C. An authentication problem
D. A context-construction problem — the paragraph was right, the surrounding context wasn't enough

---

### 9. A Knowledge Box has contracts with a main field and a separate `updates` field for amendments. Which `rag_strategies` entry pulls the amendments into context even when they aren't the best semantic match?

A. `field_extension`
B. `metadata_extension`
C. `hierarchy`
D. `prequeries`

---

### 10. Why might `full_resource` be the wrong first choice for a long document?

A. It requires a Graph agent first
B. It maximizes context size and can hit the model's token limit fast
C. It's not a valid strategy
D. It only works on PDFs

---

### 11. `graph_beta` requires:

A. RAG Lab access
B. `field_extension` configured first
C. A knowledge graph that already exists (Graph data-augmentation agent or manual annotation)
D. Nothing — works on any KB immediately

---

### 12. A page has two images: one next to the matched paragraph, one next to an unrelated paragraph on the same page. Which image strategy gives the model access to both?

A. `full_resource`
B. `hierarchy`
C. `paragraph_image`
D. `page_image`

---

### 13. Image strategies (`rag_images_strategies`) should be used:

A. Only when the answer is genuinely visual — they cost more and take longer than text-only calls
B. Never — they're deprecated
C. Only in combination with `graph_beta`
D. On every call by default, for consistency

---

### 14. User Intent Routing's confirmed `Routing` schema lets a matching rule:

A. Only change the widget's theme
B. Supply a `direct_answer` and/or override the `generative_model` — not swap the full search configuration natively
C. Nothing — `useRouting` has no effect
D. Swap the entire `search_configuration` natively

---

### 15. RAG Lab / Prompt Lab exists to:

A. Configure CSS styling
B. Replace the need for named search configurations
C. Compare models, prompts, and RAG strategies side by side before anything touches production
D. Deploy widgets directly to a customer's website

---

### 16. The Progress Agentic RAG widget library ships as:

A. A jQuery plugin
B. An iframe embed
C. A React component package on npm
D. Standard Web Components from a CDN script

---

### 17. `rephraseQuery` and `rephrasePrompt` in a widget's `SearchBoxConfig` map to which API-level concepts?

A. `rephraseQuery` → Build 01's `rephrase` toggle; `rephrasePrompt` → Build 02's `prompt.rephrase` template
B. They're unrelated to any API parameter
C. Both map to `rag_strategies`
D. Both are Result Display fields

---

### 18. To customize a widget's CSS beyond what's already styled internally, you need:

A. A full page rebuild
B. The `csspath` attribute, and `!important` to override an already-defined internal style
C. `!important` alone, without `csspath`
D. No special syntax — any CSS rule wins automatically

---

### 19. The non-negotiable production rule for widget deployment is:

A. Every production widget must use `hideAnswer`
B. Production widgets can't use filters
C. The service-account JWT must never reach client-side code in production — calls proxy through the partner's backend
D. Sandbox-style direct-from-browser auth is fine for production too, as long as the KB is small

---

### 20. Synchronized configuration's practical effect is:

A. It's identical to the KB's Synchronize (cloud-storage ingestion) page
B. It syncs source documents from cloud storage into the KB
C. It only applies to the Search tab, not Generative Answer or Result Display
D. It makes an already-embedded widget pick up a later dashboard configuration change with no new snippet and no redeploy

---

## Answer key

1. A · 2. B · 3. C · 4. D · 5. A · 6. B · 7. C · 8. D · 9. A · 10. B
11. C · 12. D · 13. A · 14. B · 15. C · 16. D · 17. A · 18. B · 19. C · 20. D

16+ correct → pass. Continue to the [Build 09 capstone](builds/build-09-capstone/).
