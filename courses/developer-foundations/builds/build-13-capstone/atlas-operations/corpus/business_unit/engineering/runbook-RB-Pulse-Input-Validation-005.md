---
content_type: runbook
region: emea
title: RB-Pulse-Input-Validation-005 — Pulse Input Validation Tightening
---

# RB-Pulse-Input-Validation-005 · Pulse Input Validation Tightening

**Product:** Atlas Pulse
**Owner:** Priya Anand
**Remediates:** INC-2028-0085

## Background

Pulse 1.3.0 lacked validation on voltage telemetry inputs below a threshold known to occur during routine grid maintenance windows. The optimisation engine treated these inputs as nominal and produced unusual recommendations.

## Resolution

Pulse 1.3.1 (released 2028-04-30) adds explicit input validation:

- Voltage telemetry inputs below 0.6 of nominal are treated as missing-data, not nominal-data.
- The optimisation engine returns "insufficient data" for these intervals, not a positive recommendation.

## Steps

1. Verify Pulse version (`pulse --version`).
2. If on 1.3.0, upgrade to 1.3.1 during maintenance window.
3. Verify input validation by replaying a historical low-voltage interval — engine should return "insufficient data".

## Affected customers

- Norvale Energy (primary Pulse pilot) — patched 2028-04-30.

## Compliance

EU AI Act applicability satisfied: input validation is a documented safeguard in the customer's applicability statement.
