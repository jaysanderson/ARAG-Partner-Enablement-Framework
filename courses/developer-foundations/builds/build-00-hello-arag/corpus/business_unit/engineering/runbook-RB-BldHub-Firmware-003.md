---
content_type: runbook
region: emea
title: RB-BldHub-Firmware-003 — BuildingHub Firmware Rollback
---

# RB-BldHub-Firmware-003 · BuildingHub Firmware Rollback

**Product:** Atlas BuildingHub
**Owner:** Aisha Okonkwo (Director of Customer Success)
**Remediates:** INC-2028-0019 (BuildingHub firmware rollback)
**Last revised:** 2028-Q1

## Background

INC-2028-0019 affected Atlas BuildingHub deployments at Cresta Health Network. Firmware release 5.2.1 introduced a regression in the HVAC scheduling subsystem that caused HVAC zones to spin up unexpectedly during off-hours, increasing energy load and triggering HIPAA-relevant facility alerts (HVAC anomalies are monitored alongside patient-care zones).

## Severity

P0 for any HIPAA-regulated deployment. P1 for general commercial deployments.

## Resolution

Roll back to firmware 5.1.8 (the last known-good release). Skip 5.2.x entirely. Firmware 5.3 (releasing Q2 2028) addresses the regression with proper test coverage.

## Steps

1. Verify BuildingHub firmware version via the customer admin console.
2. If on 5.2.0 or 5.2.1, plan rollback.
3. Schedule rollback during a maintenance window. **Coordinate with the customer's facilities team**; HVAC zones may have a 5-10 minute window of reduced setpoint adherence during the rollback.
4. Stage rollback via the Atlas BuildingHub firmware portal.
5. Apply rollback (`buildinghub-fw rollback 5.1.8`).
6. Verify HVAC scheduling normal after rollback.

## Verification

- 24-hour observation period post-rollback.
- HVAC zones adhere to scheduled setpoints.
- No facility alerts (HIPAA-relevant or general).

## Affected customers

- Cresta Health Network — rollback applied 2028-02-14.

## Compliance

This runbook satisfies HIPAA §164.308(a)(8) (Periodic Technical Evaluation) requirements for the affected units. Filed under Atlas Incident Response Policy `POL-INCIDENT-v2.0`. **Dr Sara Vance** (Chief Compliance Officer) was notified and signed off the rollback approach.

## Escalation

Any deviation: escalate to **Aisha Okonkwo** (Director of Customer Success) AND **Priya Anand** (VP Engineering — BuildingHub firmware is built by her org).

## Related

- RB-E220-Cooling-001 (similar pattern)
- RB-Logix-MemLeak-002 (firmware rollback discipline)
