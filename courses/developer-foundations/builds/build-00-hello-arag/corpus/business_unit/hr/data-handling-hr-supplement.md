---
content_type: policy
region: emea
title: HR Data Handling Supplement to POL-DATA-v3.1
---

# HR Data Handling Supplement to POL-DATA-v3.1

The Atlas Data Handling Policy `POL-DATA-v3.1` is the umbrella policy. This supplement details HR-specific obligations because HR processes uniquely sensitive personal data — pay, health, performance, complaints — across all 60,000 employees globally.

## Classes of HR data

| Class | Examples | Classification |
|---|---|---|
| Identifying | Name, employee ID, work email | Internal |
| Compensation | Base, bonus, equity, band | Restricted |
| Performance | Reviews, PIP, calibration notes | Restricted |
| Health | Leave reasons, accommodations | Highly Restricted |
| Relations | Investigations, complaints | Highly Restricted |
| Background | Pre-hire screening | Highly Restricted (retention-bounded) |

## Storage

- Workday is the system of record for all classes.
- Investigation files held in NavexEthics with read-locked exports.
- No HR data may be exported to personal devices, personal email, or non-Atlas cloud storage.
- Spreadsheet snapshots are forbidden for Highly Restricted data — analytics goes through the HR Analytics tenant only.

## Access

- HRBP access scoped to their assigned business units (e.g., the Customer Services HRBP sees Aisha Okonkwo's and Liam Hayashi's teams, not Priya Anand's Engineering org).
- Managers see their direct reports' performance and compensation but not other classes.
- Maya Schwartz holds global read-only across all classes for governance.
- Dr Sara Vance receives summary metrics, not record-level access, except during a triggered investigation.

## Retention

| Class | Retention |
|---|---|
| Identifying | 7 years post-separation |
| Compensation | 7 years post-separation |
| Performance | 7 years post-separation |
| Health | 2 years post-event unless legal hold |
| Relations / investigations | 7 years from closure |
| Background | 2 years from hire, or job-offer-rescinded date |

## GDPR specifics (EMEA)

- EMEA employees may exercise subject-access requests through the Atlas DPO portal. SLA: 30 calendar days.
- Right-to-erasure does not apply to records required for employment law (payroll, tax). Atlas applies pseudonymisation where erasure is requested but legally constrained.
- EMEA employee data does not leave the EEA except through the Atlas SCC-protected data-transfer framework, audited annually by Dr Sara Vance's office.

## HIPAA crossover

Cresta Health Network case work occasionally generates HR overlap (e.g., a CSM observing a HIPAA incident at a customer site). The default rule: HR processes the employee-impact side; the customer-impact side stays with the Cresta Health Network engagement team under HIPAA controls.

## Breach handling

Any suspected breach of HR data is reported within 4 hours to Maya Schwartz, Dr Sara Vance and the Atlas CISO. The `POL-INCIDENT-v2.0` incident-response policy governs the technical handling; HR governs notification to affected employees.
