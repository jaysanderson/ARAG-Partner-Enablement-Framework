---
content_type: rfc
region: noram
title: RFC — Workday Mobility & Skills Workflow Redesign
---

# RFC — Workday Mobility & Skills Workflow Redesign

**Author**: Maya Schwartz's office (HR Operations).
**Reviewers**: Priya Anand, Marcus Ortiz, Aisha Okonkwo, Liam Hayashi, Dr Sara Vance.
**Status**: Open for comment.

## Problem

Atlas's Workday implementation accumulated workflow debt across two areas:

1. **Internal mobility**: candidates apply through Career Hub but the workflow does not surface the current-manager-notification requirement from `internal-mobility-policy.md`, leading to surprises.
2. **Skills-based search**: with the Skills Taxonomy rollout proposed in `proposal-skills-taxonomy-rollout.md`, the existing Workday search will not scale to skill-based candidate matching.

Additionally, the Cresta Health Network clearance gate from `case-study-cresta-hipaa-csm-onboarding.md` and the FieldOps safety induction gates from Liam Hayashi's org are implemented as one-off custom flags that don't generalise.

## Proposal

Redesign the mobility and skills workflows with a unified pattern:

### Manager notification gate

Career Hub application opens with a mandatory "have you notified your current manager?" gate. Notification can be triggered through Career Hub directly (sends manager a structured intro message) or attested by the candidate. Attestation requires acknowledgment of consequences in case of false attestation.

### Skills-based candidate match

Candidates and roles both carry skill profiles. Matching uses Workday Skills Cloud (per the skills taxonomy proposal) with explainable matching surfaced both to candidate and hiring manager.

### Generalised clearance-gate framework

Replace the one-off Cresta flag and the Field Operations safety flags with a unified pattern:
- Each customer / engagement carries an explicit set of required clearances.
- Each employee record carries the set of clearances achieved.
- SSO group provisioning gates on the clearance match.
- The framework supports: Cresta HIPAA, Meridian Bank financial-services pre-clearance, Norvale Energy arc-flash + site induction, Talos Steelworks heat-stress + FR PPE, BuildingHub regulator-specific overlays.

### Compliance audit trail

All gate decisions log to a Compliance-readable audit trail. Dr Sara Vance's quarterly Cresta audit becomes a generic audit pattern.

## Open questions

1. Manager notification gate: should it block application, or just delay? Tradeoff: blocking risks candidate dropping out; delaying defeats the purpose. Maya Schwartz's office proposes delay with non-skippable acknowledgment.
2. Skills attestation: how to validate self-reported skills? Proposal: peer-attestation pattern Aisha Okonkwo piloted in her CSM org, scaled.
3. Generalised clearance framework: where does the customer-clearance metadata live? Proposal: an Atlas Customer Compliance Registry maintained jointly by Dr Sara Vance's office and Aisha Okonkwo's CSM ops.
4. Audit trail retention: align with the HR Data Handling Supplement retention rules.

## Cost

- Workday consulting: $280,000.
- Atlas labour: 1.5 FTE-equivalent over 6 months.
- Total: ~$450,000.

## Decision needed

Sign-off from each named reviewer by 60 days from RFC issue date. Maya Schwartz to finalise resolution and route to CFO/CIO for funding.

## Open for comment until

T+30 calendar days.
