---
content_type: rfc
region: emea
title: RFC — Engagement Survey Redesign
---

# RFC — Engagement Survey Redesign

**Author**: Maya Schwartz's office (People Analytics).
**Reviewers**: Priya Anand, Marcus Ortiz, Aisha Okonkwo, Liam Hayashi, Dr Sara Vance.
**Status**: Open for comment.

## Problem

Atlas runs a twice-yearly engagement survey through Culture Amp. Response rate has declined from 88% (FY25) to 71% (FY28). Free-text comment depth has declined. Manager action plans following the survey are uneven in quality.

Diagnosis: the survey is too long (62 questions), the cadence is wrong (twice a year is too infrequent for action and too frequent for fatigue), and managers don't have lightweight tooling to act between cycles.

## Proposed redesign

Three-part redesign:

### 1. Quarterly pulse + annual deep dive

- Quarterly pulse: 12 questions, 5 minutes. Drivers: belonging, manager quality, role clarity, growth, wellbeing, intent-to-stay.
- Annual deep dive: 35 questions, 12 minutes. Drivers as above plus diversity & inclusion, leadership trust, business confidence, ethics climate, fairness.

### 2. Always-on listening for safety-sensitive populations

For Liam Hayashi's Field Operations org and other safety-sensitive populations, an always-on micro-survey through the Atlas FieldOps app surfaces near-real-time signal on safety culture, wellbeing and burnout risk. Aggregated weekly to the regional Field Operations lead and Maya Schwartz.

### 3. Manager action tooling

A simple action-planner in Workday with templates per common pattern (e.g., manager-coaching score low; team workload concerns; growth signals weak). Aisha Okonkwo's CSM managers piloted a prototype in FY28 with strong reception.

## Cadence

| Population | Pulse | Deep dive |
|---|---|---|
| All Atlas employees | Quarterly | Annual (April) |
| Field Operations (Liam Hayashi's org) | Pulse + always-on micro-survey | Annual (April) |
| Engineering (Priya Anand, Marcus Ortiz) | Standard pulse | Annual (April) |
| CSM (Aisha Okonkwo) | Standard pulse | Annual (April) |
| Compliance (Dr Sara Vance) | Standard pulse | Annual (April) |

## Action accountability

- Manager publishes team action plan within 30 days of pulse close.
- Skip-level reviews action plans.
- Aggregate org metrics published transparently in Atlas People Report (annual).

## Risk

- Always-on micro-survey for Field Operations could erode trust if perceived as surveillance. Mitigated by transparency about how data is used and aggregated.
- Manager action-planning template risks "templated" responses. Mitigated by skip-level review and Maya Schwartz's office reviewing the lowest-scoring teams' actions.
- Data sensitivity: engagement survey data classified Restricted per `data-handling-hr-supplement.md`; Dr Sara Vance's office reviewed proposed handling.

## Cost

- Culture Amp redesign: $90,000.
- Atlas FieldOps app integration (micro-survey): $60,000.
- Workday action-planner: $40,000.
- Internal labour: 1.0 FTE for 6 months.
- Total: ~$280,000.

## Decision needed

Sign-off from named reviewers by T+30 calendar days. Maya Schwartz finalises and routes to CFO for funding.
