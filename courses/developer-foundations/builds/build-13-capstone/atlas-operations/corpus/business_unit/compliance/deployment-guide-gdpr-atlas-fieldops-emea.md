---
content_type: deployment_guide
region: emea
title: Atlas FieldOps GDPR-Compliant Deployment Guide (EMEA)
---

# Atlas FieldOps GDPR-Compliant Deployment Guide (EMEA)

**Audience:** Atlas Customer Success engineers deploying Atlas FieldOps to EMEA customers
**Owner:** Liam Hayashi (Head of Field Operations)
**Compliance reviewer:** Dr Sara Vance (CCO)

## Pre-deployment

1. Confirm executed customer-data agreement including the GDPR Article 28 standard clauses.
2. Confirm Transfer Impact Assessment if the deployment routes data outside the EEA (POL-XBORDER-v1.0).
3. Confirm SCC modules embedded for any sub-processor in NORAM (POL-SUBPROC-v1.0).
4. Confirm pending FieldOps data-classification reclassification (RFC under Council review) does not change deployment topology before deploy.

## Deployment

1. Install Atlas FieldOps with EU-region data residency configuration.
2. Provision driver / technician identifier handling per the customer's preferred pseudonymisation pattern.
3. Configure offline-sync conflict-resolution telemetry to honor the EU-region sub-processor (post AF-2028-012 remediation).
4. Audit-log retention 7 years per POL-DATA-v3.1 (Regulated tier per the proposed RFC reclassification).

## Post-deployment

1. RoPA entry created for the customer (manual today; automated post the GDPR Article 30 RoPA modernisation RFC).
2. Customer-side data-subject-request workflow tested. Atlas commits to 30-day GDPR Article 17 erasure response.
3. Active runbook for any sync-corruption recurrence: RB-FieldOps-Sync-004.

## Ongoing operations

- DPIA reviewed annually or upon any Major-severity AF affecting EMEA Regulated data (POL-DATA-v3.1 trigger language).
- Sub-processor changes notified to customer DPO 30 days in advance per POL-SUBPROC-v1.0.
- Cross-border data flow review annually.

## Cross-references

- Atlas GDPR Controller/Processor Position
- POL-DATA-v3.1, POL-XBORDER-v1.0, POL-SUBPROC-v1.0, POL-RETENTION-v1.0
- AF-2028-012, AF-2028-025, AF-2028-031
- RB-FieldOps-Sync-004
- RFC — Atlas FieldOps Data Classification Refresh
- INC-2028-0034
