---
content_type: design_doc
region: latam
title: Atlas Pulse Storm Mode v1.0
---

# Atlas Pulse Storm Mode v1.0

**Author:** Priya Anand (VP Engineering)
**Contributors:** Carlos Mendes (LATAM Field Lead), Marcus Ortiz
**Status:** Approved
**Version:** 1.0

## Context

Atlas Pulse is being trialled at a small LATAM utility (non-anchor customer) in a region with frequent tropical storms. The default optimiser behaviour, calibrated against EMEA winter conditions at Norvale Energy sites, performs poorly when load is dominated by sudden post-storm restoration spikes. Storm Mode is a profile that the optimiser can switch into when meteorological feeds indicate an incoming or active storm.

## Design goals

- **Conservative dispatch.** During storm windows, the optimiser prioritises grid stability over economic optimisation.
- **Operator override.** A regional operator can force Storm Mode on or off.
- **Bounded duration.** Storm Mode auto-exits after a configurable dwell time post-storm clearance.
- **EU AI Act-compatible.** Mode switch is a deterministic rule on meteorological inputs, not a learned classifier.

## Architecture

- **Meteorological adapter.** Per-region adapter normalises feeds (NOAA, EUMETNET, INMET) into a common storm-likelihood scalar.
- **Mode controller.** Deterministic threshold + dwell-time state machine.
- **Optimiser switch.** Pulse optimiser reads current mode and selects from Normal / Storm constraint pack.

## Test matrix

| Scenario | Mode | Outcome |
|---|---|---|
| INMET feed: storm imminent | Storm | Constraint pack applied within 60s |
| Storm passes, dwell expires | Normal | Auto-revert |
| Operator forces Storm Mode | Storm | Override logged |
| Meteorological feed down | Normal (failsafe) | Continue in Normal with alert |

## Compliance

- **EU AI Act.** Pulse is in scope per anchors, but Storm Mode uses no ML and is deterministic; covered by Article 6 carve-out for safety-component classical control.

## Related

- design-doc-pulse-smartgrid-optimiser.md
- design-doc-pulse-safety-supervisor.md
- POL-INCIDENT-v2.0
