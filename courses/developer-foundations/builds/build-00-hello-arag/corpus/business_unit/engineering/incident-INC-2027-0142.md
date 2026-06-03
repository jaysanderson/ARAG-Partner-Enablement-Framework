---
content_type: incident
region: emea
title: INC-2027-0142 — Atlas E-220 Q4 Turbine Cooling Regression
---

# INC-2027-0142 · Atlas E-220 Q4 Turbine Cooling Regression

**Product:** Atlas E-220
**Severity:** P0 (EMEA winter), P2 (tropical regions)
**Detected:** 2027-10-15 at Norvale Energy production site
**Closed:** 2028-01-22 (final customer remediation)
**Owner:** Priya Anand (VP Engineering)
**Remediation runbook:** RB-E220-Cooling-001

## Summary

Atlas E-220 turbines deployed at Norvale Energy in EMEA cold regions began entering protective-shutdown state during cold-start cycles. Investigation traced the regression to Patch 3.2 (cooling firmware), which introduced an inverted thermal-coefficient lookup. Patch 3.4 reverted the lookup and added a safety guard for cold ambient starts.

## Timeline

- **2027-10-15** — First protective shutdown at Norvale Energy site Alpha. Field-service ticket opened.
- **2027-10-18** — Pattern recognised across three Norvale sites. Atlas Engineering paged Priya Anand.
- **2027-10-21** — Root cause identified in Patch 3.2 lookup table.
- **2027-10-27** — Patch 3.4 cut, customer notification sent.
- **2027-11-03** — Patch 3.4 deployed at Norvale primary site.
- **2027-11-22** — All Norvale sites patched.
- **2028-01-22** — Talos Steelworks (secondary deployment) patched. Incident closed.

## Customer impact

- **Norvale Energy** — Three sites experienced 6-24 hour reduced output windows during the incident period. Estimated production cost recovery: €1.2M.
- **Talos Steelworks** — No production impact (deployment is in a temperate region, didn't hit cold-start trigger).

## Lessons

- Pre-release thermal-coefficient table validation now mandatory.
- Atlas E-220 cold-start test suite expanded to cover ambient < 5 °C scenarios.
- Customer notification template updated to include "patch deployment timeline" within 48 hours.

## Regulatory exposure

NIST 800-53 r5 IR-4 (Incident Handling) compliance preserved by adherence to Atlas Incident Response Policy `POL-INCIDENT-v2.0`. No EU AI Act applicability (cooling firmware doesn't meet AI Act definitions).

## Related

- RB-E220-Cooling-001 (the remediation runbook)
- INC-2028-0019 (BuildingHub firmware regression — similar discipline lesson)
