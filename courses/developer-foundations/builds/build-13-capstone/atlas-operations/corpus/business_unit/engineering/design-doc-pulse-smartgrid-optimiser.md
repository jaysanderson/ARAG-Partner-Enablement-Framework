---
content_type: design_doc
region: emea
title: Atlas Pulse Smart-Grid Optimiser v3.0 Design
---

# Atlas Pulse Smart-Grid Optimiser v3.0 Design

**Author:** Priya Anand (VP Engineering)
**Reviewers:** Marcus Ortiz, Dr Sara Vance
**Status:** Approved, in implementation Q2 2028
**Supersedes:** Pulse Optimiser v2.4

## Context

Atlas Pulse is the energy-systems product line responsible for sub-15-minute demand response decisions across customer microgrids. Norvale Energy operates 14 production sites on Pulse and accounts for roughly 60% of installed Pulse capacity globally. The v2.4 optimiser uses a classical mixed-integer linear program (MILP) for dispatch; v3.0 introduces a learned residual model to handle peak shaving in volatile pricing windows.

## Design goals

- **Forecast accuracy.** Reduce 30-minute dispatch error by 35% vs v2.4 baseline measured at Norvale Energy site Bravo.
- **Determinism.** The optimiser must produce identical dispatch decisions for identical inputs, or document the source of stochasticity.
- **Safety envelope.** No dispatch decision may exceed inverter thermal or grid-code limits, regardless of model output.
- **BYO-LLM compatibility.** Forecast explanations route through the BYO-LLM layer (see RFC — Atlas BYO-LLM Routing) when the customer enables it.

## Architecture

The optimiser splits into three layers:

1. **Forecast layer.** Gradient-boosted ensemble for load, plus a residual MLP for price-volatile windows.
2. **Dispatch layer.** MILP solver (unchanged from v2.4) consuming forecast layer outputs.
3. **Safety supervisor.** Static rule-based clamp on inverter setpoints; vetoes any MILP decision that would violate grid-code envelopes.

## Test matrix

| Scenario | v2.4 error (MAPE) | v3.0 error (MAPE) |
|---|---|---|
| Steady demand, flat pricing | 4.1% | 3.9% |
| Steady demand, volatile pricing | 11.8% | 6.4% |
| Storm event, volatile pricing | 19.2% | 12.1% |
| Inverter degraded mode | 7.3% | 7.0% |

## Compliance posture

EU AI Act applies (Pulse is in scope per the products list under EU-AI-ACT). The learned residual model is classified as limited-risk under Article 52 (output is an internal forecast, not a public-facing decision). Dr Sara Vance signed off on the Article 9 risk-management documentation.

## Roll-out

- Pilot at Norvale Energy site Bravo (EMEA) Q3 2028.
- Phased rollout to remaining Norvale EMEA sites Q4 2028.
- Talos Steelworks evaluation Q1 2029.

## Related

- RFC — Atlas BYO-LLM Routing
- POL-INCIDENT-v2.0
- design-doc-pulse-safety-supervisor.md
