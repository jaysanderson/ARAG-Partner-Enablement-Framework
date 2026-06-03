---
content_type: rfc
region: noram
title: RFC — Atlas Incident Severity Taxonomy v2
---

# RFC — Atlas Incident Severity Taxonomy v2

**Status:** Draft for Atlas Compliance Council review
**Author:** Dr Sara Vance (CCO)
**Co-author:** Marcus Ortiz (Principal Architect)
**Target decision date:** 2029-Q1

## Background

POL-INCIDENT-v2.0 defines a five-tier severity taxonomy (SEV-1 through SEV-5). The four anchor incidents — INC-2027-0142 (E-220 cooling regression), INC-2027-0188 (Logix memory leak), INC-2028-0019 (BuildingHub firmware), INC-2028-0034 (FieldOps offline sync corruption) — were severity-rated using v1 of the taxonomy. The v2 proposal refines two dimensions where the v1 categories caused inconsistent triage.

## v1 weaknesses

1. Customer-blast-radius and regulatory-exposure are conflated into a single severity score. Cresta Health Network's HIPAA exposure (INC-2028-0019) drove SEV-1 partly because of regulatory implications even though customer-blast-radius was bounded to 14 sites; Halcyon's Logix incident (INC-2027-0188) was SEV-1 because of blast-radius alone.

2. There is no formal hook to AF audit-finding generation. AF creation has historically been ad-hoc per incident.

## v2 proposal

1. Two-dimensional rating: Blast Radius (B1-B5) × Regulatory Exposure (R1-R5). Severity becomes a derived label rather than a primary input.

2. Mandatory audit_finding generation for any incident with R ≥ R3.

3. Cross-reference enforcement: every incident must name affected products and customers; every closed incident must name its remediating runbook (e.g., RB-E220-Cooling-001, RB-Logix-MemLeak-002, RB-BldHub-Firmware-003, RB-FieldOps-Sync-004).

## Customer impact

- Customers receive a clearer post-incident communication structure.
- Cresta Health Network in particular benefits from the explicit regulatory-exposure dimension given the HIPAA overlay.

## Cost / risk

- Re-training all four product-org incident commanders (Priya Anand, Marcus Ortiz, Aisha Okonkwo, Liam Hayashi).
- Re-rating historical incidents is *not* in scope; v2 applies forward.

## Cross-references

- POL-INCIDENT-v2.0
- POL-SECBASE-v2.0
- AF-2028-001, AF-2028-007, AF-2028-012 (the AF chain from anchor incidents)
