# Video Script — Build 5: Structured Outputs

> **Duration target:** 12 minutes
> **Format:** Screen recording + voiceover. Three live vibe-coded workflows.
> **Tools on screen:** Claude Code (or Cursor), terminal, code editor, optional Postman for the wrapper test.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 5 · Structured Outputs."* Subtitle: *"The Tier 3 unlock."*

**VOICEOVER:**
> Twelve minutes. Three vibe-coded workflows. By the end, ARAG returns typed JSON objects instead of paragraphs of prose — and you'll see why that single shift moves a $30K deal into a $250K deal. This is the most important Build in the course. Pay attention.

## Section 1: Why this Build is different (0:30 – 2:00)

**ON SCREEN:** Slide: "Chatbot returns a string. Platform returns a typed object." On the left, an example chatbot response — paragraph of prose. On the right, an example structured response — `{subject, body, cta_url, recommended_send_window}`. Annotations: "string → UX decision. Object → workflow decision."

**VOICEOVER:**
> A chatbot returns a string. A platform returns a typed object. That's the entire shift.
>
> The moment ARAG returns subject, body, CTA URL, recommended send-window, the customer stops thinking about where to display the answer and starts thinking about *which existing system in their stack consumes it.* Email tool. CRM. CMS. Case management.
>
> Budget shifts from "AI experiment" line item to "platform integration" line item. Tier 1 caps around $80K. Tier 3 opens at $80K and runs to $250K-plus. This Build is the lever.

## Section 2: The primitive — `answer_json_schema` (2:00 – 3:30)

**ON SCREEN:** Show the request body with `answer_json_schema` filled in (the FAQ schema from the walkthrough). Highlight `additionalProperties: false` at both nesting levels with red circles. Then show the response — clean JSON, `answer_json.faqs = [...]`.

**VOICEOVER:**
> Same endpoint as Build 3 — `/ask`. Add one body field — `answer_json_schema`. Output is now bound to the schema. The response carries `answer_json` — a typed object, not prose.
>
> One rule that breaks everything if you forget it. Every object schema must include `additionalProperties: false`. Every nesting level. Strict mode. Your AI will forget this about 70% of the time. Always check. We'll bake the auto-injector into the wrapper.

## Section 3: Vibe-code the wrapper (3:30 – 5:30)

**ON SCREEN:** Claude Code. Paste the wrapper brief from the walkthrough. AI generates `askForJson.ts`. Fast-forward the generation.

**VOICEOVER:**
> First brief — the wrapper. `askForJson` function. POST to `/ask`. Schema gets walked recursively to inject `additionalProperties: false`. Three response-shape paths: `data.answer_json`, `data.item.object`, text-fallback with regex extraction.
>
> The three-shape fallback is the most-missed detail in this whole Build. Partners write the happy-path handler and ship. Two weeks later, the model returns text-with-embedded-JSON for one query out of a hundred and the app crashes. Write all three from day one.

**ON SCREEN:** Wrapper finished. Scroll through it. Highlight the recursive injector function with a red circle.

## Section 4: Workflow 1 — FAQ generator (5:30 – 7:00)

**ON SCREEN:** Brief the AI to write `faq-generator.mjs` using the wrapper. AI generates. Run in terminal: `node faq-generator.mjs "what's our return policy"`. Output prints — 5 FAQ entries, each with question, answer, source resource title.

**VOICEOVER:**
> Workflow 1. FAQ generator. Schema: an array of FAQ entries, each with question, answer, source resource title.
>
> Run it. Five entries back, typed object, every source title corresponds to a real document in my KB. The customer's help-centre team gets this output as JSON. They drop it into their CMS. They don't need to talk to me again.

## Section 5: Workflow 2 — Taxonomy generator (7:00 – 8:30)

**ON SCREEN:** Brief the AI. AI generates. Run. Output: 7 domain names with descriptions.

**VOICEOVER:**
> Workflow 2. Taxonomy generator. Schema: array of domains, each with name and description. No input — the KB tells us its own taxonomy.
>
> Run it. Seven domains back. Match against my actual corpus — yes, those are the topics. The model just gave me the org's ontology.
>
> Customer-facing application: scoping calls. The customer's content team thinks they know what their KB is about. The taxonomy generator tells them what their KB *actually* is about. That's a Tier 3 discovery finding.

## Section 6: Workflow 3 — Comparison-table generator (8:30 – 10:00)

**ON SCREEN:** Brief the AI. AI generates `comparison-generator.mjs`. Run with three product names. Output: structured table — attributes array + rows array with one value per item.

**VOICEOVER:**
> Workflow 3. Comparison table. Input: a list of items. Schema: attributes array, rows array, each row carries the values per item in input order.
>
> Three items in. Structured comparison out. Five rows. The customer's product team had been paying a separate vendor $40K a year for this feature. We just generated it from their existing KB. Tier 3 conversation closes itself.

## Section 7: The pattern across all three (10:00 – 11:00)

**ON SCREEN:** Three side-by-side panels — each workflow's schema + sample output. Caption: *"Same primitive. Different schema. Three different products."*

**VOICEOVER:**
> Three workflows. One primitive. The schema is the variable.
>
> When you go into a customer meeting, listen for "we want AI to generate a *structured thing*." FAQs. OKRs. Intake forms. Comparison tables. Campaign briefs. Onboarding plans. Triage classifications. Quarterly reports. Each one is a different schema; each one is two hours of vibe-coding.
>
> That's the Tier 3 surface. Twelve to twenty workflows per customer engagement. Six-figure deal size. Recurring tuning retainer. Build 5 is the entire engine.

## Section 8: Schema permissive, code strict (11:00 – 11:30)

**ON SCREEN:** Side-by-side schema fragment — mixed-shape exam schema with everything marked `required`. Annotations: "All required. Code filters by `questionType` after."

**VOICEOVER:**
> One more pattern. When you have items of mixed type — multiple-choice and free-text in the same array — mark *every* field required. The model fills in whichever fields apply per row. Your code filters by type and prunes empties.
>
> Schema permissive, code strict. This is the pattern for any mixed-shape generation. Watch for it.

## Wrap (11:30 – 12:00)

**ON SCREEN:** End card. *"Build 6 — Smart Filters & Labelsets. Next."*

**VOICEOVER:**
> Build 5 was the most important Build. Build 6 is the cheapest precision lever — content-type and label-based filtering for any search UI. Eight minutes. See you there.

---

## Production notes

- **Wrapper section (3:30 – 5:30):** the AI generation will take 60–90 seconds. Fast-forward. Cut to a clean shot of the finished file with the injector function highlighted.
- **Three workflow runs:** each terminal output should be visible for 5–8 seconds so partners can read the JSON. Don't rush past them.
- **Final schema panel (Section 7):** show the three schemas side by side cleanly. This is the "aha — same primitive, different schema" moment. Hold it for 5 seconds.
- **Verification:** check `additionalProperties: false` highlights are visible in both Section 2 and Section 3.
