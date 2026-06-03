---
content_type: audit_finding
region: noram
title: Audit Finding AF-2028-012 — FieldOps Offline Sync Sub-Processor Disclosure Gap
---

# Audit Finding AF-2028-012 · FieldOps Offline Sync Sub-Processor Disclosure Gap

**Auditor:** Atlas external auditor (NORAM, SOC 2 Type II cycle)
**Audit cycle:** Q2 2028
**Status:** Closed
**Severity:** Minor
**Owner:** Liam Hayashi (Head of Field Operations)
**Co-owner:** Dr Sara Vance (CCO)

## Finding

During remediation of INC-2028-0034 (Atlas FieldOps offline sync corruption), the engineering team introduced a new conflict-resolution log shipping pipeline that routes anonymised conflict telemetry through a third-party stream processor. The vendor was added under POL-VENDOR-v1.0 controls but not disclosed in Atlas's customer-facing sub-processor registry within the 10-business-day window required by POL-SUBPROC-v1.0.

No customer Regulated data was processed by the new sub-processor; the telemetry is operational only. However, the disclosure gap is itself a process finding.

## Affected customers

- Talos Steelworks (APAC, primary FieldOps deployment).
- Cresta Health Network (NORAM, secondary FieldOps deployment for facility-team work orders).

## Remediation

- Registry updated within 24 hours of finding.
- POL-SUBPROC-v1.0 disclosure workflow rebuilt as a JIRA gate on the runbook RB-FieldOps-Sync-004 update process. Owner: Liam Hayashi.
- Customer notice sent to Talos Steelworks and Cresta Health Network on 2028-05-12.

## Closure criteria

- Registry current: Yes.
- Process gate live: Yes.
- Customer notices acknowledged: Yes.

## Closed

2028-06-02 — Dr Sara Vance accepted closure.

## Cross-references

- INC-2028-0034 (originating incident)
- RB-FieldOps-Sync-004 (the remediation runbook)
- POL-SUBPROC-v1.0
- POL-VENDOR-v1.0
