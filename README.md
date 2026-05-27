# Progress Agentic RAG — Partner Enablement Framework

> **Position:** ARAG is a *platform*, not a chatbot.
> **Thesis:** Partner competency, not partner enthusiasm, predicts ARR.
> **Evidence base:** Every technical pattern in this document is wired live in  (``). Every commercial claim is grounded in the Progress KB (data residency, BYO-LLM, rate limits).
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
| Experiential (70%) | Sandbox builds, hands-on code, customer POCs co-delivered with Progress SEs |  as the starter codebase, Builds 0–7 as the curriculum, real KB credentials provisioned per partner |
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
| **Prompt engineering patterns** (`courses/developer-foundations/README.md` §4) | Aware | Must | Must |
| **Gating & monetisation patterns** | Should | Must | Should |
| **Field engineering as a service** | Aware | Must | Must |
| **Composite RAG / agentic patterns** | Aware | Must | Must |
| **Data-augmentation agent design** | Aware | Should | Must |
| **Production readiness (residency, BYO-LLM, rate limits)** | Should | Must | Must |
| **Pricing & commercial structure** | Must | Should | Aware |
| **Discovery & qualification** | Must | Should | Aware |
| **Win/loss debrief & competitive response** | Must | Should | Aware |
| ** walkthrough** | Should | Must | Must |
| **Build 7 capstone** | Should | Must | Must |

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

## Part III — Course Catalogue

The framework's competency ladder is delivered through courses. Each course bundles a hands-on curriculum, pass/fail rubrics, and a named certification. Course completion drives partner certs; partner certs drive org tier (Part IV); org tier drives commercial terms.

| Course | Status | Awarded cert | Doc |
|---|---|---|---|
| **Developer Foundations** | Shipped | Developer Foundations Practitioner | `courses/developer-foundations/README.md` |
| **Advanced Extraction & Retrieval Strategies** | Shipped | AE&RS Specialist | `courses/advanced-extraction-and-retrieval-strategies/README.md` |
| **Sales Foundations** | Planned (target Q3) | Sales Foundations Practitioner | TBD |
| **Solution Architecture Mastery** | Planned (target Q4) | Solution Architect Specialist | TBD |
| **Production Operations & SLOs** | Planned (target Q4) | Operations Specialist | TBD |

Each shipped course doc is self-contained — partners can read it end-to-end and execute against it without flipping back to the framework. The framework README sets the *system* (operating model, certification structure, lifecycle, measurement); the courses ship the *curriculum* (builds, rubrics, assets, capstones).

A partner organisation cannot reach Authorized tier without at least one Developer Foundations Practitioner on staff. Cannot reach Premier without at least one AE&RS Specialist. Cannot reach Elite without a multi-Specialist team plus delivered capstones at customers. See Part IV for the full stack.

### §3.1 — The Technical Capability Ladder (how customers buy)

The Courses are how partners learn. The Tiers are how customers buy. Each tier should be internalised by every Sell-track and Solution-track individual.

**Tier 1 — Foundations: Grounded Search & Q&A.** Replace dumb search and chat experiments with a single retrieval-grounded answer engine that cites sources. $30–80K ACV ceiling. Sells as a feature. Delivered by Developer Foundations Builds 0–1.

**Tier 2 — Multi-Surface Conversational Intelligence.** One KB, multiple prompt voices, KB routing by user state, deep-link sharing, multilingual via query prefix, embedded widgets, field-engineered CTAs. The differentiation tier. Doubles ACV. Delivered by Developer Foundations Build 2 + AE&RS Build 5 (field engineering).

**Tier 3 — Structured AI Workflows.** `answer_json_schema` as a programmable backend. Dynamic certifications, adaptive onboarding paths, intelligent CTAs, content classification, case triage, quote generation, comparison tables. Moat-building tier. $80–250K engagements. Delivered by Developer Foundations Builds 3–4 + AE&RS Builds 1–4.

**Tier 4 — Agentic & Knowledge-Graph Platform.** Custom data-augmentation agents, typed graphs, hybrid retrieval, multimodal field bundles, composite RAG. Strategic-account tier. $500K–$2M ACV, multi-year. Delivered by Developer Foundations Builds 5–7 + AE&RS Builds 6–8.

(Full enumeration of cross-cutting capabilities — gating, deep-link, field engineering, multilingual, composite RAG — lives in the Cross-Cutting Capabilities appendix.)

---

## Part IV — Certification & Partner Tiers

Individual certifications gate organisational tiers. Organisational tiers gate commercial terms. The structure is intentionally rigid because softness here is where every channel programme rots.

### Individual certifications (per track, per build)

Each named individual at a partner org can hold certifications stacked along their track:

- **Sell track** (full course is *Sales Foundations*, planned for Q3; interim certs derive from Developer Foundations Sell-relevant builds):
  - Sell-1: Developer Foundations Builds 0–1 walkthrough.
  - Sell-2: Developer Foundations Builds 0–2 + win/loss + discovery competencies (interim — fully replaced when Sales Foundations course ships).
  - Sell-3: Full Sell competencies + recorded capstone walkthrough.
- **Solution track**:
  - Solution-1: Developer Foundations Builds 0–2.
  - Solution-2: Developer Foundations Practitioner (full).
  - Solution-3: Developer Foundations Practitioner + AE&RS Specialist Builds 1–4.
  - Solution-4: Developer Foundations Practitioner + AE&RS Specialist (full) + Build 7 capstone deployed at the partner's domain.
- **Deliver track**: parallel to Solution with the same course-cert milestones — Deliver-1 through Deliver-4. Stricter delivery-quality rubrics where applicable.

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
| **Premier** | 3× Sell-3 + 2× Solution-3 + 2× Deliver-3 + 1× capstone walkthrough cert | +10pt margin band, qualified lead share, joint POCs, named partner manager, quarterly QBR with Progress GTM |
| **Elite** | 4× Sell-3 + 3× Solution-4 + 3× Deliver-4 + 1× capstone build cert per FY | +15pt margin band, strategic-account joint pursuit, custom MDF, RFP support, sub-distribution rights in agreed geos |

Every tier review is annual, organisation-level, and decided on certification count and the partner health scorecard (Part VII). Tiers can drop as well as rise. Loss-of-tier triggers a 90-day "back to standard" notice — not a cliff — to keep the relationship intact while the partner re-stocks competency.

---

## Part V — Partner Lifecycle

A partner's journey from first contact to advocate runs through five stages. Each stage has a single time-to-value target and a single exit gate. The exit gate is non-negotiable.

| Stage | Target TTV | Exit gate | Owner |
|---|---|---|---|
| **Recruit** | 30 days from first contact | Mutual fit confirmed; partnership agreement signed; named individuals across three tracks identified | Channel Manager |
| **Onboard** | 30 days from agreement | Build 0 complete for at least one named individual per track (Sell, Solution, Deliver). Sandbox provisioned.  running locally. | Partner Manager + Partner SE |
| **Activate** | 60 days from onboard exit | First Developer Foundations Build 3 (schema-constrained generation) submitted and passed. First customer demo recorded. Authorized tier reached. | Partner SE + Partner |
| **Scale** | 6 months from activate exit | At least one customer in production at Tier 2 or Tier 3. Premier tier reached. Quarterly QBR cadence established. | Partner Manager + Partner GM |
| **Advocate** | Continuous | Public reference. Joint marketing event. At least one capstone walkthrough delivered to a customer. Elite tier reached. | Channel GM |

**Time-to-first-build is the make-or-break leading indicator.** A partner who hasn't passed Build 0 within 30 days of onboarding is statistically unlikely to ever reach Authorized. If TTV-to-Build-0 slips past 45 days, the partner is moved to a recovery track or de-activated. No exceptions, because false-hope partners poison the program's measured economics.

---

## Part VI — Infrastructure & Assets

The programme runs on five infrastructure pieces. Each is owned, versioned, and reviewed quarterly.

### 6.1 Sandbox environments

- **Public demo KB** — read-only, pre-seeded with the demo dataset from . Every partner has access on day one. No provisioning required.
- **Per-partner sandbox KB** — provisioned at onboard, 10GB / 1M token-write quota, full read-write, separate from production. Lives in the EU or USA region per partner preference (data residency is grounded — partners ask about this in every CTO meeting).
- **Per-partner production KB** — provisioned at first customer signature, separate billing line, full SLA.

### 6.2 Asset library mapped to builds

Every asset has a name, an owner, a version, and a corresponding build. No orphan assets, no "miscellaneous" folder. If an asset can't be mapped to a build, it doesn't ship.

| Asset | Course / Build | Owner | Status |
|---|---|---|---|
|  reference repo | Cross-course | GTM | **Shipped** |
| Umbrella framework (this doc) | All courses | GTM | **Shipped** |
| Developer Foundations course doc | Foundations | GTM | **Shipped** (`courses/developer-foundations/README.md`) |
| Advanced Extraction & Retrieval Strategies course doc | Advanced | GTM | **Shipped** (`courses/advanced-extraction-and-retrieval-strategies/README.md`) |
| ARAG primitives slide deck | Foundations Build 0 | GTM | TODO |
| Widget showcase + branded snippets | Foundations Build 1 | Solution | Stub |
| "Three voices, one KB" demo script | Foundations Build 2 | GTM | TODO |
| Agent Workshop notebook | Foundations Build 3 | Solution | **Top-priority** |
| Composite-RAG cookbook | Foundations Build 4 | Solution | TODO |
| Graph schema design template (12 verticals) | Foundations Build 5 / Advanced Build 6 | Solution | TODO |
| Production-readiness checklist + IaC snippets | Foundations Build 6 | Solution | TODO |
| Capstone example — Atlas Operations (Enterprise) | Foundations Build 7 | GTM | **Shipped** (`courses/developer-foundations/builds/build-7-capstone/atlas-operations/README.md`) |
| Capstone example — Aurora Concierge (CX) | Foundations Build 7 | GTM | **Shipped** (`courses/developer-foundations/builds/build-7-capstone/aurora-concierge/README.md`) |
| Capstone reference build (one example first) | Foundations Build 7 | GTM + Solution | **Top-priority** |
| Eval-harness template + golden-set template | Advanced Build 1 | Solution | TODO |
| Chunking spec template + decision tree | Advanced Build 2 | Solution | TODO |
| Hybrid-retrieval decision matrix + A/B runner | Advanced Build 3 | Solution | TODO |
| Labelset design template + classifier guide | Advanced Build 4 | Solution | TODO |
| Field-engineering playbook + author training + A/B scaffolding | Advanced Build 5 | Solution | **Top-priority (recurring revenue lever)** |
| Agent design template + 10 vertical schemas | Advanced Build 6 | Solution | TODO |
| Multimodal extraction recipe book | Advanced Build 7 | Solution | TODO |
| Agentic-patterns cookbook + observability template | Advanced Build 8 | Solution | TODO |
| Tuning-report template | Advanced Build 9 | Solution | **Top-priority (commercial deliverable)** |
| Battle cards (AI12z, Caitlyn, Harvey AI) | Sell track | GTM | In progress |
| Win/loss debrief template | Sell track | GTM | TODO |
| Discovery checklist | Sell track | GTM | **Shipped** (`The Vault/01_Sales/Sales_Tools/`) |

### 6.3 The capstone — the flagship wow build

The capstone is the asset that closes the strategic-account sale. It's a deployed application combining every tier of the capability ladder behind one branded surface, sitting on a working data-augmentation agent and a typed knowledge graph. Partners walk into a CTO meeting with it and the meeting changes.

Building the capstone is the next major work item in this programme. It is both the curriculum capstone and the marquee sales artefact.

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

- **Time-to-first-build** — days from onboard kickoff to Developer Foundations Build 0 pass. Target ≤ 30 days; alarm at 45.
- **Build-completion velocity** — course-builds passed per partner per quarter. Floor at 1 build/quarter for Authorized+, alarm at 0.
- **Sandbox activity** — API calls per partner per week. Zero-activity weeks trigger a partner-manager check-in.
- **Advanced-cert attach rate** — proportion of Developer Foundations Practitioners who go on to earn AE&RS Specialist. **This is the single most important leading indicator** of whether the programme is producing platform-level competency or just chatbot resellers — Foundations alone produces Tier-1 sellers; AE&RS produces Tier-3 and Tier-4 platform sellers.
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

- Ship Developer Foundations Builds 0–2 fully (Hello ARAG, Widgets, Multi-surface chat). Recorded-demo gates working.
- Lock the partner agreement template, tier definitions, and commercial terms.
- Stand up sandbox provisioning automation.
- Ship the asset library v0 (battle cards,  reference, Discovery checklist, Foundations Builds 0–2 rubrics, both course docs).
- Recruit the first three pilot partners.
- **Decision point at day 30:** are pilot partners on track to pass Developer Foundations Build 0 by day 45? If no, fix onboarding before scaling.

### Days 31–60 — Pilot Wave

- Pilot partners ship Foundations Builds 1–2. First customer demos recorded.
- Foundations Build 3 (Agent Workshop) shipped as a fully gated asset. **This is the priority build for this window.**
- Battle cards refined based on first customer pushback.
- Pilot partners reach Authorized tier; first MDF dollars released.
- Weekly build clinic cadence stabilised.

### Days 61–90 — Scale

- Capstone reference build deployed at Progress and at one pilot partner's domain. **This is the priority asset for this window.**
- Foundations Builds 4–6 shipped with full rubrics.
- AE&RS Specialist course opened for early-adopter pilot partners (Builds 1–3 of the Advanced course rubric-ready).
- First Premier-tier partner achieved.
- Programme opened to wider recruitment.
- First Quarterly Review held with all pilot partners.
- 90-day retro: what's working, what isn't, what curriculum changes ship in the next quarter.

---

## Appendix A — Capability Inventory (one-page reference)

Compact catalogue of the patterns partners will compose in customer engagements. Use during build clinics and partner workshops.

| # | Pattern | Endpoint(s) | Tier |
|---|---|---|---|
| A1 | Streaming chat with citations | `/ask` stream | 1–2 |
| A2 | Research mode (query-prefixed for verbosity) | `/ask` stream | 2 |
| A3 | Floating chat with two prompt modes (prospect / member) | `/ask` stream | 2 |
| A4 | Resource-scoped chat (query-prefix pseudo-scope) | `/ask` stream | 2 |
| A5 | Topic study explainer | `/ask` stream | 2 |
| A6 | Study coach with multilingual prefix | `/ask` stream | 2 |
| A7 | Composite study guide with retrieval fallback | `/ask` + `/find` | 4 |
| B1a | Sync AI answer card | `/ask` sync | 1 |
| B1b | Schema-driven follow-up questions ("People Also Ask") | `askForJson` | 3 |
| B1c | Filtered semantic find | `/find` | 1 |
| B1d | Cross-content-type find | `/find` | 1 |
| C1 | Dashboard suggestion chips | `askForJson` | 3 |
| C2 | Certification program metadata generator | `askForJson` | 3 |
| C3 | Domain taxonomy generator | `askForJson` | 3 |
| C4 | Learning module structure generator | `askForJson` | 3 |
| C5 | Sub-topic / drill-down generator | `askForJson` | 3 |
| C6 | Mixed-shape exam (MC + free-text in one schema) | `askForJson` | 3 |
| C7 | Per-item structured grader (streaming + regex JSON) | `/ask` stream + regex | 3 |
| C8 | Composite grading narrative | `/ask` stream | 3 |
| D1 | Paginated catalog with filters | `/catalog` | 1 |
| D2 | Topic-row "Netflix-style" dashboard | `/catalog` (filtered) | 1 |
| D3 | Full resource fetch with bundles | `/resource/{id}` | 1 |
| D4 | Labelset enumeration | `/labelsets` | 1 |
| E1 | Authenticated image / thumbnail | `/resource/.../download/field` | 1 |
| E2 | DASH MPD streaming with auth-injecting RequestModifier | `/resource/.../file/.mpd` | 4 |
| E3 | PDF blob with auth | `/resource/.../download/field` | 1 |
| E4 | Direct video blob with field-key discovery | `/resource/{id}` + `/file/{key}/download` | 1 |
| F1 | Initial graph load with data-augmentation filter | `/graph` | 4 |
| F2 | Nodes by entity group | `/graph/nodes` | 4 |
| F3 | Fuzzy entity search | `/graph/nodes` (fuzzy) | 4 |
| F4 | Paths from source node (undirected) | `/graph` (path) | 4 |
| F5 | Entity → resources lookup (hybrid retrieval) | `/find` with `features:['keyword','semantic']` | 4 |
| F6 | Incremental client-side graph merge | (uses F4 + dedupe) | 4 |
| I  | Drop-in web components (search-bar, chat, popup, results) | Nuclia widget CDN | 1 |

---

## Appendix B — Cross-cutting capabilities

These apply at every tier and every build past Build 2. Every certified Solution-track individual must be able to discuss them.

### B.1 Gating & monetisation patterns

ARAG-backed applications can implement seven distinct gating patterns, all driven by a single `useMember()` boolean: page-level gates, answer-content gates (first 3 sentences clear + blur + CTA), citation gates, search-result gates (2 clear + 3 blurred), source-card gates, teaser injection (every Nth assistant message), and frontmatter-based content gates. The gating engine is front-end logic — same KB, same API, gated or not. Freemium-to-premium funnels without re-architecting the AI layer.

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

A single map from "what the customer asked for" to "what to show in ."

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
| "We want our own taxonomy." | `/graph` (10 entity types specific to the demo) | Tier 4 | Build 5 |
| "We need video search that jumps to the moment." | `/search` for a topic, click a video result, transcript syncs | Tier 4 | Build 5 |
| "We want this to evolve as our knowledge grows." | `fetchTopicLabels` + `searchRelatedResources` widening | Tier 4 | Build 5 |
| "How do we know it's enterprise-grade?" | Walk through Build 6 — residency, BYO-LLM, rate limits | Tier 4 | Build 6 |
| "Show us your reference customer build." | capstone walkthrough | Capstone | Build 7 |

---

## Appendix E — The  as teaching artefact

Partners should be told:

- **Read  first.** Every API endpoint the platform exposes is wrapped here in plain TypeScript. The whole client surface is 1,661 lines — readable in one sitting.
- **Read  next.** Graph queries, filtering tricks, hybrid retrieval — 243 lines.
- **Use  as the canonical Tier 3 reference.** Six distinct generation patterns in one file.
- **Use  as the canonical Tier 2 reference.** Prospect vs member prompts, CTA post-processing, link interception, teaser injection, blur-gate.
- **Canonical Tier 4 pattern:** Video + transcript + resource chat + deep link + utterance highlight — all wired through a single `getResource()` call.

The repo is private at . When you give a partner access, give them this framework with it.

---

## Honest note on the next move

This framework is genuinely comprehensive. That comprehensiveness is also its weakness — it's only as good as the **assets behind it**. Right now the assets are *named* but not *built*. The two with the highest combined leverage are:

1. **Build 3 — the Agent Workshop notebook.** This is the asset that converts a "we already use ChatGPT" objection into a Tier 3 conversation. Without it, partners stall at Tier 2.
2. **Build 7 — The Capstone (Atlas or Aurora).** This is the asset that closes the strategic-account sale. It's also the curriculum capstone. It earns its build cost back on its first reference customer.

The capstone is the next major work item. It's both the curriculum capstone and the sales-room closer, and it should be built before the wider partner programme opens.
