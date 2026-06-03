---
content_type: policy
region: noram
title: Atlas Vendor Security Assessment Policy v1.0
---

# Atlas Vendor Security Assessment Policy v1.0 (POL-VENDOR-v1.0)

**Owner:** Dr Sara Vance (Chief Compliance Officer)
**Effective:** 2028-03-01
**Review:** Annual

## Purpose

Defines the security assessment Atlas requires of any vendor — whether sub-processor or not — that connects to Atlas networks, builds on Atlas data, or supplies code into Atlas products.

## Scope

Distinct from POL-SUBPROC-v1.0: that policy governs *customer-data* sub-processors; this policy governs the broader vendor population including build-system suppliers, dependency providers, IT service providers, and physical-security vendors.

## Assessment tiers

| Tier | Examples | Required artefacts |
|---|---|---|
| Critical | Cloud IaaS, source control, code signing | SOC 2 Type II, pen test summary, business continuity plan, annual on-site or virtual audit |
| Standard | Productivity SaaS, monitoring | SOC 2 Type II, security questionnaire |
| Light | Marketing tools, scheduling | Security questionnaire, public security posture page |

## Lifecycle controls

- Pre-procurement: Compliance review prior to contract signature.
- Annual reassessment for Critical vendors; biennial for Standard.
- Continuous monitoring via threat-intel subscription; any disclosed breach triggers within-5-day reassessment.
- Offboarding: certificate of destruction for any Atlas-furnished credentials or data.

## Internal ownership

- Engineering (Marcus Ortiz, Priya Anand) own technical due diligence for build-supply-chain vendors.
- IT owns SaaS productivity vendors.
- Compliance (Dr Sara Vance) owns the policy and exception register.

## Exceptions

Exceptions require CCO sign-off and a documented compensating control. No exception is granted indefinitely; maximum exception term is 12 months.

## Cross-references

- Atlas Sub-Processor Management Policy v1.0 (POL-SUBPROC-v1.0)
- Atlas Data Handling Policy v3.1 (POL-DATA-v3.1)
