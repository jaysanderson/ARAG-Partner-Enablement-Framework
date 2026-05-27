# Build 0 — Hello ARAG

> Part of [Developer Foundations](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Owning track(s)** | Sell, Solution, Deliver — all three tracks start here |
| **Tier mapped to** | Tier 1 prep |
| **Prerequisite** | None — this is the on-ramp |
| **Estimated effort** | 4–6 hours focused, including reading |

## Start here

Work through the three course-material files for this Build in order:

1. **[lesson.md](lesson.md)** — concepts, ARAG patterns, why this Build matters. Read first.
2. **[walkthrough.md](walkthrough.md)** — step-by-step build instructions with code and verification checklist.
3. **[quiz.md](quiz.md)** — 8 MC + 1 short answer; pass = 7/8 + credible short answer.

The rest of this README is a quick-reference summary. The full content lives in the three files above.

---

## What the partner does

Provisions a sandbox KB. Ingests 10 documents from their own corpus. Makes their first `/ask` call from `curl`. Runs `/find` for a semantic search. Opens the [Sample ARAG App](https://github.com/jaysanderson/Sample-ARAG-App) and points it at their KB.

## Pass rubric

1. Sandbox KB provisioned and reachable.
2. Three successful streamed answers against the partner's own content with citations rendered.
3. Sample ARAG App `/assistant` page running locally against the partner's KB.
4. Reviewer signs off.

## Asset delivered

A 30-minute recorded run-through of the partner's own corpus answering three of their customer's most common questions. This is the first thing they show in a customer meeting.

---

## Workspace

This folder is the working space for everything supporting Build 0. Drop materials here as they are built:

- `walkthrough.md` — step-by-step exercise (KB provisioning, ingest, first calls)
- `setup/` — sandbox provisioning scripts, env templates
- `slides/` — slide deck for the build clinic
- `recording-template.md` — script for the 30-minute partner recording
- `verification.md` — reviewer checklist

The course README (`../../README.md`) is the canonical curriculum source; this README mirrors the build's at-a-glance for fast reference.

## See also

- Parent course: [Developer Foundations](../../README.md)
- Next build: [Build 1 — Grounded search & drop-in widgets](../build-1-grounded-search-widgets/)
