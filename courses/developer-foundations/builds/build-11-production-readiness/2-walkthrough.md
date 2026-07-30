# Build 11 — Walkthrough: Production Readiness

> Estimated time: 2–3 hours focused. Read the [lesson](1-lesson.md) first.
>
> **This is the Build with the least vibe-coding and the most strategic value.** It's mostly dashboard configuration + writing artefacts the customer's CTO will read aloud in their internal architecture review. Take it seriously — the language you use here is the language that closes Tier-3 and Tier-4 deals.

## What you'll build

Three production-readiness artefacts:

1. **A residency statement** — the 4-sentence paragraph you read to the CTO.
2. **A rate-limit-aware client** — code that handles 429s, retries with backoff, coalesces duplicate requests.
3. **An observability dashboard spec** — the widgets, the alarms, the targets.

Plus a `production-checklist.md`.

> LLM connection options (platform-billed, BYOK, BYO-LLM) are **taught** in this Build's [`lesson.md`](1-lesson.md#llm-flexibility-platform-byok-and-byo-llm) and reviewed by quiz, but configuring BYOK/BYO-LLM against a real account is **not a walkthrough deliverable** — you don't ship a `byo-llm-config.md` or a toggle here. See Step 3 below + the lesson's [*When BYO-LLM doesn't fit: clean descope*](1-lesson.md#when-byo-llm-doesnt-fit-clean-descope) section for why.

## What you'll need open

- **Your Progress Agentic RAG dashboard** with your Build 0 KB.
- **Your terminal, editor, AI assistant**.

---

## Step 1 — Set up your project folder (5 min)

```bash
cd ~/Desktop/developer-foundations
mkdir build-11
cd build-11
code .
```

This Build is mostly markdown artefacts + one code file. Light Node setup is fine:

```bash
npm init -y
npm install dotenv
cp ../build-0/.env .
```

> **No-npm path** (see the [vibe-coding guide](../../vibe-coding-guide.md#npm-or-no-npm-pick-the-path-that-fits-your-machine)). Skip `npm init`/`npm install` — just `cp ../build-0/.env .`. Run the rate-limited client with `node --env-file=.env src/lib/rateLimitedRagClient.mjs`. Use the **No-npm brief** in Step 4a instead of the main brief.

---

## Step 2 — Write the residency statement (20 min)

This is the artefact the CTO will read. **It must be precise. No hand-waving.**

### 2a. Capture the facts from your dashboard

Open the Progress Agentic RAG dashboard. For your KB, capture:

- **Region** — USA, Europe (AWS or GCP), Australia, or Israel.
- **Endpoint URL** — your `NUCLIA_API_URL` from Build 0.
- **Zone identifier** — typically the prefix of the URL (e.g., `aws-eu-1`).
- **Default generative model** — usually shown in Settings → Generative model.
- **LLM connection type** — platform-billed (default), BYOK, or BYO-LLM.
- **Enterprise-ready status** — only applicable if platform-billed; check the flag next to your chosen provider/model in the dashboard's LLM list. Not applicable for BYOK/BYO-LLM — that's the customer's own agreement with their provider.

### 2b. Write the statement

Create `residency-statement.md`. Use this template, replace the placeholders, then **read it aloud** to make sure the cadence is professional:

```markdown
# Knowledge Box Residency — <KB Name>

The <KB name> Knowledge Box is provisioned in the <REGION> region
(zone <zone-id>). All ingested content, derived embeddings, the
knowledge graph, and extracted metadata reside within <jurisdiction>
jurisdiction.

The LLM is <platform-billed / BYOK / BYO-LLM> — currently
<provider, e.g., Azure OpenAI in Sweden Central>. <If platform-billed:
this provider/model route is marked enterprise-ready in the dashboard,
meaning requests stay in-region and the provider does not train on
submitted data.> <If BYOK/BYO-LLM: the model never sees ARAG
infrastructure — every generation request leaves Progress Agentic RAG
and lands in the customer's own account/endpoint, billed to the
customer directly; region and data-training terms are the customer's
own agreement with that provider, not something ARAG attests to.>

For <REGION>-residency requirements, both the KB and the LLM route are
provisioned in <REGION>. Cross-region operation is not supported by
default and requires explicit configuration.

Authentication uses scoped service-account JWTs with TTL <ttl-value>
and revocation via the Progress Agentic RAG dashboard. PII handling follows the
customer's data-classification policy; no PII is logged in ARAG's
operational telemetry.
```

**Edit each `<placeholder>`** with your actual values.

### 2c. The cadence

Read it aloud, twice. Time it. Should be **30–40 seconds**. That's the bite-sized version you'll deliver in the CTO meeting.

Save the file.

---

## Step 3 — LLM connection: concept-only in this Build (5 min)

Platform-billed, BYOK, and BYO-LLM are covered in detail in this Build's [`lesson.md`](1-lesson.md#llm-flexibility-platform-byok-and-byo-llm) — the three connection options, the enterprise-ready indicator, and the customer objections BYOK/BYO-LLM neutralise.

**Configuring BYOK or BYO-LLM against a real customer account is not a walkthrough deliverable.** Most partners running this Build do not have a customer's own OpenAI/Azure/Anthropic/etc. account or an OpenAI-compatible endpoint to point a KB at — and shipping a non-functional toggle in a real customer build is worse than shipping no toggle (see [*When BYO-LLM doesn't fit: clean descope*](1-lesson.md#when-byo-llm-doesnt-fit-clean-descope) in the lesson). That configuration is a per-tenant platform task you run **during the co-engineered POC with the customer**, not a Foundations exercise. Platform-billed models, by contrast, always work in a demo — no customer credentials required.

What you owe this Build's reviewer here is **fluent talk-track**, not a config file. Read the lesson's LLM-flexibility section, then in your residency statement (Step 2) be ready to answer the follow-up question — *"is the LLM EU-resident too, and is it enterprise-ready?"* — in one sentence, without hand-waving. That's the bar.

---

## Step 4 — Vibe-code the rate-limited client (35 min)

This is the **only code file** in Build 11. It demonstrates production patterns: 429 backoff, request coalescing, timeout, structured logging.

### 4a. Brief your AI

**On the npm path?** Paste:

```
In src/lib/rateLimitedRagClient.mjs, write a class
RateLimitedRagClient that wraps ARAG /ask calls with
production-grade resilience.

Constructor takes no args (reads NUCLIA_* from process.env via dotenv).

Public method:
  async ask(query: string, prompt?: object): Promise<{
    answer: string;
    citations: any[];
    latencyMs: number;
    retries: number;
    fromCoalescing: boolean;
  }>

Behaviour:

1. COALESCING:
   - Generate a cache key: `ask:${query}:${JSON.stringify(prompt || {})}`.
   - Maintain a Map<string, Promise> of in-flight requests.
   - If a matching in-flight Promise exists when ask() is called,
     return that Promise directly (mark result.fromCoalescing = true).
   - Otherwise launch a new request and store it in the map.
   - Remove from map when the Promise resolves or rejects.

2. BACKOFF on 429:
   - Wrap the actual fetch in askWithBackoff(query, prompt, attempt=0).
   - On HTTP 429, wait 2^attempt seconds (capped at 8s), retry.
   - Max 4 retries.
   - Track retry count and return in result.retries.

3. TIMEOUT:
   - 15-second timeout on each individual fetch (use AbortController).
   - If timeout fires, count as a failed attempt; backoff may still retry.

4. STRUCTURED LOGGING:
   - At start of each ask(), console.log({ event: 'ask-start', query, ts }).
   - At end, console.log({ event: 'ask-end', query, latencyMs, retries, status, ts }).
   - On 429, console.log({ event: 'rate-limited', attempt, backoffMs }).

5. The actual /ask call:
   - POST to ${process.env.NUCLIA_API_URL}/kb/${process.env.NUCLIA_KB_ID}/ask
   - Header: X-NUCLIA-SERVICEACCOUNT: Bearer ${process.env.NUCLIA_API_KEY}
   - Header: x-synchronous: true
   - Body: { query, prefer_markdown: true, rephrase: true, max_tokens: 400, prompt }

Use ES modules. Plain fetch. No SDK.

At the bottom of the file, export a demo block:

  if (import.meta.url === `file://${process.argv[1]}`) {
    const client = new RateLimitedRagClient();
    const promises = Array(50).fill(0).map(() => client.ask("your test question"));
    const results = await Promise.all(promises);
    console.log({
      total: results.length,
      coalesced: results.filter(r => r.fromCoalescing).length,
      retries: results.reduce((s, r) => s + r.retries, 0)
    });
  }

That demo block fires 50 identical queries and reports
how many got coalesced (should be ~49).
```

**On the no-npm path?** Paste this instead — identical except how credentials are read:

```
In src/lib/rateLimitedRagClient.mjs, write a class
RateLimitedRagClient that wraps ARAG /ask calls with
production-grade resilience.

Constructor takes no args (reads NUCLIA_* directly from process.env —
do NOT import dotenv; the values are loaded via
`node --env-file=.env`, which I'll run the script with).

Public method:
  async ask(query: string, prompt?: object): Promise<{
    answer: string;
    citations: any[];
    latencyMs: number;
    retries: number;
    fromCoalescing: boolean;
  }>

Behaviour:

1. COALESCING:
   - Generate a cache key: `ask:${query}:${JSON.stringify(prompt || {})}`.
   - Maintain a Map<string, Promise> of in-flight requests.
   - If a matching in-flight Promise exists when ask() is called,
     return that Promise directly (mark result.fromCoalescing = true).
   - Otherwise launch a new request and store it in the map.
   - Remove from map when the Promise resolves or rejects.

2. BACKOFF on 429:
   - Wrap the actual fetch in askWithBackoff(query, prompt, attempt=0).
   - On HTTP 429, wait 2^attempt seconds (capped at 8s), retry.
   - Max 4 retries.
   - Track retry count and return in result.retries.

3. TIMEOUT:
   - 15-second timeout on each individual fetch (use AbortController).
   - If timeout fires, count as a failed attempt; backoff may still retry.

4. STRUCTURED LOGGING:
   - At start of each ask(), console.log({ event: 'ask-start', query, ts }).
   - At end, console.log({ event: 'ask-end', query, latencyMs, retries, status, ts }).
   - On 429, console.log({ event: 'rate-limited', attempt, backoffMs }).

5. The actual /ask call:
   - POST to ${process.env.NUCLIA_API_URL}/kb/${process.env.NUCLIA_KB_ID}/ask
   - Header: X-NUCLIA-SERVICEACCOUNT: Bearer ${process.env.NUCLIA_API_KEY}
   - Header: x-synchronous: true
   - Body: { query, prefer_markdown: true, rephrase: true, max_tokens: 400, prompt }

Use ES modules. Plain fetch. No SDK.

At the bottom of the file, export a demo block:

  if (import.meta.url === `file://${process.argv[1]}`) {
    const client = new RateLimitedRagClient();
    const promises = Array(50).fill(0).map(() => client.ask("your test question"));
    const results = await Promise.all(promises);
    console.log({
      total: results.length,
      coalesced: results.filter(r => r.fromCoalescing).length,
      retries: results.reduce((s, r) => s + r.retries, 0)
    });
  }

That demo block fires 50 identical queries and reports
how many got coalesced (should be ~49).
```

Send.

### 4b. Save the output

- **npm path, Claude Code / Cursor:** *"Save this as src/lib/rateLimitedRagClient.mjs."*
- **npm path, web chat:** create the file, paste, save.
- **No-npm path:** create the file in VS Code, paste, save (or ask an agentic AI to write it directly).

### 4c. Test the coalescing

**npm path:**

```bash
node src/lib/rateLimitedRagClient.mjs
```

**No-npm path:**

```bash
node --env-file=.env src/lib/rateLimitedRagClient.mjs
```

**You should see** a flurry of `ask-start` logs (all close together), some `ask-end` logs, and at the very end a summary:

```
{ total: 50, coalesced: 49, retries: 0 }
```

That `coalesced: 49` is the win. **50 identical queries → 1 actual API call.** That's the production behaviour customers pay for at scale.

### 4d. Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `coalesced: 0` | Cache key isn't being generated correctly | Check the cache-key function; should be deterministic for identical inputs |
| Many retries | Hitting 429 — your sandbox is being rate limited | Reduce the 50 to 10 |
| All 50 take a long time | Coalescing isn't waiting on the same Promise | Tell AI: *"My 50 identical queries should resolve in one round-trip via coalescing. They take 50 round-trips' worth of time. Fix."* |

### 4e. Save prompt log

Create `prompt-log.md`. Paste the Step 4 brief.

---

## Step 5 — Sketch the observability dashboard (20 min)

You **don't need to build the dashboard** — sketching the spec is enough. The Advanced course goes deep on observability.

Create `dashboard-spec.md`:

```markdown
# Observability Dashboard Spec — ARAG Production

## Widgets

### Latency
- `/ask` p50, p95, p99 over time (5-min buckets, 24-hour window).
  Targets: p50 < 1.5s, p95 < 3s, p99 < 8s.
- `/find` p50, p95, p99 over time.
  Targets: p50 < 500ms, p95 < 1s, p99 < 2s.

### Citation rate
- % of /ask responses that include at least 1 citation.
- Target: >= 80% rolling 1-hour window.
- ALARM: < 80% for 2 consecutive hours. Owner: <retrieval lead>.

### Request volume
- Per endpoint (/find, /ask, /graph, /resource), requests per minute.
- Stack chart by endpoint.

### Error rate
- 4xx and 5xx response counts per endpoint.
- ALARM: 5xx rate > 1% rolling 15-min window.

### Rate-limit headroom
- Current req/min / rate limit (e.g., 2400), as percentage.
- ALARM: > 80% for 15 min straight — request rate-limit increase from Progress Agentic RAG.

### LLM cost
- Platform-billed: Agentic RAG tokens / day from the Progress Agentic RAG billing dashboard.
- BYOK / BYO-LLM: LLM tokens / day, $ / day from the customer's own provider billing.
- ALARM: cost > 2x rolling 7-day average.

## Tools

Choose one or two from:
- DataDog (turnkey, expensive)
- Grafana + Prometheus (DIY, free, complex)
- New Relic (turnkey)
- The customer's existing APM if it has HTTP metrics

## Wiring
- Add structured logs (event, latencyMs, endpoint, status, retries) at
  each /ask call.
- Ship logs to the chosen tool.
- Build the widgets from the structured-log fields.
- Define alarms in the tool's alert system.
```

Save the file. **This is the document the customer's platform team will spec a quarter of engineering work against.** Take it seriously.

---

## Step 6 — Fill out the production checklist (15 min)

Create `production-checklist.md`:

```markdown
# Production Readiness Checklist — ARAG Engagement

For each item, tick when verified for the customer's environment.

## Residency
- [ ] KB region documented and matches customer's data-residency policy.
- [ ] LLM connection type documented (platform-billed / BYOK / BYO-LLM).
- [ ] If platform-billed: provider/model route confirmed enterprise-ready in the dashboard.
- [ ] If BYOK / BYO-LLM: configured against customer's own account/endpoint, region co-located with KB region.
- [ ] No cross-region traffic for content data.

## Authentication
- [ ] Service-account JWT in customer's secret manager — never in client code.
- [ ] ARAG calls proxied through customer's backend in production.
- [ ] JWT rotation policy documented (default 1-year TTL).
- [ ] JWT revocation procedure documented.

## Resilience
- [ ] Rate-limit-aware client deployed (backoff + coalescing + 15s timeout).
- [ ] Process documented for requesting rate-limit increase from Progress Agentic RAG
      (default 2400 req/min; can request more for customer's tenant).
- [ ] Circuit-breaker pattern around ARAG calls (when latency exceeds threshold).
- [ ] Fallback behaviour defined when ARAG is unavailable (e.g., empty state,
      cached responses, downgrade to keyword-only search).

## Observability
- [ ] /ask latency dashboard up (p50/p95/p99).
- [ ] /find latency dashboard up.
- [ ] Citation-rate dashboard + alarm (< 80% for 2hrs).
- [ ] 4xx/5xx error rate dashboard + alarm.
- [ ] LLM cost dashboard + anomaly alarm.

## Operations
- [ ] Runbook for "answers stopped citing" (check upstream ingestion).
- [ ] Runbook for "429s spiking" (check rate-limit headroom, request increase).
- [ ] Runbook for "latency p99 spiking" (check LLM provider status page).
- [ ] On-call rotation defined for the customer's platform team.

## Compliance (where applicable)
- [ ] PII handling policy documented; PII never logged in ARAG telemetry.
- [ ] Right-to-deletion workflow tested (resource deletion + re-index).
- [ ] Audit log forwarding configured if customer needs it.

## Cost
- [ ] LLM cost forecast per customer per month documented (Agentic RAG tokens if platform-billed; provider billing if BYOK/BYO-LLM).
- [ ] Cost anomaly alarms on the relevant billing account (Progress or customer's own provider tenant).
- [ ] Quarterly cost review meeting scheduled with customer's finance.
```

Save the file. **This is the partner's starting-point asset for every Tier-3+ customer engagement.**

---

## Step 7 — Ship an explainability surface for the regulated-buyer conversation (25 min)

Observability points your operators at platform health. Explainability points the *customer's security reviewer* at retrieval honesty. Same primitives, opposite audience. Tier-3+ buyers in finance, healthcare, and government ask for this in the SOC 2 / vendor-risk pass. Build it once; reuse on every retrieval surface.

### 7a. Build the WhyAmISeeingThis component that narrates the persona inputs driving retrieval

In `src/components/WhyAmISeeingThis.tsx` (or your app's equivalent), write a small aside that turns the persona inputs feeding retrieval into one or two plain-English sentences. The shopper sees: *"Because you're a Gold member in EU, and member-only perks are unlocked."* No JSON. No filter syntax. The CMO can read it on a Tuesday and ship it on a Wednesday.

### 7b. Add the dev toggle that pretty-prints the literal /find request body per section

Underneath the narration, add a `Show the AI's actual /find queries` button. When toggled on, render one `<pre>` per retrieval section containing the literal `{ query, filters, page_size }` object that was sent to ARAG — same source of truth as your `/find` call, no separate code path. Toggle stays **collapsed by default**; opt-in only.

### 7c. Verify the surface answers a 3-question security review

Sit down with the rendered page and walk it as if you were a vendor-risk analyst. Confirm the surface answers, in order:
- (a) What data is the AI seeing? — the narration names the persona attributes.
- (b) What is the AI doing with it? — the narration explains the gating logic in English.
- (c) Can an admin see the actual request? — the dev toggle reveals the literal `/find` body.

If any of those three questions takes more than a click to answer, tighten the surface until it doesn't.

**You should see:** an admin should be able to open the dev disclosure on any retrieval surface and read the exact `/find` body the AI sent to the platform. The shopper-facing narration stays visible at all times; the JSON stays hidden until requested.

---

## Verification checklist

- [ ] `residency-statement.md` written and read-aloud-ready.
- [ ] LLM-flexibility lesson read; residency-statement follow-up ("is the LLM EU-resident, and is it enterprise-ready?") answerable in one sentence without hand-waving.
- [ ] `src/lib/rateLimitedRagClient.mjs` runs the demo block and shows ~49/50 coalescing.
- [ ] `dashboard-spec.md` saved with widget definitions + alarm thresholds.
- [ ] `production-checklist.md` saved.
- [ ] `prompt-log.md` saved.
- [ ] `WhyAmISeeingThis` component shipped with the dev-query toggle wired to the live `/find` payload.
- [ ] 3-minute Loom pitch submitted.

Then take the [Build 11 quiz](3-quiz.md). Pass → start [Build 12](../build-12-capstone-prep/).

---

## Getting unstuck

**Residency statement reads generic.**
- Re-read it aloud and time it. If you can't say it in 30–40 seconds with conviction, the placeholders aren't filled in with *your* values. Replace every `<placeholder>` with a concrete answer your CTO audience could verify in the Progress Agentic RAG dashboard.

**Coalescing demo: only 1-2 calls coalesce instead of ~49.**
- Cache key isn't deterministic. The AI may be including a timestamp or random ID. Tell AI: *"My cache key includes [X]; remove it so identical queries produce identical keys."*

**429s firing in normal use.**
- You're under-using coalescing OR genuinely hitting your sandbox limit. Reduce concurrency. In production, request a tenant-level rate-limit increase from Progress Agentic RAG.

**Dashboard spec feels generic.**
- The customer's CTO has *specific* concerns. Re-write each widget to address a real customer requirement. The goal is "this is THE dashboard, not A dashboard."

**Anything else.**
- This Build is mostly writing + dashboard work. If you're stuck on the writing, **read your residency statement and production checklist aloud** — the gaps show up when you hear them.

---

## Next

[Build 12 — Capstone Prep](../build-12-capstone-prep/) — the synthesis Build. Pick your capstone variant (Atlas Operations or Aurora Concierge), draft your master prompts, plan your AI-direction session. Build 13 is the capstone itself.
