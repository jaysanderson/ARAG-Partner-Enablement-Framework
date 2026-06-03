---
content_type: rfc
region: noram
title: RFC — Atlas Customer Trust Portal
---

# RFC — Atlas Customer Trust Portal

**Status:** Draft for Atlas Compliance Council and VP Sales review
**Author:** Dr Sara Vance (CCO)
**Co-author:** Aisha Okonkwo (Director of Customer Success)
**Target decision date:** 2029-Q2

## Background

Atlas customers — particularly Meridian Bank, Cresta Health Network, Norvale Energy, and the prospective enterprise pipeline — increasingly require an always-on self-serve channel for security and compliance artefacts. The current model is bilateral: customers email Customer Success, who emails Compliance, who emails back. The throughput is fine for the 5 anchor customers but will not scale to the 50-customer target.

## Proposal

Build the Atlas Customer Trust Portal:

1. Authenticated per-customer view exposing:
   - The current sub-processor registry filtered to that customer's product subscription.
   - The customer-specific Atlas EU AI Act applicability statement (Norvale, Cresta).
   - The customer-specific HIPAA BAA (Cresta) or SOX deliverable bundle (Meridian).
   - Latest SOC 2 Type II report and Atlas pen-test summary.
   - Customer's own incident history (e.g., INC-2027-0142 for Norvale, INC-2027-0188 for Halcyon, INC-2028-0019 for Cresta, INC-2028-0034 for Talos).
   - Customer's own audit-finding chain where applicable.

2. Public view exposing:
   - Generic Atlas trust statement and certifications.
   - Policy headlines (POL-DATA-v3.1, POL-INCIDENT-v2.0, POL-AIUSE-v1.0).
   - Sub-processor registry (full).

## Customer impact

- Faster sales cycles (compliance-review SLA from 5 days to under 1 day for portal-served items).
- Reduces Customer Success burden during customer audit cycles.

## Cost / risk

- Engineering effort: ~12 sprint-weeks (Marcus Ortiz's organisation, with Atlas Ledger ITGC patterns reused).
- Authentication and authorisation must be airtight — a portal data-leak would be a major incident.

## Open questions

- Should the portal also expose customer-specific Data Processing Agreement language? Recommendation: yes, behind authentication.
- Should the portal integrate with the proposed RoPA modernisation (separate RFC)? Recommendation: yes.

## Cross-references

- RFC — GDPR Article 30 Record of Processing Activities Modernisation
- POL-DATA-v3.1
- POL-SUBPROC-v1.0
- Atlas SOX §404 Position
- Atlas EU AI Act Applicability Position 2028
