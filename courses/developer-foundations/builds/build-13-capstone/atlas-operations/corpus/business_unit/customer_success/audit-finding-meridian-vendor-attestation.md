---
content_type: audit_finding
region: noram
title: Audit Finding AF-2028-022 — Meridian Vendor Attestation Refresh Cadence (closed)
---

# Audit Finding · AF-2028-022 — Meridian Vendor Attestation Refresh Cadence

**Finding ID:** AF-2028-022
**Customer-context:** Meridian Bank
**Owning function:** Customer Success (Dr Sara Vance, dual-hatting as CSM)
**Regulation:** SOX §404 + NIST 800-53 r5
**Status:** Closed 2028-04-15

## Background

Meridian's procurement team paused Atlas Grid Phase 2 in February 2028 because Atlas's vendor-attestation pack had not been refreshed to meet Meridian's new internal vendor-risk framework expectations. The pause cleared in 21 days (see `escalation-meridian-grid-phase2-procurement.md`).

This finding is the Atlas-side post-mortem of the cadence gap.

## Finding

Atlas's customer-facing compliance attestation cadence (annual refresh) was not aligned to Tier-1 financial-services customer-side expectations (semi-annual refresh in some cases).

## Severity

Medium. No commercial impact ultimately materialised (Meridian's PO issued on schedule), but the procurement hold could have been avoided with proactive cadence alignment.

## Remediation

1. Dr Sara Vance refreshed the Atlas customer-facing attestation cadence for Tier-1 financial-services customers to semi-annual.
2. SOC 2 Type II attestation refreshes are now scoped on a semi-annual cadence by default for all Tier-1 financial-services customers.
3. POL-INCIDENT-v2.0 (v2.0) updated to reference the new cadence.
4. Atlas commercial team trained on the new cadence to surface it in procurement conversations.

## Closure verification

- 2028-04-15: Meridian's procurement team confirmed the new cadence meets their internal vendor-risk framework.
- 2028-05-30: Meridian's SOX §404 attestation refresh passes clean.

## Lessons captured

- Customer-side procurement frameworks evolve; Atlas-side attestation cadences must evolve in step.
- Proactive cadence alignment is cheaper than reactive procurement-hold escalation.
- The compliance-led CSM model (Dr Sara Vance's Meridian relationship) surfaces these gaps faster than a sales-led model would.

## Related

- `escalation-meridian-grid-phase2-procurement.md`
- `escalation-meridian-ledger-sox-controls.md`
- `case-study-meridian-bank.md`
- `case-study-meridian-compliance-led-csm.md`
- POL-INCIDENT-v2.0 (v2.0)
