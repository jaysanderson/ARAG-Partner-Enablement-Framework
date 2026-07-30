# Build 2 — Walkthrough: Drop-in Widgets

> Estimated time: 1 to 1.5 hours focused. Read the [lesson](1-lesson.md) first.
>
> **The learning is in the dashboard, not the editor.** Build 2 is the one walkthrough where the Progress Agentic RAG platform does almost all the work — your job is to *see* the full spread of widget options the configurator exposes, pick a configuration that fits a demo, and watch it render locally. Code is one snippet you paste; no vibe-coding required.

## What you'll build

A local `index.html` file on your Desktop running a Progress Agentic RAG widget set you configured entirely through the dashboard's Widget configurator. By the end you'll know:

- **Every widget type** the platform ships (search bar, search results, chat, popup) and when to pick each one.
- **Every display + behaviour option** the configurator exposes (widget style, theme, placeholder text, citation visibility, interface language, filters).
- **The product filter** — a one-line filter expression that narrows results to a subset of the corpus.
- The shape of the **embed code** the configurator generates, and where it goes in a static HTML file.

**No hosting, no deploy, no public URL.** The file lives on your Desktop and opens in your browser like any other local file. The goal is platform fluency — you should be able to walk a customer through the configurator from memory after this Build.

## What you'll need open

- **Your Progress Agentic RAG dashboard** (Knowledge Box still ingested from Build 0).
- **Your code editor** (VS Code recommended) — you'll paste one snippet, that's it.
- **A modern web browser** (Chrome / Edge / Firefox / Safari — any current version).
- **Your AI assistant** — optional in Build 2. The dashboard does the work; you'd only ping the AI for help interpreting a filter-syntax surprise or a configurator option you can't find.

---

## Step 1 — Create your local file (5 min)

Open VS Code (or any text editor). **File → New File**. Save it into `~/Desktop/developer-foundations/build-2/` (create the folder if it doesn't exist) as `index.html`. Paste this minimal skeleton in and save:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>My ARAG widget</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    .hero { max-width: 960px; margin: 0 auto; padding: 48px 24px; }
    h1 { font-size: 28px; margin: 0 0 24px; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>My ARAG widget</h1>
    <!-- The Progress Agentic RAG widget embed code will be pasted here in Step 6. -->
  </div>
</body>
</html>
```

That's the entire HTML you'll write in this Build. Everything else comes from the dashboard.

---

## Step 2 — Open the widget configurator in your dashboard (5 min)

This is where Build 2 happens. The Progress Agentic RAG dashboard exposes a **widget configurator** — a no-code UI that builds the embed snippet for you. Spend 5 minutes orienting before configuring anything.

1. Open your Progress Agentic RAG dashboard and select your Knowledge Box.
2. Look for a tab called **Widget**, **Widgets**, or **Embed** in the left-hand nav (wording varies by tenant).
3. You'll see three panes:
   - A **configuration panel** on the left (tabs / sections covering the widget options).
   - A **live preview** in the middle that updates as you change options.
   - A **code panel** on the right showing the generated embed snippet.
4. Don't change anything yet. Take a minute to scroll through the configuration panel sections — read the option labels. There are usually 3-4 sections (Widget type, Widget style, Configuration options, Filters). The exact wording differs by version.

**The takeaway:** every option a partner might want to change in a customer engagement is in this panel. You're going to walk through each one.

---

## Step 3 — Tour the widget types (10 min)

The first section of the configurator lets you pick **which widgets** to render. The four options:

| Widget | Visual | Right when |
|---|---|---|
| **Search bar** + **Search results** | Input + scrollable result list, inline on the page | Knowledge-base / docs sites where users already know roughly what they're looking for |
| **Chat (floating)** | Bottom-right bubble that opens a conversational panel | Support sites, marketing pages, Intercom-style overlays — "ask anything" affordance without rebuilding the page |
| **Chat (inline / anchored)** | Anchored in the page flow rather than floating | Conversational landing pages where chat IS the page |
| **Popup** | Modal that opens when a result card is clicked, renders the full resource inline | Media-heavy corpora — video, audio, scanned PDFs — where you want preview without leaving context |

**Try each one.** Toggle the search bar on; uncheck the chat. Then flip — chat on, search off. Then both on. Watch the preview pane update each time.

**For Build 2, configure both the search-bar widget AND the floating chat.** That's the most common Tier 1 demo configuration — "I want a search box at the top AND a chat bubble in the corner of every customer page."

---

## Step 4 — Tour the display + behaviour options (15 min)

This is the long step. For each widget you've enabled, the configurator exposes a stack of options. Walk through each one, change it, see how the preview reacts, and read the result against what a customer would want.

### 4a. Create a widget and pick its style

You can create multiple named widgets, each with its own style:

- **Embedded in page**
- **Chat mode**
- **Popup modal style**
- **Floating chat button**

Style is changeable at any time per widget.

### 4b. Configuration options

#### Cosmetic

- **Theme** — light or dark.
- **Display search button**.
- **Customize text blocks visibility** — expanded or collapsed by default.
- **Customize citation visibility** — expanded or collapsed by default.
- **Hide Progress Agentic RAG logo from search bar** — growth/enterprise plans only.
- **Position**, **size**, **panel width**, **panel height**, **bottom offset**, **side offset** (Floating chat button only).

#### Behavioural

- **No chat history** — previous Q&A aren't passed as context when generating a new answer.
- **Persist chat history** — stored in the browser's localStorage and restored on reload (chat widget only).
- **Navigate to links origin / files of origin / origin URL** — clicking a result opens the original page/file/URL instead of rendering it in the viewer.
- **Open in a new tab** — only available when a navigate-to-origin option is on.
- **Hide download button**.
- **Permalinks** — adds parameters so users can copy/share a direct link to a specific resource or search result.

#### Text customization

- **Customize search bar placeholder** — toggle on, then set the placeholder text. Default is `"Type your question here"`.
- **Customize chat bar placeholder** — same idea for the chat input. Default is `"Let's talk"`.
- **Customize insufficient data message** — the message shown when there's not enough context to answer (HTML markup allowed). Default is `"Not enough data to answer this."`.
- **Copy button disclaimer** — shown when a user copies the answer.

#### Feedback

- **Feedback** — no feedback / global feedback on the answer / detailed feedback on answer and search results. Try "Detailed" — it's the most common Tier 1 setting.

#### Language

- **Language** — free-text field (2-character code). Sets the widget's own interface language; defaults to the browser's locale. The UI ships translations for `en`, `ca`, `es`, `fr`, but accepts any code.

**Spend at least 10 minutes** clicking through these options. Watch the preview update. When something visibly changes the experience, note which option it was — you're building the vocabulary you'll use in customer demos.

---

## Step 5 — Add the product filter (5 min)

The configurator's **filters panel** exposes a free-text filter expression input. This is the same string you'd manually add as a `filters='[...]'` attribute if you were writing the HTML by hand — but the configurator embeds it for you.

In the filter input, add:

```
/n/s/-product-
```

This is Progress Agentic RAG's **slug-path filter** matching any resource whose slug contains the substring `-product-`. The Build 0 sample corpus slugs its product documents that way (e.g. `aurora-terratrek-7-product`, `aurora-skyline-45l-product`). With the filter applied, the widget returns only product resources; trail guides, ambassador posts, and brand stories disappear.

Watch the live preview run a query — confirm the result list snaps to products only.

**If the preview shows zero results:** open one of your product documents in the dashboard's resource browser and check the actual slug. If your corpus uses a different pattern, adjust the filter substring to match (`/n/s/product-` for prefix, or `/icon/application/pdf` if you'd rather filter to PDFs as a first try). The configurator accepts any valid Progress Agentic RAG filter path.

This is the first taste of filtering. Build 7 (Smart Filters) wires this into a much richer faceted UI driven by labelsets.

---

## Step 6 — Copy the embed code and paste it into your local file (5 min)

Now ship it locally.

1. In the configurator's **code panel** (the right-hand pane), click the **copy button**. The full embed snippet — script tag, configured widget elements with your credentials and options baked in — lands on your clipboard.
2. Switch to VS Code and open the `index.html` you created in Step 1.
3. Find the comment line `<!-- The Progress Agentic RAG widget embed code will be pasted here in Step 6. -->`.
4. Replace that comment with the snippet from your clipboard. Save.
5. Open Finder, navigate to `~/Desktop/developer-foundations/build-2/`, and **double-click `index.html`**. Your default browser opens the file.

**You should see:**

- Your "My ARAG widget" hero header.
- The search bar configured the way you set it (your placeholder text, theme).
- The chat bubble in the style, position, and theme you picked.

**Test it:**

- Type a query into the search bar and press Enter. Results render below — only product resources (the filter is working).
- Click the chat bubble. Type the same query. The answer streams in.

**If nothing renders:** open the browser's DevTools (right-click → Inspect → Console tab). Look for red errors.

| Error | Likely cause | Fix |
|---|---|---|
| 401 / 403 in Network tab | Wrong API key in the snippet (regenerate from the configurator) | Re-copy the snippet — the configurator may have rotated the key |
| 404 from CDN | Widget URL wrong (very rare) | Re-copy the snippet |
| "Failed to fetch" CORS | Wrong zone in the snippet | Re-confirm your Knowledge Box region in the dashboard, regenerate |
| Page loads but nothing happens | The snippet wasn't pasted between the `<body>` tags | Re-check Step 6 step 3 |
| Filter returns zero results | Slug pattern doesn't match your corpus | See Step 6's "If the preview shows zero results" note |

---

## Step 7 — Generate a second configuration and compare (10 min) — optional but recommended

Go back to the configurator. Change three to five options — for example:

- Flip the theme from light to dark.
- Change the placeholder text.
- Switch the widget style — e.g. from Embedded in page to Floating chat button.
- Drop the product filter so all content shows.
- Switch the interface language to Spanish (`es`).

Copy the new embed code. In VS Code, **File → New File**, save as `index-v2.html` in the same folder. Paste your Step 1 skeleton, then paste the new snippet between the body tags. Save. Double-click to open.

**Open both files side-by-side** in two browser windows. Same Knowledge Box, same corpus, two configurations — same query in each returns different visual treatments and different result scopes.

**This is the demo move for a Tier 1 customer.** A sales rep can change the look-and-feel of the entire experience in 60 seconds without ever calling for a developer. That's the pitch of widgets — and it's what makes them the right starter for any customer who hasn't committed to a custom build yet.

---

## Key Takeaways

By the end of this Build you should be able to recite what the configurator's panels control — without notes. Specifically:

- **The dashboard does the work, not the editor.** The Progress Agentic RAG widget configurator is the no-code surface partners use 90% of the time. Code only appears at the very end when you paste one snippet into a local HTML file.
- **Four widget types**: `<nuclia-search-bar>`, `<nuclia-search-results>`, `<nuclia-chat>` (floating or inline), `<nuclia-popup>`. Pick the combination that fits the customer's site — most Tier 1 demos use search + chat together.
- **Display + behaviour options** are exposed in the configurator's panels: widget style (Embedded in page / Chat mode / Popup modal style / Floating chat button), theme, chat-history behaviour, navigation and feedback toggles, placeholder and insufficient-data-message text, interface language. Every option is a customer-conversation lever.
- **Filtering is one expression**. The configurator's filter panel writes the same `filters` attribute you'd hand-author. The `/n/s/-product-` slug-substring pattern in this Build is the simplest no-labelset filter; once Build 6 is done you'll use labelset filters (`/classification.labels/<labelset>/<label>`) for anything richer.
- **The embed code is just three custom-element tags plus a script** — your KB ID, zone, API key are baked in by the dashboard. One paste. No build step. The whole demo runs as a local file you double-click; no hosting, no deploy, no public URL.
- **When widgets are the wrong choice**: different prompt voices per audience (Build 3 territory), structured outputs (Build 5), knowledge-graph navigation (Build 8), custom CTA pills or post-processing (Build 9+). Past Tier 1 the widget abstraction starts to limit you; that's when you graduate to hand-rolled React.

---

## Step 8 — Save your prompts (5 min)

Create `prompt-log.md` in your project folder. Paste any debugging prompts you used (filter-syntax discovery, dashboard option not behaving as expected, etc.).

This is the institutional knowledge for the next partner running this demo.

---

## Verification checklist

- [ ] At least **5 configurator options** changed from defaults — written down which 5, so you can recite them later (e.g. "placeholder, theme, widget style, citation visibility, filter").
- [ ] **Product filter** working — search returns product resources only.
- [ ] `index.html` opens by double-click on your Desktop and renders the configured widgets.
- [ ] **Both widget types** demoed — search bar with results AND a chat surface.
- [ ] (Optional) `index-v2.html` with a second configuration — you've seen two visibly different setups against the same Knowledge Box.
- [ ] `prompt-log.md` saved.

Then take the [Build 2 quiz](3-quiz.md). Pass → start [Build 3](../build-03-conversational-surfaces/).

---

## Getting unstuck

**The Widget tab doesn't exist on my Knowledge Box.**
- Some older Progress Agentic RAG tenants surface it as "Embed" or "Integration"; check the side nav carefully. If it's genuinely missing, your account may need a permission flip — message your Progress partner manager.

**The configurator's preview pane is blank or perpetually loading.**
- Hard-refresh the dashboard (Cmd/Ctrl + Shift + R). The configurator caches state; a stale token after a long idle can stall the preview.

**My local HTML page loads but the widget area is empty.**
- Open DevTools → Console. Most common cause: the `<script src="...">` tag at the top of the pasted snippet got truncated. Re-copy from the configurator and re-paste.

**Search returns zero results no matter what I type.**
- Either your filter expression is too strict (try removing the filter in the configurator first, regenerating, and pasting fresh), or the Knowledge Box is empty (re-confirm the Build 0 ingest finished and the resources are visible in the dashboard's resource browser).

**Chat works but search doesn't (or vice versa).**
- The configurator must have a coherent set of widget-type toggles. If you somehow ended up with `<nuclia-chat>` but not `<nuclia-search-bar>` in the snippet, regenerate.

**Filter returns zero results.**
- Open one of your product resources in the dashboard's resource browser and check its actual slug. Adjust the filter substring to match (`/n/s/product-` if products are slugged `product-foo`, or check the labelset path if your corpus tags products differently).

**Configurator preview shows what I want, but the local HTML doesn't match.**
- The configurator writes your chosen options INTO the embed snippet. If your local copy doesn't reflect a recent change, regenerate the snippet AFTER making the change in the dashboard — the configurator doesn't always push live changes to an already-generated snippet until you click "regenerate" or copy fresh.

**Anything else.**
- Open DevTools → Console. Screenshot the error. Paste into your AI: *"Widget doesn't render. Console shows X. Snippet looks like Y."*
- Re-test.

---

## Next

[Build 3 — Conversational Surfaces](../build-03-conversational-surfaces/) — where you stop using the pre-built widgets and vibe-code a custom chat UI with two prompt modes (prospect vs member). This is the first Build where you control the rendering — the widget abstraction goes away.
