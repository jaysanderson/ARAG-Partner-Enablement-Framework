# Build 6 — Quick Quiz: Search Profiles & Per-Use-Case Tuning

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. A search profile bundles together which levers from previous Builds?

A. Just the primitive choice from Build 1.
B. The primitive, rephrasing, filter defaults, reranking budget, renderer, and success metric.
C. Only the reranker config.
D. Nothing — profiles are independent of Builds 1–4.

---

### 2. Why three profiles as a starting point?

A. ARAG's API limits you to three.
B. Customer organisations almost always have three persona tiers (external, internal, power-user).
C. Three is the maximum that fits in a UI dropdown.
D. Anything more than three is too expensive.

---

### 3. Profile switching should:

A. Require a page reload to clear caches.
B. Work without page reload — the next query uses the new profile's configuration.
C. Be hidden from the user.
D. Only happen at login.

---

### 4. The right success metric for the power-user / executive profile is most likely:

A. Time-to-add-to-cart.
B. Number of citations returned.
C. Time-to-decision — user reads summary and acts.
D. Number of searches per session.

---

### 5. A partner ships three profiles without per-profile success metrics. Six months later the customer wants to know which profile is performing best. What's the problem?

A. No problem — profiles always work.
B. There's nothing to tune against; profile iteration is blind.
C. The customer should hire a consultant.
D. ARAG doesn't support metrics.

---

## Answer key

1. **B** — a profile bundles all five levers. That's the architectural point of profiles.

2. **B** — the three persona tiers are external customer, internal staff, power-user / analyst / exec. Customer orgs map to this almost universally.

3. **B** — page-reload switching breaks the *"one product"* feel. Reactive state is the requirement.

4. **C** — executives optimise for time-to-decision. Time-to-add-to-cart is a shopper metric; citation count and search count are vanity metrics.

5. **B** — without measurable per-profile metrics, the partner cannot iterate. *"Which profile is performing"* has no answer. This is the cert-bar discipline.

---

4+ correct → pass. Continue to [Build 7 — Retrieval Agents 101](../build-7-retrieval-agents-101/).
