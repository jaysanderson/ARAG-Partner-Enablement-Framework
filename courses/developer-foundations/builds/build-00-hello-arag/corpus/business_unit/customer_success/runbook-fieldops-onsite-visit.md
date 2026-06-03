---
content_type: runbook
region: apac
title: Field Operations Runbook — On-Site Customer Visit (FieldOps)
---

# Field Operations Runbook · On-Site Customer Visit (FieldOps)

**Owner:** Liam Hayashi (Head of Field Operations)
**Region:** Global (this is the canonical on-site visit runbook)
**Applies to:** Atlas FieldOps customer engagements requiring on-site presence

## When to use

- Customer-side FieldOps device-fleet health-checks.
- FieldOps post-incident customer reassurance visits.
- FieldOps language-pack rollout customer training.
- FieldOps roadmap-engagement customer conversations.

## Pre-visit (T-14 days)

1. Confirm customer-side host and scope in writing.
2. Confirm the language requirement. For Talos visits, Japanese-language collateral is mandatory.
3. Confirm the customer's incident posture. If any open incidents reference Atlas FieldOps, brief Atlas engineering on-call before the visit.
4. Build a 1-page visit agenda. Share with customer T-7 days for approval.

## Day-before

1. Confirm device-fleet baseline metrics. Pull FieldOps fleet telemetry for the 7 days preceding the visit.
2. Pack the on-site kit: a spare technician device, a USB-recovery stick, language-pack manuals.
3. Re-read the customer-specific deployment guide (e.g., `deployment-halcyon-fieldops-toronto.md` or `deployment-talos-fieldops-japan.md`).

## On-site (Day 0)

- 09:00 — Customer-side host meet, agenda confirmation.
- 09:30 — Site walk-through with the day-to-day technician supervisor.
- 11:00 — Device fleet inspection (random sample of 10 devices typical).
- 13:00 — Lunch with technician team. **Do not skip this.** Often the most useful customer-feedback hour of the visit.
- 14:00 — Customer-side leadership conversation (60-90 minutes).
- 16:00 — Visit findings written up before leaving site.

## Post-visit (T+1 to T+7)

1. Visit findings document delivered to customer within 48 hours.
2. Atlas-side product feedback issues filed (e.g., language gaps, UX friction).
3. Customer-success ticket opened if any escalation candidates emerged.

## Language and cultural notes

- **Japan visits:** Liam Hayashi leads in person. Japanese-language documentation is non-negotiable. Always ask before declining offered food or drink at customer facilities.
- **NORAM visits:** Marcus Ortiz or assigned CSM. English documentation standard.
- **EMEA visits:** Regional CSM. Multi-language documentation available — confirm preferred language with customer host T-14.

## Related

- POL-INCIDENT-v2.0
- RB-FieldOps-Sync-004 (the underlying technical runbook)
- `escalation-talos-fieldops-language-pack.md`
- `case-study-fieldops-cross-customer-incident.md`
