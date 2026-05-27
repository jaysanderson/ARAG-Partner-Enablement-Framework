# Build 6 — Walkthrough: Data-Augmentation Agents

> Estimated time: 2 hours focused. Read the [lesson](lesson.md) first.

## Goal

Configure all three agents against your Build 0 sandbox KB. Verify each one works. Document a one-paragraph summary of what each enriched.

This Build is **dashboard configuration + verification**. No vibe-coded UI. The UIs that consume each agent come in Builds 7 (filters), 8 (graph). The Generator's output is invisible but improves every `/find` and `/ask` after this Build.

## 1. Inventory your sandbox content (10 min)

Open the Nuclia dashboard for your KB. Pick **3 documents** that have distinct content (different topics, different lengths, different file types if possible). Note their resource IDs.

These three are your "before/after" sample. You'll inspect them after each agent runs.

Capture a baseline: ask one query against your KB via `/ask`. Save the answer + citation list in `baseline.md` in this Build folder.

## 2. Enable the Generator (30 min)

In the dashboard:

1. Settings → Augmentation → Generator.
2. Toggle on.
3. Configure outputs — at minimum, enable **summary** and **Q&A pairs**.
4. If a prompt template field is shown for the Q&A generator, use a default prompt like: *"Generate 5 likely user questions a customer would ask about this document, with grounded answers. Use everyday language a non-expert would use."*
5. Save.
6. Trigger a re-run over the existing 3 sample documents (or wait for next ingest cycle if you're ingesting fresh content).

Once it completes, fetch one of the resources via `/resource/{id}` with all show flags:

```bash
curl -s -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/resource/<resource-id>?show=basic&show=values&show=extracted" | jq '.data | keys'
```

You should see new fields under `data.texts` (or similar) holding the generated summary and Q&A content. Inspect a few.

**Save the prompt + a sample output** in `generator-output.md`.

## 3. Configure a Labeller (30 min)

1. Settings → Augmentation → Labeller.
2. Create a labelset. Name: `topic` (or anything domain-relevant). Add 5–7 labels with 1-sentence definitions.
3. Choose **model-based** classification. Write a prompt: *"Classify this document into ONE of these topics: {labels}. Reply with just the label name."*
4. Save and run.

Verify:

```bash
curl -s -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/labelsets" | jq .
```

Should return your labelset with labels.

For each of your 3 sample resources, fetch them via `/resource/{id}` and confirm the assigned labels appear under `classifications` or `usermetadata.classifications`.

**Save the labelset design + a sample labelled resource** in `labeller-output.md`.

## 4. Configure a Graph agent (45 min)

1. Settings → Augmentation → Graph (or "Data Augmentation Agent" — name varies by tenant tier).
2. Define **entity types**. Pick 5–8 for your sandbox content. Examples for a generic corpus: `PERSON`, `ORGANIZATION`, `PRODUCT`, `LOCATION`, `EVENT`, `CONCEPT`. For a domain-specific corpus (legal, pharma, etc.), use the customer's vocabulary.
3. Define **relation types**. 5–8 to start. Examples: `works_for`, `located_in`, `relates_to`, `cites`, `participates_in`.
4. Save and trigger extraction.

Wait for the run to complete (typically 30–60 sec per document for small corpora). Verify:

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":{"and":[{"prop":"path"},{"prop":"generated","by":"data-augmentation"}]},"top_k":20}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/graph" | jq '.paths[0:5]'
```

Should return 5 path triples. Check:

- Each `source` and `destination` carries `type` and `group` (one of your defined entity types).
- Each `relation` carries `type` and `label` (one of your defined relation types).
- No default NER groups (DATE, ORG, MONEY, etc.) appearing — the filter excludes them.

**Save the entity + relation schema and 5 sample paths** in `graph-output.md`.

## 5. Re-run the baseline query (10 min)

Now that all three agents have enriched the corpus, re-run the same query you saved in `baseline.md`. Compare:

- Citation count — did it increase? (Generator should help.)
- Citation diversity — different resources surfacing? (Generator + better recall.)
- Did filtering by your new labelset narrow the result set sensibly? (Labeller.)
- Is the graph response non-empty for a query that references one of your entities? (Graph.)

Save your before/after observations in `baseline-comparison.md`.

## 6. Vibe-code one tiny verification utility (15 min)

This Build's only code: a small script that pings all three agent outputs.

Brief your AI:

```
Write agent-status.mjs that:
1. Reads NUCLIA_* env vars from .env.
2. Picks 3 resource IDs (pass as CLI args).
3. For each, fetches /resource/{id} with all show flags.
4. Reports per resource:
   - Whether generator-derived content is present (look for new keys in data.texts)
   - Which labels are assigned (under classifications or usermetadata.classifications)
   - Number of graph edges originating from entities found in the document
5. Prints a one-line PASS/FAIL per resource per agent.

Use plain fetch, no SDK. TypeScript or Node.mjs both fine.
```

Run it. Confirm each agent gives a PASS for your 3 sample resources.

Save the AI's prompt + script as `prompt-log.md`.

## 7. Record a 3-minute walkthrough (10 min)

1. (30 sec) "ARAG's three data-augmentation agents enrich a KB three different ways at ingest. Watch."
2. (60 sec) Show the dashboard Generator config. Show a resource with the generated summary + Q&A fields populated.
3. (45 sec) Show the Labeller config. Show a resource with a label assigned. Highlight the labelset definition.
4. (45 sec) Show the Graph config. Show a sample of typed entities + relations in the response.
5. (15 sec) Close: "Three agents, three customer signals: vocabulary mismatch → Generator; filter precision → Labeller; relationship traversal → Graph. Builds 7 and 8 are where the Labeller and Graph come alive in UI."

Upload to `#build-clinic-submissions`.

## Verification checklist

- [ ] `baseline.md` saved (pre-agents query + answer + citations).
- [ ] Generator enabled; derived summary + Q&A fields visible in a resource fetch.
- [ ] `generator-output.md` saved.
- [ ] Labeller configured with one labelset (5–7 labels); model-based prompt; sample resource shows assigned label.
- [ ] `labeller-output.md` saved.
- [ ] Graph agent configured with 5–8 entity + 5–8 relation types; `/graph` returns typed paths with data-augmentation filter.
- [ ] `graph-output.md` saved.
- [ ] `baseline-comparison.md` saved (before/after observations).
- [ ] `agent-status.mjs` working.
- [ ] `prompt-log.md` saved.
- [ ] 3-minute recording submitted.

## Next

[Build 7 — Smart Filters & Labelsets](../build-7-smart-filters/) — wire the labeller's output into a search UI with filter chips and labelset facets.
