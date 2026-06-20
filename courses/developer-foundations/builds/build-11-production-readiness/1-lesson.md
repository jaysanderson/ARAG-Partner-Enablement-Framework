# Build 11 — Lesson: Production Readiness

> Read time: 10 minutes.

## Why this Build is mostly conceptual

A demo against a sandbox closes nothing. The customer signs after their CTO is satisfied that the platform clears their *production* bar. Build 11 is where you internalise the language and the levers that satisfy that bar.

The good news: ARAG handles most of this for you. Residency, rate limiting, model routing — all platform-native. Your job in Build 11 is to know what's available, how to configure it, and how to defend it in 90 seconds to a customer's CTO.

## Data residency: EU vs USA

ARAG provisions KBs in either the EU or the USA region. Set at provisioning time. Once set, the KB's content — ingested documents, embeddings, the graph, all metadata — stays in that region.

**What residency answers:**
- GDPR concerns.
- Data sovereignty laws.
- Customer regulatory requirements explicitly requiring regional processing.

**What residency does NOT answer:**
- The *LLM* that generates answers. That's BYO-LLM (next section). A KB in EU region can still call out to a US-based LLM if you wire it that way.
- Cross-region failover. ARAG doesn't auto-failover; you architect it with two KBs if a customer needs it.

**The 90-second CTO pitch:**

> "EU customers, your data stays in EU. US customers, yours stays in US. The KB you provision lives in one region or the other. Period. We don't move it. If you need both, you provision two KBs and your application routes by user context."

## BYO-LLM: bring your own LLM

ARAG decouples retrieval from generation. The retrieval engine, the graph, the data-augmentation agent — all run on ARAG. The generation step calls out to an LLM endpoint **the customer configures**. Three named providers:

1. **Azure OpenAI** — GPT-4, GPT-4 Turbo, GPT-4o.
2. **Google Vertex** — Gemini Pro, Gemini Flash.
3. **AWS Bedrock** — Claude, Llama, Mistral, others.

Configuration is per-KB. The customer points the KB at *their* tenant — their Azure subscription, their Vertex project, their Bedrock account. ARAG sends prompts; the LLM responds; ARAG threads the response back through retrieval + citation handling.

**What BYO-LLM kills (in order of objection frequency):**

| Customer objection | BYO-LLM answer |
|---|---|
| "We already use Azure" | Point the KB at their Azure subscription. Their tenant, their billing, their compliance. |
| "Vendor lock-in concerns" | They're not locked in — they own the LLM endpoint. ARAG's retrieval is the only proprietary layer. |
| "Security team needs to audit every LLM call" | Calls go through *their* tenant's logging. They see every request. |
| "Procurement wants LLM cost on existing contract" | Yes — LLM costs stay on Azure/AWS/GCP. ARAG only bills retrieval + orchestration. |
| "Want to use [other model]" | If it's on Azure / Vertex / Bedrock, yes. Otherwise, it's a roadmap conversation. |

**The killer demo move:** flip the BYO-LLM toggle from Azure to Vertex during the demo. The customer sees the application doesn't change. Same KB, same prompt, different model. *Their choice.* That moment kills the lock-in objection cold.

## When BYO-LLM doesn't fit: clean descope

The pitch above assumes the customer has an Azure / Vertex / Bedrock tenant you can point the KB at *during the demo*. Often you won't — the security review hasn't cleared, procurement hasn't issued the API key, or you're demoing against the partner sandbox before the customer is even in the room. Shipping a non-functional toggle in a real customer build is worse than shipping no toggle: it invites questions you can't answer ("which Azure region?" "which deployment?") and contradicts the pitch.

The honest move is to **descope BYO-LLM cleanly** — teach the concept (above), then ship a build that doesn't claim it.

The descope checklist:

1. **No env var, no client config.** Omit the BYO-LLM provider IDs from your `.env` and the Vite-side public block. The frontend has no way to render a toggle it can't drive.
2. **No UI surface.** No header chip, no Settings panel, no `/ops` tile claiming "BYO-LLM: Azure". The closest your homepage gets to the topic is the residency badge — that's the lock-in story you *can* prove on a single KB.
3. **No homepage claim.** Strip the "Hero + BYO-LLM toggle in the first 90 seconds" framing from the demo script. Replace it with residency + ingested-corpus stats + a live retrieval moment — proof points the build actually ships.
4. **Belt-and-braces: graph-extraction value blocklist.** When you run a data-augmentation graph agent over an enterprise corpus, the model will sometimes extract "BYO-LLM" as a PRODUCT node from internal architecture docs. Block these values in `graphClient.ts` before they reach the canvas, so a graph traversal can't surface a feature the demo doesn't have:

```ts
// Filter values that contradict the descope before they reach any surface.
const BYO_VALUE_BLOCKLIST = [/\bbyo[- ]?llm\b/i, /atlas\s+byo[- ]?llm/i];
function passesProductBlocklist(value: string): boolean {
  return !BYO_VALUE_BLOCKLIST.some((re) => re.test(value));
}
```

What partners say in the room shifts from *"flip the toggle to your tenant"* to *"BYO-LLM is a per-KB platform setting we'll wire in your tenant during the co-engineered POC — for today's demo we're on the platform default, with residency you can verify in this header."* You're still answering the lock-in objection, you're just answering it honestly: BYO-LLM is a platform capability you'll configure together, not a UI lever you ship pre-built.

**See it in the capstone:** `src/lib/env.ts` (no `VITE_BYO_LLM_*` vars), `src/lib/graphClient.ts → BYO_VALUE_BLOCKLIST`, `src/pages/Ops.tsx` (no BYO-LLM tile in the observability strip). The Atlas Operations capstone descopes BYO-LLM exactly this way — and the demo is stronger for it.

## Rate limits

ARAG's default rate limit is **2400 requests per minute** per service account. That's the published number; customers will ask, you'll answer.

What counts:
- `/ask` (sync or stream) = 1 request.
- `/find` = 1 request.
- `/graph` = 1 request.
- Streaming responses = 1 request regardless of duration.
- Ingest operations are separate (don't count against query limits).

**Design implications:**

1. **Coalesce identical inflight requests.** A React component firing `/find` on every keystroke without debouncing burns through 2400 req/min in 30 seconds.
2. **Backoff on 429.** When ARAG returns 429 Too Many Requests, back off exponentially and retry. Standard HTTP client behaviour; configure it.
3. **Batch background jobs.** Stay below 40 req/sec on background workloads.
4. **Connection pooling.** Re-use HTTPS connections; don't open a new one per call.

**Raising the limit:** customers running production volume above 2400 req/min open a support ticket. Routine increase; no contract amendment.

**The 90-second CTO pitch:**

> "Default 2400 req/min per service account. We build clients with exponential backoff and request coalescing. For production volume above 2400 you raise the limit through support — non-negotiated routine increase."

## Authentication — what's *not* in scope

The service-account JWT in `X-NUCLIA-SERVICEACCOUNT` is the only ARAG-side auth. What's *not* in scope (and stays on the partner side):

- **End-user auth.** SSO, OAuth, OIDC — all on the customer's application, not ARAG.
- **Per-user content gating.** Use ARAG filters to limit results to what the user can see, but the auth is yours.
- **Token rotation.** Long-lived JWTs; rotate when staff changes.
- **Secrets management.** Standard hygiene. Never expose the JWT to the browser in production.

**The non-negotiable production rule:** ARAG calls proxy through the partner's (or customer's) backend. The service-account JWT lives server-side; the browser never sees it. Build 0 + Build 2's sandbox-style direct-from-browser auth is for demos only.

## Observability minimum

Every production ARAG deployment a Specialist signs off on must track:

| Metric | Why it matters |
|---|---|
| p50 / p95 / p99 `/ask` latency | UX commitment; flag regression. |
| p50 / p95 / p99 `/find` latency | Composite-RAG cost analysis. |
| **Citation rate** — % of `/ask` responses with non-empty citations | The single most important retrieval-quality regression signal. |
| Per-endpoint request volume | Capacity planning + rate-limit headroom. |
| 4xx / 5xx response rate | Error tracking. |
| BYO-LLM endpoint distribution (if multi-endpoint) | Cost allocation. |

Tooling: Grafana, Datadog, New Relic, cloud-native — partner taste. The *metrics* matter; the tool doesn't.

**Citation rate** is the metric you brief the customer's SRE team to alarm on. If it drops 20% week-over-week, something has changed in retrieval — ingest, chunking, labelset, or the BYO-LLM endpoint. Single best leading indicator of platform health.

## A rate-limit-aware client (vibe-coded in 5 minutes)

You'll brief the AI to write a wrapper that:

1. Coalesces identical inflight requests (deduplicates while in-flight).
2. Backs off exponentially on 429 (1s, 2s, 4s, 8s, cap at 8s).
3. Times out after 15s.
4. Logs every call's duration to your observability sink.

15–30 lines of TypeScript. The AI does it; you verify it works against your sandbox.

## What you'll do in the walkthrough

Three deliverables, all mostly conceptual + config:

1. Configure BYO-LLM against your sandbox (Azure / Vertex / Bedrock — whichever you have access to).
2. Write a residency statement for your KB (4 sentences; the one you read aloud to the CTO).
3. Vibe-code a rate-limit-aware ARAG client wrapper.
4. Sketch an observability dashboard with the 6 metrics above.

## Common pitfalls

- **Exposing service-account JWTs in client-side code in production.** Demos only. Production proxies.
- **No request coalescing.** Burns through rate limit.
- **No backoff on 429.** Compounds the rate-limit pressure.
- **No observability.** "It worked in dev" isn't a customer answer.
- **Treating residency as automatic.** It's per-KB config; *somebody* set it. Confirm and document.

## Explainability surfaces — narrate retrieval to users, expose request bodies to admins

Build 11 already taught observability primitives (citation rate, latency percentiles) for the operator. Explainability is the user-facing dual: a narration of WHY each result appeared, plus an opt-in dev disclosure of the literal request body. Regulated-buyer security reviews (finance, healthcare, government) ask for this exact pattern. Without it you have nothing to point at; with it you have a 30-second demo answer.

API surface: no new endpoint. Two UI patterns wrapping the existing `/find` call.

```tsx
function WhyAmISeeingThis({ persona, sections, showDevQuery, onToggle }) {
  return (
    <aside>
      <p>Because you're a <strong>{persona.segment}</strong> in{' '}
         <strong>{persona.region}</strong>, and you're{' '}
         {persona.tier === 'Prospect'
           ? 'not yet a member — perks are gated'
           : `a ${persona.tier} member — perks are unlocked`}.</p>
      <button onClick={onToggle}>
        {showDevQuery ? 'Hide' : 'Show'} the AI's actual /find queries
      </button>
      {showDevQuery && sections.map((s) => (
        <pre key={s.title}>{JSON.stringify({
          query: s.query, filters: s.filters, page_size: s.pageSize,
        }, null, 2)}</pre>
      ))}
    </aside>
  );
}
```

Two layers in one component: a CMO-readable explanation in plain English, and an admin/dev toggle that exposes the literal request body — same source of truth, two audiences. The plain-English half answers the shopper's "why am I seeing this?"; the dev toggle answers the security reviewer's "show me the request."

**Common failure mode:** rendering the dev disclosure by default. Always opt-in; the raw filter JSON spooks non-technical viewers and clutters the UI for shoppers. The toggle stays collapsed until an admin asks for it.

**See it in the capstone:** `src/pages/ForYou.tsx` → `WhyAmISeeingThis` component + `showDevQuery` toggle.

## What's next

[Build 12 — Capstone Prep](../build-12-capstone-prep/) — the synthesis Build. Where you plan the capstone, write the prompts, brief the AI session that will produce it.
