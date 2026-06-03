---
content_type: design_doc
region: noram
title: Atlas Aura HVAC Scheduler v2.0
---

# Atlas Aura HVAC Scheduler v2.0

**Author:** Marcus Ortiz (Principal Architect)
**Reviewers:** Aisha Okonkwo, Priya Anand
**Status:** Approved
**Version:** 2.0

## Context

Atlas Aura is the second product in the Building Automation line (sibling to BuildingHub). Where BuildingHub focuses on integrated controller hardware, Aura is the multi-tenant scheduling service that orchestrates HVAC, lighting, and occupancy-based load shedding across distributed building portfolios. Cresta Health Network is the largest Aura customer; the v2.0 scheduler was driven primarily by their requirement to handle clinical-area air-exchange minimums that the v1.x scheduler treated as soft constraints.

## Design goals

- **Hard clinical constraints.** Clinical-area air-exchange minimums treated as hard MILP constraints, not penalties.
- **Occupancy-aware scheduling.** Integrate with BuildingHub occupancy feeds without coupling release cadences.
- **HIPAA isolation.** No occupancy data containing patient identifiers leaves the customer's environment.
- **Cold start safety.** Scheduler recovers from cold start within 90 seconds across 500-building portfolio.

## Architecture

Three-tier:

1. **Constraint compiler.** Reads per-building rule packs (clinical / non-clinical / mixed) and compiles into MILP constraints.
2. **Scheduler core.** Runs the MILP on a 5-minute cadence per building cluster.
3. **Telemetry adapter.** Decouples BuildingHub firmware version cadence from Aura scheduler version cadence (lesson from INC-2028-0019).

## HIPAA posture

Cresta Health Network operates Aura under HIPAA. The Aura scheduler never receives patient identifiers — only anonymised occupancy counts at zone granularity. Dr Sara Vance reviewed the data flow diagram and signed off the HIPAA risk assessment.

## Test matrix

| Scenario | Constraint type | v1.x outcome | v2.0 outcome |
|---|---|---|---|
| Clinical OR active, low occupancy | Hard | Sometimes underventilated | Always within bounds |
| Mixed-use building, normal demand | Soft | OK | OK |
| Portfolio cold start, 500 buildings | N/A | 4 min | 78 sec |
| BuildingHub firmware mid-rollout | N/A | Scheduler stalls | Independent versioning, no stall |

## Related

- design-doc-buildinghub-firmware.md
- INC-2028-0019
- POL-INCIDENT-v2.0
