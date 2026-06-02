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

### 4a. Design entity + relation types

Before clicking, decide what entities matter for your corpus. **5–8 entity types and 5–8 relation types** is right.

For a generic corpus:

**Entity types:**
- `PERSON`
- `ORGANIZATION`
- `PRODUCT`
- `LOCATION`
- `EVENT`
- `CONCEPT`

**Relation types:**
- `works_for`
- `located_in`
- `relates_to`
- `cites`
- `participates_in`
- `mentions`

For a vertical-specific corpus, use the customer's vocabulary (legal: `JUDGE`, `MATTER`, `RULING`; pharma: `COMPOUND`, `TRIAL`, `INVESTIGATOR`; etc.).

Write your schema down in `graph-output.md`:

```markdown
# Graph schema

Entity types: PERSON, ORGANIZATION, PRODUCT, LOCATION, EVENT, CONCEPT
Relation types: works_for, located_in, relates_to, cites, participates_in, mentions
```

### 4b. Configure in the dashboard

1. Settings → Augmentation → **Graph** (or **Data Augmentation Agent** → Graph).
2. **Define entity types** — add each of your 6.
3. **Define relation types** — add each of your 6.
4. Save and trigger extraction.

**Wait time:** 30–60 seconds per document. For 10 documents, ~10 minutes total.

### 4c. Verify the graph populated

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

### 4d. Save the evidence

In `graph-output.md`, paste **5 sample paths** from the response. These are your proof the agent ran.

### 4e. Troubleshooting

| Problem | Fix |
|---|---|
| `{"paths": []}` returned | Did the agent run finish? Check dashboard status. Wait longer for completion |
| Returned paths show types like `DATE`, `MONEY`, `ORG` | You forgot the `{"prop":"generated","by":"data-augmentation"}` filter. Add it |
| Only a few paths returned | Your corpus is small — that's normal for 10 documents |
| Some entity types you defined have no entries | The model didn't find any in your corpus — that's fine; it's evidence the agent's not hallucinating |

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
- [ ] **Graph** agent configured with 5-8 entity + 5-8 relation types; `/graph` returns typed paths with data-augmentation filter.
- [ ] `graph-output.md` saved with schema + 5 sample paths.
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

**Want to keep iterating on entity/relation schema.**
- You can edit the schema and re-run extraction. Each re-run replaces previous output. Don't over-iterate on the first pass — get something basic working, then refine.

**Anything else.**
- Copy the symptom + dashboard screenshot + any error.
- Paste into your AI / `#partner-onboarding`.

---

## Next

[Build 7 — Smart Filters & Labelsets](../build-07-smart-filters/) — wire today's Labeller output into a search UI with filter chips and labelset facets. The agent you just configured becomes a visible product feature.
