# Build 6 — Quick Quiz: Production readiness

> 8 questions + 1 short answer. Open-book. Pass = 7/8 + a credible short answer.

---

### 1. ARAG's data residency is configured:

A. Per service-account JWT
B. Per partner organisation
C. **Per KB, at provisioning time**
D. Per HTTP request

---

### 2. The default rate limit on ARAG service accounts is:

A. 600 req/min
B. 1200 req/min
C. **2400 req/min**
D. Unlimited

---

### 3. BYO-LLM is configured:

A. At the partner organisation level
B. Per HTTP request (the LLM endpoint is selected by header)
C. **Per KB, in the KB's generative-model settings**
D. Globally by the Nuclia operations team

---

### 4. A customer's CTO objects: "We need every LLM call to be auditable in our security tools." The right answer is:

A. "Nuclia provides its own audit log; we'll grant your team access."
B. **"BYO-LLM. Point the KB at your own Azure / Vertex / Bedrock tenant. The LLM calls land in *your* tenant's logging and audit infrastructure. ARAG handles the retrieval; you control everything downstream."**
C. "All LLM calls are routed through ARAG's own audit log, which we can export."
D. "You'd need a Tier 4 enterprise plan for that capability."

---

### 5. A `RateLimitedRagClient` wrapper that fires backoff retries on 429 must also:

A. Bypass the service-account JWT
B. Disable streaming responses
C. **Coalesce identical inflight requests so duplicate firings don't compound the rate-limit pressure**
D. Switch to a different LLM endpoint mid-retry

---

### 6. Why is exposing `VITE_*` service-account JWTs to the browser appropriate for the Sample ARAG App but NOT for a customer's production deployment?

A. Production keys are different formats from sandbox keys
B. **The Sample ARAG App is a *demo*; production deployments must proxy ARAG calls through the partner's backend so the service-account JWT never reaches client-side code**
C. The browser-side keys hit rate limits faster
D. Browser-side keys don't support BYO-LLM

---

### 7. The "citation rate" metric is most useful as a proxy for:

A. End-to-end latency
B. Customer satisfaction
C. **Retrieval-quality regression — if citation rate drops 20% week-over-week, something has changed in retrieval (ingest, chunking, labelset, model)**
D. Rate-limit headroom

---

### 8. A customer says: "Our compliance team requires all customer data to stay within EU jurisdiction, including the LLM that generates answers." What's the right architecture?

A. EU KB + Nuclia-default LLM
B. **EU KB + BYO-LLM pointed at an EU-region Azure OpenAI / Vertex / Bedrock endpoint (the customer's own tenant, in EU)**
C. US KB + EU LLM (cross-region)
D. Two KBs, one per region, with the customer's app routing

---

## Short answer

**Q9.** A customer is moving from POC to production. Their CTO asks: "Walk me through your production-readiness checklist." Give the 4-bullet response that demonstrates partner credibility.

> *Pass rubric:* The four bullets must cover (a) residency confirmed + documented (KB region selected, IaC writes it region-aware), (b) BYO-LLM endpoint configured against the customer's own tenant, (c) rate-limit-aware client with backoff + request coalescing + timeouts (default 2400 req/min, raisable via support), and (d) observability dashboard with at least latency, citation rate, error rate, and request volume tracked. Bonus for naming the service-account JWT proxy through customer backend (no client-side exposure) and the Advanced course's Build 1 eval harness as the citation-rate baseline.

---

## Answer key

1. C • 2. C • 3. C • 4. B • 5. C • 6. B • 7. C • 8. B

7 or more correct → you've passed Build 6. You're now eligible to take the [final exam](../../final-exam.md).

## Why these questions matter

- **Q1, Q2, Q3** are the three numbers every partner has to have in muscle memory. Customer CTOs ask all three within 10 minutes of any production conversation.
- **Q4** kills one of the most common objections — security-team gatekeeping. The BYO-LLM reframe wins it.
- **Q5, Q6** are the production-grade engineering reflexes that separate "we have a working demo" partners from "we ship in production" partners. Customer SRE teams notice immediately.
- **Q7** is the single most important production-monitoring lesson in this course. Citation rate as a retrieval-quality regression alarm is *the* metric.
- **Q8** is the most common compliance-driven architecture question. The "EU KB + EU BYO-LLM" answer is the production-grade architecture for European regulated customers.
