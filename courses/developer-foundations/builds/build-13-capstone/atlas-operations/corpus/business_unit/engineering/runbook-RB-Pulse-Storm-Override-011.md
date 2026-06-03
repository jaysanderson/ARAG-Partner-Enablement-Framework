---
content_type: runbook
region: emea
title: RB-Pulse-Storm-Override-011 — Pulse Storm Mode Manual Override
---

# RB-Pulse-Storm-Override-011 · Pulse Storm Mode Manual Override

**Product:** Atlas Pulse
**Owner:** Priya Anand (VP Engineering)
**Last revised:** 2028-Q2

## Background

Atlas Pulse Storm Mode (see design-doc-pulse-storm-mode.md and rfc-pulse-storm-mode-thresholds.md) auto-activates on meteorological feeds, but the regional operator at a Norvale Energy site can force the mode on or off when local conditions diverge from the feed. This runbook handles the override.

## Severity

Operational, not incident. Documented to ensure overrides are audit-trailed.

## Trigger

Site operator request, or pager from the Pulse audit subsystem reporting an override.

## Steps

1. Authenticate to the Pulse admin UI as the regional operator (requires MFA).
2. Navigate to the site's Storm Mode control panel.
3. Select Force Storm Mode On or Force Off, with rationale free-text.
4. Confirm — the override is audit-logged with operator identity, timestamp, rationale.
5. Set an automatic expiry (max 24h). After expiry, mode returns to feed-driven control.
6. Notify the regional duty engineer via the Pulse comms channel.

## Verification

- Pulse audit log shows the override event.
- Optimiser mode panel reflects the forced state within 60 seconds.
- Auto-expiry timer visible and counting.

## Affected customers

- **Norvale Energy.** Operators at Norvale sites are the primary users. Each site has 2-3 named authorised operators.

## Compliance

- **EU AI Act.** Override mechanism is deterministic; no AI Act implications.
- **POL-INCIDENT-v2.0.** Override is not an incident unless the site is in an active P0 state.

## Escalation

Priya Anand if override extends beyond 24h auto-expiry without explanation. Marcus Ortiz for any optimiser anomalies during the override window.

## Related

- design-doc-pulse-storm-mode.md
- rfc-pulse-storm-mode-thresholds.md
- design-doc-pulse-safety-supervisor.md
