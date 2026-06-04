# Build 7 — Lesson: Smart Filters & Labelsets

> Read time: 8 minutes. Companion to the 8-minute [video](video-script.md).

## Why partners learn this

Most partners ship retrieval against an unlabelled corpus and then complain results are too broad. **Labels are the cheapest precision lever in the entire platform.** Five minutes of labelset design lifts retrieval precision by 20–40% on most corpora. This Build is that lesson, plus how to wire filters into the front-end so the user has a knob to turn.

## The `filters` array

Both `/find` and `/ask` accept a `filters` array on the body:

```json
{ "query": "X", "filters": ["/icon/application/pdf", "/classification.labels/audience/legal-team"] }
```

Each entry is a **filter path**. Two kinds:

### Icon-path filters (content type)

| Path | Restricts to |
|---|---|
| `/icon/video` | All video MIME types |
| `/icon/audio` | All audio MIME types |
| `/icon/application/pdf` | PDFs |
| `/icon/application/stf-link` | External links |
| `/icon/text` | Plain text + markdown |

Stack multiple → OR semantics:

```json
{ "filters": ["/icon/video", "/icon/audio"] }  // videos OR audios
```

### Label-path filters (classification)

```
/classification.labels/<labelset_name>/<label_value>
```

For instance — `/classification.labels/audience/legal-team`, `/classification.labels/content-type/escalation`, `/classification.labels/region/emea`.

When you stack labels in one labelset, ARAG treats them as **AND** (e.g., `region:emea AND region:apac` returns documents in *both* regions — almost never what you want). When you stack labels in *different* labelsets, ARAG treats them as AND (e.g., `region:emea AND audience:legal-team`).

## Discovering labelsets

```
GET /v1/kb/{id}/labelsets
```

Returns the labelsets configured on the KB + their label values. For a fresh KB, this is likely empty — you haven't designed any. You design them next.

## Labelset design — five rules

1. **5–9 labels per labelset.** Cognitive limit. Less than 5 doesn't separate enough; more than 9 confuses both the classifier and the user.
2. **Map to user intent, not internal taxonomy.** The user thinks "I want videos about onboarding" — your labels should match that vocabulary, not the customer's CMS folder structure.
3. **Avoid overlap.** Two labels that mean almost the same thing dilute the classifier signal.
4. **One labelset per dimension.** `region`, `audience`, `priority`, `content_type`. Mix them and the model can't pick which dimension you're filtering on.
5. **Document the rationale.** When the customer's content team asks "why isn't there a 'legacy' label?", you should have the answer in your design doc.

## Populating labels

Two paths:

### Rule-based / heuristic

For obvious labels (region from filename, audience from folder path), write a small ingest-time rule that applies the label automatically. Cheap, deterministic. The Advanced course covers this in depth.

### Model-based / classifier

For nuanced labels (priority, sentiment, topic), train a classifier that runs at ingest time. ARAG supports this; the dashboard has the configuration UI. For Build 7 we focus on **using** labels via filters; classifier *training* is an Advanced topic.

## Per-paragraph labels (advanced)

Paragraphs can carry their own labels independent of the parent resource. A long PDF might have one section labelled "compliance" and another labelled "technical". When you filter by `/classification.labels/topic/compliance`, ARAG returns only the *paragraphs* with that label — not the whole document.

This is how customers build "tag-driven section search" inside long-form content. We won't wire it today but recognise the capability.

## Filter UX patterns

Three common UI affordances built on `filters`:

1. **Content-type chips above search results.** "All | Videos | PDFs | Docs". Click a chip → re-fire query with that icon-path filter.
2. **Sidebar facets per labelset.** "Region: EMEA, NORAM, APAC, LATAM". Click → add `/classification.labels/region/<value>` to the filter array.
3. **Smart-default filters.** Pre-filter the search based on the user's profile (e.g., a EMEA user defaults to `region:emea`).

All three are vibe-codeable in 30 minutes once the filter array is wired.

## Dynamic labelset resolution

Real customer deployments often have **different labelset names across KBs** (e.g., one KB has a labelset called `topic`, another calls it `key-topic`). When you build a UI that points at multiple KBs (rare but real), resolve the labelset name at runtime:

```typescript
const labelsets = await fetch(`${base}/kb/${kbId}/labelsets`, { headers }).then(r => r.json());
const topicLabelset = labelsets['topic'] ?? labelsets['key-topic'] ?? Object.values(labelsets)[0];
```

A small detail; the Advanced course has the full pattern.

## What you'll vibe-code in the walkthrough

A filterable search UI extending your existing chat or building fresh:

1. A content-type chip strip (All / Videos / PDFs / Audio / Docs).
2. A labelset facet (one labelset of your design — e.g., `topic`).
3. Live re-query on filter change.
4. Plus the labelset design doc you wrote.

## Common pitfalls

- **Designing 30 labels in one labelset.** Cognitive overload. Five to nine.
- **Internal taxonomy as labels.** Match user intent, not org-chart structure.
- **Forgetting `/classification.labels/` prefix.** It's a path, not a value.
- **Assuming labels exist on a fresh KB.** They don't. Design them.
- **Mixing dimensions in one labelset.** `region: emea`, `audience: legal-team` are *different* labelsets.

## What's next

[Build 8 — Knowledge Graph 101](../build-08-knowledge-graph/) — typed entity navigation. The Tier 4 surface. The single most differentiated capability in ARAG.
