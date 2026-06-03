---
content_type: deployment_guide
region: noram
title: Sales Deployment Guide — Atlas Ledger in Banking
---

# Sales Deployment Guide · Atlas Ledger in Banking

**Audience:** AEs and sales engineers pursuing Atlas Ledger in banking and financial services.
**Reference customer:** Meridian Bank.

## When this guide applies

- Prospect is a bank, asset manager, insurer, or other regulated financial-services entity.
- Prospect operates in NORAM, EMEA, or APAC. (LATAM Ledger is not currently sold.)
- Prospect is in or approaching a SOX §404 audit cycle (NORAM) or equivalent control regime (EMEA, APAC).

## Reference customer details

Meridian Bank — Atlas Ledger live in 5 markets, 4-market multi-market add-on proposed (proposal-meridian-ledger-multi-market.md). Primary CSM Dr Sara Vance. Vendor B displaced in 2025 (case-study-vendor-b-displacement-meridian.md).

## Lead messaging

- No SOX surcharge (vs Vendor B's historic ~12%). This is the lighthouse differentiator.
- Audited control-plane that aligns with the customer's existing chart of accounts.
- Multi-market control plane preserves single-source-of-truth controls.

## Engineering ownership

- Ledger product owner: Dr Sara Vance (cross-BU — she's CCO, but the Ledger product accountability sits with her).
- Architecture consultation: Marcus Ortiz.

## Compliance posture

- SOX §404 — Atlas Ledger's standing posture; reference pricing-public-sector-supplement.md for the deployment shape.
- GDPR — applies whenever any market touches EU data; controller-processor delineation refreshed per market addition.
- EU AI Act — currently not applicable (Ledger has no AI-decision features in scope).

## Commercial mechanics

- Base license + per-market license per regional book.
- Multi-market customers may secure a locked per-market rate (precedent: Meridian's locked USD 28,000 per market through FY29).
- Multi-product bundle discount applies if Ledger lands with Grid / Pulse / Aura at the same customer (precedent: Meridian's 4-product portfolio).

## Implementation services sizing

- Per-market Ledger deployment: 40-55 person-days depending on legacy-system integration depth.
- Cross-market control-plane setup: 60 person-days fixed.

## What to avoid

- Quoting Ledger into LATAM (not currently supported).
- Promising compliance-side guarantees that haven't been signed off by Dr Sara Vance for the specific deployment shape.
- Over-promising migration speed; banking migrations are slow by nature, and Atlas's credibility depends on respecting the customer's audit calendar.

## Companion documents

- case-study-meridian-ledger-rollout.md
- case-study-meridian-sox-deployment-pattern.md
- case-study-vendor-b-displacement-meridian.md
- proposal-meridian-bank.md
- proposal-meridian-ledger-multi-market.md
- battlecard-meridian-bank.md
