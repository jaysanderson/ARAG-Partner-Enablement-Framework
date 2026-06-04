# Build 5 — Walkthrough: Structured Outputs

> Estimated time: 3–4 hours focused. Read the [lesson](1-lesson.md) first.
>
> **This is the most important Build in the course.** `answer_json_schema` is the feature that unlocks Tier-3 work (workflow generators, structured extraction, schema-validated AI). Take your time. The mental model you build here pays back for years.

## What you'll build

Three working **schema-constrained generators** — Node.js scripts that call ARAG and get back **structured JSON**, not prose:

1. **FAQ generator** — give it a topic; get back up to 5 grounded Q&A pairs, each citing a real document title via a verbatim resource id.
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

  askForJson(query: string, schema: object): Promise<{ result: object, resources: Record<string, any> }>

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

4. Parse the response. Handle THREE possible response shapes for the
   parsed JSON. In all three cases, ALSO surface the `resources` map
   from the response (it lives at the top level of the /ask response
   payload alongside the answer; callers need it to look up real
   document titles by resource id).

   Return shape from the function:
     { result: <parsed JSON matching schema>, resources: <resources map or {}> }

   a. The happy path: response JSON has `data.answer_json` (an object).
      result = data.answer_json.
   b. The streaming-stash path: response has `data.item.object` (an object).
      result = data.item.object.
   c. The text-fallback path: the model returned the answer in `data.answer`
      as a string (sometimes wrapped in ```json fences). Strip the fences,
      regex match either {[\s\S]*} or [[\s\S]*], JSON.parse — that becomes
      result.

   In all three paths, resources = (data.resources ?? data.retrieval_results?.resources ?? {}).

   If none of the three paths produce a parseable result object,
   throw a helpful error including the first 500 chars of the raw response.

5. Use native fetch (Node 18+). NO external HTTP library. NO Nuclia SDK.

6. Add JSDoc/TypeScript comments above the function explaining the
   three response shapes and why we handle all three. Document the
   return shape: { result, resources } — and why callers that render
   citations need the resources map (to resolve verbatim resource ids
   back to real document titles).
```

Send.

### 2b. Save the AI's output

- **Claude Code / Cursor:** *"Save this as src/lib/askForJson.mjs (or .ts). Create the lib folder if it doesn't exist."*
- **Web chat:** create `src/lib/askForJson.mjs` (or `.ts`) in VS Code, paste, save.

### 2c. Read the code carefully

This file's quality determines whether the rest of Build 5 is easy or painful. Five checks:

1. **The injector is recursive.** Find the function that walks the schema. It must descend into `properties.<key>` AND into `items` (for arrays of objects).
2. **The three response paths exist.** Search the file for: `answer_json`, `item.object` (or `item?.object`), and a regex like `/\{[\s\S]*\}/` for the text fallback.
3. **The return shape is `{ result, resources }`.** Search for `resources` and confirm the function pulls it from `data.resources` or `data.retrieval_results?.resources` (with a `{}` fallback) and returns it alongside the parsed JSON.
4. **Auth header** is `X-NUCLIA-SERVICEACCOUNT`.
5. **No SDK** — uses plain `fetch`.

If any are missing, tell the AI: *"You forgot [X]. Re-write the file with it."*

### 2d. Test the wrapper with a tiny schema

Create a smoke-test file `test-wrapper.mjs` using your text editor. In VS Code, **File → New File**. Save it (Cmd/Ctrl + S) into your project root as `test-wrapper.mjs`.

With the empty file open in the editor, paste:

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

const { result, resources } = await askForJson(
  "Suggest 3 follow-up questions someone might ask about my corpus.",
  schema
);

console.log("result:", JSON.stringify(result, null, 2));
console.log("resources keys:", Object.keys(resources).slice(0, 5));
```

Run:

```bash
node test-wrapper.mjs
```

**You should see:** a parsed result object and a (possibly empty for this smoke test) resources map:

```
result: {
  "questions": [
    "...",
    "...",
    "..."
  ]
}
resources keys: [ "..." ]
```

The `resources` map will be populated once you run a real grounded query in Step 3 — for this smoke test it may be empty, and that's fine.

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
             citation_resource_id: {
               type: "string",
               description: "The verbatim resource id slug of the document that grounds this answer — copied from the retrieved context's resources map, not invented."
             }
           },
           required: ["question", "answer", "citation_resource_id"]
         }
       }
     },
     required: ["faqs"]
   }
   (The askForJson wrapper will auto-inject additionalProperties: false
    at every object level — don't add it manually.)

3. Build the query with a verbatim-id discipline preamble:
   "For every FAQ item, set citation_resource_id to a VERBATIM resource
    id from the retrieved context's `resources` map (e.g. `terratrek-7`,
    `mara-chen`). Do NOT invent ids, slugs, hostnames, URLs, paths, or
    descriptive captions. If you cannot ground an answer in a real
    retrieved resource, omit that FAQ item entirely. Fewer well-grounded
    items beat more captioned ones.

    Based on content related to '<topic>', generate up to 5 FAQ entries
    grounded in the corpus. Each entry includes a question, a 1-2 sentence
    answer, and the citation_resource_id of the document that grounds it."

4. Call askForJson(query, schema). It returns { result, resources } where
   result is the parsed JSON matching your schema and resources is the
   resources map from the /ask response (used to look up real document
   titles by their resource id).

5. Pretty-print the FAQs to the console — look up each item's source
   title from the resources map; fall back to the id itself if the
   resource isn't in the map:

   ```js
   for (const [i, faq] of result.faqs.entries()) {
     const r = resources[faq.citation_resource_id];
     const sourceLabel = r?.title ?? faq.citation_resource_id;
     console.log(`${i + 1}. Q: ${faq.question}`);
     console.log(`   A: ${faq.answer}`);
     console.log(`   Source: ${sourceLabel}`);
     console.log("");
   }
   ```

   The lookup is the whole point: the model emits a verbatim id, the
   renderer resolves it to the real document title. Never print the
   model's id field as the source label directly — that's how
   hallucinated captions slip through.

ES modules. Plain Node.js.
```

Send.

### 3b. Save and run

Save the file as `faq-generator.mjs`. Run:

```bash
node faq-generator.mjs "onboarding"
```

(Replace `"onboarding"` with a topic that fits your corpus.)

**You should see:** up to 5 FAQ entries printed, each with a question, an answer, and a `Source:` line that resolves to a real document title from your corpus. The model may return fewer than 5 if it can only ground 3 or 4 — that's the verbatim-id discipline working as intended.

### 3c. Verify the output

- **Is the JSON valid?** It should parse without errors.
- **Are there ≤5 entries?** (The prompt tells the model to omit items it can't ground — so 3 or 4 well-grounded items beats 5 captioned ones. Fewer is healthy.)
- **Do `Source:` lines resolve to real document titles?** Open the Nuclia dashboard and confirm each printed source matches an actual resource title in your KB (e.g. *"Aurora TerraTrek 7 — Day & Thru-Hike Boot"*, not *"Mara on why she works with Aurora Outfitters"* — that second form is a model-invented caption).
- **If a source label looks like a raw id (e.g. `terratrek-7`)** rather than a human-friendly title, the fallback fired — the model emitted a valid id but that resource wasn't in the resources map. That's still grounded and correct; the model just cited a result that fell outside the returned `resources` map. Print `resources` and confirm the id is there next run.

### 3d. Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `result.faqs` is undefined | Wrapper response-path mismatch | Add `console.log(result)` and inspect what came back. If it's a string, the text-fallback path is needed |
| Answers are paragraphs of prose | The model ignored the schema | Add `additionalProperties: false` confirmation — check that the wrapper actually injected it |
| Source lines are inferred captions, not titles | Verbatim-id discipline missing OR rendering prints model output directly | Confirm the system prompt has the *"VERBATIM resource id"* + *"omit if you can't ground"* clauses. Confirm the rendering loop looks up `resources[faq.citation_resource_id]?.title` — never prints `faq.citation_resource_id` as the source label without the lookup |
| Source lines are raw ids, never titles | `resources` map is empty | The wrapper isn't surfacing `data.resources` / `data.retrieval_results.resources`. Re-check Step 2's brief — the wrapper must return `{ result, resources }` |

### 3e. Already running a broken FAQ generator?

If you've already followed an earlier version of this build and your `faq-generator.mjs` is printing hallucinated source captions (e.g. *"Mara on why she works with Aurora Outfitters"*, *"Boot durability section"* — descriptive AI-inferred phrases, not real document titles), your code is using the old `source_resource_title` field with no lookup. Patch it by telling your AI:

> *"Update faq-generator.mjs to use the new schema and prompt from Build 5 Step 3 — `citation_resource_id` field with VERBATIM-id discipline in the system prompt, and look up the source label from `resources[faq.citation_resource_id]?.title` in the print loop (fall back to the id itself if not in the map). The askForJson wrapper now returns `{ result, resources }` — destructure both. Re-run with `node faq-generator.mjs \"boots\"` and the sources should be real document titles."*

### 3f. Save your prompt log

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

Call askForJson(query, schema) — it returns { result, resources }; the
taxonomy doesn't cite specific resources, so destructure just `result`
and ignore resources (`const { result } = await askForJson(...)`).

Print as a numbered list:
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

It takes one CLI argument: a JSON-encoded list of item names that
EXIST in the connected KB.
Example invocation:
  node comparison-generator.mjs '["TerraTrek 7", "RidgeRunner Pro", "StormShield Mid"]'

Parse the argument with JSON.parse. If parsing fails, isn't an array,
isn't all strings, or has fewer than 2 items, print usage and exit.

Schema (intentionally compact — only `rows` is required, the column
headers come from the CLI argv, not the schema):

{
  type: "object",
  properties: {
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
  required: ["rows"]
}

(The askForJson wrapper will auto-inject additionalProperties: false
 at every object level — don't add it manually.)

Query construction — interpolate the items into the prompt and pin
the values-array length explicitly:

const items = <parsed CLI argv>;
const N = items.length;
const query =
  `Compare these ${N} items from the corpus: ${JSON.stringify(items)}.\n\n` +
  `Return a comparison table with 5-8 rows. Each row is one attribute ` +
  `(e.g. price, materials, durability, use case, weight, warranty) ` +
  `with a "values" array of EXACTLY ${N} strings, in the same order ` +
  `as the input list above (index 0 = "${items[0]}", index 1 = "${items[1]}", ` +
  `etc.).\n\n` +
  `For any cell you cannot ground in the retrieved context, the value ` +
  `MUST be the literal string "Not available" — never guess, never invent. ` +
  `It is better to return fewer well-grounded rows than more captioned ones. ` +
  `If you cannot find at least 3 attributes that apply to all ${N} items, ` +
  `return an empty rows array.`;

Call askForJson(query, schema) — it returns { result, resources };
the comparison table doesn't cite per-row resources, so destructure
just `result`:
  const { result } = await askForJson(query, schema);

Defensive normalisation BEFORE rendering — the model can still return
values arrays of the wrong length even with the prompt above. Pad or
truncate each row's values to length N, filling missing cells with
"Not available":

  const normalisedRows = (result.rows ?? []).map(row => {
    const vals = Array.isArray(row.values) ? row.values.slice(0, N) : [];
    while (vals.length < N) vals.push("Not available");
    return { attribute: row.attribute, values: vals };
  });

Print as a markdown table — header row comes from CLI argv, body rows
from the normalised data:

  const headerCells = ["Attribute", ...items];
  console.log("| " + headerCells.join(" | ") + " |");
  console.log("| " + headerCells.map(() => "---").join(" | ") + " |");
  for (const row of normalisedRows) {
    console.log("| " + [row.attribute, ...row.values].join(" | ") + " |");
  }
  if (normalisedRows.length === 0) {
    console.log("\n(No grounded attributes found that apply to all items.)");
  }

ES modules.
```

### 5b. Pick three items your corpus actually contains

Before running, find three items the connected KB knows about — the placeholder names from the example invocation will produce empty results because nothing in the corpus matches them.

- E-commerce KB: three real product names.
- Policy KB: three real policies.
- Technical KB: three real components or APIs.

Quick check: open the Nuclia dashboard → Resources → search for one of your candidate item names. If a resource comes back, the corpus knows about it.

Then run:

```bash
node comparison-generator.mjs '["<real item 1>", "<real item 2>", "<real item 3>"]'
```

**You should see:** a markdown table with `Attribute` + your three item names as column headers, and 5–8 rows of grounded attribute comparisons. Cells the model couldn't ground will say `Not available` literally — never invented prose.

### 5c. Verify

- Header row has exactly `Attribute` + your N item names, in argv order.
- Every body row has exactly N value cells (the defensive normaliser guarantees this — but eyeball one row to confirm the columns line up).
- `Not available` appears wherever the corpus has no grounded answer, not made-up text.
- Spot-check 2-3 cells against your KB — open the dashboard, find a relevant document, confirm the cell value matches.

If every cell is `Not available`, the items aren't really in the corpus. Run a `/find` against one of the item names in the dashboard to confirm; pick different items if so.

If the model hallucinates cells with prose instead of `Not available`, tighten the prompt: *"For any attribute you can't ground in the retrieved context, the value MUST be the literal string 'Not available' — never guess, never invent."*

### 5d. Append to prompt log

---

## Step 6 — Render citations as click-throughs (10 min)

Step 3 already taught the right citation discipline: verbatim-id schema field, verbatim-id system prompt, lookup-then-render. The FAQ rows are grounded and resolve to real document titles. The last mile — Tier-3 polish — is making each cited row clickable.

### 6a. Add a link template to the FAQ printer

Edit `faq-generator.mjs`'s print loop. Add one extra console line per item:

```js
for (const [i, faq] of result.faqs.entries()) {
  const r = resources[faq.citation_resource_id];
  const sourceLabel = r?.title ?? faq.citation_resource_id;
  console.log(`${i + 1}. Q: ${faq.question}`);
  console.log(`   A: ${faq.answer}`);
  console.log(`   Source: ${sourceLabel}`);
  console.log(`   Link:   https://your-app.example.com/p/${faq.citation_resource_id}`);
  console.log("");
}
```

Swap `https://your-app.example.com` for your downstream renderer (a Vercel preview URL, a localhost dev server, whatever your team uses). In a real React app this becomes a `<CitationLink resourceId={faq.citation_resource_id} />` component — see the capstone.

### 6b. Verify the click-throughs

Re-run `node faq-generator.mjs "<topic>"`. Every line should now have:

- A `Source:` resolving to a real document title (from Step 3's lookup).
- A `Link:` containing a VERBATIM resource id slug — never an invented hostname or path.

If you see invented-looking slugs in the `Link:` line (e.g. `aurora-outfitters.com/about-mara`), the verbatim-id discipline from Step 3 isn't biting hard enough — tighten the system-prompt clause and re-run.

### 6c. See it wired into a real app

The Aurora capstone (which you'll fork in Build 13 — these paths are a forward reference for now) shows the same pattern at React-component scale:

- [`Capstone-Aurora-Concierge/src/lib/askForJson.ts`](https://github.com/jaysanderson/Capstone-Aurora-Concierge) — the wrapper (same `{ result, resources }` return shape, same verbatim-id system prompt).
- [`Capstone-Aurora-Concierge/src/pages/Personalize.tsx`](https://github.com/jaysanderson/Capstone-Aurora-Concierge) — `CitationLink` / `CitationInline` renderers that take a `citation_resource_id`, look up the title from `resources`, and emit a working `<a href="/p/{id}">{title}</a>`.

The plumbing you just wrote in `faq-generator.mjs` is the same plumbing. The capstone just dresses it up in JSX.

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

Make sure `prompt-log.md` has all five briefs (Step 2 wrapper, Step 3 FAQ — including the verbatim-id discipline and resources-lookup rendering, Step 4 taxonomy, Step 5 comparison, plus the link-template edit from Step 6 and the response-shape verification narrative from Step 7).

---

## Verification checklist

- [ ] `src/lib/askForJson.mjs` (or `.ts`) wrapper works against your KB.
- [ ] Wrapper returns `{ result, resources }` — both shapes used downstream.
- [ ] `additionalProperties: false` is **auto-injected** at every nesting level (read the code; verify the recursion).
- [ ] FAQ generator returns up to 5 grounded entries; each `Source:` line resolves to a **real document title** from the resources lookup, never a model-invented caption.
- [ ] Taxonomy generator returns 6-8 sensible domains for your corpus.
- [ ] Comparison-table generator returns a structured table with same-length value arrays.
- [ ] FAQ rows render with a clickable `Link:` line built from the verbatim `citation_resource_id` (Step 6).
- [ ] All three response shapes verified (Step 7a, 7b, 7c).
- [ ] `prompt-log.md` saved with all briefs.

Then take the [Build 5 quiz](3-quiz.md). Pass → start [Build 6](../build-06-data-augmentation-agents/).

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

[Build 6 — Data-Augmentation Agents](../build-06-data-augmentation-agents/) — three agents that enrich your KB at ingest time (Generator / Labeller / Graph). Mostly dashboard work; minimal code. The platform doing your scaling work for you.
