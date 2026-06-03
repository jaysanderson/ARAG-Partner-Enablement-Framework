---
content_type: escalation
region: emea
title: Escalation — Norvale Energy Pulse Pilot Telemetry Gap
---

# Escalation · Norvale Energy Pulse Pilot Telemetry Gap

**Customer:** Norvale Energy
**Product:** Atlas Pulse (4-unit pilot)
**Primary CSM:** Priya Anand
**Executive sponsor (customer-side):** Helga Vandermark, VP Generation Assets
**Status:** Closed (downgraded from P1 to P3 after stabilisation)

## Trigger

On 2028-04-17 Norvale's renewables operations centre in Rotterdam observed a 14-hour outage in the Pulse telemetry stream feeding their internal ESG dashboards. No generation impact — but the dashboard gap caused a missed regulatory submission window with the Dutch energy regulator.

## Day-by-day

| Date | Event |
|---|---|
| 2028-04-17 09:42 CET | Helga Vandermark emails Priya Anand directly |
| 2028-04-17 10:30 CET | Priya pages the Atlas Pulse engineering on-call |
| 2028-04-17 13:00 CET | Root cause identified as MQTT broker partition; not Atlas-side |
| 2028-04-18 08:00 CET | Priya joins Norvale's 09:00 Helga-chaired operations standup in person |
| 2028-04-19 | Pulse telemetry reprocessing complete, all data backfilled |
| 2028-04-22 | Norvale formally accepts post-mortem |

## Why this matters

Norvale is the lead-customer reference for Atlas Pulse expansion in 2029. A regulator-visible miss in the pilot phase could have killed the 12-unit expansion. Priya's visible accountability — turning up in person on Day 2 — preserved the relationship.

## Outcomes

- Service credits: EUR 38,000 (covering the impacted reporting cycle).
- Atlas committed to delivering an MQTT-broker high-availability reference architecture by end of Q3 2028.
- Helga's quote in her internal Norvale post-mortem: "Atlas treated this like it was their regulatory exposure, not ours."
- POL-INCIDENT-v2.0 (escalation timing requirements) referenced and adhered to throughout.

## Related

- Atlas Pulse pilot kickoff doc (`deployment-norvale-pulse-pilot.md`)
- Norvale case study (`case-study-norvale-energy.md`)
- Audit finding AF-2028-019 (regulator coordination), closed 2028-05-10
