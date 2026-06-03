---
content_type: deployment_guide
region: apac
title: Deployment — Halcyon Logistics Atlas Logix APAC (Phase 2)
---

# Deployment · Halcyon Logistics Atlas Logix APAC (Phase 2)

Customer-specific deployment record for Halcyon Logistics' Phase 2 Atlas Logix rollout covering APAC trucking and inter-modal routes. Owned by Marcus Ortiz.

## Customer profile

- **Customer:** Halcyon Logistics
- **Region of deployment:** APAC (operationally), customer HQ NORAM (Toronto)
- **CSM:** Marcus Ortiz
- **Phase 1 contract date:** 2026-03-15
- **Phase 2 contract date:** 2028-01-22
- **Phase 2 go-live:** 2028-05-04

## Origin/destination scope

- Singapore origin → ASEAN destinations.
- Sydney origin → Australia/NZ destinations.
- Inter-modal handoffs at Singapore PSA and Sydney Port Botany.

## Milestone log

- 2028-01-22: Phase 2 contract signed.
- 2028-02-15: TMS traffic-shape analysis complete (4 weeks of historical concurrency data ingested).
- 2028-03-12: Atlas Logix 4.8.0 deployed in Halcyon staging.
- 2028-04-15: 30-day parallel run preparation complete.
- 2028-04-20: Andre Pellegrini (Halcyon COO) raises 22-bullet risk register (see `escalation-halcyon-apac-routing-cutover.md`).
- 2028-05-04: Cutover executed without incident, Marcus on-site in Singapore.
- 2028-06-04: Atlas Logix 4.8.0 declared production-of-record.

## Version posture

- Atlas Logix 4.8.0 only.
- No 4.7.x deployments anywhere in the Halcyon estate, in line with RB-Logix-MemLeak-002 guardrails.

## Joint working cadence

- Weekly Atlas-Halcyon ops review.
- Monthly Atlas (Marcus + Priya) to Halcyon (Andre + Inge) executive standup.
- Daily standup during cutover stabilisation.

## Related

- `escalation-halcyon-apac-routing-cutover.md`
- `case-study-halcyon-logistics.md`
- `deployment-guide-logix.md`
- INC-2027-0188, RB-Logix-MemLeak-002
