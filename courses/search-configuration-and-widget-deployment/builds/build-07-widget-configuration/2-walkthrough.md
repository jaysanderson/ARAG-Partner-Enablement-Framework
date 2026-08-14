# Build 07 — Walkthrough: Widget Configuration

> Estimated time: 1.5 hours focused. Read the [lesson](1-lesson.md) first.

## What you'll build

Two widget variants against your Aurora Outfitters Knowledge Box, each reusing a named search configuration you already created in [Build 05](../build-05-result-display-and-intent-routing/):

- **`aurora-public-search`** — a public search-bar + chat widget for the customer-facing site, built on `shopper_display`, pre-scoped to `product` content, with per-filter result counts and highlighted matches.
- **`aurora-internal-search`** — an internal widget for support/staff use, built on `staff_display`, with the filter panel exposed, a labelset hidden from that panel, and entity-aware autocomplete.

Then you'll use the dashboard's **Widget Builder list view** — not the single-widget configurator — to preview, rename, and duplicate one of them. No CSS, no proxy, no deployment: that's [Build 08](../build-08-widget-deployment/). This Build stops at "the configuration is correct and the live preview proves it."

## What you'll need open

- **Your Progress Agentic RAG dashboard**, Knowledge Box from Foundations Build 0, with the `content_type/` corpus ingested (`ambassador_video`, `brand_story`, `gear_review`, `loyalty_benefit`, `podcast`, `product`, `support`, `trail_guide`).
- The `shopper_display` and `staff_display` named search configurations from [Build 05](../build-05-result-display-and-intent-routing/). If you skipped ahead, recreate them with Build 05 Step 5 before starting here.
- A terminal for one or two `curl` checks (optional but recommended).

---

## Step 1 — Orient in the Widgets section (10 min)

1. Open your Knowledge Box and find the **Widgets** section in the left-hand nav (route pattern `.../[kb]/widgets`).
2. You land on the **Widget Builder list view** — this is the level above the three-pane configurator Foundations Build 2 sent you straight into. If you already have a widget from Build 2, it's listed here.
3. Note the row actions available per widget: **preview**, **rename**, **duplicate**, **delete**, plus a **create new widget** action for the list as a whole.
4. Don't build anything yet. This is the surface you'll return to in Step 4 — a partner managing several widget variants for one customer lives here, not inside a single widget's configurator.

---

## Step 2 — Build the public widget: `aurora-public-search` (30 min)

1. From the list view, **create a new widget**. Name it `aurora-public-search`.
2. Pick **search bar + chat (floating)** as the widget combination — the standard Tier 1 mix from Foundations Build 2.
3. Point the widget at the **`shopper_display`** search configuration ([Build 05](../build-05-result-display-and-intent-routing/)) as its base. Everything `shopper_display` already carries — `showResultType: "citations"`, `displayMetadata: false`, a clean shopper-facing display — comes along automatically; you're layering `SearchBoxConfig` fields on top of it, not rebuilding it.
4. In the search-bar configuration, set:
   - **`preselectedFilterExpression`** (or **`initialFilters`**, whichever your dashboard version surfaces) to scope every query to the `product` content-type label — the same idea as Foundations Build 2's `/n/s/-product-` slug filter, but done through a labelset filter instead of a slug substring, matching Build 01's canonical `/classification.labels/content_type/product` filter path.
   - **`labelFilterCounts`** → on. Watch the live preview: any filter facet still shown now displays a count, e.g. `Product (7)`.
   - **`highlight`** → on. Run a test query in the preview (e.g. *"waterproof boot"*) and confirm the matched terms are visually highlighted inside the result snippets.
5. Leave `filter` off for this widget — a public shopper-facing search bar doesn't need a visible filter panel once you've pre-scoped it; the pre-scoping does the work silently.

**Confirm before moving on:** run a query in the live preview that would normally return trail guides or support docs (e.g. *"return policy"*). It should return nothing, or only product-adjacent matches — the pre-scoping is working. If it isn't, re-check the filter expression against your corpus's actual labelset path (see Getting unstuck).

---

## Step 3 — Build the internal widget: `aurora-internal-search` (30 min)

This variant is for support/staff use — different audience, different needs: a visible filter panel, richer autocomplete, and one labelset staff don't need cluttering their filter UI.

1. Before building the widget, add one small piece of setup: in the dashboard's classification/labelset area, create a labelset called `editorial_status` with a label or two (e.g. `needs_review`) and apply it to one or two resources. This stands in for the kind of internal, content-ops-only labelset a real customer accumulates over time — useful for search and reporting, not something a search UI should ever surface as a clickable facet.
2. Back in the Widgets list view, **create a new widget** named `aurora-internal-search`.
3. Pick **search bar + search results** (no chat needed for this variant — staff want a scannable list, not a conversational surface).
4. Point it at the **`staff_display`** search configuration from Build 05 — the richer `all-resources` display, metadata visible, relations on.
5. In the search-bar configuration, set:
   - **`filter`** → on. Confirm the filter panel now renders in the live preview — this is the difference from `aurora-public-search`, where you left it off.
   - **`labelSetsExcludedFromFilters`** → `editorial_status`. Confirm in the preview that the filter panel still shows `content_type` facets (product, trail_guide, support, and so on) but never shows `editorial_status`, even though the labelset exists on the Knowledge Box.
   - **`autocompleteFromNERs`** → on. Type a partial product or ambassador name into the preview's search input and confirm the suggestions surface recognized entities from the corpus, not just substring matches.
6. Leave this widget unscoped — no `preselectedFilterExpression` — staff need to search the whole Knowledge Box, not one pre-filtered slice of it.

**Confirm before moving on:** the filter panel is visible, `editorial_status` never appears as an option inside it, and autocomplete against a partial entity name (e.g. typing `"terra"` for a product ambassador or product name in your corpus) returns entity-aware suggestions.

---

## Step 4 — Preview, rename, and duplicate through the list view (15 min)

Back to the **Widget Builder list view** from Step 1 — this is the part of the dashboard Foundations Build 2 never showed you.

1. From the list, click **preview** on `aurora-internal-search`. Confirm it opens a preview of the widget as configured, without dropping you into the full editable configurator.
2. **Rename** `aurora-internal-search` to `aurora-staff-search` — a more accurate name for who actually uses it. Confirm the list reflects the new name immediately.
3. **Duplicate** `aurora-staff-search`. The dashboard should produce a copy — something like `aurora-staff-search (copy)` — carrying every field you set in Step 3. Rename the duplicate to `aurora-staff-search-es` and change only its **response language** (the field Foundations Build 2 introduced) to Spanish, leaving every `SearchBoxConfig` field from Step 3 untouched.
4. You now have three widgets in the list: `aurora-public-search`, `aurora-staff-search`, `aurora-staff-search-es`. This is the actual shape of a multi-variant deployment — one Knowledge Box, several widgets, each tuned for a different audience or locale, managed from one list instead of rebuilt from scratch each time.

**Don't delete anything yet** — the verification checklist below checks all three still exist.

---

## Step 5 — Confirm the API-equivalent, optional (10 min)

If you want to see the widget-field-to-API-parameter mapping from the lesson made concrete, run the same pre-scoped query `aurora-public-search` runs, directly against `/ask`, using the `shopper_display` configuration and an inline filter:

```bash
curl -s "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/ask" \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "query": "waterproof boot",
    "search_configuration": "shopper_display",
    "filter_expression": {
      "field": {"prop": "labels", "labelset": "content_type", "label": "product"}
    },
    "highlight": true
  }'
```

Compare the citations/results to what the `aurora-public-search` live preview showed in Step 2. Same underlying call, two surfaces — exactly the table at the end of the lesson.

---

## Getting unstuck

| Symptom | Likely cause | Fix |
|---|---|---|
| Pre-scoped widget still returns trail guides / support docs | Filter expression path doesn't match your corpus's actual labelset | Open a product resource in the dashboard's resource browser, confirm the labelset name is `content_type` and the label is exactly `product`, then re-enter the filter |
| `labelFilterCounts` shows no numbers | The filter panel itself is off (`filter: false`) on that widget | Counts only render next to visible filter options — turn `filter` on if you want to see this, or accept it silently applies for `aurora-public-search` where the panel is intentionally off |
| `editorial_status` still shows up in the internal widget's filter panel | `labelSetsExcludedFromFilters` wasn't saved, or the labelset name doesn't match exactly | Re-check spelling against the labelset name you created in Step 3 — it's a string match |
| Autocomplete against a partial entity name returns nothing extra | `autocompleteFromNERs` needs entities the platform has actually recognized in the corpus | Try a full, well-known product or ambassador name first to confirm the toggle works at all, then narrow to a partial string |
| Duplicate doesn't appear in the list | Dashboard cache/state issue after a long idle session | Hard-refresh (Cmd/Ctrl + Shift + R) and re-check the list |
| `rephrasePrompt` field is greyed out or has no visible effect | `rephraseQuery` is off — see the lesson's gotcha | Turn `rephraseQuery` on first; `rephrasePrompt` only matters once rephrasing is active |
| `staff_display`-based widget doesn't show `relations` even with `relations: true` | No `graph_beta` extraction has run on the Knowledge Box yet (Build 03) | Expected if you haven't done Build 03 — the display switch is correctly on, there's just nothing extracted to show |

---

## Verification checklist

- [ ] `aurora-public-search` built on `shopper_display`, pre-scoped to `product`, `labelFilterCounts` on, `highlight` on — confirmed a non-product query returns nothing.
- [ ] `aurora-staff-search` (renamed from `aurora-internal-search`) built on `staff_display`, filter panel on, `editorial_status` hidden from that panel, `autocompleteFromNERs` on and confirmed against a partial entity name.
- [ ] `aurora-staff-search-es` created via **duplicate**, response language changed to Spanish, every `SearchBoxConfig` field otherwise identical to its source.
- [ ] Used **preview**, **rename**, and **duplicate** from the Widget Builder list view — not just the single-widget configurator.
- [ ] (Optional) Ran the Step 5 `curl` call and matched it against the `aurora-public-search` preview.
- [ ] All three widgets still exist in the list at the end of this walkthrough.

Then take the [Build 07 quiz](3-quiz.md). Pass → start [Build 08](../build-08-widget-deployment/).
