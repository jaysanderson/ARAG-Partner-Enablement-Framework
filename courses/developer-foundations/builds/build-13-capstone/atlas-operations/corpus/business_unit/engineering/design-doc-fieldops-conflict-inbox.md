---
content_type: design_doc
region: apac
title: Atlas FieldOps Conflict Inbox UX
---

# Atlas FieldOps Conflict Inbox UX

**Author:** Liam Hayashi (Head of Field Operations)
**Engineering owner:** Marcus Ortiz
**Reviewer:** Priya Anand
**Status:** Approved
**Version:** 1.0

## Context

FieldOps v3.0 introduced CRDT-based offline sync (see design-doc-fieldops-offline-sync-v3.md), replacing the silent last-writer-wins merge that caused INC-2028-0034. CRDTs auto-merge most edits, but a small fraction of conflicts genuinely require human resolution — for example, two technicians both marking an asset as decommissioned with different decommission reasons. This document specifies the in-app Conflict Inbox where technicians review and resolve these.

## Design goals

- **Surface, never hide.** Every unresolved conflict appears in the technician's inbox until acted on.
- **Inbox-zero feasible.** A typical technician should clear conflicts in under 3 minutes per week.
- **Audit trail.** Resolution is logged with technician identity, timestamp, and rationale.
- **Offline-first.** The inbox itself works offline and syncs resolutions when reconnected.

## UX flow

1. Sync completes. CRDT auto-merge applied. Any unmerged conflicts appear as inbox items.
2. Technician opens conflict, sees both versions side-by-side with author + timestamp.
3. Technician selects "keep mine", "keep theirs", or "merge manually" with free-text rationale.
4. Resolution syncs to backend on next connection; audit entry written to immutable log.

## Edge cases

| Case | Behaviour |
|---|---|
| Technician resolves offline, then loses device | Resolution lost; conflict re-appears on replacement device |
| Two technicians both resolve the same conflict | Second resolution becomes a new conflict against the first |
| Conflict on a deleted record | Inbox shows "this record was deleted by X" |
| Conflict on a record the technician no longer has access to | Auto-resolved in their favour, audit note |

## Compliance

- **GDPR Art. 32.** Audit trail satisfies "ability to ensure the ongoing confidentiality, integrity, availability and resilience" requirement.
- **POL-DATA-v3.1.** Rationale field is free-text; technicians trained not to enter customer PII.

## Related

- design-doc-fieldops-offline-sync-v3.md
- INC-2028-0034
- RB-FieldOps-Sync-004
