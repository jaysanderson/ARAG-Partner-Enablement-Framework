---
content_type: incident
region: noram
title: INC-2028-0124 — Atlas Logix Solver Latency Spike at Halcyon
---

# INC-2028-0124 · Atlas Logix Solver Latency Spike at Halcyon

**Product:** Atlas Logix
**Severity:** P0 (during Halcyon NORAM dispatch window)
**Detected:** 2028-04-22 15:45 UTC
**Closed:** 2028-04-23 12:00 UTC
**Owner:** Marcus Ortiz (Principal Architect)

## Summary

Atlas Logix v4.0 solver workers at Halcyon Logistics' NORAM tenant exhibited latency spikes (p95 went from 7 seconds to 42 seconds) during the peak dispatch window. The worker memory watchdog did NOT fire; processes were under the memory ceiling. Root cause traced to a pathological adversarial input shape introduced by a routing exception (a port closure affecting >1,800 stops simultaneously) that triggered worst-case behaviour in the exception solver.

## Timeline

- **2028-04-22 15:45** — Latency spike begins. Pager fires.
- **2028-04-22 15:50** — Atlas L3 NORAM rotation engages; identifies tenant scope.
- **2028-04-22 16:20** — Workers manually restarted per RB-Logix-Solver-Restart-007; spike returns within 10 minutes.
- **2028-04-22 17:00** — Marcus Ortiz engaged; root cause identified as exception solver pathology under massive simultaneous exception count.
- **2028-04-22 18:30** — Workaround deployed: fall back to baseline solver when exception count > 500 per recompute window.
- **2028-04-23 12:00** — Permanent fix shipped in Logix 4.0.3; incident closed.

## Customer impact

- **Halcyon Logistics** — Approx 220 routes had stale baseline routing during the latency window. Estimated revenue impact ~$95k from late deliveries; Halcyon waived against Atlas under existing SLA. Direct customer comms by Aisha Okonkwo.

## Root cause

Exception solver scaling assumption: design assumed exceptions arrive in small batches. A port closure that simultaneously generated 1,800+ stops violated this assumption. Solver pathology fell back to local-search worst case.

## Lessons

- Exception solver needs explicit large-batch handling path.
- Pre-prod load tests must include adversarial batch sizes derived from real-world cascade events.
- Watchdog covers memory but not CPU-bound latency pathologies. Add a latency watchdog.

## Regulatory exposure

- **EU AI Act.** Logix is in scope; this incident did not involve an unsafe automated decision (routes were merely late).
- **POL-INCIDENT-v2.0.** Handled per policy.

## Related

- design-doc-logix-routing-v4.md
- INC-2027-0188
- RB-Logix-Solver-Restart-007
