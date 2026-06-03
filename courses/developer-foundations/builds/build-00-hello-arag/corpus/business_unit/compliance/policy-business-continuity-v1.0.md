---
content_type: policy
region: noram
title: Atlas Business Continuity and Disaster Recovery Policy v1.0
---

# Atlas Business Continuity and Disaster Recovery Policy v1.0 (POL-BCDR-v1.0)

**Owner:** Dr Sara Vance (Chief Compliance Officer)
**Co-owner:** Marcus Ortiz (Principal Architect)
**Effective:** 2028-02-15

## Purpose

Establishes Atlas's recovery objectives and the program that keeps customer-facing services restorable inside contractual service levels.

## Recovery objectives by product

| Product | RTO | RPO | Notes |
|---|---|---|---|
| Atlas E-220 | 4 hours (firmware service) | 1 hour | Firmware service plane only; field equipment unaffected by Atlas-side outage |
| Atlas Pulse | 2 hours | 5 minutes | Real-time grid telemetry |
| Atlas BuildingHub | 2 hours | 5 minutes | HIPAA-relevant; tighter under Cresta Health Network MSA |
| Atlas Logix | 1 hour | 5 minutes | Mission-critical for Halcyon Logistics routing |
| Atlas FieldOps | 4 hours | 15 minutes | Offline mode tolerates app-plane outage; see INC-2028-0034 lessons |
| Atlas Grid | 2 hours | 5 minutes | |
| Atlas Aura | 4 hours | 1 hour | |
| Atlas Ledger | 1 hour | 5 minutes | SOX-relevant — strictest objectives |

## Testing

- Annual full DR exercise per product.
- Quarterly tabletop covering at least one customer scenario per quarter.
- Findings logged with severity; major findings become audit_finding entries (e.g., AF-2028-001 was logged this way).

## Crisis governance

- Atlas Crisis Management Team chaired by the CEO; CCO (Dr Sara Vance), VP Engineering (Priya Anand), Principal Architect (Marcus Ortiz), Director of Customer Success (Aisha Okonkwo), Head of Field Operations (Liam Hayashi), VP People (Maya Schwartz) are standing members.
- POL-INCIDENT-v2.0 governs single-incident response; this policy escalates beyond single-incident scope.

## Cross-references

- Atlas Incident Response Policy v2.0 (POL-INCIDENT-v2.0)
- Atlas Security Baseline Policy v2.0 (POL-SECBASE-v2.0)
- Atlas Data Handling Policy v3.1 (POL-DATA-v3.1)
