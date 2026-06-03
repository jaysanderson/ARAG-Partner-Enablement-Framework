---
content_type: deployment_guide
region: emea
title: Sales Deployment Guide — Pulse-Grid Bundle
---

# Sales Deployment Guide · Pulse-Grid Bundle

**Audience:** Account executives, sales engineers, CSMs working a Pulse-Grid bundle opportunity.
**Companion to:** pricing-pulse-grid-bundle-promo-q3.md, pricing-multi-product-bundles.md.

## When to lead with this bundle

- Existing Atlas E-220 customer with multi-site generation footprint.
- Customer has expressed interest in storage and/or distribution-side modernisation.
- Customer's regulator-side stance on AI-decision features is favourable (Pulse + Grid both have optimisation features in scope).

## Reference customers

- Norvale Energy (Priya Anand) — Pulse pilot converting, Grid POC submitted.
- Talos Steelworks (Liam Hayashi) — Pulse Year-1 in flight, Grid Y2 SOW drafted.
- Meridian Bank (Dr Sara Vance) — Phase 2 Grid + Phase 1 Pulse data-centre context.

## Engineering ownership

- Pulse product owner: Priya Anand (VP Engineering).
- Grid product architecture: Marcus Ortiz (Principal Architect).
- Integration adapter (Pulse-Grid) is a standardised pattern with deployment runbook maintained by Marcus Ortiz's team.

## Compliance steps

1. Pre-quote: confirm EU AI Act applicability with Dr Sara Vance (limited-risk tier expected; document the assessment).
2. If customer is NORAM and federal/state: invoke NIST 800-53 r5 review with Dr Sara Vance.
3. Confirm no SOX overlap (Pulse and Grid generally do not touch financial systems unless deployed in a Ledger-adjacent data-centre context — see proposal-meridian-aura-data-centre-cooling.md for the precedent).

## Commercial mechanics

- Apply per-product pricing per the regional book (pricing-emea-2028.md, pricing-noram-2028.md, pricing-apac-2028.md, pricing-latam-2028.md).
- Layer the multi-product bundle add-on (pricing-multi-product-bundles.md), capped at 30% combined.
- If within the Q3 2028 promotion window, layer the promo discount (pricing-pulse-grid-bundle-promo-q3.md).
- Pilot pricing applies if the customer is a non-production customer for either product (pricing-pilot-program-framework.md).

## Implementation services sizing

- Pulse: ~25 person-days per unit (delivery), tapering at fleet of 8+.
- Grid: ~32 person-days per unit (delivery), tapering at fleet of 4+.
- Pulse-Grid integration adapter: ~30 person-days fixed, regardless of fleet size.

## Common objections + responses

- "Vendor B's Pulse-equivalent is cheaper." Respond with the integrated Pulse-Grid story and the Norvale/Talos references.
- "Why two products from the same vendor?" Respond with the integration depth and the single accountability chain (Priya Anand + Marcus Ortiz).
- "We don't have an E-220 fleet." Pulse-Grid bundle still applies but without the loyalty discount; AE should size expectations accordingly.

## Service-credit framing

If a customer raises operational-risk concerns, reference INC-2027-0142 handling (case-study-talos-cooling-incident-handling.md) and the service-credit framework (pricing-service-credit-framework.md) as evidence of Atlas's operational seriousness.
