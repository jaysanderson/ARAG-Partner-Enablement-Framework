# Build 04 — Walkthrough: Visual RAG & Images

> Estimated time: 2 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

Comparison calls against two real multi-page PDFs — `skyline-45l-spec-sheet.pdf` and `tour-du-mont-blanc-topo-guide.pdf` — that only answer correctly with image strategies enabled, plus one contrast test that shows `page_image` and `paragraph_image` pulling in genuinely different images from the same page.

## What you'll need open

- Your `.env` from Developer Foundations.
- A terminal.
- Your dashboard, to confirm ingest.

---

## Step 1 — Ingest the visual corpus (10 min)

Both PDFs live in `content_type/spec_sheet/` in your Build 0 corpus — a new label folder added for this course, not part of Build 0's original count. If you haven't already, upload it via the dashboard's Upload folder flow (same "use folder names as label names" pattern from Build 0):

```
courses/developer-foundations/builds/build-00-hello-arag/corpus/content_type/spec_sheet/
├── skyline-45l-spec-sheet.pdf          (4 pages, 3 embedded images — one per page, pages 1-3)
└── tour-du-mont-blanc-topo-guide.pdf   (5 pages, 5 embedded images — page 4 carries two, which Step 3 needs)
```

Wait for processing — image-heavy PDFs take longer than plain markdown. Confirm both resources show as processed in the dashboard's resource browser before continuing.

---

## Step 2 — A question text alone can't answer (20 min)

The Skyline 45L spec sheet's page 1 has an exploded construction diagram with seven numbered callouts. Some of them restate things the prose also says — callout 5 ("Side compression straps, 3x per side") is repeated verbatim in the page 2 materials table, so it makes a *bad* test. Two callouts are genuinely image-only:

- **6 — Stretch-mesh water-bottle pocket**
- **7 — Hydration reservoir port**

Neither "hydration" nor "bottle" appears anywhere in the document's text, on any page. That makes them the honest test of whether the model is actually reading the diagram.

```bash
# No image strategy — the model can only work from OCR'd/extracted text
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "Does the Skyline 45L have a hydration reservoir port and a water-bottle pocket? Answer from the construction diagram."}'

# With page_image
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "Does the Skyline 45L have a hydration reservoir port and a water-bottle pocket? Answer from the construction diagram.", "rag_images_strategies": [{"name": "page_image"}]}'
```

**Expected result:** without the image strategy the model has nothing to work from — it should say the document doesn't mention either feature, or hedge. With `page_image` it reads callouts 6 and 7 off the diagram and confirms both, describing the bottle pocket as stretch-mesh. That gap is the whole point of this Build: no Build 03 text strategy can recover this, because the fact was never words.

> **Try the bad test too, once.** Re-run both calls asking *"how many side compression straps per side?"* instead. Both answer "3" — the no-image call gets it from the materials table. Seeing a text-answerable question produce no difference is what stops you from over-attributing a win to image strategies later.

---

## Step 3 — `page_image` vs `paragraph_image`: same page, different images (25 min)

Page 4 of the TMB topo guide is the only page in either PDF that carries **two images**: a segment relief map (Figure 4, directly under the "Days 7–10 — Final Ridge" paragraph) and a full-route elevation profile (Figure 5, under a separate paragraph further down the same page). This is the case the lesson describes: a question that matches the "Days 7–10" paragraph specifically will pull different images depending on which strategy you use.

Two facts to test against, each living in exactly one of those images:

- **Figure 4 only** — the map labels the intermediate waypoints **Trient** and **Tre-le-Champ**. Neither name appears in the document's text on any page.
- **Figure 5 only** — the profile's highest peak reaches roughly **2,500 m**. The prose says "four major climbs above 2,000 m" but never gives a peak height.

First, confirm both strategies can read the image the match lands next to — ask a Figure 4 question:

```bash
# paragraph_image — only the image adjacent to the matched paragraph
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "Which intermediate waypoints does the final ridge section of the Tour du Mont Blanc pass through?", "rag_images_strategies": [{"name": "paragraph_image"}]}'

# page_image — every image on the matched page
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "Which intermediate waypoints does the final ridge section of the Tour du Mont Blanc pass through?", "rag_images_strategies": [{"name": "page_image"}]}'
```

**Expected result:** both name Trient and Tre-le-Champ. Same answer, because Figure 4 is the image adjacent to the matched paragraph — it's inside both strategies' reach.

Now ask the Figure 5 question, still phrased so it matches the "Days 7–10" paragraph rather than the elevation-profile paragraph:

```bash
# paragraph_image — Figure 5 is on the page, but not next to the matched paragraph
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "On the final ridge section from Champex to Les Houches, roughly how high is the highest point on the route profile?", "rag_images_strategies": [{"name": "paragraph_image"}]}'

# page_image — picks up Figure 5 as well, because it is on the same page
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "On the final ridge section from Champex to Les Houches, roughly how high is the highest point on the route profile?", "rag_images_strategies": [{"name": "page_image"}]}'
```

**Expected result:** this is where they diverge. `paragraph_image` should be unable to give a peak height — the elevation profile isn't adjacent to the paragraph that matched, so it was never pulled in; expect the prose-derived "above 2,000 m" at best. `page_image` has Figure 5 in context and can read roughly 2,500 m off the chart.

That's the practical difference the lesson describes: `page_image` costs more context but doesn't depend on the match landing on exactly the right paragraph. `paragraph_image` is cheaper and sharper when every figure is tied to its own paragraph — and blind to everything else on the page.

> **Note.** Every other page in both PDFs carries exactly one image, so page 4 is the only place this contrast is visible. On a single-image page the two strategies converge — which is itself worth knowing before you promise a customer they behave differently.

---

## Step 4 — `useImages` and `imageUsage` (10 min)

Confirm the on/off switch and the `context` mode explicitly:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "Describe the Skyline 45L exploded diagram.", "useImages": true, "imageUsage": "context", "rag_images_strategies": [{"name": "page_image"}]}'
```

Then flip `useImages` to `false` with the same `rag_images_strategies` still set, and confirm the image context is dropped even though the strategy is still configured — `useImages` is the master switch.

---

## Verification checklist

- [ ] Both spec-sheet PDFs ingested and processed.
- [ ] Hydration-port / water-bottle-pocket question (callouts 6 and 7) answered only with `page_image` enabled, not without it.
- [ ] Ran the compression-straps counter-example and confirmed it makes *no* difference — the answer is in the page 2 materials table, so no image strategy is needed.
- [ ] On TMB page 4: both strategies name Trient and Tre-le-Champ (Figure 4), but only `page_image` can give the ~2,500 m peak height (Figure 5).
- [ ] Confirmed `useImages:false` disables image context even with `rag_images_strategies` still set.
- [ ] `prompt-log.md` updated.

Then take the [Build 04 quiz](3-quiz.md). Pass → start [Build 05](../build-05-result-display-and-intent-routing/).

---

## Getting unstuck

**Image strategy calls take much longer than text-only calls.**
- Expected — the model is processing image data, not just text. If it times out, try `paragraph_image` (fewer images per call) instead of `page_image`.

**The answer still seems to ignore the diagram.**
- Confirm processing actually finished — image-heavy PDFs can take several minutes. Check the resource's status in the dashboard before re-testing.
- Confirm `useImages` isn't set to `false` elsewhere (e.g. left over from a prior test in the same session).

**`rag_images_strategies` returns an error.**
- It's a separate array from `rag_strategies` — don't nest `page_image`/`paragraph_image` entries inside `rag_strategies` by mistake.

## Next

[Build 05 — Result Display & User Intent Routing](../build-05-result-display-and-intent-routing/) — now that retrieval, generation, and context (text and visual) are tuned, control how results actually render for different audiences.
