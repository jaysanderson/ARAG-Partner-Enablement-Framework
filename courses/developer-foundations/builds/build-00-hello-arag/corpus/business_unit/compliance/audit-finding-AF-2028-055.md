---
content_type: audit_finding
region: noram
title: Audit Finding AF-2028-055 — Atlas Internal LLM Use Outside Approved Registry
---

# Audit Finding AF-2028-055 · Atlas Internal LLM Use Outside Approved Registry

**Auditor:** Atlas internal audit (NORAM Compliance)
**Audit cycle:** Q4 2028
**Status:** Closed
**Severity:** Minor
**Owner:** Dr Sara Vance (CCO)
**Co-owner:** Marcus Ortiz (Principal Architect)

## Finding

POL-AIUSE-v1.0 restricts employee use of third-party LLMs to those listed in the approved-tools registry. A spot audit of engineering workstations across Marcus Ortiz's NORAM organisation identified usage of two LLM tools not on the registry. Both tools were used on non-Regulated data (open-source dependency analysis), but the absence-from-registry itself is a control deviation.

The same audit confirmed Priya Anand's EMEA organisation, the Customer Success organisation, and the Sales organisation were all compliant.

## Affected systems

- Two engineering tool stacks. No customer data implicated. No leakage of Atlas-Regulated data verified.

## Remediation

- Approved-tools registry refreshed; two newly-vetted tools added.
- Engineering tooling guardrails updated to block non-registry LLM tools at the egress gateway.
- Tooling-onboarding checklist requires registry check at first invocation.
- POL-AIUSE-v1.0 reaffirmed in all-hands.

## Closure criteria

- Registry refreshed: Yes.
- Gateway block in place: Yes.
- All-hands communication delivered: Yes.

## Closed

2028-12-29 — Dr Sara Vance accepted closure with Marcus Ortiz co-signing.

## Cross-references

- POL-AIUSE-v1.0
- POL-AUP-v2.0
- POL-DATA-v3.1
