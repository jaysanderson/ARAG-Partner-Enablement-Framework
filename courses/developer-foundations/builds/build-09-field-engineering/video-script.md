# Video Script — Build 9: Field Engineering

> **Duration target:** 10 minutes
> **Format:** Screen recording. Dashboard + chat + live A/B test.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 9 · Field Engineering."* Subtitle: *"$5–15K/month recurring revenue per customer."*

**VOICEOVER:**
> Ten minutes. By the end, you'll have changed an AI answer by editing one field on a resource in the dashboard — no code deploy, no engineering ticket. That mechanism is the highest-leverage recurring-revenue lever in the entire partner programme. Stay focused.

## Section 1: The two contracts (0:30 – 1:30)

**ON SCREEN:** Slide with two columns. Left: "CONTENT CONTRACT — fields exist + are populated. Owned by customer content team." Right: "PROMPT CONTRACT — prompt tells the model to use the fields. Owned by partner SE."

**VOICEOVER:**
> Field engineering is two contracts that have to align. The content team owns the fields — they author them, maintain them, A/B test them. The partner owns the prompt — it tells the model to use those fields.
>
> When both align, content edits drive AI behaviour. When they don't, the model ignores the fields. Watch.

## Section 2: Add fields in the dashboard (1:30 – 3:30)

**ON SCREEN:** Nuclia dashboard. Open a hero resource. Click Add Field → text field. Name: `callToAction`. Value: "Try the TerraTrek 7 in your local store →". Save. Repeat for 2 more resources (fast-forward).

Then add a `searchResultDisplay` field with a JSON object value.

**VOICEOVER:**
> Two custom fields. `callToAction` — one short branded sentence per resource. `searchResultDisplay` — title plus description plus CTA label as a JSON object.
>
> Take 90 seconds. Both fields, three resources. The customer's content team will do this for their full corpus over a few days. For our demo, three resources is enough.

## Section 3: Verify in `/find` response (3:30 – 4:30)

**ON SCREEN:** Terminal. curl against `/find` for a query that returns the resource. Pipe through jq. Highlight the `callToAction` and `searchResultDisplay` values in the response.

**VOICEOVER:**
> The fields appear in the `/find` response, under `data` or `values`. The retriever indexed them; the API returns them. The model will see them when retrieval happens.

## Section 4: Update the prompt (4:30 – 5:30)

**ON SCREEN:** Code editor. Open `MultiSurfaceChat.tsx`. Update the prospect system prompt to include: *"End your answer with the call-to-action from the most-relevant resource's callToAction field."* Save.

**VOICEOVER:**
> Update the prompt. Tell the model explicitly: *use the callToAction field*. Without this line, the model doesn't know the field is special — it's just more text in `{context}`.

## Section 5: Demo the CTA pill rendering (5:30 – 6:30)

**ON SCREEN:** Browser. Reload the chat. Persona toggle on Prospect. Ask a query that returns one of the three hero resources. Watch the answer stream — three sentences, ending with a pill button "Try the TerraTrek 7 in your local store →".

**VOICEOVER:**
> The chat reloads. Ask a query that hits one of the three hero resources. The answer ends with a pill button — the exact text from the `callToAction` field, rendered as a branded CTA. The post-processor we built in Build 3 catches the markdown link and renders the pill.

## Section 6: A/B test live (6:30 – 8:00)

**ON SCREEN:** Dashboard. Open the same hero resource. Change `callToAction` from "Try the TerraTrek 7 in your local store →" to "Read the TerraTrek 7 expert review →". Save.

Switch back to the browser. Ask the same query again. The answer now ends with "Read the TerraTrek 7 expert review →" instead of the previous CTA.

**VOICEOVER:**
> Now the demo moment. Back to the dashboard. Edit the field. Save.
>
> Back to the chat. Same query. New answer — *with the new CTA*. No code deploy. No build step. No partner ticket. The content team owns the CTA; they iterate; the AI follows.
>
> This is the loop you sell as a quarterly retainer. The customer's content team A/B tests three variants per CTA per quarter. The partner monitors which variants the model picks more often, measures click-through, reports back. Quarterly value, quarterly invoice.

## Section 7: searchResultDisplay rendering (8:00 – 9:00)

**ON SCREEN:** Browser. Open the search results page (from Build 6) or the citation panel in chat. Show a citation card — it now displays the `searchResultDisplay` title + description, not the raw filename.

**VOICEOVER:**
> Same pattern, different field. `searchResultDisplay` lets the brand team rewrite how search results render. The raw filename might be `tasmania-overland-track-v3-final-FINAL.pdf` — but the user sees "Tasmania Overland Track — Complete Gear List." Edit the field, the UI updates.

## Section 8: The commercial pitch (9:00 – 9:45)

**ON SCREEN:** Slide. *"Field-engineering retainer: $5–15K / month per customer. Ten customers → $1.2M ARR. Recurring."*

**VOICEOVER:**
> Commercial frame. This is a recurring service — not one-off work.
>
> Partner sets up the field schema, trains the content team, monitors the CTAs, runs A/B tests, reports back quarterly. $5–15K a month per customer. Ten customers and you've got $1.2M of recurring annual revenue tied to *content*, not code.
>
> Every partner who sells ARAG well sells this retainer. It's how you turn a one-off implementation into a multi-year annuity.

## Wrap (9:45 – 10:00)

**ON SCREEN:** End card. *"Build 9 — Composite RAG. Next."*

**VOICEOVER:**
> Build 9 — composite RAG, chaining ARAG calls together. The on-ramp to agentic patterns. Ten minutes. See you there.

---

## Production notes

- **Section 6 (A/B test):** this is the headline visual moment of the entire Build. Pace it slowly. Edit the field, save, switch tabs, run query, *watch the new CTA appear*. Pause for two seconds after the new CTA renders.
- **Dashboard navigation:** the custom-field UI varies by dashboard version — pre-rehearse the path so you're not fumbling on camera.
- **Section 8 (commercial pitch):** keep the slide simple. One number, one calculation. Don't overpitch — let the demo do the work.
