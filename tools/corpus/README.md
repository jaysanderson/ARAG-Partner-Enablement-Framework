# Corpus generators

Scripts that (re)generate binary corpus assets under
`courses/developer-foundations/builds/build-00-hello-arag/corpus/`.

## `build-tmb-topo-guide.py`

Rebuilds `content_type/spec_sheet/tour-du-mont-blanc-topo-guide.pdf`.

**Why this exists.** [Build 04](../../courses/search-configuration-and-widget-deployment/builds/build-04-visual-rag-and-images/2-walkthrough.md)'s
Step 3 teaches the difference between the `page_image` and `paragraph_image`
RAG image strategies. That contrast is only observable on a page carrying **more
than one image** — on a single-image page the two strategies return the same
thing and the exercise proves nothing.

So this PDF has a structural requirement, not just a content one:

> **Page 4 must carry both Figure 4 (the Days 7–10 relief map) and Figure 5 (the
> full-route elevation profile), each with its caption.**

An earlier revision had Figure 5 on page 5, which silently broke the exercise.
If you re-lay out this document, keep those two figures together on one page, or
Build 04 Step 3 stops working.

The walkthrough also leans on two facts that exist **only inside the images**,
never in the extractable text — the waypoint labels *Trient* and *Tre-le-Champ*
(Figure 4) and the ~2,500 m peak height (Figure 5). Don't add either to the prose.

**Running it.** Needs `reportlab` and `pillow`. It expects the five original
images as `tmb_full_1.png` … `tmb_full_5.png`; extract them from the current PDF
rather than redrawing them, so the artwork stays identical:

```bash
TMB_IMG_DIR=./tmb-images python3 build-tmb-topo-guide.py
```
