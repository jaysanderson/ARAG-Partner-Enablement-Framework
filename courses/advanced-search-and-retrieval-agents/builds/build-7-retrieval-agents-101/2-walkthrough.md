# Build 7 — Walkthrough: Retrieval Agents 101

> Estimated time: 16–20 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

- A **deployed Retrieval Agent** running against a real KB.
- A **natural-language brief** + **structured output schema** committed.
- **Step-level observability** wired so every agent step is traced.
- **Three documented failure modes** with recovery patterns.
- A **side-by-side comparison demo:** `/ask` vs agent.

## Step 1 — Pick a customer-shaped hard scenario (1 hour)

The scenario must be:

- **Multi-part.** A question that can't be answered by a single retrieval.
- **Customer-recognisable.** A question someone in the customer's org has actually asked.
- **Boundable.** Answerable from the KB if decomposed correctly.

Examples:

- *"Which of our active high-risk AI deployments have a feature affected by the new EU AI Act Article 5 prohibitions, and do we have a documented mitigation for each?"*
- *"For each compliance finding from Q3, identify the responsible internal policy, the regulatory clause it traces to, and the current remediation status."*
- *"Which of our products have a recycled-content rating above 30% AND a Trail Club Pro exclusivity tag AND a published gear-review by an ambassador with more than 10 years of field experience?"*

Pick one. Commit to `scenario.md` with the question + the expected sub-questions you'd decompose it into.

## Step 2 — Write the natural-language brief (2 hours)

The brief is the system prompt. Use this template:

```
You are a {role}.

Your purpose is to answer multi-part questions for {customer_persona}
by:

1. Decomposing the question into 3-8 sub-questions.
2. Running retrieval for each sub-question against the connected
   Knowledge Box.
3. Synthesising a structured response per the output schema.

Rules of engagement:
- Every claim in the response MUST cite a `citation_resource_id` from
  the retrieved results.
- If you cannot ground a claim in the retrieved evidence, mark its
  `grounding_status` as "ungrounded" rather than guessing.
- Plan AT MOST 8 sub-questions. If more come to mind, prioritise
  the 8 most decisive.
- Do not speculate beyond the retrieved evidence.

Domain priors:
- {domain-specific decomposition axes}

Output discipline:
- Match the structured schema EXACTLY.
- Every `claim` field must reference at least one `citation_resource_id`.
- If budget_exhausted is true, the response should be a partial answer
  with explicit gaps marked.
```

Fill the slots for your scenario. Save to `agent-brief.md`.

## Step 3 — Design the structured output schema (2 hours)

Schema for a compliance-agent example (adapt to your scenario):

```json
{
  "type": "object",
  "properties": {
    "verdict": {
      "type": "string",
      "enum": ["compliant", "partial", "non_compliant", "unknown"]
    },
    "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
    "sub_findings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "sub_question": { "type": "string" },
          "answer": { "type": "string" },
          "citation_resource_ids": {
            "type": "array",
            "items": { "type": "string" }
          },
          "grounding_status": {
            "type": "string",
            "enum": ["grounded", "weak", "ungrounded"]
          }
        },
        "required": [
          "sub_question",
          "answer",
          "citation_resource_ids",
          "grounding_status"
        ]
      }
    },
    "budget_exhausted": { "type": "boolean" }
  },
  "required": ["verdict", "confidence", "sub_findings", "budget_exhausted"]
}
```

Three properties non-negotiable:

- **Enum on the top-level outcome.** `verdict` here. The renderer switches on it.
- **`citation_resource_ids` per sub-finding.** First-class field, not embedded in prose.
- **`grounding_status` per sub-finding.** The schema's signal for *"the agent couldn't fully ground this."*

Save to `agent-schema.json`.

## Step 4 — Deploy the agent (3 hours)

> **Recommended pattern: partner-orchestrated agent on `/ask`** (Pattern A from the lesson). Portable across tenants, fully debuggable, ships today on every ARAG tier. If your tenant exposes a native `/retrieval-agent` endpoint and you want to use it, see *4b* below — but verify the contract against your tenant's current API docs before relying on field names like `brief`, `tools`, or `include_trace`. The native endpoint's exact surface is platform-version-dependent.

### 4a. Partner-orchestrated agent on `/ask`

Vibe-code a runner that does the four loop steps explicitly in client code. Pseudo-shape:

```typescript
import OpenAI from 'openai';  // or @anthropic-ai/sdk, etc. — partner's choice

async function runAgent(question: string) {
  const brief = fs.readFileSync('./agent-brief.md', 'utf8');
  const schema = JSON.parse(fs.readFileSync('./agent-schema.json', 'utf8'));

  // 1. Plan — LLM call that returns sub-queries
  const planLLM = new OpenAI({ apiKey: process.env.LLM_API_KEY });
  const plan = await planLLM.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_schema', json_schema: planSchema },
    messages: [
      { role: 'system', content: brief + '\n\nReturn a structured plan with 3–8 sub-queries.' },
      { role: 'user', content: question },
    ],
  });
  const subQueries = JSON.parse(plan.choices[0].message.content).sub_queries;

  // 2. Execute — one /ask call per sub-query
  const subAnswers = [];
  for (const sub of subQueries) {
    const askRes = await fetch(`${NUCLIA_API_URL}/kb/${NUCLIA_KB_ID}/ask`, {
      method: 'POST',
      headers: {
        'X-NUCLIA-SERVICEACCOUNT': `Bearer ${NUCLIA_API_KEY}`,
        'Content-Type': 'application/json',
        'x-synchronous': 'true',
        'x-show-consumption': 'true',
      },
      body: JSON.stringify({
        query: sub.question,
        top_k: 20,
        features: ['semantic', 'keyword'],
        answer_json_schema: subAnswerSchema,
        citations: true,
      }),
    });
    const askData = await askRes.json();
    subAnswers.push({ sub_question: sub.question, ...askData.answer_json, citations: askData.citations });
  }

  // 3. Merge + 4. Synthesise — one final LLM call against the final schema
  const synth = await planLLM.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_schema', json_schema: schema },
    messages: [
      { role: 'system', content: brief + '\n\nSynthesise the final structured answer from these sub-answers.' },
      { role: 'user', content: JSON.stringify({ question, sub_answers: subAnswers }) },
    ],
  });

  return {
    output: JSON.parse(synth.choices[0].message.content),
    trace: { plan: subQueries, sub_answers: subAnswers },
  };
}
```

Save to `agent-runner/`. The trace is the partner-built equivalent of `include_trace`; the partner has full control over the shape and what gets logged.

### 4b. (Optional) Native `/retrieval-agent` endpoint

If your tenant exposes the native endpoint and you want to use it, the call shape is *typically* something like the below — **but verify against your tenant's current API documentation before relying on any specific field**:

```typescript
const res = await fetch(`${NUCLIA_API_URL}/kb/${NUCLIA_KB_ID}/retrieval-agent`, {
  method: 'POST',
  headers: {
    'X-NUCLIA-SERVICEACCOUNT': `Bearer ${NUCLIA_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: question,
    // Field names below are illustrative — check current tenant docs.
    // The native endpoint may not expose all of these or may name them differently.
    brief,
    schema,
    include_trace: true,
  }),
});
const data = await res.json();
```

If your tenant's endpoint exposes `brief` + `schema` + `include_trace`, the API call is cleaner than the partner-orchestrated loop and the platform handles the planner-execute-merge internally. If the contract is different (subset of fields, different field names, different observability shape), the partner-orchestrated pattern in *4a* is the portable fallback.

**Default recommendation for this Build:** ship 4a. It's the pattern that works on every tenant. Treat 4b as a follow-on optimisation when the contract is settled for your customer's tenant.

## Step 5 — Wire step-level observability (3 hours)

For each agent step (planner, per-sub-question retrieval, synthesis, merge), log:

- **Step ID** (stable across the call).
- **Step type** (`planner` / `retrieve` / `synthesise` / `merge`).
- **Input** (what was passed in).
- **Output** (what was produced).
- **Duration** (wall-clock ms).
- **Cost** (token count × rate).

Write the logs to a per-call trace file. Render the trace in a simple HTML view — the partner needs to be able to click through the trace in the customer demo.

Save the renderer to `trace-viewer/`.

## Step 6 — Document failure modes (3 hours)

Run the agent against 5–10 scenarios. Observe:

- **Loop failures.** Agent plans 12+ sub-questions, doesn't converge.
- **Hallucinations.** Claims with no citation backing.
- **Dead-end sub-queries.** Sub-question returns nothing; agent synthesises anyway.

For each observed failure mode, document:

1. The failure pattern (what went wrong).
2. The recovery pattern (what fixes it).
3. The brief / schema / runner change that implements the recovery.

Save to `failure-mode-playbook.md`.

## Step 7 — Side-by-side demo (1 hour)

For the chosen scenario:

- Run through `/ask` sync. Capture the answer + latency + cost.
- Run through the agent. Capture the answer + latency + cost.

Build a side-by-side render (table or two-pane HTML) showing:

- Question.
- `/ask` answer + citations + cost + latency.
- Agent verdict + per-sub-finding breakdown + cost + latency.

The agent answer should be materially better on a hard multi-part question. If it isn't, either the scenario isn't actually hard or the brief / schema needs work.

Commit to `comparison-demo.md`.

## Pass-rubric self-check

- [ ] Agent deployed and running.
- [ ] `agent-brief.md` + `agent-schema.json` committed.
- [ ] Step-level observability wired; trace viewer works.
- [ ] Three failure modes documented with recovery patterns.
- [ ] Side-by-side `/ask` vs agent comparison committed.

## Getting unstuck

**Agent returns prose instead of structured output.** The schema isn't being enforced. Check the API call includes `schema` and `response_format`-style enforcement (depending on the agent endpoint's exact contract).

**Agent always returns `unknown` verdict.** The brief is too restrictive on grounding. Loosen the `grounding_status` thresholds — *"weak"* grounding is OK to surface; only ungrounded should default to unknown.

**Trace is missing the planner output.** The platform must be told to include the trace (e.g. `include_trace: true`). Check the API documentation for the exact flag.

---

## Next

[Build 8 — Agent Decomposition, Tool Use & Cost Observability](../build-8-agent-decomposition-and-observability/).
