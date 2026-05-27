# Build 5 — Lesson: Typed knowledge graph & data-augmentation agents

> Estimated reading time: 35 minutes. Read this before starting the [walkthrough](walkthrough.md). Requires passing Build 4.

## Why partners learn this

If Build 3 is where ARAG stops being a chatbot and becomes a programmable backend, Build 5 is where it stops being a retrieval engine and becomes a *knowledge platform.*

The graph isn't another retrieval index. It isn't replacement for `/find`. It's an **additional layer of structured knowledge** that ARAG extracts from your corpus and makes queryable. When a customer's CTO asks "OK, but can your system actually *reason* about the relationships in our data, or is it just keyword matching with extra steps?" — Build 5 is the answer.

Customers buying ARAG at Tier 4 buy it largely because of this Build. The graph is the moat against every "RAG with a chatbot UI" competitor in the market.

## What the graph actually is

ARAG runs a **data-augmentation agent** over your KB at ingest time (or on demand). The agent extracts:

- **Entities** — typed nouns: PRODUCT, EMPLOYEE, INCIDENT, REGULATION, etc.
- **Relations** — typed edges between entities: `owns`, `affects`, `complies_with`, `pairs_with`, etc.

Both the entity types and the relation types are **customer-defined**. There's no fixed schema. The agent is trained per-customer (effectively, per-KB) against the customer's domain.

The result is a typed knowledge graph living *inside the same KB* as the documents. You query it through `/v1/kb/{id}/graph` and `/v1/kb/{id}/graph/nodes`.

## The `{prop:'generated', by:'data-augmentation'}` filter

This is the most important fact in this Build. Every graph query you write should filter to:

```json
{
  "query": {
    "and": [
      { "prop": "path" },
      { "prop": "generated", "by": "data-augmentation" }
    ]
  }
}
```

Why? Because ARAG also extracts a **default NER (named-entity recognition)** layer — DATE, ORG, PERSON, GPE, MONEY, and 15+ other generic types. That layer is garbage for most domain questions. The `by: 'data-augmentation'` filter scopes results to *your* extraction agent's output, excluding the noise.

Forget this filter and your graph is full of "2024", "Marketing Team", "Q4" garbage entities. Include it and you get clean domain results.

The Sample ARAG App's `src/lib/graphApi.ts:140-158` is the canonical reference.

## The three graph endpoints

### 1. `POST /v1/kb/{id}/graph` — query for paths

Returns paths (entity-edge-entity triples) matching a query.

```json
{
  "query": {
    "prop": "path",
    "source": { "value": "Mara Chen", "group": "AMBASSADOR" },
    "undirected": true
  },
  "top_k": 50
}
```

`undirected: true` is almost always what you want — get edges going both directions from the source entity.

### 2. `POST /v1/kb/{id}/graph/nodes` — query for entities

Two variants:

**By group (entity type):**

```json
{ "query": { "prop": "node", "group": "PRODUCT" }, "top_k": 500 }
```

Returns all extracted PRODUCT entities.

**By fuzzy match:**

```json
{ "query": { "prop": "node", "value": "Mara", "match": "fuzzy" }, "top_k": 50 }
```

Returns entities with values fuzzy-matching "Mara". Use this for autocomplete / lookup UIs.

### 3. `POST /v1/kb/{id}/find` with hybrid mode — entity to resources

When you click on an entity in the UI and want to show "documents discussing this entity," use the regular `/find` endpoint with hybrid retrieval mode:

```json
{
  "query": "Mara Chen",
  "features": ["keyword", "semantic"],
  "page_size": 8
}
```

The `features: ['keyword', 'semantic']` array is the only place in the Sample ARAG App where hybrid retrieval is explicitly invoked (`src/lib/graphApi.ts:179-237`). Use it whenever you're bridging a graph entity to its supporting documents — the entity name itself becomes the query string.

## Designing your entity + relation schemas

A good ARAG knowledge graph has 8–15 entity types and 8–15 relation types. Less than 8 doesn't capture enough domain structure; more than 15 confuses the extraction agent.

Two examples from the Sample ARAG App's `src/lib/graphConstants.ts`:

- SPEAKER, ORGANIZATION, DEVROOM, TECHNOLOGY, PROGRAMMING_LANGUAGE, PROJECT, TALK, STANDARD, CONCEPT, VENUE.
- Relations: works_for, organizes, implements, held_in, covers_project, presents, secures, part_of, covers_topic, promotes, compared_with, targets.

Two examples for verticals you'll likely scope:

**Legal:** PARTY, MATTER, JURISDICTION, STATUTE, PRECEDENT, JUDGE, FIRM, COURT, FILING_TYPE
Relations: ruled_by, cites, filed_in, party_to, appellate_of, dissented_from

**Pharma:** COMPOUND, TARGET, TRIAL, INVESTIGATOR, INDICATION, INSTITUTION, REGULATOR
Relations: tested_in, targets, sponsored_by, approved_by, contraindicated_with, supersedes

**Both must be the customer's vocabulary.** Don't impose a generic schema. The reason data-augmentation extraction agents work is they're trained against your domain's actual language. A customer's "matter" is not interchangeable with another's "case" — get the term right.

## Client-side filtering (belt and braces)

Even with `by: 'data-augmentation'` filtering, occasional garbage entities slip through — GUID-shaped strings, entities classified as default NER groups that the agent didn't mean to emit. The Sample ARAG App's `src/lib/graphApi.ts:82-100` does client-side filtering:

```typescript
const GUID_PATTERN = /^[0-9a-f]{20,}$/i;
const DEFAULT_NER_GROUPS = new Set(['DATE', 'MAIL', 'ORG', 'PERSON', 'PRODUCT', 'TIME', 'MONEY', 'GPE', 'LOC', 'FAC', 'EVENT', 'NORP', 'WORK_OF_ART', 'LAW', 'LANGUAGE', 'QUANTITY', 'ORDINAL', 'CARDINAL', 'PERCENT']);

function isExcludedNode(node: GraphNode): boolean {
  if (node.type === 'resource' || GUID_PATTERN.test(node.value)) return true;
  if (node.group && DEFAULT_NER_GROUPS.has(node.group)) return true;
  return false;
}
```

Copy this. Apply it to every graph response.

## Incremental graph expansion

The UX pattern: the user clicks an entity, you fetch its paths, you *merge* the new nodes/edges into the existing graph (deduped by `source::label::dest`). The graph grows organically as the user explores.

The Sample ARAG App's `src/pages/KnowledgeGraphPage.tsx:116-139` is the canonical implementation. Cache aggressively — once you've fetched the paths for an entity, don't refetch.

## Foundations vs Advanced

Foundations Build 5 teaches you to **use** an ARAG knowledge graph. You'll:

- Design a domain schema (one vertical of your choice).
- Configure a data-augmentation agent against your sandbox KB.
- Run extraction and verify results.
- Build a graph navigation UI that filters to `by: 'data-augmentation'`, supports fuzzy entity search, and supports click-to-expand.
- Wire entity-to-resources lookups with hybrid retrieval.

Advanced Build 6 teaches you to **design** sophisticated extraction agents — precision/coverage measurement, schema evolution, per-vertical templates (10 verticals), agent observability. That's where partners become irreplaceable on customer accounts.

## Common pitfalls in Build 5

1. **Forgetting `by: 'data-augmentation'`.** Your graph is full of "2024", "Marketing", "Q4". The customer assumes ARAG is broken.
2. **Imposing a generic schema.** "Person" instead of the customer's "Investigator." "Document" instead of "Filing." Customers will tune you out within five minutes.
3. **Trying to make the graph the *primary* retrieval surface.** It isn't. The graph augments retrieval (Build 4 Recipe 2) and powers navigation UX. `/find` is still the primary surface.
4. **Skipping client-side filtering.** GUID-shaped values and stray default-NER nodes will leak into your graph view if you don't filter them out.
5. **No caching.** Graph queries are expensive (entity + edge lookups). Cache aggressively in the client; invalidate only when the corpus changes.

## What you'll build in the walkthrough

A single-vertical graph navigation experience against your sandbox KB:

- A data-augmentation agent configured with a custom schema (you'll pick a vertical — legal, pharma, retail, manufacturing, etc.).
- A graph viewer page (forkable from `Sample-ARAG-App/src/pages/KnowledgeGraphPage.tsx`) that:
  - Loads an initial graph filtered to `by: 'data-augmentation'`.
  - Supports fuzzy entity search.
  - Supports click-to-expand on any entity.
  - Shows related resources for the selected entity via hybrid retrieval.
- A recorded 3-minute demo answering a question that *cannot* be answered by single-shot retrieval.

## Onward

[Build 6 — Production readiness](../build-6-production-readiness/) is the last Foundations Build. Residency, BYO-LLM, rate limits, observability. After Build 6 you take the [final exam](../../final-exam.md), then move to the [Build 7 capstone](../build-7-capstone/).
