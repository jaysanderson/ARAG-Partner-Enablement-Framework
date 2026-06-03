---
content_type: case_study
region: noram
title: Case Study — Cresta Health Network CSM Onboarding (HIPAA-Sensitive)
---

# Case Study — Cresta Health Network CSM Onboarding (HIPAA-Sensitive)

Documented by Aisha Okonkwo's office for inclusion in Maya Schwartz's regulated-customer onboarding pattern library.

## Context

Cresta Health Network is one of Atlas's Tier-1 healthcare customers, using Atlas BuildingHub for hospital facilities automation. The deployment touches HIPAA-protected environments. Cresta's vendor-management group requires every Atlas employee touching the engagement to complete:

1. HIPAA awareness training (90 minutes).
2. Cresta's customer-mandated background recheck.
3. Cresta-specific data-handling addendum acknowledgment.

The standard Atlas CSM onboarding flow (`onboarding-customer-services-aisha-org.md`) needed extension for Cresta-pod CSMs.

## What broke

In FY26 a new CSM was assigned to a Cresta sub-account on day 14 and joined a customer call before completing Cresta's required clearances. The breach was procedural rather than substantive — the CSM had Atlas HIPAA awareness completed but not the customer's recheck. Cresta's vendor-management caught it on a routine audit. Aisha Okonkwo personally apologised to Cresta's CIO. The engagement continued without commercial impact, but the trust dent was real.

## Root cause

- Workday onboarding workflow did not gate customer-call participation on customer-specific clearance completion.
- HRBP and Aisha's pod lead were both relying on the other to enforce the gate.
- The CSM (in good faith) didn't know the gate existed.

## Fix

### Workday gate

Maya Schwartz's HR Operations team built a Workday custom flag: for any CSM assigned to a Cresta sub-account, the SSO group granting Cresta data access is auto-disabled until customer-specific clearance is marked complete. The HRBP cannot mark it complete without uploading the customer's confirmation artefact.

### Process change

- New CSMs assigned to Cresta enter a "ramp" status that explicitly disallows customer-call participation for the first 14 days minimum (or until clearances complete, whichever later).
- Cresta-pod buddy assignment now includes the explicit responsibility of confirming clearance before any first call.
- Aisha Okonkwo's Day-1 welcome for Cresta-pod CSMs includes a stop-the-line briefing on the clearance gate.

### Audit

Quarterly review by Dr Sara Vance's Compliance office of the Cresta clearance audit log. Zero breaches FY27 and FY28 to date.

## Generalisation

The pattern was generalised across regulated customers:

| Customer | Regulator focus | Specific gate |
|---|---|---|
| Cresta Health Network | HIPAA | Customer recheck + data addendum |
| Meridian Bank | Financial services | Pre-clearance set + trading restriction |
| Norvale Energy | NORAM NIST 800-53 r5 | Arc-flash + site safety induction |
| Talos Steelworks | Heavy industry safety | FR PPE + heat-stress training (Liam Hayashi org) |

The Workday gate framework now supports each pattern.

## Lessons

1. Customer-specific clearance is a real workflow, not paperwork — it deserves a Workday gate.
2. Buddy responsibility is operational, not just social.
3. Aisha's personal accountability to the customer mattered more than process correction in repairing trust.
4. Quarterly Compliance audit closed the loop.
