---
content_type: rfc
region: emea
title: RFC — EU AI Act Article 6 Applicability to Atlas BuildingHub
---

# RFC — EU AI Act Article 6 Applicability to Atlas BuildingHub

**Status:** Draft for Atlas Compliance Council review
**Author:** Dr Sara Vance (CCO)
**Co-authors:** Aisha Okonkwo (Director of Customer Success), Priya Anand (VP Engineering)
**Target decision date:** 2028-Q4

## Question

Does Article 6 of the EU AI Act (classification rules for high-risk AI systems) reclassify Atlas BuildingHub from Limited Risk to High Risk in any deployment scenario?

## Context

The 2028 applicability position categorises Atlas BuildingHub as Limited Risk. Article 6 enumerates Annex III high-risk use cases. None of the enumerated categories straightforwardly apply to commercial building automation — but the Cresta Health Network deployment crosses into HIPAA-relevant healthcare facility management, which raises a question about whether facility automation that supports healthcare delivery constitutes a "safety component" of healthcare infrastructure.

## Analysis

1. Annex III §1(a) covers safety components of products covered by EU harmonisation legislation. Building automation systems are not themselves Annex I products. The hospital information system at Cresta is the AI Act-relevant system, not the HVAC scheduler.

2. Annex III §5 covers AI used in essential public services. Private hospital HVAC scheduling does not meet the essential-public-services threshold.

3. Article 6(3) allows reclassification down where the AI does not pose significant risk. Atlas BuildingHub's HVAC scheduling does not autonomously decide patient outcomes; it optimises comfort and energy use with a human-overridable interface.

## Recommendation

Maintain the Limited Risk classification. Update the customer-facing applicability statement to Cresta Health Network to explicitly address the healthcare-adjacency question and document the analysis here as supporting evidence.

## Open questions

- Will the European Commission's anticipated 2029 guidance on healthcare-adjacent AI change the analysis? Atlas should monitor.
- Should Atlas voluntarily adopt some High-Risk obligations (e.g., post-market monitoring per Article 61) for Cresta even though not legally required? Recommendation: yes — operational maturity.

## Cross-references

- Atlas EU AI Act Applicability Position 2028
- AF-2028-007 (HIPAA finding at Cresta — informs the risk framing)
- POL-AIUSE-v1.0
