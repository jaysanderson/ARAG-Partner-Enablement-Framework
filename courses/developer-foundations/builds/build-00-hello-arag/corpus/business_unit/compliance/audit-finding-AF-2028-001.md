---
content_type: audit_finding
region: noram
title: Audit Finding AF-2028-001 — Atlas Logix Memory Leak (NIST 800-53 r5 SI-2)
---

# Audit Finding AF-2028-001 · Atlas Logix Memory Leak Remediation

**Auditor:** Atlas internal audit (NORAM Compliance)
**Audit cycle:** Q4 2027
**Status:** Closed
**Severity:** Major
**Owner:** Marcus Ortiz (Principal Architect)

## Finding

Atlas Logix 4.7.0-4.7.2 contained a reference cycle in the routing engine that caused unbounded memory growth under sustained high traffic. The bug went undetected through pre-release qualification because the qualification suite did not include sustained-load profiling. NIST 800-53 r5 control **SI-2 (Flaw Remediation)** was satisfied reactively via patch 4.7.3 and full upgrade to 4.8, but the control would have been satisfied proactively under stronger pre-release testing.

## Affected customers

- Halcyon Logistics (primary deployment) — service credits issued.
- Meridian Bank Atlas Grid pilot — shared routing engine; minor impact.

## Remediation

- Patch 4.7.3 deployed at Halcyon (2027-12-22).
- Atlas Logix 4.8.0 GA (2028-01).
- Pre-release qualification suite now includes 96-hour sustained-load memory profiling. Owner: Marcus Ortiz.

## Closure criteria

- Patch deployed to all affected customers.
- Qualification suite updated.
- Atlas Engineering Architecture Office sign-off.

## Closed

2028-02-29 — Dr Sara Vance accepted closure.

## Cross-references

- INC-2027-0188 (the incident)
- RB-Logix-MemLeak-002 (the remediation runbook)
- NIST 800-53 r5 SI-2 (the control)
- Atlas Incident Response Policy v2.0 (POL-INCIDENT-v2.0)
