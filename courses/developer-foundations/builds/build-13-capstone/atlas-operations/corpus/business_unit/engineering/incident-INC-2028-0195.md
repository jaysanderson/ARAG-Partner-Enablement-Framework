---
content_type: incident
region: emea
title: INC-2028-0195 — Grid Mesh Peer Eviction at Norvale (Network Partition)
---

# INC-2028-0195 · Grid Mesh Peer Eviction at Norvale (Network Partition)

**Product:** Atlas Grid
**Severity:** P1
**Detected:** 2028-05-22 07:10 UTC
**Closed:** 2028-05-22 14:30 UTC
**Owner:** Marcus Ortiz (Principal Architect)

## Summary

The Norvale Energy EMEA Grid region was evicted from the federated mesh during a 3-hour network partition caused by an upstream ISP outage. Eviction was triggered by signature-verification failures that were actually network-level, not cryptographic. RB-Grid-Region-Eviction-008 correctly handled the triage; the region was re-admitted once the partition resolved. Cross-region coordination resumed within 5 minutes of re-admission.

## Timeline

- **2028-05-22 07:10** — Norvale EMEA region disappears from mesh.
- **2028-05-22 07:12** — Pager fires per RB-Grid-Region-Eviction-008.
- **2028-05-22 07:20** — On-call confirms partition (not compromise) via network telemetry.
- **2028-05-22 07:30** — Dr Sara Vance notified per policy (potential compromise classification cleared).
- **2028-05-22 09:50** — ISP outage resolved.
- **2028-05-22 10:00** — Region re-admitted; catch-up triggered per RB-Grid-Coordination-Catchup-015.
- **2028-05-22 14:30** — Catch-up complete; incident closed.

## Customer impact

- **Norvale Energy** — Norvale EMEA sites operated in local-only dispatch mode during the partition. Economic dispatch sub-optimal; safety envelope never breached. Estimated cost impact ~€55k.
- **Meridian Bank** — No impact; their EMEA region was not partitioned.

## Root cause

Upstream ISP outage caused network partition. Signature verification failures were a downstream consequence (mTLS handshake timeouts read as signature failures by the mesh's eviction logic).

## Lessons

- Mesh eviction logic should differentiate signature-verification failures from network-layer timeouts. Schedule design-doc revision.
- Customer comms template for "regional fallback" worked.
- RB-Grid-Region-Eviction-008 and RB-Grid-Coordination-Catchup-015 chained smoothly. Reaffirms the runbook design.

## Regulatory exposure

- **NIST 800-53 r5 IR-4.** Incident handled per policy.
- **SOX §404.** Meridian unaffected; no quarter-end implications.

## Related

- design-doc-grid-federated-control-plane.md
- RB-Grid-Region-Eviction-008
- RB-Grid-Coordination-Catchup-015
