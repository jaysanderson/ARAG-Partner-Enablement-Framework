---
content_type: rfc
region: noram
title: RFC — Atlas BYO-LLM Routing
---

# RFC · Atlas BYO-LLM Routing

**Authors:** Marcus Ortiz + Priya Anand
**Status:** Approved for engineering rollout Q3 2028

## Summary

Atlas products that use ML for in-product features (Pulse smart-grid optimisation, BuildingHub HVAC scheduling, Logix routing) will route generation calls to customer-owned LLM endpoints when the customer requires it. This RFC proposes a uniform BYO-LLM routing layer.

## Goals

- Customer can choose Azure OpenAI / Google Vertex / AWS Bedrock per product per region.
- Atlas does NOT see customer cleartext data when BYO-LLM is enabled.
- Routing is a per-tenant configuration; no code changes per customer.
- Switching providers is online with no downtime.

## Non-goals

- We will not embed customer-supplied prompts (we control the system prompts).
- We will not allow customer-chosen models that don't meet Atlas's safety baselines.

## Compliance posture

- Dr Sara Vance reviewed the design. EU AI Act and GDPR satisfied: customer is data controller; LLM provider is data processor under customer's existing agreement with the provider.
- No HIPAA exposure since BuildingHub HVAC scheduling doesn't process PHI.

## Customer impact

- Norvale Energy (Pulse) — first customer to test BYO-LLM (Azure OpenAI). Pilot Q3 2028.
- Cresta Health Network (BuildingHub) — second pilot, Vertex.
- Meridian Bank (Atlas Grid) — Bedrock pilot Q4 2028.
