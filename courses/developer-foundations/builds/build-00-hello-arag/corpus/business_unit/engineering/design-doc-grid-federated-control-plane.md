---
content_type: design_doc
region: noram
title: Atlas Grid Federated Control Plane v1.0
---

# Atlas Grid Federated Control Plane v1.0

**Author:** Marcus Ortiz (Principal Architect)
**Reviewer:** Priya Anand
**Status:** Approved for build, Q3 2028 start
**Version:** 1.0

## Context

Atlas Grid is the energy-systems product responsible for cross-site coordination, principally for utility customers like Norvale Energy and financial-grade scenarios at Meridian Bank's data-centre microgrids. Today each Atlas Grid deployment is single-region. Customers running multi-region operations have asked for cross-region coordination without exposing inter-region telemetry across customer-defined trust boundaries.

## Design goals

- **Federation.** N independent Grid control planes coordinate dispatch without a shared database.
- **Trust boundaries.** Inter-region data flows respect customer-defined sovereignty (relevant for Meridian Bank EMEA/NORAM separation).
- **Latency budget.** 95th-percentile cross-region coordination decision in under 2 seconds.
- **Failure isolation.** Loss of one region must not cascade.

## Architecture

A peer mesh of regional control planes, each running an identical Grid binary, exchanging a strictly-typed coordination intent envelope over mTLS. Coordination is advisory: each region retains final dispatch authority within its envelope.

## Compliance posture

- **SOX §404.** Meridian Bank's Atlas Ledger integration sits beside Grid. Coordination envelopes are auditable, immutable, and reconciled nightly with Ledger journals. Dr Sara Vance signed off the audit linkage.
- **NIST 800-53 r5.** SC-8 (Transmission Confidentiality) and SC-13 (Cryptographic Protection) satisfied by mTLS with customer-controlled trust anchors.
- **GDPR.** No personal data flows in coordination envelopes; envelopes contain only aggregate dispatch intent.

## Failure modes

| Failure | Behaviour |
|---|---|
| Single region offline | Other regions degrade gracefully; advisory becomes "best-effort" |
| Coordination bus partition | Each region falls back to local-only dispatch within 5s |
| Compromised peer | Mesh evicts on signature failure; alerts Atlas L3 |
| Time-skew between regions | Reject envelopes outside 500ms skew window |

## Related

- design-doc-pulse-smartgrid-optimiser.md
- RFC — Atlas BYO-LLM Routing
- POL-INCIDENT-v2.0
