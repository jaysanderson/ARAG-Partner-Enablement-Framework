---
content_type: pricing
region: noram
title: Service-Credit Framework
---

# Service-Credit Framework

This document codifies how Atlas issues service credits to customers in connection with service-affecting incidents. Anchored on POL-PRICING-v4.0 §7 and POL-INCIDENT-v2.0.

## Source-of-funds principle

Service credits do NOT come from the sales discount pool. They are funded from the customer-success budget, owned by the VP Customer Success (Aisha Okonkwo for EMEA, Liam Hayashi for APAC, with NORAM credits cleared centrally).

This separation prevents sales-side incentives from being distorted by post-deal operational events.

## Credit-calculation methodology

A service credit is calculated as the customer-side impact (downtime, throughput loss, or remediation labour) multiplied by an Atlas-defined credibility factor. The credibility factor is set per incident type by the engineering executive who owns the affected product.

## Recent reference incidents

| Incident | Customers affected | Issued credit value | Funded from |
|---|---|---|---|
| INC-2027-0142 (Atlas E-220 cooling regression) | Norvale Energy, Talos Steelworks | EUR 1.2M (Norvale) + Atlas-funded site visits (Talos) | CS budget |
| INC-2027-0188 (Atlas Logix routing memory leak) | Halcyon Logistics | USD 380k | CS budget |
| INC-2028-0019 (Atlas BuildingHub firmware rollback) | Cresta Health Network | Atlas-funded firmware uplift SOW (EUR 96k services) | CS budget |
| INC-2028-0034 (Atlas FieldOps offline sync corruption) | Talos Steelworks, Norvale Energy | Service-tier upgrade for both accounts at renewal | CS budget |

## Issuance process

1. Incident closes per POL-INCIDENT-v2.0.
2. Engineering executive (Priya Anand / Marcus Ortiz / Aisha Okonkwo / Liam Hayashi as appropriate) signs off the credibility factor.
3. CSM proposes the credit value to the customer.
4. VP Customer Success approves.
5. Atlas Finance issues the credit and books it against the CS budget.

## What service credits never cover

- Pricing concessions sought by the customer in subsequent sales motions (those go through standard discount approval).
- Compensating customers for downstream commercial losses unrelated to the product (e.g., a customer's own production-line outage that cannot be tied causally to the incident).

## Transparency

Per POL-CONDUCT-v3.1, the existence of service credits is disclosed in customer-facing renewal materials but the specific monetary value is treated as commercial-in-confidence.
