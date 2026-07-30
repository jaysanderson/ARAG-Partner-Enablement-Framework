# Build 6 — Lesson: Data-Augmentation Agents

> Read time: 10 minutes.

## Why partners learn this Build

ARAG ships three named **data-augmentation agents** that run over your KB at ingest time (or on-demand over the corpus later). Each one enriches the content in a specific way; each one solves a different customer problem.

Partners who treat these as **one platform feature** scope customer engagements differently — and more profitably — than partners who only know the graph because that's the one with the prettiest demo. This Build introduces the family. Builds 7 (Smart Filters) and 8 (Knowledge Graph) drill into the labeller and graph agents in depth. The generator agent's coverage is right here.

## The family in one sentence each

| Agent | What it does | Customer signal |
|---|---|---|
| **Generator** | Produces *derived* content from your sources at ingest — summaries, Q&A pairs, key takeaways, semantic chunks with extended context | *"The user's question doesn't use the same vocabulary as our documents."* |
| **Labeller** | Classifies resources and paragraphs into labelsets at ingest — content_type, audience, region, priority, sensitivity, etc. | *"We have thousands of documents and users need to filter."* |
| **Graph** | Extracts typed entities + typed relations into a queryable knowledge graph | *"Find the connections between X and Y."* / *"Which judges ruled on these matters and also cited these precedents?"* |

All three run **at ingest** (or as a one-off batch later). All three are configured **per KB** in the Progress Agentic RAG dashboard or via API. All three produce artefacts that downstream API calls — `/find`, `/ask`, `/graph` — return alongside the document content.

## P1 — The Generator agent

The least-understood of the three. Most partners don't even know it exists.

**What it does:** for each ingested document, the generator agent produces additional pieces of retrievable content derived from the source:

- **Summaries** at the resource and section level.
- **Synthetic Q&A pairs** — "the user might ask X; here's the answer grounded in this document."
- **Semantic chunks with extended context** — the chunker enriches each paragraph with surrounding context so retrieval matches happen on richer text.
- **Key takeaways** — bulleted distillations per resource.

**Why this matters:** retrieval matches happen against everything in the KB. If your user asks "how do I onboard a new field engineer?" but your source documents only use phrases like "first-day procedures for FSE staff," vector retrieval *might* catch the paraphrase but keyword retrieval won't. The generator fixes this by synthesising the user-vocabulary version of the content alongside the original.

**Customer-facing pitch:** *"We pre-generate Q&A pairs and summaries from your documents so retrieval works against both your team's vocabulary and your users' vocabulary."*

**Configuration:** in the Progress Agentic RAG dashboard → KB → Augmentation. Toggle Generator. Choose which derived content types to produce. Provide an optional prompt template (e.g., for the Q&A generator). Run.

## P2 — The Labeller agent

You already met this one in passing — it's the "classifier" behind the labelsets you'll wire in Build 7. Now treat it as a named agent.

**What it does:** at ingest, the labeller assigns labels per labelset to each resource (or each paragraph, if configured for paragraph-level labelling). It's **model-based only** — there's no rule-based / regex mode. Configuration has two parts: for **each label**, you write a short description of how to identify it (e.g., for a `topic` labelset: `onboarding` — *"helps a new user get started or set up the product"*, `policy` — *"describes an official rule, standard, or compliance requirement"*); separately, you choose whether classification is **limited to a single label** per document or **allows multiple labels**.

**Why this matters:** labels are the cheapest precision lever in retrieval (you saw this in Build 1's hint about filters). The labeller is what populates them — without it, you'd be hand-labelling every document forever.

**Customer-facing pitch:** *"Your content team designs the taxonomy; the labeller tags every document and paragraph in your corpus automatically; your search box gets filter chips that actually work."*

**Configuration:** dashboard → KB → Augmentation → Labeller. Pick the labelset to populate. Write an identification description for each label. Choose single-label or multi-label classification. Run.

Build 7 is the application — designing the labelset, populating it via the labeller, wiring filters into a search UI.

## P3 — The Graph agent

The one with the most visual demo. Builds the typed knowledge graph that you'll query in Build 8.

**What it does:** at ingest, the graph agent extracts:

- **Typed entities** — `EMPLOYEE`, `PRODUCT`, `INCIDENT`, `JUDGE`, `COMPOUND`, whatever your domain uses. You define the entity types.
- **Typed relations** — `owns`, `affects`, `cites`, `tested_in`, whatever. You define the relation types.

The output is the queryable graph that `/graph` and `/graph/nodes` (Build 1 primitive P4) return.

**Why this matters:** documents alone can't answer relational questions. The graph agent adds the structured layer that lets you traverse the corpus.

**Customer-facing pitch:** *"We extract a typed knowledge graph from your unstructured content. Your customer's CTO sees relationship-shaped questions become queryable through one API."*

**Configuration:** dashboard → KB → Augmentation → Graph. Define entity-type schema (8–15 types is the sweet spot). Define relation-type schema (8–15 relations). Run extraction. The Build 8 walkthrough covers this in depth.

**Critical filter (recap):** every graph query you write later wraps `{prop: 'generated', by: 'data-augmentation'}` to scope results to *your* agent's output (excluding ARAG's default NER noise like DATE, ORG, MONEY).

## When to reach for which

Three customer questions, three agents:

> *"Our search isn't finding things even when the answer is clearly in the corpus."* → **Generator.** Vocabulary mismatch. Pre-generate Q&A pairs and summaries.
>
> *"We need our users to filter results by content type, region, audience."* → **Labeller.** Design the taxonomy, populate via labelsets, expose as filter chips.
>
> *"We want to surface connections between concepts that no single document contains."* → **Graph.** Define entity/relation schema, extract, expose the graph navigation.

Customers often need more than one. A pharma deployment usually wants all three — generator (to handle clinical-vocabulary mismatches), labeller (to filter by trial phase / indication / regulator), and graph (to traverse the COMPOUND → TRIAL → INVESTIGATOR network).

## Cost and operational notes

All three agents:

- Run at **ingest time** by default; you can also trigger them as a one-off batch over the existing corpus.
- Increase **ingest latency** — generator the most (it makes LLM calls per document), labeller and graph in proportion to schema complexity.
- Add **operational LLM cost** at ingest, billed to the BYO-LLM endpoint you configured.
- Are **per-KB**, so you can have different agent configurations per customer or per business unit.

For a small sandbox (10–50 documents), all three together run in under 30 minutes. For a 10,000-document customer corpus, plan for 6–24 hours of batch ingest the first time, then incremental updates as content lands.

## What you'll do in the walkthrough

Configure all three agents against your Build 0 sandbox KB and verify each works:

1. Turn on the **Generator**; choose summary + Q&A output; ingest a few documents and inspect the derived content.
2. Configure a **Labeller** with one labelset (model-based prompt); run; verify labels show up on resources.
3. Configure a **Graph** agent with 5–8 entity types and 5–8 relations; run; query `/graph` and verify typed entities appear.

You're not building UIs in this Build — those come in Builds 7 (filters) and 8 (graph viewer). Today is **dashboard configuration + verification only**.

## Common pitfalls

- **Treating "data augmentation" as just the graph.** It's three named agents.
- **Skipping the Generator.** Most partners do. Then their customer's retrieval underperforms and they assume it's a chunking problem.
- **Designing 30 entity types in the Graph schema.** Too many. Stick to 8–15.
- **Configuring all three at once for a fresh KB without verifying each.** Configure → ingest a small sample → verify → next agent. Iterate, don't paralleli​se on the first pass.

## What's next

[Build 7 — Smart Filters & Labelsets](../build-07-smart-filters/) — the Labeller agent in action. You'll design a labelset, populate it via the agent you just enabled, and wire filter chips into a search UI.

After that, [Build 8 — Knowledge Graph 101](../build-08-knowledge-graph/) is the Graph agent in action.

The Generator's outputs come into play silently — every `/find` and `/ask` call after this Build will benefit from the derived content the agent produced. You won't see new UI for it, but your retrieval quality will improve, and your customer's "the search doesn't work" complaint will quiet down.
