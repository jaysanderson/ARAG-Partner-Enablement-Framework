---
content_type: case_study
region: noram
title: Case Study — Meridian SOX-Compliant Atlas Ledger Deployment Pattern
---

# Case Study · Meridian SOX-Compliant Atlas Ledger Deployment Pattern

**Customer:** Meridian Bank
**Industry:** Financial Services (NORAM)
**Primary CSM:** Dr Sara Vance
**Atlas products:** Atlas Ledger

## The headline

The Meridian Atlas Ledger deployment is Atlas's lighthouse reference for SOX §404 compliance. The deployment pattern (audited control plane, single-source-of-truth chart of accounts, segregation of duties enforced at the API layer) has now been codified as a re-usable reference for any prospective Atlas Ledger banking customer.

## The pattern

1. Atlas Ledger deployed in a single-tenant configuration per market.
2. Cross-market control plane runs in a separate logical environment with its own audit log.
3. SOX-relevant controls implemented as Ledger-native constructs, not as customer-side wrappers.
4. Dr Sara Vance (Chief Compliance Officer) signs off the deployment shape per market.

## Why this matters commercially

- Atlas Ledger does not surcharge SOX-compliant deployments. Vendor B charges ~12%. This is a USD 50k-100k annual differential per market.
- For prospects evaluating Atlas vs Vendor B in banking, the Meridian reference is the single most important asset in the deal cycle.

## Cross-product link

The pattern has informed two related deals:

- proposal-meridian-fieldops-back-office.md — FieldOps adapter for Meridian explicitly preserves the audited Ledger control surface.
- proposal-meridian-aura-data-centre-cooling.md — Aura optimisation scope was carefully delineated to NOT touch the controlled financial systems, with Dr Sara Vance confirming scope separation.

## How AEs should use this case

When pitching Atlas Ledger to a financial-services prospect, lead with:

1. The Meridian Bank multi-year arc (case-study-meridian-ledger-rollout.md).
2. The no-surcharge SOX positioning (vs Vendor B).
3. The deployment-pattern reusability (this document).

Reference customer call with Meridian is available on request via Dr Sara Vance.

## Cross-references

- proposal-meridian-bank.md
- proposal-meridian-ledger-multi-market.md
- pricing-public-sector-supplement.md (related compliance posture)
- case-study-meridian-ledger-rollout.md
