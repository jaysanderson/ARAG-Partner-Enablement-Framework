---
content_type: audit_finding
region: emea
title: Audit Finding AF-2028-007 — BuildingHub Firmware HIPAA Impact
---

# Audit Finding AF-2028-007 · BuildingHub Firmware HIPAA Impact

**Auditor:** Atlas internal audit (EMEA Compliance)
**Audit cycle:** Q1 2028
**Status:** Closed
**Severity:** Major
**Owner:** Aisha Okonkwo (Director of Customer Success)
**Co-owner:** Priya Anand (VP Engineering — firmware ownership)

## Finding

Atlas BuildingHub firmware 5.2.1 deployed to HIPAA-relevant customer environments (Cresta Health Network) introduced an HVAC scheduling regression that generated facility alerts crossing the HIPAA-monitored alert pipeline. While no patient-data exposure occurred, the regression demonstrated insufficient pre-release HIPAA-impact assessment in the firmware release process.

HIPAA §164.308(a)(8) (Periodic Technical Evaluation) was satisfied reactively via firmware rollback to 5.1.8 within 14 days of detection, but the control would have been satisfied proactively under stronger pre-release HIPAA-impact testing.

## Affected customers

- Cresta Health Network (14 sites) — service credits issued covering facility-team workload addressing the alert backlog.

## Remediation

- Rollback applied to all Cresta sites via runbook RB-BldHub-Firmware-003 (2028-02-14 through 2028-02-21).
- HIPAA-impact assessment now mandatory for all BuildingHub firmware releases.
- HIPAA-relevant customer notification template now standardised.

## Closure criteria

- Rollback complete at all affected customers. Yes.
- HIPAA-impact-assessment process documented and approved. Yes.
- Atlas Compliance Council sign-off. Yes.

## Closed

2028-03-15 — Dr Sara Vance accepted closure.

## Cross-references

- INC-2028-0019 (the incident)
- RB-BldHub-Firmware-003 (the remediation runbook)
- HIPAA §164.308(a)(8) (the control)
- Atlas Incident Response Policy v2.0 (POL-INCIDENT-v2.0)
- Cresta Health Network case study (`case-study-cresta-health.md`)
