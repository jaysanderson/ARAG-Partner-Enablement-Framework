---
content_type: runbook
region: noram
title: RB-Grid-Region-Eviction-008 — Grid Mesh Peer Eviction
---

# RB-Grid-Region-Eviction-008 · Grid Mesh Peer Eviction

**Product:** Atlas Grid
**Owner:** Marcus Ortiz (Principal Architect)
**Last revised:** 2028-Q2

## Background

Atlas Grid's federated control plane (see design-doc-grid-federated-control-plane.md) operates as a peer mesh. If a peer's signature verification fails repeatedly — indicating either a key-distribution problem or a compromised peer — the mesh evicts the peer and alerts. This runbook handles the eviction follow-up.

## Severity

P1 — coordination quality degrades. P0 if eviction is of a peer in a region with active utility demand-response events (Norvale Energy, Meridian Bank data-centres).

## Trigger

Pager from Grid mesh indicating peer eviction with signature failure code.

## Steps

1. Acknowledge page; identify evicted peer (region + tenant).
2. Verify the eviction was due to signature failure, not network partition: `grid-admin mesh-status --tenant <tenant-id>`.
3. If signature failure: do NOT re-admit the peer. Treat as potential compromise.
4. Notify Dr Sara Vance — POL-INCIDENT-v2.0 requires Compliance involvement on any potential compromise.
5. If network partition was the actual cause: confirm partition resolved, then re-admit `grid-admin mesh-admit --tenant <tenant-id> --peer <peer-id>`.
6. Verify cross-region coordination resumes within 5 minutes of re-admission.

## Verification

- Mesh status reports all peers healthy.
- No signature failures in subsequent 30 minutes.
- Customer-side dispatch decisions returning to normal advisory quality.

## Affected customers

- **Norvale Energy** — multi-region Grid deployment.
- **Meridian Bank** — financial-grade microgrid, SOX §404 boundary affected if envelope replay falls behind.

## Compliance

- **POL-INCIDENT-v2.0.** Potential compromise triggers full incident procedure.
- **NIST 800-53 r5 IR-4.**
- **SOX §404.** Meridian envelope replay must catch up within 24 hours.

## Escalation

Dr Sara Vance immediately on signature failure. Marcus Ortiz for architecture follow-up.

## Related

- design-doc-grid-federated-control-plane.md
- design-doc-ledger-immutable-journal.md
- POL-INCIDENT-v2.0
