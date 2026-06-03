---
content_type: deployment_guide
region: apac
title: Deployment — Talos Steelworks Pulse 8-Unit Pilot
---

# Deployment · Talos Steelworks Pulse 8-Unit Pilot

Customer-specific deployment record for Talos Steelworks' Atlas Pulse 8-unit pilot. Owned by Liam Hayashi. Originally scheduled for Q3 2028; delayed to Q4 2028 per `escalation-talos-pulse-pilot-delay-request.md`.

## Customer profile

- **Customer:** Talos Steelworks
- **Region:** APAC (Japan)
- **CSM:** Liam Hayashi
- **Engineering partner:** Priya Anand
- **Original install date:** Q3 2028 — moved to **Q4 2028 install / Q1 2029 evaluation**.

## Scope

- 8 Atlas Pulse units at Yokohama and Kobe combined.
- Integration with Talos's plant energy-management system.
- Integration with the existing Atlas E-220 generation telemetry.

## Reasoning for delay

Talos's plant engineering team had a major furnace re-lining project consuming bandwidth through August 2028. Hiroshi Tanaka requested the delay; Liam Hayashi granted without commercial penalty (the inventory was re-allocated to Norvale's expansion order — see `escalation-norvale-grid-pilot-prereq.md` neighbour customer).

## MQTT broker architecture

Following the lessons from Norvale's pilot:

- High-availability MQTT broker pair pre-deployed at each Talos site prior to Pulse unit install.
- Failover testing integrated into Phase 2.
- Resilience exercise scheduled for week before Pulse unit commissioning.

## Compliance posture

- No EU AI Act applicability (APAC).
- ISO 27001 aligned (Talos's posture).

## Customer-side executive sponsors

- Hiroshi Tanaka — VP Operations.
- Yui Nakajima — Director of Plant Operations.

## Related

- `escalation-talos-pulse-pilot-delay-request.md`
- `deployment-talos-fieldops-japan.md`
- `deployment-talos-e220-yokohama.md`
- `case-study-talos-steelworks.md`
- `deployment-guide-pulse-utility-scale.md`
