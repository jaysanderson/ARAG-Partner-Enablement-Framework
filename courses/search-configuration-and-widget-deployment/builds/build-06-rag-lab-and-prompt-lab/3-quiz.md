# Build 06 — Quick Quiz: RAG Lab & Prompt Lab

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. RAG Lab and Prompt Lab, as shipped in the dashboard, are:

A. Two completely separate dashboard destinations with no shared UI
B. A single button that auto-picks the best configuration for you
C. One integrated lab area (under Advanced) with a Prompt Lab tab and a RAG Lab tab
D. A staging environment that requires its own separate Knowledge Box

---

### 2. What new configuration parameters does this Build introduce?

A. A new `lab_strategy` parameter unique to the lab
B. `labConfig`, a dedicated lab-only request field
C. A new `compare: true` flag on `/ask`
D. None — everything compared in the lab is prompts, models, and `rag_strategies` from Builds 01–05

---

### 3. Why does the walkthrough insist on a fixed set of test queries run against every candidate, instead of one favorite query per candidate?

A. A single query can happen to work by luck; a fixed set run consistently is what actually reveals a difference between combinations
B. The dashboard requires exactly four queries to enable comparison mode
C. Fixed queries are required for `field_extension` to function
D. It reduces API cost, which is the primary reason

---

### 4. In the walkthrough, why does the baseline combination (no `rag_strategies` entry) answer the Skyline 45L warranty query incorrectly?

A. The baseline query is phrased as a keyword list, not a question
B. Without a strategy like `field_extension` pulling in the paired updates field, the model only sees the main field's stale "2 years, original purchaser only" text
C. The baseline combination never retrieves the `field_demo` resource at all
D. The baseline model doesn't support reasoning

---

### 5. Once a winning combination is found in the lab, this course's recommended way to make it usable in production is:

A. Leave it as the active lab session state — production calls will pick it up automatically
B. Screenshot the lab results and email them to the engineering team
C. Take the winning parameters and commit them explicitly as a named `search_configuration` via `POST /kb/{kbId}/search_configurations/{name}`
D. Re-enter the winning parameters by hand on every `/ask` call going forward

---

## Answer key

1. C · 2. D · 3. A · 4. B · 5. C

4+ correct → pass. Continue to [Build 07](../build-07-widget-configuration/).
