# Build 07 — Lesson: Widget Configuration

> Read time: 14 minutes.

## Why this is in the course

[Developer Foundations Build 2](../../../developer-foundations/builds/build-02-drop-in-widgets/) got you a working widget in 30 minutes — enough to demo. It toured the configurator once, at speed, and touched a handful of options: placeholder text, theme, layout, a slug-substring filter. That's the right depth for a first pass. It is not the depth a partner needs when a customer says *"can the search bar pre-scope to just our support docs,"* or *"can staff see a filter panel the public site doesn't,"* or *"why does the chat answer feel over-confident on vague queries."* Every one of those questions has a specific, named field behind it. This Build is the deep-dive: the same four widgets, the same dashboard area, the full configuration surface.

## Recap: the four widgets

Unchanged from Foundations Build 2 — four standard Web Components, combined however a customer's page needs:

- **`<nuclia-search-bar>`** — the search input, autocomplete, filters.
- **`<nuclia-search-results>`** — the results list rendered from a search-bar query.
- **`<nuclia-chat>`** — floating (bubble + popup panel) or inline/anchored. Chat mode displays the full chat interface directly.
- **`<nuclia-popup>`** — search input and results together, displayed in a popup modal.

Theme is still `light` / `dark` / `system-auto`, set the same way you set it in Foundations Build 2. Nothing here changes any of that — this Build is almost entirely new option surface underneath the search-bar widget, plus the dashboard's widget-management view you didn't see in Build 2.

## The Widget Builder list view

Open the Knowledge Box's **Widgets** section in the dashboard (route pattern `.../[kb]/widgets`). Foundations Build 2 sent you straight into the three-pane configurator (configuration / preview / code) to build one widget. What it didn't show you: the list view sitting one level up, where every widget you've built for this Knowledge Box is managed.

From that list you can:

- **Create** a new widget (the flow Build 2 walked you through).
- **Preview** any existing widget without opening the full configurator.
- **Rename** a widget — matters once you have more than one; "Widget 3" doesn't tell the next partner which customer page it's for.
- **Duplicate** a widget — the fast path to a second variant that shares 90% of a working configuration. Duplicate, then change the handful of fields that differ, instead of rebuilding from a blank configurator.
- **Delete** a widget.

A single Knowledge Box routinely backs several widget variants — a public site widget, an internal staff tool, a partner-specific embed with different pre-scoping. The list view, not the single-widget configurator, is where you manage that set. This Build's walkthrough has you build two variants and use rename/duplicate/preview on them directly.

## `SearchBoxConfig` — the full option tour

Everything below lives on the search-bar widget's configuration object, `SearchBoxConfig`. Foundations Build 2 showed you autocomplete-on-off and one filter expression. Here's the rest.

### Autocomplete quality

- **`autocompleteFromNERs`** (boolean) — draws autocomplete suggestions from Named Entity Recognition instead of plain substring matching. **End-user effect:** as a shopper types, suggestions surface known entities from the corpus — product names, people, places — not just strings that happen to match. Turn it on for corpora with a rich, well-defined entity set (product catalogues, named ambassadors, named trails); plain substring autocomplete is fine for a smaller or less structured corpus.

### Filters — whether, how, and what

- **`filter`** (boolean) — the on/off switch for showing a filter panel in the widget at all. Off means the end user never sees filter UI, regardless of what's configured underneath.
- **`filterLogic`** (`and | or | and-or`) — how the widget combines multiple filters a user has selected across facets. `and` narrows fast (every selection must match); `or` broadens (any selection matches); `and-or` lets the widget apply `or` within a facet and `and` across facets — the shape most faceted-search UIs actually want.
- **`filters`** — the filter-selection configuration: which filter types/facets the end user actually sees exposed in the panel. This is distinct from `filter` (whether a panel shows at all) — `filters` decides its contents.
- **`labelFilterCounts`** (boolean) — show a result count next to each filter option, e.g. *"Product (7)."* End-user effect: a shopper sees at a glance which filters are worth clicking before they click them, instead of discovering a filter returns zero results after the fact.
- **`labelSetsExcludedFromFilters`** (string) — hide specific labelsets from the filter UI even though they exist on the Knowledge Box. Use this for internal-only labelsets a customer-facing (or even a staff-facing, but not curation-facing) widget shouldn't expose — the labelset stays useful for internal querying and reporting, it just never shows up as a clickable facet.

### Pre-scoping — filtering before the user does anything

- **`initialFilters`** (string, optional), **`preselectedFilters`** (string), **`preselectedFilterExpression`** (string) — apply a filter automatically, before the end user interacts with the widget at all. **End-user effect:** a widget embedded on a "Support" page can preselect the support content-type filter so every result is already scoped to support docs — the visitor never has to know a filter exists, let alone set one. This is the single highest-leverage lever in `SearchBoxConfig` for a partner shipping the *same* widget library against *different* pages of the same customer site: one search bar per page, each pre-scoped to that page's content, same underlying Knowledge Box.

### Result content

- **`highlight`** (boolean) — highlight the matched query terms inside result snippets. End-user effect: a shopper scanning a result list can see *why* a result matched at a glance, without reading the whole snippet.
- **`limitParagraphs`** (boolean) + **`paragraphsLimit`** (number, nullable) — cap how many matched paragraphs feed into a result or answer. This is independent of the Search-tab-level RAG strategy tuning from [Build 01](../build-01-tuning-the-search-strategy/)/[Build 03](../build-03-rag-context-strategies/) — those control *which* context gets assembled; this caps *how much* of it a given widget consumes. **End-user effect:** a lower limit means faster, terser answers; too low risks losing relevant context the model actually needed. Treat it as a widget-level speed/completeness dial, tuned per surface rather than per Knowledge Box.

### Query handling

- **`rephraseQuery`** (boolean) — the widget-level equivalent of Build 01's `rephrase: true` API toggle. On/off only: whether the widget rewrites a keyword-shaped query into a better search string before running it.
- **`rephrasePrompt`** (string) — the widget-level equivalent of Build 02's `prompt.rephrase` template. This is the instruction text shaping *how* the rewrite happens, once `rephraseQuery` is on.

> **Gotcha.** Same trap Build 02 already flagged for the API parameters, now showing up as two separate widget fields instead of one prompt object's key: setting `rephrasePrompt` while `rephraseQuery` is off does nothing. There's no rephrase step running for the template to shape. Turn `rephraseQuery` on first; only then does `rephrasePrompt` have any effect.

### Rank fusion

- **`rrfBoosting`** (boolean) — the widget-level toggle for RRF-based rank fusion boosting, the widget-config surface for what Build 01 taught as the `rank_fusion` API parameter.
- **`rrfSemanticBoosting`** — a more granular RRF boosting control confirmed to exist in the SDK model. Its exact behavior isn't fully documented; treat it as a finer dial than `rrfBoosting` for semantic-specific rank weighting, and confirm its effect against your own corpus before relying on it in a customer conversation rather than assuming a precise mechanism.

### Generation scope

- **`generateAnswerWith`** (`only-semantic | semantic-and-full-text`) — which retrieval modes feed the generative answer for this widget. This is a widget-level narrowing of Build 01's `features` parameter: instead of exposing every search mode toggle, the widget gives you exactly two presets for what powers generation specifically.

## Everything else, you already know

Three more sections live inside the same widget configuration object as `SearchBoxConfig`: `GenerativeAnswerConfig`, `ResultDisplayConfig`, and `RoutingConfig`. None of it is new material.

- **`GenerativeAnswerConfig`** is Build 02's prompt/model/reasoning/token-limit surface, exposed as widget-builder toggles instead of `/ask` request fields.
- **`ResultDisplayConfig`** is Build 05's `displayResults`, `showResultType`, `hideAnswer`, `citationThreshold`, and the rest — same fields, dashboard widget form instead of raw API keys.
- **`RoutingConfig`** is Build 05's `useRouting` / `routing.rules` — same `direct_answer` and `generative_model` levers, set through the widget builder.

If you can already set those three from Builds 02 and 05, you can already set them here — the dashboard just swaps the surface. This Build's actual new material is `SearchBoxConfig` above.

## Widget field → API parameter, side by side

The whole course has one underlying configuration model with two surfaces: the dashboard's widget builder, and the raw `/find`/`/ask` parameters a stored `search_configuration` ([Build 00](../build-00-named-search-configurations/)) carries. Same fields, different names in a few cases:

| Widget field (`SearchBoxConfig` etc.) | API parameter you already learned |
|---|---|
| `rephraseQuery` | Build 01's `rephrase` |
| `rephrasePrompt` | Build 02's `prompt.rephrase` |
| `rrfBoosting` / `rrfSemanticBoosting` | Build 01's `rank_fusion` |
| `generateAnswerWith` | Build 01's `features` (narrowed to two presets) |
| `filters` / `preselectedFilterExpression` | Build 01's `filter_expression` |
| `limitParagraphs` / `paragraphsLimit` | Build 03's RAG context-assembly tuning (a consumption cap layered on top) |
| `GenerativeAnswerConfig.*` | Build 02's `prompt`, `generativeModel`, `reasoning`, token-limit fields |
| `ResultDisplayConfig.*` | Build 05's `ResultDisplayConfig` fields, unchanged |
| `RoutingConfig.*` | Build 05's `useRouting` / `routing.rules` |

Once you can read this table fluently in either direction, you can walk a customer through the dashboard and still tell their engineering team exactly what API call it produces — which is the whole point of this course.

## What's next

[Build 08 — Widget Deployment](../build-08-widget-deployment/) — CSS styling, a local no-proxy quick test, the production proxy pattern, and Synchronized configuration (a dashboard edit reaching an already-embedded widget live). This Build was configuration only; Build 08 is getting it onto a real page safely.
