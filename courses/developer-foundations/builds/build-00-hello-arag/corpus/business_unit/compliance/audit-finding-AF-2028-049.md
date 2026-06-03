---
content_type: audit_finding
region: emea
title: Audit Finding AF-2028-049 — Sales Pricing Approval Override Pattern
---

# Audit Finding AF-2028-049 · Sales Pricing Approval Override Pattern

**Auditor:** Atlas internal audit (EMEA Compliance)
**Audit cycle:** Q4 2028
**Status:** Closed
**Severity:** Minor
**Owner:** Dr Sara Vance (CCO)
**Co-owner:** VP Sales (referenced; CCO is the controlling owner of POL-PRICING-v4.0)

## Finding

POL-PRICING-v4.0 sets discount approval gates. A sampling audit of 40 deals closed in H2 2028 found 6 deals where the approval workflow was completed retroactively (deal closed first, approval logged within 48 hours). Two of those deals involved EMEA customers including a Norvale Energy Atlas Pulse expansion.

No deal was outside the discount ceilings — the discounts themselves were within authorised limits — but the workflow sequencing inverted the intended control.

## Affected customers

- Norvale Energy (Atlas Pulse expansion deal).
- One additional EMEA customer outside the anchor set.

## Remediation

- Pricing approval workflow re-tooled in CRM to block deal-stage progression without prior approval timestamp.
- VP Sales communicated the policy reaffirmation to all sellers.
- Sample re-audit of Q1 2029 deals to verify gate enforcement (target: zero retroactive approvals).

## Closure criteria

- CRM workflow enforced: Yes.
- VP Sales communication issued: Yes.
- Q1 2029 sample re-audit clean: Pending.

## Closed

2028-12-20 — Dr Sara Vance accepted closure conditional on Q1 2029 verification.

## Cross-references

- POL-PRICING-v4.0
- POL-ABAC-v2.0 (anti-bribery interplay reviewed; no concerns)
