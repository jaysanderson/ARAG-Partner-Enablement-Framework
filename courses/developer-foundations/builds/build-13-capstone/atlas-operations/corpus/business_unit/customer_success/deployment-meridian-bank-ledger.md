---
content_type: deployment_guide
region: noram
title: Deployment — Meridian Bank Atlas Ledger
---

# Deployment · Meridian Bank Atlas Ledger

Customer-specific deployment record for Meridian Bank's Atlas Ledger production system. Owned by Dr Sara Vance (in a CSM capacity, reflecting the compliance-led nature of this relationship).

## Customer profile

- **Customer:** Meridian Bank
- **Region:** NORAM
- **CSM:** Dr Sara Vance
- **Initial contract date:** 2025-09-30
- **Production date:** 2026-04-12
- **Current Ledger version (production):** 2028.5 (since 2028-04-12)

## Scope

- Core Atlas Ledger for general-ledger postings and SOX §404 controlled financial flows.
- Integration with Meridian's IBM Z mainframe core banking platform.
- Integration with Meridian's audit-evidence repository.

## Regulatory posture

- SOX §404 in scope (NORAM regulation).
- NIST 800-53 r5 — applicability statement on file.
- Meridian's external auditor (Big-4 firm) reviewed Atlas Ledger annually 2026, 2027, 2028.

## Recent operational events

- 2028-04-12: Atlas Ledger 2028.5 deployed (control-evidence emission enhancement — see `escalation-meridian-ledger-sox-controls.md`).
- 2028-05-04: Meridian's auditor accepts the enhanced evidence pack.
- 2028-05-30: Meridian's SOX §404 attestation refresh passes clean.

## Operational cadence

- Quarterly business review with Dr Sara Vance, Janelle Pham (Meridian Chief Auditor), and Atlas Compliance team.
- Annual joint compliance review.
- Atlas Ledger releases gated through a Meridian-specific compliance-review board prior to deployment.

## Customer-side executive sponsors

- Janelle Pham — Chief Auditor (primary).
- Carlos Reyna — Chief Procurement Officer (procurement-side, for related products).

## Related

- `escalation-meridian-ledger-sox-controls.md`
- `escalation-meridian-grid-phase2-procurement.md`
