---
content_type: runbook
region: apac
title: RB-FieldOps-Conflict-Spike-013 — FieldOps Conflict Inbox Spike Triage
---

# RB-FieldOps-Conflict-Spike-013 · FieldOps Conflict Inbox Spike Triage

**Product:** Atlas FieldOps
**Owner:** Liam Hayashi (Head of Field Operations)
**Engineering co-owner:** Marcus Ortiz
**Last revised:** 2028-Q2

## Background

FieldOps v3.0 surfaces unresolved sync conflicts in the technician's Conflict Inbox (see design-doc-fieldops-conflict-inbox.md). Most weeks the conflict volume per technician is single-digit. A spike — defined as >50 conflicts in a single technician's inbox in <24 hours, or aggregate conflict rate >3x baseline across a tenant — indicates either an upstream data issue or a CRDT regression. This runbook handles the triage.

## Severity

P2 if scoped to a single technician. P1 if affecting a tenant. P0 if matching the signature of INC-2028-0034.

## Trigger

Pager from FieldOps health bus indicating conflict-rate spike.

## Steps

1. Identify scope: single technician, single tenant, or cross-tenant.
2. Pull conflict samples: `fieldops-admin conflict-sample --tenant <tenant-id> --window 24h`.
3. Inspect for patterns: same asset ID? Same workflow? Same device platform?
4. If pattern points to a single asset / workflow: notify the customer's site lead. Likely an asset-data quality issue.
5. If pattern points to a device platform or app version: capture conflict samples and escalate to Marcus Ortiz. Likely a CRDT regression.
6. If matches INC-2028-0034 signature (corruption of offline state): immediately apply RB-FieldOps-Sync-004 procedures.

## Verification

- Conflict rate trending back to baseline within 24-48 hours.
- Affected technicians' inboxes cleared.
- No silent data loss (compare audit log entries to expected count).

## Affected customers

- **Talos Steelworks** — high baseline conflict volume; spikes need fast triage.
- **Halcyon Logistics** — large NORAM technician base.

## Compliance

- **GDPR Art. 32.** Audit log preservation maintained.
- **POL-INCIDENT-v2.0.** Spike triage is a documented control.

## Escalation

Liam Hayashi (field ops). Marcus Ortiz (engineering). Out-of-hours: Atlas L3 APAC rotation.

## Related

- design-doc-fieldops-conflict-inbox.md
- design-doc-fieldops-offline-sync-v3.md
- INC-2028-0034
- RB-FieldOps-Sync-004
