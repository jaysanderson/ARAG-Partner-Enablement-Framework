---
content_type: deployment_guide
region: noram
title: Atlas Logix Deployment Guide
---

# Atlas Logix Deployment Guide

Used by Marcus Ortiz's team for every Atlas Logix deployment.

## Phase 1 — Discovery (Weeks 1-2)

- Traffic shape analysis. Atlas needs at least 2 weeks of historical shipment volume + concurrency data.
- Customer ops team training (8 hours, on-site).

## Phase 2 — Installation (Weeks 3-5)

- Atlas Logix routing engine installation (engineering-led; Marcus Ortiz on-call).
- Integration with customer's TMS (Transportation Management System).
- **Version pinning:** deploy on the current known-good version (Atlas Logix 4.8.0 as of Q2 2028). Do NOT deploy 4.7.0-4.7.2 per RB-Logix-MemLeak-002.

## Phase 3 — Cutover (Week 6)

- Parallel run with the legacy routing engine for 7 days.
- Comparison reporting daily.
- Cutover sign-off from customer Director of Transportation.

## Phase 4 — Verification (Weeks 7-10)

- 30-day reliability monitoring.
- Quarterly business review with Marcus Ortiz.

## Reference deployments

- Halcyon Logistics — see `case-study-halcyon-logistics.md`.

## Escalation

- Customer-side issues: route through Marcus Ortiz.
- Performance regressions: Marcus + L3 on-call.
