# Build 3 — Filter Composition at Depth

> Part of [Advanced Search & Retrieval Agents](../../README.md).
>
> **Why this matters:** Foundations Build 7 teaches single-axis filtering. Real customer scenarios stack three or four filter axes with AND / OR / NOT semantics — *"PDFs from the EMEA region, OR videos from any region, AND NOT marked confidential."* Getting this wrong silently returns wrong results; getting it right is one of the highest-leverage UX wins.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Must), Deliver (Must) |
| **Prerequisite** | Build 2 of this course |
| **Estimated effort** | 12–16 hours focused |

## What the partner does

Builds a filter-composition test suite that exercises AND, OR, NOT, and nested groupings across content-type, label, region, time-range, and free-text filter axes. Documents the wire-format syntax for nested filter expressions in ARAG. Designs a UI pattern for filter discovery and removal (chips, breadcrumb, advanced-filter modal) that maps cleanly to the wire format. Implements at least one **computed filter** — a filter expression generated at query time from session state (e.g. *"documents within the user's region and not marked confidential to the user's tier"*).

The reusable filter-UI component is the deliverable a partner will use unchanged across the next five customer engagements. Time spent here returns disproportionate value.

## Pass rubric

1. Test suite covering AND, OR, NOT, and at least one 3-level nested expression.
2. Filter-expression syntax documented in the workspace with worked examples.
3. UI pattern delivered as a reusable component (React preferred; Vue / vanilla acceptable). The component must handle filter discovery, application, and removal without page reload.
4. At least one computed filter implemented end-to-end against a real session state.
5. Demo against a scenario the customer's existing search can't handle (e.g. *"documents in my region, or any global docs, but never the confidential ones"*).

## Asset delivered

- `filter-syntax-cheatsheet.md` — wire-format reference with worked examples.
- `filter-ui-component/` — the reusable component source.
- `filter-test-suite/` — automated tests covering AND / OR / NOT / nested cases.
- `computed-filter-example.md` — the worked computed-filter case.

## Workspace

- `walkthrough.md`
- `filter-syntax-cheatsheet.md`
- `filter-ui-component/`
- `filter-test-suite/`
- `computed-filter-example.md`
- `verification.md`

## Reference reading

- ARAG documentation: `/find` filter expression syntax, classification labels, paragraph-level filtering.
- Sibling Foundations Build 7 — *Smart Filters & Labelsets* — the entry-level baseline.

## See also

- Previous build: [Build 2 — Query Understanding & Rephrasing](../build-2-query-understanding-and-rephrasing/)
- Next build: [Build 4 — Reranking Strategies](../build-4-reranking-strategies/)
