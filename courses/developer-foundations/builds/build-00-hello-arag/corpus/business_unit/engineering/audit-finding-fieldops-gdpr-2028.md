---
content_type: audit_finding
region: emea
title: Audit Finding — FieldOps GDPR Posture (2028)
---

# Audit Finding · FieldOps GDPR Posture (2028)

**Auditor:** External DPIA assessor (EMEA)
**Atlas-side owner:** Dr Sara Vance (Compliance), Priya Anand (Engineering), Liam Hayashi (Field Ops)
**Issued:** 2028-04-20
**Status:** Closed — 2028-Q2

## Finding

The assessor performed a Data Protection Impact Assessment on Atlas FieldOps for EMEA-deployed technicians. The assessment covered v3.0 offline sync (per design-doc-fieldops-offline-sync-v3.md), the MDM posture controls (per design-doc-fieldops-mobile-mdm.md), and the conflict inbox (per design-doc-fieldops-conflict-inbox.md). The assessor accepted the technical-measures posture and confirmed it satisfies GDPR Art. 32. One observation:

- **Conflict inbox rationale free-text field** could in principle accept PII typed by technicians. The current control is training; the assessor recommended a soft-warning prompt in the UI.

## Remediation

| Item | Action | Owner | Status |
|---|---|---|---|
| Soft-warning prompt | Add a "Do not include personal data" warning above the rationale field; require checkbox acknowledgement on first use | Liam Hayashi (UX) + Marcus Ortiz (Engineering) | Shipped 2028-Q2 |
| Training reminder | Annual reminder added to FieldOps technician training | Liam Hayashi | Done |

## Compliance posture

- **GDPR Art. 5(1)(c)** — Data minimisation, satisfied via the new prompt.
- **GDPR Art. 32** — Technical and organisational measures, confirmed adequate.
- **NIST 800-53 r5 AC-19** — MDM posture controls reviewed and accepted.
- **POL-DATA-v3.1** — Reaffirmed.

## Customer impact

- All FieldOps customers benefit from the prompt — not just EMEA. Cresta Health Network, Halcyon Logistics, Talos Steelworks all received the update.

## Related

- design-doc-fieldops-offline-sync-v3.md
- design-doc-fieldops-mobile-mdm.md
- design-doc-fieldops-conflict-inbox.md
- rfc-fieldops-conflict-inbox-ux.md
