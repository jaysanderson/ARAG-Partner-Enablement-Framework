---
content_type: escalation
region: noram
title: Escalation — Halcyon Logistics APAC Cutover Risk
---

# Escalation · Halcyon Logistics APAC Cutover Risk

**Customer:** Halcyon Logistics
**Product:** Atlas Logix (Phase 2 APAC routes)
**Primary CSM:** Marcus Ortiz
**Executive sponsor (customer-side):** Andre Pellegrini, Halcyon Chief Operating Officer
**Status:** Closed without service-credit issuance

## Background

The Halcyon Phase 2 cutover (APAC routes, originating from Singapore and Sydney) was scheduled for 2028-05-04 with a 14-day stabilisation window. Halcyon expressed late-stage anxiety about repeating the routing-engine memory-leak issue (INC-2027-0188) on the APAC routes, where peak-load profiles are markedly different from NORAM.

## Escalation chain

- 2028-04-20: Andre Pellegrini sends a 22-bullet risk register to Marcus Ortiz, requesting senior Atlas engineering accountability.
- 2028-04-21: Marcus Ortiz convenes a joint risk-review with Priya Anand (VP Engineering) as guarantor on the engineering posture.
- 2028-04-23: Atlas commits to:
  1. Deploy only Atlas Logix 4.8.0 (per RB-Logix-MemLeak-002 guardrails)
  2. 30-day parallel run instead of the standard 7-day window
  3. Marcus Ortiz embedded in Halcyon Singapore office during cutover week
  4. Daily Andre-to-Priya executive standup during stabilisation

## Cutover

- 2028-05-04: Cutover executed without incident.
- 2028-05-04 to 2028-06-03: 30-day parallel run completed clean.
- 2028-06-04: Atlas Logix 4.8.0 declared production-of-record on Halcyon APAC routes.

## Outcomes

- No service-credit owed (no SLA breach).
- Andre Pellegrini's quote: "Marcus + Priya turning up was worth more than any contractual remedy."
- Halcyon Phase 3 EMEA approved 2028-06-15 — Atlas Logix expansion to the European leg.

## Lessons captured

- The 30-day parallel run is now standard for Tier-1 customer Atlas Logix cutovers — Marcus Ortiz updated the `deployment-guide-logix.md` accordingly.
- POL-INCIDENT-v2.0 worked as intended: escalation chain to engineering leadership was clean.

## Related

- INC-2027-0188 (the original Halcyon incident)
- RB-Logix-MemLeak-002
- Halcyon case study (`case-study-halcyon-logistics.md`)
