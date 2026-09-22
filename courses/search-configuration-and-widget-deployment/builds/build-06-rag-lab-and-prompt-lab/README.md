# Build 06 — RAG Lab & Prompt Lab

> Part of [Search Configuration & Widget Deployment](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Capability** | Use the dashboard's integrated RAG Lab / Prompt Lab to compare models, prompts, and RAG strategies side by side against real queries, then commit the winner as a named search configuration |
| **Tier mapped to** | Tier 2–3 |
| **Prerequisite** | [Build 05 — Result Display & User Intent Routing](../build-05-result-display-and-intent-routing/) |
| **Estimated effort** | 1.5 hours focused |

## Start here

1. **[lesson.md](1-lesson.md)** — what RAG Lab and Prompt Lab are, why comparison-before-commit matters, and the lab-to-production pattern this Build closes with.
2. **[walkthrough.md](2-walkthrough.md)** — run a fixed set of test queries against two or three prompt/model/`rag_strategies` combinations in the lab, pick a winner, commit it as a named search configuration.
3. **[quiz.md](3-quiz.md)** — 5 multiple-choice.

## What you can do after this Build

- Explain what RAG Lab and Prompt Lab actually are: one integrated lab area under the dashboard's Advanced section, with a Prompt Lab tab and a RAG Lab tab, not two separate destinations.
- Design a fixed set of test queries that actually reveal differences between configurations, instead of eyeballing a single happy-path question.
- Compare model choice, prompt wording, and `rag_strategies` side by side against the same queries, and read the qualitative differences that matter — grounding quality, citation count, tone, whether a strategy-dependent answer resolves correctly.
- Explain why nothing compared in the lab is new configuration surface — every lever is something from Builds 01–05, and the lab's value is comparison, not new parameters.
- Take a winning combination out of the lab and commit it explicitly as a named `search_configuration` (Build 00's pattern), instead of leaving a tuned setup stranded in a lab session nobody else can see.

## See also

- Parent: [Search Configuration & Widget Deployment](../../README.md)
- Previous: [Build 05 — Result Display & User Intent Routing](../build-05-result-display-and-intent-routing/)
- Next: [Build 07 — Widget Configuration](../build-07-widget-configuration/)
