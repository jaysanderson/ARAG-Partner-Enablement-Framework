# Build 5 — Walkthrough: Structured Outputs

> Estimated time: 3 hours focused. Read the [lesson](lesson.md) first.

## Goal

Three working `answer_json_schema` workflows against your sandbox KB. Plus the `additionalProperties: false` injector and the three-shape fallback wrapper. Vibe-coded; you verify.

## 1. Vibe-code the `askForJson` wrapper (30 min)

Open your AI assistant:

```
In a fresh Node.js project (or extending build-3-chat), create src/lib/askForJson.ts.

Export a function:

async function askForJson<T>(query: string, schema: any): Promise<T>

It:
1. Reads NUCLIA_API_URL, NUCLIA_KB_ID, NUCLIA_API_KEY from process.env
   (use dotenv).
2. Recursively walks the schema and injects additionalProperties: false on
   every nested object (and on items if items.type === 'object').
3. POSTs to /v1/kb/{id}/ask with body:
   { query, prefer_markdown: false, rephrase: true, answer_json_schema: {
     name, description, parameters: { type: 'object', additionalProperties: false,
     properties, required } } } and header x-synchronous: true.
4. Handles three response shapes:
   a. data.answer_json — return as-is.
   b. data.item?.object — return as-is.
   c. Otherwise, treat data.answer as text, strip ```json fences, regex
      match \{[\s\S]*\} or \[[\s\S]*\], JSON.parse, return.
5. Throws a helpful error if none of the three shapes match.

Use plain fetch. TypeScript generics for the return type.
```

Read the result. Verify all three shape paths are present. Test against your KB with a tiny schema (e.g., `{questions: string[]}`). Save the prompt as `prompt-log-wrapper.md`.

## 2. Workflow 1 — FAQ generator (30 min)

```
Using askForJson, write a script faq-generator.mjs:

1. Takes a topic as a CLI argument.
2. Schema: { faqs: array<{ question: string, answer: string, source_resource_title: string }> }
3. Prompt: "Based on content related to '<topic>', generate 5 FAQ entries grounded
   in the corpus. Each entry includes a question, a 1-2 sentence answer, and the
   title of the source resource the answer is grounded in."
4. Calls askForJson with that schema.
5. Prints the FAQs to the console.

Then run: node faq-generator.mjs "what's our return policy"
```

Verify:

- Returns valid JSON object with `faqs` array.
- 4–5 entries returned.
- Each entry has all three fields.
- `source_resource_title` corresponds to a real document in your KB (you can verify in the dashboard).

If the model returns string answers without the wrapper object (e.g., just the array directly), the `additionalProperties: false` isn't applied. Tell the AI to verify the injector ran.

## 3. Workflow 2 — Taxonomy generator (30 min)

```
Write taxonomy-generator.mjs:

Schema: { domains: array<{ name: string, description: string }> }

Prompt: "Identify 6-8 distinct knowledge domains that best represent the
content available to you. Each domain is a coherent area of expertise. Return
each with a 1-sentence description."

Run with no arguments.
```

Run it. The output is the KB's *own* taxonomy, generated. Match the domain names against your actual ingested content. Are they sensible? If they don't reflect the actual topics in your KB, your corpus is mixed — that's a Tier 3 finding for the customer (their content is heterogeneous; recommend labelsets in Build 6).

## 4. Workflow 3 — Comparison-table generator (45 min)

```
Write comparison-generator.mjs:

CLI args: a JSON list of item names. Example:
node comparison-generator.mjs '["Product A", "Product B", "Product C"]'

Schema:
{
  attributes: array<string>,
  rows: array<{
    attribute: string,
    values: array<string>  // one per item in input order
  }>
}

Prompt: "Compare these items from the corpus: <items list>. Return a comparison
table with 5-8 rows. Each row is one attribute (e.g., price, materials,
durability, use case) with values for each item."

Run with three items from your corpus.
```

Verify:

- `attributes` has 5–8 entries.
- Each `row.values` array has the same length as the input list.
- The values are grounded in your KB content (you can spot-check by asking the AI to also output the source resource for each cell, as a stretch goal).

## 5. Inspect the three response shapes (20 min)

For each of the three workflows, modify the call once to verify the wrapper handles all three response shapes:

1. **Sync mode (default).** Already working — `data.answer_json` path.
2. **Streaming mode.** Remove the `x-synchronous: true` header. Re-run. Verify the wrapper handles `data.item?.object`.
3. **Force the text-fallback.** Modify the prompt to add `"Reply only in plain text with the JSON embedded."`. Re-run. Verify the regex fallback path runs.

The point is to convince yourself all three paths actually work.

## 6. Write a 4-minute demo recording (25 min)

Record yourself running each workflow with explanation:

1. (45 sec) "ARAG isn't a chatbot. It's a programmable backend. Three workflows in four minutes."
2. (60 sec) FAQ generator → show the typed output → narrate "this drops into our help-centre as structured data, not a paragraph."
3. (60 sec) Taxonomy generator → show the domain list → narrate "the KB just told us its own ontology — that's a Tier 3 finding."
4. (60 sec) Comparison-table generator → show the table → narrate "this is the comparison feature the customer was paying a separate vendor for. We just generated it from our own KB."
5. (15 sec) "Schema-constrained generation. The Tier 3 unlock."

Upload to `#build-clinic-submissions`.

## Verification checklist

- [ ] `askForJson.ts` wrapper working with three-shape fallback.
- [ ] `additionalProperties: false` injector applied automatically.
- [ ] FAQ generator returns typed output with source resource titles.
- [ ] Taxonomy generator returns 6–8 sensible domains.
- [ ] Comparison-table generator returns structured rows.
- [ ] All three response shapes verified to parse correctly.
- [ ] `prompt-log-wrapper.md`, `prompt-log-faq.md`, `prompt-log-taxonomy.md`, `prompt-log-comparison.md` all saved.
- [ ] 4-minute recording submitted.

## Next

[Build 6 — Smart Filters & Labelsets](../build-6-smart-filters/) — content-type and label-based filtering. The cheapest precision lever.
