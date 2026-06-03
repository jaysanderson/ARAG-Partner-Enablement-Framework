---
content_type: rfc
region: emea
title: RFC — Firmware Signing Key Rotation
---

# RFC · Firmware Signing Key Rotation

**Authors:** Priya Anand, Marcus Ortiz
**Status:** Approved
**Open period:** 2028-Q1 (comments closed)

## Summary

Atlas E-220 and Atlas BuildingHub controllers verify firmware payloads against an Atlas-controlled signing key embedded in the controller. The current key has been in use since the original product launch. This RFC proposes a rotation cadence and the mechanism that lets in-field controllers accept the new key without bricking themselves.

## Proposal

- **Cadence.** Rotate the firmware signing key every 24 months. Previous key remains valid for 12 months after rotation (overlap window).
- **Distribution.** New public key is included in the firmware manifest before any payload signed by the new private key is shipped.
- **Verification.** Controllers refuse any payload signed by a key not in their trust store.
- **HSM custody.** Both current and previous private keys held in customer-segregated HSM partitions.

## Risk: bricking

- If a controller misses the manifest containing the new key (offline >24 months), it cannot accept new firmware.
- Mitigation: dispatch field service for offline controllers approaching the 12-month overlap window. Liam Hayashi's team owns the dispatch process.

## Compliance

- **NIST 800-53 r5 SI-7.** Software integrity satisfied across rotations.
- **POL-INCIDENT-v2.0.** Compromise of a current key invokes incident response.

## Customer impact

- **Norvale Energy** (E-220 fleet) — well-connected, no offline risk.
- **Talos Steelworks** (E-220 + small BuildingHub) — some sites offline for extended maintenance; Liam's team to inspect.

## Related

- design-doc-buildinghub-otp-channel.md
- design-doc-e220-firmware-test-harness.md
- RB-BldHub-Firmware-003
