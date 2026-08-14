# Build 02 — Prompts & Generative Answers

> Part of [Search Configuration & Widget Deployment](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Capability** | Tour the Generative Answer tab's generation half — prompts (system/user/rephrase), `generate_answer` debugging, `generativeModel`, `reasoning`, token limits, `preferMarkdown`, `askSpecificResource` — and save a tuned setup as a named search configuration |
| **Tier mapped to** | Tier 1–2 |
| **Prerequisite** | [Build 01 — Tuning the Search Strategy](../build-01-tuning-the-search-strategy/) |
| **Estimated effort** | 1.5 hours focused |

## Start here

1. **[lesson.md](1-lesson.md)** — prompt structure and the `rephrase`-toggle-vs-`rephrase`-prompt distinction, `generate_answer` as a debugging tool, `generativeModel`, `reasoning`, token limits, `preferMarkdown`, `askSpecificResource`/`specificResourceSlug`, a brief `useImages` mention, `usePrompt`/`useSystemPrompt`.
2. **[walkthrough.md](2-walkthrough.md)** — write a shopping-assistant system prompt, test `generate_answer:false`, compare `reasoning` effort levels on a multi-step question, set a token limit, save the result as a named search configuration.
3. **[quiz.md](3-quiz.md)** — 5 multiple-choice.

## What you can do after this Build

- Set a system/user/rephrase prompt at configuration level or per-call, and explain precisely how `prompt.rephrase` (a prompt template) differs from Build 01's `rephrase: true` (a boolean toggle).
- Use `generate_answer: false` to isolate a retrieval problem from a generation problem before touching a prompt — the first move on any "the answer is wrong" ticket.
- Explain the `generativeModel` gotcha: switching models changes latency, cost, and style, and can require retuning a prompt or RAG strategy built for a different model.
- Set `reasoning.effort` and `reasoning.budget_tokens` appropriately for a question's actual complexity, instead of defaulting every call to maximum reasoning.
- Cap per-call spend with `limitTokenConsumption`, `tokenConsumptionLimit`, and `outputTokenConsumptionLimit`.
- Know when `preferMarkdown` helps (a Markdown-aware surface) versus when it makes an answer look worse (a plain-text surface).
- Scope generation to a single resource with `askSpecificResource`/`specificResourceSlug` for a "chat with this document" experience.
- Toggle `usePrompt`/`useSystemPrompt` off without deleting a saved prompt.
- Know that `answer_json_schema` (Foundations Build 5) and `rag_strategies` (this course's Build 03) are separate, deeper topics this Build deliberately doesn't cover.

## See also

- Parent: [Search Configuration & Widget Deployment](../../README.md)
- Previous: [Build 01 — Tuning the Search Strategy](../build-01-tuning-the-search-strategy/)
- Next: [Build 03 — RAG Context Strategies](../build-03-rag-context-strategies/)
