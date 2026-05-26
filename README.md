# Progress Agentic RAG — Partner Enablement Framework

> **Position:** ARAG is a *platform*, not a chatbot.
> **Thesis:** Partner competency, not partner enthusiasm, predicts ARR.
> **Evidence base:** Every technical pattern in this document is wired live in the Sample ARAG App (`Sample-ARAG-App/src/`). Every commercial claim is grounded in the Progress KB (data residency, BYO-LLM, rate limits).
> **Audience:** Channel program owners, partner managers, partner SEs, and the partner orgs themselves.
> **Owner:** Jay Sanderson — Vested Technology / Progress GTM
> **Last updated:** 2026-05-27

---

## Part I — Operating Model

### The thesis

Channel partners don't fail at ARAG because they lack motivation. They fail because they pitch ARAG as "ChatGPT for your data" and lose to every commodity vendor with a free trial. The fix isn't marketing collateral — it's competency. Competency moves a partner from selling a feature to selling a platform; that move triples the average deal and locks in five-year customers.

The whole framework rests on one chain of causation:

**Competency → Tier → ARR.**

A partner's measured competency drives the org's tier, the tier drives the commercial terms (margin band, MDF, lead share), and the commercial terms drive the deal economics that make ARAG worth selling. Break any link and the program collapses — competency without tier incentives is charity, tiers without competency is a vendor giveaway.

### Three non-negotiable principles

1. **Position ARAG as a platform, not a feature.** Every demo, deck, and battle card leads with the five primitives (Retrieve, Generate, Constrain, Reason, Stream-secure media). Partners who pitch ARAG as "chat + search" cap their own deal sizes at $80K. Partners who pitch it as a programmable knowledge layer build $500K–$2M ACV accounts.
2. **Competency before commission.** No partner organisation accesses MDF, lead share, or premier margin until at least one of their reps holds a current Solution-track certification. Goodwill tiers produce dabblers; competency tiers produce closers.
3. **Build, don't slide.** Partners spend 70% of their enablement time in a sandbox shipping working code, 20% in peer review and office hours, 10% in classroom or self-paced content. Any partner-facing programme that flips the ratio gets killed in review.

### The 70-20-10 learning model

| Mode | Share | What it looks like |
|---|---|---|
| Experiential (70%) | Sandbox builds, hands-on code, customer POCs co-delivered with Progress SEs | Sample ARAG App as the starter codebase, Builds 0–7 as the curriculum, real KB credentials provisioned per partner |
| Social (20%) | Office hours, partner Slack, recorded demo reviews, peer-graded build submissions | Weekly build clinics, monthly partner roundtables, recorded-demo certification gates |
| Formal (10%) | Decks, talk tracks, written guides, this framework | The capability ladder in Part III, battle cards, the asset library in Part VI |

The mix is structural. If a partner manager catches herself defaulting to "let's do another deck," she's instructed to schedule a build clinic instead.

---

## Part II — Role-Based Competency Model

An AE, an architect, and a developer can't be enabled the same way and shouldn't be measured against the same bar. Three tracks, three audiences, three different forms of mastery.

### The three tracks

| Track | Audience | Outcome |
|---|---|---|
| **Sell** | AEs, BDRs, CSMs, marketing | Can position ARAG as a platform, qualify the right opportunity, run a 30-minute demo, defend the price |
| **Solution** | Solution engineers, solution architects, principal consultants | Can design a multi-tier ARAG solution, scope a POC, defend the architecture in a CTO meeting, write the SOW |
| **Deliver** | Developers, integration engineers, ML engineers, PS leads | Can ship the build, debug retrieval quality, design schemas, configure data-augmentation agents, harden for production |

### Aware / Should / Must competency matrix

Every named competency below maps to one of three depths:

- **Aware** — can recognise it, can answer a customer asking about it.
- **Should** — can run it themselves with a reference open.
- **Must** — can teach it, debug it, and deliver it in production without supervision.

This is the spine of certification. The matrix below shows the bar each track must meet. It's the assessment rubric for every recorded-demo gate in Part IV.

| Competency | Sell | Solution | Deliver |
|---|---|---|---|
| **Five primitives vocabulary** (P1–P5) | Must | Must | Must |
| **Tier 1 — grounded search & Q&A** | Must | Must | Must |
| **Tier 2 — multi-surface conversational intelligence** | Should | Must | Must |
| **Tier 3 — structured AI workflows (askForJson)** | Aware | Must | Must |
| **Tier 4 — agentic & knowledge-graph platform** | Aware | Must | Must |
| **Prompt engineering patterns (Part III §3.5)** | Aware | Must | Must |
| **Gating & monetisation patterns** | Should | Must | Should |
| **Field engineering as a service** | Aware | Must | Must |
| **Composite RAG / agentic patterns** | Aware | Must | Must |
| **Data-augmentation agent design** | Aware | Should | Must |
| **Production readiness (residency, BYO-LLM, rate limits)** | Should | Must | Must |
| **Pricing & commercial structure** | Must | Should | Aware |
| **Discovery & qualification** | Must | Should | Aware |
| **Win/loss debrief & competitive response** | Must | Should | Aware |
| **Sample ARAG App walkthrough** | Should | Must | Must |
| **Mission Control reference build** | Should | Must | Must |

A partner organisation reaches a given tier only when at least one named individual meets every Must in every relevant track. No exceptions.

### The five primitives (the shared vocabulary)

These are the building blocks. Every member of every track names them before they're allowed near a customer. They map 1:1 to the ARAG API surface:

| # | Primitive | Endpoint | What it does |
|---|---|---|---|
| **P1** | **Retrieve** | `/v1/kb/{id}/find`, `/catalog`, `/labelsets` | Semantic + keyword + filtered search across any corpus. Hybrid mode via `features:['keyword','semantic']`, classification-label filters, icon/mimetype filters, score-ranked paragraph matches with timestamp positions |
| **P2** | **Generate** | `/v1/kb/{id}/ask` (sync via `x-synchronous: true` or streaming NDJSON) | LLM-grounded answer with retrieval implicit. Streams `answer`, `retrieval`, `augmented_context`, `metadata`, `status` items. Custom prompt templates with `{context}` and `{question}` placeholders |
| **P3** | **Constrain** | `/v1/kb/{id}/ask` with `answer_json_schema` | Same generation engine, output bound to a JSON Schema. Turns ARAG into a programmable backend |
| **P4** | **Reason over relations** | `/v1/kb/{id}/graph`, `/graph/nodes` | Typed knowledge graph. Nodes by entity group, fuzzy node search, undirected path queries. Filter to `{prop:'generated', by:'data-augmentation'}` to isolate bespoke graphs from default NER |
| **P5** | **Stream & secure media** | `/v1/kb/{id}/resource/{id}`, `.../download/field` | Resource fetch with `basic`, `origin`, `extra`, `values`, `extracted` bundles. DASH MPD streaming with auth headers injected on every segment, blob fallback for any field |

Every Tier 2–4 use case is built by composing 2–4 of these in series or parallel. Partners who can't name the primitive can't pitch the platform.

---

## Part III — The Build Curriculum (Builds 0–7)

Builds are the spine. Each build is a hands-on exercise against a real ARAG sandbox, ships a specific artefact, and carries a pass/fail rubric. Builds are owned by one or more tracks and map directly to the technical capability ladder.

The full ladder — Tier 1 (Foundations) → Tier 2 (Multi-Surface Conversational Intelligence) → Tier 3 (Structured AI Workflows) → Tier 4 (Agentic & Knowledge-Graph Platform) — is the *what*. The Builds 0–7 are the *how partners learn to do it*.

### Build 0 — Hello ARAG

| Field | Value |
|---|---|
| **Owning track(s)** | Sell, Solution, Deliver — all three start here |
| **Tier mapped to** | Tier 1 prep |
| **What the partner does** | Provisions a sandbox KB, ingests 10 documents from their own corpus, makes their first `/ask` call from `curl`, runs `/find` for a semantic search, opens the Sample ARAG App and points it at their KB |
| **Pass rubric** | (1) Sandbox KB provisioned and reachable. (2) Three successful streamed answers against their content with citations rendered. (3) Sample ARAG App `/assistant` page running locally against their KB. Reviewer signs off. |
| **Asset delivered** | A 30-minute recorded run-through of the partner's own corpus answering three of their customer's most common questions. This is the first thing they show in a customer meeting. |

### Build 1 — Grounded search & drop-in widgets

| Field | Value |
|---|---|
| **Owning track(s)** | Sell (Should), Deliver (Must) |
| **Tier mapped to** | Tier 1 |
| **What the partner does** | Embeds `<nuclia-search-bar>`, `<nuclia-chat>`, `<nuclia-popup>` on a real partner website with branded theming (`--nuclia-color-primary`, base64'd CSS via `csspath`). Configures content-type filters and label filters. Ships a `?q=` deep-link experience. |
| **Pass rubric** | (1) Widgets live on a public URL. (2) Branded styling matches the partner brand. (3) Search results return content-type-filtered and topic-filtered. (4) Demo-ready in under five minutes. |
| **Asset delivered** | A "Demo a chatbot in 30 minutes" playbook with the partner's branded widget HTML snippet and a slide describing how the same KB powers both the search bar and the chat. See `Sample-ARAG-App/src/pages/widgets/WidgetShowcasePage.tsx` and `snippetData.ts`. |

### Build 2 — Multi-surface conversational intelligence

| Field | Value |
|---|---|
| **Owning track(s)** | Sell (Should), Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 2 |
| **What the partner does** | Builds a floating chat with two distinct prompt modes — *prospect* (concise + one CTA from the corpus) and *member* (detailed + multi-source citations). Both modes route to the same KB; the only difference is the prompt and the post-processing. Implements `{context}`/`{question}` placeholders, query-prefix language switching, and resource-scoped chat. |
| **Pass rubric** | (1) Two prompt modes demonstrably differ in voice, length, and CTA behaviour. (2) A `Respond in {language}: ` prefix produces a working multilingual answer. (3) Resource-scoped chat correctly focuses the model on a single document. (4) Deep-link share URLs auto-fire once and strip themselves cleanly. |
| **Asset delivered** | A "Three voices, one KB" demo script with the partner's own copy. Reference: `Sample-ARAG-App/src/components/chat/FloatingChat.tsx` (the canonical Tier 2 example), `ResourceChatTab.tsx`, `ResearchAssistantPage.tsx`. |

### Build 3 — Schema-constrained generation (the agent workshop)

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 3 |
| **What the partner does** | Designs and ships three `askForJson` workflows against the partner's own KB: a follow-up question generator, a dynamic FAQ generator, and a domain taxonomy generator. Learns to handle the strict-mode `additionalProperties:false` requirement, the three response-shape fallbacks, and the "schema permissive, code strict" pattern (mixed-type schemas with client-side validation). |
| **Pass rubric** | (1) Three schemas committed to the partner's repo. (2) Each schema validated against at least 20 production inputs. (3) Mixed-shape schema (MC + free-text) generated correctly. (4) Recorded demo explaining the difference between `askForJson` and the manual-JSON-via-prompt-with-regex pattern, and when to use each. |
| **Asset delivered** | The Agent Workshop notebook — a reusable Jupyter / TypeScript template with five worked schema examples. Reference: `Sample-ARAG-App/src/pages/ExamPage.tsx` (six distinct generation patterns in one file — the canonical Tier 3 reference) and `src/context/CertificationContext.tsx`. **Flagged as one of the two highest-priority assets to build first.** |

### Build 4 — Composite RAG (the on-ramp to agentic)

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Should), Deliver (Must) |
| **Tier mapped to** | Tier 3 → Tier 4 bridge |
| **What the partner does** | Implements "generate → evaluate citations → if low confidence, fire `/find` → synthesise augmented context → re-ask" in a real workflow. Builds at least one production pattern: study-guide-with-fallback, low-confidence-answer-retry, or multi-step research synthesis. |
| **Pass rubric** | (1) Working composite flow with measurable improvement over single-shot `/ask`. (2) Latency budget documented and within target. (3) Recorded explanation of where the boundary sits between "augmenting retrieval" and "running a true agent." |
| **Asset delivered** | A composite-RAG cookbook with three recipes — retry-on-low-citations, multi-pass synthesis, retrieve-then-rerank. Reference: `Sample-ARAG-App/src/components/certification/ExamStudyPanel.tsx` (the cleanest live example). |

### Build 5 — Typed knowledge graph & data augmentation agents

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 4 |
| **What the partner does** | Designs a bespoke entity/relation schema for the partner's domain (e.g., LEGAL: PARTY/MATTER/JURISDICTION/STATUTE/JUDGE; or PHARMA: COMPOUND/TARGET/TRIAL/PI). Configures a data-augmentation agent to extract that schema. Ships a graph navigation UI that filters to `{prop:'generated', by:'data-augmentation'}`, supports fuzzy entity search, undirected path traversal, and incremental in-place graph expansion. Wires entity-to-resources lookup using hybrid `features:['keyword','semantic']`. |
| **Pass rubric** | (1) A typed schema of at least 8 entity types and 8 relation types committed and documented. (2) Graph queries return clean results (no NER noise, no GUID-shaped values). (3) Click-to-expand graph traversal working end-to-end. (4) Recorded demo answering a customer question that *cannot* be answered by single-shot retrieval — only by traversing the graph. |
| **Asset delivered** | A graph schema design template (12 worked vertical examples — legal, pharma, financial services, film production, compliance, etc.). Reference: `Sample-ARAG-App/src/lib/graphApi.ts`, `graphConstants.ts`, and `pages/KnowledgeGraphPage.tsx`. |

### Build 6 — Production readiness

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 4 (operational) |
| **What the partner does** | Configures data residency (EU or USA), wires BYO-LLM routing across Azure OpenAI / Google Vertex / AWS Bedrock, observes the default 2400 req/min rate limit and designs around it, hardens authentication, instruments observability, and stress-tests the workload. |
| **Pass rubric** | (1) Residency demonstrably configured and verifiable. (2) BYO-LLM connection working against at least two of the three hyperscaler endpoints. (3) Rate-limit-aware client implemented (backoff, batching, request coalescing). (4) Observability dashboard tracking p50/p95 latency, retrieval recall proxy, and citation-rate. (5) Recorded explanation of the "platform-grade" pitch to a customer's CTO. |
| **Asset delivered** | A production-readiness checklist + reference Terraform / CDK / Bicep snippets for residency-aware deployment + rate-limit-aware client templates. |

### Build 7 — Mission Control (the capstone) — choose your variant

Mission Control ships in two variants. The partner picks the one that matches their book of business; the second is built later if both customer segments are in play. Both share the same chassis (forked from the Sample ARAG App), the same eight-week build plan, and the same re-skin playbook structure — they differ in corpus, graph schema, workflows, and demo buyer.

| Variant | Buyer | Persona corpus | Killer moment | Brief |
|---|---|---|---|---|
| **Enterprise / Operations** | CTO, CIO, Chief Data Officer | Atlas Global Industries (industrial manufacturer, 5 internal KBs) | Composite-RAG incident root cause + cross-functional typed graph | `Mission-Control-Build-Brief.md` |
| **Customer Experience** | CMO, Head of Digital, Chief Customer Officer | Aurora Outfitters (D2C outdoor retailer, 5 customer-facing KBs) | Two-voice floating chat + content-engineered CTAs + abandoned-cart composite RAG | `Mission-Control-CX-Build-Brief.md` |

| Field | Value (applies to both variants) |
|---|---|
| **Owning track(s)** | All three tracks at Must for Elite tier |
| **Tier mapped to** | Capstone — combines Tiers 1–4 |
| **What the partner does** | Builds one variant of Mission Control: a single application that exercises every primitive and every tier in one branded surface. Grounded search + multi-surface chat + schema-constrained workflows + typed knowledge graph + multimodal media + custom field enrichment + production-grade ops. Mission Control is what a partner walks into a Fortune 500 buyer's office with. |
| **Pass rubric** | (1) Mission Control deployed at the partner's domain. (2) End-to-end demo runs in 25 minutes covering all four tiers without code edits. (3) At least one customer-specific data-augmentation agent in production. (4) Org-level recorded demo passes a Progress-led review board. |
| **Asset delivered** | The Mission Control reference build — the flagship asset of the entire programme. **Flagged as the second of two highest-priority assets to build first; it is both the capstone and the sales-room closer.** Reference: composes patterns from every file in `Sample-ARAG-App/src/pages/` and `src/components/`. |

### §3.5 — Prompt engineering patterns to teach explicitly (cross-cutting through Builds 2–7)

| Pattern | When to use |
|---|---|
| `system` only | Voice control, format control, length control. Fastest. |
| `system` + `user` with `{context}`/`{question}` | When you need fine control over how retrieval is injected. |
| Query prefix only | A/B-able verbosity ("Research mode"), language switching ("Respond in French: "), resource scoping ("Regarding the resource X:"). Cheapest. |
| `answer_json_schema` | When the response feeds an API, a UI, or another ARAG call. |
| Manual JSON via system prompt + regex extract | When you need streaming + structured output. |

Teach partners to start with system-only, escalate to user-template when retrieval injection needs control, escalate to schema when the next consumer is code, and reach for manual-JSON only when both streaming and structure are required.

### §3.6 — The Technical Capability Ladder (tiers in their full form)

The Builds are how partners learn. The Tiers are how customers buy. Each tier should be internalised by every Sell-track and Solution-track individual.

**Tier 1 — Foundations: Grounded Search & Q&A.** Replace dumb search and chat experiments with a single retrieval-grounded answer engine that cites sources. $30–80K ACV ceiling. Sells as a feature.

**Tier 2 — Multi-Surface Conversational Intelligence.** One KB, multiple prompt voices, KB routing by user state, deep-link sharing, multilingual via query prefix, embedded widgets, field-engineered CTAs. The differentiation tier. Doubles ACV.

**Tier 3 — Structured AI Workflows.** `askForJson` as a programmable backend. Dynamic certifications, adaptive onboarding paths, intelligent CTAs, content classification, case triage, quote generation, comparison tables. Moat-building tier. $80–250K engagements.

**Tier 4 — Agentic & Knowledge-Graph Platform.** Custom data-augmentation agents, typed graphs, hybrid retrieval, multimodal field bundles, composite RAG. Strategic-account tier. $500K–$2M ACV, multi-year. (Full enumeration of cross-cutting capabilities — gating, deep-link, field engineering, multilingual, composite RAG — lives in the Cross-Cutting Capabilities appendix.)

---

## Part IV — Certification & Partner Tiers

Individual certifications gate organisational tiers. Organisational tiers gate commercial terms. The structure is intentionally rigid because softness here is where every channel programme rots.

### Individual certifications (per track, per build)

Each named individual at a partner org can hold certifications stacked along their track:

- **Sell track**: Sell-1 (Builds 0–1), Sell-2 (Builds 0–2 + win/loss + discovery), Sell-3 (full Sell competencies + Mission Control walkthrough).
- **Solution track**: Solution-1 (Builds 0–2), Solution-2 (Builds 0–4), Solution-3 (Builds 0–6), Solution-4 (full Solution + Mission Control).
- **Deliver track**: Deliver-1 (Builds 0–2), Deliver-2 (Builds 0–4), Deliver-3 (Builds 0–6), Deliver-4 (full Deliver + Mission Control).

### Gates

- **Written assessment** — open-book, drawn from the Aware/Should/Must matrix.
- **Recorded demo** — submitted to a Progress-led review board, evaluated against the build's pass rubric. No live-presentation alternative; recordings force discipline and are reusable as marketing assets.
- **Annual recert** — every certification expires 12 months from issue. Recert is shorter than initial, but the same standard.
- **Honesty gate** — submitted demos shown to have been built by Progress SEs or partner-of-a-partner subcontractors void the cert and re-bar the individual for 90 days. Caught twice → org tier suspension.

### Organisational tiers

Four tiers, each requiring a minimum count of current certifications across the three tracks. Tiers carry distinct commercial terms.

| Tier | Cert minimum | Commercial terms |
|---|---|---|
| **Registered** | Build 0 completion per named contact | Sandbox access, public assets, no MDF, standard margin |
| **Authorized** | 2× Sell-2 + 1× Solution-2 + 1× Deliver-2 | MDF eligibility, +5pt margin band, deal-reg protection, partner Slack |
| **Premier** | 3× Sell-3 + 2× Solution-3 + 2× Deliver-3 + 1× Mission Control walkthrough cert | +10pt margin band, qualified lead share, joint POCs, named partner manager, quarterly QBR with Progress GTM |
| **Elite** | 4× Sell-3 + 3× Solution-4 + 3× Deliver-4 + 1× Mission Control build cert per FY | +15pt margin band, strategic-account joint pursuit, custom MDF, RFP support, sub-distribution rights in agreed geos |

Every tier review is annual, organisation-level, and decided on certification count and the partner health scorecard (Part VII). Tiers can drop as well as rise. Loss-of-tier triggers a 90-day "back to standard" notice — not a cliff — to keep the relationship intact while the partner re-stocks competency.

---

## Part V — Partner Lifecycle

A partner's journey from first contact to advocate runs through five stages. Each stage has a single time-to-value target and a single exit gate. The exit gate is non-negotiable.

| Stage | Target TTV | Exit gate | Owner |
|---|---|---|---|
| **Recruit** | 30 days from first contact | Mutual fit confirmed; partnership agreement signed; named individuals across three tracks identified | Channel Manager |
| **Onboard** | 30 days from agreement | Build 0 complete for at least one named individual per track (Sell, Solution, Deliver). Sandbox provisioned. Sample ARAG App running locally. | Partner Manager + Partner SE |
| **Activate** | 60 days from onboard exit | First Build 3 (schema-constrained generation) submitted and passed. First customer demo recorded. Authorized tier reached. | Partner SE + Partner |
| **Scale** | 6 months from activate exit | At least one customer in production at Tier 2 or Tier 3. Premier tier reached. Quarterly QBR cadence established. | Partner Manager + Partner GM |
| **Advocate** | Continuous | Public reference. Joint marketing event. At least one Mission Control walkthrough delivered to a customer. Elite tier reached. | Channel GM |

**Time-to-first-build is the make-or-break leading indicator.** A partner who hasn't passed Build 0 within 30 days of onboarding is statistically unlikely to ever reach Authorized. If TTV-to-Build-0 slips past 45 days, the partner is moved to a recovery track or de-activated. No exceptions, because false-hope partners poison the program's measured economics.

---

## Part VI — Infrastructure & Assets

The programme runs on five infrastructure pieces. Each is owned, versioned, and reviewed quarterly.

### 6.1 Sandbox environments

- **Public demo KB** — read-only, pre-seeded with the ARAKS dataset from the Sample ARAG App. Every partner has access on day one. No provisioning required.
- **Per-partner sandbox KB** — provisioned at onboard, 10GB / 1M token-write quota, full read-write, separate from production. Lives in the EU or USA region per partner preference (data residency is grounded — partners ask about this in every CTO meeting).
- **Per-partner production KB** — provisioned at first customer signature, separate billing line, full SLA.

### 6.2 Asset library mapped to builds

Every asset has a name, an owner, a version, and a corresponding build. No orphan assets, no "miscellaneous" folder. If an asset can't be mapped to a build, it doesn't ship.

| Asset | Build | Owner | Status |
|---|---|---|---|
| Sample ARAG App reference repo | All builds | GTM | **Shipped** |
| Partner Enablement Framework (this doc) | All builds | GTM | **Shipped** |
| ARAG primitives slide deck | 0 | GTM | TODO |
| Widget showcase + branded snippets | 1 | Solution | Stub |
| "Three voices, one KB" demo script | 2 | GTM | TODO |
| Agent Workshop notebook | 3 | Solution | **Top-priority** |
| Composite-RAG cookbook | 4 | Solution | TODO |
| Graph schema design template (12 verticals) | 5 | Solution | TODO |
| Production-readiness checklist + IaC snippets | 6 | Solution | TODO |
| Mission Control — Enterprise variant brief | 7 | GTM | **Shipped** (`Mission-Control-Build-Brief.md`) |
| Mission Control — CX variant brief | 7 | GTM | **Shipped** (`Mission-Control-CX-Build-Brief.md`) |
| Mission Control reference build (one variant first) | 7 | GTM + Solution | **Top-priority** |
| Battle cards (AI12z, Caitlyn, Harvey AI) | Sell track | GTM | In progress |
| Win/loss debrief template | Sell track | GTM | TODO |
| Discovery checklist | Sell track | GTM | **Shipped** (`The Vault/01_Sales/Sales_Tools/`) |

### 6.3 Mission Control — the flagship reference

Mission Control is the asset that closes the strategic-account sale. It's a deployed application combining every tier of the capability ladder behind one branded surface, sitting on a working data-augmentation agent and a typed knowledge graph. Partners walk into a CTO meeting with it and the meeting changes.

Building Mission Control is the next major work item in this programme. It is both the curriculum capstone and the marquee sales artefact.

### 6.4 Battle cards

Mapped 1:1 to the competitive threats already catalogued in `The Vault/01_Sales/Battlecards/`:

- **ARAG vs AI12z** — Agentic depth, BYO-LLM, residency, knowledge graph.
- **ARAG vs Caitlyn** — Platform breadth vs single-feature; structured generation.
- **ARAG vs Harvey AI** — Vertical-agnostic vs legal-only; customer ownership of corpus.
- **ARAG vs OpenAI Assistants / native LLM-with-RAG** — Enterprise residency, observability, retrieval quality control, hybrid retrieval as a lever.

### 6.5 Community

- **Partner Slack** (or Teams; choose one) — single channel, threaded, archived.
- **Monthly Build Clinic** — open hour with a Progress Solution SE; partners bring real customer problems.
- **Quarterly Roundtable** — small-group, by tier, off the record.
- **Annual Partner Summit** — co-located with Progress flagship event.

Community participation counts toward partner health (Part VII). Silent partners are health-risked partners.

---

## Part VII — Measurement & Governance

The programme is measured continuously and reviewed on a fixed cadence. Leading indicators drive corrective action; lagging indicators drive tier and incentive reviews.

### 7.1 Leading KPIs (track weekly)

- **Time-to-first-build** — days from onboard kickoff to Build 0 pass. Target ≤ 30 days; alarm at 45.
- **Build-completion velocity** — builds passed per partner per quarter. Floor at 1 build/quarter for Authorized+, alarm at 0.
- **Sandbox activity** — API calls per partner per week. Zero-activity weeks trigger a partner-manager check-in.
- **Advanced-build attach rate** — proportion of certified partners holding at least one Build 3+ cert. **This is the single most important leading indicator** of whether the programme is producing platform-level competency or just chatbot resellers.
- **Recorded-demo submission rate** — submissions per partner per quarter.
- **Office-hours attendance** — % of partners with at least one named attendee per month.

### 7.2 Lagging KPIs (track monthly, review quarterly)

- **Partner-sourced ARR by tier** — the only commercial metric that matters in the end.
- **Average deal size by tier** — proxies whether partners are selling platform or feature.
- **Win rate by partner tier** — proxies competency efficacy.
- **Deal velocity** — days from first meeting to signature.
- **Net revenue retention by partner-owned account** — proxies delivery quality.
- **Certification volume** — issued, current, expired.

### 7.3 Partner health scorecard

Each partner is scored monthly out of 100, weighted across:

- 30 points — current certification depth across the three tracks
- 25 points — leading KPI performance (TTV, build velocity, sandbox activity, advanced-build attach)
- 20 points — pipeline contribution (deal-reg volume, qualified opportunities)
- 15 points — delivery quality (NRR, escalation count, CSAT on joint accounts)
- 10 points — community engagement (Slack activity, office hours, recorded-demo submissions)

Score < 60 triggers a recovery plan. Two consecutive months < 60 triggers a tier review. The scorecard is visible to the partner — surprises are unfair, and unfair programs lose partners.

### 7.4 RACI

| Activity | Progress GTM | Channel GM | Partner Manager | Partner SE | Partner |
|---|---|---|---|---|---|
| Programme strategy & curriculum | A | C | I | C | I |
| Partner recruitment | C | A | R | I | — |
| Onboarding | I | I | A | R | R |
| Build delivery & certification | I | I | C | A | R |
| Tier review | C | A | R | C | I |
| Customer joint-pursuit | I | C | A | R | R |
| Scorecard maintenance | C | I | A | R | I |
| QBR | I | A | R | C | R |
| Curriculum evolution | A | C | C | R | C |

R = Responsible, A = Accountable, C = Consulted, I = Informed.

### 7.5 Cadence

- **Weekly** — Partner SE build standup with each active partner (15 min).
- **Monthly** — Partner Manager 1:1 + scorecard review (60 min).
- **Quarterly** — Organisation-level QBR + tier review (90 min).
- **Annually** — Programme-level review + curriculum refresh.

### 7.6 Continuous improvement loop

Every recorded demo is reviewed by the Progress Solution lead. Patterns of failure feed back into the curriculum within 30 days. Every customer escalation tied to a partner-delivered project triggers a post-mortem with the partner; lessons go into the relevant build's rubric. No anonymous feedback — partners deserve to know what triggered a curriculum change.

---

## Part VIII — 90-Day Rollout

This programme is too heavy to launch all at once. The first 90 days deliver the spine, recruit the first wave, and prove the model.

### Days 0–30 — Foundation

- Ship Build 0–2 fully (Hello ARAG, Widgets, Multi-surface chat). Recorded-demo gates working.
- Lock the partner agreement template, tier definitions, and commercial terms.
- Stand up sandbox provisioning automation.
- Ship the asset library v0 (battle cards, Sample ARAG App reference, Discovery checklist, Build 0–2 rubrics).
- Recruit the first three pilot partners.
- **Decision point at day 30:** are pilot partners on track to pass Build 0 by day 45? If no, fix onboarding before scaling.

### Days 31–60 — Pilot Wave

- Pilot partners ship Builds 1–2. First customer demos recorded.
- Build 3 (Agent Workshop) shipped as a fully gated asset. **This is the priority build for this window.**
- Battle cards refined based on first customer pushback.
- Pilot partners reach Authorized tier; first MDF dollars released.
- Weekly build clinic cadence stabilised.

### Days 61–90 — Scale

- Mission Control reference build deployed at Progress and at one pilot partner's domain. **This is the priority asset for this window.**
- Builds 4–6 shipped with full rubrics.
- First Premier-tier partner achieved.
- Programme opened to wider recruitment.
- First Quarterly Review held with all pilot partners.
- 90-day retro: what's working, what isn't, what curriculum changes ship in the next quarter.

---

## Appendix A — Capability Inventory (one-page reference)

Compact cross-reference for the 30+ live ARAG patterns in the Sample ARAG App. Use during build clinics and partner workshops.

| # | Pattern | Endpoint(s) | KB | Tier | Sample-app file |
|---|---|---|---|---|---|
| A1 | Streaming chat w/ citations | `/ask` stream | site or member | 1–2 | `pages/AssistantPage.tsx` |
| A2 | Research mode (prefixed) | `/ask` stream | member | 2 | `pages/ResearchAssistantPage.tsx` |
| A3 | Floating chat (2 modes) | `/ask` stream | site or member | 2 | `components/chat/FloatingChat.tsx` |
| A4 | Resource-scoped chat | `/ask` stream | member | 2 | `components/knowledge/ResourceChatTab.tsx` |
| A5 | Topic study explainer | `/ask` stream | member | 2 | `components/learning/StudyPanel.tsx` |
| A6 | Study coach chat | `/ask` stream | member | 2 | `components/certification/StudyAssistantChat.tsx` |
| A7 | Personalised exam study guide w/ retrieval fallback | `/ask` + `/find` | member | 4 | `components/certification/ExamStudyPanel.tsx` |
| B1a | Sync AI answer | `/ask` sync | either | 1 | `pages/SearchResultsPage.tsx` |
| B1b | Schema follow-ups (PAA) | `askForJson` | member | 3 | `pages/SearchResultsPage.tsx` |
| B1c | Member find w/ filters | `/find` | member | 1 | `pages/SearchResultsPage.tsx` |
| B1d | Site find | `/find` | site | 1 | `pages/SearchResultsPage.tsx` |
| C1 | Dashboard suggestions | `askForJson` | member | 3 | `pages/DashboardPage.tsx` |
| C2 | Certification program | `askForJson` | member | 3 | `context/CertificationContext.tsx` |
| C3 | Domain taxonomy | `askForJson` | member | 3 | `context/CertificationContext.tsx` |
| C4 | Learning modules | `askForJson` | member | 3 | `context/CertificationContext.tsx` |
| C5 | Sub-topics | `askForJson` | member | 3 | `pages/CertificationPage.tsx` |
| C6 | Mixed-type exam | `askForJson` | member | 3 | `pages/ExamPage.tsx` |
| C7 | Per-question FT grader | `/ask` stream + regex JSON | member | 3 | `pages/ExamPage.tsx` |
| C8 | Composite grading narrative | `/ask` stream | member | 3 | `pages/ExamPage.tsx` |
| D1 | Catalog w/ filters | `/catalog` | member | 1 | `pages/KnowledgeExplorerPage.tsx` |
| D2 | Topic-row dashboard | `/catalog` (filtered) | member | 1 | `components/dashboard/CategoryRow.tsx` |
| D3 | Full resource | `/resource/{id}` | member | 1 | `pages/KnowledgeDetailPage.tsx` |
| D4 | Labelsets | `/labelsets` | member | 1 | `lib/ragApi.ts` |
| E1 | Authenticated image | `/resource/.../download/field` | member | 1 | `components/knowledge/AuthImage.tsx` |
| E2 | DASH MPD + auth RequestModifier | `/resource/.../file/.mpd` | member | 4 | `components/knowledge/VideoPlayer.tsx` |
| E3 | PDF blob | `/resource/.../download/field` | member | 1 | `components/knowledge/PdfViewer.tsx` |
| E4 | Direct video blob | `/resource/{id}` + `/file/{key}/download` | member | 1 | `lib/ragApi.ts` |
| F1 | Initial graph (data-aug filter) | `/graph` | member | 4 | `pages/KnowledgeGraphPage.tsx` |
| F2 | Nodes by group | `/graph/nodes` | member | 4 | `components/graph/EntitySidebar.tsx` |
| F3 | Fuzzy node search | `/graph/nodes` (fuzzy) | member | 4 | `components/graph/EntitySidebar.tsx` |
| F4 | Paths from node | `/graph` (path) | member | 4 | `components/graph/EntityDetail.tsx` |
| F5 | Entity → resources (hybrid) | `/find` (`keyword+semantic`) | member | 4 | `lib/graphApi.ts` |
| F6 | Incremental graph merge | (uses F4) | member | 4 | `pages/KnowledgeGraphPage.tsx` |
| I  | Drop-in web components | (Nuclia widget CDN) | site (or any) | 1 | `pages/widgets/WidgetShowcasePage.tsx` |

---

## Appendix B — Cross-cutting capabilities

These apply at every tier and every build past Build 2. Every certified Solution-track individual must be able to discuss them.

### B.1 Gating & monetisation patterns

The Sample ARAG App implements seven distinct gating patterns, all driven by a single `useMember()` boolean: page-level gates, answer-content gates (first 3 sentences clear + blur + CTA), citation gates, search-result gates (2 clear + 3 blurred), source-card gates, teaser injection (every Nth assistant message), and frontmatter-based content gates. The gating engine is front-end logic — same KB, same API, gated or not. Freemium-to-premium funnels without re-architecting the AI layer.

### B.2 Deep-link & shareability

`?q=...` on chat / research / search pages auto-fires once and strips itself. `?tab=transcript&t=125.5` on resource detail lands on the exact second of the matching speaker line. `searchResources()` returns `matchTimestamp` extracted from `paragraphs[bestScore].position.start_seconds[0]`. Every conversation, every search result, every answer becomes a URL.

### B.3 Field engineering as a billable service

The sample app's `callToAction`, `searchResultDisplay`, and `videoInfo` fields are JSON-encoded text fields stored alongside resource content. The retriever pulls them in as part of `{context}`; the model is instructed to use them; the front-end intercepts the model's `[label](href)` output and converts it into branded CTAs. Partners can sell ongoing content-engineering services around designing fields, training authors, A/B-testing CTAs via source-content edits with no code deployment.

### B.4 Multilingual without re-indexing

A `Respond in {language}: ` query prefix delivers multilingual answers from a single KB. No separate KB, no separate embeddings, no separate model. Sell this to every multinational customer in the first meeting.

### B.5 Composite RAG (the bridge to agentic)

"Generate, evaluate generation, retrieve more if needed, re-ask with augmented context" is the recipe for true agentic RAG. The exam-results study guide is the canonical example. Partners ready for Tier 4 should be sketching this pattern on a whiteboard, not just demoing it.

---

## Appendix C — Commercial & Delivery Grounding

Every claim partners make about commercial fitness must be grounded. The following are the live facts from the Progress KB; partners are taught to defend them in every CTO meeting.

- **Data residency** — EU and USA regions available. Per-KB. Customers choose at provisioning. Critical for European partners selling into regulated industries.
- **BYO-LLM** — Customers can bring their own model via Azure OpenAI, Google Vertex, or AWS Bedrock connections. The retrieval and orchestration layer stays on ARAG; the generation layer is the customer's choice. Removes the "but we already use Azure" objection cold.
- **Default rate limit** — 2400 requests per minute per service account, raisable on request. Partners must design rate-limit-aware clients (backoff, batching, request coalescing) from Build 6 onwards. Customers ask, partners answer with the number.
- **Two consumption paths** — API/SDK (everything in this framework) *and* drop-in web components (`<nuclia-search-bar>`, `<nuclia-chat>`, `<nuclia-popup>`, `<nuclia-search-results>`). Both can coexist on the same KB. Don't conflate them.

---

## Appendix D — What to demo when

A single map from "what the customer asked for" to "what to show in the Sample ARAG App."

| Customer ask | Show this in the sample app | Tier signal | Build to assign |
|---|---|---|---|
| "We want a chatbot." | `/assistant` (streaming + citations) | Tier 1 | Build 1 |
| "We want better search." | `/search` (AI Answer + PAA + content filters) | Tier 1 | Build 1 |
| "Can it embed on our existing site?" | `/widgets` (drop-in components) | Tier 1 | Build 1 |
| "Different answers for different users." | Header member toggle + `/assistant` switch | Tier 2 | Build 2 |
| "We want it to push our products." | `/` → open floating chat as non-member | Tier 2 | Build 2 |
| "We need a multilingual experience." | `/knowledge/{id}` resource chat → language dropdown | Tier 2 | Build 2 |
| "We want our content to drive next-action." | `/` → floating chat → click any CTA link in response | Tier 2 | Build 2 |
| "We want users to share answers." | `/assistant?q=what+is+ARAG` URL bar | Tier 2 | Build 2 |
| "Can it generate questions?" | `/certification` → custom quiz builder → start | Tier 3 | Build 3 |
| "Can it understand our taxonomy?" | `/certification` (domain cards auto-generated) | Tier 3 | Build 3 |
| "Can it auto-generate FAQs/summaries/comparisons?" | `/search` (PAA panel as analogue) | Tier 3 | Build 3 |
| "Can we connect concepts to documents?" | `/graph` (click any entity) | Tier 4 | Build 5 |
| "We want our own taxonomy." | `/graph` (10 entity types specific to ARAKS) | Tier 4 | Build 5 |
| "We need video search that jumps to the moment." | `/search` for a topic, click a video result, transcript syncs | Tier 4 | Build 5 |
| "We want this to evolve as our knowledge grows." | `fetchTopicLabels` + `searchRelatedResources` widening | Tier 4 | Build 5 |
| "How do we know it's enterprise-grade?" | Walk through Build 6 — residency, BYO-LLM, rate limits | Tier 4 | Build 6 |
| "Show us your reference customer build." | Mission Control walkthrough | Capstone | Build 7 |

---

## Appendix E — The Sample ARAG App as teaching artefact

Partners should be told:

- **Read `src/lib/ragApi.ts` first.** Every API endpoint the platform exposes is wrapped here in plain TypeScript. The whole client surface is 1,661 lines — readable in one sitting.
- **Read `src/lib/graphApi.ts` next.** Graph queries, filtering tricks, hybrid retrieval — 243 lines.
- **Use `src/pages/ExamPage.tsx` as the canonical Tier 3 reference.** Six distinct generation patterns in one file.
- **Use `src/components/chat/FloatingChat.tsx` as the canonical Tier 2 reference.** Prospect vs member prompts, CTA post-processing, link interception, teaser injection, blur-gate.
- **Use `src/pages/KnowledgeDetailPage.tsx` as the canonical Tier 4 reference.** Video + transcript + resource chat + deep link + utterance highlight — all wired through a single `getResource()` call.

The repo is private at https://github.com/jaysanderson/Sample-ARAG-App. When you give a partner access, give them this framework with it.

---

## Honest note on the next move

This framework is genuinely comprehensive. That comprehensiveness is also its weakness — it's only as good as the **assets behind it**. Right now the assets are *named* but not *built*. The two with the highest combined leverage are:

1. **Build 3 — the Agent Workshop notebook.** This is the asset that converts a "we already use ChatGPT" objection into a Tier 3 conversation. Without it, partners stall at Tier 2.
2. **Build 7 — Mission Control.** This is the asset that closes the strategic-account sale. It's also the curriculum capstone. It earns its build cost back on its first reference customer.

Mission Control is the next major work item. It's both the curriculum capstone and the sales-room closer, and it should be built before the wider partner programme opens.
