# Build 11 — Quick Quiz: Production Readiness

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. ARAG data residency is configured:

A. Per service-account JWT.
B. Per partner organisation.
C. Per KB, at provisioning time.
D. Per HTTP request.

---

### 2. The default rate limit on an ARAG service account is:

A. 600 req/min.
B. 1200 req/min.
C. 2400 req/min.
D. Unlimited.

---

### 3. A customer already has a billing account with Anthropic and wants ARAG to use it instead of Progress's. This is:

A. BYO-LLM — connect via the OpenAI-compatible endpoint.
B. BYOK — supply their own Anthropic key; Anthropic is already on the platform's provider list.
C. Not possible — Progress must always hold the billing relationship.
D. A residency configuration, not an LLM configuration.

---

### 4. The "enterprise-ready" indicator (region-locked, no training on your data) applies to:

A. Every LLM connection, regardless of billing.
B. Only platform-billed models — BYOK and BYO-LLM are the customer's own provider agreement.
C. Only BYO-LLM connections.
D. Only the default Progress Agentic RAG model.

---

### 5. The key observability metric for retrieval-quality regression is:

A. p99 latency.
B. Citation rate on `/ask` responses.
C. Total request volume.
D. Average answer length.

---

## Answer key

1. C · 2. C · 3. B · 4. B · 5. B

4+ correct → pass. Continue to [Build 12](../build-12-capstone-prep/).
