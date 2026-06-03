---
content_type: policy
region: noram
title: Atlas Sub-Processor Management Policy v1.0
---

# Atlas Sub-Processor Management Policy v1.0 (POL-SUBPROC-v1.0)

**Owner:** Dr Sara Vance (Chief Compliance Officer)
**Version:** 1.0
**Effective date:** 2028-04-01
**Review cadence:** Semi-annual
**Sponsor:** Atlas Compliance Council

## Purpose

This policy governs Atlas Global Industries' onboarding, ongoing assessment, and offboarding of sub-processors that handle customer data on Atlas's behalf. It complements POL-DATA-v3.1 by giving the Compliance function and Engineering teams a concrete control framework for third-party data processors.

## Scope

Applies to every Atlas business unit that procures or operates third-party services that touch customer data: Engineering (cloud + observability vendors), Customer Services (support platforms, telemetry pipelines), Sales (deal-room tools that ingest customer logos / contracts), HR (only insofar as candidate data is shared with screening vendors).

## Sub-processor classification

Atlas classifies sub-processors into three tiers:

| Tier | Definition | Approval authority |
|---|---|---|
| Tier 1 | Processes Regulated data (HIPAA, GDPR, SOX) for Atlas customers | Atlas Compliance Council |
| Tier 2 | Processes Confidential customer data, no Regulated overlay | CCO + product VP |
| Tier 3 | Processes only Internal Atlas data | Procurement + DPO sign-off |

## Customer-facing obligations

- Atlas maintains a public sub-processor registry, updated within 10 business days of any addition / removal.
- Customers with Regulated-data contracts (Cresta Health Network, Meridian Bank, Norvale Energy) receive 30 days advance notice of any Tier 1 sub-processor change with right to object.
- Atlas's standard customer-data agreement (referenced in POL-DATA-v3.1) flows down all Atlas obligations to sub-processors via written contract.

## Onboarding checklist

1. Tier classification recorded.
2. Security questionnaire complete (SIG Lite minimum; SIG Core for Tier 1).
3. SOC 2 Type II or ISO 27001 evidence reviewed.
4. Data Processing Addendum executed with the GDPR Article 28 standard clauses for any EMEA-touching sub-processor.
5. Sub-processor added to the registry; customer notice issued if Tier 1.

## Ongoing assurance

- Annual reassessment for Tier 1; bi-annual for Tier 2; spot-check for Tier 3.
- Any sub-processor with a publicly disclosed breach is reassessed within 5 business days.
- The CCO maintains right of immediate suspension for any sub-processor failing reassessment.

## Cross-policy references

- Atlas Data Handling Policy v3.1 (POL-DATA-v3.1)
- Atlas Code of Conduct v3.1 (POL-CONDUCT-v3.1)
- Atlas Incident Response Policy v2.0 (POL-INCIDENT-v2.0)
