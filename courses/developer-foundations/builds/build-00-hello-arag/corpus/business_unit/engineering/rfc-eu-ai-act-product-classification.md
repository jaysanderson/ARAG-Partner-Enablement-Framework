---
content_type: rfc
region: emea
title: RFC — EU AI Act Product Classification
---

# RFC · EU AI Act Product Classification

**Authors:** Priya Anand, Dr Sara Vance
**Status:** Approved
**Open period:** 2028-Q1 (comments closed)

## Summary

The EU AI Act applies to Atlas BuildingHub and Atlas Logix per the regulations anchor list. This RFC proposes a single, defensible classification per product, the supporting evidence each requires, and the engineering controls that flow from the classification.

## Proposal

| Product | Classification | Rationale |
|---|---|---|
| Atlas BuildingHub | Limited-risk (Art. 52) | HVAC scheduling outputs are recommendations; final action is gated by deterministic Safety Supervisor and clinical-rule packs. |
| Atlas Logix | Limited-risk (Art. 52) | Routing decisions are recommendations to dispatch operators; no automated rejection of human goods movement. |
| Atlas Pulse | Limited-risk (Art. 52) | Despite EMEA deployment, Pulse is not currently on the regulations anchor list; we add Pulse here for forward consistency. |

Atlas Aura inherits BuildingHub's HVAC classification through the design-doc-aura-hvac-scheduler.md occupancy contract.

## Controls per classification

- **Limited-risk.** Article 52 transparency obligations — affected operators informed they are interacting with AI-generated recommendations. Inline disclosure in product UI.
- **Limited-risk.** Maintain Article 9 risk-management documentation per product.
- **Limited-risk.** Annual independent review by Dr Sara Vance.

## Alternatives considered

- **Classify Logix as high-risk (Art. 6 Annex III).** Rejected: routing of goods is not an enumerated high-risk category.
- **Classify BuildingHub as high-risk.** Rejected: HVAC is not safety-critical infrastructure under Annex II.

## Compliance posture

- Aligns with EU-AI-ACT scope.
- Dr Sara Vance owns the audit-evidence package across the named products.

## Related

- audit-finding-buildinghub-eu-ai-act-2028.md
- design-doc-pulse-smartgrid-optimiser.md
- design-doc-aura-hvac-scheduler.md
