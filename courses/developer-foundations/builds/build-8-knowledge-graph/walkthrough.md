# Build 7 — Walkthrough: Knowledge Graph 101

> Estimated time: 3 hours focused. Read the [lesson](lesson.md) first.

## Goal

A graph viewer UI showing typed entities from your KB, with click-to-expand traversal, hybrid entity-to-resources lookup, and the data-augmentation filter applied throughout.

## 1. Configure a data-augmentation agent (45 min)

In the Nuclia dashboard:

1. Settings → Data Augmentation → Create Agent (or your tenant's equivalent path).
2. Define your entity types (5–10). Pick from the examples in the lesson or design your own.
3. Define your relation types (5–10).
4. Run extraction over your KB. Wait until it completes — typically 1–2 minutes per document.

If the dashboard doesn't have a data-augmentation UI for your account tier, contact Progress Solution support to enable it for the course. Without an agent configured, the rest of this walkthrough is read-only against an empty graph — still worth doing for the UI build, but the demo won't land as hard.

## 2. Verify the graph populates (10 min)

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":{"and":[{"prop":"path"},{"prop":"generated","by":"data-augmentation"}]},"top_k":20}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/graph" | jq '.paths | length'
```

Should return >0. If it returns 0, your agent didn't extract anything — check the dashboard agent run logs.

Also confirm no NER noise:

```bash
# Same query but without the data-augmentation filter
curl -s -X POST ... -d '{"query":{"prop":"path"},"top_k":20}' ... | jq '.paths[].source.group' | sort -u
```

Compare the entity groups returned with and without the filter. The unfiltered version should include default NER groups (DATE, ORG, etc.); the filtered version should only include your custom ones.

## 3. Vibe-code the graph client (30 min)

```
In src/lib/graphClient.ts, export three functions:

1. queryNodesByGroup(group: string) — POSTs to /graph/nodes with
   { query: { prop: 'node', group }, top_k: 500 }. Returns the nodes array.
   Apply a client-side filter to exclude GUID-shaped values and default NER groups
   (DATE, ORG, PERSON, MONEY, GPE, LOC, TIME, EVENT, NORP, WORK_OF_ART, LAW,
   LANGUAGE, QUANTITY, ORDINAL, CARDINAL, PERCENT).

2. queryFuzzyNodes(value: string) — POSTs to /graph/nodes with
   { query: { prop: 'node', value, match: 'fuzzy' }, top_k: 50 }. Same client filter.

3. queryPaths(node: { value: string, group: string }) — POSTs to /graph with
   { query: { and: [{ prop: 'path', source: node, undirected: true },
   { prop: 'generated', by: 'data-augmentation' }] }, top_k: 100 }.
   Returns paths array. Apply client filter to source and destination of each path.

4. searchRelatedResources(entityValue: string) — POSTs to /find with
   { query: entityValue, features: ['keyword', 'semantic'], page_size: 8 }.
   Returns the resources object.

Use plain fetch. Auth via X-NUCLIA-SERVICEACCOUNT header.
```

Save prompt as `prompt-log-1.md`. Verify each function works against your KB.

## 4. Vibe-code the graph viewer page (45 min)

```
Create src/pages/GraphPage.tsx. Layout:

- Top: a fuzzy search input. As user types, call queryFuzzyNodes; show the
  top 10 matches as clickable chips below the input.
- Center: a graph visualization. Use react-force-graph (npm install) or
  cytoscape; whichever you prefer. Nodes are entities; edges are relations.
- Right sidebar: when an entity is selected, fetch its paths via queryPaths
  AND its related resources via searchRelatedResources. Show:
    - The selected entity name + group at top.
    - A list of paths grouped by relation type.
    - A list of related-resource cards.

On click of a node:
- Select it (update state).
- Fetch its paths (queryPaths).
- Merge new nodes + edges into the visualization (dedupe by node value + group).
  This is the incremental-expansion pattern.

Color nodes by entity group. Use a different colour per group; assign automatically
from a palette.

Use Tailwind for layout. TypeScript.
```

Save prompt as `prompt-log-2.md`.

## 5. Test the navigation (20 min)

Run the dev server. Test:

- Initial load: graph shows some entities (depending on agent output, may be sparse).
- Fuzzy search: type the first letters of a known entity in your corpus. Confirm autocomplete works.
- Click an entity: confirm paths load and merge into the visualization.
- Right sidebar: confirm related-resources panel populates via hybrid retrieval.
- Client filter: confirm no NER noise (no `DATE`, `ORG`, etc. nodes appear).

If NER noise appears, the client filter isn't running — brief the AI to verify.

## 6. Demonstrate a graph-only question (15 min)

Find or construct a question against your KB that *cannot* be answered by single-shot retrieval — only by graph traversal. Examples:

- Legal corpus: "Which judges have ruled on both data-privacy AND export-control matters?"
- Pharma corpus: "Which investigators have run trials on COMPOUND-X *and* COMPOUND-Y?"
- Industrial corpus: "Which products affected by INC-2027-0142 are also subject to GDPR?"

Walk through answering it using the graph viewer. Capture the entity hops on screen. This is the demo moment that closes the Tier 4 conversation.

## 7. Record 4-minute demo (15 min)

1. (30 sec) "Most AI vendors stop at retrieval. ARAG ships a typed knowledge graph extracted from your content."
2. (60 sec) Show the graph viewer's initial load. Narrate: "These are custom entity types — defined for this customer's domain by a data-augmentation agent."
3. (60 sec) Click through an entity → show its paths expand.
4. (60 sec) Demonstrate the graph-only question from Step 6.
5. (30 sec) "Tier 4 closer. No competing vendor ships this."

Upload to `#build-clinic-submissions`.

## Verification checklist

- [ ] Data-augmentation agent configured (or attempted; document the result if blocked).
- [ ] `/graph` `curl` test confirms entities are populated and the `by: "data-augmentation"` filter excludes NER noise.
- [ ] `graphClient.ts` with all four functions + client-side filter.
- [ ] `GraphPage.tsx` viewer working with fuzzy search + click-expand + right sidebar.
- [ ] At least one graph-only question demonstrated.
- [ ] `prompt-log-1.md` and `prompt-log-2.md` saved.
- [ ] 4-minute demo recorded.

## Next

[Build 9 — Field Engineering](../build-9-field-engineering/) — the highest-leverage recurring-revenue lever in the entire framework.
