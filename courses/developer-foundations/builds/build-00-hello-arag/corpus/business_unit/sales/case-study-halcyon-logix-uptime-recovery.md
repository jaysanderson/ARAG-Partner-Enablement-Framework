---
content_type: case_study
region: noram
title: Case Study — Halcyon Logix Uptime Recovery Post-INC-2027-0188
---

# Case Study · Halcyon Logix Uptime Recovery Post-INC-2027-0188

**Customer:** Halcyon Logistics
**Industry:** 3PL (NORAM)
**Primary CSM:** Marcus Ortiz
**Atlas products:** Atlas Logix, Atlas FieldOps

## The headline

Atlas Logix experienced a routing-engine memory leak (INC-2027-0188) that affected Halcyon's NORAM dispatch operations for a five-day window. Marcus Ortiz owned the incident; RB-Logix-MemLeak-002 closed it. Twelve months later, Halcyon's Logix routing reliability is at 99.92% and the FY28 routing has saved the customer USD 4.1M in fuel and overtime.

## The incident

The memory leak surfaced under sustained peak routing load typical of NORAM Q4 shipping volumes. Halcyon's dispatchers observed routing engine restarts every ~6 hours, causing duplicate dispatch instructions and elevated driver re-routing.

Marcus Ortiz mobilised an Atlas engineering pod within hours. The memory leak was traced to a corner-case interaction between the dispatch-replay buffer and Halcyon's specific shift-pattern overlay. RB-Logix-MemLeak-002 was authored and deployed in 7 days from incident open to closure.

## The commercial response

- Service credit: USD 380k, drawn from the CS budget per the service-credit framework.
- No sales-side concession or pricing rework; the existing Logix contract remained intact.
- Marcus Ortiz personally led the post-incident review with Halcyon's COO.

## The follow-on commercial wins

- **Logix Volume Uplift:** Q2 2028 proposal moved Halcyon onto custom volume pricing once monthly shipments exceeded 1M. Marcus Ortiz' personal credibility from the incident response materially accelerated CIO sign-off.
- **FieldOps Renewal 2028:** Three-year renewal contract with tighter sync-reliability SLA (referencing the separate FieldOps incident INC-2028-0034).
- **BuildingHub warehouse pilot:** Cross-product pilot won; first time Atlas has cross-sold into Halcyon's facilities estate.

## What this case shows

- Engineering-executive ownership of an incident creates commercial trust that survives the incident itself.
- A service credit out of the CS budget (not from the sales discount pool) preserves the sales economics of subsequent expansion deals.
- Cross-product expansion at an account typically requires a credibility event, not just a relationship one.

## Cross-references

- runbook RB-Logix-MemLeak-002 (engineering BU)
- INC-2027-0188 post-mortem (engineering BU)
- proposal-halcyon-logix-volume-uplift.md
- proposal-halcyon-fieldops-renewal.md
- proposal-halcyon-bldhub-warehouse-pilot.md
- battlecard-halcyon-logistics.md
