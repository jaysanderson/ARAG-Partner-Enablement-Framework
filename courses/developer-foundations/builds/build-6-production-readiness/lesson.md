# Build 6 — Lesson: Production readiness

> Estimated reading time: 25 minutes. Read this before starting the [walkthrough](walkthrough.md). Requires passing Build 5.

## Why partners learn this

A demo against a sandbox KB closes nothing. Customers buy ARAG when their CTO is satisfied that the platform clears their *production* bar. Build 6 is where you internalise the language and the levers that satisfy that bar.

The good news: ARAG handles a lot of this for you. Residency, rate limiting, model routing — all platform-native, not bolt-ons. The job in Build 6 is to know what's available, how to configure it, and how to explain it in 90 seconds to a CTO.

This is the last Build before the [final exam](../../final-exam.md) and the [Build 7 capstone](../build-7-capstone/).

## Data residency: EU vs USA

ARAG provisions KBs in either the EU or the USA region. The choice is per-KB and is set at provisioning time. Once set, the KB's data — including ingested content, generated embeddings, the graph, all metadata — stays in that region.

**What residency answers:** GDPR concerns, data sovereignty laws, customer regulatory requirements that explicitly require regional processing.

**What residency does NOT answer:** the *LLM* the model uses. That's BYO-LLM (next section). A KB in EU region can still call out to a US-based LLM endpoint if you wire it that way. If the customer needs the *LLM* in-region too, route the BYO-LLM toggle to a regional endpoint (e.g., Azure OpenAI in EU regions).

**Failover:** ARAG doesn't auto-failover across regions. If a customer needs that, you architect it as two KBs, one per region, with their application routing to the appropriate one based on user context. This is a Tier 4 architecture conversation, not a Build 6 deliverable.

**90-second pitch:** "EU customers, your data stays in EU. US customers, yours stays in US. The KB ID you provision lives in one region or the other. Period. We don't move it."

## BYO-LLM: bring your own LLM

ARAG decouples retrieval from generation. The retrieval engine, the graph, the data-augmentation agent — all run on ARAG. The generation step calls out to an LLM endpoint *the customer configures*. Three named providers:

1. **Azure OpenAI** — GPT-4, GPT-4 Turbo, GPT-4o, etc.
2. **Google Vertex** — Gemini Pro, Gemini Flash.
3. **AWS Bedrock** — Claude, Llama, Mistral, others.

Configuration is per-KB. The customer points the KB at *their* tenant's endpoint — their Azure subscription, their Vertex project, their Bedrock account. ARAG sends the prompts; the LLM responds; ARAG threads the response back through retrieval + citation handling.

**What BYO-LLM kills:**

- "We already use Azure" objection — done, just point at their tenant.
- "We're worried about model lock-in" — they're not locked in; they own the endpoint.
- "Our security team needs to audit every LLM call" — the calls go through *their* tenant's logging.
- "Our procurement team wants the LLM cost on a contract they already have" — yes, it stays on their existing Azure/AWS/GCP bill.

**The killer demo move:** during the capstone, flip the BYO-LLM toggle from Azure to Vertex to Bedrock mid-demo. Customer sees that the application doesn't change. Same KB. Same prompt. Different model. *Their choice.* That moment kills the lock-in objection cold.

 doesn't surface this toggle (it predates the capstone), but the Atlas Operations and Aurora Concierge capstones both put a BYO-LLM badge in the header for exactly this purpose.

## Rate limits

ARAG's default rate limit is **2400 requests per minute** per service account. That's the published number; customers will ask, you'll answer.

What counts as a request:

- One `/ask` call = 1 request.
- One `/find` call = 1 request.
- One `/graph` call = 1 request.
- Streaming responses count as 1 request regardless of duration.
- Ingest operations are separate (don't count against query rate limits).

**How to design for it:**

1. **Request coalescing.** If your front-end fires three identical `/find` calls in 200ms (a common bug), deduplicate them client-side. `autoSubmittedRef` pattern is one example of preventing duplicate firings.
2. **Backoff on 429.** When ARAG returns 429 Too Many Requests, back off (exponentially) and retry. Most HTTP client libraries support this; configure it.
3. **Batching.** For background jobs (e.g., regenerating embeddings, running batch generation), throttle to under 40 req/sec (2400 / 60).
4. **Connection pooling.** Don't open a new HTTPS connection per request. Re-use connections.

**Raising the limit:** customers running production workloads will need it raised. Open a ticket with Progress support; rate limit increases are routine and don't require a contract amendment.

**90-second pitch:** "Default 2400 req/min per service account. We design clients with exponential backoff and request coalescing — best practice anyway. For production volume above 2400 you raise the limit through support; non-negotiated routine increase."

## Authentication recap (and what's *not* in scope)

Build 0 covered the service-account JWT in the `X-NUCLIA-SERVICEACCOUNT` header. That's the only ARAG-side auth scheme. Build 6 reinforces *what's not in scope*:

- **End-user auth.** Your job. SSO, OAuth, OIDC — all on your application, not the ARAG API.
- **Per-user content gating.** Your job. Use ARAG's filter composition (Build 4 of Advanced course) to limit results to what the authenticated user can see, but the auth itself is on your side.
- **Token rotation.** Service-account JWTs are long-lived. Rotate them when staff changes; ARAG's dashboard supports issuing new ones.
- **Secrets management.** Standard secrets hygiene. Never expose the service-account JWT to the browser in production. Proxy ARAG calls through your backend.

## Observability minimum

The bar for production observability on ARAG-backed systems:

| Metric | Source | Reason to track |
|---|---|---|
| p50, p95, p99 latency on `/ask` | Your backend logs | UX commitment; flag regression |
| p50, p95, p99 latency on `/find` | Your backend logs | Composite-RAG cost analysis |
| Citation rate (% of `/ask` responses with non-empty citations) | Your backend logs | Proxy for retrieval-quality regression |
| Per-endpoint request volume | Your backend logs | Capacity planning + rate-limit headroom |
| 4xx and 5xx response rates | Your backend logs | Error tracking |
| BYO-LLM endpoint distribution (if multi-endpoint) | Your backend logs | Cost allocation |
| Per-resource extraction lag | Ingest logs | "Why isn't my new document searchable yet?" |

Tooling: Grafana, Datadog, New Relic, the cloud-native equivalents — any of them work. The metrics matter; the tooling is taste.

## Rate-limit-aware client template

Sketch of a production-grade ARAG client:

```typescript
import { setTimeout } from 'timers/promises';

class RagClient {
  private inflight = new Map<string, Promise<any>>();

  async ask(query: string, prompt?: any): Promise<any> {
    const key = `ask:${query}:${JSON.stringify(prompt ?? {})}`;

    // Coalesce identical inflight requests
    if (this.inflight.has(key)) return this.inflight.get(key);

    const promise = this.askWithBackoff(query, prompt).finally(() =>
      this.inflight.delete(key)
    );
    this.inflight.set(key, promise);
    return promise;
  }

  private async askWithBackoff(query: string, prompt?: any, attempt = 0): Promise<any> {
    try {
      return await this.askOnce(query, prompt);
    } catch (err: any) {
      if (err.status === 429 && attempt < 4) {
        const delay = Math.min(2 ** attempt * 1000, 8000);
        await setTimeout(delay);
        return this.askWithBackoff(query, prompt, attempt + 1);
      }
      throw err;
    }
  }

  private async askOnce(query: string, prompt?: any): Promise<any> {
    // ... actual HTTP call ...
  }
}
```

That's the foundation. Add: request timeouts (don't let a 30-second hang block the user), structured logging (so you can correlate to backend metrics), and circuit breakers (don't keep hammering if ARAG is degraded).

## Common pitfalls in Build 6

1. **Exposing the service-account JWT in client-side code in production.** The  does this *for demo purposes* — `VITE_*` env vars get baked into the client bundle. **In production, never.** Proxy through your backend.
2. **No request coalescing.** A React component that fires `/find` on every keystroke without debouncing hits 2400 req/min in 30 seconds.
3. **No backoff on 429.** Hammering ARAG when it's already over-rate slows your retries even more.
4. **No observability.** "It worked in dev" is not a customer answer. Wire metrics from day one of production.
5. **Assuming BYO-LLM is automatic.** It's per-KB configuration; the customer (or you on their behalf) configures it. Walk them through it.

## What you'll build in the walkthrough

A production-readiness layer on top of your Build 0–5 setup:

- Confirm and document the residency of your sandbox KB.
- Configure a BYO-LLM endpoint (you'll wire at least one of Azure OpenAI, Vertex, or Bedrock — pick whichever you have access to).
- Implement a rate-limit-aware client wrapper.
- Set up an observability dashboard with at least 4 of the metrics in the table above.
- A production-readiness checklist + IaC snippets (Terraform / CDK / Bicep) for residency-aware deployment.

## Onward

After Build 6, take the [final exam](../../final-exam.md). When you've passed it, you're cleared to start the [Build 7 capstone](../build-7-capstone/).
