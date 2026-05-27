# Course — Advanced Extraction & Retrieval Strategies

> **Programme:** Progress Agentic RAG Partner Enablement Framework
> **Cert awarded:** Advanced Extraction & Retrieval Strategies Specialist (abbrev. AE&RS Specialist)
> **Tracks served:** Deliver (primary), Solution (strongly recommended)
> **Prerequisites:** Developer Foundations Practitioner (current cert)
> **Duration:** 6–8 weeks part-time per individual; 4 weeks at full focus
> **Status:** Shipped (curriculum + rubrics). Some named assets still on the asset library backlog — see §5.
> **Companion docs:** `../../README.md` (umbrella), `../developer-foundations/README.md` (prerequisite course)

---

## 1. What this course is

Developer Foundations teaches a partner to ship working ARAG applications. This course teaches the partner to ship working ARAG applications that **measurably outperform competitors**. The difference shows up in customer renewals, in win rates against Algolia / Coveo / Bloomreach / Elastic, and in the size of the recurring tuning retainer the partner can charge.

The course is built around two truths most partner programmes ignore:

1. **You cannot tune what you cannot measure.** Most partner-delivered RAG systems ship without retrieval-quality baselines. They feel good in demo and degrade silently in production. Build 1 of this course is non-negotiable for that reason — every subsequent Build is grounded in measurable lift against a Build 1 baseline.
2. **Extraction and retrieval are the same problem from opposite ends.** What you extract at ingest time determines what's retrievable at query time. Partners who treat extraction as an IT problem and retrieval as a product problem lose to partners who treat both as a single discipline. This course teaches them as one.

By the end of the course, a named individual can:

- Design and run a retrieval-quality measurement harness against any ARAG knowledge box.
- Recommend per-content-type chunking strategies grounded in measured outcomes.
- Tune hybrid retrieval, custom labelsets, and field-engineered surfaces for specific customer outcomes.
- Design and deploy custom data-augmentation agents that produce typed knowledge graphs for verticals beyond the textbook examples.
- Engineer multimodal corpora — video, audio, scanned PDFs, image — for grounded retrieval with timestamp anchoring.
- Productionise composite and agentic RAG patterns with observability and cost analysis.
- Deliver and write a paid tuning engagement against an existing customer's ARAG deployment.

That last bullet is the commercial point. **The AE&RS Specialist cert exists to make the partner saleable as a tuning consultancy.** Customers don't buy ARAG once. They buy ARAG and then they buy years of tuning. This course is the credential that lets the partner charge for that.

---

## 2. The nine Builds

Each Build is a hands-on exercise against a real ARAG sandbox. Each ships a specific artefact. Each carries a pass/fail rubric. Builds 1–8 are competencies; Build 9 is the capstone — a written tuning engagement against an existing capstone deployment.

Several Builds reference ARAKS research papers (RP-001 through RP-010) which live in the Sample ARAG App's member knowledge base (`Sample-ARAG-App/knowledge-base/kb-member-knowledge/research/`). These are recommended pre-reading for the relevant Builds; the citations below name them explicitly.

### Build 1 — Retrieval Quality Baselines & Metrics

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Why it's first** | Every subsequent Build's rubric depends on measurable lift. No baseline, no Build 2. |
| **What the partner does** | Builds a retrieval-quality measurement harness for the partner's KB. Computes precision@k, recall@k, MRR (mean reciprocal rank), nDCG, hit-rate, and end-to-end citation-rate. Designs a 30–60-query golden set against the KB with difficulty tagging (easy/medium/hard) and known-good resource IDs. Where the KB spans multiple content domains (via labelsets), the golden set must sample queries that exercise at least 3 content types or labelset values. Captures a baseline before any tuning happens. |
| **Pass rubric** | (1) Harness runnable on demand against the KB. (2) Golden set of 30+ queries committed with expected resource IDs and difficulty tags. (3) At least 3 content-type or labelset value sub-baselines computed (to spot retrieval gaps that hide in cross-domain averages). (4) Both retrieval-only (`/find`) and end-to-end (`/ask`) metrics captured. (5) Noise threshold defined (how much lift counts as real). |
| **Asset delivered** | Eval-harness template (TypeScript or Python) + golden-set markdown template + scoreboard layout. This becomes the harness every subsequent Build runs against. |
| **Reference reading** | ARAKS RP-002 (RAG Evaluation Methods, ARAKS RAGAS-compatible scoring framework). |

### Build 2 — Chunking Strategy Design

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Should), Deliver (Must) |
| **Why it matters** | Chunking is invisible but decisive. Default chunking ships as "fine"; tuned chunking lifts recall 20–40% on structured content. |
| **What the partner does** | Designs and deploys per-content-type chunking strategies. Compares fixed-size, semantic, structure-aware (markdown header-based, PDF section-based, transcript speaker-turn-based), and sliding-window approaches. A/B tests against the Build 1 baseline. Documents a chunking decision tree. |
| **Pass rubric** | (1) Chunking spec doc for 3 distinct content types (e.g. PDF, markdown, video transcript). (2) A/B comparisons with measured retrieval lift from the Build 1 harness. (3) Decision tree: when to recommend each chunking strategy. (4) Recorded explanation tying chunking choices to RP-004's findings. |
| **Asset delivered** | Chunking spec template + per-content-type decision tree. |
| **Reference reading** | ARAKS RP-004 (Chunking Strategies for Optimal Retrieval — systematic evaluation of 12 approaches, 34% precision improvement identified). |

### Build 3 — Hybrid Retrieval Tuning

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Why it matters** | Dense retrieval alone misses named entities, IDs, and exact strings. Keyword alone misses paraphrases and conceptual queries. Hybrid is the lever. But weighting and score normalisation matter. |
| **What the partner does** | A/B tests dense-only vs keyword-only vs `features:['keyword','semantic']` hybrid against the Build 1 golden set. Builds a decision matrix mapping query archetypes (named-entity / conceptual / mixed / quantitative / temporal) to recommended retrieval mode. Wires hybrid into at least one production code path. Practises filter composition: stacking content-type filters (`/icon/video`, `/icon/application/pdf`), label classification filters (`/classification.labels/{labelset}/{label}`), and free filters. |
| **Pass rubric** | (1) A/B comparison for 3+ query archetypes with measured outcomes. (2) Decision matrix documented and tested. (3) At least one production code path migrated to hybrid with measured lift. (4) Filter composition working with 3+ stacked filters. (5) Score normalisation strategy documented (how to compare keyword scores to semantic scores). (6) Recorded demo explaining when to recommend hybrid (and when single-mode is enough). |
| **Asset delivered** | Hybrid-retrieval decision matrix template + A/B test runner extending Build 1's harness. |
| **Reference reading** | ARAKS RP-003 (Hybrid Retrieval Strategies — comparative analysis of dense, sparse, and hybrid). The Sample ARAG App's `searchRelatedResources` in `src/lib/graphApi.ts:179-237` is the only place in the entire reference app that explicitly sets hybrid mode — partners must internalise this as the deliberate lever it is. |

### Build 4 — Custom Labelsets & Classifiers

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Why it matters** | Most partners ship retrieval against an unlabelled corpus and then complain results are too broad. Labels are the cheapest precision lever in the toolkit, and labelset design is a content-engineering competency partners can charge for. |
| **What the partner does** | Designs and deploys three labelsets against the partner's corpus. Each labelset has 5–9 labels (cognitive limit), maps to user intent rather than internal taxonomy, and avoids overlap. Trains classifiers (rule-based, model-based, or hybrid) to populate the labels. Wires filter composition into a production search surface using the `/classification.labels/{labelset}/{label}` filter path. Implements dynamic labelset resolution to handle multi-KB scenarios where labelset names vary. |
| **Pass rubric** | (1) 3 labelsets designed and documented with rationale. (2) Classifiers trained and labels populated against the corpus. (3) Filter UI wired into at least one production surface. (4) Measured UX improvement (session length, click-through) vs unlabelled baseline. (5) Multi-label AND query working. (6) Per-paragraph labels demonstrated (paragraphs can carry their own classifications independent of the parent resource). |
| **Asset delivered** | Labelset design template + classifier training guide. |
| **Reference reading** | Sample ARAG App `src/lib/ragApi.ts:1285-1340` (label-driven filter composition) and `:1625-1660` (`fetchTopicLabels` — dynamic labelset resolution pattern). |

### Build 5 — Custom Field Engineering

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Commercial note** | This is the **highest-leverage recurring-revenue lever** in the entire framework. Field engineering is content authoring, not engineering. Partners sell it as an ongoing service to customers. A typical retainer is $5–15K / month per customer to maintain and tune field-engineered surfaces. |
| **What the partner does** | Designs and deploys three custom JSON-encoded text fields per resource type, following the Sample ARAG App's pattern: `callToAction` (one-sentence branded CTA copy), `searchResultDisplay` (title + description optimised for AI-answer rendering, distinct from the raw resource title), `videoInfo` (structured speakers + topics + key points + call-to-action for video resources). Manually populates 30+ hero resources. Wires the front-end to render the fields. Trains the partner's customer's content team to author and maintain the fields. Sets up A/B testing (with-fields vs without-fields baseline). |
| **Pass rubric** | (1) 3 distinct field designs documented with purpose, schema, and author guidelines. (2) 30+ resources populated. (3) Front-end consumes the fields in search and chat surfaces. (4) Author training script + style guide shipped. (5) A/B test designed with first results documented. (6) Recorded explanation of how to sell this as a content-engineering retainer to the partner's customer. |
| **Asset delivered** | Field-engineering playbook + author training script + A/B test scaffolding. |
| **Reference reading** | Sample ARAG App `src/lib/ragApi.ts:1212-1263` for the canonical field-extraction logic. `src/components/chat/FloatingChat.tsx:22-45` for the front-end post-processing that converts model-emitted `[label](href)` markdown into branded CTA pills. |

### Build 6 — Data-Augmentation Agents at Depth

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Why this Build matters** | Developer Foundations Build 5 taught how to *use* a graph. This Build teaches how to *design the agent that produces* the graph — including for verticals beyond the textbook legal / pharma examples. This is what makes a partner irreplaceable on a customer account. |
| **What the partner does** | Designs a typed entity/relation schema for a partner-chosen vertical (or partner-supplied customer corpus). 8–15 entity types per schema; 8–15 relation types. Configures and deploys the data-augmentation agent. Runs extraction against a real corpus. Hand-labels a 100-example sample and measures the agent's precision per entity type and overall coverage rate. Iterates the schema and the extraction prompts. Documents a schema-evolution plan (how to add a new entity type without re-extracting everything). |
| **Pass rubric** | (1) Schema documented (entity types with definitions, relation types with semantics, edge cases). (2) Agent deployed and running against the corpus. (3) Entity coverage > 80% on the hand-labelled sample. (4) False-positive rate < 10%. (5) Observability dashboard showing per-type metrics. (6) Schema-evolution plan documented. (7) Recorded demo answering a customer question that *cannot* be answered by single-shot retrieval. |
| **Asset delivered** | Agent design template + 10 worked vertical schemas (legal, pharma, financial services, healthcare, public sector, retail, media, manufacturing, education, energy). |
| **Reference reading** | Sample ARAG App `src/lib/graphApi.ts` and `src/lib/graphConstants.ts`. The Atlas Operations capstone brief (`../developer-foundations/builds/build-7-capstone/atlas-operations/README.md` §5.4) and Aurora Concierge capstone brief (`../developer-foundations/builds/build-7-capstone/aurora-concierge/README.md` §5.4) have two worked vertical schemas already. ARAKS RP-008 (Knowledge Graph RAG — 41% factual error reduction vs dense retrieval in structured-domain applications). |

### Build 7 — Multimodal Extraction

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Should), Deliver (Must) |
| **Why it matters** | Enterprise corpora are 60–80% video, audio, scanned PDFs, and images. Partners who can only do text retrieval are leaving the majority of customer value on the table. Multimodal extraction is what unlocks media, training, broadcast, healthcare-imaging, and field-service customers. |
| **What the partner does** | Ingests a video corpus (10+ videos) and a scanned-PDF corpus (10+ documents). Verifies utterance extraction with timestamp anchoring (`data.files.*.extracted.metadata.paragraphs[]` with `start_seconds[0]` and `end_seconds[0]`). Wires transcript-sync UI (click transcript → seek video; video timeupdate → highlight active paragraph). Builds a search experience that returns video-timestamp deep links. Documents audio diarization (speaker boundaries, where supported). Confirms OCR pipeline handles scanned PDFs. Verifies image classification (per-paragraph labels). Demonstrates DASH MPD streaming with the auth-injecting `RequestModifier` pattern. |
| **Pass rubric** | (1) Video utterance extraction working with timestamps verifiable in `/find` responses. (2) Scanned PDF retrieval working (OCR layer demonstrated). (3) Transcript ↔ video sync working end-to-end. (4) Audio diarization documented. (5) Hit rate > 70% on a 20-query golden set of timestamp queries ("find the moment X is mentioned"). (6) Recorded demo deep-linking to a specific second of a video resource. |
| **Asset delivered** | Multimodal extraction recipe book (per-content-type playbook covering ingest, verification, retrieval, and deep-link UX). |
| **Reference reading** | Sample ARAG App `src/lib/ragApi.ts:1058-1137` (`extractUtterancesFromExtractedData`), `:1188-1207` (DASH manifest detection), and `src/components/knowledge/VideoPlayer.tsx:50-169` (DASH player with `RequestModifier` auth injection). ARAKS RP-006 (Multimodal RAG). |

### Build 8 — Composite & Agentic Retrieval Patterns

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Should), Deliver (Must) |
| **Why it matters** | Developer Foundations Build 4 introduced composite RAG as the bridge to agentic. This Build productionises it with three named recipes, observability, cost analysis, and a failure-mode taxonomy. Partners ready for Tier 4 customer engagements should be sketching these patterns on whiteboards, not just demoing them. |
| **What the partner does** | Implements three composite-RAG recipes in a single test harness: (1) Retry-on-low-citations — `/ask` first; if citation count or confidence below threshold, fire `/find` for more context, then re-ask. (2) Multi-pass synthesis — initial `/ask`, extract entities/topics from the answer, traverse the graph for related concepts, re-ask with augmented context. This is the Aurora Concierge abandoned-cart pattern. (3) Retrieve-then-rerank — `/find` returns N candidates; a smaller LLM or scoring function reranks; pass top-K back to `/ask`. A/B against single-shot for 20 hard queries selected from the Build 1 low-scoring tail. Documents failure modes (timeout cascades, infinite loops, citation drift) and the guards for each. Documents cost analysis (composite RAG is 2–4× the LLM token cost of single-shot; quantify when the lift justifies it). |
| **Pass rubric** | (1) All three recipes deployed and runnable. (2) A/B against single-shot on 20 hard queries with measured lift on at least 2 of 3 recipes. (3) Failure-mode handling documented and tested. (4) Cost analysis per recipe (LLM tokens, end-user latency, retrieval call volume). (5) Recorded explanation of when each recipe is appropriate vs when single-shot is enough. (6) Where the boundary sits between "augmenting retrieval" and "running a true agent" defined clearly. |
| **Asset delivered** | Agentic-patterns cookbook + composite-flow observability template. |
| **Reference reading** | Sample ARAG App `src/components/certification/ExamStudyPanel.tsx:35-115` (the cleanest live example of retry-on-low-citations). The Aurora Concierge capstone's `/abandoned-cart` pipeline (`../developer-foundations/builds/build-7-capstone/aurora-concierge/README.md` §5.5) is the multi-pass synthesis blueprint. ARAKS RP-007 (Agentic RAG Patterns — multi-step reasoning, tool-use, failure-mode taxonomy). |

### Build 9 — Capstone: Production-Grade Tuning Engagement

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Format** | Written tuning report (5–10 pages) + recorded review-board defence. |
| **What the partner does** | Picks one of the two existing capstone deployments from Developer Foundations Build 7 (Atlas Operations or Aurora Concierge — whichever the partner shipped). Instruments it with the Build 1 eval harness against a 30-query golden set. Identifies the three biggest retrieval-quality gaps (with metric citations from Build 1). Proposes three improvements drawn from Builds 2–8: at minimum, one extraction-side change (Build 2 chunking or Build 7 multimodal), one retrieval-quality change (Build 3 hybrid or Build 4 labelsets), and one generation-quality change (Build 5 field engineering or Build 8 composite RAG). Deploys all three changes against the capstone. Re-measures. Writes a 5–10-page tuning report covering: baseline, identified gaps, proposed changes with rationale, deployment notes, measured lift vs Build 1's noise threshold, residual gaps, and a recommendation for ongoing tuning cadence. |
| **Pass rubric** | (1) Capstone instrumented with Build 1 harness, baseline captured. (2) Three improvements proposed with clear rationale tied to measured gaps. (3) All three deployed against the capstone. (4) Measurable lift on at least 2 of 3 changes (lift > Build 1's noise threshold). (5) Tuning report submitted (5–10 pages) and passes Progress-led review board. (6) The report names a quarterly tuning cadence the partner can sell to customers. |
| **Asset delivered** | Tuning-report template — used by every AE&RS Specialist thereafter when scoping a paid tuning engagement with a customer. This is the commercial deliverable of the cert. |
| **Reference reading** | All prior Builds. Both capstone briefs. ARAKS RP-010 (Production RAG Ops). |

---

## 3. Cross-cutting competencies

Every certified AE&RS Specialist must be able to discuss the following with a customer's tech-lead in the room.

### 3.1 Retrieval-quality vocabulary

- **Precision@k** — of the top-k retrieved, what fraction are relevant?
- **Recall@k** — of all relevant documents, what fraction did the top-k retrieve?
- **MRR** — mean reciprocal rank; how high up the relevant result appears.
- **nDCG** — normalised discounted cumulative gain; weighted by position.
- **Hit rate** — fraction of queries that retrieve at least one relevant result.
- **Citation rate** — fraction of `/ask` responses that produce non-empty citations.
- **Noise threshold** — the lift required to claim a tuning change worked, accounting for variance across query sets.

### 3.2 Extraction-retrieval feedback loop

What you extract at ingest determines what's retrievable at query. A partner who cannot trace a retrieval failure back to a specific extraction decision is not yet a Specialist. Every Specialist's mental model: *retrieval quality is downstream of extraction quality, which is downstream of corpus design.*

### 3.3 The cost-of-quality conversation

Composite RAG, multi-pass synthesis, custom data-augmentation agents, and field-engineered surfaces all have non-zero ongoing costs (LLM tokens, agent runs, content authoring hours). A Specialist can quantify them and defend them at the customer's CFO meeting.

### 3.4 Observability minimum

Every production ARAG deployment a Specialist signs off on must surface:
- p50 / p95 / p99 retrieval latency
- p50 / p95 / p99 `/ask` end-to-end latency
- Citation rate (proportion of `/ask` calls returning non-empty citations)
- Per-labelset query volume + per-labelset error rate (which content domains are getting hit, where do errors concentrate)
- Per-LLM-endpoint volume (for BYO-LLM observability) and cost per endpoint

---

## 4. Course-level certification

Pass all eight Builds (1–8) plus Build 9 (tuning report + review-board defence) to earn **Advanced Extraction & Retrieval Strategies Specialist**.

The cert is per-individual, valid 12 months, and is the prerequisite for the Solution-Specialist and Deliver-Specialist sub-tiers defined in the umbrella framework's Part IV.

A partner organisation cannot reach Premier tier without at least one AE&RS Specialist on staff. Elite tier requires multiple Specialists across Solution and Deliver tracks (see umbrella framework Part IV).

---

## 5. Asset library

| Asset | Build | Status |
|---|---|---|
| Eval-harness template + golden-set template | 1 | TODO |
| Chunking spec template + decision tree | 2 | TODO |
| Hybrid-retrieval decision matrix + A/B runner | 3 | TODO |
| Labelset design template + classifier training guide | 4 | TODO |
| Field-engineering playbook + author training script + A/B scaffolding | 5 | TODO |
| Agent design template + 10 vertical schemas | 6 | TODO |
| Multimodal extraction recipe book | 7 | TODO |
| Agentic-patterns cookbook + observability template | 8 | TODO |
| Tuning-report template | 9 | TODO |

The Build 5 field-engineering playbook and the Build 9 tuning-report template are the two highest-commercial-leverage assets in this course. Prioritise them when the partner programme begins shipping advanced assets.

---

## 6. Assessment gates

| Gate | Format | Reviewer |
|---|---|---|
| Written assessment | Open-book, 80 questions drawn from the Aware/Should/Must matrix, weighted toward Must-level competencies | Auto-graded |
| Per-Build pass | Each Build's rubric — recorded demo, deployed artefact, or measured A/B result | Progress Solution lead |
| Build 9 capstone | Written tuning report + 30-minute review-board defence | Progress-led review board (cross-functional: Solution + GTM + at least one peer Specialist) |
| Honesty | Submitted artefacts shown to have been built by Progress SEs or partner subcontractors void the cert and bar the individual for 90 days | Programme integrity reviewer |
| Annual recert | Shorter version of Build 9 against a new customer engagement | Progress-led |

The Build 9 review-board defence is non-trivial. Plan for it as a half-day commitment from the candidate, the reviewers, and the partner manager.

---

## 7. Reading list

Required pre-reading (before Build 1):

1. Umbrella framework `../../README.md` — Parts I, II, IV.
2. `../developer-foundations/README.md` — the prerequisite course in full.
3. Sample ARAG App `README.md` and `src/lib/ragApi.ts` (revisit, not first-read).
4. ARAKS RP-002 (Evaluation Methods) — sets up Build 1.

Per-Build pre-reading (each lives in `Sample-ARAG-App/knowledge-base/kb-member-knowledge/research/`):

| Build | Required reading |
|---|---|
| 1 | RP-002 Evaluation Methods |
| 2 | RP-004 Chunking Strategies |
| 3 | RP-003 Hybrid Retrieval Strategies |
| 4 | Sample ARAG App `ragApi.ts:1285-1340` and `:1625-1660` |
| 5 | Sample ARAG App `ragApi.ts:1212-1263` and `FloatingChat.tsx:22-45` |
| 6 | RP-008 Knowledge Graph RAG + both capstone briefs §5.4 |
| 7 | RP-006 Multimodal RAG + Sample ARAG App `ragApi.ts:1058-1137`, `VideoPlayer.tsx:50-169` |
| 8 | RP-007 Agentic RAG Patterns + Aurora Concierge capstone brief §5.5 |
| 9 | RP-010 Production RAG Ops + the partner's own Build 7 capstone deployment |

---

## 8. The commercial frame (why this course earns its build cost)

The cert this course awards is the lever for selling tuning engagements. Three commercial outcomes follow directly from having AE&RS Specialists on staff:

1. **Tuning retainers** — once the partner ships a capstone to a customer, the AE&RS Specialist can scope a quarterly tuning retainer at $15–40K / quarter. The Build 9 tuning-report template is the deliverable the customer renews against.
2. **Field-engineering retainers** — Build 5's content-engineering pattern is a separate $5–15K / month per customer service line. Specialists are the credentialed delivery resource.
3. **Production-tuning fixed-fee engagements** — a one-off "audit and tune" for an existing customer's ARAG deployment is a clean $40–80K fixed-fee engagement. The Build 9 capstone is the blueprint.

A partner with three AE&RS Specialists across Solution and Deliver tracks can sustain $1–2M / year of recurring tuning revenue per ten capstone customers. The cert is built to make that the default outcome, not the lucky one.

---

## 9. What comes next

After AE&RS Specialist, planned courses extend the partner's competency further:

- **Solution Architecture Mastery** — multi-account architecture, KB topology design, hybrid-cloud deployment patterns.
- **Production Operations & SLOs** — uptime SLOs, incident response for AI systems, capacity planning under the 2400 req/min rate limit.
- **Sales Foundations** (separate track) — discovery, qualification, win/loss, competitive positioning. This is the prerequisite for the Sell-track cert stack.

When those ship, this course continues to be the prerequisite for any technical-track Specialist or Master designation.
