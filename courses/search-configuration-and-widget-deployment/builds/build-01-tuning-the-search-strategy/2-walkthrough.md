# Build 01 — Walkthrough: Tuning the Search Strategy

> Estimated time: 2 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

A tuned retrieval setup for the Aurora Outfitters Knowledge Box — tested first as raw `/find` and `/ask` calls, then reproduced in the dashboard's Search tab, then saved as a named search configuration (`product_search_tuned`) per Build 00's pattern. By the end you'll have used `features`, `rephrase`, `query_prepend`, and a `filter_expression` against real corpus content, and you'll know exactly which dashboard control writes which parameter.

## What you'll need open

- Your `.env` from Developer Foundations (`NUCLIA_API_URL`, `NUCLIA_KB_ID`, `NUCLIA_API_KEY`) — the same Knowledge Box you've used since Foundations Build 0, still holding the Aurora Outfitters corpus (`courses/developer-foundations/builds/build-00-hello-arag/corpus/content_type/`).
- Your Progress Agentic RAG dashboard, Search tab open on that Knowledge Box.
- A terminal.

The corpus is organised by `content_type` labels: `ambassador_video`, `brand_story`, `gear_review`, `loyalty_benefit`, `podcast`, `product`, `support`, `trail_guide`. You'll filter against these.

---

## Step 1 — Confirm your KB still responds (2 min)

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "waterproof hiking boot"}'
```

You should get back paragraph matches from `terratrek-7.md` and related product/review resources. If not, fix that before continuing.

---

## Step 2 — Tour the dashboard's Search tab (10 min)

1. Open your Knowledge Box and find the **Search** tab in the left-hand nav.
2. Inside it, look for **Search options** — this is the no-code surface for everything the lesson covered. Depending on your tenant version you may also see a **New Search Configuration** entry point that opens the same options in a dedicated builder.
3. Scroll the panel without changing anything yet. You should be able to find controls for: search mode / features, rephrase, query prepend, rank fusion, reranking, and filters. The exact labels vary by tenant version, but every control maps to a parameter from the lesson.

**The takeaway:** this tab is not a separate concept from `/find` and `/ask` — it's a form that writes the request body. Every step below, you'll do once by curl and once by dashboard, so you can see the two are the same thing.

---

## Step 3 — Try `features` toggles (15 min)

Run a baseline `/find` call (default features):

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "bota impermeable"}'
```

`"bota impermeable"` is Spanish for "waterproof boot" — against an English corpus, keyword search can false-match on characters that overlap between languages while missing the actual meaning. Now restrict to semantic-only:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "bota impermeable", "features": ["semantic"]}'
```

Compare the two result sets. Then go into the dashboard's Search tab and find the search-mode / features control — toggle keyword search off, rerun the same query in the dashboard's own test panel if it has one, and confirm you get the same shift.

---

## Step 4 — Test `rephrase` against a keyword-heavy query (15 min)

Pick a query shaped like keywords rather than a question:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "terratrek 7 wet rock grip"}'
```

Now rerun it with `rephrase: true`:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "terratrek 7 wet rock grip", "rephrase": true}'
```

`rephrase` turns the keyword list into something closer to *"How does the TerraTrek 7 grip wet rock?"* before semantic search runs. Compare the ranking of the `terratrek-7.md` and `terratrek-7-field-report.pdf` resources between the two calls — the rephrased version should surface the direct answer higher. Flip the corresponding toggle in the dashboard's Search tab and confirm it's the same switch.

---

## Step 5 — Add a `query_prepend` (10 min)

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "best boot for wet rock", "query_prepend": "Aurora Outfitters gear:"}'
```

Then run the same query with a support-style question that has nothing to do with gear:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "what is your returns policy", "query_prepend": "Aurora Outfitters gear:"}'
```

Notice the second call still gets the "gear:" prefix glued on even though the query is about returns, not gear — this is the gotcha from the lesson made concrete. Set the same value in the dashboard's Search tab's query-prepend field and confirm it now applies to every test query you run from that tab, not just the ones it's relevant to.

---

## Step 6 — Build a `filter_expression` (15 min)

Filter to English-language, non-OCR paragraphs:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "waterproof hiking boot",
    "filter_expression": {
      "field": {"prop": "language", "language": "en"},
      "paragraph": {"not": {"prop": "kind", "kind": "OCR"}},
      "operator": "and"
    }
  }'
```

Now scope to just the `product` content type using the classification-label filter path from the lesson's full attribute list:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "waterproof hiking boot", "filters": ["/classification.labels/content_type/product"]}'
```

Confirm the second call returns only `product`-labelled resources (the TerraTrek 7, Skyline 45L, Helios jacket, etc.) — no `gear_review`, `trail_guide`, or `support` content. In the dashboard's Search tab filter panel, build the equivalent restriction and confirm the test panel narrows the same way.

> **Gotcha.** If step 6's second call returns nothing, your KB may not have a `content_type` labelset populated yet, or it uses different label values than the corpus front matter implies. Check `GET /kb/{kbId}/labelsets` (Foundations Build 7) to confirm the exact labelset and label names before assuming the filter syntax is wrong.

---

## Step 6b — Measure what rank fusion and reranking cost you (20 min)

The lesson said RRF tuning and reranking are dataset-dependent, and that reranking buys ordering quality at the cost of latency. Both claims are worth one measurement each before you ever quote them to a customer.

**Rank fusion.** Run the same query at two `k` values and compare the top-5 ordering:

```bash
for K in 1 10 60 200; do
  echo "--- k=$K"
  curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
    -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
    -H "content-type: application/json" \
    -d "{\"query\": \"waterproof boot for wet rock\", \"rank_fusion\": {\"name\": \"rrf\", \"k\": $K}}"
done
```

Use `k` values far apart — `1`, `10`, `60`, `200`. A low `k` discounts lower ranks harder, so items that placed well in only *one* search mode lose ground; a high `k` flattens that. On the reference corpus `k` of 1, 10 and 60 give **identical** ordering and only `k=200` visibly reorders the top 5 (and makes it worse). **That non-result is the lesson:** `k` is not a dial you tune blind, and Build 06's RAG Lab is where a comparison like this gets run properly against a real query set.

**Reranking.** Remember it is **on by default** — so this measures what you lose by turning it *off*, not what you gain by turning it on:

```bash
# default (reranker: predict)
time curl -s -o /dev/null "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "waterproof boot for wet rock"}'

# reranking off
time curl -s -o /dev/null "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "waterproof boot for wet rock", "reranker": "noop"}'
```

Run each three times and take the middle number — a single sample is noise. Write both figures in your `prompt-log.md`.

**The question to answer:** how much does turning reranking *off* degrade the ordering, and how much latency does it buy back? On the reference corpus, `noop` is roughly 10% faster but demotes `terratrek-7.md` out of the top slot in favour of a trail guide — a bad trade for a shopper-facing surface, a possibly fine one for a high-QPS backend. That judgement is exactly what a customer will ask you to make on their corpus.

---

## Step 7 — Save the tuned setup as a named search configuration (10 min)

You now have a combination worth keeping: semantic search kept broad, no forced `query_prepend` (you saw why it's too blunt for a general search bar), and a filter scoped to product content. Save it as `product_search_tuned`, following Build 00's pattern.

Express **everything in one `filter_expression`** — not a mix of `filters` and `filter_expression`:

```bash
curl -s -X POST "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/search_configurations/product_search_tuned" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "kind": "find",
    "config": {
      "filter_expression": {
        "field": {"and": [
          {"prop": "label", "labelset": "content_type", "label": "product"},
          {"prop": "language", "language": "en"}
        ]}
      },
      "rank_fusion": {"name": "rrf", "k": 60}
    }
  }'
```

A `201` with no body means it saved. Read it back with a `GET` on the same URL to confirm.

> **Gotcha — this is where the mutual-exclusivity rule bites.** It is tempting to keep the `filters` array from Step 6 *and* add a `filter_expression` for the language condition. Do that and the configuration saves fine, returns `201`, reads back looking perfect — and then every call using it returns **zero results**, with no error anywhere. The two filter mechanisms cannot be combined. A stored configuration makes this especially nasty, because the broken filter is now invisible at the call site: the caller just passes a name and gets nothing back.

---

## Step 8 — Verify by calling it by name (5 min)

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "grip on wet rock", "search_configuration": "product_search_tuned"}'
```

Confirm every resource returned is `product`-labelled — on the reference corpus this query returns 6 of them (TerraTrek 7, Skyline 45L, Helios jacket, Stratus 1P, Cumulus 2P, Crag XR harness) — and that no trail guides, reviews or support docs appear. The stored configuration is doing the work now, not the inline parameters.

**If you get zero results,** you almost certainly still have both `filters` and `filter_expression` in the stored config. Re-read Step 7's gotcha, `GET` the configuration back, and delete whichever filter mechanism you aren't using. Then open the dashboard's Search tab and confirm `product_search_tuned` appears in the saved-configurations list next to `shopper_default` from Build 00.

---

## Step 9 — Save your prompts (5 min)

Add to (or create) `prompt-log.md` in your project folder: paste any prompts you used to debug a filter that returned zero results, or to interpret a Search-tab control whose wording didn't match the lesson's terminology.

---

## Verification checklist

- [ ] Baseline vs. `features: ["semantic"]` compared on a cross-language query — result sets visibly differ.
- [ ] `rephrase: true` tested against a keyword-heavy query — ranking of the direct-answer resource improves.
- [ ] `query_prepend` tested on both a relevant and an irrelevant query — you observed the gotcha (prefix applies even when irrelevant).
- [ ] `filter_expression` built and confirmed narrowing to English, non-OCR paragraphs.
- [ ] `filters` scoped to `/classification.labels/content_type/product` — only product resources returned.
- [ ] `rank_fusion` compared across `k` = 1/10/60/200, and the result (no change until the extreme) noted.
- [ ] Reranking timed default vs `noop`, three runs each, both figures in `prompt-log.md` — and you can say what turning it off costs in ordering quality.
- [ ] `product_search_tuned` search configuration created and confirmed via `search_configuration` call.
- [ ] `product_search_tuned` visible in the dashboard's saved-configurations list.
- [ ] `prompt-log.md` updated.

Then take the [Build 01 quiz](3-quiz.md). Pass → start [Build 02](../build-02-prompts-and-generative-answers/).

---

## Getting unstuck

| Error / symptom | Likely cause | Fix |
|---|---|---|
| `filters` on `/classification.labels/content_type/product` returns zero results | Labelset or label values don't match the corpus you're expecting | `GET /kb/{kbId}/labelsets` to confirm the real labelset name and label values before assuming the syntax is wrong |
| `filter_expression` returns **0 results and no error** | Invalid filters fail silently — a misspelled `prop`, a wrong key, or `filters` and `filter_expression` sent together all return an empty set rather than a 400 | Drop the filter entirely to confirm the query matches at all, then add conditions back one at a time. If you have both `filters` and `filter_expression`, remove one — they are mutually exclusive |
| `rephrase: true` doesn't change results at all | The query was already phrased as a natural-language question, so there's nothing to rephrase | Try a query that's genuinely a keyword list, like Step 4's example |
| `query_prepend` doesn't seem to apply | Sent as a query-string param instead of in the JSON body | Confirm it's a top-level key in the POST body, same as `query` |
| `POST /search_configurations/{name}` returns 404 | KB ID in `.env` doesn't match the KB you're testing against | Re-check `NUCLIA_KB_ID` |
| Dashboard Search tab test panel shows different results than your curl call | The dashboard panel may have its own default `features`/filters applied before yours | Clear any pre-set dashboard filters, or just trust the curl call as source of truth |
| `autofilters` never appears in any response | No entity extraction has run on this KB, so there are no detected entities to auto-filter on | `GET /kb/{kbId}/entitiesgroups` — if every group shows 0 entities, that's the cause, and it's expected on a fresh folder-uploaded KB |

## Next

[Build 02 — Prompts & Generative Answers](../build-02-prompts-and-generative-answers/) — once retrieval returns the right paragraphs, the next lever is what the model does with them.
