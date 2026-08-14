# Build 07 — Quick Quiz: Widget Configuration

> 5 multiple-choice. Open-book. Pass = 4/5.

---

### 1. A partner wants a widget embedded on a customer's "Support" page to only ever return support content, without the visitor ever touching a filter. The right `SearchBoxConfig` field is:

A. `filterLogic`
B. `rrfBoosting`
C. `labelFilterCounts`
D. `preselectedFilterExpression` (or `initialFilters`)

---

### 2. `rephrasePrompt` has no effect on a widget's queries. The most likely cause is:

A. `rephraseQuery` is off, so there's no rephrase step for the prompt to shape
B. `rephrasePrompt` is deprecated
C. `rephrasePrompt` only applies to `/find`, not `/ask`
D. `highlight` must be on first

---

### 3. Where does a partner go to preview, rename, duplicate, or delete an existing widget without rebuilding it from scratch?

A. The single widget's three-pane configurator
B. The Widget Builder list view, one level above the single-widget configurator
C. The Search tab
D. RAG Lab

---

### 4. `GenerativeAnswerConfig`, `ResultDisplayConfig`, and `RoutingConfig` inside a widget's configuration object are:

A. New, widget-only parameters with no API equivalent
B. Deprecated in favor of `SearchBoxConfig`
C. The same fields Builds 02 and 05 already taught as `/ask` parameters, exposed as widget-builder toggles
D. Only available on the internal/staff widget type

---

### 5. `labelSetsExcludedFromFilters` is set to a labelset that genuinely exists on the Knowledge Box. What does the end user see?

A. An error in the filter panel
B. The labelset's facet, but greyed out and unclickable
C. The entire filter panel is hidden
D. The labelset never appears as a filter option, even though it still exists on the Knowledge Box

---

## Answer key

1. D · 2. A · 3. B · 4. C · 5. D

4+ correct → pass. Continue to [Build 08](../build-08-widget-deployment/).
