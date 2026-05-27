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

## What's next

[Build 8 — Field Engineering](../build-8-field-engineering/) — custom fields drive AI behaviour. The highest-leverage recurring-revenue lever in the entire framework.
