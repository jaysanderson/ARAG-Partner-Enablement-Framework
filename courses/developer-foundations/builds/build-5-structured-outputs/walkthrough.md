# Build 5 — Walkthrough: Structured Outputs

> Estimated time: 3–4 hours focused. Read the [lesson](lesson.md) first.
>
> **This is the most important Build in the course.** `answer_json_schema` is the feature that unlocks Tier-3 work (workflow generators, structured extraction, schema-validated AI). Take your time. The mental model you build here pays back for years.

## What you'll build

Three working **schema-constrained generators** — Node.js scripts that call ARAG and get back **structured JSON**, not prose:

1. **FAQ generator** — give it a topic; get back 5 grounded Q&A pairs with source titles.
2. **Taxonomy generator** — no args; get back the KB's own domain ontology.
3. **Comparison-table generator** — give it 2-4 item names; get back a structured comparison table.

Plus a shared helper, `askForJson.ts`, that:

- Auto-injects `additionalProperties: false` at every level of your schema (the AI failure mode #4 from the vibe-coding guide).
- Falls back through **three** response shapes the LLM might return, so your code stays resilient.

## What you'll need open

- **Your Build 0 `.env`** (the same credentials).
- **Your terminal**.
- **Your editor**.
- **Your AI assistant**.

You can extend Build 3's project or start fresh. **We recommend starting fresh** — these are CLI scripts, not React components, and a clean Node project is simpler.

---

## Step 1 — Set up a fresh project (5 min)

```bash
cd ~/Desktop
mkdir foundations-build-5
cd foundations-build-5
npm init -y
npm install dotenv
```

**What that did:**
- Created a fresh folder.
- `npm init -y` initialised `package.json`.
- Installed `dotenv` so Node can read your `.env` file.

Copy your `.env` from Build 0:

```bash
cp ../foundations-build-0/.env .
```

(If your Build 0 folder is named differently, adjust the path.)

Open the project in VS Code:

```bash
code .
```

You should see `package.json` and `.env` in the folder. Confirm `.env` still has your three `NUCLIA_*` credentials.

---

## Step 2 — Vibe-code the `askForJson` wrapper (40 min)

This is the **most important file you'll write in the course**. It's the helper that handles `answer_json_schema` correctly — including the three failure modes that bite partners in customer engagements.

### 2a. Brief your AI

Paste **exactly** (long brief — don't shorten it):

```
Create src/lib/askForJson.ts (or askForJson.mjs if you'd rather avoid
TypeScript — both fine; pick one).

Export an async function:

  askForJson(query: string, schema: object): Promise<object>

It must do these things:

1. Read NUCLIA_API_URL, NUCLIA_KB_ID, NUCLIA_API_KEY from process.env
   using the dotenv package (call dotenv.config() at the top).

2. Recursively walk the input `schema` and inject
   `additionalProperties: false` at EVERY level where the type is "object".
   - If a property is itself { type: "object", ... }, inject there too.
   - If a property is { type: "array", items: { type: "object", ... } },
     inject on items too.
   - Do this BEFORE sending to the API.
   - Don't mutate the caller's schema — work on a deep clone.

3. POST to ${NUCLIA_API_URL}/kb/${NUCLIA_KB_ID}/ask with:
   - Header: X-NUCLIA-SERVICEACCOUNT: Bearer ${NUCLIA_API_KEY}
   - Header: Content-Type: application/json
   - Header: x-synchronous: true
   - Body: {
       query,
       prefer_markdown: false,
       rephrase: true,
       answer_json_schema: {
         name: schema.name || "structured_output",
         description: schema.description || "Structured response",
         parameters: schema.parameters || schema
       }
     }
   (the caller can pass either a wrapped { name, description, parameters }
    object OR just the parameters; handle both shapes gracefully)

4. Parse the response. Handle THREE possible response shapes:

   a. The happy path: response JSON has `data.answer_json` (an object).
      Return it as-is.
   b. The streaming-stash path: response has `data.item.object` (an object).
      Return it as-is.
   c. The text-fallback path: the model returned the answer in `data.answer`
      as a string (sometimes wrapped in ```json fences). Strip the fences,
      regex match either {[\s\S]*} or [[\s\S]*], JSON.parse, return.

   If none of the three paths produce a parseable object,
   throw a helpful error including the first 500 chars of the raw response.

5. Use native fetch (Node 18+). NO external HTTP library. NO Nuclia SDK.

6. Add JSDoc/TypeScript comments above the function explaining the
   three response shapes and why we handle all three.
```

Send.

### 2b. Save the AI's output

- **Claude Code / Cursor:** *"Save this as src/lib/askForJson.mjs (or .ts). Create the lib folder if it doesn't exist."*
- **Web chat:** create `src/lib/askForJson.mjs` (or `.ts`) in VS Code, paste, save.

### 2c. Read the code carefully

This file's quality determines whether the rest of Build 5 is easy or painful. Four checks:

1. **The injector is recursive.** Find the function that walks the schema. It must descend into `properties.<key>` AND into `items` (for arrays of objects).
2. **The three response paths exist.** Search the file for: `answer_json`, `item.object` (or `item?.object`), and a regex like `/\{[\s\S]*\}/` for the text fallback.
3. **Auth header** is `X-NUCLIA-SERVICEACCOUNT`.
4. **No SDK** — uses plain `fetch`.

If any are missing, tell the AI: *"You forgot [X]. Re-write the file with it."*

### 2d. Test the wrapper with a tiny schema

Create a smoke-test file `test-wrapper.mjs`:

```bash
touch test-wrapper.mjs
code test-wrapper.mjs
```

Paste:

```js
import { askForJson } from './src/lib/askForJson.mjs';

const schema = {
  name: "smoke_test",
  description: "Tiny schema to verify the wrapper works.",
  parameters: {
    type: "object",
    properties: {
      questions: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["questions"]
  }
};

const result = await askForJson(
  "Suggest 3 follow-up questions someone might ask about my corpus.",
  schema
);

console.log(JSON.stringify(result, null, 2));
```

Run:

```bash
node test-wrapper.mjs
```

**You should see:** a JSON object printed:

```json
{
  "questions": [
    "...",
    "...",
    "..."
  ]
}
```

If you get an error, paste the entire error into your AI: *"My askForJson wrapper produces this error. Fix it."*

### 2e. Save your prompt

Create `prompt-log.md` in the project root. Paste the Step 2 brief. Append every subsequent brief as you go.

---

## Step 3 — Workflow 1: FAQ generator (30 min)

### 3a. Brief your AI

Paste:

```
Using my askForJson wrapper from src/lib/askForJson.mjs, write
faq-generator.mjs in the project root.

It should:

1. Take a topic as a CLI argument:
   Usage: node faq-generator.mjs "<topic>"
   If no topic is passed, print usage and exit.

2. Define a schema:
   {
     type: "object",
     properties: {
       faqs: {
         type: "array",
         items: {
           type: "object",
           properties: {
             question: { type: "string" },
             answer: { type: "string" },
             source_resource_title: { type: "string" }
           },
           required: ["question", "answer", "source_resource_title"]
         }
       }
     },
     required: ["faqs"]
   }
   (The askForJson wrapper will auto-inject additionalProperties: false
    at every object level — don't add it manually.)

3. Build the query:
   "Based on content related to '<topic>', generate 5 FAQ entries
    grounded in the corpus. Each entry includes a question, a 1-2
    sentence answer, and the title of the source resource the answer
    is grounded in."

4. Call askForJson(query, schema).

5. Pretty-print the FAQs to the console:
   "1. Q: <question>
       A: <answer>
       Source: <source_resource_title>"
   With blank lines between entries.

ES modules. Plain Node.js.
```

Send.

### 3b. Save and run

Save the file as `faq-generator.mjs`. Run:

```bash
node faq-generator.mjs "onboarding"
```

(Replace `"onboarding"` with a topic that fits your corpus.)

**You should see:** 5 FAQ entries printed, each with a question, an answer, and a source resource title.

### 3c. Verify the output

- **Is the JSON valid?** It should parse without errors.
- **Are there 5 entries?** (Sometimes the model returns 4 — that's fine.)
- **Do `source_resource_title` values match real documents in your KB?** Open the Nuclia dashboard and check. If the titles don't match, the model is hallucinating — open the schema and add a stricter prompt: *"DO NOT invent resource titles. Only cite titles that appear in the retrieved context."*

### 3d. Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `result.faqs` is undefined | Wrapper response-path mismatch | Add `console.log(result)` and inspect what came back. If it's a string, the text-fallback path is needed |
| Answers are paragraphs of prose | The model ignored the schema | Add `additionalProperties: false` confirmation — check that the wrapper actually injected it |
| `source_resource_title` is "Unknown" or made up | Model hallucinated | Tighten the prompt — see 3c above |

### 3e. Save your prompt log

Append the Step 3 brief to `prompt-log.md`.

---

## Step 4 — Workflow 2: Taxonomy generator (30 min)

### 4a. Brief your AI

Paste:

```
Write taxonomy-generator.mjs in the project root.

It takes NO CLI arguments. It asks the KB what its own taxonomy is.

Schema:
{
  type: "object",
  properties: {
    domains: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" }
        },
        required: ["name", "description"]
      }
    }
  },
  required: ["domains"]
}

Query: "Identify 6-8 distinct knowledge domains that best represent
the content available to you in this corpus. Each domain is a coherent
area of expertise. Return each with a 1-sentence description."

Call askForJson(query, schema). Print as a numbered list:
"1. <name> — <description>"

ES modules.
```

### 4b. Run

```bash
node taxonomy-generator.mjs
```

**You should see:** 6–8 numbered domains, each with a one-sentence description.

### 4c. Interpret the output

**This is the magic moment.** The KB just told you **its own taxonomy** — what topics it covers, in its own structure. Look at the list. Ask yourself:

- Do the domains match what you *think* is in your corpus?
- Are there any surprises? (Domains you didn't realise were represented?)
- Are any domains suspiciously vague? (e.g., "General Information" — usually means the corpus is mixed and could benefit from labelsets.)

**This output is a Tier-3 customer insight.** When a customer says *"we don't know what's in our docs"* — this is the script you run. It surfaces gaps and hot spots.

### 4d. Append to prompt log

---

## Step 5 — Workflow 3: Comparison-table generator (45 min)

### 5a. Brief your AI

Paste:

```
Write comparison-generator.mjs in the project root.

It takes one CLI argument: a JSON-encoded list of item names.
Example invocation:
  node comparison-generator.mjs '["Product A", "Product B", "Product C"]'

Parse the argument with JSON.parse. If parsing fails or the result
isn't an array of strings, print usage and exit.

Schema:
{
  type: "object",
  properties: {
    attributes: {
      type: "array",
      items: { type: "string" }
    },
    rows: {
      type: "array",
      items: {
        type: "object",
        properties: {
          attribute: { type: "string" },
          values: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["attribute", "values"]
      }
    }
  },
  required: ["attributes", "rows"]
}

Query (replace <items> with the JSON list):
"Compare these items from the corpus: <items>. Return a comparison
table with 5-8 rows. Each row is one attribute (e.g., price, materials,
durability, use case) with values for each item, in the same order as
the input list. If you don't have grounded information for a cell,
write 'Not available' rather than guessing."

Call askForJson(query, schema). Print as a markdown table:

| Attribute | Item 1 | Item 2 | Item 3 |
| --- | --- | --- | --- |
| <attribute> | <value1> | <value2> | <value3> |
...

ES modules.
```

### 5b. Run with three items from your corpus

Find three items your corpus actually contains. Examples vary by domain:

- E-commerce KB: three product names.
- Policy KB: three policies.
- Technical KB: three components or APIs.

```bash
node comparison-generator.mjs '["Item A", "Item B", "Item C"]'
```

**You should see:** a markdown table printed to console, with one column per item and 5-8 rows of attributes. Each cell has a grounded value or "Not available."

### 5c. Verify

- Each row's `values` array has the same length as your input list.
- Cells with no source data should say "Not available" (or similar) — not made-up text.
- Spot-check 2-3 cells against your KB — open the dashboard, find a relevant document, confirm the cell value matches.

If the model hallucinates cells, tighten the prompt: *"For any attribute you can't ground in the retrieved context, the value MUST be 'Not available' — never guess."*

### 5d. Append to prompt log

---

## Step 6 — Add traceable citations to your structured output (25 min)

The three workflows now return clean JSON. But none of those rows can be clicked back to a source — the answers are grounded, but the *output payload* is not traceable. Tier-3 buyers care about that. Add a `citation_resource_id` field to one workflow, lock it down with a system-prompt rule, and render it as a click-through.

### 6a. Add `citation_resource_id` to one schema

Pick `faq-generator.mjs`. Edit the schema so each FAQ item has a third required field:

```js
items: {
  type: "object",
  properties: {
    question: { type: "string" },
    answer: { type: "string" },
    source_resource_title: { type: "string" },
    citation_resource_id: { type: "string" }
  },
  required: ["question", "answer", "source_resource_title", "citation_resource_id"]
}
```

**You should see:** the wrapper still accepts the schema and the response now carries a `citation_resource_id` on every row.

### 6b. Add the "verbatim id" line to the system prompt

In the same file, extend the query string (or add a system-style preamble — your `askForJson` wrapper currently only takes a `query`, so prepend it to the query):

```js
const query =
  "For every FAQ item, set citation_resource_id to a VERBATIM resource id " +
  "from the retrieved context. Do NOT invent ids, slugs, hostnames or paths. " +
  "If you cannot cite a real id, omit the item entirely.\n\n" +
  `Based on content related to '${topic}', generate 5 FAQ entries ...`;
```

**You should see:** the IDs in the printed output now match real resource IDs from your KB (open the Nuclia dashboard, spot-check 2-3). If you see invented-looking slugs, the discipline line isn't biting — tighten it.

### 6c. Render each row as a click-through

Update the pretty-printer in `faq-generator.mjs` to emit a clickable line per item:

```js
for (const [i, f] of result.faqs.entries()) {
  console.log(`${i + 1}. Q: ${f.question}`);
  console.log(`   A: ${f.answer}`);
  console.log(`   Source: ${f.source_resource_title}`);
  console.log(`   Link: https://your-app.example.com/p/${f.citation_resource_id}`);
  console.log("");
}
```

(Swap `https://your-app.example.com` for whatever your downstream renderer is. In a real React app this becomes a `<CitationLink resourceId={f.citation_resource_id} />` — see the capstone reference below.)

**Verification:** Every item in your structured output should have a working click-through to the cited resource page — zero invented ids.

**See it in the capstone:** `Capstone-Aurora-Concierge/src/lib/askForJson.ts` (verbatim-id system prompt) and `Capstone-Aurora-Concierge/src/pages/Personalize.tsx` → `CitationLink` / `CitationInline` renderers.

### 6d. Append to prompt log

---

## Step 7 — Verify the three response shapes (20 min)

The `askForJson` wrapper handles three different response shapes from ARAG. You should **prove all three work** — that's how you know the wrapper is robust enough for customer engagements.

### 7a. Shape A: sync mode (the happy path — already working)

This is what you've been using. Confirms `data.answer_json` is parsed.

### 7b. Shape B: streaming mode

Temporarily edit `src/lib/askForJson.mjs` and **remove** the `"x-synchronous": "true"` header from the request. Save.

Re-run one of your workflows:

```bash
node faq-generator.mjs "anything"
```

**You should see:** the same kind of output as before. The wrapper found the `item.object` path in the streaming response.

**If it fails:** the wrapper's streaming-parse path isn't handling the response. Paste the error into your AI: *"With sync mode disabled, my wrapper fails with [X]. Fix the streaming-mode response handling."*

Put the header back when you're done.

### 7c. Shape C: text fallback

Temporarily edit one of your workflow scripts. After the schema, add the following line to the query:

> *"Reply only in plain text with the JSON embedded between ```json fences."*

Re-run. The model will now return prose with embedded JSON instead of a clean `answer_json` field — exercising the wrapper's text-fallback regex path.

**You should see:** the same output structure as before. The wrapper extracted JSON from the prose.

Put the prompt back when done.

### 7d. The point of this drill

When you sit in a customer engagement and `/ask` returns Shape C unexpectedly (it happens — model behaviour drifts), **your code keeps working**. That resilience is what separates a Tier-3 partner from a partner who delivers something fragile.

---

## Step 8 — Update prompt-log.md (5 min)

Make sure `prompt-log.md` has all five briefs (Step 2 wrapper, Step 3 FAQ, Step 4 taxonomy, Step 5 comparison, plus the citation-discipline edits from Step 6 and the response-shape verification narrative from Step 7).

---

## Step 9 — Record a 4-minute walkthrough (20 min)

Record yourself:

1. **(45 sec)** Hook: *"ARAG isn't a chatbot — it's a programmable backend. Watch three workflows in four minutes."*
2. **(60 sec)** FAQ generator. Show input. Show structured output. Narrate: *"This drops straight into our help-centre as JSON. No copy-paste, no formatting work."*
3. **(60 sec)** Taxonomy generator. Show the domain list. Narrate: *"The KB just told us its own ontology. This is a Tier-3 discovery output."*
4. **(60 sec)** Comparison-table generator. Show the markdown table. Narrate: *"This is the comparison feature the customer is paying a separate vendor for. We just generated it from our own KB."*
5. **(15 sec)** Close: *"Schema-constrained generation. The Tier-3 unlock."*

Upload to `#build-clinic-submissions`.

---

## Verification checklist

- [ ] `src/lib/askForJson.mjs` (or `.ts`) wrapper works against your KB.
- [ ] `additionalProperties: false` is **auto-injected** at every nesting level (read the code; verify the recursion).
- [ ] FAQ generator returns 4-5 grounded entries with **real** source resource titles.
- [ ] Taxonomy generator returns 6-8 sensible domains for your corpus.
- [ ] Comparison-table generator returns a structured table with same-length value arrays.
- [ ] FAQ rows carry `citation_resource_id` values that match real KB resource IDs (Step 6) and render as working click-throughs.
- [ ] All three response shapes verified (Step 7a, 7b, 7c).
- [ ] `prompt-log.md` saved with all briefs.
- [ ] 4-minute Loom recording submitted.

Then take the [Build 5 quiz](quiz.md). Pass → start [Build 6](../build-6-data-augmentation-agents/).

---

## Getting unstuck

**`result.faqs` (or any property) is undefined.**
- The response shape isn't what the wrapper expected. Add `console.log(JSON.stringify(rawResponse, null, 2).slice(0, 2000))` inside the wrapper to see what came back. Send that to your AI: *"My wrapper got this response — which path should it take?"*

**Model returns prose answers instead of JSON.**
- `additionalProperties: false` injector isn't running. Add a `console.log("Schema before send:", JSON.stringify(finalSchema, null, 2))` inside the wrapper and verify the property is on every object.

**Empty `domains` array (or any empty result).**
- Your corpus is too small. With <20 documents, the model can struggle to find "6-8 distinct domains." Either ingest more docs or accept a smaller result.

**"Cannot find module 'dotenv'."**
- Run `npm install dotenv` from the project folder. Make sure your `pwd` ends in `foundations-build-5`.

**Schema validation rejected by the API.**
- The schema's `name` field is missing or contains illegal characters (use snake_case, no spaces). Or a nested object is missing `additionalProperties: false` — verify the injector is recursive.

**Anything else.**
- Copy the entire error + the command + the schema you used.
- Paste into your AI: *"I called askForJson with [schema] and got [error]. Fix it."*

---

## Next

[Build 6 — Data-Augmentation Agents](../build-6-data-augmentation-agents/) — three agents that enrich your KB at ingest time (Generator / Labeller / Graph). Mostly dashboard work; minimal code. The platform doing your scaling work for you.
