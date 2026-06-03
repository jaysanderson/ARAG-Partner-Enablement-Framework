---
content_type: incident
region: apac
title: INC-2028-0181 — FieldOps Conflict Inbox Spike at Talos Steelworks
---

# INC-2028-0181 · FieldOps Conflict Inbox Spike at Talos Steelworks

**Product:** Atlas FieldOps
**Severity:** P1
**Detected:** 2028-05-19 02:30 UTC
**Closed:** 2028-05-20 06:00 UTC
**Owner:** Liam Hayashi (Head of Field Operations)
**Engineering co-owner:** Marcus Ortiz

## Summary

A conflict-rate spike across 40+ Talos Steelworks field technicians triggered the FieldOps Conflict Inbox spike triage (per RB-FieldOps-Conflict-Spike-013). Root cause: Talos had bulk-imported an asset reclassification CSV that retroactively changed asset categories, generating CRDT conflicts on every active checklist that touched the affected assets. The CRDT engine correctly preserved all technician edits — no data was lost — but the inbox volume overwhelmed individual technicians.

## Timeline

- **2028-05-19 02:30** — Conflict-rate alert fires across Talos tenant.
- **2028-05-19 02:50** — Atlas L3 APAC rotation engages.
- **2028-05-19 04:00** — Liam Hayashi engaged; identifies bulk-import as likely trigger.
- **2028-05-19 08:00** — Confirmed via Talos site lead — asset reclassification import the previous evening.
- **2028-05-19 11:00** — Engineering provides bulk-resolve tool to clear conflicts that all resolve identically.
- **2028-05-20 06:00** — All conflicts resolved; incident closed.

## Customer impact

- **Talos Steelworks** — 40+ technicians spent ~2 hours each clearing conflict inboxes. Production impact: minimal — checklists completed on time, just with delayed sync.

## Root cause

Talos bulk-imported an asset reclassification without coordinating with field operations. The CRDT engine treated the import as a parallel edit stream and generated conflicts against in-flight technician edits.

## Lessons

- Bulk-import workflow needs a "quiesce field edits" option that pauses CRDT writes during the import.
- Customer comms should advise customers of in-flight conflict implications before any bulk classification change.
- Bulk-resolve tool should be productised, not engineering-ad-hoc.

## Regulatory exposure

- **GDPR.** No personal data implications.
- **POL-INCIDENT-v2.0.**

## Related

- design-doc-fieldops-offline-sync-v3.md
- design-doc-fieldops-conflict-inbox.md
- RB-FieldOps-Conflict-Spike-013
- INC-2028-0034
