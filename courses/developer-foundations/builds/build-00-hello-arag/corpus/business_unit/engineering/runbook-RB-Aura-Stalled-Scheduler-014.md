---
content_type: runbook
region: noram
title: RB-Aura-Stalled-Scheduler-014 — Aura Scheduler Cold Restart
---

# RB-Aura-Stalled-Scheduler-014 · Aura Scheduler Cold Restart

**Product:** Atlas Aura
**Owner:** Marcus Ortiz (Principal Architect)
**Last revised:** 2028-Q2

## Background

Atlas Aura v2.0 schedulers should recover from cold start within 90 seconds across a 500-building portfolio (per design-doc-aura-hvac-scheduler.md). When a scheduler stalls — failing to issue any HVAC commands for >5 minutes for a tenant — this runbook initiates a cold restart while preserving the tenant isolation contract.

## Severity

P0 for Cresta Health Network during clinical hours (06:00-22:00 local). P1 otherwise.

## Trigger

Pager from Aura health bus indicating scheduler silence beyond threshold.

## Steps

1. Confirm scope: tenant ID and affected building cluster.
2. Verify the scheduler process state: `aura-admin scheduler-status --tenant <tenant-id>`.
3. If process is alive but stalled, capture a thread dump for post-incident review: `aura-admin thread-dump --tenant <tenant-id> --scheduler <id>`.
4. Issue cold restart: `aura-admin scheduler-restart --tenant <tenant-id> --scheduler <id>`.
5. Verify the scheduler recovers within 90 seconds (Cresta) or 180 seconds (other tenants).
6. Confirm HVAC commands resume via the customer dashboard or `aura-admin command-trace`.

## Verification

- Scheduler emits commands at expected cadence (5-minute cycles).
- No stuck buildings in `aura-admin building-state --tenant <tenant-id>`.
- For Cresta: clinical-area constraint compliance restored.

## Affected customers

- **Cresta Health Network.** Highest impact.
- Any other Aura tenant in the affected scheduler shard.

## Compliance

- **HIPAA.** For Cresta, downtime affecting clinical scheduling is a P0 event. Aisha Okonkwo notified per the Cresta escalation matrix.
- **POL-INCIDENT-v2.0.**

## Escalation

Marcus Ortiz (product owner). Aisha Okonkwo for Cresta customer comms. Dr Sara Vance for any HIPAA-implicated downtime.

## Related

- design-doc-aura-hvac-scheduler.md
- design-doc-aura-tenant-isolation.md
- RB-Aura-Cresta-Failover-006
