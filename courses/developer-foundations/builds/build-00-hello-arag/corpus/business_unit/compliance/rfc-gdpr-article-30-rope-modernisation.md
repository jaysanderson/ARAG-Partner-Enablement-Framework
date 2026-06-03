---
content_type: rfc
region: emea
title: RFC — GDPR Article 30 Record of Processing Activities Modernisation
---

# RFC — GDPR Article 30 Record of Processing Activities Modernisation

**Status:** Draft for Atlas Compliance Council review
**Author:** Dr Sara Vance (CCO)
**Target decision date:** 2029-Q1

## Background

GDPR Article 30 obligates controllers and processors to maintain records of processing activities (RoPA). Atlas operates as processor for all EMEA customer-data processing; the current RoPA is a static spreadsheet refreshed semi-annually by the Compliance team.

AF-2028-025 identified that read-path access logging for Halcyon Logistics needed per-record granularity. The remediation surfaces a broader question: should Atlas's RoPA be a derived view over runtime telemetry rather than a manually-maintained artefact?

## Proposal

Replace the spreadsheet RoPA with an automated derivation pipeline:

1. Each Atlas product (Atlas Logix, Atlas FieldOps, Atlas BuildingHub, Atlas Pulse, Atlas Aura, Atlas Grid, Atlas Ledger, Atlas E-220) emits a structured processing-activity manifest at deploy time.
2. The manifest enumerates: data classes processed, purposes, retention reference (to POL-RETENTION-v1.0), legal basis, sub-processors implicated.
3. The Compliance dashboard renders the RoPA from manifests, refreshed nightly.
4. Manual overrides remain possible for customer-specific clauses.

## Benefits

- Eliminates spreadsheet drift.
- Couples policy enforcement to deploy gating (a product missing a manifest cannot deploy).
- Customers can request their own RoPA extract on demand.

## Cost / risk

- Engineering effort: ~6 sprint-weeks across Priya Anand's and Marcus Ortiz's organisations.
- Initial accuracy must be validated against the existing spreadsheet.
- Manifest schema becomes a versioned contract requiring change-control.

## Open questions

- Should the manifest schema be open-sourced for customer interoperability?
- Should Article 30 record extracts be auto-attached to customer audit deliverables (e.g., the Atlas SOX §404 deliverable bundle for Meridian Bank)?

## Cross-references

- AF-2028-025
- POL-DATA-v3.1
- POL-RETENTION-v1.0
- POL-XBORDER-v1.0
- Atlas GDPR Controller/Processor Position
