---
content_type: audit_finding
region: noram
title: Audit Finding — Aura HIPAA Tenant Isolation (2028)
---

# Audit Finding · Aura HIPAA Tenant Isolation (2028)

**Auditor:** External — Cresta Health Network's third-party HIPAA assessor
**Atlas-side owner:** Dr Sara Vance (Compliance), Marcus Ortiz (Engineering remediation)
**Issued:** 2028-05-12
**Status:** Open — remediation in flight, target close 2028-Q3

## Finding

The auditor evaluated Atlas Aura's tenant isolation controls against the HIPAA Security Rule technical safeguards. The auditor confirmed the design-doc-aura-tenant-isolation.md baseline (per-tenant DB schemas, per-tenant Kafka topics, per-tenant Redis prefixes, dedicated worker pool for Cresta) and found the architecture appropriate. The auditor cited INC-2028-0156 (cross-tenant log leak detected and quarantined before exposure) as both a concern and a positive — the bug existed, but the defence-in-depth caught it.

## Specific gaps

1. **Process-local tenant context cache** — The auditor flagged the architectural pattern that enabled INC-2028-0156. Recommended elimination in favour of request-scoped context.
2. **Tenant-context cache invalidation during rolling deploy** — Not in the rolling deploy checklist. Recommended formalisation.
3. **Cross-tenant log quarantine alerting** — Worked but had no documented response runbook. Recommended.

## Remediation

| Gap | Action | Owner | Target date |
|---|---|---|---|
| Process-local cache | Replace with request-scoped tenant context | Marcus Ortiz | 2028-Q3 |
| Rolling deploy checklist | Add tenant-context cache invalidation step | Marcus Ortiz | 2028-Q3 |
| Quarantine response runbook | Author runbook RB-Aura-Tenant-Quarantine-018 | Marcus Ortiz | 2028-Q3 |

## Compliance posture

- **HIPAA Security Rule § 164.312(c)(1)** — Integrity controls. Remediation closes the gap that allowed INC-2028-0156 to be possible (even though no actual exposure occurred).
- **POL-DATA-v3.1.** Logical-isolation baseline reaffirmed; physical-isolation for Cresta reaffirmed.

## Customer impact

- **Cresta Health Network.** Remediation visible to Cresta as the source of the finding. Aisha Okonkwo's team owns customer-facing updates.

## Related

- INC-2028-0156
- design-doc-aura-tenant-isolation.md
- design-doc-aura-hvac-scheduler.md
