---
content_type: audit_finding
region: apac
title: Audit Finding AF-2028-031 — Talos Steelworks FieldOps Data Residency Verification
---

# Audit Finding AF-2028-031 · Talos Steelworks FieldOps Data Residency Verification

**Auditor:** Atlas internal audit (APAC Compliance)
**Audit cycle:** Q3 2028
**Status:** Closed
**Severity:** Major
**Owner:** Liam Hayashi (Head of Field Operations)
**Co-owner:** Dr Sara Vance (CCO)

## Finding

Talos Steelworks's master agreement contractually pins all Atlas FieldOps customer data to APAC region storage. The audit walked the FieldOps storage topology and identified a Q2 2028 disaster-recovery rehearsal in which Talos snapshot indices were replicated to a NORAM standby region for 6 hours before being torn down per the rehearsal script.

Although the replication was time-bounded and destroyed afterwards, the rehearsal itself violated the residency commitment. The rehearsal script had been authored before the Talos-specific residency clause was added to the MSA.

## Affected customers

- Talos Steelworks (sole APAC FieldOps customer in scope).

## Remediation

- Rehearsal script rebuilt to use an APAC-only standby region.
- Residency-specific test gate added to POL-BCDR-v1.0 quarterly tabletop checklist.
- Customer notice issued to Talos Steelworks with attestation that data was destroyed and never accessed.
- Compensating service credit offered and accepted.

## Closure criteria

- Rehearsal script updated and re-tested in APAC-only configuration: Yes.
- POL-BCDR-v1.0 checklist updated: Yes.
- Talos attestation issued and acknowledged: Yes.

## Closed

2028-10-12 — Dr Sara Vance accepted closure.

## Cross-references

- POL-BCDR-v1.0
- POL-XBORDER-v1.0
- INC-2028-0034 (unrelated FieldOps incident; reviewed together for completeness)
