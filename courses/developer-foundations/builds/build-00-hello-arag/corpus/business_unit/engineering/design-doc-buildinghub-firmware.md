---
content_type: design_doc
region: emea
title: BuildingHub Firmware Release Process (v5.3 design)
---

# BuildingHub Firmware Release Process (v5.3)

**Owner:** Priya Anand
**Status:** Approved for v5.3 release Q2 2028

## Context

INC-2028-0019 (firmware 5.2.1 HVAC scheduling regression at Cresta Health Network) exposed gaps in the pre-release firmware testing process. AF-2028-007 (closed Q2 2028) drove this revised design.

## Process changes

1. **HIPAA-impact assessment mandatory** for every firmware release affecting any HIPAA-relevant deployment (Cresta Health Network and future hospital customers).
2. **Customer-shadow test cohort** of 3 sites runs the candidate firmware in non-production mode for 14 days before GA.
3. **Rollback procedure** documented for every release; runbook drafted at release-candidate stage, not after the incident.
4. **Cross-functional sign-off** required: Engineering, Customer Success (Aisha Okonkwo), Compliance (Dr Sara Vance).

## v5.3 commits

- HVAC scheduling subsystem rewrite (eliminates 5.2.1 regression class).
- Schedule-rollover regression test suite.
- Improved customer notification API integrated with the customer's FMS.

## Customers in scope

- Cresta Health Network — primary
- 6 other BuildingHub customers globally
