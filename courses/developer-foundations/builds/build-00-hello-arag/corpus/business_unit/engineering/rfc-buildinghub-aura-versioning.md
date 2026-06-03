---
content_type: rfc
region: noram
title: RFC — BuildingHub / Aura Independent Versioning
---

# RFC · BuildingHub / Aura Independent Versioning

**Authors:** Marcus Ortiz, Aisha Okonkwo, Priya Anand
**Status:** Approved
**Open period:** 2027-Q4 (comments closed)

## Summary

INC-2028-0019 (BuildingHub firmware rollback) cascaded into Aura because the Aura HVAC scheduler was tightly coupled to BuildingHub firmware versions. This RFC proposes a versioning contract that lets the two products release independently.

## Proposal

- BuildingHub publishes an Occupancy Feed Contract (see design-doc-buildinghub-occupancy-feeds.md) with explicit `contract_version`.
- Aura supports contract versions `>= 1.0` for at least 18 months from publication.
- Each product runs its own release calendar, gated on its own integration tests.
- A cross-product compatibility matrix is published quarterly.

## Why this matters

- BuildingHub is a firmware product; release cadence is constrained by field testing and customer maintenance windows.
- Aura is a SaaS product; release cadence is weekly.
- Coupling Aura's cadence to BuildingHub's strangles Aura. Coupling BuildingHub's to Aura's destabilises BuildingHub.

## Compliance

- **POL-INCIDENT-v2.0.** Coupling was identified as a contributing factor in INC-2028-0019.
- **HIPAA.** No HIPAA implications.

## Customer impact

- **Cresta Health Network.** Primary beneficiary — has been blocked on Aura features waiting for BuildingHub firmware releases. Decoupling removes the block.
- **Norvale Energy.** Minor BuildingHub footprint at HQ; no Aura usage.

## Related

- INC-2028-0019
- design-doc-buildinghub-occupancy-feeds.md
- design-doc-aura-hvac-scheduler.md
