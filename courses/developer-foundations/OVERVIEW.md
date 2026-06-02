# Developer Foundations — Course Overview

> A plain-English guide for the developer thinking about taking this course, and the partner manager thinking about enrolling their team. The full course structure is in [`README.md`](README.md); this page answers the *should I do this?* question.

## What this course actually is

Developer Foundations is the on-ramp course for partners building on Progress Agentic RAG (ARAG). Thirteen short builds plus a capstone — roughly 25 to 40 hours of focused work across four to eight weeks — and at the end you can stand in front of a customer's CTO and ship a working multi-surface ARAG application that exercises every tier of the platform.

You won't hand-write much code. The course is built around **vibe coding** — directing AI coding assistants (Claude Code, Cursor, Copilot, ChatGPT) to write the implementations for you. Your job in each build is to know what to ask for, brief the AI on the right API surface, and verify what comes back. By the end you'll have run that loop forty or fifty times against real ARAG endpoints, and it'll feel as natural as reading a code-review diff.

The thing the course is really teaching is **fluency**. Not "I built a thing once." More like: a customer's product manager describes their content problem; you recognise within thirty seconds which ARAG primitive solves it; ninety minutes later there's a working demo against their actual corpus, with citations the customer can click and verify. That's what makes you valuable in the room.

## Who this is for

**Individual contributors building on ARAG.** If your job involves shipping ARAG into a customer engagement — solution engineering, integration work, AI engineering, product engineering, technical pre-sales — this is the foundation course. You should be comfortable in a terminal, comfortable reading TypeScript or JavaScript, comfortable using an AI coding assistant. You do not need prior ARAG experience; Build 0 starts from zero.

**Solution architects and SE leads.** Even if you're past the level of writing the code yourself, this course gives you the muscle memory to direct your own team through builds and to recognise when a vibe-coded output is actually broken versus actually fine. SE leads also pick up the customer-meeting language for Tier 3 and Tier 4 conversations — the structured-outputs pitch, the knowledge-graph pitch, the residency pitch — in their canonical form.

**Developers from a partner organisation aiming for a certification tier.** A partner org cannot reach Authorized tier without at least one Developer Foundations Practitioner on staff. Specialist tiers require people who've also completed the Advanced Extraction & Retrieval Strategies course, but Foundations is the prerequisite.

**Curious technical people who want to evaluate ARAG.** The course works as a credible evaluation pathway too. You don't have to be inside a partner org. If you're trying to figure out whether ARAG is right for your problem, the first five builds will tell you more than any sales call.

## Who this is *not* for

It's worth being explicit. This course is not for:

- **Pure marketing or sales roles.** Sales people get a different course (Sales Foundations) covering the qualification, pricing, and competitive moves. Builds 0–5 of this course are Aware-level for Sell-track partners, not Must-level.
- **Non-technical product or program managers.** You can read the lessons and absorb the vocabulary, but the builds assume you can run a command line and read code. If that's not you, the framework's [Part III capability ladder](../../README.md) is a better starting point.
- **People who want a slide-deck overview.** This course is 70% hands-on building. If you want to absorb the platform via reading instead of doing, the framework README is the right doc; the course is the wrong place.

## What you'll be able to do at the end

These are the concrete claims. None of them are "you'll be familiar with X" — every line is something you'll have actually done by the time you finish:

- Provision a Knowledge Box, ingest a corpus, configure labelsets, and verify the ingest is healthy.
- Make every API call in the ARAG surface area (`/find`, `/ask`, `/ask` with `answer_json_schema`, `/graph`, `/resource`) and read every response field correctly.
- Vibe-code a working multi-surface chat UI — branded, multilingual, two-voice (prospect vs member) — in under ninety minutes.
- Design and ship a schema-constrained workflow (FAQ generator, taxonomy generator, comparison-table generator) against any customer corpus.
- Recognise the customer signals that point to a Generator agent versus a Labeller agent versus a Graph agent, and explain the trade-offs.
- Walk a customer's CTO through residency (EU or USA, per Knowledge Box), BYO-LLM (Azure / Vertex / Bedrock), rate-limit behaviour (default 2400 req/min), and observability — without checking your notes.
- Plan and ship the Build 13 capstone — a 25-minute end-to-end demo combining all four tiers of the capability ladder against a single Knowledge Box.

That last one is the bar. The capstone is the deliverable a partner walks into a Fortune 500 buyer's meeting with.

## What the experience is like, day to day

Each build follows the same rhythm so the cognitive load stays predictable:

1. **Read or watch the lesson.** Ten to fifteen minutes of conceptual setup. What does this primitive return? What customer problem does it solve? What's the API surface? Each lesson has both a written version and a recorded video — pick whichever works for you. The video is the canonical surface; the markdown is the searchable transcript.

2. **Work the walkthrough.** One to three hours of hands-on building. You'll provision things in the Nuclia dashboard, run curl commands against your Knowledge Box, brief an AI coding assistant to build a component, run it, verify the output, fix anything broken. Every walkthrough ends with a working artefact you save to your local project folder.

3. **Take the quiz.** Five multiple-choice questions, open-book, four out of five to pass. The quiz exists to catch genuinely-missed concepts before you build on top of them in the next Build, not to be an obstacle. If you fail, re-read the relevant lesson section and re-sit.

4. **Move on.** No reviewer queue, no waiting for sign-off. The course is self-paced.

Three things make this different from a typical online course:

**The AI does the writing.** You're not retyping examples — you're learning to direct the AI to produce the same shape of code, then verifying it works. By Build 5 you'll have written maybe two hundred lines of code yourself and a few thousand lines via vibe-coding. The skill being trained is *direction and verification*, not memorisation of syntax.

**Every build runs against a real Knowledge Box.** Not a mocked sandbox, not a video of someone else's terminal. You provision your own Knowledge Box in Build 0, ingest the provided ten-document corpus, and every subsequent build runs against that same KB. By Build 8 the same KB has labelsets, custom fields, a graph extraction agent, and demonstrates every pattern the course teaches.

**The capstone is real-shaped.** Build 13 isn't a toy. It's eight weeks for one strong full-stack engineer (four weeks at two FTE) to ship a multi-surface application that exercises every tier of the platform. The reference implementations — Atlas Operations (enterprise) and Aurora Concierge (CX/retail) — are real GitHub repos that score 100% against the brief once provisioned against a populated KB. Partners fork these and re-skin them per customer; the chassis is reused, the corpus and entity schema change.

## Time and effort, honestly

Twenty-five to forty hours of focused work, spread over four to eight weeks. That's Builds 0 through 12 plus the final exam. Most learners come in at the lower end if they have prior platform-API experience and pick up the upper end if they're still learning the vibe-coding loop.

The capstone is a separate four to eight weeks on top of that, depending on whether you're working solo or with a teammate. Most partner organisations treat the capstone as a project in its own right — it's the asset that goes into the room with a Fortune 500 buyer, so it gets project-quality treatment.

If you can dedicate roughly an evening every other day (90–120 minutes per session), you'll finish the pre-capstone material in about four weeks. Slower-pace learners take eight to ten weeks. Faster learners with prior ARAG familiarity have completed the pre-capstone material in two weeks of focused work.

## What it costs

For Progress partner organisations: nothing additional. The course is included in your partner programme. Your Nuclia sandbox credentials are provided as part of partner onboarding; every build runs against that sandbox at no incremental cost.

For non-partner technical evaluators: you'll need a Nuclia account to do the builds. The free tier covers Builds 0 through 5; from Build 6 onward (data-augmentation agents, graph extraction, the capstone) you'll either need to be inside a partner org or convert to a paid plan. The lesson reading and video watching are free regardless.

## Frequently asked questions

**Can I skip ahead if I already know some of this?**

You can but the course is structured so each Build assumes the one before. Build 6's data-augmentation agents enrich the corpus you ingested in Build 0; Build 8's graph navigation uses the typed graph that Build 6's graph agent extracts; Build 10's composite-RAG flow chains the patterns from Builds 1, 5, and 7. If you skip Build 6 and try to do Build 8, you'll be working against an empty graph. The safer play is to skim the lessons of the builds you think you know, do the walkthrough at speed, take the quiz, and move on if you pass.

**What if I get stuck on a walkthrough?**

Each walkthrough ends with a "getting unstuck" section listing the common failure modes for that build, with specific fixes. Beyond that, the partner Slack channel (`#build-clinic-submissions` — name varies per partner cohort) is the support venue. For genuinely novel problems, paste the error and your AI assistant's confused response into Slack; a Progress SE or a fellow partner will respond.

**Do I need to record videos of myself doing the walkthroughs?**

No. There used to be a recording requirement per build; that's gone. The only recording moment in the course is the Build 13 capstone, and even there it's optional — the review board accepts a live demo or a recording, whichever the partner prefers.

**What if the final exam is harder than the per-build quizzes?**

It isn't. The final exam is twenty multiple-choice questions drawn from the same concept space as the thirteen per-build quizzes. If you passed the quizzes as you went, the exam will feel like a recap, not an escalation. Pass mark is sixteen out of twenty.

**What do I get when I finish?**

The Developer Foundations Practitioner certification, valid for twelve months. The certification unlocks access to the Advanced course (Advanced Extraction & Retrieval Strategies) and is the prerequisite for Solution-Specialist and Deliver-Specialist sub-tier roles inside the framework. Your partner organisation's commercial tier also lifts when it has Practitioner-certified people on staff — see the [framework README](../../README.md) for the tier ladder details.

**Is there an instructor or a cohort, or am I on my own?**

Self-paced by default. Some partner organisations run their teams through it as a cohort with weekly check-ins and a shared Slack channel — that works well and tends to finish faster than fully solo learners — but it's not required. Office hours with Progress SEs are available; the schedule is in the partner Slack.

**What if I start and don't finish?**

No penalty. The course is designed to be picked up and put down. Your progress through the builds is tracked locally (the artefacts you build — the `.env`, the `scratch.sh`, the `ask.mjs`, the `prompt-log.md` files — are your evidence of how far you've got). If you come back six months later, you re-orient on whichever Build you stopped at and continue.

**Can I take this course if my partner org hasn't onboarded yet?**

Builds 0 through 5 work against any free-tier Nuclia account, so yes — you can self-start while your org's partner paperwork is in flight. From Build 6 onward you'll want partner-tier credentials. Talk to your partner manager.

## For partner managers and SE leads

The decision you're making is who to send and when. Here's the honest framing:

**Send anyone who'll touch a customer ARAG engagement.** The course pays for itself the first time one of your engineers prevents a six-week-to-eight-week scope overrun because they recognised early that a problem was schema-constrained generation, not free-form chat. That's a Tier-3 conversation, not a chatbot conversation, and the difference is roughly $150K of revenue per engagement.

**Cohort it where possible.** Running three to five engineers through the course as a cohort cuts elapsed time by roughly 40% versus solo. Weekly thirty-minute syncs where each person walks the others through one thing they just shipped is enough; you don't need formal teaching.

**Don't outsource the capstone.** The pre-capstone material can be learned on the side of a normal job. The capstone is where the asset gets built — Atlas Operations or Aurora Concierge, customised to your customer base. Treat it as a real project: dedicated owner, four to eight weeks of calendar time, Progress SE on call. The capstone is the partner-marketing asset that goes into every subsequent sales meeting; cutting corners here wastes the whole investment that came before.

**Expect time-to-first-deal of three to six months.** A partner organisation with no prior ARAG experience that runs three engineers through Foundations and ships one capstone typically closes its first ARAG deal in month four or five after starting. Partners who skip the curriculum and try to bootstrap with marketing collateral close their first deal in month eight or never.

The framework's [Part II competency model](../../README.md) lists the named competencies this course covers and at what depth (Aware / Should / Must). If you're trying to plan headcount and certification across Sell / Solution / Deliver tracks, that's the right structural view.

## Ready to start

If you're an individual learner: open [`README.md`](README.md) for the build-by-build structure, then go to [Build 0 — Hello ARAG](builds/build-00-hello-arag/) and read the lesson. The walkthrough begins after that.

If you're a partner manager planning a team cohort: talk to your Progress partner manager about provisioning sandbox credentials for everyone in the cohort, then set up a shared Slack channel for the group and a weekly thirty-minute sync. Send the team the link to [Build 0](builds/build-00-hello-arag/) with a calendar invite for Build 0 day-one kickoff.

If you're evaluating ARAG before committing: start with the [framework README](../../README.md) for the commercial and architectural framing, then do Builds 0–3 of this course. Three builds — roughly seven hours of work — is enough to know whether ARAG fits your problem.

The course is shipped and ready. Start whenever you're ready to start.
