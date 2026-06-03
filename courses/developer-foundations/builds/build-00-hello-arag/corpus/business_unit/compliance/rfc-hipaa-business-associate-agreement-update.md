---
content_type: rfc
region: noram
title: RFC — Atlas HIPAA Business Associate Agreement Standard Refresh
---

# RFC — Atlas HIPAA Business Associate Agreement Standard Refresh

**Status:** Draft for Atlas Compliance Council review
**Author:** Dr Sara Vance (CCO)
**Target decision date:** 2028-Q4

## Background

Atlas executes a Business Associate Agreement (BAA) with every HIPAA-covered customer that deploys Atlas BuildingHub. Cresta Health Network is the flagship covered entity. Atlas's standard BAA was last revised 2026; the proposed refresh reflects:

- AF-2028-007 lessons (firmware HIPAA-impact assessment now mandatory).
- POL-SUBPROC-v1.0 introduction (sub-processor disclosure obligations).
- HHS guidance updates issued 2027 and 2028 on §164.308 administrative safeguards.

## Proposed changes

1. Add explicit Atlas commitments to HIPAA-impact-assessment for any firmware change touching HIPAA-relevant alert pipelines.
2. Add 30-day advance notice for any Tier 1 sub-processor change (mirrors POL-SUBPROC-v1.0).
3. Add 24-hour breach-notification commitment for confirmed PHI exposure (improving on the §164.410 statutory window).
4. Add explicit Atlas-side incident registry summary as a quarterly deliverable.
5. Update the Atlas-Regulated-data audit-log retention reference to the POL-DATA-v3.1 7-year standard.

## Customer impact

- Cresta Health Network: refresh executed at next contract anniversary (Q1 2029).
- Future HIPAA covered-entity customers: new BAA standard from effective date.

## Risk of inaction

The 2026 BAA is HIPAA-compliant but does not reflect Atlas's current operational maturity. Refresh strengthens Atlas's defensibility and reduces dispute exposure.

## Open questions

- Should Atlas include a HIPAA-relevant deployment-guide deliverable in the BAA itself, or keep it as a separate exhibit?
- Should the BAA reference RB-BldHub-Firmware-003 by name? Recommendation: no — reference the runbook class generically, not by ID.

## Cross-references

- AF-2028-007
- POL-SUBPROC-v1.0
- POL-DATA-v3.1
- POL-INCIDENT-v2.0
- INC-2028-0019
