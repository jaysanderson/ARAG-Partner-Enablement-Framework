---
content_type: design_doc
region: noram
title: Atlas Aura Multi-Tenant Isolation Design
---

# Atlas Aura Multi-Tenant Isolation Design

**Author:** Marcus Ortiz (Principal Architect)
**Reviewers:** Aisha Okonkwo, Dr Sara Vance
**Status:** Approved
**Version:** 1.1

## Context

Atlas Aura runs as a multi-tenant SaaS HVAC scheduler. Cresta Health Network's tenancy requires hard isolation from non-HIPAA tenants because their occupancy feeds (even at the anonymised zone level) sit on the same operational substrate. This document defines the isolation boundary.

## Design goals

- **Logical isolation by default.** All tenants are isolated at the database, queue, and cache layer.
- **Physical isolation on request.** HIPAA tenants (Cresta) and high-trust enterprise tenants (Meridian) can request dedicated worker pools.
- **No tenant ever observes another.** Side-channel attack surface minimised.
- **Auditability.** Every cross-tenant operation (there should be none) is alertable.

## Architecture

- **Database.** Per-tenant schemas, no shared tables. Connection pool per tenant.
- **Queue.** Per-tenant Kafka topics; cluster-level ACLs enforce.
- **Cache.** Per-tenant Redis keyspace prefix; cluster-level ACLs.
- **Workers.** Default shared pool; HIPAA/dedicated tenants get a dedicated pool tagged with tenant ID.
- **Telemetry.** Logs and metrics tagged with tenant ID at emit time; storage isolated.

## Compliance posture

- **HIPAA.** Cresta Health Network operates in a dedicated worker pool. Dr Sara Vance reviewed and approved the BAA-aligned configuration.
- **POL-DATA-v3.1.** Per-tenant logical isolation is the documented baseline.
- **NIST 800-53 r5 SC-2 / SC-4.** Application Partitioning and Information in Shared System Resources satisfied.

## Failure modes

| Failure | Behaviour |
|---|---|
| Cross-tenant log emission | Alerted, blocked at storage layer |
| Worker pool exhaustion (dedicated) | Aura degrades for that tenant only |
| Cache key collision (regression) | Cache rejects, falls back to DB |
| DB schema migration affecting one tenant | Tenant pinned; migration replayed |

## Related

- design-doc-aura-hvac-scheduler.md
- POL-DATA-v3.1
- audit-finding-aura-hipaa-2028.md
