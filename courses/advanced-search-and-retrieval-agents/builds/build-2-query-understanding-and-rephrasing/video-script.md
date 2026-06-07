# Video Script — Build 2: Query Understanding & Rephrasing

> **Duration target:** 10 minutes
> **Format:** Screen recording + voiceover.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Advanced Search & Retrieval Agents · Build 2 · Query Understanding & Rephrasing."*

**VOICEOVER:**
> Ten minutes. The single most common production complaint from ARAG customers is *"the search doesn't understand us."* It's almost never an embedding-model problem. It's a query-understanding problem. By the end of this video you'll have a custom rephraser prompt, a per-archetype recommendation, and the lift numbers to back both.

## Section 1: The default rephraser problem (0:30 – 2:30)

**ON SCREEN:** Three example queries with their default-rephrased versions. Each shows the rephrasing dragging the retrieval away from the right citation.

**VOICEOVER:**
> *"Does our process comply with GDPR Article 17?"* gets rephrased to *"Does our process follow the data deletion rules?"* The GDPR Article 17 citation is gone. Recall might go up; precision through the floor.
>
> *"How does Apixaban interact with Warfarin?"* gets rephrased to *"Drug interactions between blood thinners."* The two compound names are gone.
>
> *"Lead time on the Atlas E-220 motor?"* gets rephrased to *"How long until I can get the motor."* The SKU is gone.
>
> The default rephraser is trained on consumer queries. It generalises. In vertical-specific corpora, that generalisation hurts.

## Section 2: The four query archetypes (2:30 – 4:30)

**ON SCREEN:** Four-row grid: factoid, navigational, conceptual, exploratory. Each row shows an example query, the corpus's exact phrasing, and whether rephrasing helps or hurts.

**VOICEOVER:**
> Four archetypes. Factoid: single fact. Navigational: the user knows what they want. Conceptual: theme, not fact. Exploratory: open-ended.
>
> Rephrasing hurts factoids and navigational. Rephrasing helps conceptual and exploratory. Universal rephrasing-on or universal rephrasing-off is the wrong default. Per-archetype recommendation is the right default.

## Section 3: The custom rephraser prompt (4:30 – 6:30)

**ON SCREEN:** Side-by-side: default prompt vs custom prompt. Highlight the preserve / improve directives.

**VOICEOVER:**
> The custom prompt has two parts. *Preserve verbatim:* product names, SKUs, citation references, proper nouns of regulated entities. *Improve:* paraphrase casual phrasing; expand acronyms only if the expansion helps; add synonyms only when the user's phrasing is informal.
>
> The domain slot is what you customise per customer. For pharma, *pharmaceutical literature.* For policy, *government regulation.* For e-commerce, *product catalog.*
>
> Three-way A/B/C — rephrase-off, default prompt, custom prompt. The custom prompt should match rephrase-off on factoids and beat default-prompt on conceptual queries. If it doesn't, the preserve directives are under-specified.

## Section 4: Query expansion (6:30 – 8:30)

**ON SCREEN:** Three expansion strategies, each with a per-archetype lift number.

**VOICEOVER:**
> Three strategies. Synonym: generate 2 synonyms, retrieve against all, merge. Acronym: detect uppercase tokens, expand. HyDE: generate a hypothetical answer, embed *that*, retrieve.
>
> Each has a different per-archetype pattern. HyDE crushes on exploratory queries. Synonym helps on conceptual. Acronym only helps where the corpus and the query use different forms.
>
> The expansion experiment is a half-day of harness work. The output is a per-archetype recommendation table the partner uses unchanged across every customer engagement.

## Section 5: Defence (8:30 – 9:30)

**ON SCREEN:** Slide showing the per-archetype recommendation table.

**VOICEOVER:**
> The defence in a customer conversation is the table. *"Why custom prompt?"* — show the three-way A/B/C. *"Why HyDE only on exploratory?"* — show the expansion table. *"Why rephrase off on factoids?"* — show the lift numbers.
>
> Numbers. Always.

## Close (9:30 – 10:00)

**ON SCREEN:** Next-Build pointer.

**VOICEOVER:**
> Build 2 ships the per-archetype recommendation. Build 3 stacks filter composition on top. See you there.
