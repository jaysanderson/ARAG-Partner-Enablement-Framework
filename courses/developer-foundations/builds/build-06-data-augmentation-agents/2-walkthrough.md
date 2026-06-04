# Build 6 — Walkthrough: Data-Augmentation Agents

> Estimated time: 2–3 hours focused. Read the [lesson](1-lesson.md) first.
>
> **This Build is mostly dashboard configuration — not vibe coding.** You'll click around the Nuclia dashboard to enable three platform features, then verify each works. The point is *understanding the family*. Builds 7 (Smart Filters) and 8 (Knowledge Graph) are where the UIs come alive.

## What you'll build

Three data-augmentation agents configured against your Build 0 sandbox KB:

1. **Generator** — produces summaries and Q&A pairs from every document (fixes vocabulary-mismatch retrieval issues).
2. **Labeller** — classifies documents into a labelset you design (powers filter chips in Build 7).
3. **Graph** — extracts typed entities and relations into a queryable knowledge graph (powers graph navigation in Build 8).

Plus before/after evidence that each agent did something useful.

> **Note:** the path to augmentation panels varies by Nuclia tenant tier. We give general directions ("Settings → Augmentation") — your dashboard may say "Data Augmentation," "Agents," or similar. If you can't find a panel, ask in `#partner-onboarding` Slack with a screenshot.

## What you'll need open

- **Your Nuclia dashboard** with your Build 0 KB (10 documents ingested).
- **Your `.env`** with the three credentials.
- **A terminal** for verification `curl` calls.
- **Your editor** for saving notes.
- **A modern browser**.

You also need **`jq`** installed for readable JSON output:

```bash
# macOS
brew install jq

# Linux
sudo apt install jq

# Windows
# Download from https://stedolan.github.io/jq/download/
```

---

## Step 1 — Capture the baseline (10 min)

Before you turn anything on, you want a **"before" snapshot**. That way you can prove the agents actually changed something.

### 1a. Set up the Build 6 folder

```bash
cd ~/Desktop
mkdir foundations-build-6
cd foundations-build-6
cp ../foundations-build-0/.env .
code .
```

### 1b. Pick 3 sample documents

Open your Nuclia dashboard → your KB → resource list. Pick **3 documents** with distinct content:

- Different topics if possible.
- Different file types if possible (one PDF, one text, one markdown).
- Different lengths (one short, one long).

Click into each. Copy its **resource ID** (a UUID, usually visible in the URL or in a "details" panel).

Save the three IDs in a file `baseline.md`:

```markdown
# Baseline (before agents)

Sample resources:
- A: <uuid-1> — <title>
- B: <uuid-2> — <title>
- C: <uuid-3> — <title>
```

### 1c. Run a baseline query

Pick one question your corpus can answer. Run it via `/ask`:

```bash
export NUCLIA_API_URL="<your-url>"
export NUCLIA_KB_ID="<your-kb-id>"
export NUCLIA_API_KEY="<your-jwt>"

curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-synchronous: true" \
  -d '{"query":"your question here","prefer_markdown":true,"rephrase":true,"max_tokens":300}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" | jq '{answer, citation_count: (.retrieval_best_matches | length), top_citations: .retrieval_best_matches[0:3]}'
```

**What that did:** ran an `/ask` query, then used `jq` to pull just three fields — the answer text, the citation count, and the top 3 source IDs.

**You should see:** a compact JSON summary like:

```json
{
  "answer": "Based on the documents...",
  "citation_count": 5,
  "top_citations": ["uuid-1", "uuid-2", "uuid-3"]
}
```

Paste this output into `baseline.md` under a heading "Baseline query result." This is what you'll compare against later.

> **If `export` doesn't work on your shell** (Windows PowerShell, for example), substitute the actual values directly into the `curl` command, or load `.env` differently. The simplest fallback is to paste your three credentials directly into the command.

---

## Step 2 — Enable the Generator (35 min)

The Generator produces derived content (summaries, Q&A pairs) from your documents at ingest time. It's the agent that fixes the *"users ask in their language; docs use ours"* mismatch.

### 2a. Configure in the dashboard

1. Open your KB in the Nuclia dashboard.
2. Navigate to **Settings** → **Augmentation** (or **Data Augmentation** → **Generator**).
3. Toggle **Generator** on.
4. Configure outputs — at minimum enable:
   - **Summary** (resource-level summary)
   - **Q&A pairs** (synthesised likely-user-question + grounded-answer pairs)
5. If a **prompt template** field is visible for the Q&A generator, paste:

   > *"Generate 5 likely user questions a non-expert customer would ask about this document, with grounded answers. Use everyday language — not the document's technical jargon."*

6. Save.

### 2b. Trigger a re-run

Look for a **"Run on existing content"** or **"Re-process"** button. Click it. The generator runs over your already-ingested documents.

**Wait time:** for 10 documents, expect 5–15 minutes. Each document gets an LLM call to produce derivations. Take a coffee break.

**You should see:** a progress indicator showing each document processing. Status moves from "queued" → "running" → "complete."

### 2c. Verify the output

Pick **Sample A** (one of your three sample resource IDs). Fetch it:

```bash
curl -s \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/resource/<RESOURCE-ID-A>?show=basic&show=values&show=extracted" \
  | jq '.data.texts | keys'
```

**What that did:** fetched the resource and listed the keys under `data.texts`.

**You should see:** an array of keys. **Look for new keys that didn't exist before** — typically:

- `summary` (or similar)
- `qa_pairs` (or `synthetic_qa`, or `question_answer_pairs`)

To see the actual content of a generated field:

```bash
curl -s \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/resource/<RESOURCE-ID-A>?show=basic&show=values&show=extracted" \
  | jq '.data.texts.summary // .data.texts | to_entries[] | select(.key | test("summary|qa")) | {key, value: .value.body[0:300]}'
```

**You should see:** a few hundred characters of generated summary or Q&A pair content.

### 2d. Save the evidence

In your project folder create `generator-output.md`. Paste:

- The dashboard config (what you enabled + the prompt).
- A sample of generated content from one resource (summary text + a Q&A pair).

### 2e. Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| Generator option missing in dashboard | Tenant tier doesn't expose it | Ping `#partner-onboarding` to enable on your tenant |
| Run never completes | Stuck job | Cancel + restart, or check tenant LLM quota |
| `data.texts` shows no new keys | Run didn't process this resource | Confirm the document re-processed; pick a different resource ID |

---

## Step 3 — Configure the Labeller (35 min)

The Labeller classifies each document into a labelset you design. The output powers Build 7's filter chips.

### 3a. Design the labelset

Before clicking anything, decide on your labels. **5–7 labels is the sweet spot.**

For a generic mixed-content KB, sensible defaults:
- `policy`
- `procedure`
- `reference`
- `tutorial`
- `announcement`

For a vertical-specific KB, use the customer's taxonomy. **Don't design 30 labels** — too many = poor model accuracy.

Write your labelset down in your `labeller-output.md` file:

```markdown
# Labeller design

Labelset name: `topic`
Labels:
- policy — official policy documents and standards
- procedure — step-by-step how-to content
- reference — lookup tables, glossaries, specs
- tutorial — instructional walkthroughs
- announcement — news and updates
```

### 3b. Configure in the dashboard

1. Settings → Augmentation → **Labeller** (or **Classifier**).
2. **Create labelset** → name it `topic` (or your chosen name).
3. Add each label with a 1-sentence description (from your design above).
4. Choose **model-based** classification.
5. Paste the prompt:

   > *"Classify this document into exactly ONE of these topics: {labels}. Reply with just the label name — nothing else."*

6. Save and trigger a run.

**Wait time:** ~1 minute per document for 10 documents (Labeller is cheaper than Generator).

### 3c. Verify the labelset exists

```bash
curl -s \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/labelsets" | jq .
```

**You should see:** a JSON object containing your `topic` labelset with the labels you defined.

### 3d. Verify labels were assigned

```bash
curl -s \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/resource/<RESOURCE-ID-A>?show=basic&show=values" \
  | jq '.usermetadata.classifications // .classifications'
```

**You should see:** an array of classifications, each with a `labelset` and `label` field:

```json
[
  { "labelset": "topic", "label": "procedure" }
]
```

Repeat for B and C. **Save the labels assigned to each sample resource** in `labeller-output.md`.

### 3e. Troubleshooting

| Problem | Fix |
|---|---|
| Labelset created but no labels appear on resources | Did the run actually run? Re-trigger from the dashboard |
| Same label assigned to everything | Your labels are too generic — refine the descriptions |
| Empty classifications array | Re-check the prompt; maybe the model refused to classify. Add a fallback default to the prompt |

---

## Step 4 — Configure the Graph agent (45 min)

The Graph extracts typed entities and relations. Output is queryable via `/graph` and powers Build 8.

The Nuclia Graph agent dashboard asks for three things, in this order:

1. **NER types** — your domain's entity vocabulary (`PRODUCT`, `AMBASSADOR`, `DESTINATION`, etc.), each with a 1–2 sentence **Description** that lists the actual values from your corpus.
2. **NER examples** — at least 3 short pieces of prose from your corpus, each tagged with:
   - **NERs** — every entity in the text labelled as `Entity Name (TYPE)`.
   - **Relations** — every meaningful relation in the text expressed as `Subject — Object (relation_label)` triples.
3. **LLM choice + optional filter** — pick the model that does the extraction (e.g. *Gemini 2.5 Flash Lite*) and, optionally, a filter expression so the agent only runs on a subset of the KB.

There is **no separate "relation types" panel**. Relations are defined per-example as triples — the labels you use across your examples become your relation vocabulary.

### 4a. Design your NER types with rich descriptions

Before clicking, decide what entities matter for your corpus. **5–10 NER types** is the sweet spot.

Two rules for naming and describing them:

1. **Use the customer's vocabulary, not generic NER labels.** Generic types (`PERSON`, `ORG`, `LOCATION`) give you noise — Aurora Outfitters wants `AMBASSADOR` and `DESTINATION`, a legal firm wants `JUDGE` and `MATTER`, a pharma KB wants `COMPOUND` and `TRIAL`. Domain vocabulary always wins.
2. **Each type needs a Description that lists actual example values from the corpus**, not just an abstract definition. The model uses these example values as anchors when scanning new documents.

Worked example for the Aurora Outfitters corpus (this is the schema of a real working agent — the `aurora-journey-graph`):

| NER type | Description |
|---|---|
| `PRODUCT` | An Aurora Outfitters product. Always prefixed "Aurora": Aurora TerraTrek 7, Aurora Skyline 45L, Aurora Helios, Aurora Cumulus 2P, Aurora Quill 850, Aurora Crag XR, Aurora Stratus 1P. |
| `CATEGORY` | A product category: Hiking Boots, Multi-Day Packs, Down Insulation, Tents, Sleeping Quilts, Climbing Harnesses. |
| `ACTIVITY` | An outdoor activity: Day Hiking, Thru-Hiking, Alpine Climbing, Bikepacking, Multi-Pitch Sport. |
| `DESTINATION` | A trail or destination: Tasmania Overland Track, Patagonia W Trek, Tour du Mont Blanc, Annapurna Circuit, Yosemite High Sierra, Laugavegur, Te Araroa. |
| `AMBASSADOR` | An Aurora Outfitters ambassador: Mara Chen, Jonah Reyes, Dr Anya Patel, Theo Sundberg. |
| `CONTENT` | A piece of content — trail guide, blog post, video, podcast, or gear review. |
| `CUSTOMER_SEGMENT` | A customer segment: Weekend Adventurer, Thru-Hiker, Alpine Pro. |
| `LOYALTY_TIER` | A Trail Club tier: Trail Club Standard, Trail Club Plus, Trail Club Pro. |
| `BRAND_PILLAR` | One of the four Aurora brand pillars: Built for the Worst Weather, Trail-Tested by Experts, Repairable for Life, Carbon-Negative by 2030. |
| `SIZING_PROFILE` | A sizing profile: Standard, Wide Foot, Narrow Foot, High Arch. |

For a different vertical, the shape is the same — domain-specific type names + a description with the actual values that appear in the corpus.

Save your NER table in `graph-output.md` under a `## NER types` heading.

### 4b. Build 3+ NER examples — text + tagged NERs + tagged Relations

This is the few-shot teaching part. Each example is a short paragraph (1–3 sentences) of prose drawn from your corpus, with:

- **NERs** listed in the format `Entity Name (TYPE)` — every entity in the text, tagged.
- **Relations** listed in the format `Subject — Object (relation_label)` — every meaningful triple in the text.

**At least 3 examples is the minimum; 5+ is solid.** The real working `aurora-journey-graph` has 5. More examples = better coverage and more accurate extraction.

Two coverage rules:

1. **Between all your examples, every NER type from 4a must appear at least once.** If `LOYALTY_TIER` never shows up in any example, the model has no demonstration of what one looks like.
2. **Every relation label you want to extract must appear at least once.** Relation labels are inferred from the triples in your examples — `worn_by`, `recommended_for`, `pairs_with` only exist as relations because an example demonstrates them. If you never write a `(prefers)` triple, the model never learns `prefers`.

Worked examples for the Aurora corpus (these are the 5 NER examples from the real working `aurora-journey-graph` agent):

```markdown
# NER examples

## Example 1
Text:
  "The Aurora TerraTrek 7 is Aurora Outfitters' flagship four-season
   hiking boot. Designed with alpine guide Mara Chen across three field
   seasons in Tasmania, Patagonia, and the Tour du Mont Blanc.
   Recommended for Day Hiking and Thru-Hiking. Pairs with the Aurora
   Skyline 45L pack. Wide Foot profile available. Embodies Aurora's
   Repairable for Life brand pillar."

NERs:
  - Aurora TerraTrek 7 (PRODUCT)
  - Mara Chen (AMBASSADOR)
  - Tasmania Overland Track (DESTINATION)
  - Patagonia W Trek (DESTINATION)
  - Tour du Mont Blanc (DESTINATION)
  - Day Hiking (ACTIVITY)
  - Thru-Hiking (ACTIVITY)
  - Aurora Skyline 45L (PRODUCT)
  - Hiking Boots (CATEGORY)
  - Wide Foot (SIZING_PROFILE)
  - Repairable for Life (BRAND_PILLAR)

Relations:
  - Aurora TerraTrek 7 — Mara Chen (worn_by)
  - Aurora TerraTrek 7 — Tasmania Overland Track (suited_to)
  - Aurora TerraTrek 7 — Patagonia W Trek (suited_to)
  - Aurora TerraTrek 7 — Day Hiking (recommended_for)
  - Aurora TerraTrek 7 — Thru-Hiking (recommended_for)
  - Aurora TerraTrek 7 — Aurora Skyline 45L (pairs_with)
  - Aurora TerraTrek 7 — Wide Foot (fits)
  - Aurora TerraTrek 7 — Repairable for Life (embodies)

## Example 2
Text:
  "The Aurora Helios is the warmest down jacket Aurora makes. Mara Chen
   wore it across her Patagonia season. Reviewed in the gear-review
   piece 'Aurora Helios Temperature Rating Analysis' written by Mara
   Chen."

NERs:
  - Aurora Helios (PRODUCT)
  - Mara Chen (AMBASSADOR)
  - Patagonia W Trek (DESTINATION)
  - Aurora Helios Temperature Rating Analysis (CONTENT)
  - Down Insulation (CATEGORY)

Relations:
  - Aurora Helios — Mara Chen (worn_by)
  - Aurora Helios — Patagonia W Trek (suited_to)
  - Aurora Helios — Aurora Helios Temperature Rating Analysis (featured_in)
  - Aurora Helios Temperature Rating Analysis — Mara Chen (written_by)

## Example 3
Text:
  "The Aurora Crag XR is Aurora's technical climbing harness, exclusive
   to Trail Club Plus members. Theo Sundberg uses the Crag XR on every
   alpine course he teaches in Chamonix. Recommended for Multi-Pitch
   Sport and Alpine Climbing."

NERs:
  - Aurora Crag XR (PRODUCT)
  - Trail Club Plus (LOYALTY_TIER)
  - Theo Sundberg (AMBASSADOR)
  - Multi-Pitch Sport (ACTIVITY)
  - Alpine Climbing (ACTIVITY)
  - Climbing Harnesses (CATEGORY)

Relations:
  - Aurora Crag XR — Trail Club Plus (exclusive_to)
  - Aurora Crag XR — Theo Sundberg (worn_by)
  - Aurora Crag XR — Multi-Pitch Sport (recommended_for)
  - Aurora Crag XR — Alpine Climbing (recommended_for)

## Example 4
Text:
  "The Tasmania Overland Track is a six-day alpine traverse. Thru-Hikers
   prefer Multi-Day Packs over single-day daypacks for this trail.
   Alpine Climbing requires Climbing Harnesses. Day Hiking can be done
   with just Hiking Boots."

NERs:
  - Tasmania Overland Track (DESTINATION)
  - Thru-Hiker (CUSTOMER_SEGMENT)
  - Multi-Day Packs (CATEGORY)
  - Alpine Climbing (ACTIVITY)
  - Climbing Harnesses (CATEGORY)
  - Day Hiking (ACTIVITY)
  - Hiking Boots (CATEGORY)

Relations:
  - Thru-Hiker — Multi-Day Packs (prefers)
  - Alpine Climbing — Climbing Harnesses (requires)
  - Day Hiking — Hiking Boots (requires)

## Example 5
Text:
  "The Aurora Quill 850 is a lighter alternative to the Aurora Skyline
   45L's integrated quilt option. It embodies our Trail-Tested by
   Experts brand pillar — Jonah Reyes carried Quill 850 prototypes
   across the Triple Crown."

NERs:
  - Aurora Quill 850 (PRODUCT)
  - Aurora Skyline 45L (PRODUCT)
  - Trail-Tested by Experts (BRAND_PILLAR)
  - Jonah Reyes (AMBASSADOR)
  - Sleeping Quilts (CATEGORY)

Relations:
  - Aurora Quill 850 — Aurora Skyline 45L (alternative_to)
  - Aurora Quill 850 — Trail-Tested by Experts (embodies)
  - Aurora Quill 850 — Jonah Reyes (worn_by)
```

Notice the patterns:

- **Relations are between specific entities** (`Aurora TerraTrek 7 — Mara Chen`), not abstract types. Specific is what teaches the model.
- **Relations can also be at the type level** when the prose generalises (`Thru-Hiker — Multi-Day Packs (prefers)` in Example 4 — this teaches a customer-segment-to-category preference, not a specific person).
- **The same relation label gets reused across examples** (`worn_by` appears in Examples 1, 2, 3, 5) — that's how the agent learns a stable relation vocabulary.

For a different corpus, write your examples the same way: 1–3 sentences of corpus prose + NERs tagged with your types from 4a + Relations as triples. Reuse relation labels across examples deliberately — that's what makes them stick.

**Coverage check before moving on:** for each NER type in 4a, confirm it appears in at least one example's NERs list. For each relation label you want the agent to extract, confirm it appears in at least one example's Relations list.

Save all your examples in `graph-output.md` under a `## NER examples` heading.

### 4c. Configure in the dashboard

1. Open your KB → **Data Augmentation Agents** → **Create agent** → choose **Graph extraction**.
2. **Agent settings:**
   - **Agent name** — give it a memorable slug, e.g. `aurora-journey-graph`.
   - **LLM** — pick the model that does the extraction. *Gemini 2.5 Flash Lite* is a good default for cost; bump up to a heavier model only if extraction quality lags.
3. **Selected filters (optional)** — leave blank for the whole KB, or add a filter expression to scope extraction to a labelset or path. For Build 6, leave blank — run against everything.
4. **NER types** — add a row for each type from 4a. Paste the **Description** verbatim including the comma-separated value list. The values inside the description are the model's anchors.
5. **NER examples** — click **Add example** at least 3 times (5+ if you have the time). For each:
   - Paste the **Example text** on the right.
   - On the left, list each entity from the text as `Entity Name (TYPE)` under **NERs**.
   - Below, list each relation as `Subject — Object (relation_label)` under **Relations**.
6. **Save** and trigger extraction (Execution tab → **Run**).

**Wait time:** 30–60 seconds per document. For 10 documents, ~10 minutes total.

### 4d. Verify the graph populated

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":{"and":[{"prop":"path"},{"prop":"generated","by":"data-augmentation"}]},"top_k":20}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/graph" | jq '.paths[0:5]'
```

**Critical:** the filter `{"prop":"generated","by":"data-augmentation"}` is required. **Without it**, you get ARAG's default NER noise (random DATE, ORG, MONEY entities). **Always include it.**

**You should see:** 5 path triples (or fewer if your corpus is small). Each path has:

- `source` — an entity with `type` and `group` (matching one of your defined types)
- `relation` — with `type` and `label`
- `destination` — an entity with `type` and `group`

```json
{
  "source": { "value": "Acme Corp", "type": "ENTITY", "group": "ORGANIZATION" },
  "relation": { "label": "works_for" },
  "destination": { "value": "Jane Smith", "type": "ENTITY", "group": "PERSON" }
}
```

### 4e. Save the evidence

In `graph-output.md`, paste **5 sample paths** from the response. These are your proof the agent ran.

### 4f. Troubleshooting

| Problem | Fix |
|---|---|
| `{"paths": []}` returned | Did the agent run finish? Check the agent's **Execution** tab in the dashboard. Wait longer for completion |
| Returned paths show types like `DATE`, `MONEY`, `ORG` | You forgot the `{"prop":"generated","by":"data-augmentation"}` filter. Add it |
| Only a few paths returned | Your corpus is small — that's normal for 10 documents. Also re-check 4b coverage — NER types with no example demonstration tend to extract few or zero paths |
| Some NER types you defined have no entries | Either the model didn't find any in your corpus (fine — evidence the agent's not hallucinating) OR none of your examples in 4b had that type in the NERs list, so the model never learned what it looks like. Confirm every type appears in at least one example |
| A relation label never appears in the graph | That label isn't in any example's Relations list. Edit an example to include a `Subject — Object (label)` triple using it and re-run |
| NER descriptions are abstract ("a brand pillar concept") and extraction is noisy | The description needs concrete example values. Append the actual values from the corpus, comma-separated (`"... — Built for the Worst Weather, Trail-Tested by Experts, Repairable for Life, Carbon-Negative by 2030"`) and re-run |

---

## Step 5 — Compare before/after (15 min)

Re-run **the same baseline query** from Step 1:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -H "x-synchronous: true" \
  -d '{"query":"YOUR SAME QUESTION","prefer_markdown":true,"rephrase":true,"max_tokens":300}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" | jq '{answer, citation_count: (.retrieval_best_matches | length), top_citations: .retrieval_best_matches[0:3]}'
```

Compare to the Step 1c snapshot in `baseline.md`:

- **Citation count** — has it increased? (The Generator should help — derived content gives more retrieval hits.)
- **Citation diversity** — different resources surfacing in the top 3? (Better recall from Generator output.)
- **Answer quality** — does it use language closer to your query phrasing? (Generator's Q&A pairs bridge the vocabulary gap.)

Write a 3–5 sentence comparison in `baseline-comparison.md`:

```markdown
# Baseline comparison

Before agents: citations=5, top sources=[A, B, C]. Answer was generic.

After agents: citations=8, top sources=[A, B, X]. New source X surfaced
because the Generator created a Q&A pair using the user's wording.
Answer is more specific and grounded in the right document.
```

If you don't see a noticeable improvement, that's fine for a 10-document sandbox — the effect is much more dramatic at customer scale. **Note this in your comparison file** for the reviewer.

---

## Step 6 — Vibe-code one tiny verification utility (20 min)

This Build's one piece of code: a small script that pings all three agents' outputs in one go. Useful for customer engagements — you'll re-run this during ingestion to confirm all three are working.

### 6a. Brief your AI

```
Write agent-status.mjs that:

1. Reads NUCLIA_API_URL, NUCLIA_KB_ID, NUCLIA_API_KEY from .env
   (use dotenv).
2. Takes 3 resource IDs as CLI args:
   node agent-status.mjs <uuid-1> <uuid-2> <uuid-3>
3. For each resource:
   a. GET /resource/{id}?show=basic&show=values&show=extracted
   b. Check:
      - Generator: does data.texts have new keys (summary, qa_pairs,
        synthetic_qa, or similar)? PASS if yes.
      - Labeller: does usermetadata.classifications (or classifications)
        have at least one entry? PASS if yes.
   c. POST /graph with query {and: [{prop:"path"}, {prop:"generated",
      by:"data-augmentation"}]} top_k 50.
      - Graph: are any paths returned where source.value or destination.value
        match terms from this resource's title? PASS if yes (PASS with a
        warning if there are graph paths but none reference this resource).
4. Print:
   "Resource <id>:"
   "  Generator: PASS/FAIL"
   "  Labeller:  PASS/FAIL — labels: [list]"
   "  Graph:     PASS/FAIL — N relevant paths"

Use plain fetch, no SDK. ES modules. Add header
X-NUCLIA-SERVICEACCOUNT: Bearer {NUCLIA_API_KEY}.
```

### 6b. Save and run

```bash
node agent-status.mjs <uuid-A> <uuid-B> <uuid-C>
```

**You should see:** one block per resource, three PASS/FAIL lines per block. Ideally all PASS. If any FAIL, the agent didn't run on that resource — check the dashboard, re-run if needed.

### 6c. Save your prompts

Create `prompt-log.md`. Paste the Step 6 brief. Add notes about any fixes you had to ask for.

---

## Verification checklist

- [ ] `baseline.md` saved (pre-agents query + answer + citation count).
- [ ] **Generator** enabled in dashboard; derived summary + Q&A fields visible in a resource fetch.
- [ ] `generator-output.md` saved with config + sample output.
- [ ] **Labeller** configured with one labelset (5-7 labels); model-based prompt; sample resource shows assigned label via API.
- [ ] `labeller-output.md` saved with design + sample assignments.
- [ ] **Graph** agent configured with 5–10 NER types (each with a Description listing actual corpus values) and **at least 3 NER examples — 5+ recommended, matching the worked example** (text + tagged NERs + tagged Relations triples); `/graph` returns typed paths with the `data-augmentation` filter.
- [ ] `graph-output.md` saved with NER types table + at least 3 (ideally 5+) NER examples + 5 sample paths.
- [ ] `baseline-comparison.md` saved (before/after observations).
- [ ] `agent-status.mjs` working — all three agents PASS on 3 sample resources.
- [ ] `prompt-log.md` saved.

Then take the [Build 6 quiz](3-quiz.md). Pass → start [Build 7](../build-07-smart-filters/).

---

## Getting unstuck

**Dashboard doesn't show an Augmentation / Generator panel.**
- Your tenant tier doesn't expose it via UI. Ask in `#partner-onboarding` for tenant access. The agents can also be configured via API — but for Build 6 the dashboard path is expected.

**Generator run takes forever.**
- LLM cost — each document gets an LLM call. For 10 documents, ~15 min is normal. If it's >30 min, check tenant LLM quota.

**Labeller returns the same label for everything.**
- Your label definitions are too generic. Refine each label's 1-sentence description so they're more distinct. Re-run.

**`/graph` returns DATE / MONEY / ORG entities.**
- You forgot the filter. Always include `{"prop":"generated","by":"data-augmentation"}` in the query.

**`/graph` returns empty paths even after configuration.**
- Did the run complete? Check dashboard status. The graph extraction is the slowest of the three.

**Want to keep iterating on NER types or examples.**
- Open the agent in the dashboard → **Edit configuration** → tweak NER type descriptions or add/edit NER examples → save → re-run from the **Execution** tab. Each re-run replaces previous output. Don't over-iterate on the first pass — get a basic config working with 3 examples, see what extracts, then add the 4th and 5th examples to plug coverage gaps.

**Built the graph in code instead of the dashboard.**
- The `anthropic-skills:arag-graph-agent` skill can auto-generate a complete NER type table + 5+ NER examples from a sample of your KB by analysing the documents. Use it as a starting point if your corpus is large or the domain vocabulary isn't obvious; tune the output in the dashboard.

**Anything else.**
- Copy the symptom + dashboard screenshot + any error.
- Paste into your AI / `#partner-onboarding`.

---

## Next

[Build 7 — Smart Filters & Labelsets](../build-07-smart-filters/) — wire today's Labeller output into a search UI with filter chips and labelset facets. The agent you just configured becomes a visible product feature.
