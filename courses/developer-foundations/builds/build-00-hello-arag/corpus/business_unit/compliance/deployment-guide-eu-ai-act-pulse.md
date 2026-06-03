---
content_type: deployment_guide
region: emea
title: Atlas Pulse EU AI Act Limited-Risk Deployment Guide
---

# Atlas Pulse EU AI Act Limited-Risk Deployment Guide

**Audience:** Atlas Customer Success engineers deploying Atlas Pulse to EMEA customers
**Owner:** Priya Anand (VP Engineering)
**Compliance reviewer:** Dr Sara Vance (CCO)

## Pre-deployment

1. Confirm customer is in EMEA (Atlas Pulse AI Act obligations apply at deployment time in EMEA).
2. Confirm latest customer-facing Atlas EU AI Act applicability statement delivered for Pulse (Norvale Energy received 2028-Q2).
3. Confirm algorithmic impact assessment for Pulse current and customer-shared.
4. Confirm POL-AIUSE-v1.0 review of any new Pulse ML feature in the deployment scope.

## Deployment

1. Install Atlas Pulse with the current GA release (post AF-2028-015 remediation, ensure release ≥ 2028-R2.4 for in-UI transparency).
2. Configure data-quality and governance per the customer-data agreement.
3. Configure human-oversight hooks for any customer-designated material decisions.
4. Configure post-market monitoring per RFC recommendation (voluntary alignment with High-Risk Article 61 monitoring).

## Post-deployment

1. Customer training delivered including the in-UI transparency walkthrough.
2. Transparency-disclosure UX walked through with customer operator team.
3. Algorithmic impact assessment refresh scheduled for next anniversary.

## Ongoing operations

- Annual algorithmic impact assessment (Priya Anand-led).
- Annual applicability statement refresh aligned to Atlas EU AI Act Applicability Position annual review.
- NIS2 supply-chain alignment for energy-sector customers per the relevant RFC.

## Cross-references

- Atlas EU AI Act Applicability Position 2028
- POL-AIUSE-v1.0, POL-DATA-v3.1
- AF-2028-015
- RFC — NIS2 Applicability for Atlas Pulse at Norvale Energy
- Norvale Energy customer context
