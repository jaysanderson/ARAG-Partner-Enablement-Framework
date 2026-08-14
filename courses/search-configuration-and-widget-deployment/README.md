# Course — Search Configuration & Widget Deployment

> **Programme:** Progress Agentic RAG Partner Enablement Framework
> **Cert awarded:** Search Configuration & Widget Deployment Practitioner
> **Tracks served:** Solution (primary), Deliver (primary), Sell (secondary — Builds 00–02 and 07–08 only)
> **Prerequisites:** [Developer Foundations](../developer-foundations/README.md) Builds 0–2 (`/find`/`/ask` basics, the five primitives, drop-in widgets)
> **Total time:** 15–19 hours per individual, spread over 2–4 weeks
> **Format:** 10 short Builds + 1 capstone
> **Status:** Shipped (curriculum, corpus, rubrics)

---

## 1. What this course is

Developer Foundations gets a partner from zero to a working demo. This course is what happens after the demo works and the customer asks "can we tune this?" and "how do we actually ship it?" — the two questions Foundations Build 0 and Build 2 deliberately leave for later.

By the end of this course, you can:

- Explain and set every option across ARAG's four dashboard configuration groups — Search, Generative Answer & RAG Strategies, Result Display, and User Intent Routing — through both the UI and the raw API, and know the gotcha for each one.
- Explain the difference between `/find` and `/ask`, and ship a **named search configuration** as the production pattern instead of hand-carrying parameters on every call.
- Use RAG Lab and Prompt Lab to compare models, prompts, and RAG strategies side by side before anything touches production.
- Tour every widget configuration option and predict how it changes the end-user experience before you touch the dashboard.
- Deploy a widget three ways: a local no-proxy quick test, a production proxy setup, and a live Synchronized configuration that updates an already-embedded widget without a redeploy.

This course is **narrow and deep**, the opposite of Foundations' breadth-first tour. One subject — configuration and deployment — covered exhaustively.

## 2. The configuration-first mental model

Most of this course happens in the ARAG dashboard, not in an editor. Foundations trained you to direct an AI coding assistant; this course trains you to direct the **dashboard's configuration surface** — Search tab, Generative Answer tab, RAG Lab, the widget configurator — and to know exactly what each control does to the underlying API call before you touch it.

The one build that returns to vibe-coding is Build 08 (Widget Deployment), where you stand up a minimal proxy backend so a service-account key never reaches the browser. Everywhere else, the job is: change a dashboard option, read the API-equivalent request it produces, and predict the effect on retrieval or generation before you click.

## 3. Course progression

Each Build ships with four files, numbered in the order a student follows them:

- `README.md` — at-a-glance + start-here pointers
- `1-lesson.md` — concept + API + value (read this first)
- `2-walkthrough.md` — the hands-on exercise
- `3-quiz.md` — 5 multiple-choice (pass = 4/5)

| # | Title | Capability | Effort | Tier |
|---|---|---|---|---|
| **00** | [Named Search Configurations](builds/build-00-named-search-configurations/) | `/find` vs `/ask` orientation + stored `search_configurations` as the production pattern | 15 min | Tier 1 |
| **01** | [Tuning the Search Strategy](builds/build-01-tuning-the-search-strategy/) | Search tab: features, filters, rank fusion, reranking, rephrase, `query_prepend` | 2 hrs | Tier 1 |
| **02** | [Prompts & Generative Answers](builds/build-02-prompts-and-generative-answers/) | Generative Answer tab core: prompts, model choice, reasoning, token limits | 1.5 hrs | Tier 1–2 |
| **03** | [RAG Context Strategies](builds/build-03-rag-context-strategies/) | `rag_strategies`: hierarchy, neighbouring paragraphs, field extension, metadata extension, prequeries, graph | 2.5 hrs | Tier 3–4 |
| **04** | [Visual RAG & Images](builds/build-04-visual-rag-and-images/) | `rag_images_strategies`: page image, paragraph image | 2 hrs | Tier 3–4 |
| **05** | [Result Display & User Intent Routing](builds/build-05-result-display-and-intent-routing/) | Result Display config + routing queries to different search configs by intent | 2 hrs | Tier 2 |
| **06** | [RAG Lab & Prompt Lab](builds/build-06-rag-lab-and-prompt-lab/) | Compare models/prompts/strategies pre-production, commit the winner | 1.5 hrs | Tier 2–3 |
| **07** | [Widget Configuration](builds/build-07-widget-configuration/) | Full widget option tour across all four Web Components | 1.5 hrs | Tier 1 |
| **08** | [Widget Deployment](builds/build-08-widget-deployment/) | CSS styling, no-proxy quick test, production proxy, Synchronized configuration | 2.5 hrs | Tier 1 & 4 |
| **— Final exam —** | [final-exam.md](final-exam.md) | 20 MC, open-book, pass = 16/20 (80%) | 30 min | — |
| **09** | [Capstone](builds/build-09-capstone/) | Deploy the widget with and without proxy; prove live config sync works | 1–2 wks | All |

Total course effort: ~15–19 hours of focused work for Builds 00–08, plus 1–2 weeks for the capstone.

## 4. Learning outcomes

A Search Configuration & Widget Deployment Practitioner can, without supervision:

- Set every Search tab option (`features`, `filter_expression`, `rank_fusion`, reranking, `rephrase`, `query_prepend`, `autofilter`) and explain what each one changes about retrieval.
- Set every Generative Answer option (system/user/rephrase prompt, `generativeModel`, `reasoning`, token limits, `preferMarkdown`) and use `generate_answer:false` to debug retrieval independent of generation.
- Pick the right `rag_strategies` entry (`full_resource`, `hierarchy`, `neighbouring_paragraphs`, `field_extension`, `metadata_extension`, `prequeries`, `graph_beta`) for a given context-construction problem, and explain why the wrong one either bloats the context or misses the answer.
- Use `rag_images_strategies` (`page_image`, `paragraph_image`) correctly for documents where the answer lives in a diagram or photo, not the surrounding text.
- Configure Result Display for two different audiences from the same Knowledge Box, and set up basic User Intent Routing between two named search configurations.
- Run a side-by-side comparison in RAG Lab / Prompt Lab and commit the winner as a named, production-referenced `search_configuration`.
- Tour a customer through every widget configuration option from memory, and predict the resulting end-user experience before opening the dashboard.
- Deploy a widget three ways — local no-proxy quick test, production proxy, and a live-synced dashboard configuration — and explain why the JWT never belongs in client-side code past a sandbox demo.

## 5. Assessment flow

| Stage | Format | Pass criterion |
|---|---|---|
| Per-Build quiz (×9, Builds 00–08) | 5 MC | 4/5 MC |
| Walkthrough deliverable (×9) | Prompt log + working config/deploy | Self-verification |
| Final exam | 20 MC | 16/20 (80%) |
| Capstone (Build 09) | Live widget deploy, with and without proxy, proven config sync | Progress-led review board |
| Honesty | All deliverables must be the partner's own work | Audit on demand |

Pass everything → **Search Configuration & Widget Deployment Practitioner** cert (12-month validity).

## 6. Track-specific stack

- **Solution-Specialist track** — this course plus [Advanced Search & Retrieval Agents](../advanced-search-and-retrieval-agents/README.md) is the expected pairing for partners who own search-quality conversations.
- **Deliver-Specialist track** — required for partners who own widget deployment and production hand-off, alongside Foundations Build 11 (Production Readiness).
- **Sell track** — Builds 00–02 and 07–08 are Should-level for Sell; the rest is Aware-level. A sales engineer who can tour the widget configurator and explain named search configurations covers the Tier 1–2 customer conversation.

## 7. What comes next

Builds 01, 03, and 06 of this course each stop short of the depth [Advanced Search & Retrieval Agents](../advanced-search-and-retrieval-agents/README.md) goes to — that course covers reranking strategy comparison, multi-turn retrieval, filter composition at depth, and named search profiles for per-use-case tuning at scale. [Advanced Extraction & Retrieval Strategies](../advanced-extraction-and-retrieval-strategies/README.md) is the pairing for partners who need retrieval-quality measurement and chunking strategy underneath the configuration this course teaches.
