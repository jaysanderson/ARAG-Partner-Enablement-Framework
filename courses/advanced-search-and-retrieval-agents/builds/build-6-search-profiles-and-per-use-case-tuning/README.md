# Build 6 — Search Profiles & Per-Use-Case Tuning

> Part of [Advanced Search & Retrieval Agents](../../README.md).
>
> **Why this matters:** One KB usually serves multiple personas — internal staff need exhaustive results, customers need filtered curated results, executives need terse summarised results. Partners who ship one search configuration optimise for one persona at the cost of the others. Partners who ship **profiles** — distinct configurations selected by context — serve every persona.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Should) |
| **Prerequisite** | Build 5 of this course |
| **Estimated effort** | 12–14 hours focused |

## What the partner does

Defines at least three search profiles against the same KB (e.g. "shopper", "trail-club-member", "internal-staff"; or "policyholder", "broker", "claims-handler"; or "patient", "clinician", "researcher"). Each profile combines:

- A distinct primitive choice (`/find` vs `/ask` vs agent).
- Rephrasing config (on / off / custom prompt).
- Filter defaults (which filters apply automatically given the profile context).
- Reranking budget (none / built-in / external / adaptive).
- Result-rendering template (catalog cards vs grounded answer vs terse summary).

Implements profile selection based on session context (logged-in user role, active workspace, tenant tier). Tests profile switching **without page reload**. Each profile gets a measurable success metric distinct from the others — e.g. *"shopper"* optimised for time-to-add-to-cart, *"staff"* for completeness, *"executive"* for terseness.

The search-profile schema is the durable artefact — partners ship the same schema (with vertical-specific values) into every customer engagement.

## Pass rubric

1. Three search profiles defined and documented in the schema.
2. Profile selection logic implemented end-to-end.
3. Profile switching works without page reload.
4. Each profile has a measurable success metric distinct from the others. The metrics are committed to the workspace.
5. Live demo showing the same query producing differently-shaped results per profile, with the partner narrating *why* each shape is right for that persona.

## Asset delivered

- `search-profile-schema.md` — the schema.
- `profile-selection/` — reference implementation of the selection logic.
- `per-profile-metrics.md` — the success metrics + how each is measured.
- `demo-script.md` — the same-query-different-profile demo.

## Workspace

- `walkthrough.md`
- `search-profile-schema.md`
- `profile-selection/`
- `per-profile-metrics.md`
- `demo-script.md`
- `verification.md`

## Reference reading

- ARAG documentation: search configuration, query-time parameters.
- Foundations Build 9 — *Field Engineering* — the per-resource customisation layer this Build composes on top of.

## See also

- Previous build: [Build 5 — Multi-Turn Conversational Retrieval](../build-5-multi-turn-conversational-retrieval/)
- Next build: [Build 7 — Retrieval Agents 101](../build-7-retrieval-agents-101/)
