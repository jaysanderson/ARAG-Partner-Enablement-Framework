---
content_type: rfc
region: noram
title: RFC — Product Telemetry Retention
---

# RFC · Product Telemetry Retention

**Authors:** Marcus Ortiz, Dr Sara Vance
**Status:** Approved
**Open period:** 2027-Q4 (comments closed)

## Summary

Each Atlas product emits operational telemetry consumed by Engineering for debugging and by Customer Services for health reporting. This RFC proposes uniform retention rules per product, harmonised with POL-DATA-v3.1 and tenant-specific overlays (HIPAA, GDPR).

## Proposal

| Product | Default retention | Tenant overlay |
|---|---|---|
| Atlas E-220 | 365 days | Norvale Energy: 730 days (contractual) |
| Atlas Logix | 180 days | Halcyon Logistics: 365 days |
| Atlas BuildingHub | 90 days | Cresta Health: HIPAA-bound 6 years on audit subset only |
| Atlas FieldOps | 90 days | GDPR overlay: 30 days for EU technician location data |
| Atlas Pulse | 365 days | Norvale Energy default |
| Atlas Grid | 365 days | Meridian Bank: aligned with SOX §404 7-year audit retention on financial subset |
| Atlas Aura | 90 days | Cresta Health: HIPAA-bound 6 years on audit subset only |
| Atlas Ledger | 7 years | SOX §404 statutory floor |

## Compliance

- **POL-DATA-v3.1.** Default retention bands derive from data classification.
- **HIPAA.** Cresta-specific overlays for BuildingHub and Aura cover the 6-year HIPAA audit requirement on logs that materially evidence access decisions.
- **GDPR.** FieldOps 30-day cap on EU technician location data satisfies Art. 5(1)(e) data minimisation.
- **SOX §404.** Atlas Ledger 7-year baseline; Atlas Grid financial-touch subset matches.

## Alternatives considered

- **Uniform 1-year retention.** Rejected: too long for FieldOps location data; too short for Ledger.
- **No tenant overlays.** Rejected: contractual and regulatory variability is real.

## Related

- POL-DATA-v3.1
- design-doc-ledger-immutable-journal.md
- design-doc-fieldops-mobile-mdm.md
