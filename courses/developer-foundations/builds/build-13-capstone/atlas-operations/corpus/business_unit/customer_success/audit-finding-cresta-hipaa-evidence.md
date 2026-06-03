---
content_type: audit_finding
region: emea
title: Audit Finding AF-2028-007 — Cresta HIPAA Evidence Trail (closed)
---

# Audit Finding · AF-2028-007 — Cresta HIPAA Evidence Trail

**Finding ID:** AF-2028-007
**Customer-context:** Cresta Health Network
**Owning function:** Customer Success (Aisha Okonkwo), with Compliance co-ownership (Dr Sara Vance)
**Regulation:** HIPAA
**Status:** Closed 2028-03-31

## Background

INC-2028-0019 (Atlas BuildingHub firmware regression) produced a 14-site rollback campaign at Cresta Health Network. As part of the post-incident review, Cresta's external auditor identified an evidence-trail gap: Atlas's incident documentation did not include a structured, time-stamped record of patient-data-exposure determination.

While there was no patient-data exposure (Dr Sara Vance had confirmed this in the day-2 escalation review), the evidence trail to support that determination was distributed across email and meeting notes rather than a single auditable record.

## Finding

Atlas's customer-success function did not produce a structured patient-data-exposure-assessment document for the INC-2028-0019 incident as part of the standard incident-handling artefacts.

## Severity

Medium. No patient data was exposed. The finding is process-and-evidence, not breach.

## Remediation

1. Aisha Okonkwo authored a structured patient-data-exposure-assessment document for INC-2028-0019, retroactively.
2. The document was incorporated into Cresta's HIPAA evidence pack (see `escalation-cresta-hipaa-audit-prep.md`).
3. POL-INCIDENT-v2.0 (v2.0) was updated to require a patient-data-exposure-assessment as a standard artefact for any healthcare-customer incident.

## Closure verification

- 2028-03-31: Cresta's external auditor accepted the retroactive document and the updated policy.
- 2028-06-12: Cresta's external HIPAA audit subsequently passed clean.

## Lessons captured

- Evidence-trail design should anticipate auditor expectations, not just internal incident-handling needs.
- Cross-functional incident artefacts (CS + Compliance) require explicit ownership.
- Retroactive remediation is acceptable in good faith; preventing recurrence is the higher priority.

## Related

- INC-2028-0019, RB-BldHub-Firmware-003
- POL-INCIDENT-v2.0 (v2.0 release)
- `escalation-INC-2028-0019.md`
- `escalation-cresta-hipaa-audit-prep.md`
- `case-study-cresta-recovery.md`
