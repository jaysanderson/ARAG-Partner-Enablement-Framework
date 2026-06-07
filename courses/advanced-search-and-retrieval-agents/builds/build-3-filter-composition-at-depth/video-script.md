# Video Script — Build 3: Filter Composition at Depth

> **Duration target:** 10 minutes
> **Format:** Screen recording + voiceover. Live demo of the filter-UI component.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Build 3 · Filter Composition at Depth."*

**VOICEOVER:**
> Ten minutes. Foundations introduced single-axis filtering. Real customer scenarios stack three or four axes with explicit AND, OR, NOT semantics. By the end of this video you'll have a reusable component, a wire-format cheat sheet, and a computed filter you can drop into any customer engagement.

## Section 1: The four filter primitives (0:30 – 2:30)

**ON SCREEN:** Four primitives shown as a 2×2 grid. Equality, set membership, negation, range. Each with a worked example.

**VOICEOVER:**
> Four primitives. Equality matches a field against a value. Set membership matches against any of N values. Negation excludes. Range bounds dates and numeric scores.
>
> Every filter expression composes these four primitives with three operators — AND, OR, NOT.

## Section 2: AND, OR, NOT (2:30 – 4:30)

**ON SCREEN:** Three example expressions, increasingly complex. Last one shows three-level nesting.

**VOICEOVER:**
> AND is the default — concatenated clauses compose with AND. OR requires explicit grouping with parentheses. NOT prefixes a clause.
>
> Nesting works to three levels intelligibly. Past three levels, the filter should be decomposed into a custom labelset — past three levels nobody reads it the same way twice.

## Section 3: Computed filters (4:30 – 6:30)

**ON SCREEN:** Code snippet showing `compute` callback that pulls `user.region`, `user.tier`, `persona.recencyDays` from session state.

**VOICEOVER:**
> Computed filters are the partner differentiator. The filter expression is generated at query time from session state.
>
> *Documents whose region matches the user's region.* Computed.
> *Documents at or below the user's classification tier.* Computed.
> *Documents from the last 90 days for shoppers, last 30 days for power users.* Computed.
>
> Computed filters are also where you enforce security boundaries. Server-side, in the wire format. Harder to bypass than UI-layer enforcement.

## Section 4: The reusable component (6:30 – 8:30)

**ON SCREEN:** Live demo of the three modes — chip strip, breadcrumb, advanced modal — switching with a prop.

**VOICEOVER:**
> Three UI modes in one component. Chip strip for casual users with one to four active filters. Breadcrumb for document-repository UX with more axes. Advanced modal for power-user tools.
>
> One component, three modes, all three operators, computed filter support. Ship it once, re-use it across every engagement.

## Section 5: Defence (8:30 – 9:30)

**ON SCREEN:** A customer scenario — *"PDFs in user region OR globally-published, NOT confidential to user tier."* The partner walks through the wire-format conversion live.

**VOICEOVER:**
> The defence is a live demo. Customer describes the scenario; partner types the filter into the advanced modal; the wire-format renders inline; the partner explains the conversion.
>
> The combination of computed filter for session state and explicit AND/OR/NOT for the rest is the customer's *"oh, that works for us"* moment.

## Close (9:30 – 10:00)

**VOICEOVER:**
> Build 3 ships the test suite, the cheat sheet, the component, the computed filter. Build 4 stacks reranking on top of the filtered retrieval. See you there.
