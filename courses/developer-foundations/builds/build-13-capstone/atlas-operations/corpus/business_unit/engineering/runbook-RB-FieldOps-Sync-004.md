---
content_type: runbook
region: apac
title: RB-FieldOps-Sync-004 — FieldOps Offline Sync Corruption
---

# RB-FieldOps-Sync-004 · FieldOps Offline Sync Corruption

**Product:** Atlas FieldOps
**Owner:** Liam Hayashi (Head of Field Operations)
**Remediates:** INC-2028-0034 (FieldOps offline sync corruption)
**Last revised:** 2028-Q1

## Background

INC-2028-0034 affected Atlas FieldOps deployments at Talos Steelworks and selected Halcyon Logistics field-service teams. FieldOps mobile devices that lost connectivity for more than 18 hours occasionally produced corrupted sync state when reconnecting. The corruption manifested as duplicated work orders and inconsistent inventory counts.

## Root cause

A race condition in the FieldOps mobile sync protocol between the resume-from-offline operation and a background inventory pull. Devices that had been offline through a daily inventory rollover were the most affected.

## Resolution

FieldOps 7.2 (releasing 2028-03) implements a sync-state checksum verification on reconnect. Affected devices need a one-time controlled re-sync to clear corrupted state.

## Steps

1. Field-service teams identify devices that show corrupted sync state via FieldOps admin dashboard (`Devices` → `Filter: Sync error`).
2. For each affected device, schedule a controlled re-sync:
   - Force the device into airplane mode.
   - Wipe local sync cache (`fieldops --wipe-cache`).
   - Re-authenticate via SSO.
   - Pull fresh sync state from the server.
3. After re-sync, validate work-order count against server-side ledger.
4. Upgrade device to FieldOps 7.2 when available.

## Verification

- No corrupted sync states for 72 hours.
- Work-order counts match between mobile and server.
- Inventory counts match between mobile and server.

## Affected customers

- Talos Steelworks — applied to 47 affected devices, 2028-02-08 through 2028-02-15.
- Halcyon Logistics — applied to 12 affected devices, 2028-02-12.

## Compliance

Filed under Atlas Incident Response Policy `POL-INCIDENT-v2.0`. **Dr Sara Vance** (Chief Compliance Officer) reviewed; no GDPR data-subject impact since FieldOps doesn't store PII in the affected sync state.

## Escalation

Any deviation: escalate to **Liam Hayashi**. Out-of-hours: Atlas L3 on-call.

## Related

- RB-Logix-MemLeak-002 (Atlas product issue requiring patch + customer coordination)
