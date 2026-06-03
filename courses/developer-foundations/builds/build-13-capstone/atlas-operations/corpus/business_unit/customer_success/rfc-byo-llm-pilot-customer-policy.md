---
content_type: rfc
region: noram
title: RFC — Customer Success Policy for BYO-LLM Pilots
---

# RFC · Customer Success Policy for BYO-LLM Pilots

**Status:** Draft for discussion
**Owner:** Aisha Okonkwo (Director of Customer Success) + Dr Sara Vance (Compliance)
**Date:** 2028-09-15
**Audience:** Atlas customer-success leadership, Atlas exec staff, Atlas compliance team

## Problem statement

Several Tier-1 customers (Norvale, Cresta, Meridian) have opened conversations about Atlas's BYO-LLM (bring-your-own-LLM) pilot programme. The BYO-LLM programme allows enterprise customers to substitute Atlas's default LLM with a customer-provided enterprise LLM endpoint (typically Azure OpenAI, AWS Bedrock, or customer-hosted).

The customer-success function does not currently have a documented policy for:

1. Which customers qualify for the pilot.
2. What customer-side prerequisites are required.
3. What Atlas-side commitments are made.
4. What compliance posture applies.
5. How service credits apply if the customer-provided LLM endpoint causes operational issues.

This RFC proposes that policy.

## Proposed customer qualification criteria

- Tier-1 status (Atlas customer for ≥2 years, ARR ≥USD 1M).
- Has an in-house or contracted LLM endpoint capability (Azure OpenAI, AWS Bedrock, customer-hosted, etc.).
- Has a compliance posture that justifies the BYO-LLM substitution (typically: data-residency, regulator-side expectation, internal AI-governance policy).
- Has an Atlas-side CSM with bandwidth to support the pilot.

## Proposed customer-side prerequisites

- Customer-side technical owner identified.
- Customer-side compliance owner identified.
- LLM endpoint operational SLA defined by customer.
- Customer-side incident-response coordination protocol agreed.

## Proposed Atlas-side commitments

- Atlas customer-success function provides BYO-LLM-specific deployment guidance.
- Atlas engineering provides BYO-LLM integration support.
- Atlas compliance team confirms the customer-side LLM endpoint meets the relevant regulatory framework.
- Atlas explicitly documents that the customer's LLM endpoint is the customer's responsibility — Atlas service credits do not apply to LLM-endpoint-side outages.

## Open questions

1. Should BYO-LLM be priced as a feature, or treated as a customer-controlled substitution at no cost?
2. How do we handle hybrid scenarios (e.g., Cresta wanting BYO-LLM only for patient-care monitoring flows)?
3. What's the incident-response coordination protocol for customer-side LLM-endpoint outages?
4. How does this interact with the EU AI Act applicability statement (Dr Sara Vance owns)?

## Pilot candidates (current conversations)

- Norvale Energy (Q3 2028 conversation, Priya Anand owns).
- Cresta Health Network (Q3 2028 conversation, Aisha Okonkwo owns).
- Meridian Bank (Q3 2028 conversation, Dr Sara Vance owns — naturally a compliance-driven conversation).

## Comments period

Open until 2028-10-15. Comments to Aisha Okonkwo and Dr Sara Vance.

## Related

- `case-study-customer-health-q3-2028.md`
- `case-study-meridian-compliance-led-csm.md`
- POL-INCIDENT-v2.0
- `customer-health-q1-2028.md`
