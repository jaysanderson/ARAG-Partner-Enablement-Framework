# Capstone D — Research Portal

> Part of [Advanced Search & Retrieval Agents — Capstones](../README.md).

> **Status:** Brief shipped. Reference implementation lands in subsequent passes.

## At a glance

| | |
|---|---|
| **Effort** | 8–10 days focused |
| **Builds leveraged** | 3 (filter composition), 4 (reranking), 5 (multi-turn), 6 (profiles), 7 (agents), 8 (decomposition + tools + observability) — **the deepest capstone in the course; treats every Build as a sub-system** |
| **Customer shape** | Research-driven organisations — investment firms, consulting firms, R&D teams, policy think tanks, journalism organisations, market-research firms, scientific research groups |
| **Failure being solved** | *"Our analysts spend 60–80% of their time reading and synthesising, not on the analytical work the firm actually pays them for."* |

## 1. Customer shape

The buyer is a research-driven organisation whose people produce written work — investment memos, consulting decks, policy papers, market reports, scientific reviews, editorial briefings. Their day-to-day pain is universal: the *reading-and-synthesising* layer of research is what consumes the analyst hour, not the actual analytical thinking. Existing search tools return documents one at a time; the analyst then opens 12 tabs, takes notes by hand, and writes the synthesis in Word.

The partner's deliverable replaces the *synthesis* layer with a deployed agent loop while leaving the analyst in control of the *analytical* layer. The portal does not write the analyst's opinion; it produces the structured evidence base the analyst opines on top of.

This is the most commercially recognisable capstone in the course — every customer the partner pitches this to has either built an internal version (badly), bought a vendor version (and is annoyed by it), or is actively budgeted to do one of those two within the year.

## 2. Deliverable

A deployed research portal that:

- Accepts an **open-ended research question** (e.g. *"What's the state of solid-state battery commercialisation in Asian markets as of last quarter, and which OEMs are leading on the time-to-production metric?"*).
- Generates a **research plan** — the agent's decomposition of the question into 4–8 sub-questions, surfaced as an editable list so the analyst can add / remove / reorder before execution.
- **Executes the plan** — each sub-question runs as an independent retrieval-with-reranking pass (Build 4 adaptive reranking is the default; the analyst can override to *"explore broad"* or *"verify deep"* via search profile (Build 6)).
- **Synthesises a structured brief** — a markdown document with section-per-sub-question, each section ending in a citation block. Every claim in the brief is anchored to a specific paragraph in a specific source.
- Maintains a **research session workspace** — multiple briefs per session, saved sources, a *"follow-up"* affordance on every claim that spawns a new sub-thread off that claim with the original context preserved (Build 5 multi-turn state).
- Supports **research provenance** — clicking any citation opens the source resource with the cited passage highlighted; clicking *"why this source?"* opens the agent's reasoning for including it (Build 7 + Build 8 observability).
- **Exports** the brief as markdown, PDF, or Word with citations rendered as footnotes + a bibliography section.

The portal is **not** a chat surface — it's a workspace. The analyst types a question, sees the plan, edits the plan, hits *Run*, reviews the brief, edits the brief, spawns follow-ups, and exports. The conversational pattern from Capstone A applies *inside* a single follow-up thread, but the portal's primary UX is plan-execute-synthesise, not chat.

## 3. Architecture

- **One Knowledge Box** by default (research corpus; the partner can also federate across two KBs using Capstone B's pattern if the customer's content is split — e.g. internal research + licensed external research feeds).
- **A Retrieval Agent** (Build 7) with:
  - A **planner step** (Build 8) that takes the research question + any prior session context and emits the structured 4–8 sub-question plan with metadata per sub-question (estimated retrieval cost, recommended search profile, expected source-type distribution).
  - An **execution step** that runs each sub-question with adaptive reranking (Build 4). Sub-questions execute in parallel where they're independent and sequentially where one feeds into the next (the planner annotates the dependency graph).
  - A **synthesis step** that takes the per-sub-question evidence and produces the markdown brief with section-by-section citations.
- **Two search profiles** (Build 6) selectable per sub-question:
  - *"Explore broad"* — high-recall retrieval, no external reranking, returns more candidates, optimised for early-stage exploration.
  - *"Verify deep"* — high-precision retrieval, external cross-encoder reranking on the top-K, optimised for fact-checking and citation hardening.
- **Filter composition** (Build 3) — source-type filters (peer-reviewed vs preprint vs trade press vs internal), date-range filters, region filters, language filters. Filters apply per sub-question, not globally.
- **A research-session state schema** (extends Build 5's conversation-state schema) — research sessions are first-class objects with multiple briefs, saved citations, a follow-up thread tree, and a per-session "thesis-so-far" working note.
- **Observability** (Build 8) — every step of every sub-question is traced. The analyst can click any claim in the brief and see the full retrieval + reranking + synthesis trace.
- **A custom export tool** (Build 8 tool-use pattern) — the brief-export tool takes the structured brief object and produces the markdown / PDF / Word artefacts with consistent citation formatting (Chicago, APA, Vancouver — customer-configurable).

## 4. Scope

### In scope (must ship)

- Plan-execute-synthesise loop with editable plan.
- At least 3 research scenarios tested end-to-end against a real KB.
- Per-section citation in every brief.
- Follow-up affordance from any claim, spawning a new sub-thread with context preserved.
- Research-session state model — at least 3 distinct briefs in one session, navigable.
- Export to markdown (PDF + Word are nice-to-have if the days allow).
- *"Explore broad"* / *"Verify deep"* search profiles working per sub-question.
- 20-minute customer demo rehearsed.
- Reskin playbook (how to swap the research vertical).

### Out of scope (explicitly)

- Inline writing assistance ("rewrite this paragraph" / "make this sharper"). The portal generates the evidence base; the analyst writes the opinion. The partner can position writing assistance as a paid follow-on.
- Real-time data feeds (live financial data, Bloomberg terminals, etc.). The portal works against ingested research content; live feeds are a separate ingestion engagement.
- Collaborative editing (real-time multi-analyst editing). One analyst per session for the capstone. Multi-analyst collaboration is a follow-on engagement.
- A built-in citation-style editor. The Chicago / APA / Vancouver formats are pre-defined; per-customer custom citation styles are a follow-on configuration project.
- Browser-extension capture ("clip this article into my session"). The portal consumes what's in the KB; partner-side ingest tooling is a separate engagement.

These are framed as out-of-scope deliberately because they're the natural upsell list — every one is a "yes, we can do that in a follow-on engagement" conversation the partner will have inside 90 days of shipping.

## 5. Demo script (20 min)

1. **Setup (1 min)** — research-portal homepage, analyst persona logged in, prior session sidebar showing two recent research sessions.
2. **New question** (2 min) — analyst types *"What's the state of solid-state battery commercialisation in Asian markets as of last quarter, and which OEMs are leading on time-to-production?"* Hits *Generate plan*.
3. **Plan review** (3 min) — agent emits 5 sub-questions: (1) what counts as commercialisation; (2) Asian-market activity by OEM in the last 4 quarters; (3) time-to-production benchmarks across the industry; (4) which OEMs publish data on time-to-production; (5) what's blocking the leaders. Analyst edits sub-question 2 to scope to "Q1–Q3 2025" instead of "the last 4 quarters", removes sub-question 4 (already covered by 2 and 3 combined), adds a new sub-question 6 about regulatory drivers in Korea and Japan. Hits *Run*.
4. **Execution traces** (3 min) — portal shows each sub-question executing with a per-sub-question status (planning / retrieving / reranking / synthesising). Analyst clicks into sub-question 3, sees the reranking scores and the rejected candidates. Switches sub-question 6's profile from *"Explore broad"* to *"Verify deep"* and re-runs just that sub-question.
5. **Brief review** (4 min) — portal renders the brief. Six sections (one per sub-question), each with a footnoted citation block. Analyst expands the citation block on sub-question 2; the cited passages are quoted inline with their source titles. Analyst clicks a footnote; the source resource opens with the cited paragraph highlighted.
6. **Follow-up** (3 min) — analyst clicks *"follow up on this claim"* on the *"BYD currently leads on time-to-production at 18 months"* sentence in section 3. New sub-thread opens with the source context preserved. Analyst types *"What's BYD doing operationally to compress that?"* Agent runs a fresh decomposition with the prior thesis preserved as context. Result lands as a new entry in the session.
7. **Export** (1 min) — analyst hits *Export → markdown*. The brief downloads with footnotes + bibliography.
8. **Architecture walk** (3 min) — partner shows the planner output, the per-sub-question profile selection, the synthesis step, the session schema.
9. **CTO + Head-of-Research Q&A** (2–3 min) — defence against *"how do we trust the synthesis?"* (answer: every claim is anchored; provenance is one click away) and *"how do we audit a research output?"* (answer: trace + session state).

## 6. Pass rubric

The Progress Solution lead reviews against:

1. Plan-execute-synthesise loop deployed end-to-end. Editing the plan and re-running works.
2. ≥ 3 distinct research scenarios completed end-to-end with measurable success (each brief has section-by-section citations, every section traces to ≥ 1 source).
3. Per-claim provenance visible — analyst can click any claim and reach the source paragraph in under 2 clicks.
4. Follow-up thread from a claim works; session state preserves the original brief context across the follow-up.
5. *"Explore broad"* / *"Verify deep"* profile switching demonstrated.
6. Research-session workspace handles ≥ 3 briefs per session, navigable.
7. Export to at least markdown works; brief renders cleanly outside the portal.
8. Demo delivered live in under 20 minutes.
9. Workspace deliverables (architecture, planner brief, profile schema, session schema, synthesis prompt, export tool, demo script, reskin playbook) all committed.

## 7. Effort breakdown

| Day | Activity |
|---|---|
| 1 | KB selection (or provisioning); research corpus structure; pick the vertical for the canonical demo (default: solid-state battery commercialisation across an industry-news corpus). |
| 2 | Planner step — research-question → 4–8 sub-questions schema + dependency graph. |
| 3 | Execution step — per-sub-question retrieval + adaptive reranking from Build 4, parallel where independent. |
| 4 | Synthesis step — per-sub-question evidence → structured brief with section-by-section citations. |
| 5 | Plan editing + re-run; *"Explore broad"* / *"Verify deep"* profile switching per sub-question. |
| 6 | Research-session state — multiple briefs per session, follow-up thread tree, "thesis-so-far" working note. |
| 7 | Export tool (markdown first; PDF + Word if time allows). |
| 8 | Provenance UI — click-to-source, click-to-reasoning, audit-trail surface. |
| 9 | Demo rehearsal + 3-scenario success measurement + reskin playbook drafting. |
| 10 (optional) | Polish + Solution-lead defence prep. |

## 8. Reskinning notes

The default capstone uses an industry-news + analyst-report corpus and demos against a solid-state-battery research question. To reskin to a customer's research vertical:

- **Swap the KB corpus** for the customer's actual research content (or a representative sample). Use the `progress-kb-use-case-generator` skill if the customer is in stealth + the partner needs a persona corpus.
- **Swap the planner's domain priors** — the planner currently knows that *"commercialisation"* in industry research decomposes into market activity / production benchmarks / regulatory drivers. For a pharma R&D customer, the planner's priors should reframe the decomposition around mechanism / clinical evidence / safety / regulatory pathway. The planner prompt has a *domain priors* slot.
- **Swap the source-type filter values** in the search-profile schema — peer-reviewed / preprint / trade press / internal becomes the customer's actual source taxonomy (e.g. *"sell-side report / 10-K / press release / management call"* for an equity-research customer).
- **Swap the citation-style export** — Chicago is the default; APA / Vancouver / customer-house-style are configurable.
- **Swap the demo scenarios** to research questions the customer's actual analysts have asked in the last month. (Critical for the customer's *"yes, this works on our questions"* moment.)
- **Swap the brand chrome** — the portal's chrome is themed; the underlying agent + session model + export tool do not change.

A complete reskin typically takes 3–4 days. The corpus ingestion + domain prior tuning are the slow steps; the rest of the portal is unchanged.

## 9. Commercial framing notes

A few notes on positioning that matter when the partner pitches this:

- **The portal is decision support, not the decision.** Frame this in the first 10 minutes of the customer conversation. The analyst writes the opinion. The portal produces the evidence. This framing keeps the conversation away from *"is the agent's synthesis ever wrong?"* (yes, sometimes) and toward *"does the analyst now have 4× more time for the analytical layer?"* (yes, demonstrably).
- **Compare to the in-house build, not the vendor tool.** The customer's natural reference is *"we could build this internally."* The partner's pitch is *"we can deliver this in 8–10 days against your own KB; in-house gets you to MVP in 6 months and then it's yours to maintain forever."* That maths almost always wins.
- **Pricing fits the recurring-revenue retainer pattern.** The portal is the implementation; the retainer is the *"keep tuning the planner's domain priors as the research vertical evolves."* Frame the retainer in the first conversation.

## Workspace

- `architecture.md` — KB, agent, session model, export.
- `planner-brief.md` — system prompt + structured output schema + domain-priors slot.
- `execution-harness/` — per-sub-question retrieval + reranking + parallel execution.
- `synthesis-prompt.md` — per-sub-question evidence → brief section prompt.
- `session-schema.md` — research-session state model.
- `profile-schema.md` — *"Explore broad"* / *"Verify deep"* config.
- `export-tool/` — markdown / PDF / Word renderer.
- `provenance-ui/` — click-to-source + click-to-reasoning components.
- `demo-script.md` — the 20-min script.
- `reskin-playbook.md` — vertical-swap guide.
- `commercial-framing.md` — the decision-support / vs-in-house / retainer talk-track.
- `verification.md` — reviewer checklist.

## See also

- Capstones overview: [`../README.md`](../README.md)
- Build 3: [Filter Composition at Depth](../../builds/build-3-filter-composition-at-depth/)
- Build 4: [Reranking Strategies](../../builds/build-4-reranking-strategies/)
- Build 5: [Multi-Turn Conversational Retrieval](../../builds/build-5-multi-turn-conversational-retrieval/)
- Build 6: [Search Profiles & Per-Use-Case Tuning](../../builds/build-6-search-profiles-and-per-use-case-tuning/)
- Build 7: [Retrieval Agents 101](../../builds/build-7-retrieval-agents-101/)
- Build 8: [Agent Decomposition, Tool Use & Cost Observability](../../builds/build-8-agent-decomposition-and-observability/)
