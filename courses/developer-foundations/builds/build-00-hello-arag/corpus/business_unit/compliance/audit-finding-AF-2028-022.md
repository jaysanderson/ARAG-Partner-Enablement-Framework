---
content_type: audit_finding
region: noram
title: Audit Finding AF-2028-022 — E-220 Firmware Signing Key Rotation Overdue
---

# Audit Finding AF-2028-022 · Atlas E-220 Firmware Signing Key Rotation Overdue

**Auditor:** Atlas internal audit (NORAM Compliance)
**Audit cycle:** Q2 2028
**Status:** Closed
**Severity:** Major
**Owner:** Priya Anand (VP Engineering)

## Finding

Atlas E-220 cooling firmware is signed by a hardware-backed signing key whose rotation cadence is documented as 24 months in the Atlas Security Baseline (POL-SECBASE-v2.0). The active signing key was last rotated 2026-04, exceeding the 24-month window by approximately 60 days at the time of the audit.

This is a NIST 800-53 r5 SC-12 (Cryptographic Key Establishment and Management) deviation. The lapsed key was not compromised; rotation simply slipped against the policy cadence because the prior owner left Atlas and the rotation calendar was not re-assigned.

## Affected customers

- Norvale Energy (primary E-220 deployment, EMEA).
- All E-220 customers receive signed firmware updates; rotation impacts every customer at next firmware release.

## Remediation

- Key rotation executed 2028-06-30.
- New rotation owner: Priya Anand (with a named deputy).
- Rotation calendar moved to the Atlas Compliance dashboard with 90/60/30-day reminders.
- Next rotation scheduled 2030-06-30.

## Closure criteria

- New key in use across Norvale fleet: Yes (verified via signed-firmware deployment report).
- Calendar live: Yes.
- Atlas Engineering Architecture Office sign-off: Yes.

## Closed

2028-08-04 — Dr Sara Vance accepted closure.

## Cross-references

- POL-SECBASE-v2.0
- RB-E220-Cooling-001 (firmware deployment runbook; updated to include signing-key reference field)
- INC-2027-0142 (prior E-220 incident; rotation lapse unrelated to that incident but reviewed together)
