# Mission Control — Customer Experience Variant

> **Status:** Brief. Build not started.
> **Role in the programme:** Build 7 capstone, **Variant B** of two. The other variant — `Mission-Control-Build-Brief.md` — is the Enterprise / Internal Operations variant. Partners pick one based on their book of business and ship the second only when they've expanded into the other segment.
> **Owner:** Jay Sanderson (programme); Progress Solution lead (build).
> **Target ship:** End of 90-day rollout window (Day 90), in parallel with the Enterprise variant where partner bandwidth allows.
> **When to pick this variant:** When the partner's customers are CMOs, Heads of Digital, Chief Customer Officers, retail/D2C/B2C operators, content businesses, or anyone whose AI budget sits inside the customer-facing P&L rather than IT.

---

## 1. Why the CX variant exists

The Enterprise Mission Control closes the room with a CTO. The CX Mission Control closes the room with a CMO. Different buyer, different language, different proof points — but the same chassis and the same five primitives underneath. Partners with a digital / commerce / content book of business were losing to point solutions (Algolia, Bloomreach, Klevu, Coveo, Yext) every time they led with the Enterprise variant. Those buyers don't want "control room for unstructured knowledge"; they want **conversion, retention, and personalization** that they can actually explain to their CFO.

This variant does three jobs:

1. **Customer-experience capstone.** Build 7 certification artefact for partners whose customers buy AI to grow revenue rather than to compress IT cost.
2. **CMO-room closer.** Twenty-five minutes that converts a "we already tried personalization" room into a Tier 3 platform conversation.
3. **Field-engineered content as recurring revenue.** The CX variant exposes the `callToAction` / `searchResultDisplay` / `videoInfo` field-engineering patterns from the Sample ARAG App at the centre of the demo — because those are the patterns partners can monetise as ongoing content services.

The Enterprise variant proves ARAG is a *control room*. The CX variant proves ARAG is a *customer experience platform*. Same KB engine; the difference is what you build with it.

---

## 2. The Demo Buyer (CMO / Head of Digital)

- **Persona:** CMO, Chief Customer Officer, Head of Digital, VP Ecommerce, Head of Loyalty. Mid-market to enterprise. Brand- and growth-led, not technology-led.
- **What they care about:** Conversion rate. Average order value. Retention rate. Content-engineering throughput. Time-to-personalization. Whether the AI work shows up on their dashboard inside one quarter.
- **What they're sceptical of:** Black-box recommendation engines. "Personalization" that can't explain itself. Vendors who promise multilingual "next quarter." Long integration projects that the IT team owns.
- **What they leave with:** A demoable vision of how their product catalog, brand content, and customer data become *one reasoning surface* that powers every customer touchpoint — from search box to abandoned-cart email — with the same single API key.

Where the Enterprise variant earns trust with the CTO by showing residency, BYO-LLM, and a graph extracted from their data, the CX variant earns trust with the CMO by showing the *content-engineering loop*: every AI improvement is a field edit, not a code deployment, and the front-end shows them exactly where the model picked its CTAs and citations from.

---

## 3. The Persona Corpus — Aurora Outfitters

Mission Control: CX demos against **Aurora Outfitters**, a fictional D2C outdoor and adventure retailer. 250+ SKUs across hiking, climbing, camping, and technical apparel. Four-region operation (NA / EU / APAC / ANZ). Direct-to-consumer with a strong loyalty program ("Aurora Trail Club") and an ambassador-led content engine.

Aurora is chosen because:

- D2C retail is universally recognised by the demo buyer. Every CMO has either run an Aurora-shaped business or competed with one.
- The content surface area maps cleanly to real digital experiences: PDPs, search, blog, video, loyalty portal, support — every CMO has these.
- It's recognisable without being a real brand. The room doesn't get distracted wondering whose data we're using.

Partners re-skinning the variant into a banking, hospitality, education, media, or telco context will find the chassis maps cleanly — just swap the corpus, swap the entity schema, swap the workflow inputs.

### Five KBs across Aurora

| KB | Content type | Volume target | Demo role |
|---|---|---|---|
| **kb-aurora-product** | Product pages, fit guides, materials, care instructions, technical specs | 80–100 docs | Tier 1 / Tier 2 (storefront search + concierge) |
| **kb-aurora-support** | FAQs, returns, shipping, sizing help, warranty, account guidance | 50–70 docs | Tier 1 / Tier 2 (support deflection) |
| **kb-aurora-content** | Trail guides, gear reviews, ambassador videos, podcasts, blog | 80–100 docs | Tier 2 / Tier 4 (content-led discovery) |
| **kb-aurora-loyalty** | Trail Club benefits, member exclusives, points programs, partner offers, event calendar | 40–60 docs | Tier 3 (loyalty personalization) |
| **kb-aurora-brand** | Brand story, sustainability commitments, ethical sourcing, ambassador bios, manifesto | 30–50 docs | All tiers (voice + values grounding) |

**Corpus build tool:** Same as the Enterprise variant — use the `progress-kb-use-case-generator` skill to generate each KB, five runs, anchor details locked in advance so cross-KB references resolve. Aurora's voice (outdoor-adventure, technically credible, sustainability-forward, ambassador-led) is part of the input spec.

### Cross-KB anchor details (lock at corpus design time)

Every document references the same fictional entities. This is what makes the loyalty workflows and the journey graph land.

- **6 hero products:** Aurora TerraTrek 7 (hiking boot), Aurora Skyline 45L (multi-day pack), Aurora Helios (down jacket), Aurora Cumulus 2P (tent), Aurora Quill 850 (ultralight quilt), Aurora Crag XR (climbing harness). Each with size/colour variants where relevant.
- **4 ambassadors / experts:** Mara Chen (alpine guide, 15 yrs), Jonah Reyes (Triple Crown thru-hiker), Dr. Anya Patel (sports physiologist, gear-fit specialist), Theo Sundberg (climbing instructor, 22 yrs).
- **5 named destinations / routes:** Tasmania Overland Track, Patagonia W Trek, Tour du Mont Blanc, Annapurna Circuit, Yosemite High Sierra.
- **3 customer segments:** Weekend Adventurers, Multi-Day Thru-Hikers, Alpine Pros.
- **3 loyalty tiers:** Trail Club Standard, Trail Club Plus, Trail Club Pro.
- **4 brand pillars:** Built for the Worst Weather, Trail-Tested by Experts, Repairable for Life, Carbon-Negative by 2030.

These anchors get embedded into every document the corpus generator produces. They drive the graph (Section 5) and the demo script (Section 9).

---

## 4. Scope

### In scope (must ship)

- All five KBs ingested into separate ARAG knowledge boxes with EU region for the demo (USA failover documented).
- One bespoke data-augmentation agent extracting a customer-journey graph across the product, content, and loyalty KBs.
- Six branded demo surfaces (one per tier of the capability ladder, plus the landing page and the abandoned-cart flow).
- Three custom Tier 3 workflows oriented to digital-experience operations.
- One Tier 4 composite RAG flow — Abandoned-Cart Win-Back (the revenue-recovery showpiece).
- BYO-LLM toggle visible but de-emphasised vs the Enterprise variant — the CMO doesn't care which LLM is wired in, but a one-click answer to "wait, what about Azure?" still matters when the CIO joins the second meeting.
- Field-engineered CTAs front and centre — the demo presenter must point at where each call-to-action came from in the source content, because that's the content-engineering recurring-revenue pitch.
- Multilingual switch on the concierge surface — D2C buyers ask this in the first ten minutes.
- Floating chat with prospect vs Trail Club member voice — the conversion mechanic.
- Sample ARAG App fork as the technical baseline.
- Re-skin playbook shipped alongside the build.
- 25-minute demo script (Section 9) rehearsed and recorded.

### Out of scope (explicitly)

- Real customer transactional data. The "abandoned cart" demo uses a fictional Sara Chen with a hand-crafted session history.
- Live integration with a real ecommerce platform (Shopify / commercetools / Salesforce Commerce). Customers see real integration during a POC; Mission Control: CX shows the *capability*, not a productized connector.
- Multi-tenant per-customer storefronts. The chassis is single-brand.
- Email / SMS delivery infrastructure. The abandoned-cart win-back demo generates the message — it doesn't send it. The presenter says "this drops into your Klaviyo / Braze / Iterable in three lines."
- Loyalty-points calculation engine. Loyalty workflows recommend actions; they don't run the points ledger.

---

## 5. Architecture

### 5.1 Topology

```
┌─────────────────────────────────────────────────────────────┐
│  Mission Control: CX Frontend (Vite + React)                 │
│  Aurora-branded shell • 6 demo surfaces                      │
│  Floating chat (prospect ↔ Trail Club Member)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS + X-NUCLIA-SERVICEACCOUNT
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Progress Agentic RAG (EU region)                            │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ aurora-prod │ │ aurora-supp │ │ aurora-cont │  ...        │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                              │
│  ┌──────────────────────────────────────────────┐           │
│  │ Customer-Journey Graph Agent                  │           │
│  │ Entity types: PRODUCT, CATEGORY, ACTIVITY,    │           │
│  │ DESTINATION, AMBASSADOR, CONTENT, SEGMENT,    │           │
│  │ LOYALTY_TIER, BRAND_PILLAR, SIZING_PROFILE    │           │
│  └──────────────────────────────────────────────┘           │
│                                                              │
│  Field-engineered surfaces:                                  │
│  • callToAction (per resource)                               │
│  • searchResultDisplay (per resource)                        │
│  • videoInfo (per video — speakers, topics, key points)      │
│                                                              │
│  BYO-LLM router → Azure │ Vertex │ Bedrock                  │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Frontend stack

- **Framework:** Vite + React 18 (matches Sample ARAG App).
- **Styling:** Tailwind CSS. Aurora-themed palette — warm sandstone base, alpine-blue and rust accents, generous whitespace, photography-led hero. Designed to look like a real D2C site, not a SaaS dashboard.
- **Routing:** React Router v7.
- **State:** React Context for the active customer persona (Sara the prospect vs Mara the Trail Club Pro member), the floating-chat mode, and presenter-mode hotkeys.

### 5.3 Backend stack

- **ARAG only.** Same architecture point as the Enterprise variant: there is no middleware to maintain. The CMO appreciates this differently from the CTO — no integration project to extract them from on day one.

### 5.4 Data-augmentation agent — the customer-journey graph

The graph in the CX variant is *not* the operational graph of the Enterprise variant. It's the **customer-journey graph** — products, content, activities, destinations, and customer segments tied together by purchase intent and brand affinity.

**Entity schema (lock during Phase 2):**

| Type | Examples |
|---|---|
| `PRODUCT` | Aurora TerraTrek 7, Aurora Skyline 45L |
| `CATEGORY` | Hiking Boots, Multi-Day Packs, Down Insulation, Tents |
| `ACTIVITY` | Day Hiking, Thru-Hiking, Alpine Climbing, Bikepacking |
| `DESTINATION` | Tasmania Overland Track, Patagonia W Trek |
| `AMBASSADOR` | Mara Chen, Jonah Reyes, Dr. Anya Patel |
| `CONTENT` | Blog post, video, podcast episode |
| `CUSTOMER_SEGMENT` | Weekend Adventurer, Thru-Hiker, Alpine Pro |
| `LOYALTY_TIER` | Trail Club Standard, Plus, Pro |
| `BRAND_PILLAR` | Built for the Worst Weather, Repairable for Life, Carbon-Negative by 2030 |
| `SIZING_PROFILE` | Narrow Foot, Wide Foot, Standard, High Arch |

**Relation schema:**

| Relation | Domain → Range | Examples |
|---|---|---|
| `recommended_for` | PRODUCT → ACTIVITY | TerraTrek 7 recommended for Day Hiking |
| `suited_to` | PRODUCT → DESTINATION | Skyline 45L suited to Annapurna Circuit |
| `worn_by` | PRODUCT → AMBASSADOR | Helios worn by Mara Chen |
| `fits` | PRODUCT → SIZING_PROFILE | TerraTrek 7 fits Wide Foot |
| `pairs_with` | PRODUCT → PRODUCT | TerraTrek 7 pairs with Skyline 45L (cross-sell) |
| `alternative_to` | PRODUCT → PRODUCT | TerraTrek 7 alternative to TerraTrek 5 (substitute) |
| `featured_in` | PRODUCT → CONTENT | TerraTrek 7 featured in "Tasmania in Boots" blog |
| `written_by` | CONTENT → AMBASSADOR | "Tasmania in Boots" written by Mara Chen |
| `exclusive_to` | PRODUCT → LOYALTY_TIER | Aurora Crag XR exclusive to Trail Club Plus+ |
| `embodies` | PRODUCT → BRAND_PILLAR | Helios embodies Built for the Worst Weather |
| `prefers` | CUSTOMER_SEGMENT → CATEGORY | Thru-Hikers prefer Ultralight Quilts over Sleeping Bags |
| `requires` | ACTIVITY → CATEGORY | Alpine Climbing requires Climbing Harnesses |

**Why this graph matters:** Every D2C personalization vendor sells "you may also like" widgets. None of them can answer "*why* this product, and what does the customer's preferred ambassador say about it?" in one query. The Aurora journey graph turns recommendation into a *grounded, citable, explainable* answer.

**Agent tool:** Same as Enterprise variant — `arag-graph-agent` skill for design, then hand-tune the schema, then run extraction across all five KBs.

### 5.5 The six demo surfaces

| Route | Tier(s) | Purpose |
|---|---|---|
| `/` (landing) | — | Hero. Aurora brand, residency + BYO-LLM badges. 90 sec. |
| `/storefront` | Tier 1 + 2 | Conversational product discovery. Hybrid search across product + content + support. AI Answer with side-by-side cross-sell. People Also Ask. Content-type filters (products / guides / videos). |
| `/concierge` | Tier 2 | The two-voice concierge — *Shopper mode* (3 sentences + cross-sell CTA, no login required) and *Trail Club Member mode* (detailed gear advice, loyalty-perk citations, member-exclusive recommendations). Multilingual switch front and centre. |
| `/personalize` | Tier 3 | The three structured-generation workflows (Section 6). |
| `/journey-graph` | Tier 4 | The Aurora customer-journey graph. Click any node — product, activity, destination, ambassador, content — and traverse. Hybrid-retrieval "related content" panel on every selection. |
| `/abandoned-cart` | Tier 4 (composite RAG) | The flagship Tier 4 flow. "Sara abandoned her cart with the TerraTrek 7 boot in NA size 8 last Tuesday — what should we send her?" Four-step composite pipeline visualised. |

The floating chat is *always present* across every surface, and it switches voice based on whether the demo's active persona is Sara (prospect) or Mara (Trail Club Pro member). This is the surface partners point at when they pitch their content-engineering retainer.

---

## 6. The three Tier 3 workflows

Each workflow is a schema-constrained generation pattern that mirrors a real digital-experience operations need. Each is a live demo button on the `/personalize` route.

### 6.1 Adventure-Plan Generator

- **What it does:** Given a destination, dates, party size, experience level, and known sizing profile, generates a structured trip plan combining packing list, daily itinerary, gear recommendations from the Aurora catalog, ambassador-authored tips, and safety / weather notes.
- **Inputs:** `destination` (dropdown), `dates`, `party_size`, `experience_level`, `customer_segment`, `sizing_profile`.
- **ARAG primitive:** P3 (Constrain) — `askForJson` with schema `{ trip_overview: {...}, packing_list: [{ category, product_recommendation, source_url, why }], daily_plan: [{ day, distance, elevation, activity, gear_focus }], ambassador_tips: [{ ambassador_name, tip, source_url }], safety_notes: [...] }`.
- **Why it lands in the room:** Every D2C retailer has tried to build this with a Notion template, a Shopify app, or a no-code form. Mission Control: CX generates one in 12 seconds from the brand's own product + content + ambassador corpus, every recommendation cited to a source page the customer can deep-link into.

### 6.2 Loyalty-Personalization Engine

- **What it does:** Given a Trail Club member's segment, recent purchases, tier, and region, generates structured next-best-actions — events to invite, exclusive products to surface, content to deliver, partner offers to activate, point-balance optimization suggestions.
- **Inputs:** `member_segment`, `tier`, `recent_purchase_ids`, `region`.
- **ARAG primitive:** P3 (Constrain).
- **Schema:** `{ events: [{ name, date, region, why_this_member }], exclusive_products: [{ name, tier_required, why }], content_to_deliver: [{ title, format, ambassador, source_url }], partner_offers: [{ partner_name, offer, expiry }], points_optimization: { current_balance, suggested_actions: [...] } }`.
- **Why it lands:** This is the workflow that converts "we want AI personalization" into a six-figure retainer. Every output is a structured object that drops into a customer's existing email / loyalty / CDP stack. No black-box recommender — every action is explainable to the customer who receives it.

### 6.3 Product-Comparison & Cross-Sell Generator

- **What it does:** Given a product (or category), generates a structured comparison table against alternatives, a pair-with cross-sell list pulled from the graph, pro-tips from ambassadors, and customer-segment-specific positioning.
- **Inputs:** `product_id` (or `category`), optional `customer_segment` for positioning.
- **ARAG primitive:** P3 + P4 (Constrain + Reason over relations) — this is the cross-primitive workflow that mirrors the Enterprise variant's Compliance-Trace. Schema-constrained output that *traverses the journey graph* to populate the pair-with section.
- **Schema:** `{ product: { name, summary, price, brand_pillars }, comparison_table: [{ attribute, this_product, alternative_1, alternative_2 }], pairs_with: [{ name, why_this_pairing, source_url }], ambassador_tips: [{ ambassador_name, tip, source_url }], segment_positioning: { for_weekend_adventurers: "...", for_thru_hikers: "...", for_alpine_pros: "..." } }`.
- **Why it lands:** Every retailer has cross-sell widgets. None of them are grounded in *brand expertise*. Mission Control: CX cross-sells using the same ambassador-authored content the brand spends millions producing for marketing — which is the moment the CMO realises content and commerce just merged.

---

## 7. Build Plan (8 weeks, single strong full-stack engineer with Progress SE support)

Same overall shape as the Enterprise variant. Effort estimates are nearly identical — the chassis is the same, only the corpus, the graph schema, and the workflows differ.

### Phase 1 — Corpus design + KB ingestion (Weeks 1–2)

- Lock the Aurora anchor details (6 products, 4 ambassadors, 5 destinations, 3 segments, 3 loyalty tiers, 4 brand pillars).
- Run `progress-kb-use-case-generator` five times with Aurora's brand voice as input.
- Provision five ARAG KBs in EU region. Configure labelsets — `activity`, `destination`, `season`, `audience`, `loyalty_tier`, `brand_pillar`.
- **Critical Phase 1 work specific to CX variant:** populate the field-engineered surfaces. Every product page in `kb-aurora-product` gets a `callToAction` field (one short, branded sentence). Key product pages get a `searchResultDisplay` field with title + description copy designed for AI-answer rendering. Every video in `kb-aurora-content` gets a structured `videoInfo` JSON with speakers, topics, key points, and a call-to-action.
- **Exit criteria:** All five KBs ingested. The field-engineered surfaces visible in `/find` responses.

### Phase 2 — Customer-journey graph agent (Weeks 2–3)

- Use `arag-graph-agent` to draft the extraction agent from product, content, and loyalty KBs.
- Hand-tune the entity / relation schema against Section 5.4.
- Run extraction. Verify `recommended_for`, `pairs_with`, `worn_by`, `featured_in` relations populate — these are the four relations the demo leans on hardest.
- **Exit criteria:** Graph queries return clean typed nodes. The "click TerraTrek 7 → see Mara Chen → see her trail-guide content → see featured products" traversal works end-to-end.

### Phase 3 — Sample-ARAG-App fork + Aurora re-skin (Weeks 3–4)

- Fork `Sample-ARAG-App` into `Mission-Control-CX`.
- Strip ARAKS branding. Replace with Aurora — sandstone + alpine-blue palette, generous whitespace, photography-led hero.
- Replace the static markdown content pages with Aurora landing copy.
- Configure the floating chat with two voices — Shopper (prospect) and Trail Club Member. The Shopper voice prompt should match the Sample ARAG App's prospect-mode floating chat almost verbatim (the CTA-only rules); the Member voice should match the research-assistant style.
- Wire the customer-persona switcher (Sara vs Mara) at the top of every page.
- **Exit criteria:** All six demo routes loading against real Aurora content with no ARAKS leakage.

### Phase 4 — The three workflows + composite-RAG flow (Weeks 4–6)

- Build the three Tier 3 workflows on `/personalize`.
- Build the abandoned-cart composite-RAG flow on `/abandoned-cart`. Four steps visualised:
  1. Pull Sara's session history (hand-crafted fixture data) and current cart.
  2. Initial `/ask` against the product + content KBs: "Sara is a Weekend Adventurer based in NA, she added TerraTrek 7 size 8 to cart, what's the best winback message?"
  3. Citation evaluation; if low confidence, `/find` across content + loyalty KBs for similar-segment behavior patterns.
  4. Graph traversal: TerraTrek 7 → `pairs_with` → Skyline 45L; TerraTrek 7 → `featured_in` → Mara Chen's trail guide.
  5. Re-ask with augmented context. Generate structured output: `{ subject_line, body, cta_url, cta_label, cross_sell_products: [...], ambassador_quote: {...}, send_window: "..." }`.
- Each workflow ships with a presenter-mode hotkey for "go straight to the answer" if the LLM is slow.
- **Exit criteria:** All four workflows demo end-to-end without code edits.

### Phase 5 — Multilingual + production-readiness polish (Week 6–7)

- Multilingual concierge: hard-coded language dropdown (English, Spanish, French, German, Japanese, Mandarin) with the `Respond in {language}:` query prefix pattern. The CMO in the room asks for this in the first ten minutes.
- BYO-LLM toggle wired to at least two of three named endpoints. UI-stub the third if budget binds.
- Residency badge visible in the header.
- Rate-limit-aware client in the wrapper.
- Lightweight observability panel — call volume per surface, average response time per workflow.
- **Exit criteria:** Live "what about Japanese-speaking customers" question has a one-click answer.

### Phase 6 — Demo script + recording + re-skin playbook (Week 7–8)

- Rehearse Section 9 end-to-end three times. Record one take.
- Write the CX re-skin playbook (Section 10).
- Internal review board.
- Fix all reviewer notes.
- **Exit criteria:** Recorded demo ships. Re-skin playbook committed.

---

## 8. Effort estimate breakdown

| Phase | Weeks | Effort drivers |
|---|---|---|
| 1. Corpus + ingestion + field engineering | 2 | Skill orchestration, Aurora brand-voice tuning, manual population of CTA and searchResultDisplay fields on hero products |
| 2. Journey graph agent | 1.5 | Schema design, tuning, extraction across product + content + loyalty |
| 3. Fork + reskin + floating chat | 1 | Palette swap, photography-led hero, two-voice chat wiring, persona switcher |
| 4. Workflows + composite RAG | 2 | Three schemas, abandoned-cart pipeline visualisation, fixture data for Sara |
| 5. Multilingual + production polish | 1 | Language switch, BYO-LLM toggle, observability panel |
| 6. Demo + re-skin playbook | 0.5 | Script, rehearsal, recording, playbook |
| **Total** | **8 weeks** | Single strong full-stack engineer with Progress SE on call |

---

## 9. The 25-Minute Demo Script

The talk track for the CMO room.

### 0:00 — 1:30 | Hero + framing (90 sec)

> "Most AI demos for retail are chatbots over PDFs. This is not that.
>
> Mission Control: CX is a complete digital-experience platform built on Progress Agentic RAG. Conversational discovery, two-voice concierge, structured personalization, customer-journey reasoning, and abandoned-cart intelligence — all behind one API key, all from one corpus of your product, content, and customer data.
>
> The brand I'm demoing against is Aurora Outfitters. Fictional D2C outdoor retailer — six hero products, four ambassadors, five destinations, three customer segments. The corpus is everything Aurora's content and merchandising teams already produce: product pages, fit guides, trail guides, ambassador videos, loyalty content, brand pillars. Nothing custom. Just their existing content, with five custom fields per asset that drive the AI behaviour."

*[Indicate top-right: residency badge "EU", BYO-LLM badge "Azure", language switcher "English".]*

> "Three things you'll see throughout: EU residency you choose, the LLM you already pay for, and language switching that's a query prefix away. None of those require code changes once you're live."

### 1:30 — 5:30 | Tier 1 + 2: Storefront + Floating Chat (4 min)

*[Navigate to `/storefront`. Show Aurora-branded storefront. Persona at top says "Sara — prospect — Weekend Adventurer".]*

*[Type into the search bar: "I need a boot for the Overland Track in November."]*

> "Hybrid search across product, content, and support. Notice the AI answer at the top — two sentences plus a call-to-action picked from Aurora's own content. *Notice where the CTA came from*."

*[Hover/click the CTA — it links to a TerraTrek 7 PDP. Switch view to show source field in the back-end.]*

> "That CTA isn't hard-coded. It's a `callToAction` field on the product page. The brand's merchandising team writes one short sentence per product; the model picks the best one for the query. This is *content-engineered CTAs* — and it's the highest-leverage recurring service you can sell. Every Aurora copywriter you train is recurring revenue."

*[Open the floating chat at bottom right. Sara is the active persona, so the chat is in Shopper mode.]*

*[Type: "What jacket do I need?"]*

> "Three sentences, one CTA, then stop. That's the Shopper voice. Designed for conversion."

*[Click the persona switcher at the top. Switch to Mara — Trail Club Pro member.]*

*[Same chat window, same query: "What jacket do I need?"]*

> "Same KB. Same model. Different prompt. Five paragraphs, multi-source citations, member-exclusive recommendations — including the Aurora Crag XR which is exclusive to Trail Club Plus+. The model knows Mara's tier because it's in the context. The CTO building this used to scope a six-month build; here it's a configuration."

*[Switch the language to French. Same query.]*

> "And the multilingual answer is a query prefix away. No separate KB, no separate embeddings, no separate model."

### 5:30 — 10:30 | Tier 3: The three workflows (5 min)

*[Navigate to `/personalize`. Click "Adventure-Plan Generator". Inputs: Patagonia W Trek, 6 nights, party of 2, intermediate experience, Weekend Adventurer segment, standard sizing.]*

> "Schema-constrained generation. Structured output — packing list, day-by-day itinerary, gear from Aurora's catalog, tips quoted from the ambassadors who've actually been there.
>
> Every gear pick is a deep link into a PDP. Every tip is a deep link into the ambassador's blog. The customer who receives this experience can share their itinerary as a URL — every conversation becomes a marketing channel."

*[Click "Loyalty-Personalization Engine". Inputs: member_segment = Thru-Hiker, tier = Trail Club Plus, recent purchases = Skyline 45L + Quill 850, region = EMEA.]*

> "Same primitive, different schema. Events to invite this member to, exclusive products to surface, content to deliver this week, partner offers, point-balance optimization. Structured output that drops into your existing Klaviyo, Braze, or Iterable in three lines of code. The marketing operations team owns this — no separate AI vendor, no separate integration."

*[Click "Product-Comparison & Cross-Sell". Input: product = TerraTrek 7, segment = Weekend Adventurer.]*

> "Watch this one — it's the cross-primitive workflow. Schema-constrained comparison table *and* it traverses the journey graph mid-generation to populate the pair-with section."

*[Result renders with comparison table, pairs-with section, ambassador tips, and segment-specific positioning paragraphs.]*

> "Every pair-with is a real relation in Aurora's content. The ambassador tips are cited to their source posts. The segment positioning paragraphs use exactly the right language for each customer cohort — because the brand voice is in the corpus, not in a prompt I wrote five minutes ago."

### 10:30 — 16:30 | Tier 4: The journey graph (6 min)

*[Navigate to `/journey-graph`. Initial graph loads — products, activities, destinations, ambassadors, content as coloured nodes.]*

> "This graph wasn't curated. It was extracted from Aurora's own content by a custom data-augmentation agent. Ten entity types, twelve relation types, all designed for *customer journeys*, not abstract knowledge.
>
> The recommendation engine you currently pay for can't tell you *why* it recommended a product. This can. Every edge is queryable through one API."

*[Click the PRODUCT node for Aurora TerraTrek 7. Graph expands.]*

> "TerraTrek 7 is recommended for Day Hiking and Thru-Hiking, pairs with the Skyline 45L pack and the Helios jacket, is featured in Mara Chen's Tasmania guide, fits Wide Foot sizing profile, and embodies the Repairable for Life brand pillar."

*[Click the AMBASSADOR node for Mara Chen.]*

> "Mara has written 12 pieces of content across the Aurora corpus, recommends 9 of Aurora's hero products, and her content drives — Aurora's analytics tell me — the highest engagement among Thru-Hiker segment customers. Click her node and you can pivot the whole storefront experience to be Mara-led for that customer segment."

*[Click the DESTINATION node for Tasmania Overland Track.]*

> "Three products `suited_to`, two ambassadors with content, six pieces of trail-guide content, and a related-products panel powered by hybrid retrieval — keyword plus semantic. This isn't the recommendation engine you bought last year. This is the *brand's expertise* — encoded once, queryable everywhere."

### 16:30 — 22:00 | Tier 4 capstone: The abandoned-cart composite RAG (5:30)

*[Navigate to `/abandoned-cart`. The page loads Sara's profile: NA region, Weekend Adventurer segment, cart abandoned 36 hours ago with TerraTrek 7 size 8.]*

> "Sara is a real persona in our demo fixtures. She abandoned a cart with the TerraTrek 7 boot 36 hours ago. Most AI personalization vendors handle this by firing a generic 'come back for 10% off' email. Watch the pipeline."

*[Click "Generate Winback". Pipeline starts.]*

*[Step 1 visualisation: Initial `/ask` against product + content KBs. Citations come back. Two are low-confidence.]*

> "Step one: standard retrieval-augmented query. The model has the boot details and Sara's profile. Two citations came back below confidence — the model knows it doesn't know enough yet."

*[Step 2 visualisation: `/find` across content + loyalty KBs for similar-segment behavior patterns.]*

> "Step two: when confidence is low, fall back to hybrid find across content and loyalty. Five more candidates — including a Weekend Adventurer trail-guide and a Trail Club Standard onboarding asset."

*[Step 3 visualisation: Graph traversal — TerraTrek 7 → `pairs_with` → Skyline 45L; TerraTrek 7 → `featured_in` → Mara's Tasmania guide.]*

> "Step three: the journey graph adds two pair-with products and Mara's trail guide. The pair-withs aren't algorithmic guesses — they're brand-curated relationships."

*[Step 4: Final structured output renders.]*

```
{
  subject: "The Overland Track is calling, Sara",
  body: "...",
  cta_label: "Pick up where you left off →",
  cta_url: "https://aurora.example/cart/tt7-na-8",
  cross_sell_products: [Skyline 45L, Helios jacket],
  ambassador_quote: { quote: "...", attribution: "Mara Chen",
                      source_url: "..." },
  send_window: "Tuesday 7:45pm local — peak Aurora open-rate window"
}
```

> "Step four: re-ask with everything augmented in. Structured output — subject line, body, CTA, cross-sell products, ambassador quote, even a recommended send window from Aurora's open-rate data. The model wrote the body in Aurora's voice because the brand pillars and the ambassador content were in the context.
>
> This drops into your Klaviyo or Braze in three lines. Your marketing-ops team controls every input. Your merchandising team controls every CTA. The model is doing what it's good at — synthesis. The brand is doing what it's good at — content. That's the platform."

### 22:00 — 25:00 | Close + invitation (3 min)

*[Return to landing page.]*

> "What you've seen is one application built on five knowledge bases, one extraction agent, three custom workflows, and one composite-RAG pipeline. Every output is grounded, citable, explainable, and editable by your content team without a code deployment.
>
> Three things you have right now that none of your personalization vendors offer:
>
> 1. **Every recommendation is explainable.** Every output cites its source. Every CTA links to the field your copywriter edited. No black-box recommender.
>
> 2. **Content is the optimization surface, not code.** Your content and merchandising teams are the people improving the AI every day. The next launch isn't a sprint cycle — it's a copy edit.
>
> 3. **One platform, not five.** Search, chat, personalization, journey reasoning, winback intelligence — same API, same KB, same content team. Every AI feature you'll ship in the next three years lives behind this one engine.
>
> The next step is a four-week co-engineered POC against your own catalog and content. We pick one of the workflows you saw today, replace Aurora with your brand, and Mission Control becomes your team's daily driver inside one quarter. Let me show you the scoping doc."

*[End of 25-minute demo.]*

---

## 10. Re-Skin Playbook (CX variant)

A partner takes Mission Control: CX and re-points it at their customer's brand. The work follows the same shape as the Enterprise variant but uses different anchor categories.

### What stays

- Six-surface route structure.
- Floating chat with prospect/member voice toggle.
- Multilingual switch.
- Composite-RAG flow.
- Schema-constrained workflow chassis.

### What changes per customer

| Asset | Effort | Tool |
|---|---|---|
| Corpus (5 KBs of customer content + field-engineered CTAs) | 1.5–2.5 weeks | Customer-supplied or `progress-kb-use-case-generator`; field engineering is manual |
| Anchor entities (products, ambassadors/spokespeople, destinations/use-cases, segments) | 1 week | Manual + corpus skill |
| Customer-journey graph schema | 4–5 days | `arag-graph-agent` with hand-tuning |
| Three workflow schemas (replace adventure-plan / loyalty / cross-sell with customer-relevant equivalents) | 1 week | Hand-design against customer's stated needs |
| Branding (palette, typography, photography direction, tone) | 3–5 days | Tailwind config + copy edit + photography swap |
| Demo script (talk track) | 2 days | Rewrite Section 9 against customer's domain |
| **Total per customer demo** | **3.5–5 weeks** | One strong engineer + one partner SE |

The CX variant takes slightly longer to re-skin than the Enterprise variant because field-engineered CTAs and visual brand direction are manual. That's also why partners can charge more for it — the field-engineering work is a recurring service.

### Tier-3 customer offering

Partners offer "Mission Control: CX Co-Engineering" as a fixed-scope package: **4-week re-skin + 1-week dry run + delivered demo asset + 30-day content-engineering retainer**. Price band: $50–100K. The retainer is the recurring-revenue hook — every customer needs ongoing field engineering as their catalog and content evolve.

---

## 11. Variant comparison (Enterprise vs CX)

For partners deciding which Mission Control to build first.

| Dimension | Enterprise | CX |
|---|---|---|
| **Buyer in the room** | CTO / CIO / Chief Data Officer | CMO / Head of Digital / Chief Customer Officer |
| **Headline pitch** | Control room for unstructured knowledge | Digital-experience platform for content + commerce |
| **Corpus** | Atlas Global Industries (industrial) | Aurora Outfitters (D2C retail) |
| **Killer demo moment** | Composite-RAG incident root cause + the graph showing cross-functional reasoning | Two-voice floating chat + content-engineered CTAs + abandoned-cart pipeline |
| **Why ARAG vs competitors** | BYO-LLM kills lock-in; residency kills compliance objection; typed graph kills "we already have RAG" | Explainable personalization kills "we already use Algolia/Bloomreach/Klevu"; content-engineering loop kills "AI is an IT project" |
| **Recurring revenue hook** | Agent maintenance + graph curation + production hardening | Content engineering retainer + workflow expansion + new-channel rollout |
| **Average partner deal size** | $250–500K | $150–350K |
| **Typical sales cycle** | 6–12 months | 3–6 months |
| **Effort to build** | 8 weeks | 8 weeks |
| **Effort to re-skin per customer** | 3–4 weeks | 3.5–5 weeks |

A partner whose book of business skews enterprise-IT builds the Enterprise variant first. A partner whose book skews marketing-led builds CX first. Partners with both books eventually need both — the variants share 70%+ of their build cost because the chassis is identical.

---

## 12. Success criteria — what "done" looks like (CX variant)

Mission Control: CX ships when *all* of the following are true:

1. The full 25-minute demo runs end-to-end without code edits in front of two reviewers, no keyboard touches outside the documented hotkeys.
2. The Aurora customer-journey graph returns at least 150 typed-entity nodes and 400 typed relations across the product, content, and loyalty KBs.
3. Field-engineered CTAs are visible in every search result and every AI answer on the storefront surface, and the presenter can point at the source field for every one.
4. The two-voice floating chat (Shopper vs Trail Club Member) is demonstrably different in voice, length, and CTA behaviour for the same query.
5. The abandoned-cart composite-RAG flow produces a winback message demonstrably better — on at least three reviewer-judged criteria — than a single-shot `/ask` for the same input.
6. The multilingual switch works for at least three of the six listed languages.
7. The BYO-LLM toggle works for at least two of three named endpoints.
8. Recorded demo uploaded and shared internally before the wider partner programme opens.
9. CX re-skin playbook committed to this repo.
10. Build owner has trained at least one other Progress SE to deliver the demo cold.

---

## 13. Owners, dependencies, status

| Item | Owner | Status |
|---|---|---|
| Brief (this doc) | Jay Sanderson | **Shipped — this commit** |
| Aurora anchor details | Jay Sanderson | TODO — Phase 1 prerequisite |
| Corpus generation (5 KBs) | Progress SE + `progress-kb-use-case-generator` | TODO |
| Field engineering (CTAs, searchResultDisplay) | Aurora brand copywriter persona — handled by build owner | TODO |
| Journey graph agent | Progress SE + `arag-graph-agent` | TODO |
| Sample-ARAG-App fork + Aurora reskin | Build owner | TODO |
| Three Tier 3 workflows | Build owner | TODO |
| Abandoned-cart composite RAG flow | Build owner | TODO |
| Multilingual + production polish | Build owner | TODO |
| 25-minute demo recording | Build owner | TODO |
| Re-skin playbook | Build owner | TODO |
| Internal review board | Progress Solution lead | TODO |

**Critical path:** Phase 1 → 2 → 3, same as the Enterprise variant. The field-engineering work in Phase 1 is the *most under-estimated* effort in the CX build — it's content authoring, not engineering, and it's where you discover whether the brand voice work has actually been done. Budget realistically.

---

## 14. What I need from you to start Phase 1

Two decisions before the first KB is provisioned:

1. **Aurora anchor details — sign-off or override.** Six products, four ambassadors, five destinations, three customer segments, three loyalty tiers, four brand pillars. Want a different industry — banking, hospitality, education, media, telco? Lock now.
2. **Variant priority.** If both Enterprise and CX are on the table for the same 90-day window, pick which one ships first. Building both at once is feasible at 2 FTE; building Enterprise first then CX (or vice versa) is feasible at 1 FTE, eight weeks each, sixteen weeks total. The shared chassis means CX takes about two weeks less the second time around.

Once those two are answered, Phase 1 kicks off and you'll see the first Aurora KB ingested inside a week.
