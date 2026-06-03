---
content_type: audit_finding
region: emea
title: Audit Finding AF-2028-025 — Halcyon Logix GDPR Sub-Access Logging Gap
---

# Audit Finding AF-2028-025 · Halcyon Logix GDPR Sub-Access Logging Gap

**Auditor:** Atlas internal audit (EMEA Compliance)
**Audit cycle:** Q3 2028
**Status:** Open — remediation in flight
**Severity:** Minor
**Owner:** Marcus Ortiz (Principal Architect)
**Co-owner:** Aisha Okonkwo (Director of Customer Success)

## Finding

Atlas Logix routing logs include driver identifiers (employee personal data of Halcyon Logistics drivers). POL-DATA-v3.1 requires audit-trail logging for all access to Regulated data. The Logix support-tooling read path used by Atlas Customer Services to assist Halcyon Logistics emits an aggregate access-log line per session, not per record read.

The auditor's view is that GDPR Article 30 record-of-processing-activities expectations and Atlas's own POL-DATA-v3.1 standard both require per-record granularity for Regulated-class data even on read.

## Affected customers

- Halcyon Logistics (sole Logix flagship currently).

## Remediation plan

- Logix support tooling read-path instrumented to emit per-record access events. Owner: Marcus Ortiz.
- Backfill not required; forward-looking control.
- Customer notice to Halcyon's DPO summarising remediation; no individual data-subject impact.

## Target closure

2028-Q4.

## Cross-references

- POL-DATA-v3.1
- POL-SECBASE-v2.0 (AU-2 mapping)
- Atlas GDPR Controller/Processor Position
- INC-2027-0188 (unrelated Logix incident; the support tooling reviewed here was built post-incident)
