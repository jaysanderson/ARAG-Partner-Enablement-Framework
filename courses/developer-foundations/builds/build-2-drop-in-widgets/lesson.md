# Build 2 — Lesson: Drop-in Widgets

> Read time: 8 minutes. Companion to the 7-minute [video](video-script.md).

## Why this is in the course

Half the customers you'll demo to don't have a development team standing by. They have a marketing site on WordPress, a knowledge centre on Zendesk, a member portal on something they can barely touch. For those customers, the time between "POC kickoff" and "we have a chatbot live on our brand" is the difference between closing the deal and being told *"we'll think about it."*

Nuclia ships a widget library — standard Web Components — that gets there in 30 minutes with no backend code. **And almost none of that 30 minutes is spent in a text editor.** The Nuclia dashboard ships a **widget configurator** — a no-code UI that picks widgets, sets options, applies brand colours, configures filters, and generates the embed snippet for you. The partner's job is to know what every option does and which combinations fit which customer; the partner's editor only sees one paste.

## The widget configurator (where the work actually happens)

Open any Knowledge Box in the Nuclia dashboard and you'll find a **Widget** (or **Embed** / **Integration**) tab. Three panes:

- **Configuration** on the left — every option organised into sections (widget type, display, search behaviour, generation, branding, filters, language, advanced).
- **Live preview** in the middle — updates as you change options.
- **Code panel** on the right — the embed snippet that lands on a partner's clipboard with one click.

This is the demo move. A sales rep can sit next to a customer's marketing manager, walk them through the panels, let *them* pick a primary colour, a placeholder text, a filter — and the customer watches the preview repaint in real time. Then one paste into a static HTML file and the customer takes it home.

## The four widgets

The configurator emits one or more of these four Web Components into the generated snippet:

- **`<nuclia-search-bar>`** — the search input. Fires the query, displays autocomplete.
- **`<nuclia-search-results>`** — the results list. Renders below the bar, citations included.
- **`<nuclia-chat>`** — floating chat button + popup chat window, OR an inline-anchored conversational panel. Streaming answers, citations, multi-turn.
- **`<nuclia-popup>`** — a modal that opens a result for inline reading without leaving the page.

A generated snippet looks roughly like this (your configurator-set options become the attributes):

```html
<script src="https://cdn.rag.progress.cloud/nuclia-widget.umd.js"></script>

<nuclia-search-bar
  knowledgebox="YOUR_KB_UUID"
  zone="aws-eu-1"
  apikey="YOUR_SERVICE_ACCOUNT_JWT"
  placeholder="Ask anything…"
  features="autocompleteFromNERs,suggestLabels"
  filters='["/n/s/-product-"]'
></nuclia-search-bar>

<nuclia-search-results></nuclia-search-results>

<nuclia-chat
  knowledgebox="YOUR_KB_UUID"
  zone="aws-eu-1"
  apikey="YOUR_SERVICE_ACCOUNT_JWT"
  mode="light"
  features="citations,sources_first"
></nuclia-chat>
```

Two `<script>` lines and a handful of custom-element tags. No build step, no React, no framework — paste into any HTML file and it works.

## What the configurator controls

The configuration panel exposes a wide spread of options. Build 2's walkthrough has you click through every section; here's the conceptual map:

### Widget type

- Pick **search bar + results**, **floating chat**, **inline chat**, **popup**, or any combination.
- Common Tier 1 mix: search bar at the top of the page + floating chat in the corner.

### Display + layout

- **Search bar layout**: compact (header-sized), full-width, hero (large with surrounding margin).
- **Result-list layout**: list / card / compact.
- **Chat position**: bottom-right, bottom-left, anchored inline in the page flow.
- **Theme**: light, dark, system-auto.

### Search behaviour

- **Placeholder text**.
- **Autocomplete / suggestions**: on/off.
- **Search trigger**: search-as-you-type vs. press-Enter.
- **Keyboard shortcut indicator** (`⌘ K`).
- **Result count** (page size).

### Generation (chat) behaviour

- **Streaming**: token-by-token vs. complete-response.
- **Citations style**: inline footnotes, trailing list, hidden.
- **Sources before answer**: show retrieved documents before the generated answer.
- **Multi-turn / follow-up**: allow conversation memory within a session.
- **Default suggested questions**.

### Branding

- Colour pickers for primary, secondary, background, text, border.
- Font family.
- Optional logo upload.

### Filters

- Free-text filter expression — accepts any valid Nuclia filter path.

### Language

- Pin every answer to a specific language regardless of the query language.

The point of Build 2's walkthrough is to **see all of these options at least once**, not to memorise the JSON. The configurator is the partner's no-code surface; mastering it means a partner can ship customer-customised widget pages without ever opening an editor.

## Branding — three layers from no-code to deep

The configurator covers the no-code layer; partners who need more can drop down two levels.

### Layer 1 — Configurator brand panel (the no-code path)

Pick colours in the dashboard. Embed snippet inherits them. This is the path 90% of partner engagements use, and it's what Build 2 practises.

### Layer 2 — CSS variables (the fast partner-developer path)

If the configurator's brand panel doesn't expose enough, the widgets read inherited CSS custom properties via the Shadow DOM. Drop a `<style>` block into your HTML with:

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

Five CSS variables and you've themed the entire widget set. The widgets cross the Shadow DOM boundary cleanly for these standard tokens.

### Layer 3 — `csspath` (full CSS injection)

For per-element overrides, bespoke animations, off-brand hover states:

```html
<nuclia-chat
  ...
  csspath="data:text/css;base64,<base64-encoded-css>"
></nuclia-chat>
```

Encode any CSS file as base64, pass it as an attribute, the widget injects it into its Shadow DOM at mount. This is what a partner gives a customer's brand team — they edit a CSS file; the partner base64-encodes it; one attribute change ships the new look.

## Filter attributes

The search bar accepts a `filters` attribute (JSON array of filter paths). The configurator's filter panel writes this for you, but you'll see it in the generated snippet:

```html
<nuclia-search-bar
  ...
  filters='["/n/s/-product-"]'
></nuclia-search-bar>
```

Common filter prefixes:

| Filter prefix | Matches on | Example |
|---|---|---|
| `/icon/<mimetype>` | Resource content type | `/icon/application/pdf`, `/icon/video`, `/icon/audio` |
| `/n/s/<slug-fragment>` | Resource slug substring | `/n/s/-product-` (slug contains "-product-") |
| `/classification.labels/<labelset>/<label>` | Labelset value (Build 6+) | `/classification.labels/audience/legal-team` |

Stack multiple: `filters='["/icon/video", "/icon/audio"]'` → results are videos OR audios.

The slug-substring pattern (`/n/s/...`) is the cheapest filter that doesn't depend on labelsets — useful when you want to narrow a corpus to a known naming convention. Once Build 6 is done you'll usually prefer labelset filters for anything more nuanced than naming-convention scoping.

## Where the widgets fit (and where they don't)

**Widgets are right when:**
- Customer wants a chatbot or search box on their site by next week.
- The customer's brand team can supply colours but no engineering bandwidth.
- The interaction is single-mode (one voice, one audience).
- The configurator's option spread is enough — and for Tier 1 it almost always is.

**Widgets are wrong when:**
- You need different prompt modes for prospect vs member (Tier 2 — that's Build 3).
- You need to render structured outputs (Tier 3 — Build 5).
- You need a knowledge-graph navigation UI (Tier 4 — Build 7).
- The interaction needs custom post-processing — CTA pills, multi-step flows, embedded media controls (Build 9 and onward).

The widgets are a **starter**. They get the partner from zero to "live chatbot" in 30 minutes with no code. Almost every customer engagement past Tier 1 outgrows them. That's fine — the widgets close the door, then the custom build opens it wider.

## Production-grade detail

For sandbox and demo deployments, embedding the service-account JWT directly in the HTML is fine — that's what the configurator's generated snippet does. For production, **never**. Production deployments proxy ARAG calls through the partner's backend so the JWT never reaches client-side code. Build 11 covers the production hand-off.

## What's next

[Build 3 — Conversational Surfaces](../build-3-conversational-surfaces/) — where you stop using the widgets and start vibe-coding a chat UI with multiple prompt voices. The widget abstraction goes away; you control the rendering.
