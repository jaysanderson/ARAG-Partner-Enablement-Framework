---
content_type: incident
region: latam
title: INC-2028-0209 — Pulse Storm Mode False Negative (LATAM Pilot)
---

# INC-2028-0209 · Pulse Storm Mode False Negative (LATAM Pilot)

**Product:** Atlas Pulse
**Severity:** P2
**Detected:** 2028-05-28 19:00 UTC
**Closed:** 2028-05-30 11:00 UTC
**Owner:** Priya Anand (VP Engineering)
**Field co-owner:** Carlos Mendes (LATAM Field Lead)

## Summary

At the LATAM Pulse pilot site, Storm Mode failed to activate ahead of a fast-moving tropical storm that delivered severe winds with relatively low forecast probability per the INMET feed. The site operator manually forced Storm Mode per RB-Pulse-Storm-Override-011 once visible weather conditions warranted; the override took effect within 60 seconds and the Safety Supervisor handled the actual storm-period dispatch correctly.

## Timeline

- **2028-05-28 18:30** — Tropical storm arrives faster than forecast. INMET probability scalar at 0.55 (below 0.65 activation threshold per rfc-pulse-storm-mode-thresholds.md).
- **2028-05-28 19:00** — Site operator observes severe winds; forces Storm Mode via override.
- **2028-05-28 19:01** — Override takes effect; constraint pack applied.
- **2028-05-28 22:00** — Storm passes; operator allows auto-revert.
- **2028-05-30 11:00** — Post-incident review; threshold tuning proposal filed.

## Customer impact

- **LATAM pilot customer** (non-anchor) — No equipment damage; sub-optimal pre-storm dispatch in the 30-minute window before override. Cost impact negligible.

## Root cause

INMET-derived probability scalar underweighted fast-moving storms with limited radar precursors. The 0.65 activation threshold, while reasonable on a per-event basis, missed this event class.

## Lessons

- Reduce LATAM activation threshold to 0.55 with a 90-minute dwell time. RFC update filed.
- Add explicit "operator-visible severe weather" as a secondary trigger.
- The manual override + Safety Supervisor combination kept the site safe. The architecture is robust to threshold imperfection.

## Regulatory exposure

- **EU AI Act.** Not in scope (LATAM region). Threshold tuning is deterministic.
- **POL-INCIDENT-v2.0.** Handled per policy.

## Related

- design-doc-pulse-storm-mode.md
- rfc-pulse-storm-mode-thresholds.md
- RB-Pulse-Storm-Override-011
- design-doc-pulse-safety-supervisor.md
