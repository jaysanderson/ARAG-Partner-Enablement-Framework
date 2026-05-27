# Build 2 — Lesson: Drop-in Widgets

> Read time: 8 minutes. Companion to the 8-minute [video](video-script.md).

## Why this is in the course

Half the customers you'll demo to don't have a development team standing by. They have a marketing site on WordPress, a knowledge centre on Zendesk, a member portal on something they can barely touch. For those customers, the time between "POC kickoff" and "we have a chatbot live on our brand" is the difference between closing the deal and being told *"we'll think about it."*

Nuclia ships a widget library — standard Web Components — that gets you there in 30 minutes, no backend. This Build covers it.

## The four widgets

```html
<script src="https://cdn.rag.progress.cloud/nuclia-widget.umd.js"></script>

<nuclia-search-bar
  knowledgebox="YOUR_KB_UUID"
  zone="aws-eu-1"
  apikey="YOUR_SERVICE_ACCOUNT_JWT"
  placeholder="Ask anything…"
></nuclia-search-bar>

<nuclia-search-results></nuclia-search-results>

<nuclia-chat
  knowledgebox="YOUR_KB_UUID"
  zone="aws-eu-1"
  apikey="YOUR_SERVICE_ACCOUNT_JWT"
  mode="light"
></nuclia-chat>

<nuclia-popup></nuclia-popup>
```

Two tags and two script-source lines = working search + chat. No build step, no React, no framework.

### What each widget does

- **`<nuclia-search-bar>`** — the search input. Fires the query, displays autocomplete.
- **`<nuclia-search-results>`** — the results list. Renders below the bar, citations included.
- **`<nuclia-chat>`** — floating chat button + popup chat window. Streaming answers.
- **`<nuclia-popup>`** — a modal that opens a result for inline reading without leaving the page.

## Branding levers

### Layer 1 — CSS variables (the fast path)

```css
:root {
  --nuclia-color-primary: #00D4AA;
  --nuclia-color-secondary: #1E40AF;
  --nuclia-color-background: #ffffff;
  --nuclia-color-text: #111827;
  --nuclia-color-border: #e5e7eb;
  --nuclia-font-family: 'Inter', sans-serif;
}
```

Five CSS variables and you've themed the entire widget set. The widgets read inherited custom properties — they cross the Shadow DOM boundary cleanly.

### Layer 2 — `csspath` (full CSS injection)

For per-element overrides and bespoke animations:

```html
<nuclia-chat
  ...
  csspath="data:text/css;base64,<base64-encoded-css>"
></nuclia-chat>
```

Encode any CSS file as base64 and pass it. Injected into the widget's Shadow DOM at mount. This is what you give a customer's brand team — they edit a CSS file; you base64-encode it; you ship the new build with one attribute change.

## Filter attributes

The search bar accepts a `filters` attribute (JSON array of filter paths):

```html
<nuclia-search-bar
  ...
  filters='["/icon/application/pdf"]'
></nuclia-search-bar>
```

Common filter values you'll use:

| Filter | Restricts to |
|---|---|
| `/icon/video` | All video MIME types |
| `/icon/audio` | All audio MIME types |
| `/icon/application/pdf` | PDFs |
| `/icon/application/stf-link` | External links |
| `/icon/text` | Plain text + markdown |

Stack multiple: `filters='["/icon/video", "/icon/audio"]'` → results are videos OR audios.

Add a labelset filter: `filters='["/classification.labels/audience/legal-team"]'`. (Build 6 goes deep on labelsets.)

## Deep-link via `?q=`

The widgets read the URL on mount. Pass `?q=onboarding` and the search bar auto-fires the query. Combine with a public URL and you have shareable answers.

```
https://your-partner-sandbox.example/index.html?q=what+is+ARAG
```

## Where the widgets fit (and where they don't)

**Widgets are right when:**
- Customer wants a chatbot/search box on their site by next week.
- The brand team is willing to give you a CSS file.
- The customer has no engineering bandwidth for a custom build.
- The interaction is single-mode (one voice, one audience).

**Widgets are wrong when:**
- You need different prompt modes for prospect vs member (Tier 2 — that's Build 3).
- You need to render structured outputs (Tier 3 — Build 5).
- You need a knowledge-graph navigation UI (Tier 4 — Build 7).
- The interaction needs custom post-processing (CTA pills, multi-step flows — Build 8 and onward).

The widgets are a **starter**. They get the partner from zero to "live chatbot" in 30 minutes. Almost every customer engagement past Tier 1 outgrows them. That's fine — the widgets close the door, then the custom build opens it wider.

## Production-grade detail

For sandbox / demo deployments, embedding the service-account JWT directly in the HTML is fine. For production, **never**. Production deployments proxy ARAG calls through the partner's backend so the JWT never reaches client-side code. We cover this in Build 10.

## What's next

[Build 3 — Conversational Surfaces](../build-3-conversational-surfaces/) — where you stop using the widgets and start vibe-coding a chat UI with multiple prompt voices.
