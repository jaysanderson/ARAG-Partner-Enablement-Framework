---
content_type: rfc
region: apac
title: RFC — Atlas FieldOps Data Classification Refresh
---

# RFC — Atlas FieldOps Data Classification Refresh

**Status:** Draft for Atlas Compliance Council review
**Author:** Dr Sara Vance (CCO)
**Co-author:** Liam Hayashi (Head of Field Operations)
**Target decision date:** 2028-Q4

## Background

Atlas FieldOps was originally classified under POL-DATA-v3.1 as carrying Confidential customer data only. Post-INC-2028-0034 forensic review confirmed FieldOps offline-sync stores include customer-employee identifiers (technician IDs, work-order assignee names) which constitute personal data under GDPR for Cresta Health Network's EU sites and arguably under APPI for Talos Steelworks's Japanese sites.

The current Confidential-only classification understates the obligation.

## Proposal

Reclassify FieldOps customer-data scope as Regulated for any customer where the offline-sync payload includes personal data of customer employees. Practical effect:

1. Per-record access logging (mirrors AF-2028-025 remediation pattern from Logix).
2. 7-year audit-log retention (POL-DATA-v3.1 standard).
3. POL-RETENTION-v1.0 schedule update — FieldOps offline-sync purges on the contract-duration + 30-day rule but Regulated-class personal data inside that payload may also be subject to data-subject deletion requests.
4. POL-XBORDER-v1.0 SCC verification for any EMEA-origin FieldOps data crossing borders.

## Customer impact

- Talos Steelworks (APAC) — data residency continues per AF-2028-031 remediation; classification change does not affect storage location.
- Cresta Health Network (NORAM/EMEA) — EMEA-site FieldOps deployment gains explicit GDPR posture; NORAM-site unchanged.

## Open questions

- Should Atlas extend Regulated classification to all FieldOps deployments by default, or remain customer-context-specific? Recommendation: customer-context-specific to avoid over-classification.

## Cross-references

- AF-2028-031
- AF-2028-012
- INC-2028-0034
- RB-FieldOps-Sync-004
- POL-DATA-v3.1
- POL-RETENTION-v1.0
- POL-XBORDER-v1.0
