---
content_type: incident
region: emea
title: INC-2028-0173 — BuildingHub OTA Canary Auto-Abort
---

# INC-2028-0173 · BuildingHub OTA Canary Auto-Abort

**Product:** Atlas BuildingHub
**Severity:** P1
**Detected:** 2028-05-15 14:20 UTC
**Closed:** 2028-05-16 17:00 UTC
**Owner:** Priya Anand (VP Engineering)
**Customer Success co-lead:** Aisha Okonkwo

## Summary

The Atlas BuildingHub firmware patch 4.1.2 entered the canary stage of the v2.0 OTA channel (per design-doc-buildinghub-otp-channel.md) and triggered auto-abort within 4 hours due to controller reboot loops on a specific hardware revision. The auto-abort worked exactly as designed — only 0.7% of fleet ever received the patch, and the rollback path returned them to 4.1.1 within 15 minutes of decision.

## Timeline

- **2028-05-15 10:00** — Patch 4.1.2 promoted to canary (1% of fleet).
- **2028-05-15 14:18** — Canary failure rate hits auto-abort threshold (1.0% within 1% population = noticeable).
- **2028-05-15 14:20** — Auto-abort triggers. Pager fires per RB-BldHub-Rollback-012.
- **2028-05-15 14:22** — Priya Anand and Aisha Okonkwo paged.
- **2028-05-15 14:35** — Rollback authorised. `manifest-svc rollback` executed.
- **2028-05-15 14:50** — 95% of affected fleet on rollback manifest.
- **2028-05-15 15:00** — Aisha's team sends customer comms.
- **2028-05-16 17:00** — Root cause patch (4.1.3) cut; canary restart scheduled. Incident closed.

## Customer impact

- **Cresta Health Network** — Approximately 30 controllers affected, all in non-clinical zones. Recovered within 20 minutes; no clinical HVAC impact.
- Smaller deployments at other customers — minimal impact, rollback completed cleanly.

## Root cause

Patch 4.1.2 contained a controller-side memory allocation change that triggered an OOM reboot loop on hardware revision B2 controllers. Hardware revision was not adequately represented in the pre-canary test matrix.

## Lessons

- Pre-canary test matrix must explicitly cover every fielded hardware revision, not just current production.
- Auto-abort thresholds at 1% failure within 1% population worked. Confirms the design.
- Customer comms template for "rollback" worked smoothly under time pressure.

## Regulatory exposure

- **HIPAA.** No clinical impact at Cresta. Notification to Cresta leadership per BAA standard practice.
- **POL-INCIDENT-v2.0.**

## Related

- design-doc-buildinghub-otp-channel.md
- RB-BldHub-Rollback-012
- INC-2028-0019
