---
content_type: runbook
region: noram
title: RB-Aura-Cresta-Failover-006 — Aura Worker Pool Failover for Cresta
---

# RB-Aura-Cresta-Failover-006 · Aura Worker Pool Failover for Cresta

**Product:** Atlas Aura
**Owner:** Marcus Ortiz (Principal Architect)
**Customer:** Cresta Health Network
**Last revised:** 2028-Q2

## Background

Cresta Health Network runs Atlas Aura in a dedicated HIPAA-segregated worker pool (per design-doc-aura-tenant-isolation.md). When the primary worker pool becomes unhealthy, Aura must fail over to the secondary pool without breaching the BAA-aligned isolation.

## Severity

P0 for any Cresta site running active clinical schedules. Cresta operations rely on Aura honoring clinical-area air-exchange minimums; loss of scheduling triggers manual fallback at the building level.

## Trigger

Pager from Aura health bus indicating Cresta dedicated worker pool has >5% scheduling failure rate sustained for 5 minutes.

## Steps

1. Acknowledge page; verify Cresta tenant ID in the alert payload.
2. Confirm primary pool failure mode via `aura-admin pool-status --tenant cresta-prod`.
3. Initiate failover: `aura-admin failover --tenant cresta-prod --target secondary`.
4. Verify secondary pool is healthy and tenant-tagged: `aura-admin pool-status --tenant cresta-prod`.
5. Confirm scheduling resumes via Cresta health dashboard.
6. Open ticket against the primary pool for root-cause.
7. Notify Aisha Okonkwo (Customer Success Director) per Cresta's escalation matrix.

## Verification

- Cresta tenant ID confirmed on secondary pool.
- No cross-tenant log entries (use `aura-admin audit --tenant cresta-prod --window 1h`).
- Cresta scheduling failure rate < 0.1% sustained for 15 minutes.

## Compliance

This runbook satisfies HIPAA technical safeguards for availability of ePHI-adjacent systems. Reviewed annually by Dr Sara Vance.

## Escalation

Any unexpected cross-tenant log entries: page Dr Sara Vance immediately. Any inability to confirm secondary pool isolation: revert to manual scheduling per Cresta on-site fallback.

## Related

- design-doc-aura-tenant-isolation.md
- design-doc-aura-hvac-scheduler.md
- POL-INCIDENT-v2.0
