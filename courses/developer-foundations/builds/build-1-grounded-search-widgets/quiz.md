# Build 1 — Quick Quiz: Grounded search & drop-in widgets

> 8 questions + 1 short answer. Open-book. Pass = 7/8 + a credible short answer.

---

### 1. The Nuclia widget library ships as:

A. A React component package
B. **Standard Web Components from `https://cdn.rag.progress.cloud/nuclia-widget.umd.js`**
C. A jQuery plugin
D. An iframe-based embed

---

### 2. To filter `/find` results to PDFs only, you set `filters` in the request body to:

A. `["pdf"]`
B. `["mime:application/pdf"]`
C. **`["/icon/application/pdf"]`**
D. `["content_type:pdf"]`

---

### 3. Which CSS custom property changes the primary brand colour on every Nuclia widget on a page?

A. `--brand-primary`
B. `--widget-primary-color`
C. **`--nuclia-color-primary`**
D. `--theme-primary`

---

### 4. The `csspath` attribute on a Nuclia widget accepts:

A. A relative path to a CSS file
B. **A `data:text/css;base64,...` URI**
C. A URL to a remote CSS file
D. Inline CSS as the attribute value

---

### 5. A partner customer asks "can we restrict results to videos or audio only?" What's the correct filter array?

A. `["/icon/video"]`
B. `["/icon/video", "/icon/audio"]` (and the partner explains this is an OR by default)
C. `["/icon/video AND /icon/audio"]`
D. `["video", "audio"]`

The correct answer is **B** — filters with multiple `/icon/*` values are interpreted as OR. To AND two filter types (e.g. videos with a specific topic label) you mix icon paths and `/classification.labels/*` paths in the same array.

---

### 6. The `?q=` deep-link pattern (e.g. `https://site.example/assistant?q=onboarding`) does what after the query fires?

A. Persists in the URL so the user can re-fire it by refreshing
B. **Strips itself from the URL via `navigate('/assistant', { replace: true })` so reloads don't re-fire it**
C. Saves the query to session storage
D. Redirects to a `/searches/<id>` permalink

---

### 7. Why is embedding the Nuclia widgets in an iframe a bad idea?

A. The widgets refuse to render inside an iframe
B. **The iframe boundary breaks CSS-variable inheritance, height auto-adjustment, and focus management**
C. Iframes block the service-account JWT from reaching the API
D. The widgets aren't supported on iframe contexts by Nuclia

---

### 8. A customer is on WordPress and asks "can we ship a chatbot tomorrow without engineering involvement?" What do you say?

A. "No — you'll need a Tier 3 platform engagement to wire the API."
B. **"Yes. Drop two `<script>` and `<nuclia-chat>` tags into your WordPress template, paste your KB UUID + API key + zone, ship today."**
C. "Yes, but you'll need to fork chassis first."
D. "You'll need to wait until we deploy a custom React app."

---

## Short answer

**Q9.** A customer's CMO says: "We have 8,000 product pages, 400 PDFs of fit-guides, 200 ambassador videos. We want a search bar that lets shoppers filter by content type, and the brand team needs full control of the look." Describe — in 4–5 sentences — exactly how you scope this in the customer demo room using the Build 1 toolkit.

> *Pass rubric:* The answer must touch on (a) the widget library — no backend required, (b) the `filters` attribute with `/icon/*` values for the content-type toggle, (c) CSS variables and/or `csspath` for brand control, (d) realistic implementation time (under a day for the live demo; under a week for production polish). Bonus for mentioning that the brand team owns the CSS file going forward — partners can charge for the *content engineering* (labelset design, CTA copy) rather than the templating.

---

## Answer key

1. B • 2. C • 3. C • 4. B • 5. B • 6. B • 7. B • 8. B

7 or more correct → you've passed.

## Why these questions matter

- **Q1, Q2, Q3, Q4, Q5** are pure muscle memory for any partner shipping a widget-embed customer engagement.
- **Q6** is the deep-link UX detail that separates the partners who ship "shareable answers" from the ones who don't. Customers notice.
- **Q7** is the most common partner mistake. The first time you embed a widget in WordPress and notice the colours aren't theming properly, this is why.
- **Q8** is the most important commercial question. A partner who can answer "yes" to a CMO with that scoping kills the competing pilot from another vendor before it starts.
