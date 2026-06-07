# Video Script — Build 6: Search Profiles & Per-Use-Case Tuning

> **Duration target:** 9 minutes

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Build 6 · Search Profiles & Per-Use-Case Tuning."*

**VOICEOVER:**
> Nine minutes. One Knowledge Box, three personas. The partner who ships one search configuration optimises for one persona at the cost of the others. By the end of this video you'll know how to ship three.

## Section 1: What a profile bundles (0:30 – 2:30)

**ON SCREEN:** Five-row table showing the levers a profile combines — primitive, rephrasing, filter defaults, reranking, renderer, success metric.

**VOICEOVER:**
> A profile bundles five levers. The primitive choice from Build 1. The rephrasing strategy from Build 2. The filter defaults from Build 3. The reranking budget from Build 4. Plus the result renderer and the per-profile success metric.
>
> Three profiles, five levers tuned per profile — fifteen configurations on one platform. Without duplicating the KB.

## Section 2: The three persona tiers (2:30 – 4:30)

**ON SCREEN:** Three-column grid showing shopper, staff, power-user. Each column shows the profile's defaults.

**VOICEOVER:**
> Shopper. Customer or patient or policyholder. Casual phrasing. Public-only content. Grounded answer with citation chips. Success metric: time-to-first-click.
>
> Staff. Internal user. Vertical jargon. Public plus internal content, no confidential. Conversational with continuity. Success metric: retrieval completeness in the top ten.
>
> Power user. Analyst or executive. Precise queries, no rephrasing. All classifications. Terse summary plus deep-evidence table. Success metric: time-to-decision.
>
> Three personas. Five levers each. Measurable success metric each.

## Section 3: Selection logic + auto-inference (4:30 – 6:30)

**ON SCREEN:** Code snippet showing role-based selection plus per-query inference fallback.

**VOICEOVER:**
> Five sources of selection signal. Explicit session opt-in. Workspace. Tenant tier. Logged-in role. And — the partner differentiator — per-query inference.
>
> A thirty-word query with vertical jargon — auto-switch to staff. A short casual query — shopper. The user can override; the inference is a hint, not a decision.

## Section 4: Switching without page reload (6:30 – 8:00)

**ON SCREEN:** Live demo — type a query, switch profile via the dropdown, retype the same query, see materially different results. No reload.

**VOICEOVER:**
> Profile switching has to work without page reload. The active profile is reactive; UI components subscribe and re-render. The filter chip strip changes when the profile changes. The renderer changes when the profile changes.
>
> Anything less than reactive feels like three products bolted together. Reactive feels like one product that knows who you are.

## Close (8:00 – 9:00)

**VOICEOVER:**
> Build 6 ships the schema, the selection logic, the per-profile metrics. Build 7 introduces a different category of primitive — the Retrieval Agent. See you there.
