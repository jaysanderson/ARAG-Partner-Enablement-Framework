# Build 00 — Walkthrough: Named Search Configurations

> Estimated time: 15 minutes. Read the [lesson](1-lesson.md) first.

## What you'll build

One stored search configuration on your Foundations Knowledge Box, created via the API, then referenced from an `/ask` call. No dashboard vibe-coding, no new corpus — this is the shortest walkthrough in the course.

## What you'll need open

- Your `.env` from Developer Foundations (`NUCLIA_API_URL`, `NUCLIA_KB_ID`, `NUCLIA_API_KEY`) — same Knowledge Box you've used since Foundations Build 0.
- A terminal.

---

## Step 0 — Read this before your first curl (1 min)

`/ask` **streams by default.** A plain `curl` returns hundreds of NDJSON lines, one per token fragment:

```
{"item":{"type":"answer","text":"The"}}
{"item":{"type":"answer","text":" Aurora"}}
{"item":{"type":"answer","text":" Terra"}}
```

That is correct behaviour, not an error — but it is unreadable, and every walkthrough in this course asks you to *read* and *compare* answers. Add the `X-Synchronous: true` header to get one JSON object instead:

```bash
-H "X-Synchronous: true"
```

Every `/ask` example from here on includes it. `/find` does not stream, so it does not need it.

The synchronous response's useful keys: `answer` (the text), `retrieval_results.resources` (what was retrieved), `citations`, and `metadata.tokens` (`input`/`output` counts — the objective signal you will use repeatedly to tell whether a configuration change actually did anything).

---

## Step 1 — Confirm your KB still responds (2 min)

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "X-Synchronous: true" \
  -H "content-type: application/json" \
  -d '{"query": "What is the Aurora TerraTrek 7?"}'
```

You should get a grounded answer with citations, same as Foundations Build 0. If not, fix that before continuing — everything in this course runs against this KB.

---

## Step 2 — Create a named search configuration (5 min)

Create a configuration called `shopper_default` that answers in a consistent voice:

```bash
curl -s -X POST "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/search_configurations/shopper_default" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "kind": "ask",
    "config": {
      "prompt": {
        "system": "You are Aurora Outfitters'\'' shopping assistant. Answer concisely and recommend a specific product when relevant."
      }
    }
  }'
```

A `20x` response with no body (or an empty JSON object) means it saved.

---

## Step 3 — Call it by name (3 min)

Use an **open-ended** question. A narrow one ("what boot for the TMB?") has a single obvious one-line answer, and "answer concisely" cannot change it — you would see two identical responses and wrongly conclude the configuration never applied.

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "X-Synchronous: true" \
  -H "content-type: application/json" \
  -d '{"query": "I am new to hiking. What should I know before my first multi-day trip?", "search_configuration": "shopper_default"}'
```

**Compare it against the same query with no configuration:**

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "X-Synchronous: true" \
  -H "content-type: application/json" \
  -d '{"query": "I am new to hiking. What should I know before my first multi-day trip?"}'
```

The configured answer should be visibly tighter. **The objective check is `metadata.tokens.output`** — the stored "answer concisely" instruction measurably shortens the answer (roughly 630 to 490 output tokens on the reference corpus). `metadata.tokens.input` also rises by a few tokens, because the system prompt is now part of the request; that alone proves the configuration was applied even when the prose looks similar.

> **Gotcha — the config that looks like it "does nothing."** Prompt effects are invisible on questions that have only one sensible answer. Before concluding a stored configuration is broken, compare `tokens.input` against a bare call. If it went up, the configuration *is* loading, and your prompt simply had no room to act on that query.

---

## Step 4 — List it in the dashboard (5 min)

Open your dashboard, find the Search tab (Build 01 tours it properly), and look for a **Search configurations** or **Saved configurations** list. Confirm `shopper_default` appears — created via curl, visible in the UI. This is the same list the dashboard's **Create widget** button writes to.

---

## Verification checklist

- [ ] `shopper_default` search configuration created via API.
- [ ] Called by name on an **open-ended** query; `metadata.tokens.output` is lower than the bare call and `tokens.input` is higher.
- [ ] Confirmed the same configuration is visible in the dashboard's Search configurations list.

Then take the [Build 00 quiz](3-quiz.md). Pass → start [Build 01](../build-01-tuning-the-search-strategy/).

---

## Getting unstuck

**POST to `/search_configurations/{name}` returns 404.**
- Check the KB ID in your `.env` matches the KB you provisioned in Foundations Build 0 — this is a per-KB endpoint.

**The configuration doesn't appear to change the answer.**
- Confirm you passed `"search_configuration": "shopper_default"` (exact name, case-sensitive) in Step 3's request body, not as a query string parameter.
- Then compare `metadata.tokens.input` against a bare call. If it is higher, the configuration *is* applying and your query simply has one obvious answer the prompt cannot reshape — pick a more open-ended question rather than editing the config.

**My `/ask` call returns hundreds of `{"item":{"type":"answer"...}}` lines.**
- That is the default streaming response. Add `-H "X-Synchronous: true"` — see Step 0.

**I don't see a Search configurations list in the dashboard.**
- Some tenants surface this inside the Search tab itself rather than as a separate nav item — Build 01's walkthrough tours the Search tab in full and will resolve this.

## Next

[Build 01 — Tuning the Search Strategy](../build-01-tuning-the-search-strategy/) — the Search tab, and everything that goes into a configuration's `config` block to control retrieval itself.
