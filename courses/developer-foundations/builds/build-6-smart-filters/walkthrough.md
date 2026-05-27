# Build 6 — Walkthrough: Smart Filters & Labelsets

> Estimated time: 2 hours focused. Read the [lesson](lesson.md) first.

## Goal

A filterable search UI plus a labelset of your own design applied to your KB. Demo the same query producing different results as filters toggle.

## 1. Design one labelset on paper (20 min)

Open `labelset-design.md` in this Build folder. Pick **one** dimension of your KB content and design a labelset for it. Examples:

- `topic`: 6–9 high-level topics covering your corpus.
- `audience`: roles that consume the content (employee, manager, executive, customer).
- `content_type`: editorial categories (how-to, policy, case-study, news).

For each label, write a 1-sentence definition + 2–3 example resource titles from your corpus that would carry it.

5–9 labels max. Map to user intent. No overlap.

## 2. Apply the labels in the Nuclia dashboard (30 min)

In the dashboard:

1. Settings → Labelsets → Create new.
2. Name it (e.g., `topic`).
3. Add the labels you designed.

Then go to each resource you want labelled and assign labels manually. For a 10-document sandbox you can do this by hand in 15 minutes. (For a customer's 10,000-document corpus you'd train a classifier — Advanced course.)

## 3. Verify via `/labelsets` (5 min)

```bash
curl -s -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/labelsets" | jq .
```

Confirm your labelset shows up with the labels.

## 4. Test filter composition via `curl` (15 min)

```bash
# Filter to PDFs only
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"<your query>","filters":["/icon/application/pdf"],"page_size":5}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" | jq '.resources | length'

# Filter to one of your topic labels
curl -s -X POST ... -d '{"query":"<your query>","filters":["/classification.labels/topic/<your-label>"],"page_size":5}' ...

# Compose both
curl -s -X POST ... -d '{"query":"<your query>","filters":["/icon/application/pdf","/classification.labels/topic/<your-label>"]}' ...
```

Note how the result count changes with each filter combination.

## 5. Vibe-code a filterable search UI (40 min)

Brief your AI:

```
Extend the build-3-chat React app (or scaffold a fresh one) with a Search Page
at the route /search.

The page:
1. Has a search input at the top.
2. Has a content-type chip strip below the input:
   ["All", "Videos", "PDFs", "Audio", "Docs"]
   - Clicking a chip sets the content-type filter (icon-path).
3. Has a topic facet sidebar on the left, listing all labels from the
   `topic` labelset (fetched at mount via GET /labelsets).
   - Clicking a topic toggles the topic filter.
4. On query change OR filter change, fires POST /find with:
   - the query string
   - filters: an array combining the selected icon path and any selected topic labels
   - page_size: 10
   - show: ["basic", "values", "origin"]
5. Renders the results: title, top paragraph excerpt, content type icon.

Auth via X-NUCLIA-SERVICEACCOUNT header. Env vars via import.meta.env. Use Tailwind.
```

Save prompt as `prompt-log.md`. Read the AI's output before running.

## 6. Demo filter toggling (10 min)

Run the dev server. Test:

- Search a generic query. Note total results.
- Click "Videos" chip. Re-query. Results should shrink to video resources only.
- Click a topic in the sidebar. Results shrink further.
- Click "All" + clear topic. Back to full result set.

Confirm the filter array is built correctly — open browser DevTools → Network → look at the `/find` request body.

## 7. Record 3-minute demo (10 min)

Record:

1. (30 sec) "Filters are the cheapest precision lever in ARAG. Watch."
2. (45 sec) Search query → show all results.
3. (45 sec) Click Videos chip → results shrink.
4. (45 sec) Click a topic facet → results shrink again to intersection.
5. (15 sec) Close: "Two filter axes, vibe-coded in 40 minutes. Customer's CMO sees this and the procurement timeline shrinks by 3 weeks."

Upload to `#build-clinic-submissions`.

## Verification checklist

- [ ] `labelset-design.md` written with 5–9 labels and rationale.
- [ ] Labelset created and applied to resources in the Nuclia dashboard.
- [ ] `/labelsets` endpoint returns your labelset.
- [ ] `curl` filter composition tested (icon, label, composed).
- [ ] Search UI deployed with content-type chips + topic facet.
- [ ] Filter changes re-query live and shrink results correctly.
- [ ] `prompt-log.md` saved.
- [ ] 3-minute demo recorded.

## Next

[Build 7 — Knowledge Graph 101](../build-7-knowledge-graph/) — typed entity navigation. The Tier 4 surface. The capability no competitor ships.
