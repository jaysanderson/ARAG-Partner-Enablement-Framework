---
content_type: runbook
region: emea
title: RB-E220-HSM-Failover-009 — E-220 HSM Failover for Firmware Signing
---

# RB-E220-HSM-Failover-009 · E-220 HSM Failover for Firmware Signing

**Product:** Atlas E-220
**Owner:** Priya Anand (VP Engineering)
**Last revised:** 2028-Q2

## Background

Atlas E-220 firmware payloads are signed at the Cardiff EMEA build farm against HSM-held private keys (see rfc-firmware-signing-key-rotation.md). When the primary HSM is unavailable, firmware signing must continue against the secondary HSM partition without violating chain-of-custody requirements.

## Severity

P2 for routine patches. P0 if blocking a security-critical patch shipment.

## Trigger

Build farm reports HSM unavailable on three consecutive sign attempts.

## Steps

1. Confirm HSM unavailability via the HSM management console.
2. Confirm secondary HSM holds the current and previous signing keys: `hsm-cli partition-list --site cardiff-secondary`.
3. Switch the build farm signing target: `buildfarm config signing-target --partition cardiff-secondary`.
4. Re-attempt the signing job. Confirm payload signs successfully.
5. Open ticket against the primary HSM for hardware diagnostics.
6. Notify Priya Anand and Dr Sara Vance — key custody changes require Compliance awareness even when in-policy.

## Verification

- Payload signature verifies against the controller trust store.
- Secondary HSM partition shows usage in audit log.
- Switch event recorded in the chain-of-custody journal.

## Compliance

- **NIST 800-53 r5 SC-12 / SC-13.** Key management satisfied across failover.
- **POL-INCIDENT-v2.0.** Failover event treated as a control event.
- **EU GDPR.** No personal data involvement.

## Escalation

Priya Anand (product owner). Dr Sara Vance (Compliance). Out-of-hours: Atlas L3 EMEA rotation.

## Related

- rfc-firmware-signing-key-rotation.md
- design-doc-e220-firmware-test-harness.md
- RB-E220-Cooling-001
