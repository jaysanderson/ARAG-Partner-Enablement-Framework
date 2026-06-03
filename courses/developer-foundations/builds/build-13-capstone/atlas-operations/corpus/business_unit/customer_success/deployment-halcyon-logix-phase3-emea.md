---
content_type: deployment_guide
region: emea
title: Deployment — Halcyon Logistics Atlas Logix Phase 3 EMEA
---

# Deployment · Halcyon Logistics Atlas Logix Phase 3 EMEA

Customer-specific deployment record for Halcyon Logistics' Phase 3 Atlas Logix rollout covering EMEA routes. Owned jointly by Marcus Ortiz and Priya Anand (per the restructured working group following Inge Larsson's escalation — see `escalation-halcyon-emea-cutover-readiness.md`).

## Customer profile

- **Customer:** Halcyon Logistics
- **Region of deployment:** EMEA (Amsterdam hub)
- **CSM:** Marcus Ortiz (with Priya Anand co-leading the EMEA cutover)
- **Phase 3 contract date:** 2028-06-15
- **Phase 3 go-live target:** 2028-08-15

## Origin/destination scope

- Amsterdam origin → EU mainland destinations.
- Rotterdam port → inter-modal handoff to road.
- UK distribution under negotiation for a possible Phase 3.5.

## Milestone log

- 2028-06-15: Phase 3 contract signed.
- 2028-06-28: TMS traffic-shape analysis complete.
- 2028-07-18: Joint table-top exercise in Amsterdam (planned).
- 2028-07-20: Atlas Logix 4.8.0 deployed in Halcyon Amsterdam staging.
- 2028-08-15: Cutover (planned).
- 2028-09-14: 30-day parallel run complete (planned).

## Working group composition

- Atlas: Marcus Ortiz (lead), Priya Anand (engineering guarantor), EMEA support team.
- Halcyon: Inge Larsson (EMEA Operations Director, co-lead), Devon Brooks (Application Integration), Andre Pellegrini (COO sponsor).

## Version posture

- Atlas Logix 4.8.0 only.
- TMS payload-schema dual-version support (v8.x and v9.x) per the patch deployed 2028-06-10.

## Compliance posture

- GDPR — controller-processor delineation refreshed for EMEA scope.
- EU AI Act — applicability statement on file (Dr Sara Vance).

## Related

- `escalation-halcyon-emea-cutover-readiness.md`
- `escalation-halcyon-tms-integration-version-mismatch.md`
- `deployment-halcyon-logix-apac.md`
- `case-study-halcyon-logistics.md`
- `deployment-guide-logix.md`
