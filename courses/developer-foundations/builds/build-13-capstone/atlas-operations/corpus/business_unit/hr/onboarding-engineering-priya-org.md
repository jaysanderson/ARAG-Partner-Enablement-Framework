---
content_type: deployment_guide
region: emea
title: Onboarding Deployment Guide — Engineering (Priya Anand org)
---

# Onboarding Deployment Guide — Engineering (Priya Anand org)

Operational guide for HRBPs onboarding new hires into Priya Anand's EMEA Engineering org. The org owns Atlas E-220 and Atlas Pulse engineering, with shared platform contribution to Atlas Grid.

## Pre-boarding (T-14 to T-0)

- Workday req converted to hire. HRBP confirms region, level, work-location declaration.
- Equipment shipped: Atlas-managed MacBook Pro or Linux ThinkPad (Engineering choice), monitor allowance, headset.
- SSO account provisioned but locked until Day 1.
- Buddy assigned (Priya's chiefs maintain a buddy registry; chunked by sub-team).
- Day-1 plan shared with new hire 48h before start.

## Day 1

- 09:30 local: SSO unlock. Welcome by hiring manager (Priya Anand attends new-hire welcome the first Wednesday of each month for L4+ hires).
- 10:00: Atlas Code of Conduct `POL-CONDUCT-v3.1` module, Data Handling `POL-DATA-v3.1` module, Incident Response `POL-INCIDENT-v2.0` overview.
- 14:00: Engineering Foundations track kickoff in Atlas Academy.

## Week 1

- Atlas E-220 product overview (read the architecture overview, watch the 90-minute talk).
- Atlas Pulse product overview.
- Read `RB-E220-Cooling-001` and the post-mortem for the Q4 turbine cooling regression `INC-2027-0142` — this is mandatory reading regardless of which sub-team you join, because it shaped the on-call practice.
- Three 30-minute intros: tech lead, engineering manager, product partner.
- Working-time-policy briefing per `working-time-policy-emea.md`.

## Days 30 / 60 / 90

- Day 30: first PR merged. Buddy reviews onboarding sentiment with HRBP.
- Day 60: shadow on-call rotation (no primary responsibility). Complete EU AI Act technical-awareness module if joining the Pulse team (Pulse falls under EU AI Act scope).
- Day 90: first primary on-call rotation. Day-90 conversation with skip-level — Priya Anand attends for all L5+ hires.

## Customer exposure

New engineers in this org are typically exposed to Norvale Energy as the lead Atlas E-220 customer. Customer visits coordinated with Aisha Okonkwo's Customer Success team. No new hire interacts with customers in week 1.

## Cross-region context

Marcus Ortiz's NORAM Engineering org runs a parallel onboarding deployment guide for Atlas Logix and Atlas Grid hires. Engineers who later transfer between orgs follow an abbreviated cross-org orientation.

## Common pitfalls

- Underestimating EU AI Act complexity if joining Pulse.
- Skipping the post-mortem read because "I'm in a different sub-team" — every engineer must understand the on-call practice.
- Not declaring work location in Workday (required for `POL-DATA-v3.1` compliance).
