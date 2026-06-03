---
content_type: runbook
region: emea
title: RB-E220-Cold-Chamber-Down-017 — Cardiff Cold Chamber Outage Handling
---

# RB-E220-Cold-Chamber-Down-017 · Cardiff Cold Chamber Outage Handling

**Product:** Atlas E-220
**Owner:** Priya Anand (VP Engineering)
**Site owner:** Aaron Kim (EMEA Firmware Fitter, Cardiff)
**Last revised:** 2028-Q2

## Background

The Cardiff cold chamber rig is the gate that every E-220 firmware patch must pass per design-doc-e220-firmware-test-harness.md. If the chamber is offline (hardware fault, scheduled maintenance, facility power), no patches can ship to production. This runbook handles the outage window.

## Severity

P2 normally. P0 if a security-critical patch is blocked.

## Trigger

Build farm reports cold chamber unavailable, or scheduled maintenance window > 7 days.

## Steps

1. Confirm chamber state with Aaron Kim's team.
2. Determine expected restoration window.
3. If < 48 hours: queue patches; no further action.
4. If 48 hours - 7 days: escalate to Priya Anand. Consider routing critical patches through the Munich backup chamber (lower throughput, longer turnaround).
5. If > 7 days: open a P0 facility ticket. Engage Liam Hayashi for backup chamber provisioning at Munich.
6. NEVER bypass the cold-chamber gate. Patches that haven't passed are not eligible for production. This was the explicit lesson of INC-2027-0142.

## Verification

- Patches resume flowing through whichever chamber is active.
- Backup chamber (if used) produces identical test-matrix coverage.

## Compliance

- **POL-INCIDENT-v2.0.** The cold-chamber gate is the standing control from INC-2027-0142.
- **NIST 800-53 r5 SI-7.** Software integrity gate preserved across facility outages.

## Escalation

Priya Anand for any patch shipment decision during the outage window. Aaron Kim for facility coordination. Marcus Ortiz if backup chamber test-matrix coverage is in doubt.

## Related

- design-doc-e220-firmware-test-harness.md
- INC-2027-0142
- RB-E220-Cooling-001
