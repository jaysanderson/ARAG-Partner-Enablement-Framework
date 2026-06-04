# Video Script — Build 11: Production Readiness

> **Duration target:** 10 minutes
> **Format:** Screen recording + voiceover. Mostly conceptual; one config demo, one short vibe-code.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 11 · Production Readiness."* Subtitle: *"The CTO meeting language."*

**VOICEOVER:**
> Ten minutes. Three things the customer's CTO cares about — residency, model choice, rate limits. Plus the one observability metric that matters more than the rest. By the end you'll have the 90-second pitch for each.

## Section 1: Residency (0:30 – 2:00)

**ON SCREEN:** A map showing EU and USA regions. Annotation: *"Per KB. Choose at provisioning. Data stays."* Then cut to Nuclia dashboard showing the KB region setting.

**VOICEOVER:**
> Residency. Per KB. Set at provisioning. The KB's documents, embeddings, graph, metadata — all stay in the chosen region. EU or USA.
>
> The 90-second pitch to the CTO: *"EU customers, your data stays in EU. US customers, yours stays in US. If you need both, you provision two KBs and your app routes by user context. We don't move it."*
>
> Watch what residency *doesn't* answer. It doesn't pick the LLM. That's BYO-LLM. Next section.

## Section 2: BYO-LLM (2:00 – 4:30)

**ON SCREEN:** Three-column slide — Azure OpenAI, Google Vertex, AWS Bedrock — with their model offerings under each. Then switch to Nuclia dashboard. Open the KB's generative-model setting. Switch from default to "Custom Azure OpenAI." Paste in endpoint URL + API key from a prepared deployment. Save. Run a quick `/ask` query — it works, voice slightly different.

**VOICEOVER:**
> BYO-LLM. ARAG decouples retrieval from generation. The retrieval engine, the graph, the data-augmentation agent — all on ARAG. The LLM is the customer's choice — Azure, Vertex, or Bedrock, pointed at their own tenant.
>
> Live demo. KB settings — switch from default model to Custom Azure. Paste my Azure deployment endpoint and key. Save. Run a query. Works. Same retrieval, different generator.
>
> Five objections this kills.
>
> *"We already use Azure"* — point the KB at their tenant.
> *"Vendor lock-in"* — they own the model endpoint; ARAG doesn't.
> *"Security audit"* — calls go through *their* tenant's logging.
> *"Procurement contracts"* — LLM costs stay on Azure / GCP / AWS bills.
> *"We want [other model]"* — if it's on Azure / Vertex / Bedrock, yes.

## Section 3: Rate limits (4:30 – 5:30)

**ON SCREEN:** Slide: *"2400 req/min default. Raisable via support."* Below: small diagram showing client-side coalescing + backoff.

**VOICEOVER:**
> Rate limits. Default 2400 requests per minute per service account. The 90-second pitch — *"Default 2400 req/min. We build clients with backoff and request coalescing. Production volume above 2400 — open a support ticket. Routine increase, no contract amendment."*
>
> Two engineering reflexes. Coalesce identical inflight requests so a chatty front-end doesn't burn through the budget. Back off exponentially on 429. The AI will produce both in twenty lines if you brief it correctly.

## Section 4: Vibe-code the rate-limited client (5:30 – 7:00)

**ON SCREEN:** Claude Code. Paste the rate-limited-client brief from the walkthrough. AI generates ~30 lines. Fast-forward. Show the finished file with two pieces highlighted — the in-flight map (coalescing) and the backoff function.

**VOICEOVER:**
> Vibe-code. Brief Claude — in-flight coalescing, exponential backoff on 429, 15-second timeout, log every call. Thirty lines, generated.
>
> Two pieces I check. The inflight map — if we already have this exact query in progress, return the existing Promise instead of firing a new request. The backoff function — exponential, capped at 8 seconds, four retries.
>
> Production-ready boilerplate. Every customer engagement past Foundations uses some variant.

## Section 5: Observability — citation rate (7:00 – 9:00)

**ON SCREEN:** Dashboard mockup with six tiles — latency p50/p95/p99, citation rate, request volume, error rate, BYO-LLM endpoint distribution, rate-limit headroom. **Highlight citation rate prominently — bigger tile, more central.**

**VOICEOVER:**
> Observability minimum. Six metrics. Latency. Request volume. Errors. Endpoint distribution. Rate-limit headroom.
>
> But one of these matters more than the rest. **Citation rate.** The percentage of `/ask` responses returning non-empty citations.
>
> When citation rate drops twenty percent week-over-week, something has changed in retrieval. Maybe the ingest pipeline. Maybe a chunking config. Maybe the BYO-LLM endpoint started returning differently. Maybe a labelset got broken. Citation rate is the single leading indicator of platform health.
>
> Alarm on it. If it drops below eighty percent for two consecutive hours — page whoever owns the deployment.
>
> The SRE team you brief at the customer needs to understand this metric. Other vendors' RAG stacks don't surface it cleanly. You can.

## Wrap (9:00 – 10:00)

**ON SCREEN:** End card. *"Build 11 — Capstone Prep. Next."*

**VOICEOVER:**
> Build 11 is the synthesis Build. Eleven Builds in, you've seen every primitive. Now you plan the capstone — pick the variant, scope the corpus, write the AI prompts that will produce it. Fifteen minutes. See you there.

---

## Production notes

- **Section 2 (BYO-LLM toggle):** the dashboard demo is the headline visual. Pre-rehearse the path — the dashboard's generative-model setting differs across tenant tiers. If your tenant doesn't have the toggle, narrate the change verbally and show the settings page.
- **Section 5 (citation rate):** make the citation rate tile visually dominant in the mockup. This is the most important single visual in this Build.
- **Talk-track-heavy:** this Build is more lecture than live build. Keep pacing crisp; partners will skim if you drag.
