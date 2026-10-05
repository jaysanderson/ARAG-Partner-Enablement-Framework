# Build 08 — Quick Quiz: Widget Deployment

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. To inject custom CSS into a Progress Agentic RAG widget, you:

A. Set the `csspath` attribute on the widget tag to a CSS file URL
B. Add a `<link rel="stylesheet">` tag before the widget script
C. Edit the widget's shadow DOM directly with JavaScript
D. Pass a `style` attribute with inline CSS on the widget tag

---

### 2. Your `csspath` file targets a widget element that already has a built-in style, and your rule isn't applying. The fix is:

A. Move the CSS file to a different URL
B. Add `!important` to the declaration
C. Load the CSS file before the widget script tag instead of after
D. Switch the widget to dark mode first

---

### 3. Embedding the service-account JWT directly in a widget snippet is acceptable when:

A. Never — it's always wrong
B. Any time the customer approves it in writing
C. Only in a local, sandbox/demo file that no one but you loads
D. Only if the JWT is base64-encoded first

---

### 4. In a production proxy setup, where does the real ARAG API key live?

A. In the widget's HTML attributes, base64-encoded
B. In a cookie set by the widget's JavaScript
C. In a query parameter appended by the browser
D. Server-side only — the proxy backend injects it before forwarding to ARAG

---

### 5. Synchronized configuration, enabled on a widget's embed snippet, means:

A. The snippet references the KB's stored configuration live, so a later dashboard change reaches the already-embedded widget with no new snippet or redeploy
B. The widget's CSS automatically matches the customer's site theme
C. The widget syncs source documents from cloud storage on a schedule
D. The widget automatically regenerates a new API key on every page load

---

## Answer key

1. A · 2. B · 3. C · 4. D · 5. A

4+ correct → pass. Continue to [Build 09 — Capstone](../build-09-capstone/).
