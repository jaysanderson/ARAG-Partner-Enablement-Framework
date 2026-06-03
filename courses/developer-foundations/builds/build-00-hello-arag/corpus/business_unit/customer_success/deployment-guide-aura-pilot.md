---
content_type: deployment_guide
region: emea
title: Atlas Aura Pilot Deployment Guide
---

# Atlas Aura Pilot Deployment Guide

Pilot deployment guidance for Atlas Aura. Owned by Aisha Okonkwo's customer success team. First pilot customer is Cresta Health Network (per `escalation-cresta-followup-aura-pilot.md`).

## Phase 1 — Site survey and intent (Weeks 1-3)

- Building occupancy and lighting infrastructure survey.
- Existing building automation system inventory.
- Customer intent documentation: what business outcome will Aura prove?
- HIPAA scoping for healthcare customers. Dr Sara Vance joins.

## Phase 2 — Aura controller install (Weeks 4-5)

- Per-site Aura controller install: 1 day.
- Zone-extender install: 2 hours per extender.
- **Firmware-pinning protocol:** Aura uses the same firmware-pinning policy as Atlas BuildingHub (post-INC-2028-0019 release-engineering posture). Customers can request explicit per-firmware-version pin commitments.

## Phase 3 — Integration (Weeks 5-8)

- Integration with existing building automation system (BACnet, KNX, or Modbus per site).
- Integration with customer's facility-management system.
- For Cresta: integration with patient-care monitoring alert pipeline (HIPAA-scoped).

## Phase 4 — Pilot verification (Weeks 9-13)

- 4-week verification window with active customer-side facility-team observation.
- Weekly customer-success check-in with Aisha Okonkwo.
- Monthly executive readout for healthcare customers.

## Phase 5 — Pilot decision and rollout

- Decision criteria documented in writing prior to pilot start.
- Rollout cadence per customer.

## Cresta-specific protocol

For the Cresta Aura pilot:

- Quarterly executive standup chaired by Aisha Okonkwo with Eleanor Brightwell and Priya Anand.
- 4 sites: Birmingham, Manchester, Leeds, Edinburgh (same blast-radius as INC-2028-0019, intentionally chosen).
- Dedicated Cresta-Atlas firmware-gating sub-process.

## Escalation

- Operational: route through Aisha Okonkwo.
- Firmware: route through Priya Anand.
- HIPAA/compliance: route through Dr Sara Vance.

## Related

- `escalation-cresta-followup-aura-pilot.md`
- `escalation-cresta-hipaa-audit-prep.md`
- `case-study-cresta-health.md`
- `deployment-guide-buildinghub.md` (sibling guide for the same product family)
