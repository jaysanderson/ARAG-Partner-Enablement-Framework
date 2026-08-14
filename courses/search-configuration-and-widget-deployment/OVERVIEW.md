# Search Configuration & Widget Deployment — Course Overview

> A plain-English guide for the partner thinking about taking this course, and the partner manager thinking about enrolling their team. The full course structure is in [`README.md`](README.md); this page answers the *should I do this?* question.

## What this course actually is

Developer Foundations Build 0 gets you a working `/find`/`/ask` call. Build 2 gets you a widget on a page. Neither one tells you what to do when a customer says "the answers are too generic," "can it match our brand," or "how do we actually put this live without exposing our API key." This course is the answer to those three questions, covered exhaustively: nine short builds plus a capstone, roughly 15 to 19 hours of focused work across two to four weeks.

It is deliberately narrow. Where Foundations tours the whole platform breadth-first, this course goes deep on exactly two things — the configuration surface (Search, Generative Answer & RAG Strategies, Result Display, User Intent Routing) and widget deployment (styling, proxy, live config sync). If Foundations taught you to recognise which primitive solves a problem, this course teaches you to make that primitive actually good, and then to ship it.

## Who this is for

**Partners who've finished Developer Foundations Builds 0–2.** That's the hard prerequisite — this course assumes you can already make a `/find`/`/ask` call and have pasted a widget snippet into a page once. If you haven't done those builds yet, start there; this course picks up exactly where Build 2 leaves off.

**Solution engineers who keep hearing "the demo answers are generic."** That complaint almost always traces back to unconfigured `rag_strategies` or a default search profile that was never tuned for the customer's content. Builds 01–06 are the fix.

**Anyone who owns a customer's move from demo to production.** Build 08 is the one build in this course that isn't dashboard-only — it's the proxy backend that keeps a service-account key off the client, and the Synchronized configuration behaviour partners need to explain to a customer's engineering team before go-live.

## Who this is *not* for

- **Partners who haven't done Developer Foundations Build 0–2.** This course does not re-teach `/find` vs `/ask` or the widget basics — Build 00 is a 15-minute pointer back to Foundations, not a rehash.
- **Partners looking for retrieval-quality measurement or chunking strategy.** That's [Advanced Extraction & Retrieval Strategies](../advanced-extraction-and-retrieval-strategies/README.md). This course teaches you to *set* the configuration options; it doesn't teach you to measure precision/recall against a golden query set.
- **Partners looking for multi-turn retrieval agents or query-rephrasing A/B testing at depth.** That's [Advanced Search & Retrieval Agents](../advanced-search-and-retrieval-agents/README.md), which this course's Build 01, 03, and 06 point forward to.

## What you'll be able to do at the end

Concrete claims, not "familiarity":

- Set every option in the Search tab and the Generative Answer & RAG Strategies tab, by both UI and raw API call, and state the gotcha for each one from memory.
- Choose the correct `rag_strategies` entry for a given context problem — including `field_extension` for structured multi-field resources and `graph_beta` for entity-relationship questions — and demonstrate why the wrong choice fails.
- Configure `rag_images_strategies` against a real multi-page PDF and show a citation resolving to an embedded image, not just text.
- Ship a named `search_configuration` and explain why it's the production pattern instead of hand-carrying parameters on every `/find`/`/ask` call.
- Run a side-by-side RAG Lab / Prompt Lab comparison and commit the winning configuration to production.
- Tour a customer through every widget option from memory and predict what each one changes about the end-user experience.
- Deploy the same widget three ways — local no-proxy quick test, production behind a proxy, and prove that a dashboard edit propagates live to the already-deployed widget via Synchronized configuration.

## What the experience is like, day to day

Same rhythm as Developer Foundations:

1. **Read the lesson.** Most lessons here run 10–15 minutes; Build 00 is a 5-minute read.
2. **Work the walkthrough.** Mostly dashboard time — Search tab, Generative Answer tab, RAG Lab, widget configurator — with curl calls to see the API-equivalent of what you just clicked. Build 08 is the exception: you'll stand up a small proxy backend.
3. **Take the quiz.** Five multiple-choice, open-book, four out of five to pass.
4. **Move on.** Self-paced, no reviewer queue.

**Almost everything runs against your existing Foundations Knowledge Box.** You don't re-provision anything — the same KB you ingested in Foundations Build 0 carries through this whole course, now with three supplemental corpus additions (spec-sheet PDFs, entity-relation field notes, a paired-field warranty resource) used in Builds 03 and 04.

## Time and effort, honestly

Fifteen to nineteen hours, spread over two to four weeks. Faster than Foundations because it's one subject, not thirteen. The capstone adds one to two weeks on top — shorter than the Foundations capstone because the deliverable is narrower: prove the widget deploys both ways and prove config sync, not build a multi-tier application from scratch.

## What it costs

Same as Developer Foundations: included in the partner programme for Progress partner organisations, running against the same sandbox credentials. Non-partner technical evaluators need a Progress Agentic RAG account; Builds 00–02 and 07 work on the free tier, RAG Lab / Prompt Lab and the proxy build in Build 08 may require a paid or partner-tier account depending on your plan.

## Frequently asked questions

**Do I really need Foundations Build 0–2 first, or can I skip ahead?**

You need them. Build 00 of this course spends one paragraph on `/find` vs `/ask` and assumes you already know it. If you try to start here cold, Build 01's Search tab options won't have anywhere to attach — you need a live Knowledge Box with the Foundations sample corpus already ingested.

**Is this course required for certification?**

It's not a hard prerequisite for Foundations Practitioner, but it's the expected pairing for the Solution-Specialist and Deliver-Specialist sub-tiers alongside the Advanced courses — see [README.md §6](README.md#6-track-specific-stack).

**What's the difference between this course's capstone and the Foundations capstone?**

Narrower and shorter. The Foundations capstone (Atlas Operations or Aurora Concierge) is an eight-week multi-tier application build. This course's capstone is one to two weeks: deploy the Aurora Outfitters widget without a proxy, deploy it again behind a proxy, and prove a dashboard configuration change reaches the already-embedded widget live. Same corpus, much narrower deliverable.

**What if I get stuck?**

Every walkthrough ends with a "Getting unstuck" section covering that build's common failure modes. Beyond that, the partner Slack channel used for Foundations build-clinic submissions covers this course too.

## For partner managers and SE leads

Send this course to anyone who's finished Foundations Build 0–2 and is about to sit in a room where a customer asks "why are the answers generic" or "how do we go live." Those two questions show up in nearly every Tier 2+ engagement, and this course is the direct answer to both — it typically closes the gap between "we have a demo" and "we have something the customer's engineering team will sign off on."

## Ready to start

Confirm you've completed [Developer Foundations](../developer-foundations/README.md) Builds 0–2, then open [`README.md`](README.md) for the build-by-build structure and go to [Build 00](builds/build-00-named-search-configurations/).
