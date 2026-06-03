---
content_type: design_doc
region: emea
title: Atlas E-220 Cooling Subsystem Design (v2.1)
---

# Atlas E-220 Cooling Subsystem Design v2.1

**Author:** Priya Anand (VP Engineering)
**Status:** Approved
**Version:** 2.1 (post-INC-2027-0142 review)

## Context

The Atlas E-220 turbine cooling subsystem manages thermal regulation across operational conditions ranging from -25 °C ambient (arctic deployment) through +55 °C ambient (desert deployment). The subsystem is firmware-controlled and consists of three independently-actuated coolant loops with shared redundancy.

## Design goals

- **Cold-start safety.** Turbine must complete cold-start under ambient < 5 °C without entering protective shutdown.
- **Steady-state efficiency.** Cooling power < 2% of turbine output under nominal operating conditions.
- **Fail-safe.** Loss of any single coolant loop → degraded but operational state. Loss of any two → controlled shutdown.

## v2.1 changes (vs v2.0)

Post INC-2027-0142, the cooling firmware sequence was updated:

- Thermal-coefficient lookup tables hand-validated against verified physical data.
- Cold-start sequence now includes ambient-temperature guard.
- Patch deployment process tightened: firmware patches now go through extended cold-environment test matrix.

## Test matrix

| Scenario | Cold-start completes? | Steady-state stable? |
|---|---|---|
| Ambient -25 °C, dry | ✓ | ✓ |
| Ambient 0 °C, wet | ✓ | ✓ |
| Ambient +25 °C, dry | ✓ | ✓ |
| Ambient +55 °C, humid | ✓ | ✓ |

All v2.1 scenarios pass. v2.0 failed Scenario 1 and Scenario 2.

## Compliance

Cooling subsystem design satisfies NIST 800-53 r5 SI-7 (Software Integrity). EU AI Act not applicable (no machine learning in cooling control).

## Owners

- Subsystem owner: Priya Anand
- Firmware lead: Engineering team, dotted-line through Marcus Ortiz for architecture review

## Related

- RB-E220-Cooling-001 (the post-incident runbook)
- INC-2027-0142 (the incident that drove this revision)
