# Build 3 — Quick Quiz: Filter Composition at Depth

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. *"Documents labelled onboarding OR training, from the EMEA region, NOT marked confidential."* What's the wire-format expression?

A. `labels:onboarding,training,region:emea,!classification:confidential`
B. `(labels:onboarding OR labels:training) AND region:emea AND NOT classification:confidential`
C. `labels:[onboarding,training] AND region:emea AND classification:confidential`
D. `onboarding training emea -confidential`

---

### 2. Which of these is a *computed* filter (not a static one)?

A. `region:emea`
B. `labels:onboarding`
C. `region:{{user.region}}` — computed at query time from session state.
D. `!classification:confidential`

---

### 3. A customer needs three filter axes (content-type, label, region) with mixed AND/OR semantics. The right UI pattern is:

A. Chip strip — always best.
B. Breadcrumb for the static defaults + advanced-filter modal for power users.
C. A long form with checkboxes.
D. No UI — the user types the wire format.

---

### 4. *"PDFs about onboarding, OR videos about anything, AND NOT marked confidential."* How many levels of nesting does this require in the wire format?

A. One level.
B. Two levels — outer AND, inner OR.
C. Three levels.
D. Zero — it's a flat AND.

---

### 5. Where does it make sense to enforce a security-boundary filter — at the UI layer or at the computed-filter layer?

A. UI layer — it's faster.
B. Computed-filter layer — harder to bypass and centralised.
C. Either is fine.
D. Nuclia handles security automatically.

---

## Answer key

1. **B** — explicit parentheses for the OR group, AND for the join, NOT for the negation.

2. **C** — computed filters reference session state with template variables resolved at query time. The others are static.

3. **B** — breadcrumb for the visible defaults gives clarity; the advanced modal lets the power user re-compose. Chip strip works for ≤ 4 filters; this is at the upper end.

4. **B** — outer AND joins two groups; inner OR composes the PDF/onboarding clause with the video clause; the NOT-classification clause sits at the outer level. Two levels.

5. **B** — the computed-filter layer is enforced server-side via the wire-format string. UI-layer enforcement is a presentation concern that's trivially bypassable by a user editing the request.

---

4+ correct → pass. Continue to [Build 4 — Reranking Strategies](../build-4-reranking-strategies/).
