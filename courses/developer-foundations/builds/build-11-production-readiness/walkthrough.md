# Build 10 — Walkthrough: Production Readiness

> Estimated time: 2 hours focused. Read the [lesson](lesson.md) first.
>
> Mostly conceptual + dashboard config. Less code than other Builds.

## 1. Document your KB's residency (15 min)

Open the Nuclia dashboard. Capture three values for your sandbox KB:

- Region (EU or USA).
- Endpoint URL (matches the region).
- Zone identifier (e.g., `aws-eu-1`).

Write a 4-sentence residency statement in `residency-statement.md`:

```
The kb-foundations-sandbox knowledge base is provisioned in the EU region
(zone aws-eu-1). All ingested content, derived embeddings, the knowledge
graph, and extracted metadata reside within EU jurisdiction. The LLM endpoint
is BYO-LLM and is configured to a customer-owned tenant; for EU residency
requirements, the endpoint is provisioned in an EU region. For US-based
workloads, the KB and the LLM endpoint would both be US-provisioned.
```

**This is the paragraph you read aloud to the CTO.** Memorise the cadence.

## 2. Configure BYO-LLM (45 min)

Pick one provider you have access to:

### Azure OpenAI

1. In your Azure subscription, deploy a GPT-4 (or GPT-4o) model.
2. Capture endpoint URL, deployment name, API version, API key.
3. Nuclia dashboard → KB → Settings → Generative model.
4. Switch from "Default Nuclia model" to "Custom Azure OpenAI."
5. Paste the four values.
6. Test with an `/ask` query.

### Google Vertex

1. Enable the Gemini API in your GCP project.
2. Generate service-account credentials (JSON).
3. Nuclia dashboard → KB → Settings → Generative model → "Custom Vertex."
4. Paste the credentials.
5. Test.

### AWS Bedrock

1. In Bedrock, request access to a model (e.g., Claude 3.5 Sonnet).
2. Capture access key, secret, region.
3. Dashboard → KB → Settings → Generative model → "Custom Bedrock."
4. Paste credentials.
5. Test.

Run 5–10 `/ask` queries through your sandbox after the switch. Confirm answers still come back, citations still attach, streaming still works. The voice may sound subtly different — that's the new model, not ARAG. *Same retrieval, different generator.*

Document which provider you wired in `byo-llm-config.md` with the endpoint details.

## 3. Vibe-code a rate-limit-aware client (30 min)

Brief your AI:

```
In src/lib/rateLimitedRagClient.ts, write a class RateLimitedRagClient with:

1. An ask(query, prompt?) method that:
   - Generates a cache key like `ask:${query}:${JSON.stringify(prompt)}`.
   - If a matching in-flight Promise exists, returns it (coalescing).
   - Otherwise launches the call via askWithBackoff and tracks it in-flight.

2. A private askWithBackoff(query, prompt?, attempt=0):
   - Wraps the actual fetch in an AbortController with a 15-second timeout.
   - On HTTP 429, waits 2^attempt seconds (capped at 8s), retries.
   - Max 4 retries.
   - Rethrows on other errors.

3. A private askOnce(query, prompt?) that does the actual POST to /ask
   with X-NUCLIA-SERVICEACCOUNT auth, prefer_markdown true, rephrase true.

4. Log every call's start, end, status to console (placeholder for real observability).

Use plain fetch. Env vars via process.env. TypeScript.
```

Save prompt as `prompt-log.md`. Test by firing 50 identical queries in a tight loop — observe that the actual ARAG calls coalesce to far fewer than 50.

## 4. Sketch the observability dashboard (15 min)

Open `dashboard-spec.md` and describe (or screenshot from your tool of choice) a dashboard with these widgets:

1. **`/ask` latency** — p50, p95, p99 timeseries.
2. **`/find` latency** — same.
3. **Citation rate** — % of `/ask` responses with citations; alarm if drops below 80% for two consecutive hours.
4. **Request volume** — per-endpoint counts.
5. **4xx / 5xx rate** — error rate per endpoint.
6. **Rate-limit headroom** — current req/min / 2400, percentage.

You don't have to build the real dashboard for this Build — sketching the spec is enough. The Advanced course goes deep on observability.

## 5. Production-readiness checklist (15 min)

Open `production-checklist.md` and tick off (or document the plan for) each:

- [ ] KB region documented; matches customer's residency requirement.
- [ ] BYO-LLM configured against customer's own tenant; co-located region.
- [ ] Service-account JWT in secret manager; never in client-side code.
- [ ] ARAG calls proxied through customer's backend in production.
- [ ] Rate-limit-aware client deployed (backoff + coalescing + timeout).
- [ ] Observability dashboard up (p50/p95/p99 latency, citation rate, error rate, request volume).
- [ ] Citation-rate alarm wired (alarm < 80% for 2 hours).
- [ ] Process to request rate-limit increase documented.

This is the asset partners use as the starting point for customer-side production planning.

## 6. Record the 3-minute "platform-grade" pitch (10 min)

Record yourself:

1. (45 sec) "Three things the customer's CTO cares about: residency, BYO-LLM, observability."
2. (30 sec) Read your `residency-statement.md` aloud against your sandbox.
3. (30 sec) Show the dashboard with the BYO-LLM toggle switched between providers (or describe the switch verbally if you can't toggle live).
4. (45 sec) Show the dashboard mockup with the citation-rate chart prominent. "This is your retrieval-quality alarm. When this drops, somebody broke something upstream."
5. (30 sec) Close: "Platform-grade. Not 'demo grade.' Sign here."

Upload to `#build-clinic-submissions`.

## Verification checklist

- [ ] `residency-statement.md` written.
- [ ] BYO-LLM configured against one of Azure / Vertex / Bedrock; documented.
- [ ] `rateLimitedRagClient.ts` deployed; coalescing demonstrated.
- [ ] `dashboard-spec.md` written.
- [ ] `production-checklist.md` filled out.
- [ ] 3-minute pitch recorded.

## Next

[Build 12 — Capstone Prep](../build-12-capstone-prep/) — the synthesis Build. Plan the capstone, write the prompts, prepare to direct the AI session.
