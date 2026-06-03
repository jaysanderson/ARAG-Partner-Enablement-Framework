---
content_type: deployment_guide
region: emea
title: Sales Deployment Guide — BuildingHub in Healthcare
---

# Sales Deployment Guide · BuildingHub in Healthcare

**Audience:** AEs pitching Atlas BuildingHub (and the natural Aura attach) into healthcare-network prospects.
**Reference customer:** Cresta Health Network.

## When this guide applies

- Prospect is a multi-campus healthcare network (hospital, ambulatory care, mixed estate).
- Prospect's energy spend exceeds USD 10M annually OR is under ESG-driven board pressure.
- Prospect operates in EMEA, APAC, or NORAM (avoid for now in LATAM — implementation services capacity in LATAM is thin).

## Reference customer details

Cresta Health Network operates Atlas BuildingHub across 11 EMEA campuses + Aura on 4 (expanding to 11). HVAC energy spend down 11% year-over-year (case-study-cresta-aura-energy-reduction.md). Aisha Okonkwo is the primary CSM.

## Engineering ownership

- BuildingHub platform owner: Aisha Okonkwo (Director of Customer Success — Cresta-specific dual ownership).
- Aura platform owner: also Aisha Okonkwo.
- Priya Anand — engineering executive sponsor for healthcare BuildingHub deployments.

## Compliance posture

- HIPAA — only applicable in NORAM healthcare deployments. Atlas BuildingHub does not surcharge HIPAA-regulated deployments. This is an explicit pricing-noram-2028.md line and a competitive differentiator vs Vendor B.
- EU AI Act — Aura optimisation features in the limited-risk tier (Dr Sara Vance assessment).
- GDPR — applies whenever EU patient data could be incidentally observed; standard controller-processor delineation pattern.

## Operational lessons priced in

INC-2028-0019 (BuildingHub firmware rollback) is the most serious healthcare incident in Atlas's history. RB-BldHub-Firmware-003 is the remediation runbook. Every new healthcare deployment ships on the post-incident stable release. Reference proposal-cresta-bldhub-firmware-uplift.md for the precedent on Atlas-funded recovery SOWs.

## Commercial mechanics

- Per-controller + per-zone-extender pricing per regional book.
- Aura site-license layered separately. Cumulative cross-site Aura discount kicks in past 8 sites (precedent: Cresta).
- Multi-product bundle discount applies when BuildingHub + Aura land together.

## Implementation services sizing

- Per-campus BuildingHub deployment: 20-28 person-days depending on legacy-system integration depth.
- Per-campus Aura activation: 6-8 person-days plus 3-month co-tuning window with customer facilities team.

## What to avoid

- Promising year-1 energy reductions matching Cresta's 11% — the Cresta number is year-2. Year-1 typical is 5-7%.
- Selling BuildingHub without naming the engineering escalation path for clinical-impact incidents (Aisha Okonkwo → Priya Anand).

## Companion documents

- case-study-cresta-aura-energy-reduction.md
- case-study-cresta-bldhub-firmware-recovery.md
- battlecard-cresta-health.md
- proposal-cresta-aura-expansion.md
- proposal-cresta-fieldops-medical-pilot.md
