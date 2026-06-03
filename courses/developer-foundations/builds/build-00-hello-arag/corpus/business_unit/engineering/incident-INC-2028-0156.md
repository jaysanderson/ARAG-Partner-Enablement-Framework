---
content_type: incident
region: noram
title: INC-2028-0156 — Aura Cross-Tenant Log Leak (Detected, Not Exploited)
---

# INC-2028-0156 · Aura Cross-Tenant Log Leak (Detected, Not Exploited)

**Product:** Atlas Aura
**Severity:** P0 (Compliance-critical)
**Detected:** 2028-05-04 09:15 UTC
**Closed:** 2028-05-06 18:00 UTC
**Owner:** Marcus Ortiz (Principal Architect)
**Compliance lead:** Dr Sara Vance

## Summary

Atlas Aura's telemetry tagging layer emitted log entries from the Cresta Health Network dedicated worker pool with the tenant tag set to a non-HIPAA tenant for approximately 90 seconds during a rolling deploy. The alerting layer at the storage tier detected the mistagged entries and quarantined them before they were ingested by the non-HIPAA tenant's log view. No cross-tenant data was actually exposed to any user; the design's defence-in-depth caught the bug.

## Timeline

- **2028-05-04 09:13** — Rolling deploy of Aura telemetry layer reaches Cresta dedicated pool.
- **2028-05-04 09:14** — Mistagged entries emitted.
- **2028-05-04 09:15** — Storage-layer ACL quarantine triggers; pager fires.
- **2028-05-04 09:20** — Atlas L3 NORAM rotation engages.
- **2028-05-04 09:30** — Deploy rolled back; mistagging stops.
- **2028-05-04 11:00** — Dr Sara Vance engaged; Compliance investigation opens.
- **2028-05-05 16:00** — Aisha Okonkwo notifies Cresta Health Network leadership.
- **2028-05-06 18:00** — Investigation concludes no actual exposure; incident closed.

## Customer impact

- **Cresta Health Network** — Required notification under contractual obligations even though no data was exposed. Trust impact, no operational impact.

## Root cause

Telemetry tagging layer used a process-local cache for tenant context that was not invalidated during pool restart. Restarted processes briefly used stale tenant context.

## Lessons

- Process-local caches for tenant context are too risky. Replace with request-scoped context.
- Storage-layer ACL quarantine (the defence-in-depth design from design-doc-aura-tenant-isolation.md) worked as intended.
- Roll-out procedure should include explicit tenant-context cache invalidation step.

## Regulatory exposure

- **HIPAA.** No actual exposure. Customer notification per BAA. Documented in Dr Sara Vance's audit file.
- **POL-DATA-v3.1.** Reviewed; logical-isolation baseline reaffirmed.

## Related

- design-doc-aura-tenant-isolation.md
- audit-finding-aura-hipaa-2028.md
- POL-INCIDENT-v2.0
