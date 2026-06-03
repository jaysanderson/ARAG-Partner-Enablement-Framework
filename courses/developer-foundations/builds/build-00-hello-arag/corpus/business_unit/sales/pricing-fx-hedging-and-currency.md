---
content_type: pricing
region: emea
title: FX Hedging and Currency-Conversion Policy
---

# FX Hedging and Currency-Conversion Policy

Codifies how Atlas treats currency exposure on multi-currency customer contracts. Anchored on POL-PRICING-v4.0 §10.

## Default contract currency

- NORAM deals: USD.
- EMEA deals: EUR.
- APAC deals: EUR (for invoicing simplicity across the APAC strategic customer base; Talos already operates this way).
- LATAM deals: USD.

## Cross-currency cases

- A NORAM customer with EMEA operations may request EUR pricing for the EMEA-resident portion of a deployment. This is fine; the EMEA pricing book applies to the EMEA-resident portion only.
- A multi-market customer with a single global contract must elect one billing currency. Meridian Bank's Atlas Ledger Multi-Market Add-On is billed in USD globally even though four of the markets are non-USD.

## Hedging at Atlas

Atlas Finance maintains a 12-month rolling forward-hedge across the major non-USD revenue lines. Sales does not need to factor FX explicitly into discount calculations.

## Inflation indexing (FX-adjacent)

- The annual escalator (POL-PRICING-v4.0 §9) is not FX-adjusted. A weakening EUR does not trigger a higher EUR-escalator.
- Hyperinflation markets are handled separately under POL-PRICING-v4.0 §11 (out of scope for current strategic customers).

## Customer expectations

- All customer-facing pricing tables (e.g., Atlas EMEA Pricing 2028, Atlas NORAM Pricing 2028, Atlas APAC Pricing 2028, Atlas LATAM Pricing 2028) are quoted in the regional default currency.
- Customers requesting an alternate currency get a one-off currency-conversion at the prevailing 30-day average rate at SOW signing.

## AE handling

AE must not commit to a currency without confirming Finance has the corresponding hedge capacity, especially for deals above EUR 5M.
