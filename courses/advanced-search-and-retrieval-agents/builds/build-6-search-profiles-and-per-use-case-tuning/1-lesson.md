# Build 6 — Lesson: Search Profiles & Per-Use-Case Tuning

> Read time: 12 minutes. Companion to the 9-minute [video](video-script.md).

## Why partners learn this

One Knowledge Box usually serves multiple personas — the shopper wants curated results, the staff member wants exhaustive results, the executive wants terse summarised results. Partners who ship *one* search configuration optimise for *one* persona at the cost of the others. Partners who ship **profiles** — distinct configurations selected by context — serve every persona.

This Build is the lever that scales a single KB to multiple personas without duplicating data.

## What a search profile actually contains

A profile bundles together every lever you've built so far:

| Lever | Per-profile choice |
|---|---|
| **Primitive** (Build 1) | `/find` vs `/ask` vs Agent — which is the right answer for this persona's question shape? |
| **Rephrasing** (Build 2) | On / off / custom prompt with vertical terminology |
| **Filter defaults** (Build 3) | Which filters apply automatically given the profile context (region, tier, classification) |
| **Reranking budget** (Build 4) | None / built-in / adaptive external |
| **Result-rendering template** | Catalog cards vs grounded answer vs terse summary vs deep-evidence table |
| **Success metric** | Per-profile metric — conversion for shopper, completeness for staff, terseness for executive |

Five levers tuned per profile, three profiles per KB. That's 15 configurations on one platform — and ARAG handles all of them without touching the data layer.

## Three profiles is the right starting point

Why three? Because customer organisations almost always have three persona tiers:

| Tier 1 | Tier 2 | Tier 3 |
|---|---|---|
| External customer / shopper / patient / policyholder | Internal staff / consultant / clinician / broker | Power user / analyst / executive |

The defaults for each tier:

| Persona | Primitive | Rephrasing | Filter defaults | Reranking | Renderer | Success metric |
|---|---|---|---|---|---|---|
| **Shopper / patient** | `/ask` streaming | On, custom prompt for casual phrasing | Public-only content | Built-in | Grounded answer with citation chips | Time-to-add-to-cart / time-to-answer |
| **Staff / clinician** | `/predict/chat` | On, custom prompt for vertical vocab | Public + internal, no confidential | Adaptive external | Conversational w/ citation continuity | Completeness — *did the search return everything relevant?* |
| **Power user / executive** | Retrieval Agent | Off (analyst types precise queries) | All classifications | Adaptive external | Terse summary + deep-evidence table | Time-to-decision |

These are starting defaults. The walkthrough has you measure each profile against its success metric and tune.

## Profile selection — five sources of signal

How does the platform pick a profile for a given request?

1. **Logged-in user role.** *"Sara is logged in as a customer"* → shopper profile.
2. **Active workspace.** *"Sara is in the public-portal workspace"* → shopper.
3. **Tenant tier.** *"This is Aurora's Trail Club Pro tenant"* → Pro members get a different profile from Standard members.
4. **Session opt-in.** *"User toggled the 'analyst mode' switch"* → power-user profile.
5. **Per-query inference.** *"This query is a SQL-like power-user query"* → power-user profile, even without role assignment.

Source 1 is the default. Sources 2–4 are explicit. Source 5 is the partner differentiator — automatic profile inference from query shape is what makes the platform feel smart.

## Profile switching — the rule

Profiles **must switch without page reload**. The partner ships a UI control (a dropdown, a tab, a profile-aware nav) that switches the profile in session state, and the next query uses the new profile's configuration.

A surface that requires a page reload to switch profiles is a surface that doesn't feel like one product. The dashboard's *"All Departments / Eng / Sales / Marketing"* tab is a profile selector; the customer's persona toggles work the same way.

## Per-profile success metrics

A profile is only worth shipping if you can measure it. Each profile should have one primary metric:

- **Shopper profile:** time-to-add-to-cart, or success-of-first-click (the user clicks one of the top-3 results).
- **Staff profile:** retrieval completeness — fraction of hand-labelled relevant sources that appear in the top-N.
- **Executive profile:** time-to-decision — the user reads the summary and acts within N seconds; or summary-acceptance rate.

A partner who ships three profiles without per-profile metrics is shipping three configurations no one will tune in 90 days. A partner who ships three profiles each with a measurable success metric is shipping three competencies the customer's team can iterate on.

## What you'll do in the walkthrough

1. Define three search profiles for your customer's KB.
2. Implement the schema and the selection logic.
3. Wire profile switching without page reload.
4. Define per-profile success metrics + measurement.
5. Demo same-query-different-profile with narration.

## Reference reading

- **[`/ask` parameter reference §16 — Worked examples per Build](../../assets/ask-parameter-reference.md#16-worked-examples-per-build)** — the worked Build-6 (per-profile-config-shopper) example shows every parameter a profile bundle sets in one request body.
- Foundations Build 9 — *Field Engineering* — the per-resource customisation layer this Build composes on top of.
- Builds 1–4 of this course — each contributes a lever the profile bundles.
