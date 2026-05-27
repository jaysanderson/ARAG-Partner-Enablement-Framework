# Build 5 — Custom Field Engineering

> Part of [Advanced Extraction & Retrieval Strategies](../../README.md) — the AE&RS Specialist course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).
>
> **Top-priority asset.** This Build's deliverable is the **highest-leverage recurring-revenue lever** in the entire framework. Field engineering is content authoring, not engineering. Partners sell it as an ongoing service to customers — typical retainer is $5–15K / month per customer.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Prerequisite** | [Build 4 — Custom labelsets & classifiers](../build-4-custom-labelsets-classifiers/) |
| **Estimated effort** | 12–16 hours focused |

## What the partner does

Designs and deploys three custom JSON-encoded text fields per resource type, following pattern: `callToAction` (one-sentence branded CTA copy), `searchResultDisplay` (title + description optimised for AI-answer rendering, distinct from the raw resource title), `videoInfo` (structured speakers + topics + key points + call-to-action for video resources). Manually populates 30+ hero resources. Wires the front-end to render the fields. Trains the partner's customer's content team to author and maintain the fields. Sets up A/B testing (with-fields vs without-fields baseline).

## Pass rubric

1. 3 distinct field designs documented with purpose, schema, and author guidelines.
2. 30+ resources populated.
3. Front-end consumes the fields in search and chat surfaces.
4. Author training script + style guide shipped.
5. A/B test designed with first results documented.
6. Recorded explanation of how to sell this as a content-engineering retainer to the partner's customer.

## Asset delivered

Field-engineering playbook + author training script + A/B test scaffolding.

## Workspace

This folder is the working space for everything supporting Build 5. Drop materials here as they are built:

- `walkthrough.md` — field design + ingest + render walkthrough
- `playbook.md` — the field-engineering playbook deliverable
- `author-training.md` — training script for content teams
- `style-guide.md` — copy guidelines (CTA tone, length, urgency markers)
- `ab-scaffolding/` — A/B test runner config
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Advanced Extraction & Retrieval Strategies](../../README.md)
- Previous build: [Build 4 — Custom labelsets & classifiers](../build-4-custom-labelsets-classifiers/)
- Next build: [Build 6 — Data-augmentation agents at depth](../build-6-data-augmentation-agents/)
