# Build 1 — Lesson: Grounded search & drop-in widgets

> Estimated reading time: 20 minutes. Read this before starting the [walkthrough](walkthrough.md).

## Why partners learn this

Half the customers you'll demo to don't have an engineering team standing by to integrate a custom API. They have a marketing site on WordPress, a knowledge centre on Zendesk, a member portal on a CMS they can barely touch.

For those customers, "30-minute time-to-value" is the difference between closing the deal and being told "we'll think about it." The Nuclia widget library — `<nuclia-search-bar>`, `<nuclia-chat>`, `<nuclia-popup>`, `<nuclia-search-results>` — is how you get there.

This Build's outcome is a partner-branded search-and-chat experience live on a real URL, in under 30 minutes, with no backend.

## What the widget library actually is

Web Components. Standard ones. They work in any HTML page — React, Vue, Angular, plain HTML, WordPress, Webflow, Shopify, anywhere a `<script>` tag and a custom element render.

```html
<script src="https://cdn.rag.progress.cloud/nuclia-widget.umd.js"></script>

<nuclia-search-bar
  knowledgebox="YOUR_KB_UUID"
  zone="aws-eu-1"
  apikey="YOUR_SERVICE_ACCOUNT_JWT"
></nuclia-search-bar>

<nuclia-search-results></nuclia-search-results>
```

Two custom elements, four attributes, zero JavaScript. That's a working search experience.

 is the canonical reference — it shows the four widgets, the branded variants, and how the same KB credentials power all of them. Read it.

## Branded theming — two layers

ARAG widgets ship with light/dark mode out of the box, but customers rarely accept that. They want their brand. You have two levers:

### Layer 1: CSS variables (Shadow DOM-friendly)

The widgets expose CSS custom properties for the most common visual choices:

```html
<style>
  :root {
    --nuclia-color-primary: #00D4AA;
    --nuclia-color-background: #ffffff;
    --nuclia-color-text: #111827;
    --nuclia-color-border: #e5e7eb;
    --nuclia-font-family: 'Inter', sans-serif;
  }
</style>
```

These work because the widgets read from inherited CSS custom properties — they cross the Shadow DOM boundary by design.

### Layer 2: `csspath` attribute (full CSS injection)

For deeper customisation (per-element overrides, animations, custom hover states), you pass a `csspath` attribute pointing at a CSS file:

```html
<nuclia-chat
  knowledgebox="..."
  zone="..."
  apikey="..."
  csspath="data:text/css;base64,<base64-encoded-css>"
></nuclia-chat>
```

`snippetData.ts` shows the base64-encoding pattern. The CSS file gets injected into the widget's Shadow DOM at mount.

**Why this matters commercially:** the customer's brand team wants pixel-perfect control. With `csspath` you give them that without your team touching code on every theming request. That's a small but real differentiator vs. competitors whose widgets ship as React components requiring rebuilds.

## Content-type filters

Customers want to scope searches by content type — "show me only videos" or "PDFs only." ARAG implements this with **icon-path filters** on the `/find` body:

```json
{
  "query": "onboarding",
  "filters": ["/icon/video"]
}
```

The icon path values you'll use most:

| Path | Matches |
|---|---|
| `/icon/video` | All video MIME types (MP4, WebM, etc.) |
| `/icon/audio` | All audio MIME types (MP3, M4A, WAV) |
| `/icon/application/pdf` | PDF files |
| `/icon/application/stf-link` | External links / bookmarks |
| `/icon/text` | Plain text and markdown |

Filters stack. To search videos OR PDFs:

```json
{
  "query": "onboarding",
  "filters": ["/icon/video", "/icon/application/pdf"]
}
```

`buildIconFilters` helper at  is the canonical implementation — copy it.

## Label filters (preview)

The other big filter type is **classification labels**: `/classification.labels/{labelset}/{label}`. You'll go deep on these in the Advanced course (Build 4). For now, recognise the pattern: ARAG ships with no preset taxonomy — partners design labelsets per customer corpus and filter by them.

A query for "compliance content" might filter to `/classification.labels/audience/legal-team`. A query for "support tickets" might filter to `/classification.labels/content-type/escalation AND /classification.labels/priority/critical`.

Build 1 doesn't ask you to design labelsets yet — that's an Advanced topic. But know that ARAG handles label-based filtering through the same `filters` array you use for icon paths. The widget library wires this through too.

## Deep-link UX

Every search and every chat conversation should be a shareable URL. ARAG widgets — and  — implement this with `?q=` query parameters:

```
https://your-site.example/assistant?q=what+is+ARAG
```

 has the canonical pattern: read the `?q=` param on mount, fire the query exactly once via an `autoSubmittedRef`, then `navigate('/assistant', { replace: true })` to strip the URL.

Why strip it? Because if you don't, every page refresh re-fires the query and the user thinks they're going crazy. Strip after the first fire.

**Commercial wedge:** every conversation becomes a marketing channel. A user who finds the right answer can paste the URL into Slack/Teams and the colleague lands on the same answer instantly. Most chatbot vendors don't ship this; partners who do, win.

## Common pitfalls in Build 1

1. **Embedding the widget in an iframe.** Don't. Iframes break the CSS-variable inheritance, the height auto-adjustment, and the focus management. Embed via custom element directly.
2. **Forgetting to escape your service-account JWT in HTML.** The JWT contains `_` and `-` characters but no HTML-special chars; you're usually fine. But if your CMS has an XSS filter, it may strip the apikey attribute. Inspect the rendered HTML.
3. **Theming with `!important` everywhere.** Don't. Use the CSS variables. The widgets respect them; if a colour isn't changing, you're using the wrong variable name or hitting a higher-specificity rule from your own CSS.
4. **Hardcoding the KB credentials in client-side HTML for production.** This Build is OK for sandbox / demo. For production, never expose service-account keys to the browser; proxy through your backend. (We'll cover production credential handling in Build 6.)
5. **Building a custom chat UI from scratch when the widget would do.** A custom chat UI is appropriate for Tier 2 demos (Build 2). For Tier 1 "we want a chatbot on our marketing site" demos, ship the widget. Save your engineering time.

## What you'll build in the walkthrough

Two deliverables:

1. A static HTML page (could be your own marketing site, a Codepen, a partner sandbox) with a working `<nuclia-search-bar>` + `<nuclia-search-results>` + `<nuclia-chat>` against your Build 0 KB, branded with your partner palette.
2. A "Demo a chatbot in 30 minutes" playbook — a one-pager you can hand to a sales rep that walks them through embedding the widgets on a customer's site live in the demo room.

## Onward

When you've finished the walkthrough and passed the [quiz](quiz.md), move to [Build 2 — Multi-surface conversational intelligence](../build-2-multi-surface-conversational/lesson.md).

Build 2 is where you stop using the widgets and start writing your own chat UI — because at Tier 2 you're routing the same KB through different prompt voices for different audiences, and the widgets don't ship that out of the box.
