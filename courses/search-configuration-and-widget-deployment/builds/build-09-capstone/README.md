# Build 09 — Capstone

> Part of [Search Configuration & Widget Deployment](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

🚦 **Prerequisite gate:** pass [`final-exam.md`](../../final-exam.md) (16/20) before starting this capstone.

## At a glance

| | |
|---|---|
| **Capability** | Deploy the Aurora Outfitters widget both without and with a proxy; prove Synchronized configuration reaches an already-embedded widget live |
| **Corpus** | The same Aurora Outfitters `content_type/` corpus you've used since [Developer Foundations Build 0](../../../developer-foundations/builds/build-00-hello-arag/), including this course's `spec_sheet/`, `field_notes/`, and `field_demo/` additions |
| **Estimated effort** | 1–2 weeks |
| **Deliverable** | A tuned search configuration, a locally-deployed no-proxy widget, a proxy-deployed widget, and a live-recorded config-sync demo |

## Why this capstone exists

Every build in this course ends with something working in isolation — a tuned search configuration here, a styled widget there. The capstone is where those pieces have to work *together*, in front of someone who wasn't in the room while you built them: a partner-manager or Progress SE reviewing whether you can actually take a customer from "we like the demo" to "this is live on our site" without a hand-holding call.

Unlike the Developer Foundations capstone — an eight-week, from-scratch multi-tier application — this capstone is narrow on purpose. You're not building new surfaces. You're proving the configuration and deployment mechanics from Builds 00–08 hold up end to end, on one KB, for one realistic customer scenario.

## The scenario

Aurora Outfitters wants two things live before their next product launch:

1. A **public product-search widget** on their marketing site — no proxy needed yet, this is a fast internal demo for their own marketing team to sign off on before engineering gets involved.
2. The **same experience, production-ready** — behind a proxy, on a page their engineering team actually owns — plus proof that Aurora's content team can retune the search behavior from the dashboard after launch without filing an engineering ticket every time.

That's the whole brief. You are building the thing a partner actually ships in a real Tier 1–2 engagement: not a new capability, a *production-ready instance* of capabilities you already have.

## Scope

**In scope:**
- A tuned named search configuration (Build 00, refined through Builds 01–06) for a shopper-facing product-search experience.
- A widget (Build 07) built on that configuration.
- Deployment #1: local, no-proxy quick test (Build 08's pattern).
- Deployment #2: behind a minimal proxy backend (Build 08's pattern), with the service-account key never reaching the browser.
- A recorded or live-demoed proof that a dashboard change to the search configuration (e.g. flipping a Result Display option, or editing the system prompt) is visible on the *already-deployed* proxy widget via Synchronized configuration, with no new snippet copied and no redeploy.

**Out of scope:**
- New corpus content — use what's already in `content_type/`, including this course's additions.
- A custom-coded chat UI — that's Developer Foundations Build 3 territory, not this course.
- Multi-KB routing, residency, or BYO-LLM — Developer Foundations Build 11 territory.
- User Intent Routing rules beyond what Build 05 already covers (one working rule is enough to demonstrate the mechanism; the capstone isn't asking you to build a large rule set).

## Build plan

| Phase | What you do | Exit criteria |
|---|---|---|
| **1. Configure** | Using Builds 00–06, tune search, generation, RAG strategies, and result display for a shopper-facing product-search experience. Commit it as one named `search_configuration`. | A single named configuration you can point to, with a one-paragraph rationale for each non-default choice you made |
| **2. Build the widget** | Using Build 07, build a widget on that configuration — search bar + results, reasonable filters, sensible display options for a shopper audience. | Widget previews correctly in the dashboard |
| **3. Deploy #1 — no proxy** | Using Build 08, ship it as a local `index.html`, exactly like Foundations Build 2's pattern. | File opens, search works, product filter (if used) returns the right scope |
| **4. Deploy #2 — proxy** | Vibe-code the minimal proxy backend from Build 08, point the widget at it, confirm via DevTools that the service-account key never appears in a browser-initiated request. | Same widget experience, key confirmed server-side only |
| **5. Prove config sync** | Enable Synchronized configuration on the proxy-deployed widget's embed snippet. Make one dashboard change to the underlying search configuration. Reload the deployed page (no new snippet, no redeploy) and confirm the change is live. | Screenshot or screen recording showing before/after with no code change in between |
| **6. Demo prep** | Write a 10-minute demo script: the two deployments, the config-sync proof, and the rationale from Phase 1. | Script + working deployments ready to run live |

## Success criteria — what "done" looks like

- [ ] One named search configuration, with documented rationale for each choice that deviates from platform defaults.
- [ ] A widget deployed and working with no proxy (local file, double-click, matches Foundations Build 2's bar).
- [ ] The same experience deployed behind a proxy, with the service-account key confirmed never exposed client-side.
- [ ] A demonstrated, reproducible proof that a dashboard configuration change reaches the already-deployed proxy widget without a new embed snippet or a redeploy.
- [ ] A 10-minute demo script that a Progress SE or partner manager could review without you in the room.

## Owners, dependencies, status

| Item | Owner | Status |
|---|---|---|
| Search configuration + rationale | You | TODO |
| Widget build | You | TODO |
| No-proxy deployment | You | TODO |
| Proxy deployment | You | TODO |
| Config-sync proof | You | TODO |
| Demo script | You | TODO |

## What I need from you to start

Nothing beyond a passed final exam and a working Aurora Outfitters Knowledge Box carried through from Developer Foundations Build 0. This capstone deliberately doesn't require new sign-offs, budget, or scoping conversations — it's a solo (or pair) exercise you can start the same day you pass the exam.

## See also

- Parent: [Search Configuration & Widget Deployment](../../README.md)
- Gate: [Final exam](../../final-exam.md)
- Previous: [Build 08 — Widget Deployment](../build-08-widget-deployment/)
- Compare: [Developer Foundations Build 13 — The Capstone](../../../developer-foundations/builds/build-13-capstone/) (the broader, from-scratch capstone this one deliberately does not try to be)
