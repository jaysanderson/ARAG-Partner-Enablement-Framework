---
content_type: policy
region: emea
title: Atlas AI Use Policy v1.0
---

# Atlas AI Use Policy v1.0 (POL-AIUSE-v1.0)

**Owner:** Dr Sara Vance (Chief Compliance Officer)
**Co-owner:** Priya Anand (VP Engineering)
**Effective:** 2028-05-01
**Review:** Quarterly through 2028; annual from 2029

## Purpose

Defines how Atlas Global Industries develops, deploys, and operates AI / ML capabilities — both inside Atlas products (Atlas Pulse, Atlas BuildingHub, Atlas Logix, Atlas Grid) and inside internal Atlas workflows (engineering productivity, customer support triage, sales drafting).

## Scope

All Atlas employees and contractors. All five business units. Explicitly covers internal use of third-party LLMs (e.g., for code generation, support summarisation, sales drafting).

## Governing regulation

This policy operationalises Atlas's obligations under the EU AI Act for in-product AI (see Atlas EU AI Act Applicability Position 2028) and reflects voluntary alignment with the NIST AI Risk Management Framework for NORAM operations.

## Product AI

For every Atlas product that ships ML / AI features, the product owner must maintain:

- An algorithmic impact assessment, refreshed annually.
- A documented intended-use statement and explicit list of out-of-scope uses.
- A human-oversight mechanism for any decision the customer designates as material.
- Training data lineage records, retained per POL-DATA-v3.1.

Current in-scope products: Atlas Pulse (Priya Anand), Atlas BuildingHub (Aisha Okonkwo), Atlas Logix (Marcus Ortiz), Atlas Grid (Marcus Ortiz).

## Internal AI

- Employees may use approved LLMs for non-Regulated data only. The approved-tools registry is maintained by Compliance.
- Customer data may never be pasted into a third-party LLM without an executed DPA covering the LLM provider as a sub-processor (see POL-SUBPROC-v1.0).
- All AI-generated customer-facing content must carry an internal disclosure tag and be human-reviewed before send.

## Prohibitions

- No autonomous AI decisioning on hiring, firing, performance ranking, customer-pricing approvals, or compliance findings.
- No deployment of AI features into HIPAA-relevant Atlas BuildingHub customer environments (Cresta Health Network) without prior HIPAA-impact assessment.

## Cross-references

- Atlas EU AI Act Applicability Position 2028
- Atlas Data Handling Policy v3.1 (POL-DATA-v3.1)
- Atlas Sub-Processor Management Policy v1.0 (POL-SUBPROC-v1.0)
