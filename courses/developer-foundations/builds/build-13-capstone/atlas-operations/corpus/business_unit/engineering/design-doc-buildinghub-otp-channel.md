---
content_type: design_doc
region: emea
title: Atlas BuildingHub Over-the-Air Patch Channel v2.0
---

# Atlas BuildingHub Over-the-Air Patch Channel v2.0

**Author:** Priya Anand (VP Engineering)
**Contributors:** Aisha Okonkwo, Aaron Kim
**Reviewer:** Marcus Ortiz
**Status:** Approved post INC-2028-0019
**Version:** 2.0

## Context

INC-2028-0019 (BuildingHub firmware rollback) revealed that the v1.x OTA channel did not adequately stage firmware to a small canary fleet before broad rollout. v2.0 introduces a mandatory canary stage, signed manifests, and a one-click rollback path.

## Design goals

- **Staged rollout.** No firmware reaches >5% of deployed BuildingHub units in under 48 hours from cut.
- **Verifiable manifests.** Every firmware payload is signed; controllers verify before applying.
- **One-click rollback.** Aisha Okonkwo's customer-success team can trigger a fleet-wide rollback within 15 minutes.
- **HIPAA-respecting.** No telemetry collected during OTA includes patient identifiers (Cresta Health Network).

## Architecture

- **Manifest service.** Holds signed manifests, fronts the controller-facing OTA API.
- **Rollout controller.** Enforces canary percentages, dwell times, abort triggers.
- **Telemetry harvester.** Collects per-unit OTA outcome metrics; emits only OTA-relevant fields.
- **Rollback path.** Manifest service can flip the active manifest pointer; controllers re-fetch within 5 minutes.

## Test matrix

| Scenario | Outcome |
|---|---|
| Healthy patch, 10k unit fleet | Canary 5% → 25% → 100% over 14 days |
| Patch fails canary | Auto-abort at 1% failure rate, alert to Priya Anand |
| Customer-requested rollback | Aisha Okonkwo executes within 15 minutes |
| Manifest signature invalid | Controller refuses, logs to telemetry |

## Compliance

- **NIST 800-53 r5 SI-7.** Signed manifests satisfy software integrity.
- **HIPAA.** Telemetry harvester reviewed by Dr Sara Vance; no PHI exposure.
- **POL-INCIDENT-v2.0.** Rollback path is the documented control referenced from INC-2028-0019.

## Related

- INC-2028-0019
- RB-BldHub-Firmware-003
- design-doc-buildinghub-firmware.md
