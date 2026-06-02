# Course — Developer Foundations

> **Programme:** Progress Agentic RAG Partner Enablement Framework
> **Cert awarded:** Developer Foundations Practitioner
> **Tracks served:** Solution (primary), Deliver (primary), Sell (secondary — Builds 0–5 only)
> **Prerequisites:** None. This is the on-ramp.
> **Total time:** 25–40 hours per individual, spread over 4–8 weeks
> **Format:** 13 short Builds covering the platform's full breadth + 1 capstone
> **Status:** Shipped (curriculum, rubrics, video scripts). Per-build assets still on the backlog — see `assets/README.md`.

---

## 1. What this course is

Developer Foundations is the **panoramic tour** of Progress Agentic RAG. By the end of it, you can:

- Describe every ARAG primitive and what it returns.
- Recognise which primitive solves which customer problem.
- Direct an AI coding assistant ("vibe code") to build any of the patterns you've seen.
- Verify the output is correct and tier the customer engagement appropriately.
- Plan and ship the Build 13 capstone — a multi-tier ARAG application that closes Fortune 500 deals.

This course is intentionally **breadth-first, not depth-first**. Each Build introduces one capability area, gives you the API surface, shows you what to ask an AI for, and walks you through verifying the output. The Advanced course (`../advanced-extraction-and-retrieval-strategies/`) is where partners go deep on retrieval quality, evaluation, and tuning.

## 2. The vibe-coding mental model

Partners **don't hand-write the code** in this course. You direct AI coding assistants — Claude Code, Cursor, GitHub Copilot, ChatGPT — to build the components for you. Your job is:

1. **Knowing what to ask** — recognising which primitive solves the problem.
2. **Knowing the API surface** — being able to brief the AI on the endpoint, body shape, and expected response.
3. **Verifying the output** — opening the AI's code, running it, confirming the responses look right, catching obvious bugs.
4. **Composing** — chaining primitives together to solve customer problems that no single primitive solves.

A partner who's completed Developer Foundations can sit a customer's PM next to them and, in 90 minutes, vibe-code a working ARAG demo against the customer's content. That's the bar.

Read [`vibe-coding-guide.md`](vibe-coding-guide.md) before starting Build 0 — it covers tool selection, prompt patterns, verification habits, and the failure modes to watch for.

## 3. Course progression

Each Build ships with five files, numbered in the order a student follows them:

- `README.md` — at-a-glance + start-here pointers
- `1-lesson.md` — concept + API + value (read this first)
- `2-walkthrough.md` — the vibe-coded exercise (1–3 hours of work)
- `3-quiz.md` — 5 multiple-choice (pass = 4/5)
- `video-script.md` — production-ready talk track + shot list for the video version of the lesson

The video version of each lesson is the canonical learning surface — most partners watch the video, do the walkthrough, then take the quiz. The markdown lesson is the searchable transcript.

| # | Title | Capability | Effort | Tier | Video |
|---|---|---|---|---|---|
| **0** | [Hello ARAG](builds/build-00-hello-arag/) | Provision a KB, make first calls, set up vibe-coding | 2–3 hrs | Tier 1 | 12 min |
| **1** | [The Five Primitives](builds/build-01-five-primitives/) | Tour of `/find`, `/ask`, `/ask`+schema, `/graph`, `/resource` | 2 hrs | Tier 1 | 15 min |
| **2** | [Drop-in Widgets](builds/build-02-drop-in-widgets/) | Branded `<nuclia-search-bar>`, `<nuclia-chat>` on a real site | 1.5 hrs | Tier 1 | 8 min |
| **3** | [Conversational Surfaces](builds/build-03-conversational-surfaces/) | Vibe-coded chat UI with two prompt modes (prospect / member) | 3 hrs | Tier 2 | 12 min |
| **4** | [Multilingual & Voice Switching](builds/build-04-multilingual-and-voice/) | Query prefixes for language, persona, resource scoping | 1.5 hrs | Tier 2 | 8 min |
| **5** | [Structured Outputs](builds/build-05-structured-outputs/) | `answer_json_schema` workflows: FAQ, taxonomy, comparison | 3 hrs | Tier 3 | 12 min |
| **6** | [Data-Augmentation Agents](builds/build-06-data-augmentation-agents/) | Generator, Labeller, Graph agents — the three ingest-time enrichment patterns | 2 hrs | Tier 4 prep | 10 min |
| **7** | [Smart Filters & Labelsets](builds/build-07-smart-filters/) | Content-type + label-based filtering UI (powered by Build 6's labeller) | 2 hrs | Tier 1–2 | 8 min |
| **8** | [Knowledge Graph 101](builds/build-08-knowledge-graph/) | Typed graph navigation (powered by Build 6's graph agent) | 3 hrs | Tier 4 | 12 min |
| **9** | [Field Engineering](builds/build-09-field-engineering/) | Custom fields (`callToAction`, `searchResultDisplay`) drive AI behaviour | 2 hrs | Tier 2–3 | 10 min |
| **10** | [Composite RAG](builds/build-10-composite-rag/) | Chain calls; retry-on-low-confidence flow | 2.5 hrs | Tier 3–4 | 10 min |
| **11** | [Production Readiness](builds/build-11-production-readiness/) | Residency, BYO-LLM, rate limits, observability — CTO conversations | 2 hrs | Tier 4 | 10 min |
| **12** | [Capstone Prep](builds/build-12-capstone-prep/) | Plan and prompt the capstone vibe-code session | 2 hrs | All | 15 min |
| **— Final exam —** | [final-exam.md](final-exam.md) | 20 MC, open-book, pass = 16/20 (80%) | 30 min | — | — |
| **13** | [The Capstone](builds/build-13-capstone/) | Ship a wow build: [Atlas Operations](builds/build-13-capstone/atlas-operations/) (Enterprise) or [Aurora Concierge](builds/build-13-capstone/aurora-concierge/) (CX) | 4–8 wks | All | — |

Total course effort: ~27–42 hours of focused work for Builds 0–12, plus the 4–8 week capstone.

## 4. Learning outcomes

A Developer Foundations Practitioner can, without supervision:

- Name and explain the five ARAG primitives + the three ARAG endpoints (`/find`, `/ask`, `/graph`).
- Provision a KB, ingest content, configure labelsets.
- Vibe-code a working multi-surface chat UI in under 90 minutes.
- Design and ship an `answer_json_schema` workflow against a customer's KB.
- Recognise a graph-shaped problem and scope a typed knowledge graph schema.
- Apply field engineering to drive AI behaviour through content edits, not code deploys.
- Discuss EU/USA residency, BYO-LLM across Azure / Vertex / Bedrock, and the 2400 req/min rate limit in a customer CTO meeting.
- Plan a capstone build: pick the variant, scope the corpus, write the vibe-coding prompts, and run a 25-minute end-to-end demo.

## 5. Assessment flow

| Stage | Format | Pass criterion |
|---|---|---|
| Per-Build quiz (×13) | 5 MC | 4/5 MC |
| Walkthrough deliverable (×13) | Prompt log + working code | Self-verification |
| Final exam | 20 MC | 16/20 (80%) |
| Capstone (Build 13) | 25-minute end-to-end demo (live or recorded) | Progress-led review board |
| Honesty | All deliverables must be the partner's own work | Audit on demand |

Pass everything → **Developer Foundations Practitioner** cert (12-month validity).

## 6. Track-specific stack

- **Solution-Foundations** = Developer Foundations Practitioner. Required for the Solution-1+ cert tier in the umbrella framework.
- **Deliver-Foundations** = Developer Foundations Practitioner.
- **Sell-Foundations** = Builds 0–5 walkthroughs + the Sales Foundations course (planned). Builds 6–12 are Aware-level for Sell.

A partner organisation cannot reach Authorized tier without at least one Developer Foundations Practitioner on staff.

## 7. What comes next

After Developer Foundations Practitioner, the natural next course is [Advanced Extraction & Retrieval Strategies](../advanced-extraction-and-retrieval-strategies/README.md), which goes deep on retrieval quality measurement, chunking, hybrid retrieval tuning, custom labelsets/classifiers at depth, multimodal extraction, and production-grade tuning engagements. It awards the **AE&RS Specialist** cert and is the prerequisite for Solution-Specialist and Deliver-Specialist sub-tiers.

Other planned courses: Sales Foundations, Solution Architecture Mastery, Production Operations & SLOs.
