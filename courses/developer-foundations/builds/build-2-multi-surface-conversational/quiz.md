# Build 2 — Quick Quiz: Multi-surface conversational intelligence

> 8 questions + 1 short answer. Open-book. Pass = 7/8 + a credible short answer.

---

### 1. The `prompt` field on `/ask` accepts two keys. They are:

A. `instruction` and `query`
B. **`system` and `user`**
C. `role` and `content`
D. `persona` and `template`

---

### 2. In the user template, which placeholders does ARAG substitute at request time?

A. `{retrieval}` and `{query}`
B. **`{context}` and `{question}`**
C. `${context}` and `${question}`
D. `<context/>` and `<question/>`

---

### 3. A partner wants two voices — concise prospect-mode and detailed member-mode — over the same corpus. The right architecture is:

A. **One KB, two prompt configs, route by user state in the front-end**
B. Two KBs (public + member), route the API call based on auth
C. One KB, two LLM endpoints (cheap vs premium)
D. Two ARAG accounts, federated at query time

---

### 4. The Sample ARAG App's prospect-mode system prompt ends with "STOP after the link." Why is this rule alone insufficient?

A. The LLM doesn't read system prompts past 200 tokens
B. **The model sometimes ignores the rule, so the front-end must also truncate output after the first CTA**
C. ARAG strips "STOP" from system prompts as a safety measure
D. The rule only applies if `prefer_markdown` is false

---

### 5. The "Respond in French: " query-prefix multilingual pattern works because:

A. ARAG runs a translation step before retrieval
B. **The LLM handles translation as part of generation; no separate KB or embedding model is needed**
C. ARAG ships a French-specific tokenizer for the embeddings
D. A separate French KB is provisioned automatically

---

### 6. The `?q=` deep-link autosubmit pattern uses `autoSubmittedRef.current = true` *before* calling `submitQuery`. Why before?

A. To set up the loading spinner
B. **To prevent re-renders from re-firing the query**
C. To register the query with browser history
D. To bypass the rephrase step

---

### 7. "Resource-scoped chat" in the Sample ARAG App is implemented by:

A. A `filters` array restricting the search to one resource id
B. A separate `/find` call that only returns the resource, followed by `/ask` against its text
C. **Prepending `Regarding the resource titled "..."` to the user's query — pseudo-scoping via prompt**
D. A separate per-resource KB

---

### 8. A customer in pharmaceutical sales asks: "Can the AI sound like a regulated-language compliance officer for our internal team, and like a friendly health-literacy coach for our patient portal, off the same documents?" What's the right answer?

A. "No — you'll need two model fine-tunes."
B. "Yes, but you'll need two separate KBs."
C. **"Yes — two prompt configurations against the same KB. Voice, length, and CTA behaviour are prompt-controlled. We'll build it in your Tier 2 POC."**
D. "Yes, but each requires a different LLM endpoint."

---

## Short answer

**Q9.** Explain — in 3–4 sentences — why a "two-KB" architecture for serving prospect-vs-member experiences is the *wrong* choice for Tier 2, and what `useMember()`-style state should actually be controlling instead.

> *Pass rubric:* The answer must distinguish (a) voice from gating, (b) explain that voice is a *prompt* decision, gating is a *content visibility* decision, (c) note that splitting KBs to control voice forces every retrieval improvement to be re-implemented in N KBs, and (d) the right thing to switch by user state is the *prompt config*, not the KB. Bonus for noting that gating (which content non-members can *see*) is a different, complementary concern handled by filters or labelsets, not by separate KBs.

---

## Answer key

1. B • 2. B • 3. A • 4. B • 5. B • 6. B • 7. C • 8. C

7 or more correct → you've passed.

## Why these questions matter

- **Q1, Q2, Q5** are the API surface fundamentals. Every Tier 2 customer engagement uses these calls.
- **Q3, Q8** are the commercial reframing. Most partners will lose Tier 2 deals if they default to multi-KB architectures. Get the reframing in muscle memory.
- **Q4** is the post-processing detail that the LLM literally ignores. Catching it in code is the difference between a clean demo and a broken one.
- **Q6, Q7** are the implementation tricks that separate good Tier 2 partners from great ones. Customers notice.
