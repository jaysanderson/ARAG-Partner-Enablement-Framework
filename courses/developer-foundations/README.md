# Course — Developer Foundations

> **Programme:** Progress Agentic RAG Partner Enablement Framework
> **Cert awarded:** Developer Foundations Practitioner
> **Tracks served:** Solution (primary), Deliver (primary), Sell (secondary — first three builds only)
> **Prerequisites:** None. This is the entry point.
> **Duration:** 6–8 weeks part-time per individual; 4 weeks at full focus
> **Status:** Shipped (curriculum + rubrics). Some named assets still on the asset library backlog — see §4.
> **Companion docs:** `../../README.md` (umbrella framework), `builds/build-7-capstone/atlas-operations/README.md`, `builds/build-7-capstone/aurora-concierge/README.md`

---

## 1. What this course is

Developer Foundations is the on-ramp. By the end of it, a named individual can position Progress Agentic RAG as a platform (not a chatbot), design and ship a multi-tier ARAG application against a real customer's corpus, and walk a Fortune 500 buyer through a 25-minute demo without code edits.

The course is built as eight hands-on Builds (0–7) against a real ARAG sandbox. Every Build ships a specific artefact and carries a pass/fail rubric. Builds 0–6 are foundational competencies; Build 7 is the capstone — the partner picks one of the two worked example briefs (Atlas Operations or Aurora Concierge) and ships their variant of it.

The curriculum maps directly to the framework's four-tier technical capability ladder. The Tiers are how customers buy; the Builds are how partners learn to deliver each tier.

| Tier | Builds in this course | What the customer is buying |
|---|---|---|
| Tier 1 — Foundations | Builds 0, 1 | Grounded search + Q&A with citations |
| Tier 2 — Multi-Surface Conversational | Build 2 | One KB, multiple prompt voices, embedded widgets |
| Tier 3 — Structured AI Workflows | Builds 3, 4 | `askForJson` as a programmable backend, composite RAG patterns |
| Tier 4 — Agentic & Knowledge-Graph Platform | Builds 5, 6 | Typed graphs, data-augmentation agents, production ops |
| Capstone | Build 7 | The whole platform in one branded surface |

---

## 2. Learning outcomes

A Developer Foundations Practitioner can, on demand and without supervision:

- Name and explain the five ARAG primitives (Retrieve, Generate, Constrain, Reason over relations, Stream & secure media) — see umbrella framework Part II.
- Provision a sandbox KB, ingest content, configure labelsets, and run hybrid retrieval.
- Build and operate streaming + sync `/ask` flows with citation extraction and custom prompts.
- Implement multi-surface conversational experiences with KB routing by user state, query-prefix language switching, and resource-scoped chat.
- Design `answer_json_schema` workflows including mixed-shape schemas and the strict-mode `additionalProperties:false` requirement.
- Implement composite-RAG flows that fall back to `/find` when single-shot retrieval is low confidence.
- Design and configure a custom data-augmentation agent that produces a typed knowledge graph filtered to `{prop:'generated', by:'data-augmentation'}`.
- Configure data residency, BYO-LLM routing (Azure / Vertex / Bedrock), rate-limit-aware clients (default 2400 req/min), and observability for production.
- Deploy and demo a Build 7 capstone (Atlas or Aurora) end-to-end in 25 minutes without code edits.

---

## 3. The eight Builds

Builds are the spine. Each is a hands-on exercise against a real ARAG sandbox, ships a specific artefact, and carries a pass/fail rubric. Builds are owned by one or more tracks.

### Build 0 — Hello ARAG

| Field | Value |
|---|---|
| **Owning track(s)** | Sell, Solution, Deliver — all three start here |
| **Tier mapped to** | Tier 1 prep |
| **What the partner does** | Provisions a sandbox KB, ingests 10 documents from their own corpus, makes their first `/ask` call from `curl`, runs `/find` for a semantic search, opens  and points it at their KB |
| **Pass rubric** | (1) Sandbox KB provisioned and reachable. (2) Three successful streamed answers against their content with citations rendered. (3)  `/assistant` page running locally against their KB. Reviewer signs off. |
| **Asset delivered** | A 30-minute recorded run-through of the partner's own corpus answering three of their customer's most common questions. This is the first thing they show in a customer meeting. |

### Build 1 — Grounded search & drop-in widgets

| Field | Value |
|---|---|
| **Owning track(s)** | Sell (Should), Deliver (Must) |
| **Tier mapped to** | Tier 1 |
| **What the partner does** | Embeds `<nuclia-search-bar>`, `<nuclia-chat>`, `<nuclia-popup>` on a real partner website with branded theming (`--nuclia-color-primary`, base64'd CSS via `csspath`). Configures content-type filters and label filters. Ships a `?q=` deep-link experience. |
| **Pass rubric** | (1) Widgets live on a public URL. (2) Branded styling matches the partner brand. (3) Search results return content-type-filtered and topic-filtered. (4) Demo-ready in under five minutes. |
| **Asset delivered** | A "Demo a chatbot in 30 minutes" playbook with the partner's branded widget HTML snippet and a slide describing how the same KB powers both the search bar and the chat. Reference: and `snippetData.ts`. |

### Build 2 — Multi-surface conversational intelligence

| Field | Value |
|---|---|
| **Owning track(s)** | Sell (Should), Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 2 |
| **What the partner does** | Builds a floating chat with two distinct prompt modes — *prospect* (concise + one CTA from the corpus) and *member* (detailed + multi-source citations). Both modes route to the same KB; the only difference is the prompt and the post-processing. Implements `{context}`/`{question}` placeholders, query-prefix language switching, and resource-scoped chat. |
| **Pass rubric** | (1) Two prompt modes demonstrably differ in voice, length, and CTA behaviour. (2) A `Respond in {language}: ` prefix produces a working multilingual answer. (3) Resource-scoped chat correctly focuses the model on a single document. (4) Deep-link share URLs auto-fire once and strip themselves cleanly. |
| **Asset delivered** | A "Three voices, one KB" demo script with the partner's own copy. Reference: (the canonical Tier 2 example), |

### Build 3 — Schema-constrained generation (the agent workshop)

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 3 |
| **What the partner does** | Designs and ships three `askForJson` workflows against the partner's own KB: a follow-up question generator, a dynamic FAQ generator, and a domain taxonomy generator. Learns to handle the strict-mode `additionalProperties:false` requirement, the three response-shape fallbacks, and the "schema permissive, code strict" pattern (mixed-type schemas with client-side validation). |
| **Pass rubric** | (1) Three schemas committed to the partner's repo. (2) Each schema validated against at least 20 production inputs. (3) Mixed-shape schema (MC + free-text) generated correctly. (4) Recorded demo explaining the difference between `askForJson` and the manual-JSON-via-prompt-with-regex pattern, and when to use each. |
| **Asset delivered** | The Agent Workshop notebook — a reusable Jupyter / TypeScript template with five worked schema examples. Reference: (six distinct generation patterns in one file — the canonical Tier 3 reference) and . **Flagged as one of the two highest-priority assets to build first in the umbrella framework's 90-day rollout.** |

### Build 4 — Composite RAG (the on-ramp to agentic)

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Should), Deliver (Must) |
| **Tier mapped to** | Tier 3 → Tier 4 bridge |
| **What the partner does** | Implements "generate → evaluate citations → if low confidence, fire `/find` → synthesise augmented context → re-ask" in a real workflow. Builds at least one production pattern: study-guide-with-fallback, low-confidence-answer-retry, or multi-step research synthesis. |
| **Pass rubric** | (1) Working composite flow with measurable improvement over single-shot `/ask`. (2) Latency budget documented and within target. (3) Recorded explanation of where the boundary sits between "augmenting retrieval" and "running a true agent." |
| **Asset delivered** | A composite-RAG cookbook with three recipes — retry-on-low-citations, multi-pass synthesis, retrieve-then-rerank. Reference: (the cleanest live example). The Advanced Extraction & Retrieval Strategies course goes deeper on this in Build 8. |

### Build 5 — Typed knowledge graph & data augmentation agents

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 4 |
| **What the partner does** | Designs a bespoke entity/relation schema for the partner's domain (e.g., LEGAL: PARTY/MATTER/JURISDICTION/STATUTE/JUDGE; or PHARMA: COMPOUND/TARGET/TRIAL/PI). Configures a data-augmentation agent to extract that schema. Ships a graph navigation UI that filters to `{prop:'generated', by:'data-augmentation'}`, supports fuzzy entity search, undirected path traversal, and incremental in-place graph expansion. Wires entity-to-resources lookup using hybrid `features:['keyword','semantic']`. |
| **Pass rubric** | (1) A typed schema of at least 8 entity types and 8 relation types committed and documented. (2) Graph queries return clean results (no NER noise, no GUID-shaped values). (3) Click-to-expand graph traversal working end-to-end. (4) Recorded demo answering a customer question that *cannot* be answered by single-shot retrieval — only by traversing the graph. |
| **Asset delivered** | A graph schema design template (12 worked vertical examples — legal, pharma, financial services, film production, compliance, etc.). Reference:, `graphConstants.ts`, and . The Advanced course goes much deeper on agent design in its Build 6. |

### Build 6 — Production readiness

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 4 (operational) |
| **What the partner does** | Configures data residency (EU or USA), wires BYO-LLM routing across Azure OpenAI / Google Vertex / AWS Bedrock, observes the default 2400 req/min rate limit and designs around it, hardens authentication, instruments observability, and stress-tests the workload. |
| **Pass rubric** | (1) Residency demonstrably configured and verifiable. (2) BYO-LLM connection working against at least two of the three hyperscaler endpoints. (3) Rate-limit-aware client implemented (backoff, batching, request coalescing). (4) Observability dashboard tracking p50/p95 latency, retrieval recall proxy, and citation-rate. (5) Recorded explanation of the "platform-grade" pitch to a customer's CTO. |
| **Asset delivered** | A production-readiness checklist + reference Terraform / CDK / Bicep snippets for residency-aware deployment + rate-limit-aware client templates. |

### Build 7 — The Capstone (pick your wow build)

The capstone ships with two worked examples. The partner picks the one that matches their book of business; the second is built later if both customer segments are in play. Both share the same chassis, the same eight-week build plan, and the same re-skin playbook structure — they differ in corpus, graph schema, workflows, and demo buyer.

| Variant | Buyer | Persona corpus | Killer moment | Brief |
|---|---|---|---|---|
| **Enterprise / Operations** | CTO, CIO, Chief Data Officer | Atlas Global Industries (industrial manufacturer, single KB + business-unit labelsets) | Composite-RAG incident root cause + cross-functional typed graph | `builds/build-7-capstone/atlas-operations/README.md` |
| **Customer Experience** | CMO, Head of Digital, Chief Customer Officer | Aurora Outfitters (D2C outdoor retailer, single KB + content-type labelsets) | Two-voice floating chat + content-engineered CTAs + abandoned-cart composite RAG | `builds/build-7-capstone/aurora-concierge/README.md` |

| Field | Value (applies to both variants) |
|---|---|
| **Owning track(s)** | All three tracks at Must for Elite tier |
| **Tier mapped to** | Capstone — combines Tiers 1–4 |
| **What the partner does** | Builds one variant of the capstone: a single application that exercises every primitive and every tier in one branded surface. Grounded search + multi-surface chat + schema-constrained workflows + typed knowledge graph + multimodal media + custom field enrichment + production-grade ops. The capstone is what a partner walks into a Fortune 500 buyer's office with. |
| **Pass rubric** | (1) The capstone deployed at the partner's domain. (2) End-to-end demo runs in 25 minutes covering all four tiers without code edits. (3) At least one customer-specific data-augmentation agent in production. (4) Org-level recorded demo passes a Progress-led review board. |
| **Asset delivered** | The capstone reference build — the flagship asset of the entire programme. **Flagged as the second of two highest-priority assets to build first.** It is both the curriculum capstone and the sales-room closer. Reference: composes patterns from every file in and . |

---

## 4. Prompt engineering patterns to teach explicitly (cross-cutting through Builds 2–7)

These patterns recur across every Build past Build 1. Every certified Solution-track and Deliver-track individual must be able to discuss them.

| Pattern | When to use |
|---|---|
| `system` only | Voice control, format control, length control. Fastest. |
| `system` + `user` with `{context}`/`{question}` | When you need fine control over how retrieval is injected. |
| Query prefix only | A/B-able verbosity ("Research mode"), language switching ("Respond in French: "), resource scoping ("Regarding the resource X:"). Cheapest. |
| `answer_json_schema` | When the response feeds an API, a UI, or another ARAG call. |
| Manual JSON via system prompt + regex extract | When you need streaming + structured output. |

Teach partners to start with system-only, escalate to user-template when retrieval injection needs control, escalate to schema when the next consumer is code, and reach for manual-JSON only when both streaming and structure are required.

---

## 5. Course progression and content

Each Build (0–6) ships with three files inside its folder:

| File | Purpose |
|---|---|
| `lesson.md` | Educational content — concepts, ARAG-specific patterns, common pitfalls, what you'll build. Read first. |
| `walkthrough.md` | Step-by-step build instructions with code snippets, commands, verification checklist. Execute second. |
| `quiz.md` | 8 multiple-choice + 1 short-answer quiz. Take after the walkthrough. Pass = 7/8 + credible short answer. |

After all seven Build quizzes are passed, sit the **[final exam](final-exam.md)** — 40 multiple-choice + 5 short-answer, open-book, pass = 32/40 MC + 3/5 short answer. The final exam is the gate before the Build 7 capstone.

| Stage | Materials | Required |
|---|---|---|
| Build 0 — Hello ARAG | [lesson](builds/build-0-hello-arag/lesson.md) · [walkthrough](builds/build-0-hello-arag/walkthrough.md) · [quiz](builds/build-0-hello-arag/quiz.md) | ✓ |
| Build 1 — Grounded search & widgets | [lesson](builds/build-1-grounded-search-widgets/lesson.md) · [walkthrough](builds/build-1-grounded-search-widgets/walkthrough.md) · [quiz](builds/build-1-grounded-search-widgets/quiz.md) | ✓ |
| Build 2 — Multi-surface conversational | [lesson](builds/build-2-multi-surface-conversational/lesson.md) · [walkthrough](builds/build-2-multi-surface-conversational/walkthrough.md) · [quiz](builds/build-2-multi-surface-conversational/quiz.md) | ✓ |
| Build 3 — Schema-constrained generation | [lesson](builds/build-3-schema-constrained-generation/lesson.md) · [walkthrough](builds/build-3-schema-constrained-generation/walkthrough.md) · [quiz](builds/build-3-schema-constrained-generation/quiz.md) | ✓ |
| Build 4 — Composite RAG | [lesson](builds/build-4-composite-rag/lesson.md) · [walkthrough](builds/build-4-composite-rag/walkthrough.md) · [quiz](builds/build-4-composite-rag/quiz.md) | ✓ |
| Build 5 — Knowledge graph | [lesson](builds/build-5-knowledge-graph/lesson.md) · [walkthrough](builds/build-5-knowledge-graph/walkthrough.md) · [quiz](builds/build-5-knowledge-graph/quiz.md) | ✓ |
| Build 6 — Production readiness | [lesson](builds/build-6-production-readiness/lesson.md) · [walkthrough](builds/build-6-production-readiness/walkthrough.md) · [quiz](builds/build-6-production-readiness/quiz.md) | ✓ |
| **Final exam** | [final-exam.md](final-exam.md) | **✓ — gate before Build 7** |
| Build 7 — Capstone | [Atlas Operations](builds/build-7-capstone/atlas-operations/) or [Aurora Concierge](builds/build-7-capstone/aurora-concierge/) | ✓ |

---

## 6. Course-level certification

Pass all seven Builds (0–6) + the final exam + a Build 7 capstone deployment and recorded demo to earn **Developer Foundations Practitioner**.

The cert is awarded per individual, valid 12 months, and is the prerequisite for the Advanced Extraction & Retrieval Strategies course. Two of the three track-specific cert stacks defined in the umbrella framework's Part IV depend on this cert as their foundation:

- Solution-Foundations = Developer Foundations Practitioner (Builds 0–2 minimum for the Solution-1 sub-tier).
- Deliver-Foundations = Developer Foundations Practitioner.
- Sell-Foundations = Builds 0–2 walkthrough + the (in-progress) Sales Foundations course content. Builds 3–7 are Aware-level for Sell.

A partner organisation cannot reach Authorized tier without at least one Developer Foundations Practitioner on staff.

---

## 7. Assessment gates

| Gate | Format | Reviewer |
|---|---|---|
| Per-Build quiz | 8 MC + 1 short answer per Build. Pass = 7/8 + credible short answer | Auto-graded MC + Progress Solution lead grades short answer |
| Per-Build walkthrough deliverable | The asset the Build's walkthrough specifies (recording, playbook, demo, dashboard, etc.) | Progress Solution lead |
| **Final exam** | **40 MC + 5 short answer, open-book. Pass = 32/40 MC (80%) + 3/5 short answer. Must pass before Build 7.** | **Progress Solution lead** |
| Capstone | 25-minute end-to-end recorded demo of Build 7 against the partner's own re-skin | Progress-led review board |
| Honesty | Submitted demos shown to have been built by Progress SEs or subcontractors void the cert and bar the individual for 90 days | Programme integrity reviewer |

---

## 8. Reading list

In order:

1. Umbrella framework — `../../README.md` — Parts I, II, IV, VI especially.
2. — the technical reference application.
3. (1,661 lines) — the canonical ARAG client wrapper.
4. (243 lines) — the graph client surface.
5. `builds/build-7-capstone/atlas-operations/README.md` *or* `builds/build-7-capstone/aurora-concierge/README.md` — depending on which Build 7 variant the partner picks.
6. — six distinct generation patterns in one file. Canonical Tier 3 reference.
7. — canonical Tier 2 reference.
8. — canonical Tier 4 reference.

---

## 9. What comes next

After Developer Foundations Practitioner, the natural next course is **Advanced Extraction & Retrieval Strategies** (`../advanced-extraction-and-retrieval-strategies/README.md`). The Advanced course goes deeper on retrieval quality, chunking, hybrid retrieval tuning, custom labelsets, custom field engineering, data-augmentation agent design at depth, multimodal extraction, and production-grade tuning. It's prerequisite for the Solution-Specialist and Deliver-Specialist cert tiers.

Other planned courses (Sales Foundations, Solution Architecture Mastery, Production Operations & SLOs) extend the partner's competency along sales, architecture, and operations dimensions respectively.
