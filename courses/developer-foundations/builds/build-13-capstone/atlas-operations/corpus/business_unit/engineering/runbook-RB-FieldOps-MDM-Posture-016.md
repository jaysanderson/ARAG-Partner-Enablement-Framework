---
content_type: runbook
region: emea
title: RB-FieldOps-MDM-Posture-016 — FieldOps MDM Posture Failure Triage
---

# RB-FieldOps-MDM-Posture-016 · FieldOps MDM Posture Failure Triage

**Product:** Atlas FieldOps
**Owner:** Priya Anand (VP Engineering)
**Field co-owner:** Liam Hayashi
**Last revised:** 2028-Q2

## Background

FieldOps v1.3 enforces an MDM posture per design-doc-fieldops-mobile-mdm.md. When a device fails posture, the technician is dropped to read-only mode and a banner explains why. A spike in posture failures across a single customer points to a customer MDM configuration change; a spike across a single device platform points to an OS update breaking posture probing.

## Severity

P1 if affecting an entire customer tenant. P2 for individual device failures (no runbook activation needed).

## Trigger

Pager from FieldOps posture subsystem indicating tenant-level posture failure rate > 5%.

## Steps

1. Confirm scope: single tenant or cross-tenant.
2. Single tenant: contact customer IT — likely an MDM policy change broke posture compatibility. Common with Cresta Health Network MDM hardening cycles.
3. Cross-tenant: examine device platform breakdown. If concentrated on a recent OS version, file a posture-probe compatibility ticket with engineering.
4. While triaging: technicians remain in read-only mode (correct fail-safe).
5. Once root cause identified, apply remediation (customer MDM config rollback or posture-probe patch).
6. Verify posture failure rate returns below 1% baseline.

## Verification

- Posture failure rate normalised.
- Technicians on the affected tenant resume write operations.
- No GDPR / HIPAA exposure during the read-only window (read-only is the safe failure mode).

## Affected customers

- **Cresta Health Network.** Hardened MDM policy; most frequent source of posture changes.
- **Halcyon Logistics.** Large fleet; OS update issues most visible here.

## Compliance

- **NIST 800-53 r5 AC-19.** Posture enforcement preserved through triage.
- **HIPAA.** For Cresta, read-only fallback satisfies the technical safeguards even during posture failure.

## Escalation

Priya Anand (engineering). Liam Hayashi (field ops). Out-of-hours: Atlas L3 EMEA rotation.

## Related

- design-doc-fieldops-mobile-mdm.md
- design-doc-fieldops-offline-sync-v3.md
- POL-DATA-v3.1
