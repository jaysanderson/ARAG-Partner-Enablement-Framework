# Build 8 — Walkthrough: Field Engineering

> Estimated time: 2 hours focused. Read the [lesson](lesson.md) first.

## Goal

Add custom fields to 5 of your KB resources. Update the prompt to use them. Update the front-end to render them. A/B test two CTA variants. Demonstrate that *changing a field on a resource changes the AI's answer immediately, with no code deploy.*

## 1. Add `callToAction` to 5 resources (30 min)

In the Nuclia dashboard, for each of 5 hero resources in your KB:

1. Open the resource.
2. Add a custom text field. Name: `callToAction`. Value: one short branded sentence, ending with → or "now", "today", etc.

Examples for an outdoor retailer corpus:
- "Try the TerraTrek 7 in your local store →"
- "Plan your Tasmania trip with the complete gear guide →"
- "Book a guided alpine course with Mara Chen →"
- "Compare with our Skyline 45L pack →"
- "Pre-order the Helios down jacket — ships in November →"

Use your own brand voice and reasonable URLs (link to a real PDP if possible, even if it's just a fictional URL for now).

## 2. Add `searchResultDisplay` to the same 5 resources (15 min)

Same dashboard. Add another field on each:

- Name: `searchResultDisplay`
- Value: a JSON object as a string:

```json
{
  "title": "Tasmania Overland Track — Gear List",
  "description": "Mara Chen's vetted 6-day, 65km traverse gear list. Updated for 2026.",
  "ctaLabel": "Plan your trek"
}
```

The brand team writes title + description optimised for how the *user* will read it — not the file's actual title.

## 3. Verify the fields appear in `/find` responses (10 min)

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"<a query that should match your hero resources>","page_size":3,"show":["basic","values","origin"]}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" | jq '.resources | to_entries | .[].value.data'
```

Look for your `callToAction` and `searchResultDisplay` field values in the response. If they don't appear, double-check the `show` array includes `values` and that the fields are set as text fields (not metadata) in the dashboard.

## 4. Update the chat prompt to reference the fields (20 min)

Open your `build-3-chat` (or whichever project has your prompt config). Brief the AI:

```
Update the PROMPTS.prospect.system prompt in MultiSurfaceChat.tsx to:

"You are a knowledgeable assistant. STRICT RULES:
(1) Maximum 3 sentences.
(2) End your answer with the call-to-action from the most-relevant resource's
   callToAction field in the context, formatted as a markdown link.
(3) STOP after the link."

Update PROMPTS.prospect.user to make sure the CallToAction fields are passed:
"Context (includes CallToAction fields per resource): {context}

Question: {question}

Respond concisely and end with one call-to-action link from the context."

Don't change PROMPTS.member.
```

Reload. Ask a Prospect-mode query about one of your 5 hero resources. The model should now end with a markdown link pointing at the `callToAction` URL.

## 5. Update the front-end to render `searchResultDisplay` (20 min)

Brief the AI:

```
In MultiSurfaceChat.tsx (or in a search results component if you have one), update
the citation rendering to:

1. If a citation's resource has a searchResultDisplay field, render the title +
   description from that JSON object, not the raw resource title.
2. Render a small badge with the ctaLabel from searchResultDisplay.

Parse the searchResultDisplay field as JSON (it's a stringified JSON value).
Graceful fallback if absent or unparseable — use the raw title.
```

Reload. Trigger a search that returns one of your 5 hero resources. Confirm the title + description displayed match the `searchResultDisplay` field, not the raw title.

## 6. A/B test two CTA variants (15 min)

Pick one of your hero resources. Change its `callToAction` to a new variant:

- Original: "Try the TerraTrek 7 in your local store →"
- Variant: "Read the TerraTrek 7 expert review →"

Ask the same Prospect-mode query that returns this resource. Confirm the model now uses the variant.

This is the demo moment — **the model's answer changed without you touching any code.** The customer's content team can iterate without partner deploys.

## 7. Train the customer's content team (preview) (10 min)

Open `content-team-guide.md` in this folder. Sketch a one-page guide that a partner SE would hand to the customer's content team:

- What `callToAction` and `searchResultDisplay` are.
- Where to edit them in the dashboard.
- Style rules for the copy (length, voice, action verbs, ending punctuation).
- A "before / after" example showing how a CTA edit changes the AI output.

This is the asset that makes the recurring retainer real.

## 8. Record a 3-minute demo (10 min)

1. (30 sec) "Field engineering is the highest-leverage recurring-revenue lever in the entire framework. Watch."
2. (45 sec) Show the chat. Ask a Prospect-mode query. Show the answer ending with the CTA pill from `callToAction`.
3. (45 sec) Switch to the Nuclia dashboard. Edit `callToAction` on the resource. Save.
4. (45 sec) Re-ask the same query in the chat. Show the new CTA appearing.
5. (15 sec) "Customer's content team owns the CTA copy. Partner owns the platform. $10K/month per customer, ongoing."

Upload to `#build-clinic-submissions`.

## Verification checklist

- [ ] 5 resources have `callToAction` fields.
- [ ] 5 resources have `searchResultDisplay` fields (JSON object string).
- [ ] Fields visible in `/find` response under `data` / `values`.
- [ ] Prompt updated to reference `callToAction`; model produces CTA links.
- [ ] Front-end renders `searchResultDisplay.title` + description on citations.
- [ ] A/B test demonstrated — editing the field changes the AI answer.
- [ ] `content-team-guide.md` written.
- [ ] 3-minute demo recorded.

## Next

[Build 10 — Composite RAG](../build-10-composite-rag/) — chaining ARAG calls. The on-ramp to agentic patterns.
