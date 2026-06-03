---
content_type: policy
region: emea
title: Atlas Cross-Border Data Transfer Policy v1.0
---

# Atlas Cross-Border Data Transfer Policy v1.0 (POL-XBORDER-v1.0)

**Owner:** Dr Sara Vance (Chief Compliance Officer)
**Effective:** 2028-04-30

## Purpose

Codifies the legal mechanisms Atlas relies on to lawfully transfer customer-personal-data and Atlas-employee-personal-data across jurisdictions.

## EMEA outbound transfers

For GDPR-personal-data leaving the EEA, Atlas relies on:

1. EU Standard Contractual Clauses (2021 modules) embedded in the Atlas customer-data agreement.
2. A current Transfer Impact Assessment (TIA) per importer jurisdiction.
3. Supplementary technical measures where the TIA so requires (encryption with EU-held keys; pseudonymisation).

Atlas's primary outbound transfers cover support data routed to NORAM (Marcus Ortiz's organisation) and product-telemetry analytics. Norvale Energy and Cresta Health Network have signed addenda specifying EU-only key custody for any HIPAA-relevant or sensitive personal data.

## NORAM outbound transfers

NORAM-origin customer data routed to EMEA support is governed by the same SCC framework with EU as importer. Meridian Bank's Atlas Ledger data does not leave NORAM; SOX-relevant data residency is contractually pinned.

## APAC and LATAM

Talos Steelworks (APAC) FieldOps data remains in-region by contract. New APAC and LATAM customers are onboarded under the standard customer-data agreement with regional addenda where local law requires.

## Re-transfers

Sub-processors that further re-transfer customer data must execute SCCs with their own importers and disclose the destination in their security questionnaire (see POL-SUBPROC-v1.0).

## Schrems II compliance

Atlas tracks EU-U.S. Data Privacy Framework status and maintains a fallback to SCC + supplementary measures in any framework-collapse scenario.

## Cross-references

- Atlas GDPR Controller/Processor Position
- Atlas Data Handling Policy v3.1 (POL-DATA-v3.1)
- Atlas Sub-Processor Management Policy v1.0 (POL-SUBPROC-v1.0)
