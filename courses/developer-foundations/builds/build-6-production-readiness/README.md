# Build 6 — Production readiness

> Part of [Developer Foundations](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Tier mapped to** | Tier 4 (operational) |
| **Prerequisite** | [Build 5 — Knowledge graph & data augmentation agents](../build-5-knowledge-graph/) |
| **Estimated effort** | 8–12 hours focused |

## What the partner does

Configures data residency (EU or USA), wires BYO-LLM routing across Azure OpenAI / Google Vertex / AWS Bedrock, observes the default 2400 req/min rate limit and designs around it, hardens authentication, instruments observability, and stress-tests the workload.

## Pass rubric

1. Residency demonstrably configured and verifiable.
2. BYO-LLM connection working against at least two of the three hyperscaler endpoints.
3. Rate-limit-aware client implemented (backoff, batching, request coalescing).
4. Observability dashboard tracking p50/p95 latency, retrieval recall proxy, and citation-rate.
5. Recorded explanation of the "platform-grade" pitch to a customer's CTO.

## Asset delivered

A production-readiness checklist + reference Terraform / CDK / Bicep snippets for residency-aware deployment + rate-limit-aware client templates.

---

## Workspace

This folder is the working space for everything supporting Build 6. Drop materials here as they are built:

- `walkthrough.md` — production-hardening walkthrough
- `checklist.md` — the production-readiness checklist deliverable
- `iac/` — Terraform / CDK / Bicep templates for residency-aware deployment
- `client-templates/` — rate-limit-aware client patterns (backoff, batching, coalescing)
- `observability/` — dashboard config (Grafana / vendor-native)
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Developer Foundations](../../README.md)
- Previous build: [Build 5 — Knowledge graph](../build-5-knowledge-graph/)
- Next build: [Build 7 — The Capstone](../build-7-capstone/)
- Future course: [Production Operations & SLOs](../../../../README.md#part-iii--course-catalogue) (planned)
