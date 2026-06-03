---
content_type: incident
region: noram
title: INC-2028-0112 — Atlas Ledger Anchor Delay at Meridian Bank Quarter-end
---

# INC-2028-0112 · Atlas Ledger Anchor Delay at Meridian Bank Quarter-end

**Product:** Atlas Ledger
**Severity:** P0 (due to audit window)
**Detected:** 2028-03-29 22:00 UTC
**Closed:** 2028-03-31 04:00 UTC
**Owner:** Marcus Ortiz (Principal Architect)

## Summary

Meridian Bank's customer-controlled HSM became unavailable during the final 48 hours of the Q1 2028 audit window. Atlas Ledger's daily anchor job (per design-doc-ledger-immutable-journal.md) deferred two consecutive anchors. The chain remained internally valid throughout but auditor-side independent verification could not be performed during the gap. Resolution required engaging Meridian's HSM operations team out-of-hours.

## Timeline

- **2028-03-29 22:00** — First anchor deferral; pager fires per RB-Ledger-Anchor-Recovery-010.
- **2028-03-29 22:20** — Atlas L3 NORAM rotation engages.
- **2028-03-29 23:00** — Meridian Bank HSM operations engaged.
- **2028-03-30 14:30** — Meridian HSM partition restored.
- **2028-03-30 15:00** — Anchors replayed in chronological order.
- **2028-03-30 18:00** — Auditor-side verification confirmed clean.
- **2028-03-31 04:00** — Post-incident review complete; SOX §404 workpapers updated to disclose the gap with mitigations.

## Customer impact

- **Meridian Bank** — Audit window disclosure required. No financial reporting impact; Q1 close completed on schedule.

## Root cause

Meridian Bank customer-side HSM firmware update during the quarter-end window without coordination with Atlas. Atlas was unable to anchor during the update.

## Lessons

- Add explicit customer-coordination calendar for HSM changes vs. quarter-end audit windows.
- Atlas should propose a contractual SLA on customer HSM availability during audit windows.
- The 24-hour SOX §404 acceptability threshold was approached but not breached.

## Regulatory exposure

- **SOX §404.** Gap disclosed in workpapers per Dr Sara Vance's standard.
- **POL-INCIDENT-v2.0.** Incident handled per policy.

## Related

- design-doc-ledger-immutable-journal.md
- RB-Ledger-Anchor-Recovery-010
- audit-finding-ledger-sox404-2028.md
