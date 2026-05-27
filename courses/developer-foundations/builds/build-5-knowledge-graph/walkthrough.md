# Build 5 — Walkthrough: Knowledge graph & data-augmentation agents

> Estimated time: 12–16 hours focused. Complete the [lesson](lesson.md) first.

## Prerequisites

- Builds 0–4 complete.
- 30+ documents ingested in your sandbox KB (more is better — graphs are sparse with small corpora).
- Access to the `arag-graph-agent` skill (under `anthropic-skills`).

## 1. Pick a vertical

Choose one domain to design your graph schema around. Examples:

- Legal: PARTY/MATTER/JURISDICTION/STATUTE/PRECEDENT/JUDGE/FIRM
- Pharma: COMPOUND/TARGET/TRIAL/INVESTIGATOR/INDICATION/INSTITUTION/REGULATOR
- Manufacturing: SITE/PRODUCT/MACHINE/INCIDENT/SUPPLIER/REGULATION/EMPLOYEE
- Education: COURSE/TOPIC/INSTRUCTOR/STUDENT/INSTITUTION/CERTIFICATION/PREREQUISITE

Or use your own customer's domain if you have one in scope.

Ensure your sandbox KB has content in that domain. (If you've been using a generic corpus, this is the moment to ingest 20–30 vertical-specific documents.)

Save your chosen vertical + the schema sketch to `schema-design.md` in this Build folder.

## 2. Design the schema (entity types + relation types)

Draft 8–15 entity types. For each:

- Type name (UPPER_SNAKE_CASE).
- 1-sentence definition.
- 3–5 example values.

Draft 8–15 relation types. For each:

- Type name (lower_snake_case).
- Domain → Range (e.g. PRODUCT → REGULATION).
- 1-sentence semantics.
- 3 example sentences from a document that *would* express this relation.

Save to `schema-design.md`. This is the input to the agent configuration step.

## 3. Generate the agent (using `arag-graph-agent`)

In your Claude session, invoke the skill:

```
/skill arag-graph-agent
```

Provide:

- The sandbox KB UUID + service-account JWT.
- Your schema design from step 2.
- A 5-document sample for the skill to analyse.

The skill produces a runnable Python script. Save it as `agent.py` in this Build folder.

Review the script before running. Key things to verify:

- The entity types in the script match your design.
- The relation types match your design.
- The KB ID matches your sandbox.

## 4. Run the extraction

```bash
python3 agent.py
```

The agent will iterate through your KB, calling the LLM to extract entities and relations from each document. Expect 5–15 seconds per document. For a 30-document KB, plan for 5–8 minutes.

Watch for errors. Common failures:

- Auth — service-account JWT typo.
- Schema — the LLM occasionally returns entities outside your taxonomy. The script should normalise these (the `arag-graph-agent` skill output handles this).
- Rate limits — if you hit 2400 req/min, the script should back off automatically.

After the run completes, verify in the Nuclia dashboard: the KB's graph view should now show typed entities and relations.

## 5. Test the graph endpoints from `curl`

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "and": [
        { "prop": "path" },
        { "prop": "generated", "by": "data-augmentation" }
      ]
    },
    "top_k": 50
  }' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/graph" | jq '.paths[0:5]'
```

You should see 5 paths (entity-edge-entity triples). Confirm:

- Source and destination both have `type` and `group` fields.
- Relation has a `label` and `type`.
- The paths are *meaningful* — they reflect the vertical you chose, not generic NER noise.

If you see generic NER results (`DATE`, `ORG`, etc.) leaking through, your `by: 'data-augmentation'` filter is incorrect — re-check the request body.

## 6. Build the graph viewer page

Fork `KnowledgeGraphPage`:

```bash
cp  
```

Open the new file and modify:

- Update the entity-type color map to match your schema (or reuse).
- Update the relation-label map.
- Confirm the data-augmentation filter is applied in the initial graph load.

Add a route. Open the page. Verify:

- Initial graph loads with 10–30 nodes.
- Click an entity → its paths expand into the graph.
- Search bar fuzzy-matches entity names.
- Right-side panel shows related resources (via hybrid retrieval) for the selected entity.

## 7. Wire hybrid entity-to-resources lookup

Copy the `searchRelatedResources` function from. Ensure it uses `features: ['keyword', 'semantic']`.

Wire it: when the user clicks an entity, fire `searchRelatedResources(entityValue)` and render the results in a side panel. Each result is a clickable card linking to the source document.

## 8. Apply client-side filtering

Add the `isExcludedNode` filter from to your code. Make sure every graph response passes through it before rendering.

Test: search for "20" or "Q1" or another generic NER-shaped term. Confirm those entities don't appear in your graph view (the filter should drop them).

## 9. Demonstrate "this can't be answered by retrieval alone"

The core demo: a question that *requires* graph traversal.

For a legal corpus example: "Which precedents on data privacy in EU jurisdiction have been cited by judges who also presided over compliance breach cases?"

Single-shot `/ask` cannot answer this. It needs:

1. Find all PRECEDENT entities tagged with "data privacy" and "EU".
2. Find the JUDGE entities that ruled on them.
3. Filter to judges who *also* presided over MATTER entities tagged "compliance breach".
4. Return the intersection.

That's a graph query, not a vector search. Build one of these against your vertical. Save it as the demo highlight.

## 10. Record the 3-minute demo

Structure:

- (0:00) "Here's a question I want answered. It's not a retrieval question — it's a relationships question."
- (0:30) Show the question. Run it through your Build 0 single-shot assistant. Get a vague / wrong answer. Narrate why.
- (1:00) Switch to your graph viewer. Walk through the entities involved. Click through to show the relationships. Narrate the path: "This judge ruled on these matters. Among them, these are compliance-breach types. Among the precedents she cited, these are about data privacy."
- (2:00) Synthesise the answer from the graph navigation. Narrate: "Single-shot retrieval would never have surfaced this. The graph lets us answer relational questions about the corpus, not just retrieval questions."
- (2:30) Close: "This is what customers buy at Tier 4. Every customer with a structured-knowledge domain — legal, pharma, finance, healthcare, regulatory — needs this. ARAG is the only platform shipping it natively."

Submit the recording.

## Verification checklist

- [ ] Schema designed (8+ entity types, 8+ relation types) and saved as `schema-design.md`.
- [ ] Agent generated via the `arag-graph-agent` skill and committed as `agent.py`.
- [ ] Extraction run completed; graph endpoints return typed-entity results.
- [ ] Graph viewer page deployed locally with the data-augmentation filter applied.
- [ ] Fuzzy entity search working.
- [ ] Click-to-expand graph traversal working.
- [ ] Entity-to-resources lookup using hybrid retrieval working.
- [ ] Client-side filter applied (no GUID values, no default NER).
- [ ] 3-minute demo recorded showing a question that *only* the graph can answer.

## Next

[Build 6 — Production readiness](../build-6-production-readiness/) is the last Foundations Build before the [final exam](../../final-exam.md) and the [Build 7 capstone](../build-7-capstone/).
