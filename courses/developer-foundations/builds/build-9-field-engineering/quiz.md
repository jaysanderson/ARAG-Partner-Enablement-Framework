# Build 8 — Quick Quiz: Field Engineering

> 5 multiple-choice + 1 short answer. Pass = 4/5 + credible SA.

---

### 1. The "field engineering" pattern requires two aligned contracts:

A. Schema + classifier.
B. **Content (what fields exist + their values) + prompt (telling the model to use them).**
C. Auth + observability.
D. Retrieval + generation.

---

### 2. A `callToAction` field is consumed by the model because:

A. It's passed as a special body parameter on `/ask`.
B. ARAG auto-detects fields with "CTA" in the name.
C. **It appears inside `{context}` like any other text field, and the prompt instructs the model to use the call-to-action from the context.**
D. The widget library has a built-in CTA renderer.

---

### 3. To A/B test a CTA without a code deploy, the right approach is:

A. Switch to a different LLM.
B. **Edit the `callToAction` field value on the source resource in the dashboard.**
C. Modify the prompt config in the front-end.
D. Recompile the React app with a new constant.

---

### 4. `searchResultDisplay` is typically:

A. A flag enabling search results.
B. **A JSON object stored as a string field, containing title + description + ctaLabel for rendering.**
C. A boolean visibility setting.
D. A list of supported icons.

---

### 5. The commercial pitch for field engineering as a partner service is:

A. One-off implementation work, $40K fixed-fee.
B. Hosting fees for the field definitions.
C. **A $5–15K/month per customer recurring content-engineering retainer for ongoing CTA + display copy maintenance and A/B testing.**
D. A percentage of customer conversion uplift.

---

## Short answer

**Q6.** A customer's marketing team asks: "How do we know which CTA variant the AI picked, and how often, so we can measure?" Sketch your 3-sentence response.

> *Pass rubric:* (1) Log every assistant response server-side and parse out the rendered CTA URL (after the post-processor extracts it). (2) Aggregate by URL to count how often each variant is picked. (3) Surface counts + click-throughs in a small dashboard the marketing team owns; the partner sets it up once and the customer's analytics tool feeds the data going forward. Bonus for noting the partner can charge for the dashboard setup as part of the field-engineering retainer.

---

## Answer key

1. B • 2. C • 3. B • 4. B • 5. C

4+ correct → pass. Move to [Build 9](../build-10-composite-rag/).

## Why these questions matter

- **Q1, Q2, Q3** are the field-engineering mechanics. Get these wrong and your demos don't reproduce.
- **Q4** is the JSON-object-as-string field pattern — easy to miss.
- **Q5** is the commercial frame. A partner who pitches field engineering as one-off work leaves $100K+/year per customer on the table.
- **Q6** is the analytics layer that turns the retainer from "trust us, it works" into "here's the click-through data, here's our quarterly invoice."
