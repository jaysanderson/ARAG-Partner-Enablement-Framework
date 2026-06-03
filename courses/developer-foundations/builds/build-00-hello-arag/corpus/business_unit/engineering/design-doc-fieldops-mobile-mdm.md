---
content_type: design_doc
region: emea
title: Atlas FieldOps MDM Posture v1.3
---

# Atlas FieldOps MDM Posture v1.3

**Author:** Priya Anand (VP Engineering)
**Co-author:** Liam Hayashi
**Reviewer:** Dr Sara Vance
**Status:** Approved
**Version:** 1.3

## Context

The FieldOps mobile app runs on customer-managed devices (BYOD or MDM-enrolled) in 40+ countries. The MDM posture document defines the minimum device controls required for an enrolment to be considered "in good standing", and the engineering hooks that enforce them.

## Design goals

- **Minimum device baseline.** Encrypted storage, screen lock, OS supported by vendor.
- **Posture re-evaluation.** Every login and every 24 hours.
- **Graceful degradation.** Out-of-posture devices retain read-only access; cannot sync writes.
- **No customer data leak.** Out-of-posture state surfaced to technician, never to customer end-user.

## Architecture

- **Posture probe.** Runs on app start, reports device capabilities to the FieldOps backend.
- **Posture verdict cache.** Backend issues a short-lived verdict (24h) signed and bound to device ID.
- **Sync gate.** v3.0 sync engine refuses to push write operations from a device with a non-"good" verdict.
- **Read-only mode UI.** Banner in app explains the failed posture check and how to remediate.

## Compliance

- **NIST 800-53 r5 AC-19** (Access Control for Mobile Devices) satisfied.
- **GDPR Art. 32.** Posture controls are part of the documented technical measures.
- **HIPAA.** Cresta Health Network requires "MDM-enrolled only" for FieldOps technicians touching their sites — enforced via per-tenant posture policy.

## Related

- design-doc-fieldops-offline-sync-v3.md
- RB-FieldOps-Sync-004
- POL-DATA-v3.1
