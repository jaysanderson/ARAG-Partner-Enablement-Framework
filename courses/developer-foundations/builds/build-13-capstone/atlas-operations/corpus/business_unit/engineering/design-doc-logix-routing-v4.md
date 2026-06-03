---
content_type: design_doc
region: noram
title: Atlas Logix Routing Engine v4.0
---

# Atlas Logix Routing Engine v4.0

**Author:** Marcus Ortiz (Principal Architect)
**Reviewer:** Priya Anand
**Status:** Approved
**Version:** 4.0

## Context

Atlas Logix is the routing software product for 3PL customers. Halcyon Logistics is the anchor customer; their routing optimisation handles ~480k stops per day across NORAM. v3.x was rewritten after INC-2027-0188 (memory leak) and stabilised; v4.0 adds dynamic re-routing in response to live exception feeds (weather, port closures, last-mile failures) and introduces a new constraint-solver backend.

## Design goals

- **Dynamic re-routing.** Recompute a route within 90 seconds of a triggering exception.
- **Cost continuity.** v4.0 must not regress on solve quality vs v3.x on the Halcyon historical benchmark.
- **Memory safety.** Avoid the v2.x regression that produced INC-2027-0188 (long-running solve processes leaking memory under specific input shapes).
- **BYO-LLM hooks.** Route explanations route through the BYO-LLM layer when customer enables.

## Architecture

Two-stage solver:

1. **Baseline solver.** Mixed-integer column generation, single binary, deterministic.
2. **Exception solver.** Lightweight local-search variant that takes the baseline as warm start and adjusts for live exceptions.

Both solvers run in worker processes with hard memory ceilings; a watchdog kills any process that exceeds the ceiling, and the orchestrator restarts a fresh worker. This is a direct lesson from INC-2027-0188.

## Test matrix

| Scenario | v3.x | v4.0 |
|---|---|---|
| Halcyon historical day | Baseline | -2% cost |
| Halcyon historical day with 8 mid-day exceptions | N/A (manual re-run) | Auto, 88s avg |
| Single solver process 48h | OK | OK |
| Adversarial input shape from INC-2027-0188 | Leak (fixed in 3.1) | No leak |

## Compliance posture

- **EU AI Act.** Logix is in scope per the products list under EU-AI-ACT. v4.0 introduces no new public-facing automated decisions; the explanation layer is informational only.
- **NIST 800-53 r5 SI-7.** Solver binaries are signed and integrity-checked at startup.

## Related

- INC-2027-0188
- RB-Logix-MemLeak-002
- RFC — Atlas BYO-LLM Routing
