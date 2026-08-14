# Build 08 — Walkthrough: Widget Deployment

> Estimated time: 2.5 hours focused. Read the [lesson](1-lesson.md) first.
>
> **This is the one Build in the course with real vibe-coding.** Steps 1, 2, 4, and 5 are dashboard and browser work, same rhythm as every other Build here. Step 3 is different — you'll brief an AI assistant to write a small proxy backend, the same discipline Foundations trained, applied to the one place in this course where a real credential is at stake.

## What you'll build

One Build 07 widget, deployed three ways against the same Aurora Outfitters Knowledge Box:

1. Styled with your own CSS via `csspath`.
2. Running locally with no proxy — a quick sandbox test, reusing Foundations Build 2's exact pattern.
3. Running behind a minimal proxy backend you vibe-code, so the browser never holds the service-account key.
4. Wired for Synchronized configuration, so a dashboard-side config change reaches the already-embedded widget with no redeploy.

## What you'll need open

- **Your Progress Agentic RAG dashboard**, the widget you built in Build 07.
- **Your code editor.**
- **A modern web browser**, DevTools open (Network tab especially).
- **Your AI assistant** — doing real work this time, not optional.
- **Node.js** (or your preferred backend runtime) for the proxy in Step 3.

---

## Step 1 — Style the widget with `csspath` (25 min)

1. Open the Build 07 widget's embed snippet in the dashboard's Code panel. Note the widget tag(s) — `<nuclia-search-bar>`, `<nuclia-search-results>`, whichever you configured.
2. Create a CSS file, `aurora-widget-theme.css`, in the same folder as your test HTML file. Give it a small, deliberate brand pass matching the Aurora design system used elsewhere in this course's corpus — a warm sandstone base with alpine-blue and rust accents, generous whitespace:

   ```css
   /* aurora-widget-theme.css */
   nuclia-search-bar {
     --nuclia-primary-color: #3b6e8f;   /* alpine blue */
     background-color: #f4ede1;         /* warm sandstone */
     font-family: "Inter", system-ui, sans-serif;
   }

   .thumbnail-container {
     width: 220px !important;
   }
   ```

3. Add `csspath` to the widget tag, pointing at your file:

   ```html
   <nuclia-search-bar
     knowledgebox="YOUR_KB_UUID"
     zone="aws-eu-1"
     apikey="YOUR_SERVICE_ACCOUNT_JWT"
     csspath="./aurora-widget-theme.css"
   ></nuclia-search-bar>
   ```

4. **Confirm the `!important` gotcha yourself.** Pick an element the widget already styles internally (a thumbnail width, a border-radius, a font-size on the result title). Write a rule for it in your CSS file **without** `!important` first. Reload — it won't apply, because the widget's own baseline wins. Add `!important`. Reload again — now it applies. You've just reproduced the single most common "my CSS does nothing" support case in one deliberate step.

---

## Step 2 — Deploy locally with no proxy (15 min)

This step is a direct reuse of [Foundations Build 2](../../../developer-foundations/builds/build-02-drop-in-widgets/) Steps 1 and 6 — don't reinvent it.

1. Create `~/Desktop/search-configuration-and-widget-deployment/build-08/index.html`.
2. Paste Foundations Build 2's skeleton, then paste your styled snippet (with `csspath`) from Step 1 between the body tags.
3. Save `aurora-widget-theme.css` alongside `index.html` in the same folder, matching the relative `csspath`.
4. Double-click `index.html`. It opens in your browser — no hosting, no deploy, no public URL.

**Confirm:** the widget renders with your CSS applied (the styled thumbnail, the brand colour). The service-account JWT is sitting right there in the page source, embedded by the configurator's snippet — and that's fine, because this file lives only on your Desktop and nobody but you loads it. That's the whole point of the no-proxy pattern: fine for exactly this, wrong the moment this file becomes reachable by anyone else.

---

## Step 3 — Vibe-code a minimal proxy backend (60 min)

Now make the same widget production-safe. Brief your AI assistant.

### 3a. Brief your AI

Paste this brief (adjust the stack line if you're not using Node):

```
Build a minimal proxy backend for a Progress Agentic RAG widget.
Stack: Node.js + Express (or an equivalent minimal HTTP server in
whatever language I have set up — ask me if unsure).

Requirements:

1. One route, e.g. POST /api/arag-proxy, that accepts the same request
   body shape the ARAG widget sends to /find or /ask.

2. The route must NOT read any API key from the incoming request. The
   real service-account key lives ONLY in a server-side environment
   variable, e.g. NUCLIA_API_KEY, read via process.env — never sent
   by the client, never present in any file the browser can read.

3. On each incoming request, the server:
   a. Reads NUCLIA_API_URL and NUCLIA_KB_ID from process.env too.
   b. Forwards the request body to
      ${NUCLIA_API_URL}/kb/${NUCLIA_KB_ID}/find (or /ask, mirror
      whatever endpoint the widget is calling)
      using native fetch — NO external HTTP library, NO Progress
      Agentic RAG SDK.
   c. Sets the header X-NUCLIA-SERVICEACCOUNT: Bearer ${NUCLIA_API_KEY}
      on that outbound server-side request only.
   d. Returns ARAG's response body and status back to the caller
      unchanged.

4. CORS: allow requests from my local dev origin (http://localhost or
   file://) so the widget running in my browser can reach this proxy.

5. Log each request's path and response status to the console (no
   need for anything fancier).

Give me a .env.example listing NUCLIA_API_URL, NUCLIA_KB_ID,
NUCLIA_API_KEY as placeholders, and the exact command to run the
server locally.
```

Send it. Save the output, fill in your real `.env` values (copy them from your existing sandbox credentials — never commit `.env`), and start the server.

### 3b. Point the widget at your proxy

In your `index.html` from Step 2, find the widget's endpoint-related attributes (however your configurator's generated snippet exposes the base URL) and repoint them at your local proxy's route instead of ARAG directly. Remove the `apikey` attribute entirely — the widget shouldn't hold a key anymore; the proxy holds it.

Reload `index.html`. Run a search.

### 3c. Prove the key never reaches the browser

Open DevTools → **Network** tab. Run a query in the widget. Click the request the widget's own JavaScript initiated.

- **You should see:** a request to your proxy's route (e.g. `POST /api/arag-proxy`), with **no** `X-NUCLIA-SERVICEACCOUNT` header and no key anywhere in its request headers or body.
- Then look at your proxy server's own terminal logs (or, if you want to see the second hop directly, temporarily log the outgoing request headers in your proxy code) — that's where `X-NUCLIA-SERVICEACCOUNT` gets attached, server-side, never visible to the browser.

If the key shows up anywhere in the Network tab on a request the page's own JS made, the proxy isn't doing its job — go back to your AI: *"The widget's request to my proxy still has an API key attached. Where's it coming from, and how do I stop the widget from sending it at all?"* (Usually the fix is removing the `apikey` attribute from the widget tag, not a proxy bug.)

### 3d. Save your prompt log

Create `prompt-log.md`. Paste the Step 3a brief and any follow-up debugging prompts.

---

## Step 4 — Enable Synchronized configuration and prove it (30 min)

1. Back in the dashboard, open the same widget's embed dialog (Code panel). Find the **Synchronized configuration** toggle. Turn it **on**. Regenerate/copy the snippet — note that with this toggle on, the snippet references your stored `search_configuration` rather than baking a frozen snapshot into the tag's attributes.
2. Paste this new snippet into a fresh test file (or swap it into your Step 2 file) and load it in your browser. Run a query, confirm it works.
3. Now go change something on the **underlying search configuration**, not the widget snippet. A good, visible choice: flip a Result Display option from [Build 05](../build-05-result-display-and-intent-routing/) — for example, toggle `showResultType` from `citations` to `all-resources`, or flip `displayThumbnails` on if it was off. Save the change in the dashboard.
4. **Do not touch the widget snippet again.** Go back to the already-open (or freshly reloaded) test page and reload it.
5. **Confirm:** the result list's behaviour changed to match your Step 3 dashboard edit — more (or fewer) results shown, thumbnails appearing where they weren't — with the exact same HTML file, the exact same snippet, no regeneration, no repaste.

> **Gotcha.** If the reload doesn't show the change, double check you actually toggled Synchronized configuration **on** before copying the snippet you're testing with — a snippet copied before you enabled it is still the frozen-snapshot kind, and no dashboard edit will ever reach it. Regenerate and re-copy after confirming the toggle is on.

> **Don't confuse this with the KB's Synchronize page.** If your dashboard search turns up a section called **Synchronize**, that's cloud-storage ingestion (Google Drive, SharePoint, S3) — a different feature entirely. The toggle you want lives inside the widget's embed/Code panel dialog.

---

## Step 5 — Use the dashboard's own preview to verify (10 min)

Before you concluded Step 4 worked, or any time you want a faster check than reloading a deployed page, use the dashboard's own widget preview — it runs the widget and lets you test it directly, without embedding it anywhere.

Repeat the Step 4c change (or make a new small one) and check it two ways:

1. **Dashboard preview first** — confirm the configuration change is visibly reflected in the dashboard's own preview pane. This tells you the configuration itself saved correctly.
2. **Then reload your deployed test page** — confirm the same change shows up there too. This tells you Synchronized configuration actually propagated it.

Two different questions, two different checks. If the dashboard preview shows the change but your deployed page doesn't, the problem is Synchronized configuration (or a stale snippet); if even the dashboard preview doesn't show it, the problem is upstream — the configuration edit itself didn't save.

---

## Verification checklist

- [ ] `csspath` CSS file applied to the widget; brand colours and font visible.
- [ ] Confirmed at least one element needed `!important` to override the widget's built-in style — you saw it fail without, then work with it.
- [ ] `index.html` opens locally by double-click, no proxy, styled correctly — and you can state out loud why this is fine for a sandbox file but not for anything a real customer's traffic reaches.
- [ ] Proxy backend running; widget re-pointed at it with the `apikey` attribute removed.
- [ ] DevTools Network tab confirms no service-account key on any request the page's own JS initiated.
- [ ] Synchronized configuration enabled on the tested snippet.
- [ ] A Result Display change (Build 05) made in the dashboard, reflected in the already-embedded widget on reload — no snippet regeneration.
- [ ] Dashboard preview used to confirm the change independently of the deployed page.
- [ ] `prompt-log.md` saved with the Step 3 proxy brief.

Then take the [Build 08 quiz](3-quiz.md). Pass → start [Build 09 — Capstone](../build-09-capstone/).

---

## Getting unstuck

**My CSS file loads (no 404 in Network) but nothing visibly changes.**
- Almost always the `!important` gotcha — see Step 1's callout. Add it against the specific property you're overriding.

**`csspath` gives a 404 or the widget looks completely unstyled.**
- Check the path is relative to where the widget script resolves it from, not relative to your OS filesystem. Try an absolute path or a fully-qualified URL if a relative one isn't resolving.

**The widget on my local no-proxy file works, but the same snippet fails once pointed at my proxy — CORS error or "Failed to fetch" in the console.**
- Confirm your proxy's CORS configuration allows the origin you're loading the widget from (`http://localhost:PORT` or `file://`, depending on how you're serving the test page — `file://` origins are the trickiest for CORS; consider serving the test file from a simple local static server instead of double-clicking it once you're testing the proxy). Also confirm the proxy is actually running and the widget's endpoint attribute points at the right host and port.

**Proxy starts fine, but every request comes back 401/403.**
- The proxy is likely forwarding without the header attached correctly, or `NUCLIA_API_KEY` in your `.env` is stale/wrong. Add a temporary `console.log` of the outgoing headers (strip the key value before you look, or log only the header name) to confirm `X-NUCLIA-SERVICEACCOUNT` is present and well-formed on the server-to-ARAG hop.

**Synchronized configuration is on, but my reloaded page still shows the old behaviour.**
- Confirm you copied the snippet *after* turning the toggle on (see Step 4's gotcha). Also confirm you changed the configuration that this specific widget actually references — if Build 07 gave you multiple named configurations, double check which one this widget is wired to.

**I can't find a "Synchronized configuration" toggle anywhere.**
- It lives in the widget's embed/Code panel dialog, not the main configuration panel. If your dashboard genuinely doesn't show it, check your tenant/account tier with your Progress partner manager — some capabilities are tier-gated.

**Anything else.**
- Open DevTools → Console and Network. Screenshot both. Paste into your AI: *"Widget/proxy doesn't behave as expected. Console shows X, Network shows Y, my proxy code is Z."*
- Re-test.
