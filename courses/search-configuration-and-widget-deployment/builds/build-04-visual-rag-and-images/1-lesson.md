# Build 04 — Lesson: Visual RAG & Images

> Read time: 10 minutes.

## Why this is in the course

Build 03's seven `rag_strategies` all do one thing: turn matched *text* into better *text* context. None of them help when the answer isn't in the text at all — it's in a diagram, a labeled illustration, a map. A spec sheet that says "see Figure 2" and then shows an exploded parts diagram has an answer no text strategy will ever recover, because the answer was never words. `rag_images_strategies` is the parallel parameter family for exactly this case.

## The two strategies

> **`page_image`.** Appends images present on the same page as the matched paragraph. Use it when a page has general visual context that supports the whole page's text — a photo alongside a product description, a diagram near an overview paragraph — and you want the model to see everything on that page, not just the one image closest to the matched text.

> **`paragraph_image`.** Appends images present next to the matched paragraph specifically. Use it when a document has multiple images per page, each tied to a specific paragraph, and pulling in every image on the page would add noise from figures unrelated to what matched.

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "Describe the diagram on this page.", "rag_images_strategies": [{"name": "page_image"}]}'
```
```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{"query": "Describe the diagram on this page.", "rag_images_strategies": [{"name": "paragraph_image"}]}'
```

> **Gotcha.** These are a separate parameter from `rag_strategies` (Build 03) — you can combine both families in one call, but setting `rag_strategies` alone does nothing for images and vice versa. And like `full_resource` in Build 03, image context is expensive: every image strategy call sends the model image data, not just text, which costs more and takes longer than a text-only call. Reach for these deliberately, for documents where you've confirmed the answer is genuinely visual — not as a default.

## `useImages` and `imageUsage`

From Build 02's `GenerativeAnswerConfig` (briefly mentioned there, covered in full here):

- **`useImages`** (boolean) — whether images factor into the `/ask` call at all. This is the on/off switch; `rag_images_strategies` controls *which* images get pulled in once it's on.
- **`imageUsage`** (`query | context`) — `context` means images are used to help generate the answer (the normal case — what this Build focuses on). `query` means an image is treated as part of the *input query itself* — a different use case (e.g. "what is this?" with an attached photo), not the spec-sheet scenario this Build covers.

## When text `rag_strategies` genuinely isn't enough

Before reaching for image strategies, ask whether Build 03 would have solved it: a `hierarchy` strategy prepending a title, or `neighbouring_paragraphs` pulling in the next paragraph, is cheaper than an image call and might be all you need if the answer is describable in words *anywhere* in the document. Image strategies are for the narrower case where the answer is only expressible visually — a part's physical location on a diagram, the shape of a route on a map, a comparison table rendered as an image rather than parsed text. The walkthrough's two PDFs were built with exactly that distinction in mind: one page needs general page context (`page_image`), one page has an answer tied to one specific paragraph's adjacent figure (`paragraph_image`), and neither would resolve correctly from text alone, no matter which Build 03 strategy you threw at it.

## What's next

[Build 05 — Result Display & User Intent Routing](../build-05-result-display-and-intent-routing/) — now that retrieval, generation, and context construction (text and visual) are all tuned, the next question is how results actually render for different audiences.
