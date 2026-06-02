# Capstone Example — Atlas Operations (Enterprise)

> **Status:** Brief shipped + reference implementation shipped.
> **Role in the programme:** Build 13 capstone + flagship reference + strategic-account sales-room closer.
> **Owner:** Jay Sanderson (programme); Progress Solution lead (build).
> **Target ship:** End of 90-day rollout window (Day 90).
> **Companion docs:** [`../../../../../README.md`](../../../../../README.md) (umbrella framework), [`../README.md`](../README.md) (Build 13 overview + variant chooser), [`../aurora-concierge/README.md`](../aurora-concierge/README.md) (the other variant).

## Reference implementation

The complete reference app is at **[github.com/jaysanderson/Capstone-Atlas-Operations](https://github.com/jaysanderson/Capstone-Atlas-Operations)** — a Vite + React + TypeScript + Tailwind chassis that scores 100% against this brief once provisioned against a populated Nuclia KB. It includes:

- All five demo surfaces + landing + an `/ops` mock observability page.
- All three Tier-3 workflows (Onboarding-Path, Battle-Card, Compliance-Trace).
- The Tier-4 composite-RAG flagship (Incident Root Cause).
- Atlas corpus + anchor JSON + labelset config + graph-extraction-agent spec.
- Seed and verification scripts.
- Fly.io deploy config.

See the repo's `README.md` for quick-start and `KB_SETUP.md` for the end-to-end ingest checklist.

---

## 1. Why Atlas Operations exists

The Partner Enablement Framework names two top-priority assets: the Agent Workshop (Build 3) and Atlas Operations (Build 7). Of the two, Atlas Operations carries more weight because it does three jobs at once:

1. **Capstone.** It's the final certification artefact for every track. An individual at Solution-4 or Deliver-4 must have shipped and demoed a capstone example against a real customer's corpus.
2. **Sales-room closer.** It's the one thing a partner walks into a Fortune 500 CTO's office with that *cannot be reproduced* by a competitor's free trial. Atlas Operations is the proof that ARAG is a platform, not a chatbot.
3. **Re-skin chassis.** Every partner customer demo starts with a fork of Atlas Operations. Partners customise the corpus, the entity schema, the branding, and the workflows — but the chassis ships in working condition. This is how the programme scales without every partner SE re-inventing the same demo from one capstone to the next.

Foundations Builds 0–6 prove what ARAG *can do* across the individual patterns. Atlas Operations proves what an *enterprise platform built on ARAG* looks like in production, in one coherent product, against a recognisable enterprise corpus, with at least one custom data-augmentation agent live.

---

## 2. The Demo Buyer (the person Atlas Operations is built for)

Atlas Operations is a sales weapon. Every design decision in this brief is filtered through the question "does this help the partner close the room?"

- **Persona:** Enterprise CTO, CIO, or Chief Data Officer. 50,000+ employee company. Has seen four AI vendor demos this quarter, all of which were chatbots over PDFs.
- **What they care about:** Residency. Vendor lock-in. Cost-of-ownership over five years. Whether this is a feature their dev team will inherit and grow, or another wrapper they'll have to rip out next year.
- **What they're sceptical of:** "Magic" demos against pristine sandbox data. They want to see structured outputs, graph reasoning, and integration patterns — because that's what their architects have told them to look for.
- **What they leave with:** A 25-minute walkthrough they can describe to their board in three sentences. A reference architecture diagram. A clear understanding of the four-tier capability ladder. An invitation to a co-engineered POC against their corpus.

Atlas Operations's job is to compress that journey into 25 minutes.

---

## 3. The Persona Corpus — Atlas Global Industries

Atlas Operations demos against a fictional multinational manufacturer: **Atlas Global Industries**. Atlas is a 50,000-employee, four-region (NA/EU/APAC/LATAM), publicly listed industrial group with five business units (Industrial Equipment, Energy Systems, Building Automation, Logistics Software, Customer Services).

Atlas is chosen because:

- It maps cleanly to almost every partner's enterprise prospect. The cross-functional knowledge problem is identical at any large enterprise — partners can re-cast Atlas as a bank, a hospital network, a government department, a film studio without changing the chassis.
- Its content surface area is broad enough to demonstrate every tier of the capability ladder without feeling contrived.
- It's *recognisable but generic*. The buyer in the room recognises their own org. There's no risk of demoing against a real Fortune 500's content and losing trust.

### Single KB, multiple content domains via labelsets

Atlas Operations runs on **one ARAG Knowledge Box** (`kb-atlas-operations`) containing all corpus documents tagged with three labelsets. ARAG's labelset-driven filter composition (see) gives the demo every cross-domain capability of a multi-KB setup with a fraction of the operational complexity. Partners stand up one KB, not five — and customers can do the same in their POC.

| Labelset | Values | Volume target |
|---|---|---|
| `business_unit` | `hr`, `engineering`, `sales`, `customer_success`, `compliance` | Documents distributed roughly: HR 60–80, Engineering 80–100, Sales 60–80, CS 60–80, Compliance 50–70 |
| `content_type` | `policy`, `runbook`, `incident`, `case_study`, `audit_finding`, `proposal`, `deployment_guide`, `escalation`, `pricing`, `design_doc`, `rfc` | Each business unit owns a subset of these |
| `region` | `noram`, `emea`, `apac`, `latam` | Where the content originates / applies |

A query for "incident root cause" filtered to `business_unit:engineering` returns engineering incidents. A query for "policy" filtered to `region:emea AND business_unit:compliance` returns EU compliance policies. Cross-domain queries simply skip the filter. Same KB, same API, same auth token.

**Corpus build tool:** Use the `progress-kb-use-case-generator` skill from `anthropic-skills` to generate documents covering all five business units. The skill produces 56–63 realistic workplace documents per persona; run it five times — once per business unit — with the Atlas anchor details locked in advance so cross-business-unit references resolve cleanly. Then ingest all 300+ documents into the single KB, tagging each with its `business_unit`, `content_type`, and `region` values during ingest.

### Cross-business-unit anchor details (lock at corpus design time)

Every document across all five business units references the same fictional entities. This is what makes the graph navigation in the Tier 4 demo land.

- **5 customers:** Norvale Energy (utilities), Halcyon Logistics (3PL), Meridian Bank (financial services), Cresta Health Network (hospital group), Talos Steelworks (heavy industry).
- **8 products / SKUs:** Atlas E-220 turbine, Atlas Logix routing engine, Atlas BuildingHub controller, Atlas FieldOps mobile, etc.
- **6 named employees with role and tenure:** Priya Anand (VP Engineering, 8 yrs), Marcus Ortiz (Principal Architect, 12 yrs), Dr. Sara Vance (Chief Compliance Officer, 4 yrs), etc.
- **4 named incidents:** INC-2027-0142 (Q4 turbine cooling regression), INC-2027-0188 (Logix routing engine memory leak), INC-2028-0019 (BuildingHub firmware rollback), INC-2028-0034 (FieldOps offline sync corruption).
- **5 named regulations:** EU AI Act compliance, US NIST 800-53 r5, GDPR, Sarbanes-Oxley §404, HIPAA (Cresta Health overlap).

These anchors get embedded into every document the corpus generator produces. They drive the graph (Section 5) and the demo script (Section 9).

---

## 4. Scope

### In scope (must ship)

- One ARAG Knowledge Box (`kb-atlas-operations`) provisioned in **the region closest to you** — the same region you've used for every Foundations build (set in [Build 0 Step 1](../../build-00-hello-arag/2-walkthrough.md)). The other region is documented as failover but not deployed. All corpus documents ingested and labelset-tagged.
- One bespoke data-augmentation agent extracting a typed graph spanning all business units (filtered at query time to specific business units when relevant).
- Five branded demo surfaces (one per tier of the capability ladder, plus the Atlas Operations landing page).
- Three custom Tier 3 workflows (schema-constrained generation) live and demo-ready.
- One Tier 4 composite RAG flow live (the "incident root cause" workflow).
- Rate-limit-aware client (documented; doesn't need stress-testing in the demo).
-  is the technical baseline — fork it, don't rebuild from zero. The repo is at ``.
- Re-skin playbook (Section 10) shipped alongside the build.
- 25-minute demo script (Section 9) rehearsed by the build owner. Recording is OPTIONAL — record one full take if you plan to use this build as a partner-marketing asset, or deliver the demo live to the review board. The recording checklist (Phase 6) is provided either way.

### Out of scope (explicitly)

- Real customer data. Atlas Operations is a demo asset, not a deployable customer product. Customers see their own corpus during a co-engineered POC, not in Atlas Operations.
- Authentication beyond a hard-coded demo user. No SSO, no multi-tenant. The framework's Tier 4 production-readiness conversations point at Build 6 deliverables, not at Atlas Operations.
- Mobile-first responsive design. Demo runs on a 13" laptop or larger. Tablet rendering acceptable but not optimised.
- Search relevance tuning beyond defaults. Atlas Operations demos *what's possible*, not *what's tuned*. Tuning conversations happen in customer POCs.
- Per-partner branding inside the canonical Atlas Operations. Branding flexibility lives in the re-skin playbook (Section 10), not the master build.

---

## 5. Architecture

### 5.1 Topology

```
┌─────────────────────────────────────────────────────────────┐
│  Atlas Operations Frontend (Next.js or Vite + React)          │
│  Branded shell • 5 demo surfaces • Residency badge          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS + X-NUCLIA-SERVICEACCOUNT
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Progress Agentic RAG (your provisioned region)              │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  kb-atlas-operations  (single KB)              │         │
│  │  Labelsets: business_unit, content_type, region│         │
│  │  300+ documents tagged at ingest               │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  ┌──────────────────────────────────────────────┐           │
│  │ Data-Augmentation Agent (custom graph extract)│           │
│  │ Entity types: EMPLOYEE, PRODUCT, INCIDENT,    │           │
│  │ CUSTOMER, REGULATION, RUNBOOK, POLICY,        │           │
│  │ BUSINESS_UNIT, REGION                         │           │
│  └──────────────────────────────────────────────┘           │
│                                                              │
│  Generation: KB-configured LLM endpoint (platform default)  │
└─────────────────────────────────────────────────────────────┘
```

> **Note on BYO-LLM.** BYO-LLM is a per-KB platform configuration (Azure OpenAI / Google Vertex / AWS Bedrock — see [Build 11 lesson](../../build-11-production-readiness/1-lesson.md#byo-llm-bring-your-own-llm)), not a UI lever in this capstone. Atlas Operations ships with the platform default generator and *no* in-app toggle. The "what about lock-in?" question is answered with the residency badge and the live KB stats in the hero — proof points the demo actually carries. The descoped pattern (no env vars, no UI surface, plus a graph-extraction blocklist so the model can't surface "BYO-LLM" as a product node) is documented in [*When BYO-LLM doesn't fit: clean descope*](../../build-11-production-readiness/1-lesson.md#when-byo-llm-doesnt-fit-clean-descope).

### 5.2 Frontend stack

- **Framework:** Next.js 14 (App Router) or Vite + React 18 — choose whichever the build owner is fastest in. The  is Vite; staying consistent reduces fork cost.
- **Styling:** Tailwind CSS with a Atlas-Operations-specific palette (dark control-room aesthetic — slate-950 base, electric-blue and amber accents). Avoid the demo teal/navy palette so the two repos are visually distinct.
- **Routing:** React Router v7 (matches ). Five top-level routes plus the landing page.
- **State:** React Context for the active KB, the demo "presenter mode" hotkeys, and (optionally) the language selector for the Concierge surface. No Redux, no Zustand — keep dependencies thin.

### 5.3 Backend stack

- **ARAG only.** No custom backend. Atlas Operations talks directly to ARAG endpoints exactly the way  does. This is itself a demo point — *there is no middleware to maintain*.
- **Generation backend:** Configured at the KB level via the Nuclia dashboard. Not exposed in the demo UI (see Build 11 for when and how to surface BYO-LLM to a customer — descoped here so the demo only claims what it actually ships).

### 5.4 Data-augmentation agent — the typed graph

The graph is the *single most differentiated* piece of Atlas Operations. It's what no competitor can demo against an enterprise corpus in under 30 minutes.

**Entity schema (lock during Phase 2):**

| Type | Examples |
|---|---|
| `EMPLOYEE` | Priya Anand, Marcus Ortiz, Dr. Sara Vance |
| `PRODUCT` | Atlas E-220, Atlas Logix, Atlas BuildingHub |
| `BUSINESS_UNIT` | Industrial Equipment, Energy Systems, Customer Services |
| `CUSTOMER` | Norvale Energy, Meridian Bank, Cresta Health Network |
| `INCIDENT` | INC-2027-0142, INC-2028-0019 |
| `REGULATION` | EU AI Act, NIST 800-53 r5, GDPR, SOX §404, HIPAA |
| `POLICY` | Atlas Code of Conduct, Atlas Data Handling Policy v3.1 |
| `RUNBOOK` | RB-E220-Cooling-001, RB-Logix-MemLeak-002 |
| `REGION` | EMEA, NORAM, APAC, LATAM |
| `ROLE` | VP Engineering, Principal Architect, CSM, CCO |

**Relation schema:**

| Relation | Domain → Range | Examples |
|---|---|---|
| `owns` | EMPLOYEE → PRODUCT | Priya owns Atlas E-220 |
| `affected` | INCIDENT → PRODUCT | INC-2027-0142 affected Atlas E-220 |
| `escalated_to` | INCIDENT → EMPLOYEE | INC-2028-0019 escalated to Marcus |
| `serves` | EMPLOYEE → CUSTOMER | Priya serves Norvale Energy |
| `purchased` | CUSTOMER → PRODUCT | Norvale purchased Atlas E-220 |
| `complies_with` | PRODUCT → REGULATION | Atlas E-220 complies with NIST 800-53 |
| `governs` | POLICY → BUSINESS_UNIT | Atlas Data Handling Policy governs all BUs |
| `remediates` | RUNBOOK → INCIDENT | RB-E220-Cooling-001 remediates INC-2027-0142 |
| `mentions` | (any field text) → (any entity) | Generated automatically |
| `learned_from` | RUNBOOK → INCIDENT | RB v2 learned from earlier incident |

**Agent tool:** Use the `arag-graph-agent` skill from `anthropic-skills` to design and generate the extraction agent. The skill samples the KB, analyses the domain, designs the schema (which can be hand-tuned against the table above), and produces a ready-to-run Python script. Run the agent against the single Atlas KB.

**Why this matters:** The buyer in the room has never seen a graph generated from their own content. Every other AI vendor demos retrieval; only ARAG demos *structured reasoning over relationships*. Atlas Operations is the proof.

### 5.5 The five demo surfaces

These are the routes a presenter walks through. Each maps to one or more tiers in the capability ladder.

| Route | Tier(s) | Purpose |
|---|---|---|
| `/` (landing) | — | Hero. Shows the residency badge and live ingested-corpus stats (resources, paragraphs, graph nodes — pulled from the KB at page load). 90 seconds. |
| `/search` | Tier 1 + Tier 2 | The "everyone needs better search" demo. Hybrid search across the Atlas KB with business-unit + content-type filters, AI Answer, citation deep-links. |
| `/concierge` | Tier 2 | Two prompt voices over the same KB — *Employee* mode (concise + 1 CTA) and *Architect* mode (detailed + multi-source citations). Voice swap on a UI toggle. |
| `/workflows` | Tier 3 | The three live structured-generation workflows (Section 6). |
| `/graph` | Tier 4 | The Atlas knowledge graph. Click any entity, traverse paths, see related resources via hybrid retrieval. |
| `/incident-root-cause` | Tier 4 (composite RAG) | The flagship Tier 4 flow. Ask "What's the root cause of INC-2028-0019?" — composite RAG fires `/ask`, evaluates citations, falls back to `/find` if low confidence, queries the graph for related incidents on the same product, re-asks with augmented context. Three-step pipeline visualised in the UI. |

---

## 6. The three Tier 3 workflows

Each workflow is a schema-constrained generation pattern that mirrors a real enterprise need. Each is a live demo button on the `/workflows` route.

### 6.1 Onboarding-Path Generator

- **What it does:** Given a new hire's role and team, generates a 30/60/90-day onboarding plan combining HR policies, product overviews, customer assignments, and required reading.
- **Inputs:** `role` (free text), `team` (dropdown), `region` (dropdown).
- **ARAG primitive:** P3 (Constrain) — `askForJson` with schema `{ plan: { day_30: [...], day_60: [...], day_90: [...] }, required_reading: [{ title, kb, url }], assigned_customer_intros: [{ customer, csm_employee, talking_points: [...] }] }`.
- **Why it lands in the room:** Every CTO has tried to solve onboarding with a Notion template. Atlas Operations generates a personalised one from cross-KB content in 8 seconds.

### 6.2 Battle-Card Generator

- **What it does:** Given a customer and a competitor, generates a structured battle card combining historical deal context, regional pricing, product positioning, and known objection patterns.
- **Inputs:** `customer` (dropdown of 5 fictional Atlas customers), `competitor` (free text).
- **ARAG primitive:** P3 (Constrain).
- **Schema:** `{ positioning: { our_strengths: [...], our_weaknesses: [...] }, customer_context: { tenure_years, current_products, prior_objections }, regional_pricing: { region, list_price, typical_discount }, recommended_proof_points: [{ title, source_url }] }`.
- **Why it lands:** Sales-content generation is the most common enterprise AI ask. Atlas Operations shows it grounded, structured, and demo-able in seconds.

### 6.3 Compliance-Trace Generator

- **What it does:** Given a regulation, traces which products, business units, and runbooks comply with it; surfaces audit findings and remediation status.
- **Inputs:** `regulation` (dropdown of 5 fictional regulations).
- **ARAG primitive:** P3 + P4 (Constrain + Reason over relations). This is the cross-primitive demo workflow — schema-constrained output that *includes a graph traversal* in the prompt.
- **Schema:** `{ regulation: { name, summary }, governed_products: [{ name, compliance_status, last_audit_date }], outstanding_audit_findings: [{ id, severity, owner, deadline }], related_policies: [{ name, version }] }`.
- **Why it lands:** Compliance officers in the room cry. This is the workflow that turns Atlas Operations from "cool demo" into "we need to talk to procurement."

---

## 7. Build Plan (8 weeks, single strong full-stack engineer with Progress SE support)

Total target: **8 weeks of focused work**, or **4 weeks at 2 FTE**. Phases can run partially in parallel.

### Phase 1 — Corpus design + KB ingestion (Weeks 1–2)

- Lock the Atlas anchor details (5 customers, 8 products, 6 employees, 4 incidents, 5 regulations).
- Run `progress-kb-use-case-generator` five times — once per KB — with anchor details supplied as inputs. Hand-edit for cross-KB consistency.
- Provision one ARAG KB (`kb-atlas-operations`) in **the same region you've used for every Foundations build** (set in Build 0 Step 1 — the rule is: pick the option closest to you geographically, then stick with it). Configure four labelsets (`business_unit`, `region`, `content_type`, `audience`) before ingest. Ingest all 300+ documents and tag each with appropriate labelset values during ingest.
- **Exit criteria:** Atlas KB ingested and labelset-tagged. `/find` and `/ask` filtered by `business_unit:engineering` (and other values) return correctly scoped results.

### Phase 2 — Data-augmentation agent design + deployment (Weeks 2–3)

- Use `arag-graph-agent` skill to draft the extraction agent from a sample of the engineering and customer-success KBs.
- Hand-tune the entity schema and relation schema against the tables in Section 5.4.
- Run the agent against the Atlas KB. Verify graph queries return clean results (no GUID noise, no default-NER pollution).
- **Exit criteria:** `POST /v1/kb/{id}/graph` with `{prop:'generated', by:'data-augmentation'}` returns a typed graph the build owner is willing to demo on camera.

### Phase 3 — Build the chassis + Atlas Operations branding (Weeks 3–4)

- Stand up a fresh Vite + React app in a private repo named `Capstone-Atlas-Operations`. Apply the Atlas design system (dark slate base, electric-blue and amber accents).
- Wire the ARAG client wrapper (from Foundations Builds 0–6) into the chassis. Single env var: `NUCLIA_KB_ID=kb-atlas-operations`. All demo surfaces route through this one KB.
- Build the static landing copy in the Atlas voice.
- Wire the residency badge + live KB stats (resources, paragraphs, graph nodes) into the hero — these are the proof points the demo carries instead of a BYO-LLM toggle. The stats are read at page load via `/v1/kb/{id}/counters` and `/v1/kb/{id}/graph/nodes`.
- Where the application would route between two KBs based on user state (e.g., employee vs executive), route by **labelset filter** on the single Atlas KB instead.
- **Exit criteria:** All five demo routes loading against the Atlas KB with no placeholder content remaining.

### Phase 4 — The three Tier 3 workflows + composite-RAG flow (Weeks 4–6)

- Build the three schema-constrained workflows on `/workflows`. Each is a button that fires `askForJson` against a locked schema.
- Build the composite-RAG flow on `/incident-root-cause`. Three steps visualised in the UI:
  1. Initial `/ask` against engineering KB.
  2. Citation evaluation; if low confidence, `/find` against the Atlas KB without labelset filters (so the search spans all business units).
  3. Graph traversal for related incidents on the same product.
  4. Re-ask with augmented context including the graph results.
- Each workflow ships with a presenter-mode hotkey for "go straight to the answer" if the LLM is slow.
- **Exit criteria:** All four workflows demoable end-to-end without code edits in the demo run.

### Phase 5 — Production-readiness layer + observability (Week 6–7)

- Residency badge visible in the header — shows "EU" or "USA" based on the active KB region.
- Rate-limit-aware client (backoff + request coalescing) implemented in the ARAG client wrapper.
- Observability dashboard (Grafana or simple in-app panel) showing p50/p95 latency, citation rate, and per-endpoint request volume. Visible from a `/ops` route.
- **No BYO-LLM toggle in the UI.** Generation backend is set once at the KB level via the Nuclia dashboard; the demo never claims a per-click switch it doesn't ship. See [Build 11 — *When BYO-LLM doesn't fit*](../../build-11-production-readiness/1-lesson.md#when-byo-llm-doesnt-fit-clean-descope) for the discipline.
- **Exit criteria:** A live CTO question about residency, lock-in, or rate limits has a one-click visual answer from inside Atlas Operations.

### Phase 6 — Demo script + (optional) recording + re-skin playbook (Week 7–8)

- Rehearse the 25-minute demo script (Section 9) end-to-end three times.
- **Optional:** record one full take if you're using this build as a partner-marketing or training asset. The recording checklist below (Phase 6 — Section 10) walks you through the production-quality setup. If you're not planning to publish the recording, skip this — a live demo for the review board is equally valid.
- Write the re-skin playbook (Section 10).
- Internal review board: Progress Solution lead + at least one partner SE not involved in the build evaluates the full 25-minute demo — delivered live or as a recording, partner's choice.
- Fix every "I wouldn't have understood that" note from review.
- **Exit criteria:** Demo delivered to and passed by the review board (live or recorded). Re-skin playbook committed to this repo.

---

## 8. Effort estimate breakdown

| Phase | Weeks | Effort drivers |
|---|---|---|
| 1. Corpus + ingestion | 2 | Skill orchestration, anchor consistency editing, KB ingestion + labelset config |
| 2. Graph agent | 1.5 | Agent design, schema tuning, full-corpus extraction run |
| 3. Fork + reskin | 1 | Tailwind palette swap, landing page rewrite, residency badge + live KB stats in the hero |
| 4. Workflows + composite RAG | 2 | Three schemas + UI for each, composite-RAG pipeline visualisation |
| 5. Production readiness | 1 | Residency badge, observability panel, rate-limit-aware client |
| 6. Demo + re-skin playbook | 0.5 | Script, rehearsal, (optional) recording, playbook |
| **Total** | **8 weeks** | Single strong full-stack engineer with Progress SE on call for skill orchestration |

---

## 9. The 25-Minute Demo Script

This is the script the build owner rehearses to certification. Times are cumulative.

### 0:00 — 1:30 | Hero + framing (90 sec)

> "Most AI demos you've seen this quarter are chatbots over PDFs. This is not that.
>
> Atlas Operations is a single application built on Progress Agentic RAG. It's an enterprise control room for unstructured knowledge — search, chat, structured generation, knowledge-graph reasoning, multimodal retrieval, and production operations, all behind one API key.
>
> The corpus I'm demoing against is a fictional company called Atlas Global Industries. Fifty thousand employees, four regions, five business units. One Knowledge Box. Three labelsets — business unit, content type, region — covering HR, Engineering, Sales, Customer Success, Compliance. Every filter in this demo is a labelset query, not a separate KB. That matters when we talk about how your team would deploy this against your own corpus.
>
> Two things to notice before we start. Top-right: the residency badge — this KB is provisioned in the **<your-region>** region (substitute the region you provisioned in — EU or USA — when you record), and that's verifiable in our Nuclia dashboard. And right beneath the hero: live ingested-corpus stats, pulled at page load — that's the actual count of resources, paragraphs, and graph nodes in this KB. Not a slide. Real numbers, real KB."

> "The generation backend — which LLM produces the words — is configured at the KB level on the platform side, and we'll wire it into *your* Azure or Vertex or Bedrock tenant during the co-engineered POC. That's how BYO-LLM works in production. We're not faking it with a toggle in the demo UI today; what you'll see today is on the platform's default generator. The lock-in answer lives in the residency badge and the platform architecture, not in a click."

### 1:30 — 5:30 | Tier 1: Search (4 min)

*[Navigate to `/search`. Search query: "What's the maintenance interval for the E-220 turbine?"]*

> "Two-second answer with five citations. Notice the AI answer at the top is two sentences — that's a prompt parameter. Notice the citations are scored. Notice the People Also Ask panel — that's a schema-constrained call running in parallel."

*[Click a citation. Land on the source doc.]*

> "Standard Tier 1 — grounded retrieval with citations. Every AI vendor will demo this. Let's go further."

### 5:30 — 9:30 | Tier 2: The two-voice concierge (4 min)

*[Navigate to `/concierge`. Toggle to *Employee* mode. Query: "I'm onboarding to the BuildingHub team — what do I need to know in week one?"]*

> "Concise. Three sentences. One call-to-action. Notice the CTA is a real link from the corpus — that's not hard-coded; the model picked it from a content-engineered field."

*[Toggle to *Architect* mode. Same query.]*

> "Same KB. Same query. Different prompt. Five paragraphs, six citations, technical depth. The CTO building a research workspace and the BDR building a chatbot are looking at the same content, the same API, the same model. The only thing that changes is the prompt template — and that's a configuration, not a code deployment."

*[Briefly demonstrate the language switch.]*

> "And the multilingual answer is a query-prefix away. No separate KB, no separate embeddings."

### 9:30 — 14:30 | Tier 3: The three workflows (5 min)

*[Navigate to `/workflows`. Click "Onboarding-Path Generator". Inputs: role = Senior CSM, team = Customer Services, region = EMEA.]*

> "Schema-constrained generation. The output is type-safe JSON — you can wire it into a UI, an API, or another ARAG call. This is the moment ARAG stops being a chatbot and becomes a programmable backend.
>
> Day 30: HR onboarding plus three customer intros pulled from Customer Success. Day 60: technical product reading from Engineering. Day 90: regulated-region compliance modules from Compliance. Cross-KB. In nine seconds."

*[Click "Battle-Card Generator". Inputs: customer = Meridian Bank, competitor = generic competitor name.]*

> "Same primitive, different schema. Structured battle card with regional pricing, historical objections, and source-linked proof points. This is what every enterprise sales-content team wants and no vendor delivers in production."

*[Click "Compliance-Trace Generator". Input: regulation = EU AI Act.]*

> "Watch this one — it's the cross-primitive workflow. The schema constraints the output, *and* the model traverses the knowledge graph mid-generation to find which products comply, which audit findings are outstanding, and who owns the remediation."

*[Result renders.]*

> "Every audit finding has an owner. Every owner is a real employee in the HR KB. Every product is linked to a remediation runbook. That cross-KB traversal is the next tier."

### 14:30 — 19:30 | Tier 4: The knowledge graph (5 min)

*[Navigate to `/graph`. The initial graph loads — Atlas employees, products, customers, incidents, regulations as coloured nodes.]*

> "This graph wasn't curated. It was extracted from the corpus by a data-augmentation agent — a custom extraction agent designed for the Atlas schema. Nine entity types, ten relation types, all bespoke to this domain.
>
> The default named-entity recognition you get from any LLM gives you DATES, ORGANISATIONS, PEOPLE — usable for nothing. ARAG lets you ship a *typed* graph specific to your business."

*[Click on the EMPLOYEE node for Priya Anand.]*

> "Priya is VP Engineering. She owns three products, serves two customers, and was escalation point for INC-2027-0142."

*[Click the INC-2027-0142 node. Graph expands.]*

> "That incident affected the E-220 turbine, was remediated by Runbook RB-E220-Cooling-001, and the runbook references the EU AI Act compliance review. Three hops. Every edge is queryable through one API."

*[Click on the EU AI Act node.]*

> "Hybrid retrieval — keyword plus semantic — pulls back every document mentioning EU AI Act. Eight results. One click, eight sources, one graph."

### 19:30 — 23:30 | Tier 4 capstone: The composite-RAG flow (4 min)

*[Navigate to `/incident-root-cause`. Query: "What's the root cause of INC-2028-0019?"]*

> "Most AI vendors handle this by hitting the KB once and hoping. Watch the pipeline."

*[Step 1 visualisation: Initial `/ask` query. Citations come back with confidence scores. The UI flags two citations as low-confidence.]*

> "Step one: standard retrieval-augmented query. Two citations came back, both below our confidence threshold. The model isn't confident — and crucially, it *knows* it isn't confident."

*[Step 2 visualisation: `/find` fires across the Atlas KB without business-unit filter — spanning all content domains.]*

> "Step two: when confidence is low, the pipeline falls back to a hybrid find across the whole KB — dropping the business-unit filter so every domain is in scope. Five more candidate documents pulled in."

*[Step 3 visualisation: Graph traversal. The graph view fires for INC-2028-0019 → affected PRODUCT → similar past INCIDENTS on same product.]*

> "Step three: the graph adds two related incidents on the same product. The pipeline pulls their runbooks."

*[Step 4: Final composite answer renders with merged citations.]*

> "Step four: re-ask with everything augmented in. Final answer — root cause was a regression introduced by Patch 3.4, identical signature to INC-2027-0142, remediated by Runbook RB-Logix-MemLeak-002. Eleven citations. Three of them couldn't have been found by single-shot retrieval.
>
> *That* is agentic RAG. Generate, evaluate, retrieve more, traverse relationships, re-ask. Every step is observable. Every step is yours to tune."

### 23:30 — 25:00 | Close + invitation (90 sec)

*[Return to landing page.]*

> "What you've seen is one application built on one Knowledge Box, five business-unit labelsets, one extraction agent, all running in a single platform-resident region you can verify in our dashboard. Twenty-five minutes ago you couldn't have built this in five years. Today it's a fork of an open reference app, one labelset config, and an extraction agent your team configures.
>
> Three things you have right now that none of your other AI vendors offer:
>
> 1. Residency you choose. EU or USA. Per Knowledge Box.
> 2. The LLM you already pay for. Azure, Vertex, Bedrock. ARAG orchestrates; you pick the model.
> 3. A platform, not a feature. Every AI surface you'll ship in the next three years lives behind this API.
>
> The next step is a four-week co-engineered POC against your own corpus. We pick one of the workflows you saw today, replace Atlas with your data, and Atlas Operations becomes *your* Atlas Operations. Let me show you the scoping doc."

*[End of 25-minute demo.]*

---

## 10. Re-Skin Playbook

This section lives in the repo as a separate `RESKIN.md` once the build ships. Brief sketch here so partners know what they're signing up for.

A partner takes Atlas Operations and re-points it at their customer's domain. The work is structured, time-boxed, and uses the same skills (`progress-kb-use-case-generator`, `arag-graph-agent`) that built the master.

### What stays

- Five-surface route structure.
- Residency badge + live ingested-corpus stats in the hero.
- Composite-RAG flow.
- Schema-constrained workflow chassis.
- All hotkeys and presenter-mode behaviour.

### What changes per customer

| Asset | Effort | Tool |
|---|---|---|
| Corpus (one KB with labelsets across customer content) | 1–2 weeks | Customer-supplied or `progress-kb-use-case-generator` if synthetic |
| Anchor entities (customers, products, employees, incidents, regs) | 1 week | Manual + corpus skill |
| Entity / relation schema | 3–5 days | `arag-graph-agent` with hand-tuning |
| Three workflow schemas | 1 week | Hand-design against customer's stated needs |
| Branding (palette, logo, tone) | 2–3 days | Tailwind config swap + copy edit |
| Demo script (talk track) | 2 days | Rewrite Section 9 against customer's domain |
| **Total per customer demo** | **3–4 weeks** | One strong engineer + one partner SE |

### Tier-3 customer offering

Partners offer "Atlas Co-Engineering" as a fixed-scope, fixed-price engagement: **3-week re-skin + 1-week dry run + delivered demo asset**. Price band: $40–80K depending on corpus complexity. Sold as the entry point to a $250K+ Tier 3 platform engagement. Customers keep the deliverable.

---

## 11. Success criteria — what "done" looks like

Atlas Operations ships when *all* of the following are true:

1. The full 25-minute demo runs end-to-end without code edits, in front of two reviewers, without the build owner touching the keyboard outside of the documented hotkeys.
2. The Atlas knowledge graph returns at least 200 typed-entity nodes and 500 typed relations across the Atlas KB.
3. The composite-RAG flow demonstrably outperforms a single-shot `/ask` for the four named incidents — measured by citation count and reviewer-judged answer quality.
4. The hero shows live KB stats (resources, paragraphs, graph nodes) read from the active KB at page load — no hardcoded numbers, no slides.
5. The 25-minute demo is delivered to and passed by the review board (live or recorded — partner's choice).
6. The re-skin playbook is committed to this repo.
7. The build owner has trained at least one other Progress SE to deliver the demo cold.

---

## 12. Owners, dependencies, status

| Item | Owner | Status |
|---|---|---|
| Brief (this doc) | Jay Sanderson | **Shipped — this commit** |
| Atlas anchor details | Jay Sanderson | TODO — Phase 1 prerequisite |
| Corpus generation (one KB + labelset tagging) | Progress SE + `progress-kb-use-case-generator` skill | TODO |
| Graph agent | Progress SE + `arag-graph-agent` skill | TODO |
| Capstone chassis (Phase 3) | Build owner | TODO |
| Three Tier 3 workflows | Build owner | TODO |
| Composite-RAG flow | Build owner | TODO |
| Production-readiness layer | Build owner | TODO |
| 25-minute demo (live or recorded) | Build owner | TODO |
| Re-skin playbook (`RESKIN.md`) | Build owner | TODO |
| Internal review board | Progress Solution lead | TODO |

**Critical path:** Phase 1 → 2 → 3. Without the corpus and the graph, the workflows have nothing to work against. If the build slips, the right thing to cut is Phase 5 observability — not Phase 2 graph extraction. The graph is what makes Atlas Operations un-cloneable.

---

## 13. What I need from you to start Phase 1

Two decisions before the first KB is provisioned:

1. **Atlas anchor details — sign-off or override.** I've sketched five customers, eight products, six employees, four incidents, five regulations. Want them refined? Want a different industry instead of industrial manufacturing — banking, healthcare, public sector? Lock now.
2. **Build owner.** Single engineer or partner team? If solo, eight weeks is the honest estimate. If two FTE, four weeks. If you want this faster than four weeks, scope needs to drop — almost certainly Phase 5 observability.

Once those two are answered, Phase 1 kicks off and you'll see the first KB ingested inside a week.
