# Build 6 — Walkthrough: Search Profiles & Per-Use-Case Tuning

> Estimated time: 12–14 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

- A **search-profile schema** with three profiles.
- A **selection logic** implementation.
- **Profile switching without page reload.**
- **Per-profile success metrics** with measurement.
- A **same-query-different-profile demo.**

## Step 1 — Define three profiles for the customer's KB (2 hours)

Pick a customer's KB you've worked. Define three profiles:

```yaml
profiles:
  shopper:
    primitive: ask_streaming
    rephrase: { enabled: true, prompt_template: shopper_casual }
    filter_defaults:
      - "classification:public"
    reranking: built_in
    renderer: grounded_answer_with_chips
    success_metric: success_of_first_click

  staff:
    primitive: predict_chat
    rephrase: { enabled: true, prompt_template: vertical_jargon }
    filter_defaults:
      - "classification:[public,internal]"
    reranking: adaptive_external_top10
    renderer: conversational_with_continuity
    success_metric: retrieval_completeness_top10

  power_user:
    primitive: retrieval_agent
    rephrase: { enabled: false }
    filter_defaults: []
    reranking: adaptive_external_top10
    renderer: terse_summary_plus_deep_evidence
    success_metric: time_to_decision
```

Commit to `search-profile-schema.md`.

## Step 2 — Implement selection logic (2 hours)

```typescript
function selectProfile(context: SessionContext): ProfileId {
  // 1. Explicit session opt-in wins.
  if (context.userToggle === 'analyst_mode') return 'power_user';

  // 2. Workspace-driven.
  if (context.workspace === 'public_portal') return 'shopper';
  if (context.workspace === 'internal_console') return 'staff';

  // 3. Role-based default.
  switch (context.user.role) {
    case 'customer':       return 'shopper';
    case 'staff':          return 'staff';
    case 'analyst':        return 'power_user';
    case 'admin':          return 'power_user';
    default:               return 'shopper';
  }
}
```

Save to `profile-selection/`.

## Step 3 — Implement per-query inference (optional but recommended, 2 hours)

The partner differentiator. If the user's query *looks like* an analyst query, auto-switch profile.

Heuristics:

- Query length > 30 words → likely power-user.
- Query contains domain jargon (regex match against domain term list) → likely staff.
- Query is short + casual → shopper.

Build a classifier that takes the query + context and returns a profile suggestion. The user can override.

```typescript
function inferProfile(query: string, context: SessionContext): ProfileId | null {
  const tokens = query.split(/\s+/);
  if (tokens.length > 30) return 'power_user';
  if (matchesDomainJargon(query, context.tenant.jargonList)) return 'staff';
  return null;  // null = fall through to selection logic
}
```

## Step 4 — Wire profile switching without page reload (2 hours)

The UI has a profile-selector control (dropdown, toggle, or tab strip). Switching it updates session state and the *next* query uses the new profile.

State management is React Context, Zustand, Pinia — partner's pick. The key constraint: the active profile is reactive; UI components subscribe to it and re-render their controls (e.g. the filter chip strip changes when the profile changes).

Test: open the app, type a query, see results. Switch profile via the selector. Type the same query. See materially different results. No page reload.

Commit to `profile-switching-demo.md` with a step-by-step transcript.

## Step 5 — Define and measure per-profile success metrics (3 hours)

For each profile, instrument the metric:

### Shopper — success-of-first-click

Log when the user clicks a search result. Bucket by which position they clicked (1, 2, 3, etc.). Compute: fraction of sessions where the user clicked one of the top-3 results.

### Staff — retrieval completeness top-10

Hand-label 10 staff-archetype queries with the *full* set of relevant resources (≥ 3 per query). Compute: fraction of hand-labelled resources that appear in the top-10 returned.

### Power-user — time-to-decision

Log the time from query submission to the user dismissing the summary or taking a downstream action. Compute median.

Run each measurement against a test session of ≥ 20 queries per profile. Commit results to `per-profile-metrics.md`.

## Step 6 — Same-query-different-profile demo (1 hour)

Pick one query. Run it through all three profiles. Record:

- The retrieved resources (different filter defaults).
- The rendered output (different renderers).
- The latency (different reranking budgets).
- The cost (different primitives).

Commit to `demo-script.md`.

## Step 7 — Publish the schema (15 min)

Copy `search-profile-schema.md` to `../../assets/search-profile-schema.md`.

## Pass-rubric self-check

- [ ] Three profiles defined in `search-profile-schema.md`.
- [ ] Profile selection logic implemented.
- [ ] Profile switching works without page reload.
- [ ] Per-profile success metrics measured + committed.
- [ ] Same-query-different-profile demo script committed.
- [ ] Schema copied to course assets.

## Getting unstuck

**Profile switch doesn't update filters.** The filter UI isn't subscribed to the profile state. Add the subscription.

**Per-query inference fires too eagerly.** Add a confidence threshold. Default to falling through to role-based selection unless the heuristic match is strong (≥ 2 indicators).

**Staff completeness metric is below 50%.** Either the filter defaults are too narrow, or the reranker is dropping relevant sources past position 10. Either widen the filter or extend reranking to top-20.

---

## Next

[Build 7 — Retrieval Agents 101](../build-7-retrieval-agents-101/).
