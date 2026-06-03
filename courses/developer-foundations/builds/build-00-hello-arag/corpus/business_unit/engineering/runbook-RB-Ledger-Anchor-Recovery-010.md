---
content_type: runbook
region: noram
title: RB-Ledger-Anchor-Recovery-010 — Ledger Daily Anchor Recovery
---

# RB-Ledger-Anchor-Recovery-010 · Ledger Daily Anchor Recovery

**Product:** Atlas Ledger
**Owner:** Marcus Ortiz (Principal Architect)
**Last revised:** 2028-Q2

## Background

Atlas Ledger anchors its hash chain to a customer-controlled HSM on a daily schedule (see design-doc-ledger-immutable-journal.md). If the anchor job fails or the HSM is unavailable for >24 hours, the chain remains internally valid but auditors cannot independently verify it past the last successful anchor.

## Severity

P1 for any Ledger tenant after 24h missed anchor. P0 for Meridian Bank during quarter-end audit windows.

## Trigger

Pager from Ledger anchor scheduler indicating consecutive anchor failures.

## Steps

1. Confirm tenant from alert payload (likely Meridian Bank).
2. Verify HSM availability: `ledger-admin anchor-status --tenant <tenant-id>`.
3. If HSM is reachable, replay failed anchors in order: `ledger-admin anchor-replay --tenant <tenant-id> --from <last-success>`.
4. If HSM is unreachable, contact customer HSM operator. Do NOT bypass — anchors are customer-controlled by design.
5. Once HSM is restored, replay deferred anchors in chronological order.
6. Verify auditor-side independent chain verification returns clean.

## Verification

- Anchor scheduler reports zero deferred anchors.
- Customer auditor can verify the chain to the current date.

## Affected customers

- **Meridian Bank** — primary. SOX §404 evidence trail depends on anchor freshness.

## Compliance

- **SOX §404.** Anchor freshness is the evidence basis. 24h gap is acceptable; longer gaps require disclosure in audit workpapers.
- **POL-INCIDENT-v2.0.** Extended outage invokes the incident-response policy.

## Escalation

Marcus Ortiz (product owner). Dr Sara Vance for any SOX §404 evidence-window concerns. Out-of-hours: Atlas L3 NORAM rotation.

## Related

- design-doc-ledger-immutable-journal.md
- audit-finding-ledger-sox404-2028.md
- rfc-ledger-erasure-tombstones.md
