---
content_type: runbook
region: noram
title: Customer Success Runbook — Cross-Customer Incident Coordination
---

# Customer Success Runbook · Cross-Customer Incident Coordination

**Owner:** Aisha Okonkwo (Director of Customer Success)
**Region:** Global
**Trigger:** Any P0 or P1 incident affecting more than one customer simultaneously

## Origin

This runbook was codified following INC-2028-0034, which affected both Halcyon Logistics (NORAM) and Talos Steelworks (APAC) simultaneously. See `case-study-fieldops-cross-customer-incident.md`.

## Phase 1 — Activate (Hour 0-2)

1. The first CSM aware of the incident pages the Director of Customer Success.
2. Atlas-side incident commander is appointed within 2 hours (typically the product engineering lead — see POL-INCIDENT-v2.0).
3. All affected customers' CSMs join the same Atlas-side standup channel.

## Phase 2 — Synchronise customer communications (Hour 2-24)

1. CSMs agree on a single Atlas-side factual narrative.
2. Each CSM adapts the narrative to their customer's preferred communication style (email vs phone, English vs local language, leadership-style vs ops-style).
3. Service-credit logic is computed on a common basis (e.g., per-device-day) for symmetry.
4. All customer-facing communications include explicit timestamps of next update commitment.

## Phase 3 — Joint daily standups (Days 1-N)

1. Atlas-side standup at fixed daily time, all affected CSMs present.
2. Customer-side updates roll up at fixed daily time, before the next Atlas standup.
3. Cross-CSM coordination on commitments before any commitment is made to a customer.

## Phase 4 — Resolution (Day N)

1. Patch deployed at all affected customers in coordinated window (typically 24-hour window globally).
2. Stabilisation verification at each customer.
3. Joint post-mortem published.

## Phase 5 — Customer-specific follow-up

1. Each CSM owns customer-specific follow-up.
2. Cross-CSM coordination continues for any commitments that affect multiple customers (e.g., language pack, architecture change).

## Anti-patterns

- Asymmetric customer treatment. If one customer gets a free service-credit and another doesn't on the same incident, the relationship damage outweighs the cost savings.
- Inconsistent narratives. If two CSMs tell two stories about the same incident, customer-side trust erodes immediately.
- Holding back information from one customer because another customer "shouldn't know." Atlas customers talk to each other (especially in the same industry); assume any update is potentially shared.

## Quote attributed to Aisha Okonkwo

> "Cross-customer coordination is what separates a customer-success organisation from a customer-management organisation."

## Related

- POL-INCIDENT-v2.0
- `case-study-fieldops-cross-customer-incident.md`
- `runbook-customer-trust-rebuild.md`
- `runbook-service-credit-issuance.md`
