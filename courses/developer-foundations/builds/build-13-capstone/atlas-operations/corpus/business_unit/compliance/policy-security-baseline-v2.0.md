---
content_type: policy
region: noram
title: Atlas Security Baseline Policy v2.0
---

# Atlas Security Baseline Policy v2.0 (POL-SECBASE-v2.0)

**Owner:** Dr Sara Vance (Chief Compliance Officer)
**Co-owner:** Marcus Ortiz (Principal Architect)
**Effective:** 2028-03-15

## Purpose

Sets the minimum security controls applicable to every Atlas product (Atlas E-220, Atlas Pulse, Atlas BuildingHub, Atlas Logix, Atlas FieldOps, Atlas Grid, Atlas Aura, Atlas Ledger) and every Atlas internal system. Maps to NIST 800-53 r5 control families.

## Baseline controls

| Control family | Baseline | Mapped reg |
|---|---|---|
| Access control | MFA on every privileged interface; quarterly access review | NIST AC-2, AC-3 |
| Audit | Audit logs immutable; 7-year retention for Regulated data | NIST AU-2, AU-11 |
| Configuration mgmt | Infrastructure-as-code with mandatory peer review | NIST CM-3 |
| Identification | Federated SSO; service accounts inventoried | NIST IA-2 |
| Incident response | Per POL-INCIDENT-v2.0; 72-hour breach notification clock | NIST IR-4, IR-6 |
| Risk assessment | Annual product risk assessment by product owner | NIST RA-3 |
| System integrity | Flaw remediation per POL-INCIDENT-v2.0; mandatory pre-release qualification (AF-2028-001 reinforced this) | NIST SI-2 |

## Hardening

- All production hosts run an Atlas-approved hardened base image.
- All network egress is logged; only allow-listed destinations.
- All customer-facing endpoints front-ended by Atlas WAF.

## Product-specific augmentation

- Atlas Ledger inherits the NIST control set plus SOX-specific controls (see Atlas SOX §404 Position).
- Atlas BuildingHub inherits the NIST control set plus HIPAA technical safeguards (see Atlas HIPAA Position).
- Atlas Logix and Atlas BuildingHub additionally inherit EU AI Act transparency controls per POL-AIUSE-v1.0.

## Exceptions

Time-bound only. Maximum 90 days. CCO + responsible VP signature.

## Cross-references

- Atlas Data Handling Policy v3.1 (POL-DATA-v3.1)
- Atlas Incident Response Policy v2.0 (POL-INCIDENT-v2.0)
- Atlas Vendor Security Assessment Policy v1.0 (POL-VENDOR-v1.0)
