---
content_type: escalation
region: noram
title: Escalation — Halcyon TMS Integration Version Mismatch
---

# Escalation · Halcyon TMS Integration Version Mismatch

**Customer:** Halcyon Logistics
**Product:** Atlas Logix
**Primary CSM:** Marcus Ortiz
**Executive sponsor (customer-side):** Devon Brooks, Halcyon Director of Application Integration
**Status:** Closed — patch deployed 2028-06-10

## Trigger

Halcyon's internal Transportation Management System (TMS) was upgraded from v8.3 to v9.0 on 2028-05-22 without prior Atlas coordination. The upgrade broke the Atlas Logix → Halcyon TMS integration on a previously undocumented assumption about shipment-context payload schemas. Halcyon experienced 6 hours of stale routing data before the integration was disabled and a workaround put in place.

No SLA breach (the workaround restored function within SLA window) but customer dissatisfaction was high.

## Marcus Ortiz's handling

Acknowledged within 90 minutes. The action plan:

- Day 1: Convene joint integration triage with Halcyon application team.
- Day 2: Root cause identified — implicit dependency on TMS payload schema v8.x in Atlas Logix integration layer.
- Day 5: Patch designed for Atlas Logix integration layer to support both v8 and v9.
- Day 12: Patch deployed and verified at Halcyon.

## Why this required escalation handling

Devon Brooks raised the broader question of why Atlas hadn't been notified of the TMS upgrade in advance. The honest answer: there was no formal change-coordination mechanism in place between Halcyon's application team and Atlas customer success. The escalation became a customer-success process improvement, not just a patch.

## Outcomes

- Patch deployed 2028-06-10. Halcyon integration stable.
- New joint change-coordination cadence established: weekly 30-minute Atlas-Halcyon change-window review.
- Atlas Logix integration layer now documents external dependency assumptions explicitly.
- Devon Brooks quote: "Marcus's instinct to fix the process, not just the bug, is why we keep extending."

## Related

- `case-study-halcyon-logistics.md`
- `deployment-guide-logix.md`
- `escalation-halcyon-apac-routing-cutover.md`
