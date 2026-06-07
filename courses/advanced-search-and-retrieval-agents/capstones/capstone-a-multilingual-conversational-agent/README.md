# Capstone A — Multilingual Conversational Retrieval Agent

> Part of [Advanced Search & Retrieval Agents — Capstones](../README.md).

> **Status:** Brief shipped. Reference implementation lands in subsequent passes.

## At a glance

| | |
|---|---|
| **Effort** | 5–7 days focused |
| **Builds leveraged** | 2 (rephrasing), 5 (multi-turn), 7 (agents) |
| **Customer shape** | Consumer-facing brand with multilingual customers (retail, hospitality, professional services, consumer health) |
| **Failure being solved** | *"Our chatbot only works in English and forgets what the customer just told it."* |

## 1. Customer shape

A consumer brand operating across at least three languages — likely English plus two of {Spanish, French, German, Mandarin, Japanese, Portuguese, Arabic} — whose customers ask follow-up questions and frequently switch language mid-conversation. The chatbot the customer is shipping today fails at one of:

- It only handles single-shot questions; follow-ups lose context.
- It handles follow-ups but only in the language of the first turn — a mid-conversation switch breaks it.
- It handles language switches but loses citation continuity — the same source cited in turn 1 cannot be referenced in turn 3 if the conversation has switched language.

The partner's deliverable solves all three.

## 2. Deliverable

A deployed multi-turn conversational retrieval agent that:

- Answers in the language of the question (auto-detected at each turn).
- Handles language switches mid-conversation. The conversation state survives the switch.
- Preserves citation continuity across translations — turn-3 citation pointer correctly references a turn-1 source even when the conversation has switched language between them.
- Surfaces a *"Translated for you"* affordance whenever the source content is in a different language from the question, with one-click access to the source-language original.

The reference implementation should target a published demo persona (the partner can re-use Aurora Outfitters or stand up a fresh persona — see Reskinning notes).

## 3. Architecture

- **One Knowledge Box** containing source documents in their native languages. The KB does *not* contain pre-translated duplicates; translation is at query time.
- **Two search profiles** (Build 6): one for end-customers (terse answers, customer-vocabulary rephrasing), one for support staff (full answers, source-language citations preserved).
- **One Retrieval Agent** (Build 7) that:
  - Detects the question's language.
  - Rephrases the question for retrieval using the custom rephraser prompt from Build 2.
  - Retrieves from the KB.
  - Synthesises the answer in the question's language with citation continuity.
- **Conversation state schema** (Build 5) that includes per-turn language tag and a citation-id ledger that survives language switches.

## 4. Scope

### In scope (must ship)

- Multi-turn conversational surface deployed against a real KB.
- At least three languages supported, with measured success at language detection.
- Citation continuity across at least one full language switch.
- *"Translated for you"* affordance with source-language fallback.
- 15-minute customer demo rehearsed.
- Reskin playbook (how to swap the persona).

### Out of scope (explicitly)

- Human translation workflows. The translation is at the LLM layer; the partner doesn't ship a CMS-style translation pipeline.
- Translation memory or term-base integration. This capstone is the proof-of-concept; integration with the customer's existing translation infrastructure is a follow-on engagement.
- Voice (TTS / STT). Text-only conversational surface for the capstone.

## 5. Demo script (15–20 min)

1. **Setup (1 min)** — chatbot embedded on a brand site, customer persona selected.
2. **Turn 1 — Spanish factoid** (2 min) — *"¿Cuál es la diferencia entre Producto X y Producto Y?"* Agent answers in Spanish with three citations.
3. **Turn 2 — French follow-up referencing turn 1** (3 min) — *"Et lequel recommandez-vous pour un usage en haute montagne?"* Agent picks up the entity from turn 1, answers in French, references one of the turn-1 citations.
4. **Turn 3 — English clarification** (3 min) — *"Wait, what was the warranty length on the second one again?"* Agent resolves *"the second one"* to the turn-1 entity, answers in English, surfaces the source-language citation with a *"Translated for you"* affordance.
5. **Source-language drill-down** (2 min) — partner clicks the *"Translated for you"* affordance; the original source document opens in its native language with the cited passage highlighted.
6. **Architecture walk (3 min)** — partner shows the conversation-state schema, the language detection step, the rephraser prompt, the citation-id ledger.
7. **Q&A from the customer's CTO (3–5 min)** — partner defends design choices.

## 6. Pass rubric

The Progress Solution lead reviews against:

1. Multi-turn surface deployed; reviewers can ask three turns in three languages and get coherent answers.
2. Language detection works across the supported language set (≥ 95% on a 50-turn test set).
3. Citation continuity verified — a turn-3 citation pointer correctly opens a turn-1 source.
4. *"Translated for you"* affordance present and working.
5. Demo script delivered live in under 20 minutes.
6. Workspace deliverables (architecture doc, conversation-state schema, rephraser prompt, demo script, reskin playbook) all committed.

## 7. Effort breakdown

| Day | Activity |
|---|---|
| 1 | Persona + language set decision; KB provisioning; baseline multi-turn surface (single language). |
| 2 | Language-detection step + auto-rephrasing pipeline; first two-language test. |
| 3 | Conversation-state schema with per-turn language tag; citation-id ledger. |
| 4 | Citation continuity across language switches; *"Translated for you"* affordance. |
| 5 | Demo script rehearsal; reskin playbook drafting. |
| 6 | Polish; verification checklist; review-board sign-off. |
| 7 (optional) | Polish + delivery slack for the demo defence. |

## 8. Reskinning notes

The Aurora Outfitters persona is the default. To reskin:

- Swap the KB content. Use the `progress-kb-use-case-generator` skill to generate a vertical-appropriate corpus.
- Swap the language set. Choose three languages relevant to the new customer's market.
- Swap the rephraser prompt's vertical terminology (Build 2's prompt template has variable slots).
- Swap the brand colours / typography in the conversational surface UI. The conversation logic and citation-id ledger don't change.
- A complete reskin (no architecture changes) typically takes 1.5–2 days.

## Workspace

- `architecture.md` — KB, profiles, agent, state schema.
- `conversational-surface/` — the deployed implementation.
- `language-detection/` — the detection step.
- `rephraser-prompt-localised.md` — the prompt with vertical + language slots filled.
- `citation-id-ledger.md` — the ledger schema.
- `demo-script.md` — the 15-min script.
- `reskin-playbook.md` — how to swap the persona.
- `verification.md` — reviewer checklist.

## See also

- Capstones overview: [`../README.md`](../README.md)
- Build 2: [Query Understanding & Rephrasing](../../builds/build-2-query-understanding-and-rephrasing/)
- Build 5: [Multi-Turn Conversational Retrieval](../../builds/build-5-multi-turn-conversational-retrieval/)
- Build 7: [Retrieval Agents 101](../../builds/build-7-retrieval-agents-101/)
