---
content_type: rfc
region: noram
title: RFC — Logix Routing Explanation API
---

# RFC · Logix Routing Explanation API

**Authors:** Marcus Ortiz, Aisha Okonkwo
**Status:** Approved
**Open period:** 2028-Q2 (comments closed)

## Summary

Halcyon Logistics has asked Atlas Logix to expose human-readable explanations alongside routing decisions, so their dispatch operators can understand why a particular route was selected. This RFC proposes the explanation API surface, the BYO-LLM coupling, and the EU AI Act transparency posture.

## Proposal

- New endpoint `/v1/routes/{id}/explanation` returns a structured explanation: key constraints satisfied, key constraints relaxed, top alternate routes considered.
- Optional `format=natural_language` query renders the structured explanation via the BYO-LLM layer.
- All explanations include a disclosure banner per EU AI Act Article 52.

## Why structured + optional natural language

Halcyon's dispatch operators need to defend decisions to their customers. Structured explanations are machine-checkable; natural language is more digestible. Offering both lets customers pick based on their regulatory posture.

## Compliance

- **EU AI Act Art. 52.** Disclosure banner satisfies transparency for any natural-language output.
- **GDPR.** Explanations contain no personal data; route geometry is anonymised at the API boundary.
- **POL-DATA-v3.1.** Tenant scoping enforced on the endpoint.

## Customer impact

- **Halcyon Logistics.** Primary requester.
- Secondary 3PL prospects could find this differentiating; Sales has flagged interest from two LATAM prospects.

## Related

- RFC — Atlas BYO-LLM Routing
- design-doc-logix-routing-v4.md
- rfc-eu-ai-act-product-classification.md
