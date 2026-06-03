---
content_type: deployment_guide
region: emea
title: Atlas BuildingHub Deployment Guide
---

# Atlas BuildingHub Deployment Guide

This guide is the canonical customer-facing deployment document for Atlas BuildingHub. Used by Aisha Okonkwo's customer success team for every new BuildingHub deployment.

## Phase 1 — Discovery (Week 1)

- Site survey. Identify HVAC zones, access-control endpoints, and existing facility-management integrations.
- Customer facility team training (4 hours, on-site or remote).
- Compliance scoping. For HIPAA-regulated deployments (e.g., Cresta Health Network), Dr Sara Vance joins the kickoff.

## Phase 2 — Installation (Weeks 2-4)

- Atlas BuildingHub site-controller installation. Approximately one-day install per site.
- Zone-extender installation. Approximately 2 hours per zone-extender.
- Firmware verification. **Always deploy on the current known-good firmware (currently 5.1.8 — pending 5.3 release).** Do NOT deploy 5.2.x firmware per RB-BldHub-Firmware-003.

## Phase 3 — Integration (Weeks 3-6)

- Integration with customer's facility management system (FMS).
- Integration with HVAC zoning configuration.
- For HIPAA-relevant customers: integration with patient-care monitoring alert pipeline.

## Phase 4 — Verification (Week 7)

- 7-day verification window. Monitor for anomalies.
- Hand-off to customer's day-to-day facility team.

## Phase 5 — Ongoing operations

- Quarterly business review with Aisha Okonkwo or assigned CSM.
- Annual compliance review (HIPAA-regulated deployments — Dr Sara Vance joins).
- Firmware upgrades on the Atlas-recommended cadence.

## Escalation

- Customer-side issues: route through Aisha Okonkwo.
- Firmware issues: route through Priya Anand (engineering ownership).
- Compliance issues: route through Dr Sara Vance.

## Reference deployments

- Cresta Health Network (14 hospitals, HIPAA) — see `case-study-cresta-health.md`.
- Other deployments listed in the BuildingHub customer registry.
