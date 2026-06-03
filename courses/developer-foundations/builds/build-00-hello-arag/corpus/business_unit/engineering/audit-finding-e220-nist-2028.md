---
content_type: audit_finding
region: apac
title: Audit Finding — Atlas E-220 NIST 800-53 r5 (2028)
---

# Audit Finding · Atlas E-220 NIST 800-53 r5 (2028)

**Auditor:** US federal-adjacent customer audit team (APAC defence integrator, conducting on behalf of a NORAM federal end-customer)
**Atlas-side owner:** Dr Sara Vance (Compliance), Priya Anand (Engineering)
**Issued:** 2028-05-08
**Status:** Open — remediation 2028-Q4

## Finding

A federal-adjacent customer in APAC contracts via a defence integrator and audited Atlas E-220 against NIST 800-53 r5. The audit confirmed the SI-7 (Software Integrity) controls via design-doc-e220-firmware-test-harness.md, the IR-4 (Incident Handling) controls via the INC-2027-0142 post-mortem, and the SC-12/SC-13 (Key Management) controls via the rfc-firmware-signing-key-rotation.md proposal.

Two gaps identified:

1. **AU-9 (Protection of Audit Information)** — E-220 controller-side audit logs are stored locally without integrity protection. Modifications to the local log are detectable only after the log is centrally aggregated.
2. **CM-3 (Configuration Change Control)** — Cold chamber sign-off (per RB-E220-Cold-Chamber-Down-017) is currently captured in a free-form ticket. The auditor asked for a structured change-control record.

## Remediation

| Gap | Action | Owner | Target |
|---|---|---|---|
| AU-9 local log integrity | Add per-entry HMAC chained on the controller, validated at aggregation | Priya Anand | 2028-Q4 |
| CM-3 structured change record | Replace free-form ticket with the cold-chamber promotion record format | Aaron Kim + Priya Anand | 2028-Q3 |

## Compliance posture

- **NIST 800-53 r5** — Limited-risk gaps; no operational impact during the remediation window.
- **POL-INCIDENT-v2.0** — Standing controls unaffected.

## Customer impact

- **Defence integrator end-customer** — Conditional acceptance; remediation roadmap accepted in lieu of immediate close.
- **Norvale Energy and Talos Steelworks** — Will benefit from the same hardening on their E-220 fleets.

## Related

- design-doc-e220-firmware-test-harness.md
- rfc-firmware-signing-key-rotation.md
- INC-2027-0142
- RB-E220-Cold-Chamber-Down-017
