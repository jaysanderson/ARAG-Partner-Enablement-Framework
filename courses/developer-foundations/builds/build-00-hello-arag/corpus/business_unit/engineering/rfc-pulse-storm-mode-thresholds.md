---
content_type: rfc
region: latam
title: RFC — Pulse Storm Mode Activation Thresholds
---

# RFC · Pulse Storm Mode Activation Thresholds

**Authors:** Carlos Mendes (LATAM Field Lead), Priya Anand
**Status:** Approved
**Open period:** 2028-Q2 (comments closed)

## Summary

Atlas Pulse Storm Mode (see design-doc-pulse-storm-mode.md) requires per-region activation thresholds. This RFC proposes the initial threshold set for the LATAM pilot region and a process for region operators to tune them.

## Proposal

Initial LATAM thresholds (INMET feed):

- **Activation:** P(storm in next 4h) > 0.65 OR active severe weather warning within 50km of any site.
- **Deactivation:** P(storm in next 4h) < 0.20 AND no active warning, sustained 60 minutes.
- **Dwell time post-deactivation:** 2 hours before optimiser fully returns to economic-dispatch mode.

EMEA and NORAM thresholds will follow once feeds are integrated; Norvale Energy is the likely first non-LATAM Storm Mode adopter.

## Process for tuning

- Region operator can request threshold changes via the Pulse admin UI.
- Changes require sign-off by Priya Anand and Marcus Ortiz.
- All changes audit-logged.

## Compliance

- **EU AI Act.** Thresholds are deterministic; carve-out for safety-component classical control applies.
- **POL-INCIDENT-v2.0.** Storm Mode activation is not an incident, but mode entry/exit is logged.

## Related

- design-doc-pulse-storm-mode.md
- design-doc-pulse-safety-supervisor.md
- design-doc-pulse-smartgrid-optimiser.md
