# Video Script — Build 7: Knowledge Graph 101

> **Duration target:** 12 minutes
> **Format:** Screen recording + voiceover. Dashboard + curl + AI generation + browser demo.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 7 · Knowledge Graph 101."* Cut to an attractive graph visualisation with coloured nodes and edges.

**VOICEOVER:**
> Twelve minutes. By the end you'll have a typed knowledge graph extracted from your KB, a navigable viewer, and a demo of a question that single-shot retrieval *cannot* answer. This is the Tier 4 surface — the single most differentiated capability in ARAG vs every other RAG vendor in the market.

## Section 1: What the graph is (0:30 – 2:00)

**ON SCREEN:** Diagram — unstructured documents on the left → a data-augmentation agent in the middle → typed entities + relations on the right. Examples: AMBASSADOR (Mara Chen) → presents → TALK (Tasmania trail guide); PRODUCT (TerraTrek 7) → pairs_with → PRODUCT (Skyline 45L).

**VOICEOVER:**
> Every other RAG vendor ships retrieval and a chatbot. That's the feature. ARAG ships retrieval, the chatbot, *and* a typed knowledge graph that an agent extracts from your unstructured content. Custom entity types — defined for the customer's domain. Custom relations. Queryable through one API.
>
> The graph lives inside the same KB as the documents. Same auth token, same endpoint pattern, just a different URL — slash graph.

## Section 2: The data-augmentation filter (2:00 – 3:30)

**ON SCREEN:** Two curl calls side by side. First: `/graph` query without the data-augmentation filter — output includes DATE, ORG, MONEY entities (highlighted in red). Second: same query with `{prop: "generated", by: "data-augmentation"}` — output only custom entity types (highlighted in green).

**VOICEOVER:**
> The single most important filter in this entire programme. Every graph query must include the data-augmentation property filter.
>
> Without it — left side — your graph is full of default NER noise. DATE, ORG, MONEY, every date that looks like a year, every common noun the NER model recognised. Garbage.
>
> With it — right side — only your custom entity types. The agent's output. Clean.
>
> Memorise this. Forget it once and your graph view is broken.

## Section 3: The three graph endpoints (3:30 – 5:00)

**ON SCREEN:** Three side-by-side cards. Each shows the request body + response shape for one of: paths from a node, nodes by group, fuzzy node search.

**VOICEOVER:**
> Three graph operations.
>
> One — paths from a source. `/graph` with `prop: path` and `source` set. `undirected: true` returns edges both ways. Almost always what you want.
>
> Two — nodes by entity group. `/graph/nodes` with `group: PRODUCT`. Returns all extracted products. For entity list UIs.
>
> Three — fuzzy node search. `/graph/nodes` with `value: Mara, match: fuzzy`. For autocomplete and lookup.
>
> Every request wraps the data-augmentation filter. Every request.

## Section 4: Schema design (5:00 – 6:30)

**ON SCREEN:** Slide showing three vertical schemas — legal, pharma, industrial — each with 8–12 entity types and 8–12 relation types. Annotations: "5–9 cognitive limit per group", "customer's vocabulary", "no overlap".

**VOICEOVER:**
> Schema design. A good schema has 8 to 15 entity types and 8 to 15 relation types. Less than 8 doesn't capture domain structure; more than 15 confuses both the extraction agent and the user.
>
> The names must be the customer's vocabulary. *Matter* isn't the same as *case* in every legal customer's domain. *Investigator* isn't the same as *researcher* in pharma. Get the term right.
>
> Three sample schemas — legal, pharma, industrial. You're not going to design schemas in this video; you'll do that in the walkthrough. But internalise the size.

## Section 5: Vibe-code the graph client (6:30 – 8:30)

**ON SCREEN:** Claude Code. Paste the `graphClient.ts` brief (four functions). AI generates. Fast-forward. Open the finished file. Highlight: (1) the data-augmentation filter wrapping every query, (2) the client-side filter excluding default NER groups.

**VOICEOVER:**
> Vibe-code the client. Four functions — nodes by group, fuzzy search, paths from a node, entity-to-resources hybrid lookup.
>
> Two things in this file that have to be right. One — every query wraps the data-augmentation filter. Two — the client-side filter excludes GUID-shaped values and default NER groups. Belt and braces. Some default-NER entities slip through the server-side filter; the client catches them.

## Section 6: Vibe-code the graph viewer (8:30 – 10:00)

**ON SCREEN:** Claude Code. Paste the `GraphPage.tsx` brief. AI generates (~200 lines, uses react-force-graph). Fast-forward. Open the browser at `/graph`. The graph renders.

**VOICEOVER:**
> Viewer. Top — a fuzzy search box. Center — the graph visualization, react-force-graph for the rendering. Right sidebar — selected entity's paths and related documents.
>
> Live demo. Fuzzy search for an entity I know is in my corpus. Click it. Paths expand into the visualization. Right sidebar populates with the entity's relationships and the documents that mention it. Hybrid retrieval — keyword plus semantic — surfaces both exact-string matches and paraphrases.

## Section 7: The graph-only question (10:00 – 11:30)

**ON SCREEN:** Type a graph-only question into the right sidebar's question box (or onto an overlay): "Which investigators ran trials on COMPOUND-X AND COMPOUND-Y, ranked by recency?" (or the equivalent for your KB). Then visually click through entities in the viewer: COMPOUND-X → trials → investigators → cross-reference with COMPOUND-Y. Answer emerges.

**VOICEOVER:**
> The demo moment. Walk into a customer's CTO meeting with this question — *which investigators ran trials on both compound X and compound Y, ranked by recency?*
>
> Single-shot retrieval — `/ask` against the corpus — can't answer this. The corpus mentions both compounds. The corpus mentions investigators. The corpus mentions trials. But no single document carries the *intersection*. Only graph traversal does.
>
> Click through. COMPOUND-X. Show the investigators connected via `tested_in` paths. Cross-reference with COMPOUND-Y. The intersection — three names. Sort by trial date. Done.
>
> *This* is the Tier 4 close. No competing vendor ships this. When a customer's CTO asks "can your system actually reason about the relationships in our data" — you point at this and you've won the room.

## Wrap (11:30 – 12:00)

**ON SCREEN:** End card. *"Build 8 — Field Engineering. Next."*

**VOICEOVER:**
> Build 8 is the highest-leverage recurring-revenue lever in the entire framework. Custom fields drive AI behaviour without code deploys. Content engineering as a billable service. Ten minutes. See you there.

---

## Production notes

- **Section 2 (data-augmentation filter):** the side-by-side visual must be unmistakable. Highlight the noise (DATE, ORG, MONEY) in red on the unfiltered side; highlight the clean entities (your custom types) in green on the filtered side.
- **Section 7 (graph-only question):** rehearse this before recording. The "click through, watch the intersection emerge" sequence needs to be smooth — partners will pause and re-watch this one section.
- **Schema design (Section 4):** show the three sample schemas as a single slide for ~10 seconds. Don't try to read them aloud — just let viewers absorb the structure visually.
- **Fast-forward AI generation:** Section 5 and 6 both have substantial generation. ×4 speed during generation; cut cleanly back at the finished file.
