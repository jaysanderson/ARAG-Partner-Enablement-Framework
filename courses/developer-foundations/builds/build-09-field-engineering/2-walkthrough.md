# Build 9 — Walkthrough: Field Engineering

> Estimated time: 2–3 hours focused. Read the [lesson](1-lesson.md) first.
>
> **This is the highest-leverage recurring-revenue Build in the framework.** Customers pay you on retainer to maintain custom fields. Get this right and you've got a $10K-a-month annuity per customer. Get it wrong and you've sold a one-off project.

## What you'll build

A working demonstration that **editing a custom field on a resource in the dashboard changes the AI's answer immediately — with no code deploy**.

Specifically:

- Add `callToAction` and `searchResultDisplay` fields to 5 hero resources.
- Update the chat prompt to reference `callToAction`.
- Update the front-end to render `searchResultDisplay` on citations.
- A/B test two CTA variants by editing the field and watching the answer flip.
- Write a **content-team training guide** — the artefact that makes the retainer real.

## What you'll need open

- **Your Build 0 KB** (10 documents).
- **Your Nuclia dashboard** for editing custom fields.
- **Your Build 3 React project** (we'll extend the chat) or any chat project from earlier Builds.
- **Your terminal**, editor, AI assistant, browser.

If you don't have Build 3 running, you can use Build 4 (the multilingual version layered on Build 3). Both work.

---

## Step 1 — Pick your 5 "hero" resources (10 min)

Open the Nuclia dashboard. Look at your 10 documents. Pick **5 that would be the most natural CTA targets** — the ones a sales rep would point at first.

Examples:

- A product datasheet → CTA could be "Try it free →"
- An onboarding guide → CTA could be "Start the onboarding flow →"
- A case study → CTA could be "Book a call to discuss your case →"

Write the 5 titles + your planned CTAs in a notes file (`hero-resources.md` in a Build 9 project folder).

If your sandbox content isn't obvious-CTA shaped, **fabricate the CTAs** — this is a demo, not a real customer engagement. Use plausible fake URLs (e.g., `https://example.com/products/foo`).

---

## Step 2 — Add `callToAction` to each hero resource (25 min)

In the Nuclia dashboard, for each of the 5 hero resources:

1. **Open the resource** (click into its detail view).
2. Look for a **Custom Fields**, **Metadata**, or **User Metadata** panel (wording varies).
3. **Add a new text field**:
   - **Field name:** `callToAction`
   - **Field value:** your branded CTA sentence, e.g., `"Read the full TerraTrek 7 review → https://example.com/terratrek-7"`
4. Save.

**You should see:** the field appears in the resource's metadata panel.

### Style rules for CTAs

These will go in the content-team guide later. Now's a good time to internalise them:

- **One sentence.** Max 80 chars.
- **Action verb.** "Try", "Read", "Book", "Compare", "Plan".
- **Ends with an arrow (→) or a "now"/"today".**
- **Includes a URL** (real or fictional) the model can convert to a markdown link.
- **Brand voice.** No clichés. No "Click here".

### Verify

After adding all 5, do a quick sanity check:

```bash
export NUCLIA_API_URL="<your-url>"
export NUCLIA_KB_ID="<your-kb-id>"
export NUCLIA_API_KEY="<your-jwt>"

curl -s \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/resource/<RESOURCE-ID>?show=basic&show=values&show=extracted"
```

**You should see** the `callToAction` value somewhere in the raw JSON response. The exact path depends on how the dashboard saves it (`usermetadata`, `data.texts.callToAction`, or `metadata.custom`) — scroll through the response and search for the string you entered.

If you can't find it, copy the first ~500 characters of the response and paste into your AI: *"I added a callToAction custom field. Where does it appear in this response? [paste snippet]"*

---

## Step 3 — Add `searchResultDisplay` to each hero resource (15 min)

Same dashboard. Add a **second** custom field on each of the 5 hero resources:

- **Field name:** `searchResultDisplay`
- **Field value:** a **stringified JSON object** like:

```json
{"title":"Tasmania Overland Track — Gear List","description":"Mara Chen's vetted 6-day, 65km traverse gear list. Updated for 2026.","ctaLabel":"Plan your trek"}
```

> **Why stringified JSON?** ARAG's custom text fields accept strings. To carry structured data, we serialise as JSON and parse on the front-end. This is a common pattern — your front-end code calls `JSON.parse()` on the field value.

**Style rules** (for the content team guide):

- **`title`** — what the user will read. Often different from the file's actual title (which is engineer-y). Make it customer-vocabulary.
- **`description`** — one sentence selling why the user should click. ~80 chars.
- **`ctaLabel`** — 2-3 words for a button. "Plan your trek", "Read the review", "Book the demo".

### Verify

Re-run the `curl` from Step 2's verify section. **You should see** both `callToAction` and `searchResultDisplay` values present.

---

## Step 4 — Confirm fields surface in `/find` (10 min)

The `show: ["values"]` flag includes custom fields. Pick a query that would match one of your hero resources, then:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"<query that matches a hero resource>","page_size":3,"show":["basic","values","origin"]}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find"
```

**You should see** raw JSON containing the matched resources' full data — including your custom fields somewhere inside. The shape varies by tenant version; common paths:

- `.data.texts.callToAction.value.body`
- `.usermetadata.custom.callToAction`
- `.fielddata.callToAction`

Search the response for `callToAction` (or whatever you named the field) to find where yours land. **Note the path** — you'll need it in the next steps.

---

## Step 5 — Update the prompt to use `callToAction` (25 min)

Now the AI starts using your fields.

### 5a. Open your existing chat project

```bash
cd ~/Desktop/foundations-build-3   # or whichever has your MultiSurfaceChat
npm run dev
```

Confirm the chat still works.

### 5b. Brief your AI

Paste:

```
Open src/components/MultiSurfaceChat.tsx in my Vite + React project.

Find the PROMPTS constant.

Update PROMPTS.prospect.system to:
  "You are a knowledgeable assistant. STRICT RULES:
   (1) Maximum 3 sentences.
   (2) End your answer with the call-to-action from the most-relevant
       resource's callToAction field in the context, formatted as a
       markdown link [label](url).
   (3) STOP immediately after the link — do not add any further text.
   (4) If no callToAction is present in the context, end with a generic
       'Learn more →' link to the most-relevant resource."

Update PROMPTS.prospect.user to:
  "Context (each resource may include a callToAction field with a branded
   CTA sentence and URL): {context}

   Question: {question}

   Respond concisely. End with one call-to-action link from the
   most-relevant resource's callToAction. STOP after the link."

Do not change PROMPTS.member.

If the answer is rendering through formatAssistantHtml, that helper
already converts the first markdown link to a pill button — that
behaviour should still work.
```

Send. Apply the patch.

### 5c. Test

Restart the dev server (`Ctrl+C` then `npm run dev`). With **Prospect mode** selected, ask a query that should match one of your hero resources.

**You should see:** the answer ends with a pill button labelled with text from your `callToAction` field, linking to its URL.

**If the answer ends with a generic CTA** (not from your field):
- The model isn't seeing the field in the context. Open DevTools → Network → click the `/ask` request → check the response retrieval. Does the `callToAction` field appear in `retrieval_results.resources.{id}.data` (or wherever it lives)?
- If yes but the model still ignored it, the prompt needs to be more explicit. Tell AI: *"The model is ignoring the callToAction field. Strengthen the prompt — make it impossible to interpret."*

### 5d. Save your prompt log

Create or append `prompt-log.md` with the Step 5b brief.

---

## Step 6 — Render `searchResultDisplay` on citations (25 min)

Now the UI side. Citations under each chat answer should show the customer-friendly title + description from `searchResultDisplay`, not the engineer-y file name.

### 6a. Brief your AI

Paste:

```
In src/components/MultiSurfaceChat.tsx, find where citations are rendered
under each assistant message.

Update the citation rendering to:

1. For each citation:
   - Find the matching resource in the streamed citations data.
   - Try to extract its searchResultDisplay field value (stringified JSON).
   - JSON.parse it inside a try/catch.
   - If parse succeeds, render:
     <div>
       <span class="title">{parsed.title}</span>
       <span class="description">{parsed.description}</span>
       <span class="cta-label-badge">{parsed.ctaLabel}</span>
     </div>
   - If parse fails or field is missing, render the raw title as before.

2. Style the citation card with Tailwind:
   - Title bold, ~16px
   - Description smaller, gray
   - ctaLabel rendered as a small pill badge

3. Don't break the existing behaviour for citations without searchResultDisplay.

If the streaming citations data doesn't include the searchResultDisplay field
currently, you'll need to:
- Update src/lib/ragClient.ts so when it yields {type: 'citations'},
  it includes for each citation: { id, title, searchResultDisplay }.
- Extract searchResultDisplay from the resources object in the retrieval item.
```

Send. Apply.

### 6b. Test

Reload the page. Ask a Prospect-mode query that matches a hero resource.

**You should see:**

- The answer ends in the CTA pill (from Step 5).
- The citations underneath show the **customer-friendly title** (from `searchResultDisplay.title`), the **description**, and a small badge with the `ctaLabel`.
- Citations from resources **without** `searchResultDisplay` still render the raw title gracefully.

### 6c. Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Citations show raw titles even on hero resources | `searchResultDisplay` not surfacing in ragClient's citations yield | Tell AI: *"ragClient's citations don't include searchResultDisplay. Update it to extract that field from the retrieval payload."* |
| All citations show "JSON parse error" | Field stored as object, not string | The dashboard may have JSON-decoded it. Skip the JSON.parse if it's already an object |
| Description text overflowing | No truncation | Tell AI: *"Truncate descriptions to 100 chars with ellipsis."* |

### 6d. Append to prompt log

---

## Step 7 — A/B test two CTA variants (15 min)

**This is the demo moment.** Pick one of your hero resources.

### 7a. Variant A → Variant B

1. In the Nuclia dashboard, open the resource.
2. **Note the current `callToAction` value.** Take a screenshot.
3. Ask a Prospect-mode query that matches this resource. Screenshot the answer (CTA pill).
4. Now **edit the `callToAction` field** to a noticeably different sentence:
   - Original: *"Try the TerraTrek 7 in your local store →"*
   - Variant: *"Read the TerraTrek 7 expert review →"*
5. Save.
6. **Don't touch your code.** Don't reload the dev server. The chat is unchanged.
7. Ask the same query again.
8. Screenshot the new answer.

**You should see:** the CTA pill at the end of the answer now reads the variant text and links to whatever new URL you put.

### 7b. The punchline

**You just A/B-tested customer messaging without touching code.**

This is the entire pitch of field engineering:

- Partner builds the platform once.
- Customer's content/marketing team iterates on `callToAction` and `searchResultDisplay` weekly.
- Each edit is live in seconds.
- Partner gets paid a retainer to:
  - Keep the platform healthy.
  - Train the content team.
  - Add new field types when new use cases emerge.

Save both screenshots in your project folder as `cta-variant-a.png` and `cta-variant-b.png`. Reviewers will check these.

---

## Step 8 — Write the content-team training guide (30 min)

This is the **deliverable that makes the retainer real**. Open your AI:

```
Write me a one-page markdown document content-team-guide.md
titled "Content Team Guide: Editing Custom Fields in [Customer KB]".

It's handed to a customer's content/marketing team. Audience:
non-engineers. Tone: confident, friendly, no jargon.

Sections (in order):

1. WHAT THESE FIELDS DO (2-3 sentences)
   - callToAction → what appears at the end of every AI answer
   - searchResultDisplay → what appears in search result cards
   - Why this matters: editing these = changing what users see, no engineer needed

2. WHERE TO EDIT (step-by-step)
   - Login to Nuclia dashboard
   - Open KB
   - Find resource
   - Open Custom Fields panel
   - Edit field value
   - Save
   - Changes are live immediately

3. STYLE RULES FOR callToAction
   - One sentence, max 80 characters
   - Start with an action verb (Try, Read, Book, Compare, Plan)
   - End with an arrow → or "today" or "now"
   - Include a URL the AI can convert to a link
   - Brand voice (no clichés, no "Click here")

4. STYLE RULES FOR searchResultDisplay
   - title: what the customer reads (NOT the file's tech title)
   - description: one sentence selling why they'd click (~80 chars)
   - ctaLabel: 2-3 words for the button

5. BEFORE/AFTER EXAMPLE
   - Show original CTA + the AI answer that comes back
   - Show variant CTA + the new AI answer
   - One sentence: "this is the entire pitch"

6. WHEN TO ASK YOUR PARTNER FOR HELP
   - "I want a new type of field" (let them design)
   - "The AI isn't picking up my edits" (debugging)
   - "I want to A/B test 5 variants" (instrumentation)

Plain markdown. One printed page if printed. No code blocks
except for example field values.
```

Save the result as `content-team-guide.md`. **This is a high-value reviewer artefact** — they look at it specifically for clarity and customer-readiness.

---

## Step 9 — Update prompt log (5 min)

Make sure `prompt-log.md` has:

1. Step 5 brief (prompt update).
2. Step 6 brief (citation rendering).
3. Step 8 brief (content team guide).
4. Any debugging prompts.

---

## Verification checklist

- [ ] 5 hero resources have `callToAction` fields with branded copy.
- [ ] 5 hero resources have `searchResultDisplay` fields (stringified JSON with title + description + ctaLabel).
- [ ] Both fields surface in `/find` response under `show: ["values"]`.
- [ ] Chat prompt updated; Prospect-mode answers end with the resource's `callToAction` as a pill button.
- [ ] Citations render the customer-friendly title + description from `searchResultDisplay`.
- [ ] A/B test demonstrated — editing `callToAction` flips the AI's answer without code change.
- [ ] `cta-variant-a.png` and `cta-variant-b.png` screenshots saved.
- [ ] `content-team-guide.md` written — one page, customer-ready.
- [ ] `prompt-log.md` saved.

Then take the [Build 9 quiz](3-quiz.md). Pass → start [Build 10](../build-10-composite-rag/).

---

## Getting unstuck

**Fields don't appear in `/find` response.**
- Re-check `show: ["values"]` in the request body.
- Different tenant versions store custom fields under different paths. Pipe the raw response to `grep` to find your field name: `... | grep -i callto`.

**Model produces generic CTA, not the resource's one.**
- The field isn't reaching the context, OR the prompt isn't explicit enough. First check the network response. If the field's there, tighten the prompt with stronger directives ("YOU MUST end with..." in caps).

**`searchResultDisplay` parses but fields aren't strings.**
- Some dashboards save it as a parsed object. Skip the JSON.parse and use it directly: `const parsed = typeof field === 'string' ? JSON.parse(field) : field;`

**Editing the field doesn't change the answer.**
- Cache. ARAG may cache retrieval briefly. Wait 30 seconds and re-ask. Or change the query slightly to bust any cache.

**Anything else.**
- Copy the symptom + the path you found the field at + the AI's response.
- Paste into AI: *"My field [name] is at path [X] in the response but the model isn't using it. Fix the prompt or the renderer."*

---

## Next

[Build 10 — Composite RAG](../build-10-composite-rag/) — chaining multiple ARAG calls into one workflow. The on-ramp to agentic patterns. Generate → eval → augment → re-ask.
