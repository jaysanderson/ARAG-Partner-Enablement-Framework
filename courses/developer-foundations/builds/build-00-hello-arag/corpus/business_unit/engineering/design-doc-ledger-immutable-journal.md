---
content_type: design_doc
region: noram
title: Atlas Ledger Immutable Journal v2.0
---

# Atlas Ledger Immutable Journal v2.0

**Author:** Marcus Ortiz (Principal Architect)
**Reviewer:** Dr Sara Vance
**Status:** Approved
**Version:** 2.0

## Context

Atlas Ledger is the financial-grade journal product underpinning customer-services billing reconciliation. Meridian Bank is the anchor customer; their use case binds Ledger directly to SOX §404 reporting cycles. v2.0 of the immutable journal addresses two requirements from Meridian's 2027 internal audit: (1) auditor-verifiable hash chain across the journal, and (2) deterministic replay of any 90-day window.

## Design goals

- **Hash-chain integrity.** Each journal record includes the SHA-256 of the prior record, anchored daily to a customer-controlled hardware security module.
- **Deterministic replay.** Given the journal and a starting snapshot, any subsequent state can be reproduced byte-for-byte.
- **SOX §404 evidence.** Auditors can verify integrity without Atlas-side access.
- **GDPR right-to-erasure compatibility.** Erasure handled via tombstone references, not record deletion.

## Architecture

Journal records are stored append-only in customer-isolated tables. The hash chain is computed at write time; the daily HSM anchor produces a signed digest that the customer's auditor can independently verify. A separate erasure index maps GDPR subject-access deletions to tombstone references that hide content without breaking the chain.

## Compliance posture

- **SOX §404.** Auditors at Meridian Bank confirmed v2.0 design satisfies "evidence of internal control over financial reporting" in 2027 review.
- **GDPR Art. 17.** Erasure via tombstone preserves chain integrity while honouring the right to erasure.
- **NIST 800-53 r5 AU-9** — Protection of Audit Information satisfied by hash chain.

## Test matrix

| Scenario | Outcome |
|---|---|
| 90-day deterministic replay | Pass, byte-identical |
| Inject corrupt record mid-chain | Detected on next anchor, alert raised |
| GDPR erasure on 6-month-old record | Tombstone applied, chain valid |
| HSM unavailable for 24h | Anchor deferred, alert raised, chain still valid |

## Related

- POL-DATA-v3.1
- audit-finding-ledger-sox404-2028.md
- design-doc-grid-federated-control-plane.md
