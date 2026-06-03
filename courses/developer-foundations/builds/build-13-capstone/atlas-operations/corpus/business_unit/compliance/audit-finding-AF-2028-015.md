---
content_type: audit_finding
region: emea
title: Audit Finding AF-2028-015 — Pulse ML Transparency Disclosure for Norvale Energy
---

# Audit Finding AF-2028-015 · Pulse ML Transparency Disclosure for Norvale Energy

**Auditor:** Atlas internal audit (EMEA Compliance)
**Audit cycle:** Q2 2028
**Status:** Open — remediation in flight
**Severity:** Minor
**Owner:** Priya Anand (VP Engineering)
**Co-owner:** Dr Sara Vance (CCO)

## Finding

Atlas Pulse is an EU AI Act Limited-Risk product per the 2028 applicability position. The transparency obligation requires the data subject (Norvale Energy field operators receiving grid-optimisation recommendations from Atlas Pulse) to be informed that an AI system is contributing to the recommendation.

The Norvale Energy pilot launched 2028-Q1 with a transparency note embedded in operator training materials but not surfaced in the Pulse operator UI itself. The audit's interpretation is that the EU AI Act transparency obligation requires in-UI disclosure, not training-only.

## Affected customers

- Norvale Energy (EMEA, sole Pulse pilot at present).

## Remediation plan

- Pulse UI text update in 2028-R2.4 release. Owner: Priya Anand.
- Customer notice to Norvale Energy 30 days prior to release.
- Customer training refresh referencing the new in-UI disclosure.

## Closure criteria

- Release 2028-R2.4 deployed at Norvale.
- Norvale's compliance liaison confirms acceptance.
- Atlas Compliance Council sign-off.

## Target closure

2028-Q3.

## Cross-references

- Atlas EU AI Act Applicability Position 2028
- POL-AIUSE-v1.0
- Norvale Energy case study
