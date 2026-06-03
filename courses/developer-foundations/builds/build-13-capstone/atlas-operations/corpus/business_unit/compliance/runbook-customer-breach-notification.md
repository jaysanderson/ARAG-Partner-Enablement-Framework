---
content_type: runbook
region: noram
title: Compliance Runbook — Customer Breach Notification (72-hour clock)
---

# Compliance Runbook — Customer Breach Notification (72-hour clock)

**Owner:** Dr Sara Vance (CCO)
**Last reviewed:** 2028-09
**Applicability:** Any confirmed exposure of customer data crossing the breach threshold under any applicable regime (GDPR, HIPAA, sector-specific).

## When to invoke

Invoke when an Atlas incident or audit-finding determination concludes that customer Regulated data was exposed, accessed, or rendered materially insecure outside the contracted boundary. The decision rests with the CCO on advice from the incident commander.

Examples of when NOT to invoke (these are non-breach):
- INC-2028-0019 (Cresta Health Network firmware regression) was a non-breach incident; no PHI exposed. Use the impact-update notification template instead.
- INC-2027-0142 (Norvale Energy E-220 cooling regression) — operational, no personal data implicated.

## Steps

1. **T+0:** Incident commander notifies CCO and General Counsel. Clock starts at incident commander's time-of-determination.

2. **T+2 hours:** CCO convenes the breach response cell. Members: CCO, General Counsel, product VP (Priya Anand / Marcus Ortiz / Aisha Okonkwo / Liam Hayashi as relevant), Director of Customer Success (Aisha Okonkwo) for customer-facing comms, VP People (Maya Schwartz) for any employee data implications.

3. **T+8 hours:** Initial customer notice drafted per regime (HIPAA, GDPR, sector). Use the canonical template (post-AF-2028-028 remediation; templates live in the Atlas Compliance docs portal).

4. **T+24 hours:** Notice issued to affected customers. For Cresta Health Network, the BAA refresh (RFC) commits Atlas to a 24-hour clock improving on §164.410 statutory.

5. **T+48 hours:** Regulator notice prepared if regime requires controller notification within the period (GDPR Article 33 timer runs on customer-side; Atlas as processor supports customer's clock).

6. **T+72 hours:** Statutory breach notification window closes. All customer notices issued. All regulator notices supported.

7. **T+7 days:** Initial remediation status communicated. Audit_finding opened.

## Closure

The runbook closes at audit_finding closure. The breach response cell dissolves on CCO sign-off.

## Cross-references

- POL-INCIDENT-v2.0
- POL-DATA-v3.1
- AF-2028-007, AF-2028-028 (template canonicalisation)
- RFC — Atlas HIPAA Business Associate Agreement Standard Refresh
- RFC — Atlas Incident Severity Taxonomy v2
