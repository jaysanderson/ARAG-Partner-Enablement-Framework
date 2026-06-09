# Video Script — Build 6: Data-Augmentation Agents

> **Duration target:** 10 minutes
> **Format:** Screen recording + voiceover. Dashboard-heavy, with one curl for each agent's verification.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 6 · Data-Augmentation Agents."* Subtitle: *"Generator. Labeller. Graph."*

**VOICEOVER:**
> Ten minutes. ARAG ships three named data-augmentation agents that enrich your KB at ingest time. Most partners only know one of them — the graph — because it has the prettiest demo. The other two are where most customer engagements actually live. By the end of this video you'll know all three as a family, and which customer signals each one solves.

## Section 1: The three agents (0:30 – 2:00)

**ON SCREEN:** Slide with three cards side by side. Each card has the agent name + a one-line description + a customer-signal quote.

```
GENERATOR        LABELLER         GRAPH
synthesises      classifies       extracts typed
derived content  resources by     entities + relations
(summaries,      labelset
Q&A pairs)
```

**Customer signals (under each card):**

- *"Search isn't finding things our answer is clearly in"* → Generator
- *"Users need to filter by content type / region / audience"* → Labeller
- *"Find the connections between X and Y"* → Graph

**VOICEOVER:**
> Three agents. Each enriches a different layer.
>
> Generator — produces derived content from your sources at ingest. Summaries. Q&A pairs. Key takeaways. The thing that fixes the *"our user's vocabulary doesn't match our document's vocabulary"* problem you'll hear in every customer's first complaint.
>
> Labeller — classifies resources and paragraphs into labelsets at ingest. The thing behind the filter chips on a search UI.
>
> Graph — extracts typed entities and relations. The thing that powers the knowledge-graph navigation Build 8 covers.
>
> All three configured per KB. All three run at ingest. All three are the platform doing work so your customer doesn't have to.

## Section 2: The Generator (2:00 – 4:30)

**ON SCREEN:** Progress Agentic RAG dashboard. Navigate to KB → Augmentation → Generator. Toggle on. Configure outputs: summary + Q&A pairs. Optional prompt template field — type a sensible default. Save.

Then jump to a terminal. Run a curl against `/resource/{id}` for a known resource. Highlight the new fields under `data.texts` — `summary`, `qa_pairs` — that didn't exist before (use post-production overlays since the response is raw JSON).

**VOICEOVER:**
> The Generator. Enable in the dashboard. Choose outputs — summary, Q&A pairs. Optional prompt template if you want to nudge style.
>
> Once it runs over your documents, fetch any resource. New fields appear — `summary`, `qa_pairs`. These are derived content. They get indexed alongside the original. Retrieval matches against them too.
>
> The customer impact — users ask in their language; the corpus has the answer in technical language; retrieval finds the Q&A pair the generator synthesised that uses both. The user gets a hit. Your customer's "search is broken" complaint quiets down.
>
> The cost — ingest takes longer because each document gets an LLM call to produce the derivations. Billed to your BYO-LLM endpoint. Worth it.

## Section 3: The Labeller (4:30 – 6:30)

**ON SCREEN:** Dashboard → Augmentation → Labeller. Create a labelset named `topic`, add 6 labels. Choose model-based mode. Paste a prompt: *"Classify this document into ONE of these topics: {labels}. Reply with just the label name."* Save and run.

Then a curl to `/labelsets` showing the labelset exists. Then a curl to a specific resource showing the assigned label under `classifications`.

**VOICEOVER:**
> The Labeller. Same dashboard area. Create a labelset — name `topic`, six labels. Pick model-based mode. Give it a prompt — "classify this document into one of these topics."
>
> Run. Verify — hit `/labelsets`, the labelset exists. Hit `/resource/{id}`, the label is assigned.
>
> Build 7 — next video — is where the labeller's output becomes a search UI. Filter chips. Sidebar facets. The user's search-bar experience.
>
> The labeller also supports rule-based mode — regex on file paths, metadata heuristics. Cheap and deterministic when your labels can be inferred from structure. Use rules where you can; use the model where you must.

## Section 4: The Graph agent (6:30 – 8:30)

**ON SCREEN:** Dashboard → Augmentation → Graph. Define entity types — 6 of them (e.g., `PERSON`, `PRODUCT`, `LOCATION`, `EVENT`, `ORGANIZATION`, `CONCEPT`). Define relation types — 6 of them. Save and run.

Then curl to `/graph` with the data-augmentation filter from Build 1. Show 5 path triples. Highlight that source + destination have `type` and `group`; relation has `label`.

**VOICEOVER:**
> The Graph agent. Same dashboard area. Define entity types — six to start. Define relation types — six. Save. Run extraction.
>
> Then query the graph. Wrap the query in the data-augmentation filter from Build 1 — `prop: generated, by: data-augmentation`. Forget that filter and your results are full of default-NER noise. Always include it.
>
> Five path triples come back. Source entity. Relation. Destination entity. Typed. Queryable.
>
> Build 8 — the build after Smart Filters — is the deep dive. We'll build a navigable graph viewer there.

## Section 5: Composition — when to reach for which (8:30 – 9:30)

**ON SCREEN:** Same three-card slide from Section 1, but with a pharma customer scenario overlaid:

> *"Our clinical trial documents use jargon our medical-affairs team doesn't know."* → **Generator**
>
> *"Our 12,000 trial reports need filtering by phase, indication, regulator."* → **Labeller**
>
> *"We want to find investigators who ran trials on both COMPOUND-X and COMPOUND-Y."* → **Graph**

**VOICEOVER:**
> One customer. Three concerns. Three agents.
>
> Pharma example. Vocabulary mismatch — Generator. Filtering 12,000 documents — Labeller. Cross-compound investigator search — Graph.
>
> Real customers usually need all three. When you hear "we want better search" — listen for which of these three signals is buried in the request. Often you'll find more than one. That's a Tier 3 or Tier 4 conversation opening.

## Wrap (9:30 – 10:00)

**ON SCREEN:** End card. *"Build 7 — Smart Filters & Labelsets. Next: the Labeller in action."*

**VOICEOVER:**
> Build 7 is next. The Labeller's output becomes a working search UI with filter chips. Eight minutes. See you there.

---

## Production notes

- **Dashboard navigation:** the path to the augmentation panels varies by tenant tier. Pre-rehearse so you don't fumble on camera. If your tenant doesn't expose the configuration UI, narrate the equivalent API call.
- **Section 1 slide:** the three-card layout is the headline visual of this entire Build. Make it stick — partners will recall this layout in customer meetings.
- **Section 5 composition example:** swap the pharma example for whatever vertical fits your audience. The pattern is what matters.
- **No vibe-coding in this video:** this is the rare Build that's mostly platform configuration. Don't fabricate code to fill time.
