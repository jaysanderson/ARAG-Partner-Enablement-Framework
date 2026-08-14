# Build 0 Sample Corpus

Two folder-organised corpora ship with Build 0 so students learn Progress Agentic RAG's **Upload folder** ingest flow with the **"use folder names as label names"** option from the very first build. Same structure the Build 13 capstones use; same workflow students will run when they ship their capstone.

```
corpus/
├── content_type/    (48 files — Aurora Outfitters; the primary Build 0 corpus)
│   ├── ambassador_video/  (5 md + 2 mp4)
│   ├── brand_story/       (4 md + 1 docx + 1 pptx)
│   ├── gear_review/       (6 md + 1 pdf)
│   ├── loyalty_benefit/   (4 md + 1 pptx)
│   ├── podcast/           (2 mp3)
│   ├── product/           (7 md)
│   ├── support/           (4 md + 1 pdf + 1 docx)
│   └── trail_guide/       (7 md)
└── business_unit/   (320 docs — Atlas Global Industries; secondary, larger)
    ├── compliance/
    ├── customer_success/
    ├── engineering/
    ├── hr/
    └── sales/
```

## Build 0 uses `content_type/`

The Build 0 walkthrough instructs students to upload the `content_type/` folder (47 outdoor-retail documents) using the dashboard's **Upload folder** option with the **"use folder names as label names"** toggle enabled. Progress Agentic RAG auto-creates the `content_type` labelset with eight labels (`product`, `trail_guide`, `podcast`, etc.) and applies the matching label to each document based on its parent folder.

The corpus mixes formats deliberately: **37 markdown + 10 binary files** (2 PDF, 2 DOCX, 2 PPTX, 2 MP3, 2 MP4). Progress Agentic RAG auto-OCRs PDFs, extracts text from DOCX and PPTX, and transcribes audio + video with Whisper at ingest — students see all of this happen during the Build 0 upload.

47 documents is small enough to ingest in a few minutes during a Build 0 session and large enough to demonstrate meaningful retrieval across varied content and formats.

## `business_unit/` is available for partners who want a larger corpus

The Atlas `business_unit/` folder (320 documents across five enterprise business units) is mirrored here for partners who want to:

- Practise the Upload-folder workflow against a meatier corpus.
- Run Build 8's graph-extraction exercises (~60–90 nodes / ~150–250 relations against the bundled set, vs ~50–75 / ~120–180 for the Aurora corpus).
- Provision a second Knowledge Box for cross-corpus filter experiments.

It's **not required** for Build 0 — pick whichever your time budget supports. The walkthrough's verification steps assume `content_type/`.

## The two corpora

Both corpora ship with this course:

- `content_type/` — the Aurora Outfitters (D2C outdoor retail) corpus, also used by the Aurora Concierge capstone.
- `business_unit/` — the Atlas Global Industries (enterprise operations) corpus, also used by the Atlas Operations capstone.

They're the same corpora the two Build 13 capstone briefs use, so the patterns you learn here carry straight through to the capstone.

## Supplemental labels for Search Configuration & Widget Deployment

Three additional `content_type/` labels were added for the [Search Configuration & Widget Deployment](../../../../search-configuration-and-widget-deployment/README.md) course. They're new label folders, not additions to the eight above — Build 0's 37 markdown + 10 binary / 8-label counts above are unchanged, and Build 0's own walkthrough only ever asks students to upload the original eight.

- `content_type/spec_sheet/` (2 PDFs) — `skyline-45l-spec-sheet.pdf` and `tour-du-mont-blanc-topo-guide.pdf`, multi-page PDFs with real embedded diagrams, product illustrations, and topographic relief maps. Used in Build 04 (`visual-rag-and-images`) to demonstrate the `page_image` and `paragraph_image` RAG image strategies — strategies that need genuine multi-page image content to produce a visible difference, which is why they're PDFs rather than markdown.
- `content_type/field_notes/` (4 md) — short dispatches that state explicit ambassador → product → trail relations in prose (who tested what, where, and what it's recommended for). Used in Build 03 (`rag-context-strategies`) for a small `graph_beta` knowledge-graph extraction exercise sized for a single-session walkthrough.
- `content_type/field_demo/` (2 md) — a paired main-field / updates-field pair (`skyline-45l-warranty-main.md` + `skyline-45l-warranty-updates.md`) meant to be ingested as two fields of *one* resource via a direct API call, not folder-upload. Used in Build 03 to demonstrate the `field_extension` RAG strategy — the main field alone gives a stale answer; the strategy pulls the updates field in as context.

Not required for Build 0 or the Build 13 capstones — upload them only if you're working through Search Configuration & Widget Deployment.
