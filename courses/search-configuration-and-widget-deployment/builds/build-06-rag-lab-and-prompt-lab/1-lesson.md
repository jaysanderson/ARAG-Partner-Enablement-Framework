# Build 06 — Lesson: RAG Lab & Prompt Lab

> Read time: 10 minutes.

## Why this is in the course

By now you can set every lever that shapes a `/find` or `/ask` call: search features and filters (Build 01), prompts, model choice, and reasoning effort (Build 02), `rag_strategies` (Build 03), `rag_images_strategies` (Build 04), and Result Display (Build 05). Every one of those levers can be changed and saved without anyone confirming the change actually made the answer better. Shipping a new prompt or a new `generativeModel` straight to a customer-facing widget on a hunch is how "the answers are too generic" turns into "the answers changed and now they're wrong in a different way." This Build is the checkpoint between tuning and shipping: compare candidates side by side against real queries, then commit only the one that won.

**This Build introduces no new configuration surface.** Nothing here is a new parameter. Everything you compare in the lab is a combination of settings you already know from Builds 01–05 — the lab's job is letting you see two or three of those combinations answer the same question at the same time, not teaching you a new lever.

## What RAG Lab and Prompt Lab actually are

Read the product changelog carefully and one thing becomes clear: **RAG Lab and Prompt Lab are not two separate destinations.** The RAG Lab was integrated into the existing Prompt Lab, so the dashboard exposes one lab area with two tabs you switch between — a **Prompt Lab** tab and a **RAG Lab** tab — living together under the dashboard's **Advanced** section for a Knowledge Box.

Put plainly, the lab "allows users to experiment with prompt configurations and RAG strategies for a Knowledge Box before applying them to production. It enables testing of different LLMs, prompts, and search settings side by side." That's the whole scope:

- **Prompt Lab tab** — test different prompts against all the supported LLMs and see how they behave, without changing anything live.
- **RAG Lab tab** — layer in RAG strategy comparisons (from Build 03/04's `rag_strategies` and `rag_images_strategies`) alongside the prompt and model choice you're already testing.

You're not choosing between "use RAG Lab" or "use Prompt Lab" for a given task — you open the lab, and move between its two tabs depending on whether you're isolating a prompt/model question or a context-assembly question.

## Why it exists: compare before you commit

Every earlier Build in this course changed one lever at a time, tested it, and moved on. That's fine for learning what a lever does in isolation. It's a poor way to decide what to actually ship, for two reasons:

1. **Levers interact.** A prompt that reads well against the platform-default `generativeModel` can read completely differently once you switch models (Build 02's gotcha) or once a `rag_strategies` entry changes what context the model even sees. You don't know until you test the *combination*.
2. **A single test query lies.** One question that happens to work doesn't tell you whether the combination holds up against the spread of things real users actually type. The walkthrough has you build a small fixed set of test queries for exactly this reason — run every candidate combination against the same queries, not a different one each time.

The lab exists so that comparison happens in a sandbox, against real retrieval and real generation, before a configuration change reaches a live widget.

## Everything you're comparing is from Builds 01–05

When you sit down in the lab, the dials you're turning are all familiar:

- **Search behaviour** (Build 01) — features, filters, rank fusion, reranking — determines what candidates even reach generation.
- **Prompts and model** (Build 02) — `prompt.system` / `prompt.user`, `generativeModel`, `reasoning.effort` — determines tone, length, and how well the model reasons over what it's given.
- **`rag_strategies`** (Build 03) — hierarchy, neighbouring paragraphs, field extension, and the rest — determines what context actually gets assembled before the prompt ever runs.
- **`rag_images_strategies`** (Build 04) — page image, paragraph image — relevant when the test corpus includes documents where the answer lives in a diagram or photo.
- **Result Display** (Build 05) — shapes what the end user sees once an answer comes back, though the lab's comparison is mostly about the answer itself, not its display wrapper.

If a lever isn't on this list, it isn't something the lab tests — it's either something the widget configurator handles (Build 07) or a deployment concern (Build 08).

> **Gotcha.** The lab tests retrieval and generation quality. It does not test widget rendering, filter UI, or deployment behaviour — don't go looking for RAG Lab controls that belong to later Builds.

## The lab-to-production pattern

A tested configuration in the lab is only useful once it reaches production traffic. The dashboard has a real capability to apply a tested configuration to a Knowledge Box — but the exact click-path for that varies by tenant version, and this course won't guess at a specific button label for you to hunt for.

What's certain, and what every other Build in this course has already trained you to do, is the underlying pattern: once you've picked a winning combination in the lab, take its exact parameters — prompt, model, `rag_strategies`, whatever else you compared — and commit them explicitly via the API as a named `search_configuration`, following [Build 00](../build-00-named-search-configurations/)'s pattern:

```bash
curl -s -X POST "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/search_configurations/shopper_lab_winner" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "kind": "ask",
    "config": {
      "prompt": {"system": "You are Aurora Outfitters'\'' shopping assistant. Answer concisely and cite your sources."},
      "generativeModel": "chatgpt-azure-4o",
      "rag_strategies": [{"name": "field_extension"}]
    }
  }'
```

Whatever the dashboard's own "apply" affordance does under the hood, it is doing the no-code equivalent of this exact call — writing the winning parameters into a stored, named configuration that production traffic can reference by name. Committing it yourself, explicitly, means you can verify it (call it by name and confirm the response), version it (the name stays stable even if you later create `shopper_lab_winner_v2`), and hand it to a customer's engineering team as a documented artifact instead of a dashboard state nobody else can inspect.

> **Gotcha.** A lab session is not persistent production state. If you find a winning combination and just close the lab tab, nothing changed for real traffic. The commit step — saving it as a named `search_configuration` — is not optional cleanup, it's the actual point of running the comparison.

## What's next

[Build 07 — Widget Configuration](../build-07-widget-configuration/) — once you can walk into any lab session and come out with a defensible, committed configuration, the next question is how a customer's end users actually experience it: every option in the widget configurator, tour by tour.
