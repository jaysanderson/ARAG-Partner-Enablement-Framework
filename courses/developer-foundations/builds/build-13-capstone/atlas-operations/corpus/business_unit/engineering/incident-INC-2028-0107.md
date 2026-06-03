---
content_type: incident
region: emea
title: INC-2028-0107 — Atlas Pulse Forecast Feed Corruption at Norvale Bravo
---

# INC-2028-0107 · Atlas Pulse Forecast Feed Corruption at Norvale Bravo

**Product:** Atlas Pulse
**Severity:** P1
**Detected:** 2028-04-08 11:20 UTC
**Closed:** 2028-04-09 08:30 UTC
**Owner:** Priya Anand (VP Engineering)

## Summary

An upstream weather forecast feed delivered corrupted values to the Atlas Pulse v3.0 optimiser at Norvale Energy site Bravo during a routine dispatch window. The Safety Supervisor (per design-doc-pulse-safety-supervisor.md) correctly clamped all out-of-envelope dispatch decisions, preventing any unsafe inverter setpoints from reaching the physical equipment. Customer impact was limited to 2 hours of sub-optimal economic dispatch (~€18k estimated revenue impact).

## Timeline

- **2028-04-08 11:20** — Forecast feed begins delivering NaN-laden values.
- **2028-04-08 11:22** — Optimiser produces unsafe candidate setpoints. Safety Supervisor clamps 100% of decisions; emits health-bus alert.
- **2028-04-08 11:25** — Pager fires; on-call engineer engages.
- **2028-04-08 11:45** — Upstream feed identified as root cause.
- **2028-04-08 13:10** — Feed restored; Supervisor clamp rate returns to baseline.
- **2028-04-09 08:30** — Post-incident review complete; closed.

## Customer impact

- **Norvale Energy** — Site Bravo, ~€18k in sub-optimal dispatch. No grid stability issues, no inverter damage.

## Root cause

Third-party weather forecast feed bug delivering NaN in a region with a recent meteorological station outage.

## Lessons

- Safety Supervisor design (per design-doc-pulse-safety-supervisor.md) worked exactly as intended — this incident is also a successful validation of that subsystem.
- Forecast feed adapter should explicitly reject NaN at ingress rather than letting the optimiser deal with them.
- Customer comms template for "sub-optimal but safe" incidents should be distinct from "unsafe" incidents.

## Regulatory exposure

- **EU AI Act.** Pulse is in scope; the optimiser's residual MLP did NOT produce unsafe outputs (NaN bypassed the model entirely). Article 9 risk management worked.
- **POL-INCIDENT-v2.0.** Incident handled per policy.

## Related

- design-doc-pulse-smartgrid-optimiser.md
- design-doc-pulse-safety-supervisor.md
- POL-INCIDENT-v2.0
