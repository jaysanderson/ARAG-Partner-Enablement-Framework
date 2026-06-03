---
content_type: rfc
region: apac
title: RFC — FieldOps Conflict Inbox UX
---

# RFC · FieldOps Conflict Inbox UX

**Authors:** Liam Hayashi, Marcus Ortiz
**Status:** Approved — implementation tracked in design-doc-fieldops-conflict-inbox.md
**Open period:** 2028-Q2 (comments closed)

## Summary

The CRDT-based offline sync engine (v3.0) auto-merges most edits but emits a stream of "conflicts" that genuinely require human resolution. This RFC proposes a Conflict Inbox surface in the FieldOps app — what it shows, how it behaves offline, what gets audited.

## Motivation

INC-2028-0034 showed the cost of silent merges. The v2.x last-writer-wins logic discarded technician work without ever surfacing the loss. The CRDT redesign in v3.0 eliminates the silent-discard class of bug, but only if conflicts that the CRDT cannot resolve are made visible to humans. An invisible conflict is functionally the same as a discard.

## Proposal

1. Every unmerged conflict appears in a per-technician Conflict Inbox.
2. Conflicts persist until acknowledged.
3. Resolution actions are: keep mine, keep theirs, merge manually with rationale.
4. Resolutions sync via the same CRDT path; rationale recorded in immutable audit log.
5. The inbox is fully offline-capable.

## Alternatives considered

- **Auto-resolve with operator alerts.** Rejected: re-introduces the silent-discard pathology, just with a delayed signal.
- **Block sync until conflicts resolved.** Rejected: would strand technicians offline with no progress.
- **Web-only conflict resolution.** Rejected: most FieldOps technicians never use the web app.

## Compliance

- **GDPR Art. 32.** Rationale audit log satisfies the technical-measures requirement for sync integrity.
- **POL-DATA-v3.1.** Rationale field is free-text; technicians instructed not to include PII.

## Customer impact

- Halcyon Logistics — primary beneficiary, ~40k offline edits per day.
- Talos Steelworks — secondary; their site reliability requires lossless sync.

## Related

- INC-2028-0034
- design-doc-fieldops-offline-sync-v3.md
- design-doc-fieldops-conflict-inbox.md
