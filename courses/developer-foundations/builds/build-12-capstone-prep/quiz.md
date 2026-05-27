# Build 11 — Quick Quiz: Capstone Prep

> 5 multiple-choice + 1 short answer. Pass = 4/5 + credible SA.

---

### 1. The capstone vibe-codes against:

A. A new ARAG SDK Progress will release for the capstone.
B. **The 8 master prompts you write in Build 11 — composed of patterns from Builds 1–10.**
C. A starter template Progress provides; partners just rebrand.
D. A fixed framework Progress maintains.

---

### 2. The two capstone variants differ in:

A. The underlying ARAG architecture (they're built on different platforms).
B. **The buyer, the corpus, and the demo script. The architecture (one KB + labelsets + agent + 6 routes) is the same.**
C. The capstone duration.
D. The price band.

---

### 3. Before you start vibe-coding the capstone, you must:

A. Have all six demo surfaces deployed.
B. **Pass the final exam AND get a review-board sign-off on your variant choice + master prompts + demo script.**
C. Sign a customer.
D. Provision a separate KB per surface.

---

### 4. The 25-minute customer demo arc opens with:

A. A long backstory on the AI industry.
B. The first workflow demo.
C. **Hero + BYO-LLM toggle in the first 90 seconds — kills the lock-in objection before the customer raises it.**
D. The pricing slide.

---

### 5. A "master prompt" in Build 11 should be:

A. One-line bullet ("scaffold the app").
B. **200–500 words covering goal, existing context, specific bullets of what to produce, conventions to follow, and verification steps.**
C. A full implementation in pseudocode.
D. A reference to an external spec doc.

---

## Short answer

**Q6.** Your review-board reviewer comes back with: "Your master prompts are too vague. Prompt #4 says 'build a search route with filters' — too open." Walk through the rewrite of prompt #4 in 4 sentences.

> *Pass rubric:* The rewrite should reference (1) existing files (ragClient.ts from prompt #2; design system from prompt #1), (2) explicit UI elements (content-type chip strip with these 5 values; sidebar facet for labelset X with N labels; results card layout), (3) explicit ARAG calls (`/find` with `filters` array; show `searchResultDisplay` from custom fields when present), (4) verification steps (test with X query against PDFs filter, expect Y results). Bonus for noting the rewrite is roughly 3x the length of the original — specificity costs words; vagueness costs weeks.

---

## Answer key

1. B • 2. B • 3. B • 4. C • 5. B

4+ correct → pass. You're ready for [Build 13 — The Capstone](../build-13-capstone/).

## Why these questions matter

- **Q1, Q2** are the conceptual scaffolding. The capstone is composition, not invention.
- **Q3** is the gate. Don't skip the review board; saves you a month of mistakes.
- **Q4** is the demo-arc opener that kills the most common objection before it's raised.
- **Q5, Q6** are the prompt-quality bar. Vague prompts = bad output. The specificity of your prompts directly determines whether the capstone ships in 8 weeks or 16.
