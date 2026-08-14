# Build 00 — Quick Quiz: Named Search Configurations

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. A search configuration's `kind` field:

A. Scopes the configuration to `find` or `ask` — it can't be used on the other endpoint
B. Sets whether the configuration is public or private
C. Chooses which generative model to use
D. Is a free-text label with no functional effect

---

### 2. Why do partners ship search configurations instead of hand-carrying parameters on every call?

A. Hand-carried parameters are rejected by the API
B. One place to change; every caller referencing the name picks up the update without a redeploy
C. Configurations are the only way to set a system prompt
D. Configurations are required for authentication

---

### 3. What does the dashboard's "Create widget" button do with your Search-tab and Generative-Answer-tab choices?

A. Discards them — widgets always use platform defaults
B. Emails them to the KB administrator
C. Saves them as a named search configuration and points the widget at it
D. Bakes them into the widget's CSS

---

### 4. To use a stored configuration on an `/ask` call, you:

A. It applies automatically to every call on the KB with no parameter needed
B. Re-type all its parameters plus the name
C. Set it as an HTTP header
D. Pass its name in the `search_configuration` parameter

---

### 5. You need the same filter logic on both `/find` and `/ask`. What's true?

A. You create two configurations (one per `kind`), or use `/ask` with `generate_answer:false` instead of calling `/find` separately
B. One configuration works on both automatically
C. This isn't possible — filters can't be shared
D. You must hand-carry the filter on `/find` and store it only for `/ask`

---

## Answer key

1. A · 2. B · 3. C · 4. D · 5. A

4+ correct → pass. Continue to [Build 01](../build-01-tuning-the-search-strategy/).
