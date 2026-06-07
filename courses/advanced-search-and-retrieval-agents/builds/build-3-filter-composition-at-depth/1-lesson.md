# Build 3 — Lesson: Filter Composition at Depth

> Read time: 12 minutes. Companion to the 10-minute [video](video-script.md).

## Why partners learn this

Foundations Build 7 introduced single-axis filtering — *"label: marketing"* or *"content_type: video"*. Real customer scenarios stack three or four axes with explicit AND / OR / NOT semantics — *"PDFs from EMEA OR videos from any region, AND NOT marked confidential."* Get this wrong and the search silently returns wrong results; get it right and you ship a UX every competitor has gaps in.

This Build is the depth-of-mastery Build for filtering. By the end the partner has a working AND/OR/NOT/nested test suite, a reusable filter-UI component, and at least one **computed filter** that generates expressions at query time from session state.

## The four filter primitives in ARAG

| Primitive | Wire-format | What it does |
|---|---|---|
| Equality | `field:value` | Match resources where `field == value` |
| Set membership | `field:[v1,v2,v3]` | Match if `field` is any of the values |
| Negation | `!field:value` | Match resources where `field != value` |
| Range | `field:[low TO high]` | Match resources where `field` is in the range (dates, scores) |

Stacking these inside boolean operators (AND, OR, NOT) is what composition means.

## AND, OR, NOT — the three composition operators

In ARAG's filter expression syntax, the default is AND. *"Give me docs labelled X and from region Y"* is two filters concatenated:

```
labels:onboarding AND region:emea
```

OR requires explicit grouping:

```
(labels:onboarding OR labels:training) AND region:emea
```

NOT prefixes a clause:

```
labels:onboarding AND NOT classification:confidential
```

Nesting requires parentheses. Three-level nesting is the upper end of what's intelligible to the next person reading your filter spec — past that, the filter should be decomposed into a custom labelset.

## Computed filters — the partner differentiator

A computed filter is a filter expression *generated at query time from session state*. Examples:

- *"Documents whose region matches the user's current region."* The filter is `region:{{user.region}}`, computed per request.
- *"Documents whose classification level is at or below the user's tier."* The filter is computed from a tier ↔ classification map.
- *"Documents from the last N days, where N depends on the persona."* The filter is `date:[now-{{persona.recencyDays}}d TO now]`.

Computed filters are the bridge between *"the customer's search works"* and *"the customer's search feels like it was made for them."* They're also the cleanest place to enforce security boundaries — a profile-driven computed filter is harder to bypass than a UI-layer filter.

## UI patterns for filter discovery + removal

The filter wire-format is opaque to end-users. The UI translates user intent into the wire-format. Three patterns, each with use-cases:

### Chip strip

A horizontal row of chips at the top of the results. Each chip represents one applied filter. Clicking the chip's × removes it.

Best for: 1–4 active filters, casual users, content-browsing UX.

### Breadcrumb

A vertical list of applied filters, often in a sidebar header. Same removal mechanic.

Best for: 4–8 active filters, document-repository UX, analyst tools.

### Advanced-filter modal

A modal dialog with the full filter expression editable as a tree. The user adds clauses, groups them, applies operators. The dialog renders the wire-format inline.

Best for: power-user tools, internal search, support consoles.

A partner builds **all three** in their reusable component library so the right one slots into each customer engagement.

## The reusable filter-UI component

The deliverable is a React (or Vue / vanilla — partner's choice) component that:

- Accepts an array of `FilterClause` objects.
- Renders chip strip + breadcrumb + advanced modal modes (switchable by prop).
- Emits a `filterExpression` string in the ARAG wire-format when filters change.
- Supports computed filters via a `compute` callback.
- Handles AND / OR / NOT / 3-level nesting.

A partner who ships this component once doesn't rebuild it. Time spent here returns disproportionate value.

## What you'll do in the walkthrough

1. Build the filter-expression test suite covering AND / OR / NOT / nested.
2. Document the wire-format syntax with worked examples.
3. Implement the reusable filter-UI component (chip + breadcrumb + advanced modal).
4. Implement one computed filter end-to-end.
5. Demo against a scenario the customer's existing search can't handle.

## Reference reading

- **[`/ask` parameter reference §6 — Filters](../../assets/ask-parameter-reference.md#6-filters)** — the `filters`, `filter_expression`, `security`, and `show_hidden` parameters in full, with worked nested examples.
- Foundations Build 7 — *Smart Filters & Labelsets* — the entry-level baseline.
