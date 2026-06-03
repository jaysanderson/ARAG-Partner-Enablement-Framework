---
content_type: design_doc
region: noram
title: Atlas Logix Routing Engine Design (v4.8)
---

# Atlas Logix Routing Engine Design v4.8

**Author:** Marcus Ortiz (Principal Architect)
**Status:** Approved
**Version:** 4.8 (post-INC-2027-0188)

## Context

Atlas Logix routes high-traffic shipments at scale. The 4.7 engine introduced a reference-counting refactor that, in turn, introduced an unbounded reference cycle between `RouteState` and `ShipmentContext` under sustained > 50,000 concurrent shipments. v4.8 eliminates the cycle and adds a defensive periodic reference-graph sweep.

## Design changes

- Replace bidirectional reference between RouteState ↔ ShipmentContext with a unidirectional reference + a sidechannel WeakMap for back-references.
- Add a 6-hour reference-graph sweep that validates the live reference set; alert on unexpected growth.
- Extended qualification suite covers 96-hour sustained load.

## Test matrix

| Scenario | Stable for 96 hrs? |
|---|---|
| Peak 100k concurrent shipments | ✓ |
| Daily inventory rollover under load | ✓ |
| Halcyon Logistics traffic shape (production replay) | ✓ |
| Meridian Bank Atlas Grid pilot shape | ✓ |

## Customer roll-out

- Halcyon Logistics → 4.7.3 → 4.8.0 (Q4 2027 → Q1 2028).
- Meridian Bank Atlas Grid → 4.8.0 (Q1 2028).

## Related

- INC-2027-0188 (the incident)
- RB-Logix-MemLeak-002 (the remediation runbook)
- AF-2028-001 (the audit finding)
