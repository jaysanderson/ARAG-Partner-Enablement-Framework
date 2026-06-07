# Course — Advanced Search & Retrieval Agents

> **Programme:** Progress Agentic RAG Partner Enablement Framework
> **Cert awarded:** Advanced Search & Retrieval Agents Specialist (abbrev. AS&RA Specialist)
> **Tracks served:** Solution (primary), Deliver (strongly recommended)
> **Prerequisites:** Developer Foundations Practitioner (current cert). The sibling course [Advanced Extraction & Retrieval Strategies](../advanced-extraction-and-retrieval-strategies/README.md) is a strong companion but not strictly required.
> **Duration:** 5–7 weeks part-time per individual; 3 weeks at full focus
> **Status:** Draft 1. The eight Build briefs and three small-capstone briefs are shipped; per-build workspaces (`harness/`, `slides/`, `verification.md`) will be filled in over subsequent passes.
> **Companion docs:** [`../../README.md`](../../README.md) (umbrella), [`../developer-foundations/README.md`](../developer-foundations/README.md) (prerequisite course), [`../advanced-extraction-and-retrieval-strategies/README.md`](../advanced-extraction-and-retrieval-strategies/README.md) (sibling advanced course)

---

## 1. What this course is

Developer Foundations teaches a partner to **ship working ARAG applications**. The sibling course (Advanced Extraction & Retrieval Strategies) teaches the partner to **measure and tune the retrieval quality** of those applications. This course teaches the partner to **build adaptive search experiences and agent-based retrieval flows** — the layer between "retrieval works" and "retrieval is smart enough that the customer keeps paying for it."

The course is built around two truths most partner programmes underweight:

1. **Search is configuration, not code.** A senior practitioner can change a customer's perceived search quality by an order of magnitude without touching the retrieval engine — by changing how queries are rephrased, how filters compose, how results are reranked, how multi-turn context carries forward, and how the right *search profile* is selected for each use case. This course is the cert that proves a partner can wield those levers.
2. **Retrieval Agents are not a feature — they are a category.** ARAG ships a Retrieval Agents primitive that decomposes a hard question into sub-queries, executes each, merges the results, and returns a synthesised answer. Partners who treat agents as a special case lose to partners who treat them as the default for any question harder than *"find me the X about Y."* This course teaches the agent loop as a first-class design surface.

By the end of the course, a named individual can:

- Articulate the trade-offs between `/find`, `/ask`, `/search`, `/predict/chat`, and the Retrieval Agent endpoint, and pick the right primitive for any customer scenario.
- Configure ARAG's query rephrasing and design custom rephraser prompts for vertical-specific terminology.
- Compose deeply-nested filter expressions (AND / OR / NOT) and explain when each is the right choice for the search UX.
- Pick a reranking strategy — built-in, external cross-encoder, or none — grounded in a measured latency-vs-quality trade-off.
- Build multi-turn conversational retrieval surfaces with citation continuity across turns.
- Design and deploy **search profiles** — multiple search configurations against the same KB for different personas / use cases.
- Stand up Retrieval Agents end-to-end: from problem-statement to deployed agent with observability and cost budgeting.
- Design and ship **small customer-shaped capstones** — multilingual conversational agent, cross-KB federated search, query-decomposition compliance agent, **or a research portal** — each a real customer-shaped deliverable.

That last bullet is the commercial point. **The AS&RA Specialist cert exists to make the partner saleable as a search-experience design consultancy.** Customers buy ARAG once; they buy years of *"can you make it understand this kind of question?"* tuning. This course is the credential that lets the partner charge for that.

---

## 2. How this course differs from its sibling

The two advanced courses cover complementary surfaces:

| | **Advanced Extraction & Retrieval Strategies** (sibling) | **Advanced Search & Retrieval Agents** (this course) |
|---|---|---|
| **Primary question** | *"Is retrieval as good as it can be?"* | *"Is the search experience as smart as it can be?"* |
| **Primary track** | Deliver | Solution |
| **Day-to-day deliverable** | Retrieval-quality tuning engagement | Search-experience design + agent flow |
| **Measurement focus** | Precision/recall/MRR/nDCG against a golden set | Per-scenario success rate + latency budget per agent loop |
| **Lever inventory** | Chunking · labelsets · hybrid weighting · field engineering · multimodal extraction · data-augmentation agents | Primitive choice · query rephrasing · filter composition · reranking · multi-turn context · search profiles · retrieval agents · cross-KB / multilingual federation |
| **Capstone shape** | One large tuning engagement against a customer KB | **Four** small capstones, each a different customer scenario |
| **Commercial framing** | "We make your existing search better" | "We design the search your existing platform can't" |

A partner can hold one cert or both. A partner book of business that skews toward greenfield enterprise design tends to favour this course; a book of business that skews toward existing-deployment tuning tends to favour the sibling.

---

## 3. The eight Builds

Each Build is hands-on against a real ARAG sandbox. Each ships a specific artefact. Each carries a pass / fail rubric.

### Build 1 — Search Primitives Deep Dive

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Should) |
| **Why it's first** | Every later Build picks one of these primitives. A partner who can't articulate when to reach for `/find` vs `/ask` vs an agent ships the wrong shape of solution. |
| **What the partner does** | Builds a side-by-side comparison harness that issues the same query through `/find`, `/ask` (sync + streaming), `/search` (catalog), `/predict/chat`, and the Retrieval Agent endpoint against the same Knowledge Box. Documents the trade-off matrix: cost per call, latency p50/p95, citation density, structured-output support, conversational state. Publishes a primitive-selection flowchart partners can re-use across customer scoping conversations. |
| **Pass rubric** | (1) Comparison harness committed and runnable. (2) Trade-off matrix with measured numbers (not guessed). (3) Primitive-selection flowchart with at least 8 decision branches. (4) Live explanation of when to recommend each primitive for a given customer scenario. |
| **Asset delivered** | Primitive-comparison harness (TS / Python variants) + selection flowchart (markdown + diagram). Feeds every later Build's primitive choice. |

### Build 2 — Query Understanding & Rephrasing

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Why it matters** | ARAG's default rephraser improves recall but can fight a partner's vertical-specific terminology. Customers describe failures as *"the search doesn't understand us."* This Build teaches the partner to fix that with prompt engineering, not code rewrites. |
| **What the partner does** | A/B tests rephrasing on / off against a corpus that contains domain-specific jargon (legal, pharma, industrial, retail — partner picks one). Designs a custom rephraser prompt that preserves domain terms verbatim. Documents query archetypes (factoid, navigational, transactional, exploratory) and recommends a rephrasing strategy per archetype. Tests query expansion strategies (synonym expansion, acronym expansion, hyponym/hypernym expansion) and measures lift per archetype. |
| **Pass rubric** | (1) Rephrasing on/off A/B with measured results. (2) Custom rephraser prompt deployed and proven to preserve verbatim domain terms. (3) Query-archetype catalogue with at least 4 archetypes and per-archetype rephrasing recommendation. (4) Query-expansion experiment documented with lift numbers per archetype. (5) Live demo explaining the recommendation to a CTO-grade audience. |
| **Asset delivered** | Custom rephraser prompt template + query-archetype catalogue + expansion-experiment harness. |

### Build 3 — Filter Composition at Depth

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Why it matters** | Foundations Build 7 teaches single-axis filtering. Real customer scenarios stack three or four filter axes with AND / OR / NOT semantics — *"PDFs from the EMEA region, OR videos from any region, AND NOT marked confidential."* Getting this wrong silently returns wrong results; getting it right is one of the highest-leverage UX wins. |
| **What the partner does** | Builds a filter-composition test suite that exercises AND, OR, NOT, and nested groupings across content-type, label, region, time-range, and free-text filter axes. Documents the wire-format syntax for nested filter expressions in ARAG. Designs a UI pattern for filter discovery and removal (chips, breadcrumb, advanced-filter modal) that maps cleanly to the wire format. Implements at least one **computed filter** — a filter expression generated at query time from session state (e.g. "documents within the user's region"). |
| **Pass rubric** | (1) Test suite covering AND, OR, NOT, and at least one 3-level nested expression. (2) Filter-expression syntax documented. (3) UI pattern delivered as a reusable React component (or Vue / vanilla — partner's choice). (4) At least one computed filter implemented end-to-end. (5) Demo against a scenario the customer's existing search can't handle. |
| **Asset delivered** | Filter-composition test suite + nested-syntax cheat sheet + reusable filter-UI component. |

### Build 4 — Reranking Strategies

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Should), Deliver (Must) |
| **Why it matters** | First-pass retrieval is fast and broad. Reranking is slow and precise. The partner who can pick the right reranking strategy for a given latency budget wins the technical bake-off against a competitor who either reranks everything (and is slow) or reranks nothing (and is sloppy). |
| **What the partner does** | Compares three reranking configurations against the same baseline retrieval set: (a) no reranking, (b) ARAG's built-in reranker, (c) an external cross-encoder reranker (BGE, Cohere, etc.) wired in as a post-retrieval step. Measures latency p50/p95 and per-scenario success rate. Documents a reranking decision matrix: when to skip, when to use built-in, when to wire external. Implements adaptive reranking — top-k of the first pass gets the external reranker, the rest are returned raw. |
| **Pass rubric** | (1) A/B/C comparison committed with measured numbers. (2) Reranking decision matrix with at least three customer-scenario rows. (3) Adaptive-reranking implementation working. (4) Latency-vs-quality curve published. (5) Live explanation of when reranking is and isn't worth the cost. |
| **Asset delivered** | Reranking comparison harness + decision matrix + adaptive-reranking reference implementation. |

### Build 5 — Multi-Turn Conversational Retrieval

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Should) |
| **Why it matters** | Single-shot retrieval is solved. The unsolved problem is *"the customer asked a follow-up and the retrieval forgot the original entity."* Partners who treat each turn as independent miss the conversational win; partners who carry conversation state correctly land a Tier-3 differentiator. |
| **What the partner does** | Builds a multi-turn retrieval surface using ARAG's `chat` / conversational endpoints. Implements citation continuity — citations from turn 1 remain addressable in turn 3. Designs context-window management: when to summarise, when to drop, when to expand. Tests adversarial follow-ups (pronoun resolution, topic switch, clarification request). Documents a conversation-state schema partners can re-use across customer projects. |
| **Pass rubric** | (1) Multi-turn surface deployed against a real KB. (2) Citation continuity working — a turn-3 citation pointer refers correctly back to a turn-1 source. (3) Context-window management strategy documented and tested. (4) Adversarial follow-ups covered: pronoun resolution, topic switch, clarification. (5) Conversation-state schema published. |
| **Asset delivered** | Multi-turn reference implementation + context-management strategy doc + conversation-state schema. |

### Build 6 — Search Profiles & Per-Use-Case Tuning

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Should) |
| **Why it matters** | One KB usually serves multiple personas — internal staff need exhaustive results, customers need filtered curated results, executives need terse summarised results. Partners who ship one search configuration optimise for one persona at the cost of the others. Partners who ship **profiles** — distinct configurations selected by context — serve every persona. |
| **What the partner does** | Defines at least three search profiles against the same KB (e.g. "shopper", "trail-club-member", "internal-staff"). Each profile combines a distinct primitive choice, rephrasing config, filter defaults, reranking budget, and result-rendering template. Implements profile selection based on session context (logged-in user, active workspace, tenant tier). Tests profile switching without page reload. |
| **Pass rubric** | (1) Three search profiles defined and documented. (2) Profile selection logic implemented end-to-end. (3) Profile switching works without page reload. (4) Each profile has a measurable success metric distinct from the others (e.g. "shopper" optimised for conversion, "staff" for completeness). (5) Live demo showing the same query producing differently-shaped results per profile. |
| **Asset delivered** | Search-profile schema + profile-selection reference implementation + per-profile success-metric playbook. |

### Build 7 — Retrieval Agents 101

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Why it matters** | The Retrieval Agent endpoint is the highest-leverage primitive ARAG ships. Every Build prior to this one teaches a configuration; this Build teaches a *category*. Partners who don't internalise the agent loop default to over-engineered orchestration on top of `/ask` and lose to a competitor's two-line agent call. |
| **What the partner does** | Stands up a Retrieval Agent end-to-end against a real customer-shaped scenario. Writes the agent's natural-language brief (its "system prompt") with a structured output schema. Designs the agent's planning step (how it decomposes a question into sub-queries) and execution step (how it runs each sub-query and merges the results). Wires observability — every agent step is traced so the partner can show the customer *what the agent did*. Documents the agent's failure modes (loop, hallucination, sub-query that returns no results) and the recovery patterns for each. |
| **Pass rubric** | (1) Agent deployed and running against the partner's KB. (2) Natural-language brief + structured output schema both committed. (3) At least one agent step traced and visible in a logs panel. (4) Three failure modes documented with recovery patterns. (5) Side-by-side demo: same hard question through `/ask` and through the agent — explaining why the agent answer is materially better. |
| **Asset delivered** | Reference agent (brief + schema + execution harness) + observability instrumentation + failure-mode playbook. |

### Build 8 — Agent Decomposition, Tool Use & Cost Observability

| Field | Value |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Why it matters** | Build 7's agent is the simplest possible loop. Real customer scenarios need decomposition (multi-step plans), tool use (the agent calls external APIs), and explicit cost budgeting (the agent stops before the customer's tenant bill blows up). This Build is where the partner stops being an agent *user* and becomes an agent *designer*. |
| **What the partner does** | Extends the Build 7 agent with a planner step (the agent picks its own sub-queries based on the question shape, instead of running a fixed template). Adds at least one custom tool the agent can call — e.g. a date-range computation, an inventory lookup, a currency conversion. Wires a cost budget that terminates the agent loop when exceeded, with a graceful degradation back to single-shot `/ask`. Adds latency budgets per agent step. Publishes a tracing dashboard (or static report) showing the agent's actual cost and latency per scenario. |
| **Pass rubric** | (1) Planner step implemented — the agent picks its sub-queries. (2) At least one custom tool wired and called by the agent. (3) Cost budget terminates the loop cleanly with documented fallback behaviour. (4) Latency budget per step enforced. (5) Tracing dashboard showing actual numbers per scenario. (6) Live explanation of when an agent is worth the cost vs when a single-shot call is the right answer. |
| **Asset delivered** | Planner-driven agent reference + custom-tool wiring example + cost/latency-budget instrumentation + tracing dashboard. |

---

## 4. The four small capstones

Where the sibling course concludes with one large tuning engagement, this course concludes with **four small capstones** — each a 5–10 day deliverable against a distinct customer scenario shape. The partner picks any one as required for the cert; partners pursuing the cert plus deep specialism deliver all four.

### Capstone A — Multilingual Conversational Retrieval Agent

| Field | Value |
|---|---|
| **Customer shape** | A consumer-facing brand with a multilingual customer base (e.g. retail, hospitality, professional services). Customers ask follow-up questions across language switches. |
| **Deliverable** | A multi-turn conversational retrieval agent that answers in the language of the question, handles language switches mid-conversation, and preserves citation continuity across translations. |
| **Leverages** | Builds 2 (rephrasing), 5 (multi-turn), 7 (agents). |
| **Effort** | 5–7 days. |

### Capstone B — Cross-KB Federated Search

| Field | Value |
|---|---|
| **Customer shape** | An enterprise customer with multiple Knowledge Boxes (per business unit, per region, per security boundary). End-users want a single search experience that respects the boundaries. |
| **Deliverable** | A federated search surface that fans a single query out across N Knowledge Boxes in parallel, applies per-KB filtering (region / tier / classification), merges the results, and renders a unified answer with per-citation attribution to its source KB. |
| **Leverages** | Builds 1 (primitive choice), 3 (filter composition), 6 (search profiles). |
| **Effort** | 7–10 days. |

### Capstone C — Query-Decomposition Compliance Agent

| Field | Value |
|---|---|
| **Customer shape** | A regulated-industry customer (financial services, healthcare, energy, public sector). Compliance officers ask multi-part questions like *"is our process for X compliant with regulation Y in jurisdiction Z, given last quarter's amendment?"* — questions that cannot be answered by single-shot retrieval. |
| **Deliverable** | A retrieval agent that decomposes the compliance question into sub-questions, retrieves evidence per sub-question, evaluates each sub-question's answer against the source regulation, and synthesises a final compliance verdict with explicit per-clause citation. |
| **Leverages** | Builds 4 (reranking), 7 + 8 (agents, decomposition, observability). |
| **Effort** | 8–10 days. |

### Capstone D — Research Portal

| Field | Value |
|---|---|
| **Customer shape** | A research-driven organisation — investment firm, consulting firm, R&D team, policy think tank, journalism organisation, market-research firm, scientific research group. The analyst hour is consumed by reading and synthesising, not by the analytical work the firm actually pays the analyst for. |
| **Deliverable** | A research portal with a plan-execute-synthesise loop: analyst types a research question; agent decomposes into an editable plan; analyst edits the plan; portal runs each sub-question with adaptive reranking; portal synthesises a structured brief with section-by-section citations; analyst spawns follow-up threads from any claim; analyst exports the brief. Session model supports multiple briefs per session with a follow-up thread tree. |
| **Leverages** | Builds 3, 4, 5, 6, 7, 8 — **the deepest of the four, treats every Build as a sub-system**. |
| **Effort** | 8–10 days. |
| **Commercial framing** | The most commercially recognisable capstone — every customer it gets pitched to has either built an internal version (badly), bought a vendor version (and is annoyed), or is actively budgeted to do one of those within the year. |

---

## 5. Cert criteria

The AS&RA Specialist cert is awarded when an individual has:

1. **Passed all 8 Builds** — each Build's rubric green, evidence committed to the individual's partner workspace.
2. **Shipped at least one capstone (A, B, C, or D)** — the artefact deployed, the brief delivered, the pass rubric green.
3. **Completed the final assessment** — a 90-minute live walkthrough against a Progress Solution lead, defending the design choices in the chosen capstone.

A partner whose individual holds AS&RA can be listed as a *Search-Experience Design Specialist* in the partner programme directory and can quote against the corresponding service catalogue.

---

## 6. Reference reading (per Build)

Each Build's per-build README points at the relevant ARAG documentation and any widely-published research worth reading. Partners can find current literature on arxiv.org / Google Scholar under "retrieval-augmented generation," "agentic RAG," "query rewriting," "neural reranking," and "tool-using agents."

The reference reading is not gated — partners can read ahead before starting a Build.

---

## 7. Workspace conventions

Each Build folder has its own README + workspace. The convention mirrors the sibling course:

- `README.md` — the Build's at-a-glance, pass rubric, and asset specification (shipped).
- `walkthrough.md` — narrated implementation walkthrough (drafts land per Build over time).
- `harness/` — reference harness code (TS + Python variants where applicable).
- `slides/` — slide deck for the partner's own internal presentation.
- `verification.md` — reviewer checklist used by the Solution lead during pass-review.

The course-level `assets/` folder holds cross-Build reusable assets:

- **[`ask-parameter-reference.md`](assets/ask-parameter-reference.md)** — exhaustive parameter reference for `/ask`. Every parameter, header, response field, and worked example per Build. Read it cover-to-cover during Build 1, then return to it per parameter as you tune. Cross-linked from every Build's lesson.
- The primitive-selection flowchart (shipped from Build 1).
- The conversation-state schema (shipped from Build 5).
- The search-profile schema (shipped from Build 6).
- The agent-trace report template (shipped from Build 8).
- The research-session schema (shipped from Capstone D).

---

## 8. See also

- Umbrella programme: [`../../README.md`](../../README.md)
- Prerequisite course: [Developer Foundations](../developer-foundations/README.md)
- Sibling advanced course: [Advanced Extraction & Retrieval Strategies](../advanced-extraction-and-retrieval-strategies/README.md)
- Build 1: [Search Primitives Deep Dive](builds/build-1-search-primitives-deep-dive/)
- Capstone A: [Multilingual Conversational Retrieval Agent](capstones/capstone-a-multilingual-conversational-agent/)
