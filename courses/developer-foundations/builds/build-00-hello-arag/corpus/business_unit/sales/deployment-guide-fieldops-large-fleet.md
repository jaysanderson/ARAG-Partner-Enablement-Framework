---
content_type: deployment_guide
region: noram
title: Sales Deployment Guide — FieldOps Large-Fleet Engagements
---

# Sales Deployment Guide · FieldOps Large-Fleet Engagements

**Audience:** AEs and CSMs working a FieldOps engagement at 500+ devices.
**Companion to:** pricing-noram-2028.md (FieldOps section), pricing-multi-product-bundles.md.

## When this guide applies

- Customer device fleet projected ≥500 devices, OR
- Customer is a renewal-cycle case where the existing fleet is ≥500 devices, OR
- Customer is multi-site/multi-region with single-contract scope.

## Reference customers

- Halcyon Logistics (Marcus Ortiz) — 2,400 devices, 14 hubs, 3-year renewal in progress.
- Talos Steelworks (Liam Hayashi) — 640 devices, two production sites, third site (Yard C) added in proposal-talos-fieldops-renewal.md.

## Engineering ownership

- FieldOps platform owner: Liam Hayashi (Head of Field Operations).
- Logix integration architect: Marcus Ortiz.
- Ledger integration architect: Marcus Ortiz consults; Dr Sara Vance signs off compliance scope.

## Operational lessons priced in

- INC-2028-0034 (FieldOps offline-sync corruption) closed via RB-FieldOps-Sync-004. The post-incident stable release has been operating cleanly for two quarters.
- Tighter sync-reliability SLAs (99.5%+) are negotiable at large-fleet scale; Liam Hayashi signs off the SLA commitment.

## Commercial mechanics

- Per-device pricing per regional book.
- Annual prepay required for the standard discount; non-prepay deals carry a 4-point premium.
- Large-fleet customers may negotiate a fleet-rate lock-in (precedent: Halcyon's locked USD 250/device/month rate through 31 December 2031).
- Managed-service tier is a separate line; Talos's renewal added the tier as a post-INC-2028-0034 confidence-building investment.

## Implementation services sizing

- Per-hub setup: 12-18 person-days depending on integration depth.
- Atlas Logix adapter (where applicable): 25 person-days fixed.
- Atlas Ledger adapter (where applicable): 35 person-days fixed.

## Compliance posture

- NIST 800-53 r5 — FieldOps has standing coverage; per-deployment reaffirmation handled by Dr Sara Vance.
- GDPR — applies if customer fleet includes EU drivers; controller-processor delineation refreshed per deployment.
- EU AI Act — out of scope (FieldOps does not contain AI-decision features in the standard configuration).

## Common objections + responses

- "Vendor A is cheaper per device." Respond with the integration depth, the Halcyon USD 4.1M FY27 savings story (case-study-halcyon-fieldops-fy27-savings.md), and the post-INC-2028-0034 SLA tightening.
- "Our incumbent has multi-year switching cost." Respond with the 90-day on-site enablement included in implementation services and the multi-product bundle discount available if FieldOps lands as a second Atlas product.

## Service-credit framing

INC-2028-0034 service-credit treatment (CS budget) is documented; reference the Talos and Norvale handling as the precedent.
