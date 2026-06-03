---
content_type: deployment_guide
region: emea
title: Atlas Pulse Utility-Scale Deployment Guide
---

# Atlas Pulse Utility-Scale Deployment Guide

Reference deployment guide for Atlas Pulse at utility-scale generation customers. Authored by Priya Anand's engineering-led customer success function. First-of-product deployment is Norvale Energy's 4-unit pilot.

## Phase 1 — Site survey and modelling (Weeks 1-4)

- Generation asset inventory (turbines, solar arrays, storage banks).
- Telemetry pathway design.
- Modelling baseline data acquisition (minimum 90 days of historical operational telemetry).
- Joint Atlas-customer engineering steering committee chartered.

## Phase 2 — MQTT broker architecture (Weeks 5-6)

- High-availability MQTT broker pair deployed at customer site.
- Failover testing.
- Resilience exercise. (This phase was added as a direct lesson from `escalation-norvale-pulse-pilot-stall.md`.)

## Phase 3 — Pulse unit installation (Weeks 7-10)

- Pulse units delivered through Atlas's EMEA fulfilment hub.
- Per-unit install time: 2 days on-site.
- Customer engineering team training (12 hours per pilot cohort).

## Phase 4 — Pilot operations (Weeks 11-22)

- 12-week structured pilot.
- Weekly engineering steering committee with Priya Anand.
- Monthly executive readout to customer VP-level sponsor.
- Telemetry continuity verified weekly.

## Phase 5 — Expansion decision (Week 23+)

- Pilot retrospective with customer's investment committee.
- Expansion proposal scoped.

## Compliance considerations

- EU AI Act applicability statement required for any Pulse smart-grid optimisation features at EMEA customers. Owned by Dr Sara Vance.
- Customer-side data-residency policy must be honoured for telemetry.

## Reference deployments

- Norvale Energy — 4-unit pilot live as of Q2 2028; expansion to 12 units planned 2029.

## Escalation

- Operational issues: route through Priya Anand (engineering-led relationship).
- Compliance: route through Dr Sara Vance.

## Related

- `escalation-norvale-pulse-pilot-stall.md`
- `escalation-norvale-grid-pilot-prereq.md`
- `case-study-norvale-energy.md`
