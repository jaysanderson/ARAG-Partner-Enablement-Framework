---
content_type: deployment_guide
region: noram
title: Atlas BuildingHub HIPAA-Relevant Deployment Guide
---

# Atlas BuildingHub HIPAA-Relevant Deployment Guide

**Audience:** Atlas Customer Success engineers deploying Atlas BuildingHub to HIPAA covered-entity customers (Cresta Health Network is the canonical example)
**Owner:** Aisha Okonkwo (Director of Customer Success)
**Compliance reviewer:** Dr Sara Vance (CCO)

## Pre-deployment

1. Confirm BAA executed with the customer per the standard Atlas HIPAA BAA (currently 2026 standard; refresh under RFC review for 2029).
2. Confirm POL-AIUSE-v1.0 compliance review complete for any BuildingHub AI feature deploying into the environment.
3. Confirm HIPAA-impact assessment complete per AF-2028-007 remediation. This is a deploy gate; no exception.
4. Confirm Atlas sub-processor registry current and customer notice issued for any Tier 1 sub-processor change in the prior 30 days (POL-SUBPROC-v1.0).

## Deployment

1. Install via the standard Atlas BuildingHub installer. Reject default credentials (AF-2028-034 lesson).
2. Configure facility-alert pipeline routing per the customer's HIPAA-monitored alert handling.
3. Enable audit logging at the policy-defined granularity. Retention 6 years per POL-RETENTION-v1.0 for HIPAA-relevant alerts; 7 years for audit logs.
4. Configure firmware-update channel to the HIPAA-relevant channel (not the general channel).

## Post-deployment

1. Customer signs off on the deployment via the standard Atlas BuildingHub acceptance form.
2. Atlas issues the HIPAA-relevant customer notification baseline (template canonical per AF-2028-028 remediation).
3. The runbook RB-BldHub-Firmware-003 is the active remediation runbook for any subsequent firmware-rollback need.

## Ongoing operations

- Quarterly HIPAA technical evaluation per §164.308(a)(8). Atlas-side evidence delivered to customer.
- Annual algorithmic impact assessment refresh per POL-AIUSE-v1.0.
- Annual DPIA refresh (where customer is EMEA — Cresta's EMEA sites are in scope; see AF-2028-040 for the pattern).

## Cross-references

- Atlas Code of Conduct v3.1, POL-DATA-v3.1, POL-INCIDENT-v2.0
- POL-AIUSE-v1.0, POL-SUBPROC-v1.0, POL-RETENTION-v1.0, POL-RECORDS-v1.0
- AF-2028-007, AF-2028-028, AF-2028-034, AF-2028-040
- RB-BldHub-Firmware-003
- INC-2028-0019
