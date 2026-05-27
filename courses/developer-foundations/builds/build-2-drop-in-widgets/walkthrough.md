# Build 2 — Walkthrough: Drop-in Widgets

> Estimated time: 1.5 hours focused. Read the [lesson](lesson.md) first.

## Goal

A static HTML page hosted on a public URL, branded to your partner palette, with working search + chat against your sandbox KB. Plus a one-page playbook a sales rep can use to replicate the build in front of a customer in 30 minutes.

## 1. Bootstrap the page (15 min)

Open your AI assistant. Brief:

```
Build me a single static HTML file index.html that:

1. Loads the Nuclia widget library from
   https://cdn.rag.progress.cloud/nuclia-widget.umd.js
2. Renders a hero header with the title "Acme Knowledge Hub" (placeholder).
3. Renders a <nuclia-search-bar> with placeholder "Ask anything…",
   attributes: knowledgebox, zone, apikey (all as placeholders I'll fill in).
4. Renders <nuclia-search-results> below the bar.
5. Renders <nuclia-chat> with mode="light" — floating chat in bottom right.
6. Includes a <style> block that uses these CSS custom properties:
   --nuclia-color-primary, --nuclia-color-secondary, --nuclia-color-background,
   --nuclia-color-text, --nuclia-color-border, --nuclia-font-family.
   Set them to my brand palette (placeholders I'll fill in).
7. Centers content in a max-width 960px container.

No build step, no React. Just HTML + CSS + the widget script tag.
```

Save the AI's response as `index.html`. Replace placeholders with your KB credentials + brand palette.

## 2. Serve locally (5 min)

```bash
npx serve .
```

Visit the URL the command prints. You should see:

- Header with brand primary colour.
- Search bar accepting input.
- Type a query → press Enter → results appear.
- Chat bubble in bottom-right; click to open; ask a question; streaming answer.

If results don't appear, open browser DevTools and check the network tab for failing requests. The most common issue is a typo in `knowledgebox`, `zone`, or `apikey`.

## 3. Add a content-type filter (10 min)

Add `filters='["/icon/application/pdf"]'` to your `<nuclia-search-bar>`. Reload. Confirm search now returns PDFs only.

Add a second search bar — duplicate of the first but with `filters='["/icon/video"]'`. Confirm the two surfaces return different results for the same query.

## 4. Wire `?q=` deep-link (15 min)

Open `http://localhost:3000?q=onboarding` (or any query that has matches in your corpus). Confirm the search auto-fires on page load and results render without you clicking anything.

If your widget version doesn't auto-fire from `?q=`, brief the AI:

```
Add a small <script> at the bottom of index.html that:
- Reads ?q= from the URL on page load.
- If present, sets the search-bar's value attribute to the query.
- Programmatically triggers the search.
- Uses history.replaceState to strip ?q= from the URL after firing.

Don't break anything else. The widget should still work normally if ?q= isn't present.
```

Test: open `?q=onboarding`, verify it fires once, then reload — confirm it doesn't fire again.

## 5. Deploy to a public URL (15 min)

Easiest options:

- **GitHub Pages.** Push to a public repo; enable Pages.
- **Vercel** drag-and-drop on `vercel.com` or `vercel deploy` from CLI.
- **Netlify Drop** (`https://app.netlify.com/drop`).

Whichever you pick, capture the public URL. You need it for the recording.

## 6. Write the 30-minute demo playbook (15 min)

Open your AI:

```
Write me a one-page markdown playbook called "Demo a Chatbot in 30 Minutes" that a
non-technical sales rep can hand to a customer demo participant. The playbook walks
them through:

1. Five-minute setup: open the index.html template, paste a KB UUID + API key + zone.
2. Ten-minute branding: edit five CSS variables (primary, secondary, background, text,
   font). Reload. Show the result.
3. Ten-minute filters: add a filters attribute to the search bar. Show how content-type
   filtering changes results.
4. Five-minute deep link: append ?q=<question> to the URL; show shareable answers.

Each step should have an example before/after the change, narrated in plain English.
End with a one-sentence pitch the rep can read aloud at the start of the demo.
```

Save the AI's response as `playbook.md` in this Build folder.

## 7. Record a 3-minute walkthrough (15 min)

Record yourself:

1. (30 sec) Showing the public URL of your branded page.
2. (60 sec) Asking a search query → showing results. Then opening chat → asking a question → showing the streaming answer.
3. (45 sec) Toggling to the PDF-only filter; showing the same query returns different results.
4. (45 sec) Closing: "30 minutes from blank page to this. No backend. No engineering team. This is what we hand to the customer's marketing team — they own it after this."

Upload to `#build-clinic-submissions`.

## Verification checklist

- [ ] `index.html` deployed to a public URL.
- [ ] Branded with partner palette (CSS variables visibly applied).
- [ ] Working search + chat.
- [ ] At least one content-type filter demonstrably scoping results.
- [ ] `?q=` deep-link auto-fires once and strips itself.
- [ ] `playbook.md` written.
- [ ] `prompt-log.md` saved with the prompts you used.
- [ ] 3-minute recording submitted.

## Next

[Build 3 — Conversational Surfaces](../build-3-conversational-surfaces/) — where you stop using the widgets and vibe-code a custom chat UI with two prompt modes (prospect vs member).
