---
content_type: case_study
region: apac
title: Case Study — FieldOps Cross-Customer Incident Response
---

# Case Study · FieldOps Cross-Customer Incident Response

**Customers in scope:** Halcyon Logistics, Talos Steelworks
**Region:** NORAM + APAC
**Programme:** Coordinated cross-customer response to INC-2028-0034
**Lead CSM:** Liam Hayashi (with Marcus Ortiz on Halcyon)

## Background

INC-2028-0034 (FieldOps offline-sync corruption) affected two customers simultaneously: Halcyon Logistics (28 devices at Toronto hub) and Talos Steelworks (47 devices across Japanese plants). The blast radius was small in absolute terms but the customer-relationship dynamics were complex — two CSMs, two regions, two timezones, two customer-side cultures.

## What the customer success function did

1. **Coordinated communication.** Marcus Ortiz and Liam Hayashi held a joint Atlas-side standup at the start of each day, ensuring both customers received the same factual updates from the same evidence base.
2. **Customer-appropriate cadence.** Halcyon's day-to-day operations leadership (Devon Brooks) preferred bullet-point email updates; Talos's leadership (Yui Nakajima) preferred phone calls in Japanese. Each was honoured.
3. **Common runbook.** RB-FieldOps-Sync-004 was authored once, in English, by Liam Hayashi. A Japanese-language working copy was provided to the Talos technician teams.
4. **Common service-credit logic.** Both customers received service credits computed on the same per-device-day basis. Symmetry was important for both relationships.

## Sequence

- 2028-01-22: Both customers detect FieldOps offline-sync corruption.
- 2028-01-23: Atlas-side daily standup begins. Customer communications synchronised.
- 2028-01-26: Root cause identified; patch designed.
- 2028-01-29: Patch deployed at both customers in coordinated 24-hour window.
- 2028-02-05: Stabilisation complete at both customers.
- 2028-02-12: Liam logs Talos escalation re: language pack (`escalation-talos-fieldops-language-pack.md`).

## Outcomes

- Both customers retained.
- Talos NPS subsequently lifted (Japanese language pack delivery).
- Halcyon Phase 3 EMEA commitment retained.
- POL-INCIDENT-v2.0 cross-customer-coordination provisions revised based on this case.

## Lessons captured

- Cross-customer coordination during a single incident is a customer-success discipline, not just an engineering one.
- Symmetry of treatment matters: both customers should receive substantively equal handling, even if the surface is region-localised.
- Language-localisation gaps surface fastest during stress.

## Related

- INC-2028-0034, RB-FieldOps-Sync-004
- `escalation-talos-fieldops-language-pack.md`
- `deployment-halcyon-fieldops-toronto.md`
- `deployment-talos-fieldops-japan.md`
- POL-INCIDENT-v2.0
