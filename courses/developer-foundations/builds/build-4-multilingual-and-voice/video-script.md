# Video Script — Build 4: Multilingual & Voice Switching

> **Duration target:** 8 minutes
> **Format:** Screen recording + voiceover. Live extension of the Build 3 chat.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 4 · Multilingual & Voice Switching"*. Cut to the Build 3 chat already running, with the persona toggle visible.

**VOICEOVER:**
> Eight minutes. Three customer asks: multilingual answers, persona-aware framing, "ask about this specific PDF." Each one looks like new infrastructure. Each one is a query-prefix one-liner. Watch.

## Section 1: The pattern (0:30 – 1:30)

**ON SCREEN:** Simple diagram — *"prefix + question = final query"*. Below: three example prefixes — `Respond in French: `, `The user is an alpine pro. `, `Regarding "Tasmania Overland Guide": `. Each one in a different colour.

**VOICEOVER:**
> One pattern. Build a prefix string. Concatenate onto the user's query before you send it. That's the whole mechanism. No body parameter, no new endpoint, no new prompt config. The LLM treats the prefix as part of the question and does what it says.
>
> Three prefixes today. Language. Segment. Resource scope. Plus they compose.

## Section 2: Vibe-code the prefix builder (1:30 – 2:30)

**ON SCREEN:** Claude Code. Brief: paste the `buildPrefix` brief from the walkthrough. AI generates `src/lib/buildPrefix.ts`. Fast-forward the generation.

**VOICEOVER:**
> First brief. A `buildPrefix` function. Three optional args — language, segment, resource title. Returns the concatenated prefix string. Empty if nothing's set. Twenty lines of code, generated.

## Section 3: Add the UI controls (2:30 – 4:00)

**ON SCREEN:** Claude Code. Brief: paste the UI-controls brief — language dropdown, segment radio, resource-context text input — to add to the existing chat component. AI updates `MultiSurfaceChat.tsx`. Reload browser. Three new controls visible above the persona toggle.

**VOICEOVER:**
> Second brief. Three UI controls above the existing toggle. Language dropdown. Segment radio. Resource-context input. Wire each into state. In the submit handler, build the prefix and prepend.
>
> Notice the AI is layering onto code that already exists. I'm not asking for a rewrite. *Add* a language dropdown. *Add* a segment radio. The existing persona toggle stays.

## Section 4: Demo language switching (4:00 – 5:00)

**ON SCREEN:** Browser. Persona toggle set to Member. Language: English. Type: "what should I try first?". Watch the English answer stream. Then change Language to French. Same question. French answer streams. Then Japanese. Japanese answer streams.

**VOICEOVER:**
> Language. Same KB. Same model. Same prompt config. Same question. English answer. French answer. Japanese answer.
>
> The LLM does the translation as part of generation. No translation service. No language-specific KB. No re-indexing. The customer asks "what about Mandarin?" — Mandarin works too. Tell the brand team to update the dropdown.

## Section 5: Demo segment framing (5:00 – 5:45)

**ON SCREEN:** Language back to English. Segment: Weekend Adventurer. Same question. Answer is friendly, beginner-oriented. Switch Segment to Alpine Pro. Same question. Answer is technical, expert-oriented, names higher-end product variants.

**VOICEOVER:**
> Segment. Weekend Adventurer — the model frames its recommendations for someone starting out. Alpine Pro — the model frames for an expert, references the higher-end products.
>
> Same prompt config. Same retrieval. The prefix just nudges the framing.

## Section 6: Demo resource scoping (5:45 – 6:30)

**ON SCREEN:** Resource Context input: type the title of a specific document in your KB (e.g., "Tasmania Overland Track Guide"). Type query: "summarise the key sections." The answer focuses on that resource — refers to chapters/sections by name from that document.

**VOICEOVER:**
> Resource scope. I drop a specific document title in. Ask for a summary. The model retrieves from the full KB but biases heavily toward paragraphs from that named resource — because the model sees the title in the query.
>
> Pseudo-scoping. Not strict, but enough for nine out of ten "chat with this document" customer asks. For strict scoping you'd add a filter — Build 6 covers that.

## Section 7: Combine all three (6:30 – 7:15)

**ON SCREEN:** Set Language=Spanish, Segment=Alpine Pro, Resource=<doc title>. Ask one question. Watch the answer stream — Spanish, alpine-pro framing, focused on the named resource.

**VOICEOVER:**
> Combine. Spanish. Alpine Pro. Named resource. One question. One answer that satisfies all three. Three orthogonal customer asks, fifteen lines of code, sixty minutes of vibe-coding.
>
> The CMO who sees this watches three of their procurement objections evaporate at once.

## Wrap (7:15 – 8:00)

**ON SCREEN:** End card. *"Build 5 — Structured Outputs. Next: the most important Build in the course."*

**VOICEOVER:**
> Build 5 is next. `answer_json_schema`. Where ARAG stops being a chatbot and becomes a programmable backend. This is the Tier 3 unlock — six-figure deals open here. Twelve minutes. See you there.

---

## Production notes

- **Same dev environment as Build 3.** No new project setup needed on screen — start with the Build 3 chat already running.
- **Language demo:** make sure your KB content is in English so the model has good source material. The model translates *into* the target language but retrieves *from* the English content. This is normal — but if your sandbox KB is multilingual, results may look odd. Use a mono-language English KB for this recording.
- **Resource title:** pick a real document from your KB so the answer can be verified by the audience.
- **Pacing:** 8 minutes for three live demos is tight. Don't pad the cold open or the wrap — focus runtime on the demos.
