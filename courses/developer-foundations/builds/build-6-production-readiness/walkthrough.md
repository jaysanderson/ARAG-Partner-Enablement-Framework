# Build 6 — Walkthrough: Production readiness

> Estimated time: 8–12 hours focused. Complete the [lesson](lesson.md) first.

## Prerequisites

- Builds 0–5 complete.
- Access to at least one of: Azure OpenAI, Google Vertex, AWS Bedrock — to wire BYO-LLM.
- An observability tool (Grafana, Datadog, or a cloud-native dashboard you can configure freely).
- Cloud account with the ability to write a Terraform / CDK / Bicep snippet (or equivalent).

## 1. Document your KB's residency

Open the Nuclia dashboard for your sandbox KB. Capture:

- Region (EU or USA).
- Endpoint URL (matches the region).
- The exact zone name (e.g., `aws-eu-1`, `aws-us-east-2-1`).

Write a 1-paragraph residency statement in `residency.md` in this Build folder. Sample:

```
The kb-foundations-sandbox knowledge base is provisioned in the EU region
(zone aws-eu-1). All ingested content, derived embeddings, the graph, and
extracted metadata reside within EU jurisdiction. The LLM endpoint
(currently Azure OpenAI in EU-North-2) is BYO-LLM and routes inside EU.
For US-based workloads, the KB and the LLM endpoint would both be
US-provisioned.
```

This paragraph is what you read aloud to the customer's CTO when they ask "where does our data live?" Memorise it.

## 2. Configure a BYO-LLM endpoint

Pick the provider you have access to:

### Azure OpenAI

1. In Azure, deploy a GPT-4 (or GPT-4o, or GPT-4 Turbo) model in your subscription.
2. Get the endpoint URL and API key.
3. In the Nuclia dashboard, navigate to your KB → Settings → Generative model.
4. Switch from "Default Nuclia model" to "Custom Azure OpenAI."
5. Paste the endpoint URL, deployment name, API version, and API key.
6. Test by running an `/ask` call against your KB. The response should be identical-feeling but now you control the endpoint.

### Google Vertex

1. In Vertex AI, enable the Gemini API in your project.
2. Get the service-account credentials JSON.
3. In the Nuclia dashboard, switch the KB's generative model to "Custom Vertex."
4. Paste the service-account credentials.
5. Test.

### AWS Bedrock

1. In Bedrock, request access to the model you want (e.g., Claude 3.5 Sonnet).
2. Get the access key + secret access key + region.
3. In the Nuclia dashboard, switch the KB to "Custom Bedrock."
4. Paste credentials.
5. Test.

After switching, run 5–10 queries through `/assistant`. Confirm the answers still come back, citations still work, streaming still works. The only difference should be subtle voice differences in the answers — that's the model, not ARAG.

## 3. Implement the rate-limit-aware client

In your Sample ARAG App fork (or a fresh TypeScript project), create `src/lib/rateLimitedRagClient.ts`:

```typescript
import { siteContentClient } from './ragApi';

const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 8000;
const TIMEOUT_MS = 15000;

class RateLimitedRagClient {
  private inflight = new Map<string, Promise<any>>();

  async ask(query: string, prompt?: any): Promise<any> {
    const key = `ask:${query}:${JSON.stringify(prompt ?? {})}`;
    if (this.inflight.has(key)) return this.inflight.get(key)!;

    const promise = this.askWithBackoff(query, prompt).finally(() =>
      this.inflight.delete(key)
    );
    this.inflight.set(key, promise);
    return promise;
  }

  private async askWithBackoff(query: string, prompt?: any, attempt = 0): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      return await siteContentClient.ask(query, prompt);
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.status === 429 && attempt < MAX_RETRIES) {
        const delay = Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS);
        await new Promise(r => setTimeout(r, delay));
        return this.askWithBackoff(query, prompt, attempt + 1);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const rateLimitedClient = new RateLimitedRagClient();
```

Test it: write a tight loop firing 100 `/ask` calls. The client should coalesce the identical ones (it'll fire much less than 100 calls against ARAG). If you do hit 429, the backoff should recover gracefully.

## 4. Stand up the observability dashboard

Pick a tool (Grafana with Prometheus, Datadog, New Relic, cloud-native). Wire metrics for:

| Metric | Where to instrument |
|---|---|
| p50, p95, p99 `/ask` latency | Your client wrapper, around the `askWithBackoff` call |
| p50, p95, p99 `/find` latency | Same, for `/find` calls |
| Citation rate | Tag every `/ask` response with `has_citations: count(citations) > 0` and aggregate |
| Per-endpoint request volume | Count by endpoint path |
| 4xx / 5xx rate | Tag every response by status class |
| BYO-LLM endpoint | If your code routes between Azure / Vertex / Bedrock, tag accordingly |

A minimum viable dashboard: 4 graphs (latency, request volume, citation rate, error rate) plus a "current rate-limit headroom" widget showing `(current req/min) / 2400`.

Capture a screenshot of the dashboard. Save it in this folder as `dashboard-screenshot.png`.

## 5. Write the residency-aware IaC snippet

Pick Terraform, CDK (TypeScript), or Bicep. Produce a snippet that, when run, provisions:

- An ARAG KB in a configurable region (EU or USA).
- A service-account credential, with the JWT stored in a secret manager (AWS Secrets Manager, Azure Key Vault, GCP Secret Manager — your choice).
- An associated BYO-LLM endpoint (e.g., an Azure OpenAI deployment) in the *same region* as the KB.

Terraform sketch (illustrative — the Nuclia provider may not yet exist for Terraform; if not, document it as "scripted via the Nuclia API"):

```hcl
variable "region" {
  type    = string
  default = "eu"
}

resource "nuclia_kb" "main" {
  name   = "my-customer-prod-kb"
  region = var.region
}

resource "azurerm_cognitive_account" "openai" {
  name     = "my-customer-openai"
  location = var.region == "eu" ? "northeurope" : "eastus"
  kind     = "OpenAI"
  sku_name = "S0"
}

resource "azurerm_cognitive_deployment" "gpt4" {
  cognitive_account_id = azurerm_cognitive_account.openai.id
  name                 = "gpt-4-deployment"
  model {
    name    = "gpt-4"
    version = "0613"
  }
}

# Wire the BYO-LLM endpoint into the Nuclia KB programmatically
# (via Nuclia API; not yet first-class in the Terraform provider)
```

Save as `iac/terraform.tf` (or `iac/cdk.ts`, `iac/main.bicep`). This is the asset partners use as the starting point for customer-side IaC.

## 6. Production-readiness checklist

Create `production-readiness-checklist.md` in this Build folder. Sections:

### Residency
- [ ] KB region selected and documented.
- [ ] BYO-LLM endpoint co-located with KB region.
- [ ] Customer-facing residency statement signed off by partner SE.

### BYO-LLM
- [ ] At least one customer-owned LLM endpoint configured.
- [ ] Test queries verified end-to-end.
- [ ] BYO-LLM rotation plan documented (how to swap endpoints without downtime).

### Auth + secrets
- [ ] Service-account JWTs stored in secret manager, never in client-side code.
- [ ] ARAG calls proxied through partner / customer backend, not direct browser → ARAG.
- [ ] Token rotation cadence documented.

### Rate limits
- [ ] Rate-limit-aware client implemented (backoff, coalescing, timeouts).
- [ ] Default 2400 req/min headroom confirmed via load test.
- [ ] Process to request rate-limit increase documented.

### Observability
- [ ] Latency metrics (p50/p95/p99) for `/ask` and `/find`.
- [ ] Citation rate tracked.
- [ ] Error rate (4xx/5xx) tracked.
- [ ] Request volume per endpoint tracked.
- [ ] Dashboard accessible to customer SRE / on-call team.

### Deployment
- [ ] IaC snippet committed.
- [ ] Region-aware deployment verified.
- [ ] Disaster-recovery procedure documented (KB re-provisioning if region fails).

## 7. Record the production-grade pitch

A 3-minute recording. Pretend you're walking the customer's CTO through the production readiness layer.

Structure:

- (0:00) "Three things you care about: where the data lives, what model is generating answers, what happens under load."
- (0:30) Show your residency.md statement. Read it aloud.
- (1:00) Flip the BYO-LLM toggle in your `/assistant`. Show the same query running on Azure, Vertex (or Bedrock). Same answer; different model.
- (1:30) Show your observability dashboard. Walk through the latency, error rate, citation rate panels.
- (2:00) Show the IaC snippet. Narrate: "When you go to prod, your DevOps team gets this. We've done the integration work; they wire it into your existing stack."
- (2:30) Close: "Residency you choose. LLM you already pay for. Observability your SRE team can act on. IaC your DevOps team owns. This is platform-grade, not chatbot-grade."

Submit the recording.

## Verification checklist

- [ ] Residency statement written.
- [ ] BYO-LLM endpoint configured against at least one of Azure / Vertex / Bedrock.
- [ ] Rate-limit-aware client implemented with backoff + coalescing + timeout.
- [ ] Observability dashboard with at least 4 metrics, screenshot saved.
- [ ] IaC snippet committed.
- [ ] Production-readiness checklist complete.
- [ ] 3-minute "platform-grade" pitch recorded.

## Next

After Build 6, take the [final exam](../../final-exam.md). Pass it (80%+), and you're cleared to start the [Build 7 capstone](../build-7-capstone/) — your choice of Atlas Operations (Enterprise) or Aurora Concierge (CX).
