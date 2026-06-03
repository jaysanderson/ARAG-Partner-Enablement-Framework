---
content_type: deployment_guide
region: emea
title: Deployment — Cresta BuildingHub Post-Rollback Standing Configuration
---

# Deployment · Cresta BuildingHub Post-Rollback Standing Configuration

Customer-specific deployment record documenting Cresta Health Network's Atlas BuildingHub configuration following the INC-2028-0019 firmware rollback and the subsequent stabilisation period. Owned by Aisha Okonkwo.

## Customer profile

- **Customer:** Cresta Health Network
- **Region:** EMEA
- **CSM:** Aisha Okonkwo
- **Initial contract date:** 2024-06-30
- **Sites:** 14 hospitals across UK regions
- **Compliance:** HIPAA-scoped

## Standing firmware configuration (post-rollback)

| Site | Firmware | Last updated | Notes |
|---|---|---|---|
| Birmingham | 5.1.8 | 2028-02-14 | Lead rollback site |
| Manchester | 5.1.8 | 2028-02-15 |  |
| Leeds | 5.1.8 | 2028-02-15 |  |
| Edinburgh | 5.1.8 | 2028-02-17 |  |
| ... 10 others | 5.1.8 | 2028-02-21 | Per `escalation-INC-2028-0019.md` |

**Policy:** all Cresta BuildingHub sites are firmware-pinned at 5.1.8 pending the 5.3 release (currently in Priya Anand's release-engineering pipeline). No 5.2.x firmware will be deployed at Cresta until POL-INCIDENT-v2.0 post-incident verification gates are complete.

## Cresta-Atlas governance

- Monthly facilities-team check-in (per Q1 2028 customer-health action plan).
- Quarterly executive standup: Aisha Okonkwo + Eleanor Brightwell + Priya Anand.
- Annual HIPAA review co-led by Aisha and Dr Sara Vance.
- Cresta CISO (Marcus Whitfield) receives written quarterly compliance posture summary.

## Customer-side executive sponsors

- Eleanor Brightwell — Director of Facilities Engineering (primary day-to-day).
- Marcus Whitfield — Chief Information Security Officer (compliance-side).

## Related

- INC-2028-0019, RB-BldHub-Firmware-003
- `escalation-INC-2028-0019.md`
- `escalation-cresta-hipaa-audit-prep.md`
- `escalation-cresta-followup-aura-pilot.md`
- `deployment-guide-buildinghub.md`
