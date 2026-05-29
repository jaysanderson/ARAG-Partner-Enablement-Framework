# Outpost Trails — Foundations Course Corpus

> 22 markdown documents you upload to your sandbox KB in Build 0. **Use this corpus across Builds 0–12.** Every walkthrough's "you should see" check is calibrated against this content.

## Why this corpus

Build 0's walkthrough originally said *"find ~10 documents from your company."* Every student ended up with a differently shaped KB — which meant Build 7's filter chips, Build 9's CTAs, and Build 6's graph extraction landed differently for everyone. This pack fixes that.

The fictional brand is **Outpost Trails** — a D2C outdoor retailer. The vocabulary is rich enough that hybrid retrieval lands cleanly, the entity surface is dense enough that Build 6's Graph agent has something to extract, and the content has the natural CTA / labelset / cross-reference shape every later Build assumes.

## How to upload

1. In Build 0, after you've created your KB (Walkthrough Step 1), come back here.
2. Open this `corpus/` folder. You'll see 22 `.md` files.
3. Drag them all into the Nuclia dashboard's upload zone.
4. Wait for all 22 to show **indexed**.

That's it. You now have a Build-ready KB.

## What's in the pack

| Cluster | Files | Purpose |
|---|---|---|
| **Hero products** (5) | `01-product-terratrek-7.md`, `02-product-skyline-45l.md`, `03-product-helios-jacket.md`, `04-product-cumulus-2p-tent.md`, `05-product-quill-850-quilt.md` | These are your Build 9 `callToAction` targets. Each describes one hero product. |
| **Trail guides** (4) | `06-guide-tasmania-overland.md` through `09-guide-annapurna-circuit.md` | Long-form content the Build 5 taxonomy generator picks up as a distinct domain. |
| **Ambassador content** (3) | `10-ambassador-mara-chen.md`, `11-ambassador-jonah-reyes.md`, `12-ambassador-theo-sundberg.md` | Entity-rich for Build 6 graph extraction. |
| **Gear reviews** (3) | `13-review-terratrek-7.md`, `14-review-skyline-45l.md`, `15-review-helios-rating.md` | Cross-reference the hero products — exercises Build 10 composite-RAG (single-shot misses some sources; composite finds them). |
| **Loyalty + brand** (2) | `16-loyalty-trail-club.md`, `17-repair-for-life-programme.md` | Audience-segmentation content (members vs shoppers) — Build 7 filter facet. |
| **Sustainability** (2) | `18-carbon-negative-2030.md`, `19-repairable-for-life-manifesto.md` | Distinct topic cluster. |
| **Support** (2) | `20-returns-policy.md`, `21-sizing-guide.md` | The "policy" labelset bucket for Build 6 Labeller + Build 7. |
| **Safety** (1) | `22-altitude-acclimatisation.md` | Singleton — exercises Build 7 "topic with only one match" behaviour. |

## How later Builds use it

- **Build 1 (Five Primitives)** — query against any cluster; cite by `best_matches`. Easy wins on questions like *"what's the warmest jacket?"* or *"who is Mara Chen?"*
- **Build 4 (Multilingual)** — try the language switcher on the trail-guide content. *"Cuéntame sobre la travesía de Tasmania."*
- **Build 5 (Structured Outputs)** — the taxonomy generator returns ~7 clusters (products, guides, ambassadors, reviews, loyalty, sustainability, support, safety). The FAQ generator grounds in real titles. The comparison generator handles the 5 hero products cleanly.
- **Build 6 (Data-Augmentation Agents)** — Graph agent extracts: ambassadors, products, destinations, brand pillars. Labeller assigns one of `topic ∈ {product, guide, ambassador, review, loyalty, sustainability, support, safety}`.
- **Build 7 (Smart Filters)** — content-type chip filters (mimetype is markdown for all docs — chips show "Docs" only by default; use the labelset facet instead).
- **Build 8 (Knowledge Graph)** — typed entities are non-trivial; click TerraTrek 7 and traverse `featured_in` → Mara Chen's guide.
- **Build 9 (Field Engineering)** — the 5 hero products are your `callToAction` targets. Suggested copy is in each product file's footer comment.
- **Build 10 (Composite RAG)** — five hard queries listed below.

## Suggested hard queries (Build 10)

These deliberately stretch single-shot retrieval. Composite RAG should noticeably outperform on most of these:

1. *"Which jacket should I take to Patagonia in October?"* — needs Helios spec + Patagonia guide.
2. *"What's Mara Chen's gear pick for Tasmania?"* — needs ambassador + trail guide + product.
3. *"Are any of your products carbon-negative?"* — needs sustainability manifesto + product specs.
4. *"What's covered under Repair for Life?"* — needs loyalty doc + brand manifesto.
5. *"How do I size the TerraTrek 7 for wide feet?"* — needs product page + sizing guide.

## Suggested hero `callToAction` values (Build 9)

When you reach Build 9, here's a starting point. Refine with your own voice.

| File | Suggested `callToAction` |
|---|---|
| `01-product-terratrek-7.md` | `Try the TerraTrek 7 risk-free for 90 days → https://example.com/p/terratrek-7` |
| `02-product-skyline-45l.md` | `Spec your Skyline 45L for your next thru-hike → https://example.com/p/skyline-45l` |
| `03-product-helios-jacket.md` | `Get the Helios in time for winter → https://example.com/p/helios` |
| `04-product-cumulus-2p-tent.md` | `Pitch the Cumulus 2P this weekend → https://example.com/p/cumulus-2p` |
| `05-product-quill-850-quilt.md` | `Sleep warmer with the Quill 850 → https://example.com/p/quill-850` |

## Notes

- All documents are short (200-400 words). Real customer corpora are longer; this is course-grade content sized for fast indexing on a sandbox.
- Cross-document references are deliberate. Mara Chen mentions the TerraTrek 7. The Patagonia guide references the Helios. This is what makes graph extraction interesting.
- Filenames are numbered so the Nuclia dashboard's resource list stays orderly. You don't need to preserve this; ingest in any order.
