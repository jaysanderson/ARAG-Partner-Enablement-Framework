---
content_type: policy
region: noram
title: Atlas Customer Data Retention Policy v1.0
---

# Atlas Customer Data Retention Policy v1.0 (POL-RETENTION-v1.0)

**Owner:** Dr Sara Vance (Chief Compliance Officer)
**Effective:** 2028-02-01
**Review:** Annual

## Purpose

Codifies how long Atlas retains customer data across each Atlas product line, the legal basis for each retention period, and the deletion workflow.

## Retention schedule

| Data class | Product | Retention | Legal basis |
|---|---|---|---|
| Operational telemetry | Atlas E-220 | 24 months rolling | Service-improvement legitimate interest |
| Operational telemetry | Atlas Pulse | 24 months rolling | Service-improvement legitimate interest |
| Customer-supplied config | All products | Duration of contract + 90 days | Contract |
| HIPAA-relevant alerts | Atlas BuildingHub | 6 years (HIPAA §164.530(j)) | Regulatory (HIPAA) |
| Financial ledger records | Atlas Ledger | 7 years | Regulatory (SOX §404) |
| Routing logs | Atlas Logix | 13 months | Service-improvement legitimate interest |
| Field service records | Atlas FieldOps | Contract duration + 30 days | Contract |
| Audit logs (Regulated data) | All products | 7 years | POL-DATA-v3.1 |

## Customer-instructed deletion

Per the Atlas customer-data agreement, customers may instruct deletion of Confidential and (where legally permissible) Regulated data at any time:

- GDPR Article 17 (right to erasure) — honored within 30 days for EMEA customers (Norvale Energy, Cresta Health Network).
- HIPAA — deletion subject to the customer's own retention obligations as covered entity; Atlas can suspend processing on instruction.
- SOX — Atlas Ledger records (Meridian Bank) may not be deleted prior to the 7-year statutory minimum without legal hold release.

## Deletion workflow

1. Customer instruction received via contracted channel.
2. Compliance validates the request against the retention schedule.
3. Engineering owner of the product executes deletion (Priya Anand for Pulse / E-220; Marcus Ortiz for Logix / Grid; Aisha Okonkwo for BuildingHub / Aura; Liam Hayashi for FieldOps; Dr Sara Vance for Ledger).
4. Deletion certificate issued to customer within 5 business days of completion.

## Cross-references

- Atlas Data Handling Policy v3.1 (POL-DATA-v3.1)
- Atlas GDPR Controller/Processor Position
- Atlas SOX §404 Position
