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
├── skyline-45l-spec-sheet.pdf          (4 pages, 3 embedded images)
└── tour-du-mont-blanc-topo-guide.pdf   (5 pages, 5 embedded images)
```

Wait for processing — image-heavy PDFs take longer than plain markdown. Confirm both resources show as processed in the dashboard's resource browser before continuing.

---

## Step 2 — A question text alone can't answer (20 min)

The Skyline 45L spec sheet's page 1 has an exploded construction diagram labeled with seven numbered callouts (hydration port, hip belt, compression straps, and so on) — none of those labels appear as prose anywhere else in the document.

```bash
# No image strategy — the model can only work from OCR'd/extracted text
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "How many side compression straps does the Skyline 45L have per side, according to the construction diagram?"}'

# With page_image
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "How many side compression straps does the Skyline 45L have per side, according to the construction diagram?", "rag_images_strategies": [{"name": "page_image"}]}'
```

**Expected result:** without the image strategy, the model either can't answer or guesses from the materials table's mention of "3 per side" if that text happens to match; with `page_image`, it can read the diagram's callout directly ("5  Side compression straps (3x per side)") and answer with the source correctly identified as the diagram, not the table.

---

## Step 3 — `page_image` vs `paragraph_image`: same page, different images (25 min)

Page 4 of the TMB topo guide has **two images**: a segment relief map (Figure 4, directly under the "Days 7–10 — Final Ridge" paragraph) and an elevation profile chart (Figure 5, under a separate paragraph further down the same page). This is the case the lesson describes: a question that matches the "Days 7–10" paragraph specifically will pull different images depending on which strategy you use.

```bash
# paragraph_image — only the image adjacent to the matched paragraph
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "What does the final ridge section of the Tour du Mont Blanc look like on the map?", "rag_images_strategies": [{"name": "paragraph_image"}]}'

# page_image — every image on the matched page
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" -H "content-type: application/json" \
  -d '{"query": "What does the final ridge section of the Tour du Mont Blanc look like on the map?", "rag_images_strategies": [{"name": "page_image"}]}'
```

**Expected result:** `paragraph_image` should ground its answer in the segment relief map alone. `page_image` should have access to both the segment map *and* the elevation profile chart — try a follow-up under `page_image` asking about elevation gain in the same section, and it should be answerable even though the matched paragraph wasn't the one next to that chart. That's the practical difference the lesson describes: `page_image` costs more context but doesn't depend on the match landing on exactly the right paragraph.

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
- [ ] Diagram-callout question answered correctly only with `page_image` enabled, not without it.
- [ ] `paragraph_image` vs `page_image` comparison on TMB page 4 shows a real difference in which images the model had access to.
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
