---
content_type: rfc
region: noram
title: RFC — Atlas Ledger SOX IT General Controls Automation
---

# RFC — Atlas Ledger SOX IT General Controls Automation

**Status:** Draft for Atlas Compliance Council and CFO review
**Author:** Dr Sara Vance (CCO)
**Co-author:** Marcus Ortiz (Principal Architect)
**Target decision date:** 2029-Q1

## Background

Atlas Ledger's SOX §404 posture is healthy (zero findings across 3 Meridian Bank audit cycles). AF-2028-018 (Q1 access review cadence slip) and AF-2028-046 (penetration test recommendation backlog) however share a root cause: ITGC tasks are tracked in calendar tools rather than as enforceable control checkpoints in the engineering platform.

## Proposal

Implement SOX ITGC automation in the Atlas Ledger control plane:

1. Quarterly access review becomes a system-generated workflow that blocks production deploys until completed.
2. Pen-test remediation tickets become first-class deploy-gating items with SLA enforcement.
3. Audit-log immutability becomes a runtime-verified invariant, with verification artefacts retained per POL-RECORDS-v1.0.
4. Separation-of-duties controls become enforced by IAM policy rather than periodic review.

## Customer impact

- Meridian Bank receives a richer Atlas-side controls documentation package at each audit.
- Future Atlas Ledger customers benefit from a more demonstrable controls story at sales-cycle compliance review.

## Cost / risk

- Engineering effort: ~10 sprint-weeks (Marcus Ortiz's organisation).
- The control surface becomes more brittle to refactoring; mitigated by treating controls as code with peer review.

## Open questions

- Should ITGC automation also apply to Atlas Grid given its SOX-pilot status at Meridian Bank?
- Recommendation: yes — same control framework, same root-cause class.

## Cross-references

- Atlas SOX §404 Position
- AF-2028-018
- AF-2028-046
- AF-2028-037
- POL-SECBASE-v2.0
- POL-RECORDS-v1.0
