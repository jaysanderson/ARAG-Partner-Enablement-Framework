---
content_type: case_study
region: emea
title: Cresta Health Network HIPAA Remediation Arc — INC-2028-0019 to AF-2028-040
---

# Cresta Health Network HIPAA Remediation Arc

**Prepared by:** Dr Sara Vance (CCO) and Aisha Okonkwo (Director of Customer Success)
**Audience:** Atlas Compliance Council and Cresta Health Network executive sponsor

## Arc overview

A single customer thread — Cresta Health Network's Atlas BuildingHub deployment — anchors the most consequential compliance work Atlas executed in 2028. This case study consolidates the arc for institutional learning.

## Timeline

1. **2028-02-12** — INC-2028-0019 detected. BuildingHub firmware 5.2.1 introduced an HVAC scheduling regression generating facility alerts crossing the HIPAA-monitored alert pipeline at 14 Cresta sites.

2. **2028-02-14 to 2028-02-21** — Firmware rolled back via RB-BldHub-Firmware-003 across all Cresta sites. Aisha Okonkwo led customer communications; Priya Anand led engineering remediation.

3. **2028-03-15** — AF-2028-007 closed. HIPAA-impact assessment now mandatory for all BuildingHub firmware releases. HIPAA-relevant customer notification template standardised.

4. **2028-06-15** — POL-AIUSE-v1.0 explicitly prohibits AI feature deployment into HIPAA-relevant Cresta environments without HIPAA-impact assessment.

5. **2028-09-28** — AF-2028-028 closed. Notification template drift remediated.

6. **2028-Q3** — AF-2028-040 opened. GDPR DPIA refresh needed for Cresta's EMEA sites given the material risk-profile change.

## Lessons institutionalised

- HIPAA-impact assessment is now a deploy gate, not an after-the-fact review.
- Cresta-specific notification templates are version-controlled in the compliance docs portal.
- DPIA refresh triggers are explicit in POL-DATA-v3.1.
- The proposed HIPAA BAA refresh (RFC under Council review) consolidates these lessons into the contractual layer.

## Customer outcome

Cresta's CCO publicly stated at the 2028 healthcare CIO summit that Atlas's transparent handling of INC-2028-0019 reinforced rather than damaged trust. Atlas BuildingHub renewal for Cresta closed 2028-Q4 with a contract expansion.

## Cross-references

- INC-2028-0019
- AF-2028-007, AF-2028-028, AF-2028-040
- RB-BldHub-Firmware-003
- POL-AIUSE-v1.0
- RFC — Atlas HIPAA Business Associate Agreement Standard Refresh
