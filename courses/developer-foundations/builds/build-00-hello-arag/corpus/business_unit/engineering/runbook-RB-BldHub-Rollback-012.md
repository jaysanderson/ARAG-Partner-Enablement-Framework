---
content_type: runbook
region: emea
title: RB-BldHub-Rollback-012 — BuildingHub Fleet Rollback
---

# RB-BldHub-Rollback-012 · BuildingHub Fleet Rollback

**Product:** Atlas BuildingHub
**Owner:** Priya Anand (VP Engineering)
**Operations co-owner:** Aisha Okonkwo (Customer Success)
**Last revised:** 2028-Q2

## Background

The v2.0 OTA channel (see design-doc-buildinghub-otp-channel.md) supports one-click fleet rollback via the manifest service. This runbook documents the rollback procedure, the customer-facing comms, and the escalation tree. It complements RB-BldHub-Firmware-003, which handles the per-unit rollback when only a small number of units are affected.

## Severity

P0 — fleet rollback is a high-impact action with broad customer implications.

## Trigger

- Auto-abort from canary stage indicating >1% failure rate (per design-doc-buildinghub-otp-channel.md).
- Manual escalation from Aisha Okonkwo's customer-success team.

## Steps

1. Confirm rollback decision with Priya Anand and Aisha Okonkwo (both required).
2. Identify the active manifest and the rollback target: `manifest-svc list --product buildinghub`.
3. Execute: `manifest-svc rollback --product buildinghub --target <prior-manifest-id>`.
4. Verify the rollback manifest is signed and present in the controller trust path.
5. Monitor controllers re-fetching the rollback manifest (5-minute polling cycle); expect 95%+ within 15 minutes.
6. Aisha's team issues customer comms within 15 minutes using the templated rollback notice (per INC-2027-0142 lessons).
7. Open a P0 ticket against the rolled-back patch for root-cause analysis.

## Verification

- Controller telemetry shows >95% of fleet on rollback manifest within 30 minutes.
- No new failure-rate spikes after rollback.
- Customer comms confirmed sent.

## Affected customers

- Any customer with the affected manifest active. Cresta Health Network is the highest-impact customer due to clinical-area HVAC dependence.

## Compliance

- **POL-INCIDENT-v2.0.** Rollback is a documented control.
- **HIPAA.** Rollback comms to Cresta must use the BAA-aligned channel.
- **NIST 800-53 r5 SI-7.** Signed rollback manifest preserves integrity chain.

## Escalation

Priya Anand and Aisha Okonkwo must both authorise. Dr Sara Vance notified for any HIPAA-tenant impact.

## Related

- INC-2028-0019
- RB-BldHub-Firmware-003
- design-doc-buildinghub-otp-channel.md
