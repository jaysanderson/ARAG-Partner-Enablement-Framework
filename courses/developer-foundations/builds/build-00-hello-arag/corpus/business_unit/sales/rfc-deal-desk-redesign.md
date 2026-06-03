---
content_type: rfc
region: noram
title: RFC — Atlas Deal-Desk Redesign FY29
---

# RFC · Atlas Deal-Desk Redesign FY29

**Status:** Draft for comment.
**Authors:** VP Sales + Sales Operations.
**Reviewers:** Priya Anand, Dr Sara Vance, Aisha Okonkwo, Liam Hayashi, Marcus Ortiz, CFO.

## Problem statement

The current deal-desk model treats all discount approvals as a uniform queue. As Atlas's portfolio has grown to 8 products and the strategic-customer overrides have multiplied (pricing-strategic-customers-2028.md), the queue depth has grown from a 2-day median to a 7-day median over the past 12 months. The Pulse-Grid promo (pricing-pulse-grid-bundle-promo-q3.md) and the Norvale MSA refresh (proposal-norvale-multi-year-msa-refresh.md) both required out-of-band escalation, which is not sustainable.

## Proposed change

Restructure the deal desk along three lanes:

1. **Standard lane.** AE-authority and sales-director-authority discounts, automated routing, 24-hour median SLA.
2. **Strategic-customer lane.** Pre-cleared overrides per pricing-strategic-customers-2028.md, with VP-Sales fast-track approval.
3. **Engineering-touched lane.** Any deal that requires sign-off from Priya Anand / Marcus Ortiz / Dr Sara Vance (for compliance scope) / Aisha Okonkwo / Liam Hayashi routes through a dedicated weekly forum, not the standard queue.

## Why now

- The Norvale MSA refresh, Talos third-site E-220, Cresta Aura expansion, and Meridian Multi-Market Add-On are all in flight concurrently. Queue contention is forecast to worsen in Q3.
- The Pulse-Grid promo has a 30 September 2028 deadline. Standard-lane queue depth would risk losing 1-2 deals to timing.

## What is in scope

- Lane-routing logic.
- Per-lane SLAs and escalation paths.
- A revised deal-desk dashboard surfacing queue depth by lane.

## What is out of scope

- Changes to POL-PRICING-v4.0. Discount thresholds remain unchanged.
- Changes to service-credit funding (pricing-service-credit-framework.md).

## Open questions

1. Should the strategic-customer lane have a single VP-Sales approver, or should each CSM hold the equivalent authority for their account?
2. Should engineering-touched deals be triaged by deal size as well as by engineering-sign-off requirement?
3. Should the pricing-strategic-customers-2028.md document be refactored as machine-readable input to the routing logic, or maintained as the human-readable reference it is today?

## Risks

- Lane proliferation could create new queue-contention modes if the cross-lane workload is mis-balanced.
- Strategic-customer lane risks becoming an exception-routing path that hides genuinely-novel deals from VP-Sales visibility.

## Decision deadline

Comments by 30 June 2028. Decision at the Q3 Sales Leadership Forum.
