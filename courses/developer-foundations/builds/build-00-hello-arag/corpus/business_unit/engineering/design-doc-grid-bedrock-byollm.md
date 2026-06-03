---
content_type: design_doc
region: noram
title: Atlas Grid — Bedrock BYO-LLM Adapter Design
---

# Atlas Grid — Bedrock BYO-LLM Adapter Design

**Author:** Marcus Ortiz (Principal Architect)
**Reviewer:** Priya Anand
**Status:** Approved for Meridian Bank pilot Q4 2028
**Version:** 1.0

## Context

Per RFC — Atlas BYO-LLM Routing, Atlas Grid will pilot BYO-LLM at Meridian Bank using AWS Bedrock. This document specifies the Bedrock adapter implementation. The Grid product itself does not make ML-driven dispatch decisions; the BYO-LLM hooks are confined to explanation generation for operator-facing summaries.

## Design goals

- **No Atlas-side cleartext access.** Customer data passes from Grid through the adapter to Bedrock under the customer's IAM, with Atlas blind to payloads.
- **Per-tenant config.** Meridian's NORAM and EMEA regions configure separate Bedrock endpoints.
- **Failure isolation.** Bedrock unavailability does not stop dispatch; explanations fall back to template-based text.
- **SOX §404 evidence.** All Bedrock-generated explanations carry a hash that ties them to the underlying dispatch decision in the immutable journal.

## Architecture

- **Adapter layer.** Implements the BYO-LLM contract from the RFC; speaks Bedrock InvokeModel.
- **Credential broker.** Customer-supplied IAM role assumed at request time; no long-lived secrets at Atlas.
- **Hash binder.** Generated explanation is hashed and recorded alongside the dispatch decision in the Atlas Ledger journal.
- **Fallback.** If Bedrock returns non-2xx in 5s, fall back to deterministic template explanation.

## Compliance posture

- **SOX §404.** Hash binder ensures evidence trail. Reviewed by Dr Sara Vance and Meridian internal audit.
- **NIST 800-53 r5 AC-4.** Information flow enforcement satisfied by per-tenant adapter scoping.
- **GDPR.** Not applicable for Meridian NORAM tenancy; EMEA tenancy uses a separately-configured Bedrock EU region endpoint.

## Test matrix

| Scenario | Outcome |
|---|---|
| Normal explanation request | Bedrock response, hash bound |
| Bedrock 5xx | Fallback template, hash bound to template |
| Customer credential expired | Request fails closed, alert Meridian admin |
| Hash mismatch on audit replay | Audit flag raised |

## Related

- RFC — Atlas BYO-LLM Routing
- design-doc-grid-federated-control-plane.md
- design-doc-ledger-immutable-journal.md
