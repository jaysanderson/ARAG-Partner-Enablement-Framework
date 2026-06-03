---
content_type: deployment_guide
region: emea
title: Deployment — Norvale Pulse MQTT Broker Architecture
---

# Deployment · Norvale Pulse MQTT Broker Architecture

Customer-specific deployment record covering the MQTT broker architecture deployed at Norvale Energy in support of the Atlas Pulse pilot. Authored after `escalation-norvale-pulse-pilot-stall.md` to document the now-standard high-availability pattern.

## Background

The Atlas Pulse 4-unit pilot at Norvale was deployed with a single MQTT broker in early 2028. On 2028-04-17, a broker partition caused a 14-hour telemetry-gap escalation. As a direct consequence, Atlas committed to ship an MQTT broker high-availability reference architecture; that architecture was first deployed at Norvale.

## Architecture summary

- MQTT broker pair: active + standby.
- Geographic separation: primary at Rotterdam control room, secondary at Antwerp.
- Failover detection: 30-second heartbeat with 90-second failover trigger.
- Pulse-unit-side client configuration: dual broker URI list, automatic reconnection.
- Telemetry backfill: on broker failover, gap-fill from local Pulse-unit buffer (24-hour buffer capacity).

## Cutover

- 2028-05-22: HA broker pair deployed at Norvale.
- 2028-05-25: Failover testing completed.
- 2028-05-30: Resilience exercise executed in coordination with Helga Vandermark's operations team.

## Outcomes

- No telemetry-gap recurrence since deployment.
- Reference architecture now standard for all Atlas Pulse customer deployments.
- See `deployment-guide-pulse-utility-scale.md` Phase 2 for the generalised guidance.

## Customer-side operations

- Helga Vandermark — VP Generation Assets (sponsor).
- Norvale's Rotterdam operations centre operates the MQTT broker pair on Atlas's behalf, with Atlas APAC + EMEA on-call rotation for escalation.

## Related

- `escalation-norvale-pulse-pilot-stall.md`
- `deployment-norvale-pulse-pilot.md`
- `deployment-guide-pulse-utility-scale.md`
