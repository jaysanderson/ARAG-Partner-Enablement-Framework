# Build 2 — Walkthrough: Drop-in Widgets

> Estimated time: 1.5–2 hours focused. Read the [lesson](lesson.md) first.
>
> **No backend. No React. No build step.** This Build is one HTML file you can edit in any text editor. If your previous experience with "the web" is "I've made things bold in WordPress" — you can do this.

## What you'll build

A single HTML page, branded to your partner palette, with:

- A working **search bar** (instant search against your KB).
- A floating **chat bubble** (streaming Q&A with citations).
- A **content-type filter** to scope to PDFs only.
- A **deep-link query** (`?q=...`) that auto-fires the search on page load.

Deployed to a public URL anyone can open in a browser. **This is the fastest "we have a chatbot" demo in the course** — 30 minutes from blank file to working page.

## What you'll need open

- **Your Nuclia dashboard** (KB still ingested from Build 0).
- **Your `.env` file** — or just have the three credentials handy.
- **Your code editor** (VS Code recommended).
- **Your AI assistant**.
- **A modern web browser** (Chrome / Edge / Firefox / Safari — any current version).

You also need a free account on **one of these deploy targets** (we'll cover this in Step 7):

- **Netlify Drop** ([app.netlify.com/drop](https://app.netlify.com/drop)) — easiest, drag-and-drop, no login required.
- **Vercel** ([vercel.com](https://vercel.com)) — free tier, GitHub login.
- **GitHub Pages** — if you already have a GitHub account.

Pick whichever is least intimidating. **Netlify Drop** wins for "I just want to ship one file."

---

## Step 1 — Set up your project folder (5 min)

Open your terminal:

```bash
cd ~/Desktop
mkdir foundations-build-2
cd foundations-build-2
```

**What that did:** created a fresh folder for this Build's work and moved into it.

Open the folder in VS Code (or your editor):

```bash
code .
```

(`code .` opens VS Code in the current folder. If `code` isn't set up, open VS Code manually then File → Open Folder.)

You'll only edit **one file** in this Build: `index.html`. We'll create it next.

---

## Step 2 — Find the widget snippet in your Nuclia dashboard (5 min)

ARAG ships pre-built widgets — drop-in HTML components that handle search and chat UI for you. You don't write the JavaScript; you just paste the snippet.

1. Open your Nuclia dashboard.
2. Open your KB.
3. Look for a tab called **Widget**, **Embed**, or **Integration** (wording varies by tenant).
4. You'll see a generated HTML snippet. Copy it into a scratchpad — we'll reference its shape.

**The snippet looks roughly like this** (yours will have your actual KB ID, zone, and API key filled in):

```html
<script src="https://cdn.rag.progress.cloud/nuclia-widget.umd.js"></script>

<nuclia-search-bar
  knowledgebox="YOUR_KB_ID"
  zone="aws-eu-1"
  apikey="YOUR_API_KEY"
  placeholder="Ask anything…">
</nuclia-search-bar>

<nuclia-search-results></nuclia-search-results>

<nuclia-chat
  knowledgebox="YOUR_KB_ID"
  zone="aws-eu-1"
  apikey="YOUR_API_KEY"
  mode="light">
</nuclia-chat>
```

**What each piece does:**
- `<script src="...">` loads the widget library.
- `<nuclia-search-bar>` is the input field. The user types here.
- `<nuclia-search-results>` is where matched documents render.
- `<nuclia-chat>` is the floating chat bubble (bottom-right by default).

You have **three credentials** to paste:
- `knowledgebox` — your KB UUID (same as `NUCLIA_KB_ID` from Build 0).
- `zone` — the region prefix from your API URL (`aws-eu-1` for EU, `aws-us-2` for US).
- `apikey` — your service-account JWT.

**Important:** the API key in widget mode goes into client-side HTML. **This is fine for a demo**. For production, you'd proxy through your backend — Build 11 covers that. For now, we're embracing the "ship in 30 minutes" promise.

---

## Step 3 — Vibe-code the page (15 min)

### 3a. Brief your AI

Open your AI assistant. Paste this brief:

```
Build me a single static HTML file index.html that:

1. Loads the Nuclia widget library from
   https://cdn.rag.progress.cloud/nuclia-widget.umd.js
2. Renders a hero header with the title "Acme Knowledge Hub"
   (I'll replace "Acme" with my partner name later).
3. Renders a <nuclia-search-bar> with placeholder "Ask anything…"
   and attributes: knowledgebox, zone, apikey (use placeholder
   values like "YOUR_KB_ID" — I'll fill them in).
4. Renders <nuclia-search-results> below the bar.
5. Renders <nuclia-chat> with mode="light" — floating chat
   bottom right.
6. Includes a <style> block that uses these CSS custom properties:
   --nuclia-color-primary, --nuclia-color-secondary,
   --nuclia-color-background, --nuclia-color-text,
   --nuclia-color-border, --nuclia-font-family.
   Set them to placeholder values (e.g., #006FFF for primary)
   that I'll customize later.
7. Centers content in a max-width 960px container with comfortable
   padding.
8. Add a small footer line "Powered by Progress Agentic RAG."

No build step. No React. Just HTML + CSS + the widget script tag.
Make it look like something a designer would be okay with —
clean spacing, sensible font weights, no clutter.
```

Send. Wait for the file.

### 3b. Save the AI's output

- **Claude Code / Cursor:** *"Save this as index.html in my current folder."*
- **Web chat (ChatGPT / Claude.ai):** copy the code, create `index.html` in your editor in the `foundations-build-2` folder, paste, save.

### 3c. Read the code before running it

Open `index.html`. Three checks:

1. The `<script>` tag loads from `cdn.rag.progress.cloud` (the widget CDN).
2. The custom elements (`<nuclia-search-bar>` etc.) have `knowledgebox`, `zone`, `apikey` attributes.
3. The `<style>` block defines the `--nuclia-color-*` variables.

If anything looks off, tell the AI to fix it.

### 3d. Plug in your credentials

In `index.html`, find every placeholder and replace:

| Placeholder | Replace with |
|---|---|
| `YOUR_KB_ID` | your KB UUID |
| `YOUR_API_KEY` | your service-account JWT |
| `YOUR_ZONE` or `aws-eu-1` placeholder | your zone (likely `aws-eu-1`) |
| `Acme Knowledge Hub` | your partner name + "Knowledge Hub" |

Save the file.

---

## Step 4 — Serve the page locally (5 min)

Open your terminal in the `foundations-build-2` folder. Run:

```bash
npx serve .
```

**What that did:**
- `npx` runs a Node.js tool without installing it permanently.
- `serve` is a tiny local web server.
- `.` means "serve files from the current folder."

**You should see:** the terminal prints a URL, usually `http://localhost:3000`.

Open that URL in your browser.

**Expected page:**
- A header with your title.
- A search bar accepting input.
- A floating chat bubble bottom-right.

### Test the search

Type a query that you know matches your corpus (the same kind of question you used in Build 0). Press Enter.

**You should see:** within ~1 second, a list of result cards appears below the bar. Each card shows a title, an excerpt, and a relevance hint.

### Test the chat

Click the floating chat bubble. A panel opens. Type the same question. Hit Enter.

**You should see:** an answer that streams in word-by-word, followed by 1–5 citation links.

### If nothing renders

Open your browser **DevTools** (right-click → Inspect, or `Cmd+Option+I` / `F12`). Click the **Console** tab.

| Error | Likely cause | Fix |
|---|---|---|
| 401 / 403 in Network tab | Wrong API key | Re-copy JWT from dashboard |
| 404 from CDN | Widget URL wrong | Re-copy the snippet URL from the dashboard |
| "Failed to fetch" CORS | Wrong zone | Check zone matches your API URL region |
| Page loads but search does nothing | Typo in `knowledgebox` | Re-copy the KB UUID |
| Nothing on the page at all | HTML is malformed | Paste the page source into your AI: "this doesn't render — what's wrong?" |

---

## Step 5 — Brand the page (15 min)

The whole point of the widgets is **white-labelling without forking code**. You change CSS variables; the widget repaints.

### 5a. Pick a palette

Grab your partner's brand colours (or use a friendly placeholder palette like the one below):

| Variable | What it controls | Example |
|---|---|---|
| `--nuclia-color-primary` | Primary brand colour (buttons, focused states) | `#0066CC` |
| `--nuclia-color-secondary` | Secondary highlights | `#FF6B35` |
| `--nuclia-color-background` | Background fill | `#FAFAFA` |
| `--nuclia-color-text` | Body text colour | `#1A1A1A` |
| `--nuclia-color-border` | Borders, dividers | `#E5E5E5` |
| `--nuclia-font-family` | Typeface | `'Inter', sans-serif` |

### 5b. Apply the palette

Find the `<style>` block in `index.html`. Edit the variables under `:root` or `body` (or wherever the AI put them):

```css
:root {
  --nuclia-color-primary: #0066CC;
  --nuclia-color-secondary: #FF6B35;
  --nuclia-color-background: #FAFAFA;
  --nuclia-color-text: #1A1A1A;
  --nuclia-color-border: #E5E5E5;
  --nuclia-font-family: 'Inter', sans-serif;
}
```

Save the file. Reload the page in your browser.

**You should see:** the search bar's border colour, the chat bubble fill, and the result-card highlights all change to your primary colour. The font changes to your chosen typeface.

**If the colours don't apply:** the widget version may use slightly different variable names. Open DevTools → Elements → click on the search bar → look at the Styles panel. The widget exposes its CSS variables — match the names you see.

---

## Step 6 — Add a content-type filter (10 min)

Customers love filters. Show how easy it is.

### 6a. Filter to PDFs only

In `index.html`, find your `<nuclia-search-bar>` tag. Add the `filters` attribute:

```html
<nuclia-search-bar
  knowledgebox="YOUR_KB_ID"
  zone="aws-eu-1"
  apikey="YOUR_API_KEY"
  filters='["/icon/application/pdf"]'
  placeholder="Ask anything…">
</nuclia-search-bar>
```

**What that did:** told the search bar to only return resources whose mimetype starts with `application/pdf`. The `/icon/` prefix is how Nuclia represents content-type filters.

Reload. Run a query. **You should see** only PDF resources in the results. Other content types (markdown, text, video) disappear.

### 6b. (Optional) Add a second bar for videos

If your corpus has any video resources, duplicate the search-bar block under the first one, with `filters='["/icon/video"]'`. Reload.

**You should see** two search bars on the page, each scoped to a different content type. The same query in each returns different results.

This is the foundation of Build 7 (Smart Filters), where you'll wire labelset filter chips into a much richer UI.

---

## Step 7 — Add the `?q=` deep-link (15 min)

Customers love **shareable URLs**. "Send your customer a link with the question pre-filled." Easy win.

### 7a. Test if the widget supports it natively

Some widget versions auto-detect `?q=` in the URL and fire the search. Try it:

Open `http://localhost:3000?q=onboarding` (replace `onboarding` with a query that has matches in your corpus).

**If the search auto-fires on page load:** great, native support. Skip to Step 8.

**If nothing happens:** continue to 7b — vibe-code a small helper.

### 7b. Vibe-code the deep-link helper

Open your AI. Paste:

```
In my index.html, add a small <script> at the bottom (just before </body>) that:

1. On page load, reads ?q= from window.location.search.
2. If ?q is present and non-empty:
   - Wait 200ms for the widget to mount (use setTimeout).
   - Find the <nuclia-search-bar> element.
   - Set its value attribute to the query.
   - Programmatically trigger the search (dispatch a "search" event,
     or call the widget's search() method if one's exposed,
     or simulate Enter being pressed in the input).
   - Then use history.replaceState to remove ?q= from the URL,
     so reload doesn't re-fire it.

3. If ?q is not present, do nothing.

Show me the script block only — I'll paste it into my existing index.html.
```

Send. Apply the snippet.

### 7c. Test

Reload `http://localhost:3000?q=onboarding`. **You should see** the search bar auto-populate and the results render — without you clicking anything. Then reload `http://localhost:3000` (no `?q`) and confirm the widget still works normally.

If the auto-fire flickers or fires twice, paste the symptom into your AI: *"The search fires twice when I open ?q=foo. Fix the script so it only fires once."*

---

## Step 8 — Deploy to a public URL (15 min)

Three options. **Pick one. We recommend Netlify Drop** because there's no account required and no CLI.

### Option A — Netlify Drop (easiest)

1. Open [app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
2. Drag your **`foundations-build-2` folder** (the whole folder, not the file) onto the drop zone.
3. Wait ~10 seconds. Netlify deploys it.
4. Copy the public URL (looks like `https://random-words-12345.netlify.app`).

**Done.** You can rename the site if you sign up; without an account the random URL is fine.

### Option B — Vercel

1. Install Vercel CLI: `npm install -g vercel`.
2. In your `foundations-build-2` folder: `vercel`.
3. Follow the prompts. Pick "yes" to all defaults. Sign in with GitHub or email.
4. Copy the public URL it prints.

### Option C — GitHub Pages

1. Create a public GitHub repo. Push your `foundations-build-2` folder contents to it.
2. Repo settings → Pages → Source: `main` branch, root.
3. Wait ~1 minute. The public URL appears at the top of the Pages tab.

**Whichever you pick:** open the public URL. Verify search + chat work. **Open it on your phone too** — confirm the widgets are responsive (they are out of the box, but it's a good check).

---

## Step 9 — Write the 30-minute demo playbook (15 min)

The whole pitch of widgets is *"a sales rep can put this in front of a customer in 30 minutes."* You're going to write the literal playbook that proves it.

Open your AI. Paste this brief:

```
Write me a one-page markdown playbook titled
"Demo a Chatbot in 30 Minutes" that a non-technical sales rep can
hand to a customer demo participant. The playbook walks them through:

1. Five-minute setup: open the index.html template, paste a KB UUID
   + API key + zone. (Tell them where to get these from the dashboard.)
2. Ten-minute branding: edit five CSS variables (primary, secondary,
   background, text, font). Reload. Show the result.
3. Ten-minute filters: add a filters attribute to the search bar.
   Show how content-type filtering changes results.
4. Five-minute deep link: append ?q=<question> to the URL; show
   shareable answers.

Each step should have:
- A "before" snippet of code.
- An "after" snippet of code.
- One sentence narrating what the customer is seeing.

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

1. The index.html brief from Step 3.
2. The deep-link script brief from Step 7b (if you used it).
3. The playbook brief from Step 9.
4. Any debugging prompts you used.

This is the institutional knowledge for the next partner who has to make a branded widget page.

---

## Verification checklist

- [ ] `index.html` deployed to a public URL (anyone can open it).
- [ ] Branded with partner palette — CSS variables visibly applied (primary colour shows up on search bar / chat bubble).
- [ ] Search returns at least one resource for a relevant query.
- [ ] Chat streams an answer with citations.
- [ ] PDF-only filter visibly scopes results.
- [ ] `?q=` deep-link auto-fires once on load, then is stripped from the URL.
- [ ] `playbook.md` saved — one-page, demo-ready.
- [ ] `prompt-log.md` saved with all your AI briefs.

Then take the [Build 2 quiz](quiz.md). Pass → start [Build 3](../build-3-conversational-surfaces/).

---

## Getting unstuck

**Page loads but the widgets don't appear at all.**
- Open DevTools → Console. Look for red errors.
- Most common: the `<script src="...">` URL is wrong, or your `apikey` is malformed (trailing space, missing characters).

**Search returns 0 results no matter what I type.**
- Wrong `knowledgebox` UUID, or your KB is empty. Re-confirm both in the dashboard.

**Chat works but search doesn't (or vice versa).**
- Check that both `<nuclia-search-bar>` and `<nuclia-chat>` have the same `knowledgebox`, `zone`, `apikey`.

**Branding doesn't apply.**
- The CSS variable names might be slightly different in your widget version. Use DevTools → Elements → select the search bar → Styles panel shows what variables are actually used.

**Deploy fails on Netlify Drop.**
- Drag the **folder**, not the HTML file. Netlify expects a folder.

**Anything else.**
- Copy the error + the URL/screenshot.
- Paste into your AI with *"this doesn't work — fix it."*
- Re-test.

---

## Next

[Build 3 — Conversational Surfaces](../build-3-conversational-surfaces/) — where you stop using the pre-built widgets and vibe-code a custom chat UI with two prompt modes (prospect vs member). This is the first Build where you control the rendering — the widget abstraction goes away.
