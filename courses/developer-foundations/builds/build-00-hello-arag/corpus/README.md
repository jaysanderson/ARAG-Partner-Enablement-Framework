# Build 0 Sample Corpus

Two folder-organised corpora ship with Build 0 so students learn Nuclia's **Upload folder** ingest flow with the **"use folder names as label names"** option from the very first build. Same structure the Build 13 capstones use; same workflow students will run when they ship their capstone.

```
corpus/
├── content_type/    (37 docs — Aurora Outfitters; the primary Build 0 corpus)
│   ├── ambassador_video/
│   ├── brand_story/
│   ├── gear_review/
│   ├── loyalty_benefit/
│   ├── product/
│   ├── support/
│   └── trail_guide/
└── business_unit/   (320 docs — Atlas Global Industries; secondary, larger)
    ├── compliance/
    ├── customer_success/
    ├── engineering/
    ├── hr/
    └── sales/
```

## Build 0 uses `content_type/`

The Build 0 walkthrough instructs students to upload the `content_type/` folder (37 outdoor-retail documents) using the dashboard's **Upload folder** option with the **"use folder names as label names"** toggle enabled. Nuclia auto-creates the `content_type` labelset with seven labels (`product`, `trail_guide`, etc.) and applies the matching label to each document based on its parent folder.

37 documents is small enough to ingest in a few minutes during a Build 0 session and large enough to demonstrate meaningful retrieval against varied content.

## `business_unit/` is available for partners who want a larger corpus

The Atlas `business_unit/` folder (320 documents across five enterprise business units) is mirrored here for partners who want to:

- Practise the Upload-folder workflow against a meatier corpus.
- Run Build 8's graph-extraction exercises (~60–90 nodes / ~150–250 relations against the bundled set, vs ~50–75 / ~120–180 for the Aurora corpus).
- Provision a second Knowledge Box for cross-corpus filter experiments.

It's **not required** for Build 0 — pick whichever your time budget supports. The walkthrough's verification steps assume `content_type/`.

## Canonical source

Both corpora are mirrored from the capstone reference repos:

- `content_type/` ← [Capstone-Aurora-Concierge/corpus/content_type/](https://github.com/jaysanderson/Capstone-Aurora-Concierge/tree/main/corpus/content_type)
- `business_unit/` ← [Capstone-Atlas-Operations/corpus/business_unit/](https://github.com/jaysanderson/Capstone-Atlas-Operations/tree/main/corpus/business_unit)

The mirror in Build 0 is for convenience — students get a working corpus the moment they clone the framework. If you spot drift, the canonical sources are the capstone repos.
