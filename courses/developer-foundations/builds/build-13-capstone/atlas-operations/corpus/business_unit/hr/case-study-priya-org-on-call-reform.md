---
content_type: case_study
region: emea
title: Case Study — On-Call Reform After Q4 Turbine Cooling Incident
---

# Case Study — On-Call Reform After Q4 Turbine Cooling Incident

Documented by Maya Schwartz's office for inclusion in the Manager Essentials Module 10 (Manager Wellbeing) case-study library.

## Trigger

The Q4 turbine cooling regression `INC-2027-0142` on Atlas E-220 generated a 22-hour continuous bridge for Priya Anand's EMEA engineering team. The technical response was excellent — Priya's team executed the fix and produced the post-mortem and the remediation runbook `RB-E220-Cooling-001` now widely cited. But the people-side cost was real: two engineers were on bridge >18 hours; the team's working-time exposure was material.

## People-side findings from the post-mortem

The post-mortem people-side annex (per `incident-response-hr-runbook.md`) surfaced:

1. The on-call team was thinner than declared. Two senior engineers had been treated as "shadow primary" for months because the team had not yet refilled a departure. The on-call rotation showed full coverage on paper.
2. Working-time policy was breached for both engineers. The HRBP did not flag during the bridge.
3. Recovery time was inadequate. The engineers returned to standard load within 48 hours.
4. Buddy support during long bridges was informal and patchy.

## Reforms

### Engineering reforms (Priya Anand owned)

- Refilled the open headcount within 30 days.
- Renamed "shadow primary" — it is now either real primary or it is not on the rota.
- Updated `RB-E220-Cooling-001` with a recovery-window protocol explicitly handing off to a fresh primary at 8 hours, regardless of incident state.

### HR reforms (Maya Schwartz owned)

- Updated `working-time-policy-emea.md` to harden bounds and named consequence pathway for breaches.
- Updated `incident-response-hr-runbook.md` to require an HR-Incident-Lead bridge presence for any P1/P2 expected to exceed 8 hours.
- Manager Essentials Module 10 added a unit on protecting team boundaries during sustained incidents.

### Cross-region adoption

Marcus Ortiz's NORAM Engineering org adopted the EMEA recovery-window protocol within 90 days. Liam Hayashi's APAC Field Operations org adopted a field-equivalent: any field technician on a customer site for more than 16 hours triggers a rotation, not a continued shift.

## Outcomes (12 months post-reform)

- No working-time breaches in Priya Anand's org for the following 12 months.
- One subsequent P1 incident on Atlas Pulse handled within the recovery-window protocol cleanly.
- Engineer engagement scores in the affected team recovered to pre-incident levels within 6 months.
- Marcus Ortiz cited the reform pattern at the FY28 Engineering all-hands as the example of "engineering-HR co-ownership of culture".

## People-side learnings

1. Technical post-mortems must include a people-side annex by default, not by exception.
2. "Shadow primary" is a euphemism for under-staffed on-call. Name it accurately.
3. Recovery windows are not perks — they are operational requirements.
4. HRBP presence on long bridges is non-optional going forward.
5. Working-time policy is meaningful only when breaches have named pathways and consequences.

## Cross-references

This case study is required reading in `onboarding-engineering-priya-org.md` for all new EMEA Engineering hires and informs the working-time-policy text directly.
