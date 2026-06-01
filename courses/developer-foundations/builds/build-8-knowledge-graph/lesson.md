# Build 7 — Lesson: Knowledge Graph 101

> Read time: 12 minutes. Companion to the 12-minute [video](video-script.md).

## Why this is the Tier 4 surface

Every other RAG vendor in the market ships retrieval + an LLM. That's the table-stakes feature. ARAG ships those *plus* a **typed knowledge graph** that an agent extracts from your unstructured corpus. The graph is queryable through one API. No vendor partner ships this. It's the moat.

When a customer's CTO asks *"can your system actually reason about the relationships in our data, or is it just keyword matching with extra steps?"* — Build 7 is the answer.

## What the graph actually is

ARAG runs a **data-augmentation agent** over your KB (configured per customer, per domain). The agent extracts:

- **Entities** — typed nouns: PRODUCT, EMPLOYEE, INCIDENT, REGULATION, JUDGE, COMPOUND, whatever your domain uses.
- **Relations** — typed edges: `owns`, `affects`, `complies_with`, `cites`, `pairs_with`, etc.

Both schemas are **customer-defined**. There's no fixed taxonomy. ARAG ships with a default NER layer (DATE, ORG, PERSON, MONEY) that you'll filter out — those are noise for most domain questions.

The graph lives **inside the same KB** as the documents. You query it through `/graph` and `/graph/nodes`. The data-augmentation agent runs at ingest or on demand.

## The single most important filter in the entire programme

Every graph query you write must include:

```json
{ "prop": "generated", "by": "data-augmentation" }
```

Wrap it in an `and` with whatever else you're querying:

```json
{
  "query": {
    "and": [
      { "prop": "path" },
      { "prop": "generated", "by": "data-augmentation" }
    ]
  },
  "top_k": 50
}
```

**Why:** without this filter, your results are full of default NER noise — DATE, ORG, MONEY, dates that look like "2024" or "Q1", and so on. The filter scopes to *your* extraction agent's output only.

Forget this once and your graph view is garbage. Memorise it.

## The three graph endpoints

### 1. Paths from a source node

```json
POST /v1/kb/{id}/graph
{
  "query": {
    "and": [
      { "prop": "path", "source": { "value": "Mara Chen", "group": "AMBASSADOR" }, "undirected": true },
      { "prop": "generated", "by": "data-augmentation" }
    ]
  },
  "top_k": 50
}
```

`undirected: true` returns edges both directions from the source — `Mara → owns → product` and `product → worn_by → Mara`. Almost always what you want.

### 2. Nodes by entity group

```json
POST /v1/kb/{id}/graph/nodes
{
  "query": { "prop": "node", "group": "PRODUCT" },
  "top_k": 500
}
```

Returns all extracted PRODUCT entities. Use for entity-list UIs.

### 3. Fuzzy node search

```json
POST /v1/kb/{id}/graph/nodes
{
  "query": { "prop": "node", "value": "Mara", "match": "fuzzy" },
  "top_k": 50
}
```

Returns entities with values fuzzy-matching "Mara". Use for autocomplete and lookup boxes.

## Entity → resources lookup (hybrid retrieval)

When a user clicks on an entity, you usually want to show "documents that mention this entity." The pattern:

```json
POST /v1/kb/{id}/find
{
  "query": "Mara Chen",
  "features": ["keyword", "semantic"],
  "page_size": 8
}
```

The `features: ["keyword", "semantic"]` array is the **hybrid retrieval lever** — keyword catches exact-string matches (named entity), semantic catches paraphrases. Together they outperform either mode alone for entity lookups.

This is one of the few places hybrid mode genuinely matters. Use it.

## Designing a schema (15-minute exercise)

A good ARAG knowledge graph has 8–15 entity types and 8–15 relation types. Less than 8 doesn't capture domain structure; more than 15 confuses the extraction agent.

Three example schemas:

**Legal:**
- Entities: PARTY, MATTER, JURISDICTION, STATUTE, PRECEDENT, JUDGE, FIRM, COURT, FILING_TYPE
- Relations: ruled_by, cites, filed_in, party_to, appellate_of, dissented_from

**Pharma:**
- Entities: COMPOUND, TARGET, TRIAL, INVESTIGATOR, INDICATION, INSTITUTION, REGULATOR
- Relations: tested_in, targets, sponsored_by, approved_by, contraindicated_with, supersedes

**Industrial enterprise:**
- Entities: PRODUCT, SUPPLIER, INCIDENT, REGULATION, EMPLOYEE, FACILITY
- Relations: supplies, affects, complies_with, owned_by, located_at

**The schema must be the customer's vocabulary.** Don't impose generic types. "Matter" isn't the same as "case" in every customer's domain — get the term right.

## Client-side filter (belt and braces)

Even with `by: "data-augmentation"`, the occasional stray default-NER entity or GUID-shaped value slips through. Filter on the client:

```typescript
const GUID_PATTERN = /^[0-9a-f]{20,}$/i;
const DEFAULT_NER = new Set(['DATE', 'ORG', 'PERSON', 'MONEY', 'GPE', 'LOC', 'TIME', 'EVENT', 'NORP', 'WORK_OF_ART', 'LAW', 'LANGUAGE', 'QUANTITY', 'ORDINAL', 'CARDINAL', 'PERCENT']);

function isExcluded(node) {
  if (GUID_PATTERN.test(node.value)) return true;
  if (DEFAULT_NER.has(node.group)) return true;
  return false;
}
```

Apply to every graph response before rendering.

## Configuring the agent (preview)

Foundations Build 7 teaches you to **use** the graph. The Advanced course's Build 6 (Data-Augmentation Agents at Depth) teaches you to *design* and *deploy* the extraction agent — including precision/coverage measurement and schema evolution.

For Foundations, the sandbox KB you provisioned in Build 0 doesn't have a custom agent configured. You have two paths:

1. **Use the dashboard to configure a simple agent.** Pick 3–5 entity types and 3–5 relations. Run extraction. Limited but enough to see the graph populate.
2. **Move directly to vibe-coding the UI** assuming the graph exists, then connect a customer-provided KB during Build 11 capstone prep.

Path 1 is more satisfying. Path 2 is faster.

## What you'll vibe-code in the walkthrough

A graph viewer page:

- Initial graph load (filtered to `by: "data-augmentation"`).
- Fuzzy entity search box.
- Click an entity → fetch its paths → render them.
- Side panel showing entity → related-documents (hybrid retrieval).
- Client-side filter applied throughout.

## Common pitfalls

- **Forgetting `by: "data-augmentation"`.** Your graph is noise.
- **Generic schema.** Person, Document, Thing. The customer tunes out in five minutes.
- **Treating the graph as primary retrieval.** It's not — it augments retrieval and powers navigation UX.
- **Skipping client-side filtering.** GUID-shaped values + stray NER leak through.

## Leaf-node traversal — outbound + inbound, merged

Build 8 taught `queryPaths` which fires an OUTBOUND-only `/graph` query. That works fine for hub nodes — entities like an ambassador or a flagship product that *originate* a lot of relations. It silently fails on **leaf nodes**: competitor products, sparse destinations, anything that has zero outbound edges but rich inbound ones. Your first graph UI will render an empty canvas for roughly 30% of clicks unless you merge inbound + outbound.

The `/graph` endpoint supports both `source` and `destination` filters on the `path` query. Fire both in parallel and merge — same data-augmentation filter on each side.

```ts
async function queryPathsAround(node: { value: string; group: string }) {
  const [out, inb] = await Promise.all([
    queryPaths(node),     // source = node
    queryPathsTo(node),   // destination = node
  ]);
  const seen = new Set<string>();
  const merged: Path[] = [];
  for (const p of [...out, ...inb]) {
    const k = `${p.source.value}|${p.relation.label}|${p.destination.value}`;
    if (seen.has(k)) continue;
    seen.add(k);
    merged.push(p);
  }
  return merged;
}
```

`queryPathsTo` is a near-clone of `queryPaths` with `source` swapped for `destination` in the path predicate. The dedupe key is the triple `source|relation|destination` — that's what makes a path unique, not the path object identity.

Common failure mode: shipping outbound-only, then clicking a competitor entity on a live customer call and watching the canvas stay empty. The fail is invisible until it happens in front of someone — `/graph` returns `{"paths": []}`, no error, no warning, just a blank UI. Run `queryPathsAround` against three leaf-looking entities in your corpus before you demo.

**See it in the capstone:** `Capstone-Aurora-Concierge/src/lib/graphClient.ts` → `queryPaths`, `queryPathsTo`, `queryPathsAround`.

## From entity selection to commerce — the back-link panel

A graph UI that only shows nodes and edges is a pretty diagram. A graph UI that, when you click a node, shows the cited resources you can BUY or READ next is a pipeline driver. The recipe is a hybrid `/find` on the entity's literal value, rendered in a persona-split side panel.

`/find` with `features: ['keyword', 'semantic']` is the right call here: keyword catches the literal entity string, semantic catches paraphrases and aliases. The entity value goes in as the query — no rewriting, no LLM in the loop.

```ts
async function searchRelatedResources(entityValue: string) {
  const raw = await find({
    query: entityValue,
    features: ['keyword', 'semantic'],
    page_size: 8,
  });
  return Object.entries(raw.resources ?? {}).slice(0, 8).map(([id, r]) => ({
    id,
    title: (r.title ?? '').replace(/^#+\s*/, '').trim() || id.slice(0, 8),
  }));
}

// Then, persona-split rendering:
const visible = persona.tier === 'Prospect'
  ? related.filter(isProductOrGuide)
  : related;  // members see ambassador + content too
```

The persona split is what turns the panel from a search-result list into a tiered commerce surface. Prospects see products and guides — the things they can act on without an account. Members see the full back-link: ambassador content, endorsements, peer reviews.

Common failure mode: using `best_matches[i]` as the resource id. Those are *paragraph* references, not resource ids (see Build 0's citations section). Iterate the `resources` map directly — keys are the resource ids, values are the resource objects.

**See it in the capstone:** `Capstone-Aurora-Concierge/src/lib/graphClient.ts` → `searchRelatedResources` and `Capstone-Aurora-Concierge/src/pages/JourneyGraph.tsx` → `splitPathsByPersona`.

## What's next

[Build 9 — Field Engineering](../build-9-field-engineering/) — custom fields drive AI behaviour. The highest-leverage recurring-revenue lever in the entire framework.
