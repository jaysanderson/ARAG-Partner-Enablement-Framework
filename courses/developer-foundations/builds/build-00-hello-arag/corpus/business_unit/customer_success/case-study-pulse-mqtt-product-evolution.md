---
content_type: case_study
region: emea
title: Case Study — Pulse MQTT Architecture Product Evolution
---

# Case Study · Pulse MQTT Architecture Product Evolution

**Customer that triggered:** Norvale Energy
**Region:** EMEA
**Primary CSM:** Priya Anand
**Programme:** Customer-pain to product-standard transition

## The pattern

Atlas Pulse shipped initially with a single-MQTT-broker reference architecture. This was an Atlas engineering decision based on simplicity-first design principles. It worked in the early customer environment until 2028-04-17, when the broker partition at Norvale caused a 14-hour telemetry-gap escalation.

The Atlas Pulse engineering team, prompted by Priya Anand's customer commitment, designed an MQTT broker high-availability reference architecture in 5 weeks. It was first deployed at Norvale on 2028-05-22, and within 90 days became the default reference architecture for all Atlas Pulse customer deployments.

## What changed in the product organisation

- The Atlas Pulse deployment guide (`deployment-guide-pulse-utility-scale.md`) was rewritten to require a high-availability MQTT broker pair in Phase 2.
- The customer-side resilience exercise (now standard in Phase 2) was added.
- Pulse-unit-side firmware updated to support dual-broker URI lists and automatic reconnection.
- Sales materials updated to make the HA architecture an explicit commitment, not an upsell.

## Why this matters as a customer-success case study

This is the textbook customer-pain → product-evolution loop. Without Priya Anand's personal commitment to Helga Vandermark on Day 2 of the escalation, the product change would have been a 2029 roadmap item. With Priya's commitment, the change shipped in Q2 2028.

## The cost-benefit at Atlas

- 5 weeks of engineering effort (1 senior engineer, 2 mid-level engineers).
- Cost: ~USD 180,000 fully-loaded.
- Benefit: Norvale 12-unit expansion (2029) protected. Plus same architecture now standard for all future Pulse customers.

## Lessons captured

- Customer-success commitments made during escalations are product-organisation contracts, not customer-organisation aspirations.
- Reference architectures evolve in response to customer pain — and that is healthy, not embarrassing.
- The CSM (Priya in this case) earned the right to make the commitment by being the engineering-led relationship-holder.

## Quote attributed to Priya Anand at the 2028 Atlas engineering offsite

> "We didn't change the architecture because of an outage. We changed it because we'd told Helga we would."

## Related

- `escalation-norvale-pulse-pilot-stall.md`
- `deployment-norvale-pulse-mqtt-architecture.md`
- `deployment-norvale-pulse-pilot.md`
- `deployment-guide-pulse-utility-scale.md`
- `case-study-norvale-pulse-expansion.md`
