---
content_type: deployment_guide
region: noram
title: Onboarding Deployment Guide — Engineering (Marcus Ortiz org)
---

# Onboarding Deployment Guide — Engineering (Marcus Ortiz org)

Operational guide for HRBPs onboarding new hires into Marcus Ortiz's NORAM Engineering org. The org owns Atlas Logix and Atlas Grid, with shared platform contribution to Atlas Pulse.

## Pre-boarding (T-14 to T-0)

- HRBP receives Workday req conversion. Confirms NORAM bands per `compensation-bands-noram.md`.
- Equipment: Atlas-managed laptop. Engineering may choose macOS or Linux.
- Buddy assigned from Marcus's principal-engineer-curated registry.
- Pre-read package: Atlas Logix architecture deep-dive, Atlas Grid platform overview.

## Day 1

- Welcome by hiring manager. Marcus Ortiz attends new-hire welcome for L4+ hires on a rolling basis.
- Atlas Code of Conduct `POL-CONDUCT-v3.1` and Data Handling `POL-DATA-v3.1` modules.
- Workspace tour, equipment unlock, SSO check.

## Week 1

- Atlas Logix product overview (architectural deep-dive plus operational walkthrough).
- Atlas Grid product overview.
- Read `RB-Logix-MemLeak-002` and the post-mortem for the Logix routing engine memory leak `INC-2027-0188` — required regardless of sub-team. This is now part of the Marcus Ortiz "Lessons" curriculum, taught as a case study in scaling stateful microservices.
- Intros with tech lead, engineering manager, product partner.

## Days 30 / 60 / 90

- Day 30: first PR merged. Buddy + manager check-in.
- Day 60: shadow on-call. NIST 800-53 r5 technical-awareness module mandatory (Atlas Grid falls under NIST scope per Dr Sara Vance's compliance mapping).
- Day 90: first primary on-call rotation. Day-90 conversation with skip-level. Marcus Ortiz himself attends Day-90 for any L5+ hire.

## Customer exposure

Marcus's org supports Halcyon Logistics for Atlas Logix and a portfolio of utilities customers for Atlas Grid. New hires typically join one customer call in week 4 (listen-only) and one customer call in week 8 (active).

## Cross-region context

Priya Anand's EMEA org owns Atlas E-220 and Atlas Pulse. Engineers contributing to Atlas Grid touch Priya's platform layer regularly. Cross-org pair-programming is the recommended Day-90 milestone for platform-track engineers.

## Career pathways

Marcus Ortiz's org maintains a clear track from Engineer (L2) through Principal Engineer (L5). Maya Schwartz's promotion-committee framework applies; Marcus chairs alternate-quarter promotion committees with Priya.

## Common pitfalls

- Not reading the `INC-2027-0188` post-mortem because "we don't touch that subsystem" — the lessons are framework-wide.
- Underestimating NIST 800-53 r5 evidence-gathering effort.
- Missing the Atlas Pulse cross-org dependency at Day 60.
