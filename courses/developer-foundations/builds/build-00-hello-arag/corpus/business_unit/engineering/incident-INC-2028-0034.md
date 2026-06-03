---
content_type: incident
region: apac
title: INC-2028-0034 — FieldOps Offline Sync Corruption
---

# INC-2028-0034 · Atlas FieldOps Offline Sync Corruption

**Product:** Atlas FieldOps
**Severity:** P1
**Detected:** 2028-02-05 at Talos Steelworks
**Closed:** 2028-03-12
**Owner:** Liam Hayashi (Head of Field Operations)
**Remediation runbook:** RB-FieldOps-Sync-004

## Summary

Atlas FieldOps mobile devices that lost connectivity for more than 18 hours occasionally produced corrupted sync state on reconnect — duplicated work orders, inconsistent inventory counts. Talos Steelworks (47 affected devices) and Halcyon Logistics field-service team (12 devices) were the primary affected customers.

## Resolution

One-time controlled re-sync per affected device. FieldOps 7.2 (releasing 2028-03) adds checksum verification on reconnect to prevent recurrence.

## Timeline

- 2028-02-05 — Talos Steelworks field manager reports duplicated work orders.
- 2028-02-07 — Atlas FieldOps engineering investigates. Pattern matches multi-day offline devices.
- 2028-02-08 — Runbook RB-FieldOps-Sync-004 published. Talos re-sync begins.
- 2028-02-12 — Halcyon Logistics flagged with same symptoms. Re-sync applied.
- 2028-02-15 — All affected devices re-synced.
- 2028-03-12 — FieldOps 7.2 deployed. Incident closed.

## Customer impact

- Talos Steelworks — 47 devices, ~3 days of field-service operations affected.
- Halcyon Logistics — 12 devices, ~1 day of field-service operations affected.

## Lessons

- Field-service offline scenarios now tested up to 7 days continuous offline.
- Reconnect-checksum verification mandatory in all new mobile sync code.
- Customer notification template updated for FieldOps specifically.

## Regulatory exposure

No GDPR data-subject impact (sync state doesn't contain PII per Dr Sara Vance's review). No NIST 800-53 r5 control gaps.

## Related

- RB-FieldOps-Sync-004 (the remediation runbook)
