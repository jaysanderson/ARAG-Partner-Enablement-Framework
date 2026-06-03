---
content_type: runbook
region: noram
title: Customer Success Runbook — Service Credit Issuance
---

# Customer Success Runbook · Service Credit Issuance

**Owner:** Aisha Okonkwo (Director of Customer Success)
**Region:** Global
**Applies to:** All Atlas customer contracts with service-credit provisions

## Principle

Atlas's posture on service credits is simple: **if you were impacted, you receive credits. No fight.** This runbook codifies the operational mechanics. It does not codify negotiation tactics, because there are no negotiation tactics.

## Trigger conditions

1. P0 or P1 incident with customer-side measurable impact.
2. SLA breach.
3. Customer-side written request following an event that the CSM believes warrants credit consideration.

## Computation

| Class of impact | Computation |
|---|---|
| Per-device-day downtime | (number of affected devices) × (days affected) × per-device daily rate |
| Production hours lost | (hours) × (customer's stated per-hour value) |
| Regulatory reporting miss | flat-rate as defined in the contract (typically USD 10k-100k) |

## Approval

- Up to USD 500k aggregate per customer per year: CSM signs.
- USD 500k to USD 1M: CSM + Aisha Okonkwo sign.
- Above USD 1M: CSM + Aisha + Atlas commercial committee sign.

## Process

1. CSM drafts the credit calculation within 5 business days of incident closure.
2. Atlas commercial finalises the credit memo within 3 additional business days.
3. Credit applied to next invoice within 30 days.
4. Customer-side executive sponsor notified in writing of the credit detail.

## Example issuances (recent)

| Incident | Customer | Credit | CSM |
|---|---|---|---|
| INC-2027-0142 | Norvale (3 affected sites) | EUR 1.2M | Priya Anand |
| INC-2027-0188 | Halcyon | USD 480k | Marcus Ortiz |
| INC-2028-0019 | Cresta (14 sites, partial workload impact) | undisclosed | Aisha Okonkwo |
| INC-2028-0034 | Halcyon + Talos (joint) | computed per-device-day | Marcus Ortiz + Liam Hayashi |
| Norvale Pulse telemetry-gap | Norvale | EUR 38k | Priya Anand |

## Anti-patterns

- Trying to negotiate the customer down. Don't.
- Letting credits land late. The customer feels the delay as a second slight.
- Issuing credits without writing to the customer's executive sponsor. Visibility matters.

## Related

- POL-INCIDENT-v2.0
- All escalation docs
- `case-study-tier1-expansion-conversion-2028.md` (showing service credits as expansion-investment)
