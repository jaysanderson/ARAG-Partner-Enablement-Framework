---
content_type: runbook
region: emea
title: RB-E220-Cooling-001 — Atlas E-220 Cooling Regression Remediation
---

# RB-E220-Cooling-001 · Atlas E-220 Cooling Regression Remediation

**Product:** Atlas E-220
**Owner:** Priya Anand (VP Engineering)
**Remediates:** INC-2027-0142 (Q4 turbine cooling regression)
**Last revised:** 2027-Q4

## Background

INC-2027-0142 affected Atlas E-220 turbines deployed at Norvale Energy starting in Q4 2027. The regression was traced to Patch 3.2 (cooling firmware) which introduced an inverted thermal-coefficient lookup in the cold-start sequence. Cold-start cycles in sub-5 °C ambient temperatures triggered over-cooling and a protective shutdown.

## Severity

P0 for any deployment in EMEA winter regions. P2 for tropical / consistently >15 °C ambient deployments.

## Resolution

Apply Patch 3.4 to the cooling firmware on every E-220 unit. Patch 3.4 reverts the inverted lookup and adds a safety guard for ambient < 5 °C cold starts.

## Steps

1. Verify the unit's current cooling firmware version via the maintenance console (`maint --firmware`).
2. If on Patch 3.0-3.3, schedule maintenance window.
3. Download Patch 3.4 from the Atlas E-220 firmware portal.
4. Stage the patch via the maintenance console (`maint --stage-firmware patch-3.4.fw`).
5. Reboot the unit (`maint --reboot`).
6. Verify post-reboot via cold-start simulation (`maint --simulate cold-start ambient=2`).

## Verification

- Cold-start at simulated 2 °C ambient completes without protective shutdown.
- Cooling stable for 30 minutes post-cold-start.

## Affected customers

- Norvale Energy (primary deployment) — runbook applied 2028-01-15.
- Talos Steelworks (smaller deployment) — runbook applied 2028-01-22.

## Compliance

This runbook satisfies NIST 800-53 r5 control IR-4 (Incident Handling) requirements for the affected units. Filed under Atlas Incident Response Policy `POL-INCIDENT-v2.0`.

## Escalation

Any deviation: escalate to **Priya Anand**, VP Engineering. Out-of-hours: Atlas L3 on-call rotation.

## Related runbooks

- RB-Logix-MemLeak-002 (similar pattern: patch revert)
- RB-BldHub-Firmware-003 (firmware rollback discipline)
