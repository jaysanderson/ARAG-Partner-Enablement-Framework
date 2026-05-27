# Build 6 — Data-Augmentation Agents at Depth

> Part of [Advanced Extraction & Retrieval Strategies](../../README.md) — the AE&RS Specialist course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).
>
> **Why this Build matters:** Developer Foundations Build 5 taught how to *use* a graph. This Build teaches how to *design the agent that produces* the graph — including for verticals beyond the textbook legal / pharma examples. This is what makes a partner irreplaceable on a customer account.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Prerequisite** | [Build 5 — Custom field engineering](../build-5-custom-field-engineering/) + [Developer Foundations Build 5](../../../developer-foundations/builds/build-5-knowledge-graph/) |
| **Estimated effort** | 14–18 hours focused |

## What the partner does

Designs a typed entity/relation schema for a partner-chosen vertical (or partner-supplied customer corpus). 8–15 entity types per schema; 8–15 relation types. Configures and deploys the data-augmentation agent. Runs extraction against a real corpus. Hand-labels a 100-example sample and measures the agent's precision per entity type and overall coverage rate. Iterates the schema and the extraction prompts. Documents a schema-evolution plan (how to add a new entity type without re-extracting everything).

## Pass rubric

1. Schema documented (entity types with definitions, relation types with semantics, edge cases).
2. Agent deployed and running against the corpus.
3. Entity coverage > 80% on the hand-labelled sample.
4. False-positive rate < 10%.
5. Observability dashboard showing per-type metrics.
6. Schema-evolution plan documented.
7. Recorded demo answering a customer question that *cannot* be answered by single-shot retrieval.

## Asset delivered

Agent design template + 10 worked vertical schemas (legal, pharma, financial services, healthcare, public sector, retail, media, manufacturing, education, energy).

## Reference reading

- Sample ARAG App `src/lib/graphApi.ts` and `src/lib/graphConstants.ts`.
- [Atlas Operations capstone](../../../developer-foundations/builds/build-7-capstone/atlas-operations/) §5.4 — worked schema for industrial enterprise.
- [Aurora Concierge capstone](../../../developer-foundations/builds/build-7-capstone/aurora-concierge/) §5.4 — worked schema for D2C retail.
- ARAKS RP-008 (Knowledge Graph RAG — 41% factual error reduction).

---

## Workspace

This folder is the working space for everything supporting Build 6. Drop materials here as they are built:

- `walkthrough.md` — schema design + agent configuration walkthrough
- `design-template.md` — agent design template
- `schemas/` — 10 worked vertical schemas (legal, pharma, fin-svcs, healthcare, public-sector, retail, media, manufacturing, education, energy)
- `precision-coverage-harness/` — measurement harness for entity-type metrics
- `observability/` — per-type dashboard config
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Advanced Extraction & Retrieval Strategies](../../README.md)
- Previous build: [Build 5 — Custom field engineering](../build-5-custom-field-engineering/)
- Next build: [Build 7 — Multimodal extraction](../build-7-multimodal-extraction/)
- Foundational version: [Developer Foundations Build 5](../../../developer-foundations/builds/build-5-knowledge-graph/)
