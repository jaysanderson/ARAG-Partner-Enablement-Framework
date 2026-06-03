---
content_type: rfc
region: emea
title: RFC — Incident Post-Mortem Template
---

# RFC · Incident Post-Mortem Template

**Authors:** Priya Anand, Marcus Ortiz, Dr Sara Vance
**Status:** Approved
**Open period:** 2028-Q1 (comments closed)

## Summary

The four named incidents (INC-2027-0142, INC-2027-0188, INC-2028-0019, INC-2028-0034) were each documented in different formats. This RFC proposes a single template so every future post-mortem has the same shape, in service of POL-INCIDENT-v2.0 and audit defensibility.

## Proposal

Every post-mortem includes:

1. **Identification.** ID, product, severity, dates detected/closed, owner, remediation runbook.
2. **Summary.** Two-paragraph plain-language description.
3. **Timeline.** Dated events in chronological order.
4. **Customer impact.** Per anchor customer, quantified where possible.
5. **Root cause.** Technical root cause; contributing factors.
6. **Lessons.** What changes (in engineering, in process, in runbooks).
7. **Regulatory exposure.** Per applicable regulation in the anchors set.
8. **Related.** Cross-references to runbooks, design docs, other incidents.

## Why a template

- Auditors expect comparability across incidents (Dr Sara Vance's recurring ask).
- Engineers reading old incidents shouldn't have to learn five formats.
- Allows automated extraction for the engineering analytics layer.

## Compliance

- **POL-INCIDENT-v2.0.** Template instantiates the policy's reporting requirement.
- **NIST 800-53 r5 IR-4.** Standardised post-mortem evidence.

## Adoption

Existing post-mortems (the four named) will be retrofitted to this template by end of Q3 2028.

## Related

- POL-INCIDENT-v2.0
- INC-2027-0142, INC-2027-0188, INC-2028-0019, INC-2028-0034
