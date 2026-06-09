# Atlas Operations Corpus

> **Mirrored from [github.com/jaysanderson/Capstone-Atlas-Operations](https://github.com/jaysanderson/Capstone-Atlas-Operations) → `/corpus/`.** This copy lives in the framework so partners can browse the seed corpus, labelsets, and anchor entities without cloning the reference app repo. The canonical source is the capstone repo — if you spot a drift between this folder and the upstream, raise it against the capstone repo (where the seed scripts and the runtime app also live).
>
> Everything you need to provision a Knowledge Box so the [Capstone-Atlas-Operations](https://github.com/jaysanderson/Capstone-Atlas-Operations) reference app works.
>
> **TL;DR:** create a Knowledge Box → in the dashboard, use **Upload folder** with the **"use folder names as label names"** option on `corpus/business_unit/` → register the graph extraction agent → run the app. No scripts required.

The app at `https://capstone-atlas-operations.fly.dev/` (or your local `npm run dev`) reads from one Knowledge Box. This guide tells you how to seed it.

---

## Step 1 · Provision the Knowledge Box

In the Progress Agentic RAG dashboard:

| Setting | Value |
|---|---|
| KB name | `kb-atlas-operations` (any name works; the app reads the UUID) |
| Region | Whichever region is closest to you geographically. The reference build uses EU; use the same region for everything you provision in the course. |
| Visibility | Private |

After creation, copy three values from the dashboard:

1. **API URL** — e.g. `https://aws-eu-1.rag.progress.cloud/api/v1`
2. **KB UUID** — the resource identifier in the URL after `/kb/`
3. **Service-account JWT** — create one with `read+write` scopes from the KB's Service Accounts panel.

Paste them into `.env`:

```bash
cp .env.example .env
# Edit .env, fill in VITE_NUCLIA_API_URL, VITE_NUCLIA_KB_ID, VITE_NUCLIA_API_KEY
```

---

## Step 2 · Upload the corpus folder (no scripts)

The corpus ships pre-organised by business unit. Each subfolder name under `corpus/business_unit/` will become a label on the `business_unit` labelset when you upload with Progress Agentic RAG's folder-as-labels feature.

```
corpus/
└── business_unit/
    ├── compliance/        (60 docs)
    ├── customer_success/  (70 docs)
    ├── engineering/       (64 docs)
    ├── hr/                (60 docs)
    └── sales/             (66 docs)
```

In the Progress Agentic RAG dashboard:

1. Open your Knowledge Box → **Resources** → **Upload** → **Upload folder** (exact wording varies; look for an "Upload folder" option, not the single-file uploader).
2. Pick the **`corpus/business_unit/`** folder on your machine.
3. Enable the **"Use folder names as label names"** option (the exact label varies by tenant; look for a checkbox or toggle that says "folder names as labels" or "auto-label from folders"). With that enabled, Progress Agentic RAG takes the parent folder name (`business_unit`) as the labelset name and the subfolder names (`hr`, `engineering`, etc.) as the label values applied to every document inside.
4. Confirm and start the upload. Progress Agentic RAG processes all 320 documents.
5. Wait for ingest to complete. The dashboard's progress indicator shows resource count climbing.

That's it. No scripts, no env vars, no terminal commands. Once ingest finishes, every document in your Knowledge Box has the `business_unit` labelset applied automatically, with the right label per document derived from which subfolder it lived in.

### What the app does with these labels

The reference app uses `business_unit` to scope results to a specific BU on the search and concierge surfaces (e.g. *"engineering incidents only"*) and seeds the composite-RAG graph traversal from BU-specific seed entities. Without the labelset applied, those filter UIs surface every doc regardless of BU.

### What about the other Atlas labelsets?

Earlier iterations of this corpus shipped with three labelsets (`business_unit`, `content_type`, `region`). The capstone now scopes to **one labelset** (`business_unit`) for the citizen-developer-friendly drag-drop path — Progress Agentic RAG's folder-to-labelset auto-apply is flat (one labelset name + a list of labels), not multi-dimensional, so a single drag-drop applies one labelset cleanly.

YAML frontmatter inside each `.md` file still carries `content_type` and `region` values for descriptive reference; they're documentation, not enforced labelsets. Partners who want to add those labelsets back can do so via the dashboard's labelset editor after ingest, or via the optional seed script below.

### Optional · Programmatic ingest via seed script

For partners scaling beyond the bundled 320 docs (e.g. after running `progress-kb-use-case-generator` to produce a larger corpus) or who want to apply additional labelsets programmatically, the `scripts/seed-kb.mjs` script POSTs documents directly to the Progress Agentic RAG API with full classification metadata read from frontmatter:

```bash
npm run seed -- --dry-run   # preview (lists slug + labels per file)
npm run seed                # apply
```

The script is the fallback for the long-tail; **drag-and-drop is the default path** for the capstone.

---

## Step 3 · Configure the graph extraction agent

The agent schema is in [`../scripts/graph-agent.py`](../scripts/graph-agent.py). Two ways to register:

### Via dashboard (recommended for non-Manager-tier tenants)
```bash
python ../scripts/graph-agent.py --print > /tmp/atlas-graph-agent.json
# Open the dashboard → KB → Augmentation → Graph
# Paste contents of /tmp/atlas-graph-agent.json into the configuration panel
# Save → Run extraction
```

### Via API (Manager-tier tenants only)
```bash
python ../scripts/graph-agent.py --apply
```

### Entity types (10)

`EMPLOYEE`, `PRODUCT`, `CUSTOMER`, `INCIDENT`, `REGULATION`, `POLICY`, `RUNBOOK`, `BUSINESS_UNIT`, `REGION`, `ROLE`.

> **App expectations:** the graph viewer (`/graph` route) seeds from `EMPLOYEE` and uses a colour palette keyed on these group names (see `src/styles/tokens.ts`). New entity types are fine — they fall back to a default colour. Removing any of these will leave the seed empty.

### Relation types (12)

`owns`, `escalated_to`, `affected`, `remediates`, `serves`, `purchased`, `complies_with`, `governs`, `located_in`, `has_role`, `learned_from`, `mentions`.

> **App expectations:** the composite-RAG flow on `/incident-root-cause` follows `affected`, `remediates`, and `learned_from` edges in particular. The graph viewer's grouped-paths sidebar groups by relation label.

### The data-augmentation filter

Every graph query the app sends is wrapped in `{ prop: "generated", by: "data-augmentation" }`. This excludes default NER (DATE, MONEY, ORG, PERSON, etc.). The agent schema above is what produces *your* custom entities; the filter scopes results to them.

### Extraction wait

Roughly 1-2 minutes per document.

### Verify
```bash
npm run verify:graph -- --dry-run   # prints the query body
npm run verify:graph                # runs it
```

Brief targets: **≥200 nodes, ≥500 relations.** A bundled 320-doc corpus typically produces 60-90 nodes / 150-250 relations — sufficient for demo. To hit the brief's target volumes, scale the corpus to 1,000+ docs (run `progress-kb-use-case-generator` using `anchors.json` as input, drop output into the matching `business_unit/<bu>/` folders, re-run ingest).

---

## Step 4 · App-side expectations per route

If the Knowledge Box matches the spec above (corpus ingested, graph agent registered), every route in `Capstone-Atlas-Operations` should render meaningful results.

| Route | What it expects | What it shows when KB is empty |
|---|---|---|
| `/` (landing) | Reads residency badge + live ingested-corpus stats | Always renders; stats show zero |
| `/search` | `/find` with optional `business_unit` filter | "No matches" cards |
| `/concierge` | Streaming `/ask` with system prompts | Empty stream + error |
| `/workflows` | Three `askForJson` calls with locked JSON schemas | Schema validation error |
| `/graph` | Seeds from `EMPLOYEE` group via `queryNodesByGroup`; expands via `queryPaths` | "Graph empty — configure agent" placeholder |
| `/incident-root-cause` | Composite-RAG: `/ask` → eval → `/find` → graph → re-ask. Seeds from `INC-2028-0019` + `Atlas BuildingHub` entities. | Pipeline runs but skips graph step |
| `/ops` | Mock metrics — no KB calls | Always renders |

---

## Step 5 · Verification

```bash
# Confirm graph populated and clean of NER noise
npm run verify:graph

# Walk the app
npm run dev
# → http://localhost:5173/
```

### The 5 routes worth eyeballing before the review-board demo

1. `/search` — query *"What's the maintenance interval for the E-220 turbine?"* → should return runbook + design-doc results scored above 0.6.
2. `/concierge` — Employee voice + Architect voice should produce visibly different responses to the same query.
3. `/workflows` — Compliance-Trace with input *"EU AI Act"* should return populated `governed_products` and `outstanding_audit_findings` arrays.
4. `/graph` — initial load should show ~10 `EMPLOYEE` nodes with their `owns` / `serves` / `escalated_to` neighbours.
5. `/incident-root-cause` — `INC-2028-0019` should produce a 4-step pipeline with confidence promotion from low (after step 1) to grounded (after step 4).

---

## Step 6 · Production deploy

After local validation:

```bash
fly secrets set \
  VITE_NUCLIA_API_URL="..." \
  VITE_NUCLIA_KB_ID="..." \
  VITE_NUCLIA_API_KEY="..."

fly deploy --ha=false \
  --build-arg VITE_NUCLIA_API_URL="$NUCLIA_API_URL" \
  --build-arg VITE_NUCLIA_KB_ID="$NUCLIA_KB_ID" \
  --build-arg VITE_NUCLIA_API_KEY="$NUCLIA_API_KEY"
```

(Vite bakes env at build time; `--build-arg` is required even with `fly secrets`.)

---

## See also

- `../KB_SETUP.md` — same flow expressed as a one-page checklist.
- `../DEMO.md` — 25-minute demo script that walks the app post-ingest.
- `../RESKIN.md` — how to swap Atlas for a customer's domain while preserving the chassis.
- [`anchors.json`](./anchors.json) — the locked Atlas entities every doc references.
- [`labelsets.json`](./labelsets.json) — machine-readable label schema (one labelset: `business_unit`).
