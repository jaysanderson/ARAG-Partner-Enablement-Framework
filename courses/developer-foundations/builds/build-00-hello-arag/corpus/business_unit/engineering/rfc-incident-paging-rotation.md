---
content_type: rfc
region: noram
title: RFC — Atlas L3 Incident Paging Rotation
---

# RFC · Atlas L3 Incident Paging Rotation

**Authors:** Marcus Ortiz, Liam Hayashi
**Status:** Approved
**Open period:** 2028-Q1 (comments closed)

## Summary

The runbook set (RB-E220-Cooling-001, RB-Logix-MemLeak-002, RB-BldHub-Firmware-003, RB-FieldOps-Sync-004, RB-Pulse-Input-Validation-005) all reference "Atlas L3 on-call rotation" without specifying who is on it, how it is paged, or who covers what region. This RFC formalises the rotation.

## Proposal

L3 is a 3-region rotation: NORAM, EMEA, APAC. Each region has 4 engineers on call for a quarter; LATAM coverage is provided by NORAM rotation with Spanish/Portuguese-speaking on-call deputy when possible.

Paging tiers:

| Tier | Trigger | Page target |
|---|---|---|
| Tier 0 | P0 in the named runbooks | Regional L3 + product owner |
| Tier 1 | Net-new P0 not yet in a runbook | Regional L3 + Priya Anand or Marcus Ortiz |
| Tier 2 | P1 affecting >1 anchor customer | Regional L3 |
| Tier 3 | P2 / non-customer-impacting | Async ticket, next business day |

## Product owner mapping

| Product | Owner page target |
|---|---|
| Atlas E-220, Atlas Pulse | Priya Anand |
| Atlas Logix, Atlas Grid, Atlas Ledger | Marcus Ortiz |
| Atlas BuildingHub, Atlas Aura | Aisha Okonkwo |
| Atlas FieldOps | Liam Hayashi |

## Compliance

- **POL-INCIDENT-v2.0.** Rotation operationalises the policy's expectation of named on-call coverage.
- **NIST 800-53 r5 IR-7.** Incident-response assistance availability satisfied.

## Related

- POL-INCIDENT-v2.0
- All four named runbooks
- INC-2027-0142, INC-2027-0188, INC-2028-0019, INC-2028-0034
