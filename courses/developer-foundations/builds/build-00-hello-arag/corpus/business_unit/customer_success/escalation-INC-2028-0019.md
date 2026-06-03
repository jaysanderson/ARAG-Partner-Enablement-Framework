---
content_type: escalation
region: emea
title: Customer Escalation Log — Cresta Health Network INC-2028-0019
---

# Customer Escalation Log · Cresta Health Network INC-2028-0019

**Customer:** Cresta Health Network
**Incident:** INC-2028-0019 (BuildingHub firmware regression)
**CSM:** Aisha Okonkwo
**Compliance:** Dr Sara Vance (consulted)
**Status:** Closed

## Day 1 (2028-02-09)

- 14:22 GMT — Cresta facilities team reports unexpected HVAC zone activation at Site 3 (Birmingham).
- 15:48 GMT — Reports replicate at Sites 7 (Manchester) and 11 (Leeds).
- 17:15 GMT — Cresta opens P0 ticket. Aisha Okonkwo paged.
- 19:30 GMT — Atlas engineering investigation initiated. Pattern matches firmware 5.2.1.

## Day 2 (2028-02-10)

- 09:00 GMT — Aisha contacts Cresta head of facilities engineering. Status meeting scheduled for 16:00 GMT.
- 10:30 GMT — Priya Anand's engineering team confirms regression in 5.2.1 cooling-zone scheduling logic.
- 16:00 GMT — Atlas executive meeting with Cresta. Rollback plan presented.
- 16:30 GMT — Dr Sara Vance briefed on HIPAA implications. No patient-data exposure confirmed.

## Day 3-5 (2028-02-11 to 2028-02-13)

- Rollback runbook RB-BldHub-Firmware-003 drafted and reviewed.
- Cresta facilities team coordinated rollback windows for all 14 sites.

## Day 6 (2028-02-14)

- Primary site (Birmingham) rolled back to 5.1.8 firmware. Stable.

## Day 7-13 (2028-02-15 to 2028-02-21)

- All 14 Cresta sites rolled back. Stable.

## Day 14 (2028-02-21)

- Incident closed. Aisha conducts customer post-mortem with Cresta head of facilities.
- Service credits issued — covering 6 sites × 2-4 hours impacted facilities-team workload.

## Lessons

- Cresta head of facilities highly satisfied with response time and Aisha's daily updates.
- Cresta requested formal documentation of the firmware rollback decision. Aisha provided RB-BldHub-Firmware-003 plus the incident report INC-2028-0019.
- Dr Sara Vance's HIPAA review documented for Cresta's internal audit team.

## Related

- INC-2028-0019 (the incident)
- RB-BldHub-Firmware-003 (the runbook)
- AF-2028-007 (the audit finding, closed)
