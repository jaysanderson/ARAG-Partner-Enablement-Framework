---
content_type: design_doc
region: emea
title: Atlas BuildingHub Occupancy Feed Contract v1.2
---

# Atlas BuildingHub Occupancy Feed Contract v1.2

**Author:** Aisha Okonkwo (Director, Customer Success — Engineering Liaison)
**Engineering owner:** Priya Anand
**Reviewer:** Marcus Ortiz
**Status:** Approved
**Version:** 1.2

## Context

The Atlas BuildingHub controller emits an occupancy feed that downstream products (notably Atlas Aura, the HVAC scheduler) consume. Historically the feed contract was implicit: each Aura release was coupled to a specific BuildingHub firmware version, which contributed to the cascade in INC-2028-0019. This document formalises the contract so the two products can release on independent cadences.

## Design goals

- **Versioned contract.** Occupancy feed emits a `contract_version` field every payload.
- **Backwards compatibility.** Aura accepts contract versions `>= 1.0` for at least 18 months after publication.
- **Privacy minimisation.** Zone-level counts only; no PII or device identifiers (HIPAA-compatible for Cresta Health Network).
- **Failure transparency.** Aura visibly degrades to schedule-without-occupancy mode if the feed lapses for >60 seconds.

## Schema

```json
{
  "contract_version": "1.2",
  "building_id": "<UUID>",
  "zone_id": "<UUID>",
  "occupancy_count": 12,
  "occupancy_window_seconds": 300,
  "emitted_at": "2028-04-12T13:45:00Z"
}
```

## Compliance posture

- **HIPAA.** No PHI in payload. Cresta Health Network reviewed and signed off.
- **GDPR.** No personal data; counts are aggregates.
- **EU AI Act.** Not in scope (no automated decision-making in this feed).

## Failure modes

| Failure | Aura behaviour | BuildingHub behaviour |
|---|---|---|
| Feed silent | Schedule without occupancy after 60s | Continue, no impact |
| Feed schema invalid | Reject, alert | Log, attempt re-emit |
| Contract version unknown | Aura logs, falls back | Atlas-side support ticket |

## Related

- design-doc-buildinghub-firmware.md
- design-doc-aura-hvac-scheduler.md
- INC-2028-0019
