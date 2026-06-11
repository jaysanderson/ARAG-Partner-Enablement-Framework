# Build 9 — Lesson: Field Engineering

> Read time: 10 minutes.

## Why this is the recurring-revenue Build

A partner who masters field engineering can sell a **$5–15K / month per customer** content-engineering retainer for the lifetime of the engagement. The partner doesn't write code. The partner trains the customer's content team to author and maintain custom fields; the partner monitors which fields the AI picks; the partner A/B tests CTA variants by editing source content. Every improvement is a content edit, not a code deploy.

The recurring-revenue economics: a partner with 10 customers on $10K/month retainers is doing $1.2M/year in recurring revenue. That's the bar this Build sets.

## What "custom fields" means in ARAG

Every resource in an ARAG KB has built-in fields (title, body, mimetype, origin, etc.). On top of those, you add **custom text fields** containing arbitrary content — JSON, plain text, anything string-shaped. The ingest pipeline indexes them; retrieval pulls them into `{context}` like any other text.

Three common custom-field patterns:

### 1. `callToAction` (per resource, one-liner)

A short branded sentence per resource:

```
"Try the TerraTrek 7 in your local store →"
```

The retriever returns this field as part of the resource's context. Your prompt instructs the model: *"End your answer with one call-to-action link from the context."* The model picks the `callToAction` from the most-relevant resource and renders it as a markdown link.

### 2. `searchResultDisplay` (per resource, JSON object)

A title + description optimised for search-result rendering, distinct from the raw document title:

```json
{
  "title": "Tasmania Overland Track — Complete Gear List",
  "description": "Everything you need for the 6-day, 65km traverse. Vetted by Mara Chen.",
  "ctaLabel": "Plan your trek"
}
```

Your front-end search results page reads this field instead of (or in addition to) the resource title. The brand team can rewrite the displayed copy without touching the underlying document.

### 3. `videoInfo` (per video resource, structured JSON)

```json
{
  "speakers": [{"name": "Mara Chen", "role": "Alpine Guide"}],
  "topics": ["alpine climbing", "winter gear"],
  "key_points": ["Crampon spacing matters more than brand", "..."],
  "call_to_action": "Book a guided alpine trip →"
}
```

Rich structured metadata that the model can reference in chat ("Mara Chen says…") and the front-end can render directly without an LLM call.

## How the model uses these fields

The lifecycle:

1. **Author** writes the field on the resource — in the dashboard or via API.
2. **Ingest pipeline** indexes the field's text content.
3. **Retrieval** (when the user asks something relevant) returns the resource along with all its fields. The custom fields appear inside `{context}` in the prompt.
4. **Model** reads the field and uses it — either directly in the answer (e.g., quoting the `key_points`) or as a link in a CTA position.
5. **Front-end** post-processes the model's response — converts `[label](url)` markdown into a branded pill button, displays `searchResultDisplay.title` instead of the raw title, etc.

The model isn't *magically* knowing about your fields. Your **prompt** tells it to use them, and your **content** populates them.

## Two contracts that have to align

For field engineering to work, two things must match:

### Content contract — what fields exist + what they contain

- The customer's content team owns this.
- Document it: "Every product page must have a `callToAction` field with a sentence ending in →. Every video must have a `videoInfo` field with speakers, topics, key_points, call_to_action."

### Prompt contract — how the prompt references the fields

- The partner SE owns this.
- The system prompt must direct the model to use the fields. *"End your answer with the call-to-action from the context."* *"When citing a video, quote one of the key_points."*

When both contracts match, content edits drive AI behaviour. When they don't, the model ignores the fields entirely.

## The post-processing layer

Even with the prompt referencing the field correctly, the model returns markdown. Your front-end has to convert it:

```typescript
function formatAssistantHtml(markdown: string): string {
  const link = markdown.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!link) return markdownToHtml(markdown);
  const before = markdown.slice(0, link.index);
  // Drop everything after the first link
  return markdownToHtml(before) + ctaPillHtml(link[1], link[2]);
}
```

(You wrote this helper in Build 3 — recap.) Two layers — prompt enforces, code guarantees.

## A/B testing CTAs without code deploys

Once the contracts are aligned, the customer's content team can A/B test CTAs by editing source content:

- Week 1: `callToAction = "Shop now"`.
- Week 2: `callToAction = "See in your local store"`.
- Week 3: `callToAction = "Compare with similar products"`.

The model picks whichever field exists at retrieval time. The brand team can experiment without filing engineering tickets. The partner monitors click-through and reports back.

**This is the partner's recurring service.** Three or four CTA experiments per quarter per customer = continuous value. Customer's procurement team renews because the partner is provably moving conversion numbers.

## Where field engineering lives in customer engagements

- **Tier 1 demos:** custom fields make the chat answer feel branded and personal. Optional but high-impact.
- **Tier 2 production:** custom fields drive the conversational surfaces — `callToAction` for prospect mode, `searchResultDisplay` for search results.
- **Tier 3 workflows:** custom fields become inputs to structured generation. The `videoInfo.key_points` become bullet points in a generated executive summary.
- **Tier 4 platform:** field engineering is the recurring-revenue annuity that keeps the customer at $250K+ ACV year after year.

## What you'll vibe-code in the walkthrough

- Add `callToAction` and `searchResultDisplay` custom fields to 5 resources in your KB via the dashboard.
- Brief the AI to update your prompt (`prompt.system`) to reference these fields.
- Extend the front-end render to consume `searchResultDisplay` for the title/description and render the CTA as a pill.
- A/B test two `callToAction` variants — show the model picking different variants depending on which field is populated.

## Common pitfalls

- **Adding the field but not updating the prompt.** The model ignores fields it isn't told to use.
- **Adding the field but no front-end consumer.** The model's `[label](url)` renders as plain markdown — the customer's brand team is upset.
- **Generic CTA copy.** "Learn more" loses to "See the Tasmania Overland gear list" every time. Field engineering is a *copywriting* discipline first.
- **Treating fields as fixed schema.** They're not — partners and customer brand teams should iterate field names and contents quarterly as the business changes.

## What's next

[Build 10 — Composite RAG](../build-10-composite-rag/) — chaining ARAG calls together. The on-ramp to agentic patterns.
