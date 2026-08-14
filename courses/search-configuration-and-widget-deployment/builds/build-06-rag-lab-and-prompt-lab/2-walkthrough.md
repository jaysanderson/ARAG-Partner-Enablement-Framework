# Build 06 — Walkthrough: RAG Lab & Prompt Lab

> Estimated time: 1.5 hours focused. Read the lesson first.

## What you'll build

A documented, side-by-side comparison of two or three prompt/model/`rag_strategies` combinations against a fixed set of test queries, run through the dashboard's RAG Lab / Prompt Lab and reproduced by curl. You'll pick a winner and commit it as a named search configuration, `shopper_lab_winner`, following Build 00's pattern. By the end you'll know how to design a test-query set that actually reveals differences, and you'll have a documented reason for every choice in the winning configuration — not a guess.

## What you'll need open

- Your `.env` from Developer Foundations (`NUCLIA_API_URL`, `NUCLIA_KB_ID`, `NUCLIA_API_KEY`) — the same Knowledge Box you've used since Foundations Build 0, still holding the Aurora Outfitters corpus (`courses/developer-foundations/builds/build-00-hello-arag/corpus/content_type/`).
- Your Progress Agentic RAG dashboard, with the Advanced section's Prompt Lab / RAG Lab open on that Knowledge Box.
- A terminal.

The corpus is organised by `content_type` labels: `ambassador_video`, `brand_story`, `gear_review`, `loyalty_benefit`, `podcast`, `product`, `support`, `trail_guide`, plus the two-field `field_demo` resource from Build 03 (`skyline-45l-warranty-main.md` + `skyline-45l-warranty-updates.md`) — you'll use that one deliberately below.

---

## Step 1 — Pick a fixed set of test queries (10 min)

Before touching the lab, write down the queries you'll run against **every** candidate combination. Using the same one or two questions you happen to like is how a bad configuration slips through — a fixed set, run consistently, is what actually reveals a difference. Use these four:

1. **"What boot should I wear on the Tour du Mont Blanc?"** — a straightforward product-recommendation question with a clear right answer in the corpus (`trail_guide/tour-du-mont-blanc.md`, `product`/`gear_review` boot content).
2. **"Is my Skyline 45L warranty still valid after 2 years?"** — the revealing one. The main warranty document (`field_demo/skyline-45l-warranty-main.md`) says 2 years, original purchaser only. A second field on the same resource (`field_demo/skyline-45l-warranty-updates.md`) supersedes hardware-failure coverage under Aurora's Repair-for-Life programme. A configuration that doesn't pull the second field into context will answer "no, coverage ended" — wrong. This query alone can tell you whether a candidate's `rag_strategies` choice is doing its job.
3. **"What's Aurora's return policy on used or worn gear?"** — a support question (`support/returns-policy.md`) with no gear-recommendation angle, useful for catching an overreaching prompt or an irrelevant `query_prepend`.
4. **"Which tent handles high wind best?"** — another product-comparison question (`product/cumulus-2p-tent.md`, `product/stratus-1p-tent.md`, related `gear_review` content) to sanity-check consistency with query 1's pattern.

Write these four down somewhere you'll paste them into the lab repeatedly — you're about to run each one three or four times.

---

## Step 2 — Open the lab and orient (5 min)

1. In your Progress Agentic RAG dashboard, open the Knowledge Box and find the **Advanced** section in the left-hand nav.
2. Inside it, open the **Prompt Lab**. You should see a **RAG Lab** tab alongside it — confirm both are part of the same lab area, not two separate screens.
3. Look for controls to set a prompt, pick a `generativeModel`, and (on the RAG Lab tab) pick a `rag_strategies` entry. Don't run anything yet — just confirm you can find all three controls before you start comparing.

**The takeaway:** everything you're about to set in this lab writes to the same parameters you already tested individually in Builds 02 and 03. The lab just lets you hold more than one of them steady while you vary the others.

---

## Step 3 — Run combination A: the baseline (15 min)

Set up a plain baseline: platform-default prompt, platform-default model, no `rag_strategies` entry. Run all four Step 1 queries against it in the lab and note the answers.

Reproduce the same baseline by curl, so you have a durable record next to your lab notes:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "Is my Skyline 45L warranty still valid after 2 years?"}'
```

**Expect combination A to get query 2 wrong** — with no `rag_strategies` entry pulling in the second field, the answer will likely say coverage lapses at 2 years, missing the Repair-for-Life update entirely. Note it. This is the baseline everything else has to beat.

---

## Step 4 — Run combination B: tuned prompt + field extension (15 min)

In the lab, switch to a second candidate:

- **Prompt** — a system prompt naming Aurora Outfitters' shopping-assistant persona and instructing it to answer concisely and cite sources (Build 02).
- **RAG strategy** — add `field_extension` on the RAG Lab tab, so a matched paragraph in the main warranty field pulls in the paired updates field (Build 03).

Run the same four queries. Reproduce by curl:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "Is my Skyline 45L warranty still valid after 2 years?",
    "prompt": {"system": "You are Aurora Outfitters'\'' shopping assistant. Answer concisely and cite your sources."},
    "rag_strategies": [{"name": "field_extension"}]
  }'
```

**Check specifically:** does the answer now mention Repair-for-Life coverage for hardware failures, not just the flat "2 years" figure? If yes, `field_extension` is doing its job — this is the query 2 answer resolving correctly the lesson promised.

---

## Step 5 — Run combination C: a different model (15 min)

Keep combination B's prompt and `rag_strategies`, but switch `generativeModel` to a different supported LLM in the lab. Run the same four queries again.

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "Is my Skyline 45L warranty still valid after 2 years?",
    "prompt": {"system": "You are Aurora Outfitters'\'' shopping assistant. Answer concisely and cite your sources."},
    "rag_strategies": [{"name": "field_extension"}],
    "generativeModel": "<a second model from your tenant'\''s supported list>"
  }'
```

This is Build 02's model-switch gotcha made concrete: same prompt, same `rag_strategies`, different model — note whether tone, length, or citation count shifted even though nothing else did.

---

## Step 6 — Compare qualitatively and pick a winner (15 min)

For each combination, note against your four queries:

| Signal | What to look for |
|---|---|
| **Grounding quality** | Does the answer actually reflect what's in the corpus, or does it hedge / generalize? |
| **Query 2 resolution** | Does it correctly surface the Repair-for-Life update, or just the stale 2-year figure? |
| **Citation count** | How many sources does the answer ground itself in — too few reads unsupported, too many reads noisy. |
| **Tone** | Does it match "concise shopping assistant," or does it ramble? |
| **Query 3 discipline** | Does the return-policy answer stay on topic, or does gear-recommendation language leak in? |

Pick the combination that wins on balance — not necessarily the one that's best on a single query. For most partners running this walkthrough, combination B or C (tuned prompt + `field_extension`, with or without the model swap) beats the baseline decisively on query 2 alone.

---

## Step 7 — Commit the winner as a named search configuration (10 min)

Take your winning combination's exact parameters and commit them, per Build 00's pattern:

```bash
curl -s -X POST "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/search_configurations/shopper_lab_winner" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "kind": "ask",
    "config": {
      "prompt": {"system": "You are Aurora Outfitters'\'' shopping assistant. Answer concisely and cite your sources."},
      "rag_strategies": [{"name": "field_extension"}],
      "generativeModel": "chatgpt-azure-4o"
    }
  }'
```

A `20x` with no body (or an empty JSON object) means it saved.

---

## Step 8 — Verify by calling it by name (5 min)

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "Is my Skyline 45L warranty still valid after 2 years?", "search_configuration": "shopper_lab_winner"}'
```

Confirm the response reflects the winning behaviour from Step 4/5 — the Repair-for-Life update resolving correctly — with only the configuration name in the request body, no inline parameters. That's the lab-to-production handoff complete: the winner now lives as a stored, callable configuration, not a lab session state.

---

## Step 9 — Save your prompts (5 min)

Add to (or create) `prompt-log.md` in your project folder: paste your four test queries, a short note on each candidate combination's result, and why you picked the winner. This is the artifact you'd actually hand a customer's engineering team — "here's what we tested and why this configuration won" — not just the final `POST`.

---

## Verification checklist

- [ ] Four fixed test queries written down and run against every candidate combination.
- [ ] Combination A (baseline) run and query 2 confirmed to answer incorrectly (misses the Repair-for-Life update).
- [ ] Combination B (tuned prompt + `field_extension`) run and query 2 confirmed to resolve correctly.
- [ ] Combination C (model swap) run and at least one tone/length/citation difference noted versus combination B.
- [ ] A winner picked with a documented reason, not just a preference.
- [ ] `shopper_lab_winner` search configuration created and confirmed via `search_configuration` call.
- [ ] `prompt-log.md` updated with all four queries and your comparison notes.

Then take the [Build 06 quiz](3-quiz.md). Pass → start [Build 07](../build-07-widget-configuration/).

---

## Getting unstuck

| Error / symptom | Likely cause | Fix |
|---|---|---|
| RAG Lab tab is missing, only Prompt Lab shows | Older tenant version, or RAG strategy comparison not yet enabled on your account | Confirm with your Progress partner manager; in the meantime run the `rag_strategies` half of this walkthrough by curl only |
| Query 2 still resolves incorrectly even with `field_extension` set | The two-field demo resource may not be ingested, or the strategy name/shape doesn't match your tenant version | Confirm both `skyline-45l-warranty-main.md` and `skyline-45l-warranty-updates.md` are ingested as fields on the same resource in the dashboard's resource browser |
| Lab and curl give different answers for the "same" combination | The lab may have a stale prompt or model selection left over from a previous session | Re-check every field in the lab panel before running; don't assume it kept your last setting |
| `POST /search_configurations/shopper_lab_winner` returns 404 | KB ID in `.env` doesn't match the KB you're testing against | Re-check `NUCLIA_KB_ID` |
| Calling `shopper_lab_winner` by name gives a different answer than your winning lab run | The committed `config` block doesn't exactly match what you tested — a field got dropped or mistyped in the `POST` body | Compare the `POST` body line-by-line against the winning combination's exact parameters from Step 4/5/6 |
| Model swap in Step 5 errors out | The model name isn't in your tenant's supported list | Check the dashboard's model dropdown for the exact identifier string rather than guessing one |

## Next

[Build 07 — Widget Configuration](../build-07-widget-configuration/) — with a committed, defensible configuration in hand, the next question is how end users actually experience it: every option in the widget configurator, tour by tour.
