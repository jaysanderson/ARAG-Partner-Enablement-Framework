# Overview — Advanced Search & Retrieval Agents

*A one-page version of the full course README for partner managers and prospective enrollees who want the shape, not the depth.*

> **Heads-up before reading the lessons.** All cost and latency figures quoted in the course (*"$0.18 median per agent call"*, *"5–50× the cost of /ask"*, *"p95 of 28 s"*, etc.) are **illustrative of shape, not benchmarks**. They depend on tenant tier, generative-model choice, query scenario, and reranker configuration. The Build 1 deliverable is a measurement harness the partner runs against their own tenant; what's quoted in lessons is example data that anchors the conceptual conversation. **Do not quote these to a customer.** See the course README's [§0 What's shipped vs what the partner produces](README.md#0-whats-shipped-vs-what-the-partner-produces) for the full caveat.

---

## What this course makes a partner

A **Search-Experience Design Specialist** — the named individual a customer wants in the room when they say *"the search needs to feel smarter than what we've built before."*

## What it teaches

Eight competencies plus three small capstones. The competencies are all **configuration-grade levers** that don't require touching the retrieval engine itself; the capstones are **customer-shaped deliverables** that exercise the levers in combination.

### The eight Builds

| # | Build | What the partner walks away with |
|---|---|---|
| 1 | Search Primitives Deep Dive | A trade-off matrix across `/find`, `/ask`, `/search`, `/predict/chat`, and the Retrieval Agent endpoint — measured, not guessed. |
| 2 | Query Understanding & Rephrasing | A custom rephraser prompt that preserves vertical-specific terminology + a query-archetype catalogue. |
| 3 | Filter Composition at Depth | A reusable filter-UI component that handles AND / OR / NOT / nested filter expressions cleanly. |
| 4 | Reranking Strategies | An adaptive-reranking reference implementation + decision matrix for when reranking is worth its cost. |
| 5 | Multi-Turn Conversational Retrieval | A conversational surface with citation continuity across turns + a published conversation-state schema. |
| 6 | Search Profiles & Per-Use-Case Tuning | Three search profiles against one KB, switchable by session context, each with its own success metric. |
| 7 | Retrieval Agents 101 | A deployed Retrieval Agent with traced execution + failure-mode playbook. |
| 8 | Agent Decomposition, Tool Use & Cost Observability | A planner-driven agent with custom tools, cost budget, latency budget, and a tracing dashboard. |

### The four small capstones (pick one for the cert)

- **A · Multilingual Conversational Retrieval Agent** — 5–7 days. Combines Builds 2, 5, 7.
- **B · Cross-KB Federated Search** — 7–10 days. Combines Builds 1, 3, 6.
- **C · Query-Decomposition Compliance Agent** — 8–10 days. Combines Builds 4, 7, 8.
- **D · Research Portal** — 8–10 days. Combines Builds 3, 4, 5, 6, 7, 8 (the deepest). The most commercially recognisable — every research-driven org wants one.

A partner pursuing the deep specialism delivers all four.

---

## How it differs from the sibling advanced course

| | Advanced Extraction & Retrieval Strategies | **This course** |
|---|---|---|
| Asks | *Is retrieval as good as it can be?* | *Is the search experience as smart as it can be?* |
| Primary track | Deliver | Solution |
| Capstone shape | One large tuning engagement | Four small customer-shaped capstones |
| Commercial framing | *"We make your existing search better"* | *"We design the search your existing platform can't"* |

A partner can hold one cert or both.

---

## Duration and prerequisites

- **Prereq:** Developer Foundations Practitioner cert. The sibling advanced course is a strong companion but not strictly required.
- **Duration:** 5–7 weeks part-time per individual; 3 weeks at full focus.
- **Cert criteria:** 8/8 Build quizzes passed + 8/8 Build artefacts produced + 1/4 capstones shipped + final exam at 16/20 or above + artefact review with a Progress Solution lead + 90-minute live defence. See the course README §5 for the full breakdown — the artefact review is the *primary* gate; the quizzes and exam screen for concept recall, the artefacts screen for delivery.
- **A small calendar note.** Sandbox dates in the lessons (compliance amendments, ambassador field reports, sustainability reports) reference 2027–2028. They're fictional sandbox scenarios timed to feel current at writing — read them as illustrative, not as a calendar reference for your own timeline.

---

## See also

- Full course README: [`README.md`](README.md)
- Build 1 entry point: [`builds/build-1-search-primitives-deep-dive/`](builds/build-1-search-primitives-deep-dive/)
- Capstone briefs: [`capstones/`](capstones/)
- Sibling advanced course: [`../advanced-extraction-and-retrieval-strategies/`](../advanced-extraction-and-retrieval-strategies/)
