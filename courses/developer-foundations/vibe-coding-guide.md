# Vibe-Coding Guide for Developer Foundations

> Read this **before** starting Build 0. It's the mental model that makes the rest of the course work.

## What "vibe coding" means in this course

Vibe coding is **delegating code generation to an AI assistant** while you stay in control of:

- **Intent** — what you're trying to build, and why.
- **Architecture** — which ARAG primitive solves the problem.
- **API contract** — the endpoint, body shape, expected response.
- **Verification** — running the code, reading the output, catching obvious bugs.
- **Iteration** — refining the prompt when the first output isn't right.

The AI writes the code. **You direct it, verify it, ship it.** This is how every customer engagement you run going forward will work — partners who try to hand-write production ARAG integrations against a deadline lose to partners who direct AI tools well.

## Why we teach this way

ARAG itself is a platform that abstracts the hard parts of RAG (retrieval, generation, citation extraction, graph extraction) behind an API. Vibe coding is the same abstraction one level up: the *code* that calls the API is also commodity, also abstracted, also generated for you. What's left is **judgment** — which primitive, which schema, which prompt, which verification.

This course is structured around the judgment, not the keystrokes.

## Recommended tooling

Pick one or more. The Builds work with all of them.

| Tool | Best for | Notes |
|---|---|---|
| **Claude Code** | Full-project tasks, multi-file edits, terminal commands | Strongest at multi-step engineering tasks. Recommended for the capstone. |
| **Cursor** | In-editor code generation, inline edits, fast iteration | Best when you already have a project open. |
| **GitHub Copilot** | Inline completions while you type | Use alongside one of the above for autocomplete. |
| **ChatGPT / Claude.ai (web)** | Schema design, API troubleshooting, debugging | Use the web app when you want to discuss design before generating code. |

For the Builds you can use any combination. The walkthroughs assume you have at least one project-aware assistant (Claude Code or Cursor) for code generation, plus a web chat for ad-hoc questions.

## The four-step vibe-coding pattern

Every walkthrough in this course follows the same shape:

### 1. Brief the AI

Open your AI assistant. Give it a brief that includes:

- **Goal** — one sentence on what you're building.
- **Context** — your ARAG environment (region, KB ID, that you'll provide credentials via env vars).
- **Endpoint(s) you want to use** — explicit reference to `/find`, `/ask`, `/graph`, etc.
- **Body shape you expect** — list the parameters that matter (`prefer_markdown: true`, `rephrase: true`, custom prompt structure, etc.).
- **Verification path** — how you'll check it works.

Example brief for Build 0:

> Build me a Node.js script `ask.mjs` that hits the Progress Agentic RAG `/ask` endpoint in streaming mode. The script reads `NUCLIA_API_URL`, `NUCLIA_KB_ID`, and `NUCLIA_API_KEY` from `.env`. It takes a query as a CLI argument, sends it with `prefer_markdown: true` and `rephrase: true`, parses the NDJSON stream (objects shaped `{item: {type: 'answer'|'retrieval'|'status', ...}}`), and prints the answer text as it streams. At the end, print the citation list. Auth via `X-NUCLIA-SERVICEACCOUNT: Bearer <key>` header.

The AI will produce code. It might get something wrong on the first pass — that's expected.

### 2. Verify the output

Read the code before running it. Ask:

- Does it use the right endpoint URL pattern (`{NUCLIA_API_URL}/kb/{kbId}/ask`)?
- Does it pass the auth header correctly?
- Does it parse the NDJSON shape we described?
- Does it handle the streaming response without buffering the whole thing first?

Then run it against your sandbox. Confirm:

- The answer streams (not a single blob).
- Citations appear at the end.
- The exit code is 0.

If anything's wrong, go to step 3.

### 3. Iterate

Tell the AI what you saw. Be specific:

> The script ran but only printed the answer after the whole stream finished. I want each token printed as it arrives. The NDJSON parser is buffering — fix it to flush each complete `{item:...}` object as it's parsed.

The AI will fix and explain. Iterate until the output matches your expected behaviour.

### 4. Commit the prompt + code

Every walkthrough asks you to save your prompt log alongside the code. This isn't bureaucracy — your prompt is the artefact that lets you (or another partner SE) regenerate the code later. The code is disposable; the prompt is institutional knowledge.

## Failure modes to watch for

These are the four ways AI assistants go wrong on ARAG tasks. Catch them every time.

### 1. The AI fabricates an SDK that doesn't exist

ARAG is accessed via plain HTTPS. There's no "nuclia-sdk" npm package the AI should be importing. If the AI generates `import { Nuclia } from 'nuclia'`, stop. Tell it to use `fetch` against the documented endpoints.

### 2. The AI sets the wrong auth header

The header is `X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>`. Not `Authorization`. Not `X-API-Key`. If you see anything else, fix it.

### 3. The AI assumes the wrong response shape

`/find` returns `{ resources: {...}, best_matches: [...] }`. `/ask` (streaming) returns NDJSON of `{item: {type, ...}}`. `/ask` (sync, with `x-synchronous: true`) returns `{answer, retrieval_results, ...}`. If the AI's parsing logic looks unfamiliar, double-check against the actual response. Don't trust the AI's memory of API shapes — verify against `curl` output first.

### 4. The AI forgets `additionalProperties: false`

When generating `answer_json_schema` workflows (Build 5), the AI almost always forgets the strict-mode requirement. Every `object` schema needs `additionalProperties: false` at every nesting level. We cover the helper in Build 5.

## What's not vibe-codeable

Some things you do yourself, by hand:

- **Provisioning the KB** — Nuclia dashboard, 5 minutes.
- **Ingesting documents** — drag-and-drop in the dashboard.
- **Configuring labelsets** — dashboard UI.
- **Picking the BYO-LLM endpoint** — dashboard config.
- **Authoring schema designs** — you write the JSON Schema; the AI implements it.
- **Authoring entity/relation graph schemas** — you sketch it on paper; the AI generates the extraction-agent config.
- **Authoring `callToAction` and `searchResultDisplay` field copy** — the content team writes these (with AI help, but the brand voice is theirs).

The distinction matters: the *structure* of ARAG is yours to design. The *code* that talks to it is the AI's to generate.

## Verification habits (build these from Build 0)

- Always test endpoints with `curl` first, before asking the AI to wrap them in code.
- Always read the AI's code before running it.
- Always check the response in the Nuclia dashboard alongside the code output.
- Always save the prompt that produced the working code.
- Always record a 60-second video walkthrough of your final result.

## What about production code?

The walkthroughs produce **demo-grade** code — enough to verify behaviour and submit for review. Production code (the capstone, customer engagements) requires additional concerns: auth proxying through your backend, observability, error handling, rate-limit-aware clients, BYO-LLM routing. All covered in Build 11 (Production Readiness).

Vibe-coded demo code can be *productionised* by asking the AI to "add error handling, retry logic, and structured logging." But don't put demo-grade code in front of a customer without that polish step.

## TL;DR

You are the architect. The AI is the engineer. Your job is judgment and verification; theirs is keystrokes. Stay in control.

Now go to [Build 0](builds/build-0-hello-arag/).
