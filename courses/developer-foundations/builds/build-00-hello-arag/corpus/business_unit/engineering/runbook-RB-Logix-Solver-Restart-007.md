---
content_type: runbook
region: noram
title: RB-Logix-Solver-Restart-007 — Logix Solver Worker Restart
---

# RB-Logix-Solver-Restart-007 · Logix Solver Worker Restart

**Product:** Atlas Logix
**Owner:** Marcus Ortiz (Principal Architect)
**Last revised:** 2028-Q2

## Background

The Logix v4.0 routing engine runs solver workers with hard memory ceilings (a direct lesson from INC-2027-0188). When a worker is killed by the watchdog, the orchestrator restarts a fresh worker. Occasionally the orchestrator itself misses the kill signal and the worker is left in a defunct state, blocking new solves for that customer until manually restarted.

## Severity

P1 — affects routing latency for the customer tenant whose worker is stuck. P0 if it affects Halcyon Logistics during their NORAM dispatch window (15:00-19:00 UTC).

## Trigger

Pager from Logix health bus indicating tenant solve queue depth > 200 with no completions in 5 minutes.

## Steps

1. Acknowledge page; identify affected tenant from alert payload.
2. Confirm worker state: `logix-admin worker-status --tenant <tenant-id>`.
3. If a worker is `defunct` or `wedged`, manually kill: `logix-admin worker-kill --tenant <tenant-id> --worker <id>`.
4. Confirm orchestrator restarts a fresh worker within 30 seconds.
5. Monitor solve queue depth — should drop to < 10 within 5 minutes.
6. If the same worker re-wedges within 30 minutes, escalate to L3 architect on-call (likely a regression of INC-2027-0188 class).

## Verification

- New worker process visible in `logix-admin worker-status`.
- Solve queue depth normalising.
- No memory ceiling breaches in subsequent worker.

## Affected customers

- **Halcyon Logistics** (NORAM dispatch window) — primary concern.
- Other Logix tenants — affected only if their worker happens to be the wedged one.

## Compliance

Satisfies POL-INCIDENT-v2.0 routine remediation requirements. No regulatory implications unless customer-facing latency breaches SLA.

## Escalation

Marcus Ortiz (product owner). Out-of-hours: Atlas L3 NORAM rotation.

## Related

- INC-2027-0188
- RB-Logix-MemLeak-002
- design-doc-logix-routing-v4.md
