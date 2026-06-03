---
content_type: deployment_guide
region: apac
title: Deployment — Talos Steelworks Atlas FieldOps (Japan)
---

# Deployment · Talos Steelworks Atlas FieldOps (Japan)

Customer-specific deployment record for Talos Steelworks' FieldOps device fleet across Japanese plant sites. Owned by Liam Hayashi.

## Customer profile

- **Customer:** Talos Steelworks
- **Region:** APAC (Japan)
- **CSM:** Liam Hayashi
- **FieldOps go-live:** 2026-09-15
- **Device count:** 47 active technician devices

## Sites

- Yokohama main plant.
- Kobe secondary plant.
- Fukuyama specialty steel plant.
- Plus 3 service/distribution centres.

## Language and UX

- Japanese-language UX shipped 2028-04-29 across all 47 devices (driven by `escalation-talos-fieldops-language-pack.md`).
- All Atlas FieldOps documentation maintained in Japanese (translation review co-managed with the Talos plant maintenance training office).

## Recent operational events

- INC-2028-0034 (FieldOps offline-sync corruption) — 47 devices affected, remediated via RB-FieldOps-Sync-004 in 1 week.
- 2028-04-29 — Japanese language pack shipped.
- 2028-05-15 — Free FieldOps health-check across all 47 devices (per `escalation-talos-pulse-pilot-delay-request.md` arrangement).

## Customer-side executive sponsors

- Hiroshi Tanaka — VP Operations.
- Yui Nakajima — Director of Plant Operations.
- Kenji Sato — CIO (for compliance/data-residency posture).

## Operational cadence

- Liam Hayashi visits Japan quarterly.
- Monthly virtual cadence between Liam and Yui Nakajima.
- Annual joint operations review at the Yokohama plant.

## Related

- INC-2028-0034, RB-FieldOps-Sync-004
- `escalation-talos-fieldops-language-pack.md`
- `escalation-talos-pulse-pilot-delay-request.md`
- `escalation-talos-grid-evaluation-data-residency.md`
- `case-study-talos-steelworks.md`
- `deployment-guide-fieldops-emea.md` (sibling guide for the other region)
