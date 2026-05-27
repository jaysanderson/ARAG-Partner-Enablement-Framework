# Build 10 — Quick Quiz: Production Readiness

> 5 multiple-choice + 1 short answer. Pass = 4/5 + credible SA.

---

### 1. ARAG data residency is configured:

A. Per service-account JWT.
B. Per partner organisation.
C. **Per KB, at provisioning time.**
D. Per HTTP request.

---

### 2. The default rate limit on an ARAG service account is:

A. 600 req/min.
B. 1200 req/min.
C. **2400 req/min.**
D. Unlimited.

---

### 3. BYO-LLM is configured:

A. Globally across all KBs.
B. Per HTTP request.
C. **Per KB, in the KB's generative-model settings.**
D. By the Nuclia ops team only.

---

### 4. A customer says: "Our security team needs to audit every LLM call." The right answer is:

A. "Nuclia exports its own LLM audit log to your team."
B. **"BYO-LLM. Point the KB at your own Azure / Vertex / Bedrock tenant. Calls go through *your* tenant's logging. ARAG handles retrieval; you control everything downstream."**
C. "Tier 4 enterprise plan only."
D. "We provide an audit-log webhook."

---

### 5. The single most important production observability metric for retrieval-quality regression is:

A. p99 latency.
B. **Citation rate (% of `/ask` responses returning non-empty citations).**
C. Total request volume.
D. Average answer length.

---

## Short answer

**Q6.** A customer's CTO asks: "Walk me through your production-readiness checklist." Give the four-bullet response.

> *Pass rubric:* (1) Residency confirmed + documented (KB region selected; IaC writes it region-aware). (2) BYO-LLM endpoint configured against customer's own tenant, co-located with the KB region. (3) Rate-limit-aware client with backoff + coalescing + timeouts (default 2400 req/min, raisable via support). (4) Observability dashboard tracking latency, citation rate, error rate, request volume — with the citation-rate alarm wired. Bonus for naming the JWT proxy through the customer backend (no client-side exposure) + the rate-limit-increase ticket path.

---

## Answer key

1. C • 2. C • 3. C • 4. B • 5. B

4+ correct → pass. Move to [Build 12 — Capstone Prep](../build-12-capstone-prep/).

## Why these questions matter

- **Q1–Q3** are the three numbers CTOs ask in every production conversation. Have them in muscle memory.
- **Q4** kills the most common security objection. BYO-LLM is the answer.
- **Q5** is the single most important monitoring lesson in the entire course. Citation rate is the retrieval-quality alarm.
- **Q6** is the four-bullet pitch that separates partners from amateurs in the CTO meeting.
