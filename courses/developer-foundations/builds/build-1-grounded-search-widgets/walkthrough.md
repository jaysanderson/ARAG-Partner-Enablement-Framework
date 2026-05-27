# Build 1 — Walkthrough: Grounded search & drop-in widgets

> Estimated time: 4–6 hours focused. Complete the [lesson](lesson.md) first. Requires a passing Build 0.

## Prerequisites

- Build 0 complete (sandbox KB provisioned, 10+ documents ingested).
- The KB credentials from your Build 0 `.env`.
- A place to host static HTML — a partner sandbox subdomain, GitHub Pages, Vercel, Netlify, or local Vite dev server.
- A two-colour partner brand palette (primary + accent) and a font family.

## 1. Bootstrap a static HTML page

Create a working folder:

```bash
mkdir build-1-widgets && cd build-1-widgets
touch index.html theme.css
```

Open `index.html` and paste:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Build 1 — Widget Demo</title>
  <link rel="stylesheet" href="theme.css">
  <script src="https://cdn.rag.progress.cloud/nuclia-widget.umd.js"></script>
</head>
<body>
  <header>
    <h1>Partner Knowledge Hub</h1>
  </header>

  <main>
    <nuclia-search-bar
      knowledgebox="REPLACE_WITH_YOUR_KB_UUID"
      zone="aws-eu-1"
      apikey="REPLACE_WITH_YOUR_SERVICE_ACCOUNT_JWT"
      placeholder="Ask anything…"
    ></nuclia-search-bar>

    <nuclia-search-results></nuclia-search-results>

    <nuclia-popup></nuclia-popup>
  </main>
</body>
</html>
```

Substitute the three `REPLACE_WITH_*` values with your Build 0 KB credentials. If your KB lives in `aws-eu-1`, leave `zone` as shown; if you provisioned a different region, swap to the correct zone identifier from the Nuclia dashboard.

## 2. Apply brand theming

Open `theme.css` and paste:

```css
:root {
  --nuclia-color-primary: #YOUR_PRIMARY_HEX;
  --nuclia-color-secondary: #YOUR_ACCENT_HEX;
  --nuclia-color-background: #ffffff;
  --nuclia-color-text: #111827;
  --nuclia-color-border: #e5e7eb;
  --nuclia-font-family: 'YourBrandFont', system-ui, -apple-system, sans-serif;
}

body {
  font-family: var(--nuclia-font-family);
  margin: 0;
  padding: 0;
  background: #f9fafb;
}

header {
  padding: 2rem;
  background: var(--nuclia-color-primary);
  color: white;
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
}

nuclia-search-bar {
  display: block;
  margin-bottom: 2rem;
}

nuclia-search-results {
  display: block;
}
```

Substitute the two hex values with your brand palette.

## 3. Serve locally and verify

```bash
npx serve .
```

Open the URL printed (usually `http://localhost:3000`). Confirm:

- Header renders with brand primary colour.
- Search bar is visible and accepts input.
- Type a query → press Enter → results appear below.
- Click a result → a popup overlay opens with the resource detail.

If results don't appear, open the browser console. Look for fetch errors. Common causes:

- KB UUID typo
- API key truncated (JWTs are long; if you copy-pasted from the dashboard, check the full token landed)
- `zone` mismatch (e.g., your KB is in `aws-us-east-2-1` but you set `aws-eu-1`)

## 4. Add the floating chat widget

Add this just before `</main>`:

```html
<nuclia-chat
  knowledgebox="REPLACE_WITH_YOUR_KB_UUID"
  zone="aws-eu-1"
  apikey="REPLACE_WITH_YOUR_SERVICE_ACCOUNT_JWT"
  placeholder="Ask the AI…"
  mode="light"
></nuclia-chat>
```

Refresh. A chat bubble appears in the bottom-right. Click it, ask a question. Confirm streaming answers + citations render.

## 5. Filter by content type

The widget supports filter attributes too. To restrict the search to PDFs only:

```html
<nuclia-search-bar
  knowledgebox="..."
  zone="..."
  apikey="..."
  filters='["/icon/application/pdf"]'
></nuclia-search-bar>
```

Add a second search bar to the page, filtered to a different content type than your default. Confirm the two surfaces return different result sets for the same query.

For programmatic filter control (multiple toggleable filters, dynamic UI), read the widget docs at `https://docs.rag.progress.cloud/docs/widget` — the widget exposes a JS API for runtime filter updates. Build 1 doesn't require you to wire that, but bookmark it for partner customer engagements.

## 6. Deep-link to a pre-filled query

Update the search bar to support `?q=` query-string seeding. The widget reads the URL on load:

```html
<nuclia-search-bar
  knowledgebox="..."
  zone="..."
  apikey="..."
  autocomplete="false"
  ref-id="main-search"
></nuclia-search-bar>
```

Then in a small script tag:

```html
<script>
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    const bar = document.querySelector('nuclia-search-bar');
    bar.setAttribute('value', q);
    // Trigger a search programmatically — see widget docs for the method name
  }
</script>
```

Test: open `http://localhost:3000?q=onboarding` (or whatever question fits your corpus). Verify the search auto-fires and results render.

## 7. Deploy to a real URL

Pick the easiest of:

- **GitHub Pages.** Push the folder to a public repo, enable Pages on the main branch.
- **Vercel / Netlify drop-in.** Drag the folder onto their CLI.
- **Your partner sandbox subdomain.** SFTP the files up.

The deliverable URL must be public (auth-walled is fine if you can share a guest link for the reviewer).

## 8. Write the "Demo a chatbot in 30 minutes" playbook

A one-page markdown file your sales reps can hand to a customer demo participant. Structure:

1. **Five-minute setup:** "Open this codepen / template / static page, paste your KB UUID + API key + zone, save."
2. **Ten-minute branding:** "Edit five CSS variables — primary, secondary, background, text, font-family. Refresh."
3. **Ten-minute content-type filters:** "Add a `filters` attribute with the right `/icon/*` values for the content types you want to surface."
4. **Five-minute deep-link:** "Append `?q=...` to the URL for shareable pre-filled queries."

Total: 30 minutes. Sales rep walks the customer through it live in the demo room. Customer can replicate after the call.

Save the playbook as `playbook.md` in this folder.

## Verification checklist

- [ ] Static page hosted on a public URL.
- [ ] Branded with partner palette (CSS variables visibly applied).
- [ ] Working search bar + results + chat widget.
- [ ] At least one content-type filter demonstrably scoping results.
- [ ] `?q=` deep-link auto-fires a query on page load.
- [ ] 30-minute playbook written.
- [ ] Quick 3-minute screen recording walking the reviewer through all of the above.

When all checks pass, take the [Build 1 quiz](quiz.md) and submit the recording.

## Next

[Build 2 — Multi-surface conversational intelligence](../build-2-multi-surface-conversational/) — where you stop using the widgets and start writing custom chat UIs with prompt-mode routing.
