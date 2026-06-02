# Video Script — Build 2: Drop-in Widgets

> **Duration target:** 7 minutes
> **Format:** Screen recording + voiceover. Most of the runtime is in the Nuclia dashboard's widget configurator.
> **Tools on screen:** Nuclia dashboard (primary — at least 5 of 7 minutes here), code editor (VS Code, brief), browser.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 2 · Drop-in Widgets"*. Cut to the Nuclia dashboard's Widget tab on a Knowledge Box.

**VOICEOVER:**
> Build 2. Seven minutes. By the end of this video we'll have a branded chatbot running locally from a single HTML file on the Desktop — but the interesting part is *where* the work happens. It's not in an editor. It's in this dashboard, in a no-code configurator that picks the widgets, sets the options, applies the brand colours, configures the filter, and hands me an embed snippet. The partner's job in Build 2 is to know what every panel does, not to write any code.

## Section 1: Tour the configurator (0:30 – 1:30)

**ON SCREEN:** Slow pan over the configurator's three panes — configuration on the left (with all the section labels visible), live preview in the middle, generated code on the right. Hover each pane briefly.

**VOICEOVER:**
> Three panes. Left: configuration. Right: the embed snippet. Middle: live preview. Whatever you change on the left, the middle updates instantly, the right regenerates. There's nothing to save and nothing to publish — just configure and copy.
>
> The configuration panel has seven sections you'll touch in every customer engagement. Widget type. Display. Search behaviour. Generation. Branding. Filters. Language. We'll walk each one.

## Section 2: Widget types (1:30 – 2:30)

**ON SCREEN:** Click the widget-type section. Toggle search bar + results on; chat off. Preview shows search-only. Then chat on, search off. Then both on.

**VOICEOVER:**
> Four widgets. Search bar plus results — for docs sites and knowledge centres where users know what they're looking for. Floating chat — for the Intercom-style "ask anything" affordance on a marketing site. Inline chat — for conversational landing pages where chat IS the page. Popup — for media-heavy corpora where you want to preview a result without leaving context.
>
> Most Tier 1 demos pick search bar plus floating chat. That's our combo for today.

**ON SCREEN:** Settle on search bar + results + floating chat. Preview shows all three.

## Section 3: Display + behaviour (2:30 – 4:00)

**ON SCREEN:** Rapidly cycle through display options. Change placeholder text from "Ask anything…" to "Search the catalogue". Switch theme from light to dark, then back. Toggle citations style — inline footnotes to trailing list to hidden. Toggle streaming on the chat. Each click → preview updates.

**VOICEOVER:**
> Placeholder text. Theme — light, dark, system-auto. Citations style — inline footnotes, trailing list, hidden. Streaming on or off. Multi-turn follow-up. Autocomplete. The keyboard shortcut indicator.
>
> Every one of these is a customer choice. They tell you what their brand feels like. You set it in the dashboard. The preview shows them what their users will see. Five minutes of clicking, half an hour of meeting time saved.

## Section 4: Branding (4:00 – 5:00)

**ON SCREEN:** Open the brand panel. Open the primary-colour picker — pick a strong off-brand colour (e.g. navy). Watch the preview's chat bubble, search-bar focus ring, and citation pills all repaint. Then change font family from default to a Google Font option. Preview text updates.

**VOICEOVER:**
> The brand panel. Five colour pickers and a font family. The widgets re-paint live. This is the moment in a customer demo where the brand team in the room goes *"oh, this is actually our colours"* and stops worrying that you're going to ship them a generic chat blue.
>
> If the brand team needs more — bespoke hover animations, an off-brand chat avatar — every widget accepts a `csspath` attribute that loads a base64-encoded CSS file. That's the deep-customisation escape hatch. Almost never needed in Tier 1.

## Section 5: Filter to products (5:00 – 5:45)

**ON SCREEN:** Open the filter panel. Type `/n/s/-product-` into the filter expression input. Watch the preview run a query — only product resources come back in the result list. Trail guides and brand stories disappear.

**VOICEOVER:**
> The filter panel. One expression — slash-n-slash-s-slash-dash-product-dash. That's Nuclia's slug-substring filter. Resources whose slug contains `-product-` come through; everything else is excluded. The same panel accepts content-type filters like `/icon/application/pdf` and labelset paths like `/classification.labels/audience/customer` — Build 6 and 7 go deep on those.

## Section 6: Copy + paste + open locally (5:45 – 6:30)

**ON SCREEN:** Click the copy button on the code panel. Cut to VS Code with a minimal `index.html` skeleton open. Paste the snippet between the body tags. Save. Cut to Finder. Double-click `index.html`. Default browser opens. Type a query in the search bar — products only. Open the chat — branded, streaming, citations.

**VOICEOVER:**
> One paste. The snippet's already got my Knowledge Box ID, my zone, my API key, my brand colours, my filter, my placeholder text — everything's baked in. I paste it into a local `index.html` on my Desktop. Save. Double-click the file. The browser opens it. Same widget, same configuration, same colours as the dashboard preview — running on my machine, no hosting, no deploy, no public URL.

## Wrap (6:30 – 7:00)

**ON SCREEN:** End card. *"Build 3 — Conversational Surfaces. Next: when you outgrow the widgets."*

**VOICEOVER:**
> Seven minutes. Almost all of it in the dashboard. That's Build 2 — the platform does the work, the partner knows the options, the demo lands. Hand the HTML file to a non-technical sales rep and they'll demo it from their laptop the same way you just did.
>
> Build 3 is what happens when the customer outgrows this — multiple prompt voices for different audiences, content-engineered CTAs, the floating chat as a conversion mechanic. Now you go to the editor. See you there.

---

## Production notes

- **Pacing:** 7 minutes is short. Keep the dashboard cursor moving — don't dwell on individual options for more than 5 seconds each. The viewer should feel the *breadth*, not memorise the labels.
- **Dashboard close-ups:** Sections 1–5 are dashboard-heavy. Zoom enough that the section labels and the option names are clearly readable. If your dashboard has any partner-org names visible (e.g. KB name in a sidebar), check it's a non-confidential demo KB.
- **Brand colour choice:** pick a high-contrast off-brand colour for Section 4 so the colour change is unmistakable on camera. Navy or burnt orange works well.
- **Copy button:** zoom in on the copy button in Section 6 for at least 2 seconds before clicking — that's the moment that sells "no developer needed".
- **Local file open:** show the Finder window with the file's icon next to other Desktop files for 2 seconds before double-clicking. Sells the "it's just a file on your computer" framing.
- **Subtitles:** add captions for the configurator section names as they appear on screen — viewers will pause to compare with their own dashboard.
