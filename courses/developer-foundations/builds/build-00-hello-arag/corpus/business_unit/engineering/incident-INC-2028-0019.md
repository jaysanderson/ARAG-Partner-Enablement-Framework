---
content_type: incident
region: emea
title: INC-2028-0019 — BuildingHub Firmware Rollback
---

# INC-2028-0019 · Atlas BuildingHub Firmware Rollback

**Product:** Atlas BuildingHub
**Severity:** P0 (HIPAA-regulated deployments)
**Detected:** 2028-02-09 at Cresta Health Network
**Closed:** 2028-02-21
**Owner:** Aisha Okonkwo (Director of Customer Success)
**Remediation runbook:** RB-BldHub-Firmware-003

## Summary

Atlas BuildingHub firmware release 5.2.1 introduced a regression in the HVAC scheduling subsystem that caused HVAC zones to activate unexpectedly during off-hours. At Cresta Health Network, the unexpected zone activations triggered HIPAA-relevant facility alerts (HVAC anomalies are co-monitored with patient-care zones).

## Resolution

Roll back to firmware 5.1.8 (last known-good). Firmware 5.3 addresses the regression with proper test coverage.

## Timeline

- 2028-02-09 — Cresta Health Network facilities team reports unexpected HVAC activations.
- 2028-02-11 — Atlas Customer Success (Aisha Okonkwo) engaged. Priya Anand's engineering team pulled in.
- 2028-02-14 — Rollback runbook RB-BldHub-Firmware-003 published. Cresta primary site rolled back.
- 2028-02-21 — All Cresta sites rolled back. Incident closed.

## Customer impact

- Cresta Health Network — Six sites experienced 2-4 hours of facility-team workload addressing HIPAA-relevant alerts. No patient-care impact. Atlas issued service credits.

## Lessons

- Firmware test suite expanded to cover HVAC schedule rollover scenarios.
- Customer-coordinated rollback runbook process now standardised.
- Dr Sara Vance flagged that the HIPAA-relevant alert pathway needs better documentation.

## Regulatory exposure

HIPAA §164.308(a)(8) (Periodic Technical Evaluation) reviewed. Dr Sara Vance confirmed no patient-data exposure. Documented in audit finding AF-2028-007 (closed).

## Related

- RB-BldHub-Firmware-003 (the remediation runbook)
- INC-2027-0142 (similar pattern lesson)
