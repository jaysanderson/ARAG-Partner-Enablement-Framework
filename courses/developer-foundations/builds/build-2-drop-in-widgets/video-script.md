# Video Script — Build 2: Drop-in Widgets

> **Duration target:** 8 minutes
> **Format:** Screen recording + voiceover. Live build start-to-finish.
> **Tools on screen:** Code editor (VS Code), browser, optional AI assistant for one short prompt.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 2 · Drop-in Widgets"*. Cut to an empty browser tab.

**VOICEOVER:**
> Build 2. Eight minutes. By the end of this video we'll have a branded chatbot live on a real URL, talking to a real KB, with zero backend code. This is the fastest path from POC kickoff to customer demo, and the highest-leverage thirty minutes you spend in any Tier 1 engagement.

## Section 1: The widgets (0:30 – 1:30)

**ON SCREEN:** A simple slide listing the four widgets: `<nuclia-search-bar>`, `<nuclia-search-results>`, `<nuclia-chat>`, `<nuclia-popup>`. Quick visual mockup of each.

**VOICEOVER:**
> ARAG ships a widget library — four standard Web Components. Search bar, search results, floating chat, popup. They work in any HTML page — WordPress, Webflow, plain static site, your customer's CMS. Two script tags, two custom-element tags, and you have working search plus chat.

## Section 2: Scaffold the page (1:30 – 3:30)

**ON SCREEN:** Open VS Code, new file `index.html`. Type out (or paste from a snippet) the HTML structure — `<script>` tag for the CDN, `<nuclia-search-bar>`, `<nuclia-search-results>`, `<nuclia-chat>`. Replace `knowledgebox`, `zone`, `apikey` with your sandbox credentials inline. Save. Open in browser.

**VOICEOVER:**
> Here's the entire HTML. Script tag for the widget library. Search bar with my KB UUID, my zone, my API key. Search results below it. Floating chat in the corner.
>
> I drop my actual credentials in. Save. Open in the browser. Type a query. Press enter.

**ON SCREEN:** Results appear. Open chat, ask a question, watch the answer stream.

**VOICEOVER:**
> Working search. Working chat. Streaming answers. Citations. Three minutes from blank file to this.

## Section 3: Brand it (3:30 – 5:00)

**ON SCREEN:** Add a `<style>` block to the HTML head with the five CSS custom properties. Set values to a non-default colour scheme (e.g., navy primary, amber secondary). Save. Reload. Show the difference — the search bar accent colour, the chat button colour, the focus rings all change.

**VOICEOVER:**
> Branding. Five CSS variables. Primary colour, secondary colour, background, text, font family. The widgets read inherited custom properties — they cross the Shadow DOM cleanly. Change five lines, reload, you've themed everything.
>
> For pixel-perfect work — bespoke hover states, custom transitions — you base64-encode a full CSS file and pass it as the `csspath` attribute. That's the layer you give the customer's brand team — they edit the CSS, you ship.

## Section 4: Filter by content type (5:00 – 6:00)

**ON SCREEN:** Add `filters='["/icon/application/pdf"]'` to the search bar. Reload. Same query — now only PDFs come back. Then change the filter to `'["/icon/video"]'`. Reload. Only videos.

**VOICEOVER:**
> Content-type filtering. One attribute on the search bar. The filter values are icon-path strings. Slash icon slash application slash pdf — PDFs only. Slash icon slash video — videos only. Stack multiple in the array for OR semantics. Add labelset filters with `/classification.labels/<labelset>/<label>` — Build 6 has the depth on that.

## Section 5: Deep-link with `?q=` (6:00 – 6:45)

**ON SCREEN:** In the browser, append `?q=onboarding` to the URL. Page loads, search fires automatically, results render. Pause for two seconds. Reload — `?q=` still in URL or already stripped — show whichever behaviour you've wired.

**VOICEOVER:**
> Deep links. Append `?q=` to the URL with any query and the widget auto-fires on page load. Every conversation in your demo becomes a URL the customer can share — internal Slack, email, board pack. Shareable answers, no extra code.

## Section 6: Ship it (6:45 – 7:30)

**ON SCREEN:** Terminal — `vercel deploy` (or `netlify deploy --prod`). Wait for the deployed URL to print. Open the URL — confirm it works.

**VOICEOVER:**
> Ship it. Vercel, Netlify, GitHub Pages, your partner sandbox subdomain — pick the easiest. Drop the folder. Get a public URL. Send it to the customer.

## Wrap (7:30 – 8:00)

**ON SCREEN:** End card. *"Build 3 — Conversational Surfaces. Next: when you outgrow the widgets."*

**VOICEOVER:**
> Eight minutes, branded chatbot live on a URL. This is your Tier 1 closer. Use it.
>
> Build 3 is what happens when the customer outgrows this — multiple prompt voices for different audiences, content-engineered CTAs, the floating chat as a conversion mechanic. Vibe-coded, twelve minutes. See you there.

---

## Production notes

- **Pacing:** 8 minutes is short and live. Don't pad. If you finish in 7:00, even better.
- **Brand palette choice:** pick a high-contrast theme so the colour change in Section 3 is unmistakable on camera. Navy primary + amber secondary works well.
- **CDN cache:** the first widget load can take 1–2 seconds. If the demo runs slow, pre-load the page off-camera and hard-refresh on camera; the second load is instant.
- **Public URL:** record the final URL on screen for at least 5 seconds at the end so partners can pause and read it.
- **Subtitles:** add captions for the JWT/UUID/zone fields in Section 2 — viewers will pause to compare with their own.
