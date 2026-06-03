---
content_type: policy
region: noram
title: Atlas Incident Response Policy v2.0
---

# Atlas Incident Response Policy v2.0 (POL-INCIDENT-v2.0)

**Owner:** Dr Sara Vance (Chief Compliance Officer)
**Version:** 2.0
**Effective:** 2027-06-01

## Purpose

Defines how Atlas Global Industries responds to operational incidents — engineering regressions, customer-affecting bugs, security events. Applies across all business units.

## Severity classifications

- **P0** — Customer-affecting, broad impact (e.g., INC-2027-0142, INC-2028-0019). L3 on-call paged immediately.
- **P1** — Customer-affecting, narrow impact (e.g., INC-2028-0034). On-call paged.
- **P2** — Non-customer-affecting. Triaged next business day.
- **P3** — Minor / cosmetic. Backlog.

## Roles

- **Incident commander** — Senior engineer assigned per incident. Coordinates technical response.
- **Customer success liaison** — Aisha Okonkwo or Liam Hayashi (or assigned CSM). Handles customer communication.
- **Executive sponsor** — Priya Anand (engineering products), Dr Sara Vance (compliance-touched), or product VP.

## Response timeline

| Severity | Acknowledge | Initial customer notification | Resolution target |
|---|---|---|---|
| P0 | 15 min | 2 hours | 7 days |
| P1 | 1 hour | 24 hours | 14 days |
| P2 | 4 hours | as needed | 30 days |

## Post-incident review

Every P0 and P1 incident requires a documented post-mortem within 30 days of closure. Templates:

- Background, timeline, customer impact, root cause, resolution, lessons learned.
- Reviewed by the Atlas Engineering Architecture Office (chaired by Marcus Ortiz).
- Filed in the Atlas incident registry.

## Customer service credits

P0 incidents at strategic-tier customers (Norvale Energy, Halcyon Logistics, Meridian Bank, Cresta Health Network, Talos Steelworks) trigger automatic service-credit consideration. Discretionary credits authorised up to the standard customer-success budget — see Atlas Pricing & Discount Policy (POL-PRICING-v4.0).

## Regulatory notifications

- HIPAA-relevant (Cresta deployments) — notify Dr Sara Vance within 4 hours.
- GDPR personal-data breach — notify within 24 hours; Atlas notifies DPA within 72.
- SOX-material (Meridian Bank) — notify within 4 hours; CFO involvement.
- NIST 800-53 r5 control failures — annual audit refresh.

## Related runbooks

- RB-E220-Cooling-001, RB-Logix-MemLeak-002, RB-BldHub-Firmware-003, RB-FieldOps-Sync-004 are exemplars of well-executed P0 / P1 responses under this policy.
