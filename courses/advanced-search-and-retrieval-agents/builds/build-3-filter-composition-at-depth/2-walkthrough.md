# Build 3 — Walkthrough: Filter Composition at Depth

> Estimated time: 12–16 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

- A **filter-composition test suite** covering AND / OR / NOT / 3-level nested expressions.
- A **wire-format cheat sheet** with worked examples for the customer-conversation reference.
- A **reusable filter-UI component** (chip / breadcrumb / advanced modal).
- A **computed filter** implementation against real session state.

## Step 1 — Document the filter syntax (2 hours)

Write the cheat sheet *first* — every other step references it.

Open `filter-syntax-cheatsheet.md`. Cover:

- Equality, set membership, negation, range — each with a worked example against your KB.
- AND / OR / NOT — with worked examples.
- Three-level nesting — with one worked example.
- Wire-format escaping (special characters, spaces in values).
- Per-paragraph vs per-resource filters.

Aim for ~150 lines. This doc lives in the customer's hands during scoping conversations.

## Step 2 — Build the test suite (3 hours)

The suite is automated tests that exercise every filter shape against the real KB. Each test:

1. Issues a `/find` with a known filter expression.
2. Asserts that the returned resources match an expected hand-labelled set.

Use Jest, Vitest, pytest — partner's pick.

Coverage required:

- 6 equality tests (one per labelset value).
- 3 set-membership tests (`labels:[X,Y]`).
- 3 negation tests (`!field:X`).
- 3 range tests (date or score).
- 3 AND composition tests.
- 3 OR composition tests.
- 3 NOT composition tests.
- 1 three-level nested test (e.g. `(labels:X OR labels:Y) AND region:Z AND NOT classification:C`).

Commit to `filter-test-suite/`.

## Step 3 — Implement the reusable component (5 hours)

The component is your durable artefact. Spec:

```typescript
interface FilterClause {
  field: string;
  operator: 'eq' | 'in' | 'neq' | 'range';
  value: string | string[] | { low: string, high: string };
}

interface FilterUIProps {
  clauses: FilterClause[];
  mode: 'chip' | 'breadcrumb' | 'advanced';
  onChange: (clauses: FilterClause[]) => void;
  toWireFormat: (clauses: FilterClause[]) => string;
}
```

Vibe-code it with your AI assistant. The brief:

```
Create a reusable React component <FilterUI> with these props:
- clauses: an array of FilterClause objects
- mode: 'chip', 'breadcrumb', or 'advanced'
- onChange: callback when clauses change
- toWireFormat: function that returns the ARAG wire-format string

Implement all three modes:

Chip mode: horizontal row of removable chips at the top, one per clause.

Breadcrumb mode: vertical list of clauses with × buttons.

Advanced mode: tree editor. User can add clauses, group them with
AND/OR/NOT operators, and see the wire-format rendered live below.

For wire-format conversion: equality is "field:value"; set membership
is "field:[v1,v2,v3]"; negation is "!field:value" or "NOT field:value";
range is "field:[low TO high]"; AND/OR/NOT compose with parentheses.

Style for a clean modern look. Loading and error states for the
advanced mode's tree editor.

Plain React, no SDK. Tailwind acceptable.
```

Save under `filter-ui-component/`. Iterate until the test suite from Step 2 passes when wired through the component.

## Step 4 — Implement the computed filter (2 hours)

Pick one scenario. Examples:

- *"Documents whose region matches the user's session region."*
- *"Documents at or below the user's classification tier."*
- *"Documents from the last 90 days for shopper persona, last 30 days for power-user persona."*

Implement:

```typescript
function computeFilters(session: SessionState): FilterClause[] {
  const clauses: FilterClause[] = [];

  // Region filter from session
  if (session.user.region) {
    clauses.push({
      field: 'region',
      operator: 'eq',
      value: session.user.region,
    });
  }

  // Classification filter from tier
  const maxLevel = TIER_TO_CLASSIFICATION[session.user.tier];
  clauses.push({
    field: 'classification.level',
    operator: 'range',
    value: { low: '0', high: maxLevel.toString() },
  });

  return clauses;
}
```

Wire it into the `<FilterUI>` component via the `compute` prop. Test against a session state with real user attributes.

Commit to `computed-filter-example.md` with the code + reasoning.

## Step 5 — Demo against a customer scenario (1 hour)

Pick a scenario from current pipeline where the customer's existing search can't handle the filter requirement. Examples:

- *"Documents in the user's region, OR globally-published docs, but NEVER the ones marked confidential to the user's tier."*
- *"Press releases from the last 90 days, OR product launches from the last 30 days, NOT preprint."*

Walk the scenario through your component live. Record it (text walkthrough is fine; video optional).

Commit to `demo-script.md`.

## Pass-rubric self-check

- [ ] `filter-syntax-cheatsheet.md` with worked examples for every filter primitive and composition operator.
- [ ] `filter-test-suite/` covers AND / OR / NOT / 3-level nested.
- [ ] `filter-ui-component/` implements chip + breadcrumb + advanced modal.
- [ ] `computed-filter-example.md` shows one end-to-end implementation.
- [ ] `demo-script.md` against a real customer scenario.

## Getting unstuck

**Wire-format escaping breaks on values with colons or spaces.** Quote the value: `"my:complex value"`. The cheat sheet should show this.

**Advanced modal's tree editor is hard to vibe-code.** Start with a flat list of AND-only clauses; add OR grouping in a second pass; add NOT in a third. Don't try to ship all three operators in one AI iteration.

**Computed filter doesn't apply.** Common bug: the compute callback fires before session state hydrates. Add a `loading` state for the FilterUI until session is ready.

---

## Next

[Build 4 — Reranking Strategies](../build-4-reranking-strategies/).
