# Video Script — Build 12: Capstone Prep

> **Duration target:** 15 minutes
> **Format:** Screen recording + voiceover. Document-heavy. Mix of slides and editor.

## Cold open (0:00 – 0:45)

**ON SCREEN:** Title card. *"Developer Foundations · Build 12 · Capstone Prep."* Subtitle: *"The synthesis."*

**VOICEOVER:**
> Fifteen minutes. By the end of this video, you'll have a plan for the capstone — variant chosen, eight master prompts drafted, twenty-five-minute demo script sketched. The capstone itself is eight weeks of execution if you plan well, twelve weeks if you don't. This Build is the planning.

## Section 1: Pick your variant (0:45 – 2:30)

**ON SCREEN:** Side-by-side comparison of the two variants. Atlas Operations (Enterprise, CTO buyer, industrial corpus, incident-root-cause flagship) vs Aurora Concierge (CX, CMO buyer, retail corpus, abandoned-cart flagship).

**VOICEOVER:**
> Step one — pick a variant. Two pre-designed options.
>
> Atlas Operations. Buyer is the CTO. Corpus is an industrial-manufacturer persona. Flagship demo is a composite-RAG incident root-cause flow. If your customer book is enterprise IT, financial services, healthcare ops, public sector — pick Atlas.
>
> Aurora Concierge. Buyer is the CMO. Corpus is a D2C retail persona. Flagship demo is an abandoned-cart winback flow. If your customer book is e-commerce, media, hospitality, content businesses — pick Aurora.
>
> Both build on the same architecture — one KB, labelsets, a data-augmentation agent, six demo surfaces. Different brand, different demo script, different buyer.
>
> Default to Atlas if you're not sure. Broader applicability. Open the variant brief in full before this Build's walkthrough.

## Section 2: The architecture recap (2:30 – 4:00)

**ON SCREEN:** Diagram showing the capstone's six demo routes (landing, search, concierge, workflows, graph, flagship-composite) all sitting on one ARAG KB. Labels noting which Foundations Build each route inherits from.

**VOICEOVER:**
> Whichever variant — same architecture. One KB. Three labelsets minimum. A data-augmentation agent producing the typed graph. A single Vite + React app. Six demo surfaces.
>
> Notice the surfaces map directly to Builds you've already done.
>
> The landing page — Build 2 + the residency badge and live KB stats from Build 11. Search — Build 7. Concierge — Builds 3, 4, 9. Workflows — Build 5. Graph — Build 8. Flagship composite — Build 10.
>
> The capstone is composition. Nothing fundamentally new. The art is in the orchestration.

## Section 3: The 8 master prompts (4:00 – 8:00)

**ON SCREEN:** A table listing the 8 prompts and what each produces. Then open `master-prompts.md` and show one written-out example in detail (prompt #2 — the ragClient wrapper).

**VOICEOVER:**
> Eight prompts. Eight AI sessions. Run them in sequence. Each builds on the previous.
>
> Prompt one scaffolds the app. Prompt two writes the ARAG client wrapper. Three — header and landing. Four — search. Five — concierge. Six — workflows. Seven — graph. Eight — flagship composite-RAG flow.
>
> Here's prompt two in detail.

**ON SCREEN:** Show a fully-written prompt #2 brief — 400 words covering goal, existing context, spec bullets, conventions, verification.

**VOICEOVER:**
> Two hundred to five hundred words per prompt. Goal — one sentence. Context — what's already in the project. Spec — explicit bullets. Conventions — use ragClient, use the design system, use React Router v7. Verification — what I'll check before moving to the next prompt.
>
> Vague prompts cost weeks. Specific prompts cost an extra ten minutes of writing and save you four weeks of debugging.

## Section 4: The 25-minute demo arc (8:00 – 11:30)

**ON SCREEN:** Timeline showing the 7 sections — Hero (0–2), Search (2–6), Concierge (6–10), Workflows (10–15), Graph (15–20), Flagship (20–23), Close (23–25). Annotations on each.

**VOICEOVER:**
> The demo arc. Twenty-five minutes. Seven sections. Same skeleton across variants.
>
> Zero to two — hero plus residency badge and live ingested-corpus stats. Customer sees this is a real KB in their region — document count ticks up on screen — not a static demo. Trust established in ninety seconds.
>
> Two to six — search. Tier 1 reflex. Show grounded search with filters. The CMO recognises this as "the search we wish we had."
>
> Six to ten — concierge. Tier 2 differentiation. Two voices, multilingual, CTA pills. The CMO recognises this as "more than a chatbot."
>
> Ten to fifteen — structured workflows. Tier 3 unlock. Three workflows producing typed outputs. The CMO budgets shift.
>
> Fifteen to twenty — knowledge graph. Tier 4 wow. Navigate the typed graph. Show a question only the graph can answer. The CTO is on the call now.
>
> Twenty to twenty-three — flagship composite-RAG flow. The headline moment. Multi-step pipeline visualised. Step one, step two, step three. The room watches.
>
> Twenty-three to twenty-five — close. Pitch the four-week co-engineered POC. Book the next meeting.
>
> Build the demo script in parallel with the code. Don't leave it to the end.

## Section 5: The review-board gate (11:30 – 13:00)

**ON SCREEN:** A simple flow chart. *"Build 12 plan → Review board → Pass → Build 13 starts"*. With the four review-board check items: variant choice, prompt specificity, demo arc, build estimate.

**VOICEOVER:**
> Before you start the eight vibe-coding sessions, your plan goes to a Progress Solution lead for review-board sign-off. Four checks.
>
> Variant choice matches your customer book. Prompts are specific enough to execute. Demo arc ends in a clear next-step ask. Build estimate is realistic — eight weeks solo or four at two FTE.
>
> A passing review-board sign-off gates the capstone. Don't skip it. The forty-five minutes you spend in review-board feedback saves you four weeks of building the wrong thing.

## Section 6: Walkthrough preview (13:00 – 14:30)

**ON SCREEN:** Editor. Open empty `variant-choice.md`, `master-prompts.md`, `demo-script.md`. Briefly show each file's header structure.

**VOICEOVER:**
> The walkthrough has you write three documents. Variant choice — six to ten sentences mapping the variant to your real customer book. Master prompts — eight written prompts, two hundred to five hundred words each. Demo script — seven sections, four to six bullets each.
>
> Two hours of focused work. The most important two hours in the entire Foundations course.

## Wrap (14:30 – 15:00)

**ON SCREEN:** End card. *"Build 12 — The Capstone. Pick your variant. Ship the wow build."*

**VOICEOVER:**
> Build 12 is the capstone. Eight weeks of focused vibe-coding. Twenty-five-minute end-to-end recorded demo. Progress-led review board defends what you ship. On pass, you earn the Developer Foundations Practitioner cert.
>
> Everything from Builds 0 to 10 was for this. Go build it.

---

## Production notes

- **Section 3 (master prompts):** showing one written-out prompt in full is the headline visual. Keep it on screen for at least 30 seconds so partners can read it.
- **Section 4 (demo arc):** the 7-section timeline visual is a strong slide — keep it on screen during narration.
- **Section 5 (review board):** flowchart should be simple. Don't overdesign — the message is "plan first, build second."
- **Pacing:** 15 minutes is long for Foundations. Don't pad. Cut the cold open or wrap if you're over.
