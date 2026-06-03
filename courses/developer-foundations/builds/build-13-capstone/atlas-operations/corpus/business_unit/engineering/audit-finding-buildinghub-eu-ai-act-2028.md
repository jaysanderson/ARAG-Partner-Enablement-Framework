---
content_type: audit_finding
region: emea
title: Audit Finding — BuildingHub EU AI Act Conformity (2028)
---

# Audit Finding · BuildingHub EU AI Act Conformity (2028)

**Auditor:** External notified body (EMEA)
**Atlas-side owner:** Dr Sara Vance (Compliance), Priya Anand (Engineering)
**Issued:** 2028-03-30
**Status:** Open — remediation tracked through 2028-Q4

## Finding

Atlas BuildingHub was assessed against the EU AI Act per the limited-risk classification proposed in rfc-eu-ai-act-product-classification.md. The notified body accepted the classification but identified three gaps in supporting evidence:

1. **Article 9 risk-management documentation** — Existed but not version-controlled with the firmware release.
2. **Article 52 transparency disclosure** — Present in customer-facing operator UI but absent from the API documentation.
3. **Article 14 human oversight** — The clinical-rule pack (per design-doc-aura-hvac-scheduler.md) provides oversight at the system level; the notified body asked for explicit per-decision audit trail showing the human-overridable point in each HVAC scheduling decision.

## Remediation

| Gap | Action | Owner | Target |
|---|---|---|---|
| Art. 9 docs in firmware release | Add risk-management doc to firmware release manifest | Priya Anand | 2028-Q3 |
| Art. 52 in API docs | Update Logix and BuildingHub API reference | Aisha Okonkwo | 2028-Q3 |
| Art. 14 per-decision audit | Engineering work to surface override point in scheduling audit log | Marcus Ortiz | 2028-Q4 |

## Compliance posture

- **EU AI Act Art. 6 / 9 / 14 / 52.** Limited-risk classification preserved.
- **POL-INCIDENT-v2.0.** No incidents in this audit window.
- **HIPAA.** Cresta-side HIPAA implications unaffected.

## Customer impact

- **Cresta Health Network** — Aware of audit; remediation does not affect their clinical operations.
- **Other BuildingHub customers in EMEA** — Will see improved transparency disclosures in API documentation.

## Related

- rfc-eu-ai-act-product-classification.md
- design-doc-buildinghub-firmware.md
- design-doc-aura-hvac-scheduler.md
- design-doc-buildinghub-occupancy-feeds.md
