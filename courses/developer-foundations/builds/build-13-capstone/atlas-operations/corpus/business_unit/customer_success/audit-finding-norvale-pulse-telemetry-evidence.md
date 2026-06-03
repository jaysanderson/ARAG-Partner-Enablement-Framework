---
content_type: audit_finding
region: emea
title: Audit Finding AF-2028-019 — Norvale Pulse Telemetry-Gap Regulator Coordination (closed)
---

# Audit Finding · AF-2028-019 — Norvale Pulse Telemetry-Gap Regulator Coordination

**Finding ID:** AF-2028-019
**Customer-context:** Norvale Energy
**Owning function:** Customer Success (Priya Anand), with Compliance support (Dr Sara Vance)
**Regulation:** EU AI Act + Dutch national energy-regulator reporting framework
**Status:** Closed 2028-05-10

## Background

On 2028-04-17, Norvale's Atlas Pulse telemetry stream experienced a 14-hour broker partition. No generation impact occurred, but Norvale missed a regulatory submission window with the Dutch energy regulator because the dashboard data was unavailable.

The Atlas customer-success function's initial response did not include a structured coordination with the regulator-side communication that Norvale subsequently had to handle.

## Finding

Atlas's incident-handling process for customer-side regulatory reporting events did not have a defined Atlas-side coordination role.

## Severity

Medium-high. The finding does not represent a regulatory breach by Atlas. It does represent a gap in Atlas's customer-success function's ability to support the customer during a customer-side regulatory event.

## Remediation

1. Priya Anand and Dr Sara Vance co-authored a customer-side regulatory-event coordination protocol, now part of POL-INCIDENT-v2.0 v2.0.
2. The protocol assigns an Atlas-side regulatory-coordination lead during any customer-side regulator-visible incident.
3. The protocol requires Atlas to offer (not impose) regulator-side communication support to the affected customer.

## Closure verification

- 2028-05-10: Norvale's regulatory affairs team accepted the protocol.
- 2028-05-17: 30-day Pulse stability report incorporated regulator-style evidence framing.

## Lessons captured

- Customer-side regulatory events can become customer-success incidents even when no Atlas-side regulatory breach has occurred.
- Compliance and customer-success functions need a shared protocol for customer-side regulator-visible events.
- Pre-emptive offer of regulator-side support is a relationship-deepener, not an over-reach.

## Related

- `escalation-norvale-pulse-pilot-stall.md`
- `deployment-norvale-pulse-mqtt-architecture.md`
- POL-INCIDENT-v2.0 (v2.0)
- `case-study-norvale-pulse-expansion.md`
