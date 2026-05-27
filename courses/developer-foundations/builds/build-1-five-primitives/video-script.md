# Video Script — Build 1: The Five Primitives

> **Duration target:** 15 minutes
> **Format:** Screen recording + voiceover. Panoramic tour — one section per primitive.
> **Tools on screen:** Postman (or Thunder Client / Bruno), terminal for one streaming demo, AI coding assistant for one short live brief.
> **Cuts encouraged:** between primitive sections.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 1 · The Five Primitives"*. Cut to a single graphic: five icons in a row, labelled P1 Retrieve, P2 Generate, P3 Constrain, P4 Reason, P5 Stream.

**VOICEOVER:**
> Five primitives. One endpoint or two per primitive. By the end of this fifteen minutes you'll have hit every one of them at least once, and you'll know what they return and when to reach for them. This is the most important Build in Foundations — every Build past here is just composition of these five.

## P1 — Retrieve (0:30 – 3:00)

**ON SCREEN:** Postman. POST to `/find` with the standard body. Run. Highlight three things in the response: `resources.<id>.fields.<f>.paragraphs.<p>.score`, the `text` field of the paragraph, and `position.start_seconds` if any are present.

**VOICEOVER:**
> P1 is Retrieve. Endpoint `/find`. Send a query, get paragraphs back. Three things to notice on every response.
>
> First, ARAG returns paragraphs, not just documents. The exact sentence that matched. This is your search-results-page primitive.
>
> Second, every paragraph has a score. Zero to one. Use it as a confidence signal. Below 0.6 — be sceptical. Above 0.8 — high precision.
>
> Third — and this is the under-appreciated part — for video and audio resources, the paragraph carries its timestamp. `position.start_seconds`. That's how you build "jump to the moment in the video where X is mentioned." We'll lean on this in Build 8.
>
> Customer signal that should trigger P1 in your head: "we need search," "find the section about X," "jump to the moment." Hands on keyboard, body shape, response shape — you've seen them.

## P2 — Generate (3:00 – 5:30)

**ON SCREEN:** Postman. POST to `/ask` with `x-synchronous: true`. Show response. Then switch to a terminal and run the same query with `curl -N` to see the streaming chunks scroll. Highlight `{item:{type:"answer"...}}` versus `{item:{type:"retrieval"...}}`.

**VOICEOVER:**
> P2 is Generate. Endpoint `/ask`. Two modes — sync, by adding the `x-synchronous: true` header, or streaming by default.
>
> Sync is what you see in Postman. One blob, an `answer` field, a `retrieval_results` block with the citations the LLM grounded in. One round trip.
>
> Streaming is NDJSON. In the terminal, watch — `answer` chunks arrive token-by-token, then a single `retrieval` block, then `status` to mark the end. That's the format every chat surface in this course parses.
>
> Two body params you should always set: `prefer_markdown: true` for formatted output, `rephrase: true` for free retrieval-quality lift. The LLM rewrites your query before retrieval — it costs you nothing and helps recall.
>
> Customer signal for P2: "we want a chatbot," "AI summary," "Q&A on our docs." Default reflex.

## P3 — Constrain (5:30 – 8:00)

**ON SCREEN:** Postman. POST to `/ask` with `answer_json_schema` and the follow-ups schema from the walkthrough. Run sync. Show the `answer_json.questions` array in the response. Then highlight, in the request body, the `additionalProperties: false` line with a red circle.

**VOICEOVER:**
> P3 is Constrain. Same endpoint, `/ask`. But this time we bind the output to a JSON Schema with `answer_json_schema` on the body.
>
> Now the response isn't prose. It's a typed object. Here, an array of follow-up questions. The LLM was forced to fit the schema. We didn't get markdown wrapped in code fences; we got JSON.
>
> The most important rule for P3: **every object schema must include `additionalProperties: false`**. At every nesting level. Strict mode. Forget this and the model returns extra keys you didn't ask for. Build 5 has a helper that auto-injects it.
>
> Customer signal for P3: "we want AI to generate a structured *thing*." A form. A checklist. A comparison table. An onboarding plan. An intake form. Anything that has shape. This is the moat-building tier. P3 turns ARAG into a programmable backend, not a chatbot.

## P4 — Reason over relations (8:00 – 11:00)

**ON SCREEN:** Diagram first: a small graph drawing of entities (PRODUCT, AMBASSADOR, INCIDENT) with typed edges. Then switch to Postman. POST to `/graph` with the data-augmentation filter. Show the response (likely empty for a fresh sandbox — that's fine). Switch to a pre-recorded screenshot of a non-empty graph response. Highlight `paths[].source.value`, `paths[].destination.value`, `paths[].relation.label`.

**VOICEOVER:**
> P4 is Reason over relations. The typed knowledge graph. ARAG runs an extraction agent — bespoke to your domain — that pulls entities and relations out of your unstructured corpus. PRODUCT, EMPLOYEE, INCIDENT, COMPOUND, JUDGE, whatever your schema names them. Typed. Customer-specific.
>
> The endpoint is `/graph`. Three sub-shapes — paths from a node, all nodes by group, fuzzy node search.
>
> The single most important rule in the entire course: every graph query must include `{prop: 'generated', by: 'data-augmentation'}` as a filter. Without it, you get default NER noise — DATE, ORG, MONEY — and your graph view looks like garbage.
>
> Your sandbox doesn't have a data-augmentation agent configured by default — so this query returns empty. That's expected. Build 7 walks through configuring the agent and seeing the graph populate.
>
> Customer signal for P4: relationship-shaped questions, not document-shaped questions. "Find connections between X and Y." "Which judges ruled on these matters and also cited these precedents." If the customer asks a *traversal* question, that's P4.

## P5 — Stream & secure media (11:00 – 12:30)

**ON SCREEN:** Postman. GET `/resource/{id}` with all show flags. Show the response — title, mimetype, extracted text, custom fields. Then GET `/resource/{id}/file/{fieldKey}/download/field?inline=true`. Show that this returns the raw bytes (e.g., PDF or video).

**VOICEOVER:**
> P5 is Stream and secure media. The endpoint family is `/resource/{id}/...`. The GET on the resource returns the full bundle — metadata, extracted text, custom fields. The download endpoint streams the raw bytes — PDF, video, audio.
>
> The detail that matters: auth. Every byte that flows requires the service-account JWT in the header. For DASH-streamed video, that means your player has to inject the auth header on every segment request. We'll wire that pattern in Build 8 when we go through field engineering and media.
>
> Customer signal for P5: any time the content is gated. "Secure PDF preview." "Auth-walled video library." "Jump to a timestamp and play from there." The bytes flow through ARAG, gated by the JWT.

## Composition — putting them together (12:30 – 14:00)

**ON SCREEN:** Diagram: a hypothetical customer ask in a box at the top — *"We want a chatbot that answers compliance questions, generates a checklist of actions, and shows the matching clauses in a graph of related regulations."* Five arrows drop down to the five primitives, each labelled with what it does.

**VOICEOVER:**
> Here's the whole course in one slide.
>
> Customer asks: "we want a chatbot that answers compliance questions, generates a checklist of next actions, and shows the matching clauses in a graph view of related regulations."
>
> P2 for the chat. P3 with a schema for the checklist. P1 with a PDF filter for the matching clauses. P4 for the graph view. P5 to stream the PDF when they click a clause. Five primitives. One application.
>
> Every customer engagement past Build 11 is exactly this exercise. You hear the ask, you decompose it into primitives, you brief the AI per primitive, you compose. Internalise this loop.

## Wrap (14:00 – 15:00)

**ON SCREEN:** End card. *"Build 2 — Drop-in Widgets. Next: shipping a chatbot in 30 minutes with no backend."*

**VOICEOVER:**
> Build 2 is next. It's the fastest path from "we just provisioned a KB" to "we have a chatbot live on a real URL." Thirty minutes. No backend. Just three HTML script tags and your KB credentials. See you there.

---

## Production notes

- **Pacing:** 15 minutes is tight for five primitives. Keep each section to its allotted time. Don't deep-dive — that's what the deep-dive Builds are for.
- **Postman vs Thunder vs Bruno:** show whichever you prefer. Just be consistent — don't switch tools mid-video.
- **Cut between primitive sections** — partners often pause and re-watch single sections; clean cuts make this easier.
- **Red-circle highlights:** for the four "key things to notice" moments (paragraph scores, NDJSON shape, `additionalProperties: false`, the data-augmentation filter), put a visible red circle on screen. These are the four most-commonly-missed details in Foundations.
- **End card** should include the URL or QR code to Build 2's video.
