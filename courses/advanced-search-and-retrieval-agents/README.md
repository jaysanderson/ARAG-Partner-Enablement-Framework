# Course — Advanced Search & Retrieval Agents

> **Programme:** Progress Agentic RAG Partner Enablement Framework
> **Cert awarded:** Advanced Search & Retrieval Agents Specialist (abbrev. AS&RA Specialist)
> **Tracks served:** Solution (primary), Deliver (strongly recommended)
> **Prerequisites:** Developer Foundations Practitioner (current cert). The sibling course [Advanced Extraction & Retrieval Strategies](../advanced-extraction-and-retrieval-strategies/README.md) is a strong companion but not strictly required.
> **Duration:** 5–7 weeks part-time per individual; 3 weeks at full focus
> **Status:** Draft 1. See [§0 What's shipped vs what the partner produces](#0-whats-shipped-vs-what-the-partner-produces) for the explicit list of what exists in this repo today.
> **Companion docs:** [`../../README.md`](../../README.md) (umbrella), [`../developer-foundations/README.md`](../developer-foundations/README.md) (prerequisite course), [`../advanced-extraction-and-retrieval-strategies/README.md`](../advanced-extraction-and-retrieval-strategies/README.md) (sibling advanced course)

---

## 0. What's shipped vs what the partner produces

This course is **Draft 1**. Read this section before reading the rest of the README so the language about *"deliverables"* doesn't read as overpromise.

### What's shipped in this repository today

- **The teaching material.** Every Build has `README.md`, `1-lesson.md`, `2-walkthrough.md`, `3-quiz.md`, `video-script.md`. Every capstone has `README.md` with brief, architecture, demo script, pass rubric, effort breakdown, reskinning notes.
- **The course-level assets.** [`OVERVIEW.md`](OVERVIEW.md), [`final-exam.md`](final-exam.md), [`assets/ask-parameter-reference.md`](assets/ask-parameter-reference.md) (the exhaustive `/ask` reference) — these are the only files in `assets/` today.

### What the *partner* produces by working the course

Each Build's *"Asset delivered"* and *"Workspace"* sections describe artefacts the partner produces during the Build — `harness/`, `flowchart.md`, `trade-off-matrix.md`, `agent-brief.md`, the reusable filter UI component, the conversation-state schema implementation, the search-profile schemas, the tracing dashboard, etc. These are **outcomes of the Build**, not files pre-shipped in this repo. A partner working Build 1 produces `harness/` and `flowchart.md` *in their own workspace*; the partner then optionally contributes a sanitised copy back to the course-level `assets/` folder for the next partner to reference.

### What's planned but not yet shipped

- **A reference harness for Build 1** (`assets/reference-primitive-harness/`) — a committed, tested harness skeleton with cost-accounting + last-byte streaming latency + agent-token-counting wired correctly out of the box. *Not in the repo today.* Without it, every partner produces a slightly different harness, which puts the *"measured, not guessed"* matrix's credibility on whichever partner's harness gets it right. **Recommended next pass for course owners:** land this harness.
- **A reference primitive-selection flowchart, conversation-state schema, search-profile schema, and agent-trace template** in `assets/`. These are described in the per-Build deliverables; partners are currently expected to author the canonical version themselves and copy back. *Not pre-shipped.*
- **Capstone reference implementations.** Each capstone ships a brief; none currently ships running code. Listed as *"Brief shipped. Reference implementation lands in subsequent passes."*
- **Per-build `walkthrough.md` (different from `2-walkthrough.md`), `harness/`, `slides/`, `verification.md`** that appear in some per-Build *Workspace* sections — these are partner-produced workspace conventions, not pre-shipped repo files. A partner cloning the repo will not find these inside the Build folders.

### Numbers in this course are illustrative

All cost figures (e.g. *"agents are 5–50× the cost of `/ask`"*, *"$0.18 median per agent call"*) and latency figures (p50 / p95 bands) in lessons, walkthroughs, quizzes, and the final exam are **illustrative of shape**, not benchmarks. They depend on tenant tier, generative-model choice, query scenario, and reranker config. Every Build instructs the partner to measure their own — the figures we cite are example points to anchor the conceptual conversation. **Do not quote them to a customer.**

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

1. **Passed all 8 Build quizzes** — 4/5 or better, open-book.
2. **Shipped artefacts for all 8 Builds** — every Build's *"Asset delivered"* section produced and committed to the individual's partner workspace. Build artefacts (not the MC quiz) are the primary evidence of competence; the quizzes screen for *"have you internalised the concept,"* and the artefacts screen for *"can you actually do the work."*
3. **Shipped at least one capstone (A, B, C, or D)** — the artefact deployed against a real (sandbox or customer) KB, the deliverables in the capstone's pass rubric all green, the demo script rehearsed.
4. **Passed the final exam** — 16/20 or better on the closed-book exam at [`final-exam.md`](final-exam.md).
5. **Passed the artefact review** — a Progress Solution lead reviews the Build artefacts and the capstone artefact against a rubric (see [`assets/artefact-review-rubric.md`](assets/artefact-review-rubric.md) — *planned; partners and Solution leads currently use the per-Build "Pass rubric self-check" sections as the rubric until this canonical doc lands*). This is the bar that catches *"the partner copy-pasted a harness that produces wrong numbers"* before the live defence wastes everyone's time.
6. **Completed the live defence** — a 90-minute live walkthrough against a Progress Solution lead, defending the design choices in the chosen capstone. The defence is the conversation; the artefacts are the evidence.

A partner whose individual holds AS&RA can be listed as a *Search-Experience Design Specialist* in the partner programme directory and can quote against the corresponding service catalogue.

### Why artefact review is the strongest gate

The build artefacts (harness, flowchart, schema, agent runner, tracing dashboard) are the *real outputs* of the course. Multiple-choice quizzes test conceptual recall; artefact review tests delivery. A partner who passes every quiz but ships a harness with the bugs from Build 1 Step 2d ("Bugs that make your numbers lie") will produce a misleading matrix the moment they sit with a customer. Catching that at artefact review is cheap; catching it after the customer engagement starts is expensive. Solution leads should give artefact review at least as much weight as the live defence.

---

## 6. Reference reading (per Build)

Each Build's per-build README points at the relevant ARAG documentation and any widely-published research worth reading. Partners can find current literature on arxiv.org / Google Scholar under "retrieval-augmented generation," "agentic RAG," "query rewriting," "neural reranking," and "tool-using agents."

The reference reading is not gated — partners can read ahead before starting a Build.

---

## 7. Workspace conventions

### What's shipped in each Build folder

| File | Shipped? | Purpose |
|---|---|---|
| `README.md` | ✅ | At-a-glance, pass rubric, asset specification. |
| `1-lesson.md` | ✅ | Conceptual lesson (read-time ~12–18 min). |
| `2-walkthrough.md` | ✅ | Step-by-step implementation guide. |
| `3-quiz.md` | ✅ | 5 MC, open-book, pass 4/5. |
| `video-script.md` | ✅ | Voiceover + on-screen markers for the screen-recording version. |

### What the partner produces in their own workspace per Build

The walkthrough instructs the partner to commit these *outside the course repo*, in their own workspace folder — typically `~/partner-workspace/{tenant}/build-N-{slug}/`:

- `harness/` — the partner's measurement harness or reference implementation.
- `slides/` — the partner's own internal presentation, if they choose to make one.
- `verification.md` — the partner's reviewer checklist used by the Solution lead during pass review.
- Per-Build deliverable files named in each Build's *"Asset delivered"* section (e.g. `trade-off-matrix.md`, `flowchart.md`, `agent-brief.md`).

A partner cloning this course repo will *not* find these files inside the Build folders — they're outcomes the partner produces by working the Build.

### Course-level `assets/` folder

| File | Shipped? | Status |
|---|---|---|
| **[`ask-parameter-reference.md`](assets/ask-parameter-reference.md)** | ✅ | Exhaustive `/ask` parameter reference (~980 lines). Cross-linked from every Build's lesson. |
| Reference primitive-comparison harness | ❌ planned | A committed, tested harness skeleton with cost accounting + last-byte streaming latency + agent-token counting wired correctly. Without this, every partner produces a slightly different harness and the *"measured, not guessed"* matrix's credibility rides on whichever partner gets it right. **Priority next pass.** |
| Reference primitive-selection flowchart | ❌ planned | Will land once 3+ partners have produced a Build-1 flowchart we can merge. |
| Reference conversation-state schema | ❌ planned | Same pattern — partner-produced first, canonicalised on a later pass. |
| Reference search-profile schema | ❌ planned | Same pattern. |
| Reference agent-trace template | ❌ planned | Same pattern. |
| Reference research-session schema (Capstone D) | ❌ planned | Same pattern. |

**The right way to read the per-Build *"Asset delivered"* sections:** these describe what the partner produces by working the Build. They are not pre-shipped files. The course owner's next pass should land at least the reference harness, since that's the one whose absence puts measurement credibility on the partner.

---

## 8. See also

- Umbrella programme: [`../../README.md`](../../README.md)
- Prerequisite course: [Developer Foundations](../developer-foundations/README.md)
- Sibling advanced course: [Advanced Extraction & Retrieval Strategies](../advanced-extraction-and-retrieval-strategies/README.md)
- Build 1: [Search Primitives Deep Dive](builds/build-1-search-primitives-deep-dive/)
- Capstone A: [Multilingual Conversational Retrieval Agent](capstones/capstone-a-multilingual-conversational-agent/)
