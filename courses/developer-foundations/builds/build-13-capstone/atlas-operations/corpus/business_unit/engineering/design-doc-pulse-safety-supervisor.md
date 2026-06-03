---
content_type: design_doc
region: emea
title: Atlas Pulse Safety Supervisor — Static Clamp Design
---

# Atlas Pulse Safety Supervisor — Static Clamp Design

**Author:** Priya Anand (VP Engineering)
**Reviewer:** Marcus Ortiz
**Status:** Approved
**Version:** 1.0

## Purpose

The Safety Supervisor is the last line of defence between the Atlas Pulse optimiser and the customer's physical inverters. Its job is to ensure that no dispatch decision — regardless of whether it originated from the MILP solver, the learned residual model introduced in Pulse v3.0, or a manual operator override — can violate inverter thermal limits or local grid-code envelopes.

## Threat model

We assume the optimiser can produce decisions that are:

- **Unsafe by model error.** Residual MLP outputs outside training distribution.
- **Unsafe by data corruption.** Forecast feed corrupted in transit.
- **Unsafe by operator error.** Site engineer enters a manual setpoint outside envelope.
- **Unsafe by intent.** Compromised credentials issue malicious dispatch.

The Safety Supervisor must reject all four categories without trusting the source.

## Design

A static, fully-deterministic rule layer between the dispatch layer and the inverter telemetry bus. The Supervisor:

1. Consumes the proposed setpoint and the current inverter telemetry.
2. Compares against per-inverter envelope tables published by the OEM, plus per-site grid-code overlays.
3. Clamps the setpoint to the nearest in-envelope value. Logs the clamp event.
4. Emits a Pulse health-bus event if more than 1% of decisions are clamped in any 5-minute window.

## Failure modes addressed

This design directly addresses the lesson from INC-2027-0188 (Logix routing memory leak): we cannot trust optimisation outputs to be safe by construction.

## Verification

- Conformance test suite ships with the Supervisor — 1,400 scenario vectors.
- Annual independent review by Atlas L3 architecture board (Marcus Ortiz).
- NIST 800-53 r5 SI-7 control reviewed by Dr Sara Vance.

## Owners

- Subsystem owner: Priya Anand
- Architecture review: Marcus Ortiz

## Related

- design-doc-pulse-smartgrid-optimiser.md
- POL-INCIDENT-v2.0
