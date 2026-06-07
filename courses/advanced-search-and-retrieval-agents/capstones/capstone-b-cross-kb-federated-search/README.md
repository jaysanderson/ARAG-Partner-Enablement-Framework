# Capstone B — Cross-KB Federated Search

> Part of [Advanced Search & Retrieval Agents — Capstones](../README.md).

> **Status:** Brief shipped. Reference implementation lands in subsequent passes.

## At a glance

| | |
|---|---|
| **Effort** | 7–10 days focused |
| **Builds leveraged** | 1 (primitive choice), 3 (filter composition), 6 (search profiles) |
| **Customer shape** | Enterprise with multiple Knowledge Boxes (per business unit / region / security boundary) |
| **Failure being solved** | *"Our staff search across three siloed systems and the answers don't compose."* |

## 1. Customer shape

A mid-to-large enterprise customer running multiple ARAG Knowledge Boxes — typically because:

- Different business units own their own content (Engineering, Sales, HR, Compliance, Customer Success).
- Different regions require data residency boundaries (EU KB stays in EU, US KB stays in US, APAC KB stays in APAC).
- Different security classifications require enforcement boundaries (Public KB, Internal KB, Confidential KB).

Today the customer's end-users search each KB individually and stitch the results together by hand. The partner's deliverable replaces that with a single search experience that respects every boundary.

## 2. Deliverable

A deployed federated search surface that:

- Accepts a single query.
- Fans the query out across N Knowledge Boxes in parallel.
- Applies per-KB filtering (the EU KB sees only EU users' queries with EU residency tags; the Confidential KB sees only users with the appropriate clearance).
- Merges the results — score-normalised across KBs so the top-ranked result genuinely is the most relevant, not just the most relevant within its source KB.
- Renders a unified answer with **per-citation attribution to its source KB** (e.g. the answer cites three sources: one from the Engineering KB, one from the Compliance KB, one from the HR KB).
- Includes per-KB result-set drill-down (the end-user can click *"see only Engineering results"* to scope down without re-typing the query).

## 3. Architecture

- **N ≥ 3 Knowledge Boxes** with distinct labelset configurations.
- **One search profile per persona** (Build 6) — e.g. *"engineer"* sees Engineering + Confidential, *"sales rep"* sees Sales + Compliance + Public, *"HR partner"* sees HR + Compliance + Confidential.
- **A federation layer** that fans queries out, normalises scores, and merges.
- **Filter composition logic** (Build 3) — per-KB filter defaults from the active profile, plus user-applied overlay filters.
- **A unified result renderer** with per-citation source-KB attribution.
- **An observability layer** that traces every per-KB sub-query and shows latency per KB.

## 4. Scope

### In scope (must ship)

- At least 3 Knowledge Boxes (the partner can use the framework's Atlas + Aurora + a third stub KB, or stand up three vertical-specific KBs).
- Federation across all configured KBs with score-normalised merging.
- Per-citation source-KB attribution in the UI.
- Per-KB drill-down without re-typing.
- At least 2 search profiles, each with distinct per-KB visibility rules.
- Tracing dashboard showing per-KB latency for the last 100 queries.
- 15-minute customer demo rehearsed.

### Out of scope (explicitly)

- A central admin console for KB provisioning. The KBs are assumed already provisioned.
- A central audit log for who-saw-what (the security overlay is enforced via per-KB classification labels + profile-driven filters, but a SIEM-grade audit pipeline is a follow-on engagement).
- Sub-KB sharding logic. The capstone treats each KB as an atomic unit.
- Cross-KB graph queries. Each KB's graph is independent; cross-KB graph federation is a separate research-grade exercise.

## 5. Demo script (15–20 min)

1. **Setup (1 min)** — federated search bar in the corner of an enterprise portal. Logged-in user persona is *"sales rep"*.
2. **Cross-KB query** (3 min) — *"What's the latest pricing approved for Customer X and what compliance constraints does it carry?"* Surface returns three citations: pricing from Sales KB, contract status from Customer Success KB, compliance clauses from Compliance KB. Each citation chip shows its source KB.
3. **Profile switch demo** (3 min) — partner switches to *"engineer"* persona. Same query now returns different results (Engineering tickets appear; pricing is hidden).
4. **Drill-down** (2 min) — partner clicks *"see only Sales results"* — the surface narrows without re-typing.
5. **Latency drill-down** (2 min) — partner opens the tracing dashboard. Shows per-KB p50/p95. Explains how a slow KB doesn't block the rest.
6. **Architecture walk (3 min)** — partner shows the federation logic, the score-normalisation strategy, the profile-driven filter overlay.
7. **CTO Q&A** (3–5 min) — defence against *"why not just one KB with a label filter?"* and *"what about residency?"*

## 6. Pass rubric

1. ≥ 3 KBs configured and federated.
2. Score-normalised merging working — a query result that includes results from KB A and KB B has scores that are genuinely comparable, not raw per-KB scores.
3. Per-citation source-KB attribution rendered in the UI.
4. Per-KB drill-down working.
5. ≥ 2 search profiles with distinct visibility rules.
6. Tracing dashboard live.
7. Demo delivered in under 20 minutes.
8. Workspace deliverables (architecture, federation logic, score-normalisation strategy, profile schema, demo script) all committed.

## 7. Effort breakdown

| Day | Activity |
|---|---|
| 1 | KB provisioning (or selection of existing 3); content + labelset confirmation. |
| 2 | Federation harness — parallel fan-out across KBs. |
| 3 | Score-normalisation strategy + implementation. |
| 4 | Profile-driven per-KB filter overlay. |
| 5 | Result renderer with per-citation attribution. |
| 6 | Drill-down + per-KB latency tracing. |
| 7 | Demo script rehearsal. |
| 8 | Polish + verification checklist. |
| 9–10 (optional) | Polish + Solution-lead defence prep. |

## 8. Reskinning notes

The default capstone uses the framework's Atlas (enterprise ops) + Aurora (consumer brand) corpora plus a third stub KB. To reskin to a specific customer's vertical:

- Swap the KB content for the customer's actual departmental KBs (or provisioning-stage stubs that mirror them).
- Swap the profile-to-KB visibility rules to match the customer's actual access model.
- Swap the demo persona to a role the customer's reviewer will recognise.
- The federation, score-normalisation, attribution, and drill-down logic do not change.

A complete reskin typically takes 2–3 days.

## Workspace

- `architecture.md` — KBs, profiles, federation, normalisation.
- `federation-harness/` — the parallel fan-out implementation.
- `score-normalisation/` — the strategy + measurements.
- `profile-schema.md` — per-profile per-KB visibility rules.
- `result-renderer/` — the unified UI with per-citation attribution.
- `tracing-dashboard/` — per-KB latency over a representative window.
- `demo-script.md`.
- `verification.md`.

## See also

- Capstones overview: [`../README.md`](../README.md)
- Build 1: [Search Primitives Deep Dive](../../builds/build-1-search-primitives-deep-dive/)
- Build 3: [Filter Composition at Depth](../../builds/build-3-filter-composition-at-depth/)
- Build 6: [Search Profiles & Per-Use-Case Tuning](../../builds/build-6-search-profiles-and-per-use-case-tuning/)
