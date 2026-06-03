---
content_type: runbook
region: noram
title: Compliance Runbook — Regulator Document Request Response
---

# Compliance Runbook — Regulator Document Request Response

**Owner:** Dr Sara Vance (CCO)
**Co-owner:** General Counsel
**Last reviewed:** 2028-11
**Applicability:** Any direct document request from a regulator (HHS for HIPAA, EU national DPA for GDPR, SEC indirectly via customer, BIS for export, EU AI Office for AI Act).

## When to invoke

On receipt of any formal document request, subpoena, or informal regulator inquiry that names Atlas. Customer audit-support requests follow a separate workflow.

## Steps

1. **T+0:** General Counsel routes the request to CCO. Confidentiality flag set.

2. **T+24 hours:** Scope assessment. CCO and General Counsel determine: regime, jurisdiction, customer implications (if any), document classes implicated. POL-RECORDS-v1.0 legal-hold considered.

3. **T+48 hours:** Legal hold instituted if appropriate. Custodian list created. Hold acknowledgements tracked.

4. **T+5 BD:** Document collection plan published. Owners assigned per record class:
   - HIPAA / Cresta-related: Aisha Okonkwo + Compliance.
   - GDPR / EMEA customer-related: Priya Anand or Marcus Ortiz + Compliance.
   - SOX / Meridian-related: CFO + Compliance.
   - Export controls: General Counsel + relevant product VP.
   - AI Act: Priya Anand + Compliance.

5. **T+by-deadline:** Response package assembled, privileged-document review completed, production delivered to regulator via the appropriate secure channel.

6. **T+post-response:** Audit_finding opened if the inquiry surfaced any Atlas-internal deficiency. RFC opened if the inquiry implied a policy gap.

## What we do not do

- Do not respond directly to the regulator without General Counsel involvement.
- Do not delete or modify documents in scope (legal hold).
- Do not communicate substantively with the affected customer about the inquiry until General Counsel authorises (some regimes prohibit tip-offs).

## Cross-references

- POL-RECORDS-v1.0
- POL-INCIDENT-v2.0
- POL-DATA-v3.1
- RFC — Atlas Regulator Engagement Framework
- Hold-2028-003 (current active hold, Cresta-related)
