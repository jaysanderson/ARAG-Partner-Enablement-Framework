# Build 2 — Quick Quiz: Drop-in Widgets

> 5 multiple-choice + 1 short answer. Open-book. Pass = 4/5 + credible short answer.

---

### 1. The Nuclia widget library ships as:

A. A React component package on npm
B. **Standard Web Components from `https://cdn.rag.progress.cloud/nuclia-widget.umd.js`**
C. A jQuery plugin
D. An iframe embed

---

### 2. To restrict a `<nuclia-search-bar>` to videos only, the attribute is:

A. `content-type="video"`
B. `filter="video"`
C. **`filters='["/icon/video"]'`**
D. `restrict="application/video"`

---

### 3. Which CSS custom property changes the primary brand colour on every Nuclia widget on a page?

A. `--brand-primary`
B. `--widget-primary-color`
C. **`--nuclia-color-primary`**
D. `--theme-primary`

---

### 4. A customer's CMO asks "can we ship a chatbot tomorrow on our WordPress site, no engineering involvement?" Your answer is:

A. "No, you'll need a Tier 3 engagement."
B. **"Yes — three script tags and a custom-element tag, paste your KB credentials, ship in 30 minutes. The widgets work in any HTML."**
C. "Yes, but only after a four-week React integration."
D. "Yes, but only via the iframe embed which loses CSS control."

---

### 5. The widgets are the **wrong** choice when:

A. The customer is small.
B. **The interaction needs multiple prompt voices for different audiences (e.g., prospect vs member).**
C. The corpus has fewer than 100 documents.
D. The customer requires EU residency.

---

## Short answer

**Q6.** A customer's brand team gives you a 200-line CSS file with bespoke hover states, transitions, and per-element overrides — beyond what five CSS variables can express. How do you ship their branding into the Nuclia widget set?

> *Pass rubric:* The answer must reference the `csspath` attribute, base64-encode the CSS file as a `data:text/css;base64,…` URI, and pass it via `csspath` on each widget. Note that the CSS is injected into the widget's Shadow DOM at mount. Bonus for noting that this is the layer that lets the customer's brand team own ongoing styling without partner code changes.

---

## Answer key

1. B • 2. C • 3. C • 4. B • 5. B

4+ correct → pass. Move to [Build 3 — Conversational Surfaces](../build-3-conversational-surfaces/).

## Why these questions matter

- **Q1, Q2, Q3** are muscle memory for any widget-embed customer engagement. Sales reps will ask you these in the field; you have them in seconds.
- **Q4** is the commercial reframe. A "yes — in 30 minutes" against a CMO buys you the meeting that converts into a Tier 2 engagement six weeks later.
- **Q5** stops you from over-selling the widgets. They're a starter, not an endpoint. Recognising when the customer has outgrown them is when you scope the next tier.
- **Q6** is the brand-team handoff pattern. Get this right and the customer's brand team stays out of your way; get it wrong and every CSS change is a partner code-deploy.
