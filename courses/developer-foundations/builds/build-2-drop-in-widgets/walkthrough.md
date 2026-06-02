# Build 2 — Walkthrough: Drop-in Widgets

> Estimated time: 1 to 1.5 hours focused. Read the [lesson](lesson.md) first.
>
> **The learning is in the dashboard, not the editor.** Build 2 is the one walkthrough where the Nuclia platform does almost all the work — your job is to *see* the full spread of widget options the configurator exposes, pick a configuration that fits a demo, and watch it render locally. Code is one snippet you paste; no vibe-coding required (until the playbook at the end).

## What you'll build

A local `index.html` file on your Desktop running a Nuclia widget set you configured entirely through the dashboard's Widget configurator. By the end you'll know:

- **Every widget type** the platform ships (search bar, search results, chat, popup) and when to pick each one.
- **Every display + behaviour option** the configurator exposes (placeholder text, theme, citations style, autocomplete, language, default filters).
- **The brand panel** in the configurator — how a non-developer customises colours and typography without ever touching CSS.
- **The product filter** — a one-line filter expression that narrows results to a subset of the corpus.
- The shape of the **embed code** the configurator generates, and where it goes in a static HTML file.

**No hosting, no deploy, no public URL.** The file lives on your Desktop and opens in your browser like any other local file. The goal is platform fluency — you should be able to walk a customer through the configurator from memory after this Build.

## What you'll need open

- **Your Nuclia dashboard** (Knowledge Box still ingested from Build 0).
- **Your code editor** (VS Code recommended) — you'll paste one snippet, that's it.
- **A modern web browser** (Chrome / Edge / Firefox / Safari — any current version).
- **Your AI assistant** — only used in Step 9 (the demo playbook). Skip it until then.

---

## Step 1 — Create your local file (5 min)

Open VS Code (or any text editor). **File → New File**. Save it into `~/Desktop/foundations-build-2/` (create the folder if it doesn't exist) as `index.html`. Paste this minimal skeleton in and save:

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
    <!-- The Nuclia widget embed code will be pasted here in Step 7. -->
  </div>
</body>
</html>
```

That's the entire HTML you'll write in this Build. Everything else comes from the dashboard.

---

## Step 2 — Open the widget configurator in your dashboard (5 min)

This is where Build 2 happens. The Nuclia dashboard exposes a **widget configurator** — a no-code UI that builds the embed snippet for you. Spend 5 minutes orienting before configuring anything.

1. Open your Nuclia dashboard and select your Knowledge Box.
2. Look for a tab called **Widget**, **Widgets**, or **Embed** in the left-hand nav (wording varies by tenant).
3. You'll see three panes:
   - A **configuration panel** on the left (tabs / sections covering the widget options).
   - A **live preview** in the middle that updates as you change options.
   - A **code panel** on the right showing the generated embed snippet.
4. Don't change anything yet. Take a minute to scroll through the configuration panel sections — read the option labels. There are usually 5-8 sections (Widget type, Display, Search behaviour, Generation, Branding, Filters, Language, Advanced). The exact wording differs by version.

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

### 4a. Search-bar widget options

Common options on the search-bar configurator (exact wording varies):

- **Placeholder text** — what shows in the empty input. Default is usually `"Ask anything…"`. Try `"Search the product catalogue"` or your partner's brand voice.
- **Layout style** — compact (fits in a header), hero (large with surrounding margin), full-width (spans the container). Pick hero for now to see it dominate the page.
- **Autocomplete / suggestions** — whether the bar suggests queries as you type. Toggle on.
- **Show keyboard shortcut** — display `⌘ K` to open the bar with a hotkey.
- **Search trigger** — search-as-you-type vs. press-Enter-to-search. Try both; press-Enter feels less noisy for most corpora.

### 4b. Search-results widget options

- **Layout** — list view vs. card view vs. compact. Each has a different vibe.
- **Show source type** — display the document icon next to the title.
- **Show excerpts** — render a snippet of the matching text under the title (recommended; without it the results read as filenames).
- **Show citations** — surface citation chips when the answer references a source.
- **Result count** — page size for the result list (default 10).

### 4c. Chat widget options

- **Mode** — `light` (default), `dark`, `auto` (follows system theme).
- **Position** — bottom-right (default) vs. bottom-left vs. anchored inline.
- **Open by default** — auto-open the chat panel on page load (rarely a good idea outside a chat-led page).
- **Citations style** — inline footnotes vs. trailing citation list vs. hidden. Inline is the most explainable.
- **Streaming** — toggle whether answers stream token-by-token or arrive complete. Streaming is more impressive in demos.
- **Sources before answer** — show the retrieved documents before the answer is generated. Sometimes useful for trust-building.
- **Allow follow-up** — multi-turn conversation memory within a session.

### 4d. Language

- **Response language** — the configurator can pin every answer to a specific language (Spanish, French, German, Japanese, Mandarin, etc.) regardless of the query language. Default is the language of the query.

### 4e. Knowledge box scope

For most Build 2 demos you'll point at one Knowledge Box. The configurator also lets you point at multiple Knowledge Boxes if your account has them — but multi-KB routing is a Build 11 (production-readiness) conversation, not a Build 2 demo move.

**Spend at least 10 minutes** clicking through these options. Watch the preview update. When something visibly changes the experience, note which option it was — you're building the vocabulary you'll use in customer demos.

---

## Step 5 — Set the brand palette in the configurator (10 min)

Most modern widget configurators expose a **branding panel** that does the work of CSS variables for you — colour pickers, font-family field, optional logo upload. No CSS required.

In the branding panel, set:

- **Primary colour** — the brand colour used for buttons, focused states, the chat bubble fill.
- **Secondary / accent colour** — highlight tone (focused link colour, mention pills).
- **Background colour** — the widget's surface fill.
- **Text colour** — body text.
- **Border colour** — dividers, card borders.
- **Font family** — pick a system font (`Inter`, `system-ui`, or your partner brand's chosen font if you can load it via Google Fonts).

The preview updates live. Pick a palette that's clearly *not* the default blue Nuclia ships with — you want to be able to look at your local HTML page in Step 7 and instantly tell *"yes, my colours are applying."*

> **Going beyond the configurator.** If your partner's brand needs more than what the configurator exposes — bespoke hover animations, custom result-card layouts, an off-brand chat avatar — every widget accepts a `csspath` attribute that points at a base64-encoded CSS file. That's the partner-developer's escape hatch when the no-code configurator runs out. Build 2 doesn't practice this; the configurator covers 95% of real customer demos.

---

## Step 6 — Add the product filter (5 min)

The configurator's **filters panel** exposes a free-text filter expression input. This is the same string you'd manually add as a `filters='[...]'` attribute if you were writing the HTML by hand — but the configurator embeds it for you.

In the filter input, add:

```
/n/s/-product-
```

This is Nuclia's **slug-path filter** matching any resource whose slug contains the substring `-product-`. The Build 0 sample corpus slugs its product documents that way (e.g. `aurora-terratrek-7-product`, `aurora-skyline-45l-product`). With the filter applied, the widget returns only product resources; trail guides, ambassador posts, and brand stories disappear.

Watch the live preview run a query — confirm the result list snaps to products only.

**If the preview shows zero results:** open one of your product documents in the dashboard's resource browser and check the actual slug. If your corpus uses a different pattern, adjust the filter substring to match (`/n/s/product-` for prefix, or `/icon/application/pdf` if you'd rather filter to PDFs as a first try). The configurator accepts any valid Nuclia filter path.

This is the first taste of filtering. Build 7 (Smart Filters) wires this into a much richer faceted UI driven by labelsets.

---

## Step 7 — Copy the embed code and paste it into your local file (5 min)

Now ship it locally.

1. In the configurator's **code panel** (the right-hand pane), click the **copy button**. The full embed snippet — script tag, configured widget elements with your credentials and options baked in — lands on your clipboard.
2. Switch to VS Code and open the `index.html` you created in Step 1.
3. Find the comment line `<!-- The Nuclia widget embed code will be pasted here in Step 7. -->`.
4. Replace that comment with the snippet from your clipboard. Save.
5. Open Finder, navigate to `~/Desktop/foundations-build-2/`, and **double-click `index.html`**. Your default browser opens the file.

**You should see:**

- Your "My ARAG widget" hero header.
- The search bar configured the way you set it (hero / compact, your placeholder text, your brand colour).
- The chat bubble in the position and theme you picked.

**Test it:**

- Type a query into the search bar and press Enter. Results render below — only product resources (the filter is working).
- Click the chat bubble. Type the same query. The answer streams in (or arrives complete, depending on your Step 4c choice).

**If nothing renders:** open the browser's DevTools (right-click → Inspect → Console tab). Look for red errors.

| Error | Likely cause | Fix |
|---|---|---|
| 401 / 403 in Network tab | Wrong API key in the snippet (regenerate from the configurator) | Re-copy the snippet — the configurator may have rotated the key |
| 404 from CDN | Widget URL wrong (very rare) | Re-copy the snippet |
| "Failed to fetch" CORS | Wrong zone in the snippet | Re-confirm your Knowledge Box region in the dashboard, regenerate |
| Page loads but nothing happens | The snippet wasn't pasted between the `<body>` tags | Re-check Step 7 step 3 |
| Filter returns zero results | Slug pattern doesn't match your corpus | See Step 6's "If the preview shows zero results" note |

---

## Step 8 — Generate a second configuration and compare (10 min) — optional but recommended

Go back to the configurator. Change three to five options — for example:

- Flip the theme from light to dark.
- Change the placeholder text.
- Remove the floating chat; add the popup widget instead.
- Drop the product filter so all content shows.
- Switch the response language to Spanish.

Copy the new embed code. In VS Code, **File → New File**, save as `index-v2.html` in the same folder. Paste your Step 1 skeleton, then paste the new snippet between the body tags. Save. Double-click to open.

**Open both files side-by-side** in two browser windows. Same Knowledge Box, same corpus, two configurations — same query in each returns different visual treatments, different result scopes, different languages.

**This is the demo move for a Tier 1 customer.** A sales rep can change the look-and-feel of the entire experience in 60 seconds without ever calling for a developer. That's the pitch of widgets — and it's what makes them the right starter for any customer who hasn't committed to a custom build yet.

---

## Step 9 — Write the demo playbook (15 min)

The whole pitch of widgets is *"a sales rep can put this in front of a customer in 30 minutes."* You're going to write the literal playbook that proves it.

Open your AI assistant. Paste this brief:

```
Write me a one-page markdown playbook titled
"Demo a Chatbot in 30 Minutes" that a non-technical sales rep can
hand to a customer demo participant. The playbook walks them through:

1. Five-minute setup: open the Nuclia dashboard, navigate to the
   Widget configurator on a Knowledge Box. Show the three panes
   (configuration / live preview / code).
2. Ten-minute exploration: walk the customer through the widget-type
   picker (search vs chat) and the display options (layout,
   placeholder, theme, citations) — let THEM pick options while you
   narrate what changes in the preview.
3. Five-minute branding: open the brand panel; let the customer pick
   their primary colour and font. Live preview updates.
4. Five-minute filter demo: add a filter expression that narrows
   results to a content subset relevant to the customer (e.g.
   /n/s/-product- for product catalogues, or /classification.labels/
   audience/customer for audience-scoped views). Show the result-set
   change live.
5. Five-minute close: copy the embed code from the dashboard's code
   panel; paste into a local index.html; double-click; the customer
   sees the same experience running on their machine.

Each step should have:
- A "you say:" line (talk track for the rep).
- A "you click:" line (what action in the dashboard).
- One sentence narrating what the customer is seeing change.

End with a one-sentence pitch the rep can read aloud at the start
of the demo.

Plain markdown. No code fences for the prose parts. Keep it to
one printed page.
```

Save the result as `playbook.md` in your `foundations-build-2` folder.

This playbook is **part of your Build 2 submission**. Reviewers check it for clarity.

---

## Step 10 — Save your prompts (5 min)

Create `prompt-log.md` in your project folder. Paste:

1. The playbook brief from Step 9.
2. Any debugging prompts you used (filter-syntax discovery, dashboard option not behaving as expected, etc.).

This is the institutional knowledge for the next partner running this demo.

---

## Verification checklist

- [ ] At least **5 configurator options** changed from defaults — written down which 5, so you can recite them later (e.g. "placeholder, theme, layout, citation style, filter").
- [ ] **Brand palette** visibly applied — primary colour clearly *not* Nuclia's default blue.
- [ ] **Product filter** working — search returns product resources only.
- [ ] `index.html` opens by double-click on your Desktop and renders the configured widgets.
- [ ] **Both widget types** demoed — search bar with results AND a chat surface.
- [ ] (Optional) `index-v2.html` with a second configuration — you've seen two visibly different setups against the same Knowledge Box.
- [ ] `playbook.md` saved — one-page, demo-ready, configurator-focused.
- [ ] `prompt-log.md` saved.

Then take the [Build 2 quiz](quiz.md). Pass → start [Build 3](../build-3-conversational-surfaces/).

---

## Getting unstuck

**The Widget tab doesn't exist on my Knowledge Box.**
- Some older Nuclia tenants surface it as "Embed" or "Integration"; check the side nav carefully. If it's genuinely missing, your account may need a permission flip — message your Progress partner manager.

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

**Branding doesn't apply (configurator preview shows correct colours, but local HTML doesn't).**
- The configurator's brand panel writes the colours INTO the embed snippet. If your local copy doesn't reflect the colours, regenerate the snippet AFTER making the brand changes — the configurator doesn't always push live changes to an already-generated snippet until you click "regenerate" or copy fresh.

**Anything else.**
- Open DevTools → Console. Screenshot the error. Paste into your AI: *"Widget doesn't render. Console shows X. Snippet looks like Y."*
- Re-test.

---

## Next

[Build 3 — Conversational Surfaces](../build-3-conversational-surfaces/) — where you stop using the pre-built widgets and vibe-code a custom chat UI with two prompt modes (prospect vs member). This is the first Build where you control the rendering — the widget abstraction goes away.
