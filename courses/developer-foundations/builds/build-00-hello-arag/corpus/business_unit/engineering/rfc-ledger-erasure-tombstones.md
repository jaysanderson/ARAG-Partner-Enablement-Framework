---
content_type: rfc
region: emea
title: RFC — Atlas Ledger GDPR Erasure via Tombstones
---

# RFC · Atlas Ledger GDPR Erasure via Tombstones

**Authors:** Marcus Ortiz, Dr Sara Vance
**Status:** Approved
**Open period:** 2027-Q4 (comments closed)

## Summary

Atlas Ledger is append-only with an integrity-preserving hash chain (see design-doc-ledger-immutable-journal.md). GDPR Article 17 (right to erasure) and SOX §404 (no destruction of financial records) are in tension. This RFC proposes the tombstone mechanism that resolves it.

## Proposal

When a data subject exercises Article 17 rights against records held in Atlas Ledger:

1. The record itself is NOT deleted (preserves chain + SOX §404 evidence).
2. A tombstone record is appended that hides the subject's personal data fields in all subsequent reads.
3. Personal data fields are zeroised in-place using a separate erasure index that controls visibility per-tenant, per-read.
4. Auditors retain the ability to see the existence and structural shape of the record, but not the personal data content.

## Why this works

- **GDPR Art. 17.** The personal data is rendered inaccessible — the standard the Court of Justice has applied where statutory retention conflicts with erasure.
- **SOX §404.** The record's existence and amounts are preserved; the chain stays valid; auditors can demonstrate completeness.
- **Hash chain.** The hash inputs are the structural shape, not the personal data fields, so erasure does not break the chain.

## Alternatives considered

- **Full record deletion.** Rejected: breaks chain, violates SOX §404.
- **Encrypted at-rest with key destruction.** Rejected: harder to audit; key custody question becomes the new attack surface.

## Compliance

- **GDPR Art. 17 + Art. 23 (member-state legal obligation derogation).**
- **SOX §404.**
- **POL-DATA-v3.1.**

## Customer impact

- **Meridian Bank.** Primary affected customer; their EMEA tenancy receives erasure requests under GDPR.

## Related

- design-doc-ledger-immutable-journal.md
- audit-finding-ledger-sox404-2028.md
- POL-DATA-v3.1
