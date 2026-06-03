---
content_type: deployment_guide
region: emea
title: Atlas FieldOps EMEA Deployment Guide
---

# Atlas FieldOps EMEA Deployment Guide

Region-specific deployment guidance for Atlas FieldOps in EMEA. Customer Success owned by the regional CSM in conjunction with Liam Hayashi (Head of Field Operations, global product owner).

## Phase 1 — Discovery (Weeks 1-2)

- Customer field-technician fleet sizing.
- Network connectivity assessment per site. EMEA sites often span limited-connectivity regions (offshore wind farms, remote substations).
- GDPR scoping. FieldOps captures technician location data — Article 6 lawful basis must be documented at customer side.
- Compliance scoping with Dr Sara Vance for any cross-border data movement.

## Phase 2 — Device provisioning (Weeks 3-4)

- Atlas FieldOps technician devices provisioned via the EMEA fulfilment hub (Rotterdam).
- Hardware kit per technician: rugged tablet, holster, charger pack, secondary battery.
- **Version pinning:** ship only Atlas FieldOps 2028.6 or later — earlier versions are subject to RB-FieldOps-Sync-004 offline-sync remediation requirements.

## Phase 3 — Installation and training (Weeks 4-6)

- On-site technician training (8 hours, in cohorts of 6-12).
- Customer-side supervisor enablement (4 hours).
- Local-language UX validation. As of Q2 2028, FieldOps ships with English, German, French, Dutch, Italian, Spanish.

## Phase 4 — Pilot (Weeks 7-10)

- 4-week pilot with a single technician cohort.
- Daily metric review with the customer's plant maintenance manager.
- Weekly customer-success check-in.

## Phase 5 — Full rollout (Weeks 11+)

- Customer-defined rollout cadence.
- Quarterly business review.

## Reference deployments

- Norvale Energy — Site 1 (Rotterdam) live as of 2028-06-15; full rollout sequenced through 2028-09-01.
- Other EMEA-region FieldOps customers in the FieldOps customer registry.

## Escalation

- Customer-side issues: route through regional CSM.
- Device fleet or sync issues: route through Liam Hayashi.
- Compliance / GDPR concerns: route through Dr Sara Vance.

## Related

- INC-2028-0034, RB-FieldOps-Sync-004
- `escalation-norvale-fieldops-rollout-q3.md`
- `escalation-talos-fieldops-language-pack.md`
