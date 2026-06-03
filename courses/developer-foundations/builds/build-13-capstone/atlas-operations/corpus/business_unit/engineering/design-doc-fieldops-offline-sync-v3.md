---
content_type: design_doc
region: apac
title: Atlas FieldOps Offline Sync v3.0
---

# Atlas FieldOps Offline Sync v3.0

**Author:** Marcus Ortiz (Principal Architect)
**Co-author:** Liam Hayashi (Head of Field Operations)
**Reviewer:** Priya Anand
**Status:** Approved post INC-2028-0034
**Version:** 3.0

## Context

The Atlas FieldOps mobile application supports tens of thousands of field technicians worldwide, operating in environments with intermittent or no connectivity (remote utility sites, basement plant rooms, transit tunnels). The v2.x offline sync mechanism was the root cause of INC-2028-0034 (offline sync corruption). v3.0 is a clean re-architecture, not a patch.

## Design goals

- **No silent data loss.** Any sync conflict must be surfaced to the technician, never resolved unilaterally.
- **Determinism.** Identical offline edit streams produce identical post-sync state on identical server state.
- **Bandwidth efficiency.** Median sync payload under 40KB per technician per day.
- **Encryption at rest.** Local data encrypted with per-device key (NIST 800-53 r5 SC-28).

## Architecture change

v2.x used a last-writer-wins (LWW) merge with timestamp ordering. The LWW assumption broke on devices with skewed clocks and on conflicting edits to the same checklist item from multiple technicians (a common pattern at Talos Steelworks).

v3.0 uses operation-based CRDTs for checklist items, append-only logs for time entries, and per-record version vectors for asset state. Conflicts that cannot be auto-merged are surfaced to a "conflicts" inbox in the FieldOps app.

## Test matrix

| Scenario | v2.x outcome | v3.0 outcome |
|---|---|---|
| Two technicians edit same checklist, 4hr offline | Last sync wins, other lost | Both visible, conflict surfaced |
| Device clock skewed by 12 hours | Ordering errors | Clock-skew independent |
| 7-day offline period, 800 edits | 30% corruption | Lossless sync |
| Sync mid-firmware update | Partial state | Atomic, all-or-nothing |

## Compliance

- **NIST 800-53 r5 SC-28** — per-device encryption at rest, key in Secure Enclave / Keystore.
- **GDPR Art. 32** — encryption and conflict logging satisfy the technical-measures requirement.

## Roll-out

Liam Hayashi owns the field rollout. Talos Steelworks pilot Q4 2028; Norvale Energy field crews Q1 2029; full deployment Q2 2029.

## Related

- INC-2028-0034
- RB-FieldOps-Sync-004
- RFC — FieldOps Conflict Inbox UX
