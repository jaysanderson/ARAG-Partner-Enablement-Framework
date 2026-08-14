# Build 02 — Walkthrough: Prompts & Generative Answers

> Estimated time: 1.5 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

A tuned generation setup for the Aurora Outfitters Knowledge Box — a shopping-assistant system prompt, verified against a retrieval-only baseline, compared across `reasoning` effort levels on a genuinely multi-step question, capped with a token limit, then saved as a named search configuration (`shopper_generation_tuned`) per Build 00's pattern. By the end you'll have used `generate_answer`, `reasoning`, and token-limit parameters against real corpus content, and you'll know which dashboard control on the Generative Answer tab writes which parameter.

## What you'll need open

- Your `.env` from Developer Foundations (`NUCLIA_API_URL`, `NUCLIA_KB_ID`, `NUCLIA_API_KEY`) — the same Knowledge Box you've used since Foundations Build 0, still holding the Aurora Outfitters corpus (`courses/developer-foundations/builds/build-00-hello-arag/corpus/content_type/`).
- Your Progress Agentic RAG dashboard, **Generative answer and RAG** section open on that Knowledge Box.
- A terminal.

The corpus is organised by `content_type` labels: `ambassador_video`, `brand_story`, `gear_review`, `loyalty_benefit`, `podcast`, `product`, `support`, `trail_guide`. Today's question crosses three of them: `trail_guide` (`tour-du-mont-blanc.md`), `product` (`cumulus-2p-tent.md`, `stratus-1p-tent.md`), and `support` (the warranty policy).

---

## Step 1 — Confirm your KB still responds (2 min)

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "What tent should I bring on the Tour du Mont Blanc?"}'
```

You should get back a grounded answer citing the trail guide and at least one tent product. If not, fix that before continuing.

---

## Step 2 — Write and test a shopping-assistant system prompt (15 min)

Run the same query with a system prompt that gives the assistant a distinct voice:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "What tent should I bring on the Tour du Mont Blanc?",
    "prompt": {
      "system": "You are Aurora Outfitters'\'' shopping assistant. Answer concisely, recommend a specific product by name when relevant, and keep an upbeat, trail-ready tone."
    }
  }'
```

Compare it against Step 1's bare answer — same retrieval, different voice. Then open the dashboard's **Generative answer and RAG** section, find the system-prompt field, paste the same text in, and re-run the query from the dashboard's own test panel if it has one. Confirm you get the same shift in tone.

---

## Step 3 — Debug with `generate_answer: false` (15 min)

Pretend a customer just told you: "the tent recommendation is wrong." Before touching the prompt, check what actually got retrieved:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "What tent should I bring on the Tour du Mont Blanc?", "generate_answer": false}'
```

No LLM call runs — you get retrieval only, same shape as `/find`. Read the paragraphs. Confirm `tour-du-mont-blanc.md` and at least one of `cumulus-2p-tent.md` / `stratus-1p-tent.md` are in the result set. If they are, you've just proven retrieval is fine and any wrong answer is a generation-side problem (prompt, model, reasoning) — the rest of this Build, not Build 01. If they're **not** in the result set, that's a Build 01 problem no prompt edit will fix.

Flip the corresponding toggle in the dashboard's Generative Answer tab (it's usually near the top, labelled something like "Generate answer") and confirm the live preview drops to retrieval-only the same way.

---

## Step 4 — Compare `reasoning` effort levels on a multi-step question (20 min)

Single-fact questions don't show reasoning effort doing much. Use one that actually requires combining facts across resources:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "I'\''m hiking the Tour du Mont Blanc and want the lighter of Aurora'\''s two tents. Which one should I bring, and is trail damage covered under Aurora'\''s warranty?",
    "reasoning": {"effort": "none"}
  }'
```

Time it, then rerun with higher effort:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "I'\''m hiking the Tour du Mont Blanc and want the lighter of Aurora'\''s two tents. Which one should I bring, and is trail damage covered under Aurora'\''s warranty?",
    "reasoning": {"effort": "high", "budget_tokens": 4000}
  }'
```

Prefix both commands with `time` if you want a rough latency comparison. Read both answers: does the `"high"` version correctly compare the two tents' weights **and** correctly report the warranty terms, where the `"none"` version drops or blends one of the two facts? On a corpus this small the gap may be modest — but you should be able to point at *something* the higher-effort call got right that the lower-effort one missed or hedged on. Note the latency difference too; this is the tradeoff the lesson's gotcha describes.

---

## Step 5 — Set a token limit and observe truncation (15 min)

Cap output hard enough to see it bite:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "Compare all of Aurora'\''s tents and recommend one for alpine conditions.",
    "limitTokenConsumption": true,
    "outputTokenConsumptionLimit": 40
  }'
```

The answer should cut off mid-thought well before it's actually finished comparing the tents. Rerun with the cap removed (or raised to something reasonable, like `500`) and confirm the answer completes:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "Compare all of Aurora'\''s tents and recommend one for alpine conditions.",
    "limitTokenConsumption": true,
    "outputTokenConsumptionLimit": 500
  }'
```

This is the exact failure mode a production widget hits if someone sets a cost-control token limit too aggressively — answers that just stop. Keep this in mind before shipping a tight cap on a customer-facing surface.

---

## Step 6 — Save the tuned setup as a named search configuration (10 min)

Combine the shopping-assistant prompt, a sane reasoning effort, and a production-reasonable token cap. Save it as `shopper_generation_tuned`, following Build 00's pattern:

```bash
curl -s -X POST "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/search_configurations/shopper_generation_tuned" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "kind": "ask",
    "config": {
      "prompt": {
        "system": "You are Aurora Outfitters'\'' shopping assistant. Answer concisely, recommend a specific product by name when relevant, and keep an upbeat, trail-ready tone."
      },
      "reasoning": {"effort": "low"},
      "limitTokenConsumption": true,
      "tokenConsumptionLimit": 4000
    }
  }'
```

A `20x` with no body (or an empty JSON object) means it saved.

---

## Step 7 — Verify by calling it by name (5 min)

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "What tent should I bring on the Tour du Mont Blanc?", "search_configuration": "shopper_generation_tuned"}'
```

Confirm the answer reads in the shopping-assistant voice from Step 2, same as if you'd passed the prompt inline — the stored configuration is doing the work now. Then open the dashboard's Search tab and confirm `shopper_generation_tuned` appears in the saved-configurations list next to `shopper_default` and `product_search_tuned` from earlier Builds.

---

## Step 8 — Save your prompts (5 min)

Add to (or create) `prompt-log.md` in your project folder: paste any prompts you used to debug an unexpected truncation, or to interpret a Generative Answer tab control whose wording didn't match the lesson's terminology.

---

## Verification checklist

- [ ] Shopping-assistant system prompt tested inline — the answer's tone visibly shifts versus the bare-default call.
- [ ] `generate_answer: false` tested — confirmed the right resources were retrieved before touching the prompt.
- [ ] `reasoning.effort` compared at `none` and `high` on the multi-step tent-and-warranty question — you can name at least one thing the higher-effort answer got right that the lower-effort one missed.
- [ ] Token limit tested — a tight `outputTokenConsumptionLimit` visibly truncates an answer; a higher one doesn't.
- [ ] `shopper_generation_tuned` search configuration created and confirmed via `search_configuration` call.
- [ ] `shopper_generation_tuned` visible in the dashboard's saved-configurations list.
- [ ] `prompt-log.md` updated.

Then take the [Build 02 quiz](3-quiz.md). Pass → start [Build 03](../build-03-rag-context-strategies/).

---

## Getting unstuck

| Error / symptom | Likely cause | Fix |
|---|---|---|
| `generate_answer: false` still returns an `answer` field | Sent as a query-string param instead of in the JSON body, or the key is misspelled | Confirm it's a top-level key in the POST body — `generate_answer`, not `generateAnswer` (that spelling is the widget-config name, not the request field) |
| `reasoning` has no visible effect on the answer | The `generativeModel` configured on this KB isn't a reasoning-capable model | Check which model the KB is using; `reasoning` is a no-op on models that don't support it |
| Higher `reasoning.effort` doesn't noticeably improve the multi-step answer | The corpus is small enough that even low effort finds both facts | Try an even more compound question, or trust the latency difference as the observable effect this time |
| `outputTokenConsumptionLimit` truncation looks identical with and without the cap | The uncapped answer was already shorter than your cap | Lower the cap further, or pick a query that naturally produces a longer answer (a comparison across more resources) |
| `POST /search_configurations/{name}` returns 404 | KB ID in `.env` doesn't match the KB you're testing against | Re-check `NUCLIA_KB_ID` |
| Saved configuration doesn't reflect the tuned prompt when called by name | Typo in the configuration name, or the POST in Step 6 returned a non-2xx you missed | Re-run Step 6, check the HTTP status, re-verify with Step 7 |
| Dashboard's Generative Answer tab test panel shows a different tone than your curl call | The dashboard panel may have its own saved prompt applied before yours | Clear any pre-set dashboard prompt fields, or just trust the curl call as source of truth |

## Next

[Build 03 — RAG Context Strategies](../build-03-rag-context-strategies/) — the other half of the Generative Answer tab: what context the model sees, before any prompt or reasoning setting from this Build gets to act on it.
