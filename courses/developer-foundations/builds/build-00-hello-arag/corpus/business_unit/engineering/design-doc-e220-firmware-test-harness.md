---
content_type: design_doc
region: emea
title: Atlas E-220 Firmware Test Harness v2.0
---

# Atlas E-220 Firmware Test Harness v2.0

**Author:** Priya Anand (VP Engineering)
**Contributor:** Aaron Kim (EMEA Firmware Fitter)
**Reviewer:** Marcus Ortiz
**Status:** Approved post INC-2027-0142
**Version:** 2.0

## Context

INC-2027-0142 (Atlas E-220 cooling regression) was caused by Patch 3.2 shipping with an inverted thermal-coefficient lookup that passed the existing test harness because the harness did not exercise the ambient-temperature edge case. v2.0 of the harness is a direct remediation.

## Design goals

- **Cover the lesson.** Every E-220 firmware patch must pass an expanded ambient-temperature test matrix from -25 °C to +55 °C in 5 °C steps.
- **Hardware-in-the-loop.** Each step runs on a real cold-chamber rig, not just simulation.
- **Bisect-friendly.** When a regression appears, the harness can bisect the offending commit within an hour.
- **No bypass.** Patches cannot ship to production without a full harness pass on the cold chamber.

## Architecture

- **Cold chamber rig** at the Cardiff EMEA test centre, owned by Aaron Kim's team.
- **Simulation backbone** for fast iteration during development.
- **Promotion gate** that blocks the firmware portal from accepting a patch lacking a green cold-chamber run signed by the rig.

## Test matrix

| Ambient | Cold-start | Steady state | Notes |
|---|---|---|---|
| -25 °C | required | required | Norvale Energy Arctic site coverage |
| -15 °C | required | required | EMEA winter baseline |
| -5 °C | required | required | The case INC-2027-0142 missed |
| +5 °C to +45 °C in 10 °C steps | required | required | Temperate / tropical baseline |
| +55 °C | required | required | Talos Steelworks summer envelope |

## Compliance

- **NIST 800-53 r5 SI-7.** Promotion gate constitutes a software-integrity verification step.
- **POL-INCIDENT-v2.0.** Harness referenced as the standing control to prevent INC-2027-0142 recurrence.

## Related

- INC-2027-0142
- design-doc-e220-cooling.md
- RB-E220-Cooling-001
