---
content_type: incident
region: emea
title: INC-2028-0085 — Pulse Smart-Grid Optimization Anomaly
---

# INC-2028-0085 · Pulse Smart-Grid Optimization Anomaly

**Product:** Atlas Pulse
**Severity:** P2
**Detected:** 2028-04-18 at Norvale Energy Pulse pilot
**Closed:** 2028-05-02
**Owner:** Priya Anand

## Summary

The Atlas Pulse smart-grid optimisation feature recommended switching grid topology at an unusual time during an off-peak window at Norvale Energy. Investigation traced the recommendation to a corner case in the ML model's input feature normalisation when the customer's voltage telemetry dropped briefly below threshold.

No customer impact: the recommendation was reviewed by Norvale's operations team and not actioned. Atlas tightened the input-feature validation in Pulse 1.3.1.

## Customer impact

- Norvale Energy — none. Operations team caught the recommendation in pre-action review.

## Compliance

- EU AI Act applicability flagged. Dr Sara Vance reviewed; no customer-side data subject impact. Filed under Atlas applicability statement.

## Lessons

- Input-feature validation now tested against historical voltage anomalies from Norvale's telemetry.
- Customer operations team review remains the safety net.
- Pulse 1.4 (Q3 2028) will add a self-confidence score on every recommendation.
