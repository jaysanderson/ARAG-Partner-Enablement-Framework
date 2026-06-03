---
content_type: audit_finding
region: noram
title: Audit Finding — Atlas Ledger SOX §404 (2028)
---

# Audit Finding · Atlas Ledger SOX §404 (2028)

**Auditor:** Meridian Bank internal audit
**Atlas-side owner:** Dr Sara Vance (Compliance), Marcus Ortiz (Engineering)
**Issued:** 2028-04-15
**Status:** Closed — Q2 2028

## Finding

Meridian Bank's internal audit evaluated Atlas Ledger v2.0 (per design-doc-ledger-immutable-journal.md) against SOX §404 internal-control-over-financial-reporting requirements. The audit confirmed the hash-chain anchor design satisfies "evidence of internal control" and the deterministic replay capability satisfies "ability to reproduce reported figures from source records."

The audit noted INC-2028-0112 (anchor delay during Q1 quarter-end window) as a documented but acceptable gap, and asked Atlas to propose contractual SLA on customer HSM availability during audit windows.

## Specific items

1. **Hash chain integrity** — Confirmed.
2. **Deterministic replay** — Confirmed; auditor replayed a 90-day window themselves.
3. **GDPR tombstone mechanism** — Reviewed; auditor accepted the rfc-ledger-erasure-tombstones.md approach.
4. **Anchor window SLA** — Recommended for the next contract renewal.

## Remediation

| Item | Action | Owner | Status |
|---|---|---|---|
| Anchor window SLA | Drafted in next master agreement renewal proposal | Dr Sara Vance | Sent to Meridian 2028-Q2 |
| Quarter-end coordination calendar | Implemented | Marcus Ortiz | Done |

## Compliance posture

- **SOX §404.** Atlas Ledger v2.0 design and operational posture confirmed adequate.
- **POL-DATA-v3.1.** Reaffirmed.
- **GDPR Art. 17.** Tombstone approach accepted by Meridian's GDPR-side review.

## Customer impact

- **Meridian Bank** — Audit closed clean. Anchor SLA proposal in flight.

## Related

- INC-2028-0112
- design-doc-ledger-immutable-journal.md
- rfc-ledger-erasure-tombstones.md
- RB-Ledger-Anchor-Recovery-010
