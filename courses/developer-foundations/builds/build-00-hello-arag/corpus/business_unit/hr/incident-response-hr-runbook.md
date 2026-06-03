---
content_type: runbook
region: noram
title: HR Runbook — People-Side of an Incident
---

# HR Runbook — People-Side of an Incident

Atlas's Incident Response Policy `POL-INCIDENT-v2.0` covers the technical and customer-impact side of an operational incident. This runbook governs the people-side: when an incident impacts Atlas employees, how HR responds. Owned by Maya Schwartz.

## When this runbook fires

Any operational incident severity P1 or P2 where the technical response window is expected to exceed 8 hours, OR any incident where an Atlas employee's wellbeing is potentially affected (e.g., a field technician involved in a safety event, a CSM in a high-pressure customer escalation, an engineer on a long bridge call).

Notable historical activations:
- `INC-2027-0142` Q4 turbine cooling regression on Atlas E-220 — Priya Anand's team on continuous bridge 22 hours, HR activated relief rotation.
- `INC-2028-0034` Atlas FieldOps offline sync corruption — Liam Hayashi's field team activated stop-work; HR coordinated debrief.

## Roles

| Role | Owner | Responsibility |
|---|---|---|
| HR Incident Lead | On-call HRBP | Coordinates HR response |
| Wellbeing checker | HRBP for the affected team | 1:1 with each affected employee within 24h |
| Manager support | Affected employee's manager | Tactical workload coverage |
| HR exec sponsor | Maya Schwartz or designate | Senior decision authority |

## Steps

### Step 1: Activation (T+0)

- On-call HRBP paged by the technical incident commander when activation conditions met.
- HRBP confirms scope: which employees affected.
- HRBP joins the incident bridge in listen-only mode initially.

### Step 2: Relief rotation (T+2 to T+8 if technical incident extends)

- Identify employees on the bridge >4 hours.
- Coordinate with manager (Priya Anand / Marcus Ortiz / Aisha Okonkwo / Liam Hayashi depending on org) to rotate fresh engineers in.
- Atlas Working Time Policy boundaries enforced strictly. EMEA per `working-time-policy-emea.md`.

### Step 3: Wellbeing check (T+24)

- HRBP holds 1:1 with each materially involved employee within 24 hours of incident resolution.
- Standard 3 questions: How are you doing? Did you feel adequately supported during the incident? Is there anything we should do differently next time?
- Themes captured in the incident post-mortem people-side annex.

### Step 4: Post-mortem participation (T+48 to T+5d)

- HRBP attends the technical post-mortem to surface people-side findings.
- Maya Schwartz reviews the people-side annex of every P1 post-mortem.

### Step 5: Follow-ups (T+5d to T+30d)

- Manager runs follow-up 1:1s with each affected employee at week 1, week 2 and week 4.
- HRBP closes the loop in Workday.

## Special situations

### Safety event in Field Operations

Triggers the Field Operations Safety Policy reporting tree as well — Liam Hayashi notified within 1h.

### Personal trauma from customer behaviour

Any incident where customer behaviour caused employee distress (rare but documented in two FY27 cases) routes to the Atlas Ethics Line as an Atlas-customer behaviour log; Maya Schwartz reviews with Dr Sara Vance.

## Anti-patterns

- HRBP doing reactive 1:1s 2 weeks after an incident.
- Letting on-call engineers exceed working-time limits "because it's an emergency".
- Not routing customer-caused employee trauma to the Ethics Line.
