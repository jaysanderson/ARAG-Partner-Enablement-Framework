---
content_type: proposal
region: noram
title: Proposal — Meridian Bank Atlas Ledger Multi-Market Add-On
---

# Proposal · Meridian Bank Atlas Ledger Multi-Market Add-On

**Customer:** Meridian Bank
**Industry:** Financial Services (NORAM)
**Primary CSM:** Dr Sara Vance
**Status:** Submitted Q2 2028.

## Executive summary

Meridian Bank currently runs Atlas Ledger across 5 markets. This proposal adds 4 markets (Canada, Mexico, UK, Singapore) under a unified multi-market license, with one shared SOX-compliant control plane.

## Scope

| Component | Quantity | Year 1 cost (USD) |
|---|---|---|
| Atlas Ledger market add-ons | 4 | 112,000 |
| Cross-market control-plane license | 1 | 220,000 |
| Implementation services | — | 195,000 |
| Year 1 enterprise support | — | 78,000 |

**Year 1 total before discount: USD 605,000.**
**Discount: 13%.**
**Year 1 contract value: USD 526,350.**

## Compliance posture

- SOX §404 — multi-market control plane preserves single-source-of-truth controls. Dr Sara Vance leads sign-off.
- GDPR — UK addition triggers GDPR controller-processor delineation refresh (similar to the existing Phase 2 Atlas Grid pattern).
- No EU AI Act applicability (Ledger has no AI-decision features in scope).

## Engineering coordination

- Marcus Ortiz consults on cross-market control-plane architecture.
- No incident-history concerns flagged for Ledger; the routing-engine incident (INC-2027-0188) is on the Logix product, not Ledger.

## Why now

- Atlas Ledger Phase 1 + Phase 2 Atlas Grid deal (1,914,360 USD landed) has demonstrated Atlas's ability to deliver in Meridian's data-centre stack.
- Meridian's CFO wants the same audit-resilience properties exported to international subsidiaries before the FY29 audit cycle.

## Risks

- Implementation services capacity in Q3 is tight. Sequencing must avoid colliding with Cresta's BuildingHub rollout.

## Approval

- Account executive — drafted.
- Sales director — pending.
- Dr Sara Vance — compliance endorsement complete.
