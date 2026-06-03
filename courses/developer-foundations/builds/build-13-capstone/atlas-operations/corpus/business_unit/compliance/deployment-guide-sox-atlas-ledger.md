---
content_type: deployment_guide
region: noram
title: Atlas Ledger SOX-Relevant Deployment Guide
---

# Atlas Ledger SOX-Relevant Deployment Guide

**Audience:** Atlas Customer Success engineers deploying Atlas Ledger to SOX-relevant customers (Meridian Bank is the flagship)
**Owner:** Dr Sara Vance (CCO — Atlas Ledger product line)
**Engineering reviewer:** Marcus Ortiz (Principal Architect)

## Pre-deployment

1. Confirm executed Atlas Ledger SOX-deliverable bundle commitments in the MSA.
2. Confirm data-residency clause aligns with customer obligations (Meridian's clause pins to NORAM).
3. Confirm Atlas Ledger SOC 2 Type II report current.
4. Confirm latest Atlas Ledger penetration test summary current and customer-shared.

## Deployment

1. Install via Atlas Ledger installer with hardware-backed root key.
2. Configure separation-of-duties across the customer-side admin plane per the standard Atlas Ledger admin model. IAM policy enforces (post the SOX ITGC automation RFC enactment, this will be runtime-verified).
3. Audit-log retention configured at 7 years per POL-DATA-v3.1 and POL-RETENTION-v1.0. Logs immutable.
4. Pen-test recommendation tickets pre-staged in customer's view of the Atlas Compliance dashboard.

## Post-deployment

1. Quarterly access-review calendar provisioned with customer IT liaison; 30-day advance reminders per AF-2028-018 remediation.
2. Annual Atlas-side SOX audit (Q4) deliverable bundle pre-staged.
3. Customer-side audit cycles can request the standard package via Atlas Customer Success (or the proposed Customer Trust Portal once delivered).

## Ongoing operations

- No deployments to production permitted without prior quarterly access review (SOX ITGC automation RFC enactment will enforce this in code).
- Any incident affecting the Atlas Ledger deployment escalates to Dr Sara Vance for SOX-material classification within 24 hours.
- Any change to Atlas Grid (shared routing engine; SOX-secondary at Meridian) is documentation-refreshed per AF-2028-037 remediation.

## Cross-references

- Atlas SOX §404 Position
- POL-DATA-v3.1, POL-SECBASE-v2.0, POL-RETENTION-v1.0, POL-RECORDS-v1.0
- AF-2028-018, AF-2028-037, AF-2028-046
- RFC — Atlas Ledger SOX IT General Controls Automation
