# Voice Track — Developer Foundations course overview

> **Duration target:** ~3.5 minutes. **Format:** screen recording of the two finished capstone apps — **Aurora Concierge** (D2C outdoor retailer) and **Atlas Operations** (enterprise control room) — with voiceover. The narration introduces one pattern at a time, then shows the same pattern living in both apps. Read at a natural pace it lands around 3:20–3:50.

---

## 1. Open (0:00 – 0:30)

**ON SCREEN:** Title card — *"Developer Foundations · Progress Agentic RAG."* Cut to the two finished capstone apps side by side: Aurora's storefront on the left, the Atlas control room on the right.

**VOICEOVER:**
> Developer Foundations teaches you to build on Progress Agentic RAG — and not in the abstract. The bar is that you can sit in front of a customer's CTO and ship a working application against their own content. The clearest way to show you what that means is to look at where the course lands: two capstone applications. **Aurora Concierge** — a direct-to-consumer outdoor retailer. And **Atlas Operations** — a control room for enterprise knowledge. Two completely different buyers, two completely different demos. But underneath, the same handful of patterns. So let me do this pattern by pattern: here's the idea, and here's that same idea living in both apps.

## 2. Grounded answers (0:30 – 1:05)

**ON SCREEN:** Aurora concierge answering a question with clickable source pills appearing under the answer; cut to Atlas search returning results with citations, one citation clicked to reveal the source document.

**VOICEOVER:**
> Start with the foundation every other pattern sits on: a **grounded answer**. Not a model guessing — a generated answer with citations you can click and verify, every claim traceable back to a real document. That's the pattern. In **Aurora**, it's a shopper asking which boot handles wet trails and getting a genuine recommendation with the product page cited right underneath. In **Atlas**, it's an engineer asking why a production line went down and getting an answer stitched from incident reports and runbooks — with every source one click away. Identical primitive. One sells boots, the other resolves incidents.

## 3. Conversational surfaces (1:05 – 1:45)

**ON SCREEN:** Aurora's floating chat open; toggle the persona from Sara (prospect) to Mara (member) and show the answer style change. Cut to Atlas's operations concierge panel answering in a precise, procedural voice.

**VOICEOVER:**
> Now the surface that grounded answer lives on — **conversational**. A chat that holds context, streams its reply, and changes its voice depending on who's asking. In Aurora it's an always-present floating concierge, and it has two voices. To a prospect, it's a warm guide that ends on a call to action. To a logged-in member, it drops the sales pitch and gives the detailed, member-grade answer. Same engine, two personas, switched by a single query prefix. In **Atlas**, that exact conversational surface becomes the operations concierge — same streaming, same citations — but the voice is precise and procedural, because the person asking is a CTO, not a shopper. You build the pattern once; you re-skin the voice per customer.

## 4. Structured workflows (1:45 – 2:15)

**ON SCREEN:** Aurora generating an "Adventure Plan" rendered as a clean structured card; cut to Atlas producing a "Compliance-Trace" rendered as a structured audit table.

**VOICEOVER:**
> Past chat, the patterns get more valuable. **Structured output** — where you tell the model "don't give me prose, fill out this exact shape," and get back clean, validated JSON your app can render directly. In Aurora that's an Adventure Plan: ask for a three-day trip and get a structured itinerary, gear and all, grounded in the catalogue. In Atlas it's a Compliance-Trace: one question produces a structured audit table mapping a control to the documents that satisfy it. Same feature — schema-constrained generation. One builds a packing list; the other builds an audit trail.

## 5. The graph + composite moment (2:15 – 2:55)

**ON SCREEN:** Atlas knowledge graph — click a failed component, watch the typed relationships expand to the supplier and the other lines running the same part. Cut to Aurora's abandoned-cart composite flow producing a send-ready campaign.

**VOICEOVER:**
> Then the Tier-4 moment — the one that makes the room go quiet. A **typed knowledge graph**: not keyword search, but the actual relationships between entities, traversed. In Atlas that's incident root cause — follow the graph from a failed component, through its supplier, to the three other lines running the same part. A question single-shot retrieval simply cannot answer. Alongside it, **composite RAG** — chaining calls and retrying when confidence is low. In Aurora that's the abandoned-cart win-back: it reasons across the shopper's journey and emits a structured, send-ready campaign. Same composition skill, pointed at a different outcome — one prevents downtime, one recovers revenue.

## 6. Production layer + close (2:55 – 3:35)

**ON SCREEN:** Both app headers showing the residency badge + live ingested-corpus stats; brief flash of an observability tile (citation rate). End card: *"Developer Foundations. Thirteen builds. One capstone. Start at Build 0."*

**VOICEOVER:**
> And because both of these are real applications, both carry the production layer the CTO actually asks about — data residency you can point at in the dashboard, bring-your-own-LLM, rate-limit-aware clients, and a citation-rate metric that tells you the moment retrieval starts to drift. That's the line between a demo and something a Fortune 500 will run. That's the whole course: thirteen short builds to learn the patterns, one capstone to prove them. Same primitives — your customer's content. Open Build 0, and go build it.

---

## Production notes

- **The two apps on screen are the proof.** Every pattern beat cuts between the *same moment* in Aurora and in Atlas — that side-by-side is the whole point: one skill, two buyers. Keep the cuts tight and parallel.
- **VO is ~560 words** → ~3:20–3:50 at a natural pace. If it runs long, trim Section 4 (structured workflows) first; the graph/composite section is the keeper.
- **Don't show code.** This is an outcomes overview — surfaces, answers, the graph expanding, the structured card rendering. The code is what the course teaches; the video sells the destination.
- **Names to keep straight on screen:** Aurora = the outdoor retailer (storefront, floating concierge, Sara/Mara). Atlas = the enterprise control room (ops concierge, the typed graph, the /ops page).
