# Build 05 — Walkthrough: Result Display & User Intent Routing

> Estimated time: 2 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

Two `ResultDisplayConfig` setups against the same Aurora Outfitters Knowledge Box — a minimal shopper view and a fuller staff/internal view — each saved as a named search configuration per Build 00's pattern. Then one User Intent Routing rule that catches a predictable support question and answers it with a `direct_answer`, bypassing generation entirely, and you'll confirm that by watching for the missing generation cost.

## What you'll need open

- Your `.env` from Developer Foundations (`NUCLIA_API_URL`, `NUCLIA_KB_ID`, `NUCLIA_API_KEY`) — the same Knowledge Box you've used since Foundations Build 0, still holding the Aurora Outfitters corpus (`courses/developer-foundations/builds/build-00-hello-arag/corpus/content_type/`).
- Your Progress Agentic RAG dashboard, Result Display tab open on that Knowledge Box.
- A terminal.

The corpus is organised by `content_type` labels: `ambassador_video`, `brand_story`, `gear_review`, `loyalty_benefit`, `podcast`, `product`, `support`, `trail_guide`. Today you'll lean on `support/` for the routing exercise — it holds `returns-policy.md`, `shipping-policy.md`, `sizing-guide.md`, `sizing-guide-printable.pdf`, `altitude-acclimatisation.md`, and `warranty-and-repair-policy.docx`.

---

## Step 1 — Confirm your KB still responds (2 min)

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "what is Aurora'\''s return policy"}'
```

You should get a generated answer citing `returns-policy.md`. If not, fix that before continuing.

---

## Step 2 — Tour the dashboard's Result Display tab (10 min)

1. Open your Knowledge Box and find the **Result Display** tab.
2. You should be able to find controls for: showing results at all, result type (citations / all resources / LLM citations), metadata, thumbnails, hiding the answer, field list, attached images, relations/relation graph, JSON output, citation threshold, sort, and scroll behaviour. Exact labels vary by tenant version — every control maps to a `ResultDisplayConfig` field from the lesson.
3. Don't change anything yet. Just locate each control once so Steps 3–4 go quickly.

**The takeaway:** same pattern as every prior Build — this tab is a form that writes `ResultDisplayConfig` fields onto the request or the stored configuration. You'll set each side (dashboard, then curl) and confirm they agree.

---

## Step 3 — Build the shopper view (25 min)

The shopper-facing surface should be clean: an answer, minimal chrome, no internal metadata.

> **Display config is dashboard work.** `ResultDisplayConfig` fields are `camelCase` widget-configuration names, not `/ask` request-body parameters — pasting them into a curl body won't change the JSON you get back. Set them in the **Result Display** tab and verify in the preview, which is the surface they actually govern.

In the dashboard's **Result Display** tab, set:

| Field | Value |
|---|---|
| `displayResults` | on |
| `showResultType` | `citations` |
| `displayMetadata` | off |
| `displayThumbnails` | off |
| `hideAnswer` | off |
| `displayFieldList` | off |
| `relations` / `relationGraph` | off |
| `sortResults` | off |

Run *"what boot handles wet rock best"* in the preview. Confirm you get the generated answer plus a lean citation list — no metadata blocks, no field list.

Now prove the `hideAnswer` gotcha from the lesson. Flip `hideAnswer` to **on** and re-run the same query in the preview.

The answer is gone from the rendered output — but the call still ran generation server-side. Note that the preview takes just as long to come back as it did with the answer showing: that latency is the generation you're still paying for. Now compare against the real cost lever, which *is* an API parameter:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "what boot handles wet rock best", "generate_answer": false}'
```

Same visible outcome (no answer), but this call never invoked the LLM at all — noticeably faster, and free of generation cost. This is the gotcha made concrete: `hideAnswer` is a display choice set on the widget, `generate_answer: false` is a cost choice sent on the request, and they are not interchangeable even though they look identical to the end user.

---

## Step 4 — Build the staff/internal view (25 min)

The internal view trades minimalism for depth: full metadata, relation data, a higher citation bar so nothing marginal shows up unchallenged.

Same surface as Step 3 — the **Result Display** tab, verified in the preview. Set:

| Field | Value |
|---|---|
| `displayResults` | on |
| `showResultType` | `all-resources` |
| `displayMetadata` | on |
| `metadatas` | `["author", "content_type"]` |
| `displayFieldList` | on |
| `relations` / `relationGraph` | on |
| `customizeThreshold` | on |
| `citationThreshold` | `0.7` |
| `sortResults` | on |

Run the same query and compare this preview to Step 3's: more resources listed (not just cited ones), metadata visible on each row, and a stricter citation bar. If your KB doesn't yet have `graph_beta` relation data extracted (Build 03), `relations`/`relationGraph` will show as empty on real resources — that's expected; the display switch is on, there's just nothing extracted yet to show.

> **Gotcha check.** If `citationThreshold: 0.7` returns zero citations on a query that clearly should have one, your corpus's actual relevance scores for that query may sit below 0.7. Lower it in steps (0.5, 0.3) until citations reappear, then treat that as the real floor for this corpus rather than an arbitrary number.

---

## Step 5 — Save both as named search configurations (15 min)

```bash
curl -s -X POST "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/search_configurations/shopper_display" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "kind": "ask",
    "config": {
      "resultDisplayConfig": {
        "displayResults": true,
        "showResultType": "citations",
        "displayMetadata": false,
        "displayThumbnails": false,
        "hideAnswer": false,
        "displayFieldList": false,
        "relations": false,
        "relationGraph": false,
        "sortResults": false
      }
    }
  }'
```

```bash
curl -s -X POST "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/search_configurations/staff_display" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "kind": "ask",
    "config": {
      "resultDisplayConfig": {
        "displayResults": true,
        "showResultType": "all-resources",
        "displayMetadata": true,
        "metadatas": ["author", "content_type"],
        "displayFieldList": true,
        "relations": true,
        "relationGraph": true,
        "customizeThreshold": true,
        "citationThreshold": 0.7,
        "sortResults": true
      }
    }
  }'
```

A `20x` on each means it saved.

**Verify in the dashboard, not in a JSON response.** Open the saved-configurations list and confirm both names appear with the display settings you gave them, then point the dashboard preview at each in turn and confirm `shopper_display` renders Step 3's lean surface and `staff_display` renders Step 4's fuller one. A curl call with `"search_configuration": "shopper_display"` will succeed either way — display settings govern rendering, so the response body isn't where the difference shows up.

You need both of these to exist by name: [Build 07](../build-07-widget-configuration/) builds its two widget variants on top of them.

---

## Step 6 — Set up one routing rule with a `direct_answer` (20 min)

Aurora's returns policy is exactly the kind of predictable, unchanging FAQ intent Routing exists for. The content lives in `support/returns-policy.md`. Read it first (dashboard resource browser or the raw file) so your `direct_answer` text is actually accurate to the corpus.

> **Routing is widget-builder work too.** `RoutingConfig` is a `camelCase` configuration object, not an `/ask` request-body parameter. Set the rule in the widget builder's routing section and test it in the preview. The JSON below is the shape the configuration stores — read it as the structure you're filling in on the form, not as a request body to paste into curl.

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "what is Aurora'\''s return policy",
    "useRouting": true,
    "routing": {
      "rules": [
        {
          "prompt": "the user is asking about Aurora Outfitters'\'' return or refund policy",
          "direct_answer": "Aurora Outfitters accepts returns within 90 days of delivery, in resale condition with original packaging and receipt. Hiking boots and packs also qualify for the 90-day wear-test promise even if worn. See the Returns Policy page for full exclusions and process details."
        }
      ]
    }
  }'
```

Run *"what is Aurora's return policy"* in the preview and confirm two things:

1. The answer text is your exact `direct_answer` string, verbatim, not a fresh generation.
2. It comes back noticeably faster than Step 1's baseline — a strong sign generation was skipped, the same latency signal you used in Step 3 to tell `hideAnswer` from `generate_answer: false`.

Now prove the rule is scoped to the intent it should be, not everything, by running an unrelated query through the same preview:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "what boot handles wet rock best",
    "useRouting": true,
    "routing": {
      "rules": [
        {
          "prompt": "the user is asking about Aurora Outfitters'\'' return or refund policy",
          "direct_answer": "Aurora Outfitters accepts returns within 90 days of delivery, in resale condition with original packaging and receipt. Hiking boots and packs also qualify for the 90-day wear-test promise even if worn. See the Returns Policy page for full exclusions and process details."
        }
      ]
    }
  }'
```

This should generate a normal answer about boots — the rule should not fire. If it *does* fire on the boot question, your rule prompt is scoped too broadly (the lesson's gotcha, now observed firsthand); tighten the wording (e.g. add "not about products or gear") and re-test both queries again.

Try two or three more phrasings of the returns question ("can I send this back," "I want a refund," "60 day return window right?") to confirm the rule catches genuine rewordings of the same intent, not just your exact original phrasing.

---

## Step 7 — Save your prompts (5 min)

Add to (or create) `prompt-log.md` in your project folder: paste any prompts you used to debug a routing rule that fired too broadly, or a citation threshold that hid citations you expected to see. Also paste the request body the **Get code** button emits for `shopper_display` — that is the artifact a customer's backend team actually needs.

---

## Verification checklist

- [ ] Shopper view built **in the Result Display tab** and confirmed in the preview: answer + citation-only list, no metadata, no field list.
- [ ] `hideAnswer` (dashboard) vs. `generate_answer: false` (API) tested side by side — same visible outcome, different generation cost/latency.
- [ ] Staff view built and confirmed: `all-resources`, metadata visible, `relations`/`relationGraph` on, `citationThreshold` raised.
- [ ] `shopper_display` and `staff_display` search configurations created, and each verified **in the dashboard preview** — not by reading a JSON response.
- [ ] One routing rule created on the widget configuration with a `direct_answer` for the returns-policy intent — confirmed it returns the exact canned string, faster than generation.
- [ ] Confirmed the rule does **not** fire on an unrelated query (boot recommendation).
- [ ] Confirmed the rule fires on at least two rewordings of the intended intent, not just the original trigger phrase.
- [ ] `prompt-log.md` updated.

Then take the [Build 05 quiz](3-quiz.md). Pass → start [Build 06](../build-06-rag-lab-and-prompt-lab/).

---

## Getting unstuck

| Error / symptom | Likely cause | Fix |
|---|---|---|
| `relations`/`relationGraph` show empty on every result | No `graph_beta` extraction has run on this KB yet (Build 03) | Expected if you haven't done Build 03 — the display switch works, there's just nothing extracted to show |
| `citationThreshold: 0.7` returns zero citations | Corpus's real relevance scores for that query sit below 0.7 | Lower the threshold in steps (0.5, 0.3) until citations reappear; treat that as the real floor |
| `hideAnswer` and `generate_answer: false` look identical to the end user | That's expected — both remove the visible answer | Compare latency or check your dashboard's usage panel; only `generate_answer: false` skips the LLM call. Note they live on different surfaces: `hideAnswer` on the widget config, `generate_answer` on the request |
| Routing rule never fires, even on the exact trigger phrase | `useRouting` is off, or you sent the rule in a curl body instead of setting it on the widget configuration | Confirm `useRouting` is on and sits alongside `routing`, not nested inside it — and that you are testing in the widget preview |
| Routing rule fires on unrelated queries | Rule `prompt` is scoped too broadly | Narrow the wording — add explicit exclusions ("not about products or gear") and re-test |
| `direct_answer` text doesn't match what you wrote | A different rule in the array matched first, or cached response from an earlier test | Re-check rule order/wording; re-run with a fresh query string to rule out response caching |
| `POST /search_configurations/{name}` returns 404 | KB ID in `.env` doesn't match the KB you're testing against | Re-check `NUCLIA_KB_ID` |

## Next

[Build 06 — RAG Lab & Prompt Lab](../build-06-rag-lab-and-prompt-lab/) — compare models, prompts, and RAG strategies side by side before anything you configured in Builds 01–05 goes to production.
