# Build 7 — Walkthrough: Smart Filters & Labelsets

> Estimated time: 2–3 hours focused. Complete Build 6 and read the [lesson](1-lesson.md) first.
>
> **Build 7 layers on Build 6.** You've configured the Labeller agent; now you'll build the UI that consumes its output. Two filter axes — content type and topic — composed into one filterable search page.

## What you'll build

A filterable search UI with:

- A **search input** at the top.
- **Content-type chips** ("All / Videos / PDFs / Audio / Docs") that scope by mimetype.
- A **topic facet sidebar** that lists labels from the labelset you configured in Build 6.
- **Live filtering** — toggling a chip or facet re-runs the query and updates results.

Plus your **own labelset design** (5–9 labels) applied to your KB.

This is the Build that proves *"the cheapest precision lever in ARAG is filters."* Customers consistently underrate how much retrieval improvement they get from a good labelset. Demo this well and the procurement timeline shrinks.

## What you'll need open

- **Your Build 0 KB** with Build 6's Labeller already configured (with a labelset you designed).
- **Your `.env` file**.
- **Your Build 3 React project** (we'll extend it) — or you can scaffold a fresh Vite + React project if you'd rather.
- **Your terminal**.
- **Your editor**.
- **Your AI assistant**.
- **A modern browser**.

If Build 6 isn't configured, **stop and finish Build 6 first**. Build 7 needs the labelset to exist.

---

## Step 1 — Design a richer labelset (20 min)

In Build 6 you created a starter labelset for the Labeller. Now you'll **design with intent** — for the search UI, not just for the agent's sake.

### 1a. Pick one labelset dimension

Open a notes file (`labelset-design.md` in your project folder). Pick **one dimension** that creates the most user value:

- `topic` — 6–9 high-level topics covering your corpus.
- `audience` — roles that consume the content (employee, manager, executive, customer).
- `content_type` — editorial categories (how-to, policy, case-study, news).

> **Tip:** the lesson covers this dimension choice in depth. Pick the one your customer would mention first in a sales conversation. If they say *"we want our customers to filter by content type"* — that's your dimension. If they say *"we want our staff to find what's relevant to their role"* — that's audience.

### 1b. Write the design doc

```markdown
# Labelset design: <name>

Dimension: <topic | audience | content_type>
Why this dimension: <one sentence about the customer value>

Labels:
- <label-1> — <1-sentence definition>
  Examples from corpus: <doc title>, <doc title>
- <label-2> — <1-sentence definition>
  Examples: ...
- ...
```

**Rules:**
- 5–9 labels. Not 30. Too many = poor model accuracy + cluttered UI.
- **No overlap.** Each label should mean something distinct.
- **Maps to user intent.** A user should be able to look at the chip and predict what's behind it.

---

## Step 2 — Update the labelset in the dashboard (15 min)

If your Build 6 labelset already matches your design — skip to Step 3.

Otherwise, open the Nuclia dashboard:

1. **Settings → Labelsets** (or Augmentation → Labeller).
2. Edit your existing labelset to match your `labelset-design.md`.
3. **Re-run the Labeller** if you changed any labels.

**Wait time:** ~1 minute per document for re-classification.

### Verify the labelset

```bash
export NUCLIA_API_URL="<your-url>"
export NUCLIA_KB_ID="<your-kb-id>"
export NUCLIA_API_KEY="<your-jwt>"

curl -s -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/labelsets" | jq .
```

**You should see:** your labelset with all the labels you defined.

---

## Step 3 — Test filter composition with `curl` (15 min)

Before you wire it into a UI, **prove the filter syntax works** with raw `curl` commands. Three patterns:

### 3a. Filter by content type (mimetype icon)

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"your question","filters":["/icon/application/pdf"],"page_size":5,"features":["keyword","semantic"]}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" | jq '{count: (.resources | length), best_matches}'
```

**What that did:** searched for your query, but only among PDFs (the `/icon/application/pdf` filter).

**You should see:** a result count + best_matches list. Compare to running the same query *without* the filter — count should drop.

### 3b. Filter by label

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"your question","filters":["/classification.labels/<labelset>/<label>"],"page_size":5}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" | jq '{count: (.resources | length), best_matches}'
```

**Replace:**
- `<labelset>` → your labelset name (e.g., `topic`).
- `<label>` → one of your labels (e.g., `procedure`).

**You should see:** results scoped to only documents with that label.

### 3c. Compose both filters

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"your question","filters":["/icon/application/pdf","/classification.labels/topic/procedure"],"page_size":5}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find" | jq '{count: (.resources | length)}'
```

**You should see:** results scoped to PDFs **AND** the chosen topic. The result count is usually smaller than either filter alone.

> **Filter syntax recap:**
> - Content type: `/icon/<mimetype>` (e.g., `/icon/application/pdf`, `/icon/video`, `/icon/audio`).
> - Label: `/classification.labels/<labelset-name>/<label-name>`.
> - Multiple filters in the array compose with AND.

### 3d. Save your evidence

Append the three result counts to `labelset-design.md` so reviewers can see the filter math.

---

## Step 4 — Extend the React project (10 min)

If you want to extend Build 3:

```bash
cd ~/Desktop/foundations-build-3
npm run dev
```

Or scaffold a fresh project for Build 7:

```bash
cd ~/Desktop
npm create vite@latest foundations-build-7 -- --template react-ts
cd foundations-build-7
npm install
```

You don't install Tailwind by hand — the AI does it as part of the SearchPage brief in Step 5, same citizen-developer pattern as Build 3.

Create or copy `.env` with your three `VITE_NUCLIA_*` credentials.

We'll add a new component, `SearchPage.tsx`, that the AI builds.

---

## Step 5 — Vibe-code the filterable search page (50 min)

This is the meaty step. Brief your AI:

```
In my Vite + React + TypeScript project, create
src/components/SearchPage.tsx and route it (or render it from App.tsx).

If Tailwind isn't already set up in this project, install and configure
it as your first step: install tailwindcss, postcss, autoprefixer; run
`npx tailwindcss init -p`; set the tailwind.config.js content array to
["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]; replace src/index.css
with the three @tailwind directives (base, components, utilities).
Claude Code / Cursor: do this directly. ChatGPT / Claude.ai web: emit
the commands + file contents precisely so I can paste them.

Then create the page. It's a search-and-filter page with this layout:

  [search input]   <- top, full width
  ─────────────────
  [content-type chip strip]   <- horizontal row below input
  ─────────────────
  [topic facets sidebar]  [results list]   <- two columns

Specifics:

1. Search input at top. State: const [query, setQuery] = useState("").
   When the user presses Enter or stops typing for 500ms (debounce),
   re-fetch results.

2. Content-type chips (a horizontal row): "All", "Videos", "PDFs",
   "Audio", "Docs". State: const [contentType, setContentType] =
   useState<string | null>(null). Click a chip → set the active
   contentType. Click again → clear.
   - "All" → no filter
   - "Videos" → "/icon/video"
   - "PDFs" → "/icon/application/pdf"
   - "Audio" → "/icon/audio"
   - "Docs" → "/icon/application/vnd.openxmlformats-officedocument.wordprocessingml.document" or similar

3. On mount, fetch GET /labelsets and extract the labelset named "topic"
   (or whatever labelset name I configured — make this a constant at
   top of file). State: const [topicLabels, setTopicLabels] = useState<string[]>([]).

4. Topic facets sidebar (left column): a list of toggle buttons, one
   per label in topicLabels. State: const [activeTopics, setActiveTopics] =
   useState<string[]>([]). Clicking a topic toggles it in/out of the
   array. Highlight active topics with Tailwind classes.

5. When query, contentType, or activeTopics change, fire POST /find with:
   {
     query,
     page_size: 10,
     features: ["keyword", "semantic"],
     show: ["basic", "values", "origin"],
     filters: [
       ...(contentType ? [contentType] : []),
       ...activeTopics.map(label => `/classification.labels/topic/${label}`)
     ]
   }

6. Auth: X-NUCLIA-SERVICEACCOUNT: Bearer ${import.meta.env.VITE_NUCLIA_API_KEY}.
   URL: ${import.meta.env.VITE_NUCLIA_API_URL}/kb/${import.meta.env.VITE_NUCLIA_KB_ID}/find

7. Render the results in the right column:
   - One card per resource
   - Card shows: title, top paragraph excerpt (truncated to ~200 chars),
     small content-type icon, and any classifications under the resource.

8. Use Tailwind for styling. Loading state ("Searching...") while
   a request is in flight. Error state if the API fails.

Use plain fetch. No SDK.
```

Send.

### 5a. Save the AI's output

- **Claude Code / Cursor:** *"Save this as src/components/SearchPage.tsx. Update App.tsx to render it as the main page."*
- **Web chat:** create the file in VS Code; manually update `App.tsx` to import and render `<SearchPage />`.

### 5b. Read the code before running

Four checks:

1. **Filter composition** — look at the `/find` POST body. It builds the `filters` array conditionally from `contentType` + `activeTopics`. Confirm the syntax (the labelset filter has the `/classification.labels/<labelset>/<label>` prefix).
2. **Auth header** is `X-NUCLIA-SERVICEACCOUNT`.
3. **Labelset fetch on mount** uses `GET /labelsets` and extracts the right labelset name.
4. **No SDK** — uses `fetch`.

If anything's off, tell the AI to fix.

### 5c. Save your prompt

Create `prompt-log.md` in the project root. Paste the Step 5 brief.

---

## Step 6 — Test the UI (15 min)

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:5173/`. **You should see:**

- A search input at top.
- A row of content-type chips.
- A list of topic facets in the left column (fetched from your labelset).
- An empty results area (or a "type a query" prompt).

### Test sequence

1. Type a generic query. Press Enter. **You should see** results appear.
2. Click the **PDFs** chip. **You should see** results shrink to PDFs.
3. Click a topic in the sidebar. **You should see** results shrink further (intersection of PDF + that topic).
4. Click another topic. If your UI supports multi-select, results expand (PDF + topic1 OR topic2 — depends on how you wire it). For Build 7 it's fine if it's AND.
5. Click **All** (or clear contentType). **You should see** results expand back to all content types within the topic.
6. Clear all topics. **You should see** results return to the full query result set.

Open browser **DevTools → Network** and click each `/find` request as you toggle filters. **The request body's `filters` array** should reflect exactly what's selected in the UI. If it doesn't, the AI's wiring is off.

### Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Topic sidebar is empty | Labelset name in code doesn't match dashboard | Open `SearchPage.tsx`, find the labelset-name constant, fix it |
| Clicking chips does nothing | `useEffect` doesn't depend on `contentType`/`activeTopics` | Tell AI: *"Toggling filter chips doesn't refetch. Add the filter state to the useEffect dependency array."* |
| Same results regardless of filters | Filter array isn't being passed in request body | DevTools → Network → check request body |
| 401/403 errors | Wrong JWT or expired | Re-paste from dashboard into `.env`. Restart `npm run dev` |
| Slow when typing fast | No debounce | Tell AI: *"Add a 500ms debounce on the search input."* |

---

## Step 7 — Demo a side-by-side compare (15 min)

Optional but powerful. Open **two browser tabs** to your `/search` page:

- Tab 1: no filters applied.
- Tab 2: PDFs + one topic.

Run the **same query** in both. Show side-by-side how filters change the result set.

Take a screenshot. Save it as `filter-compare.png` in your project folder.

---

## Step 8 — Write a 2-minute demo script (15 min)

Open your AI:

```
Write me a 2-minute demo script for a sales rep showing customers
the filterable search UI. Story:

0:00–0:20 — Hook:
  "Filters are the cheapest precision lever in ARAG. They take
   one engineer one afternoon. Watch what they do to result quality."

0:20–0:50 — Full results:
  Search a query. Show all results. Narrate the count and
  the diversity of content types.

0:50–1:30 — Content type filter:
  Click PDFs. Results shrink. Narrate:
  "Same query. Filtered to PDF policy docs only. Notice how the
   irrelevant marketing content disappears."

1:30–1:50 — Topic facet:
  Click a topic. Results shrink further. Narrate:
  "Two filter axes composed. The customer's content team designed
   this taxonomy; the labeller agent applied it. We just expose it."

1:50–2:00 — Close:
  "Two filter axes, one afternoon. Procurement just got 3 weeks faster."

Format: markdown with timing headings + specific narration text
for each beat.
```

Save as `demo-script.md`.

---

## Verification checklist

- [ ] `labelset-design.md` written with 5-9 labels + 1-sentence definitions + corpus examples.
- [ ] Labelset configured in dashboard; visible at `GET /labelsets`.
- [ ] `curl` filter composition tested — content-type, label, composed (all three work).
- [ ] `src/components/SearchPage.tsx` running with search + chips + topic facets.
- [ ] Toggling chips visibly shrinks/expands results.
- [ ] Filter changes re-query live (you can see new `/find` requests in DevTools).
- [ ] `demo-script.md` saved.
- [ ] `prompt-log.md` saved.

Then take the [Build 7 quiz](3-quiz.md). Pass → start [Build 8](../build-08-knowledge-graph/).

---

## Getting unstuck

**Topic facets sidebar is empty even though `/labelsets` works in curl.**
- The component fetched the wrong labelset name. Open `SearchPage.tsx`, find the constant (e.g., `const LABELSET_NAME = "topic"`), confirm it matches the dashboard.
- Or the fetch ran before `.env` loaded — confirm `VITE_NUCLIA_*` are present and Vite was restarted after they were added.

**Filter array missing from request body.**
- DevTools → Network → `/find` request → Payload. If the `filters` array isn't present or is empty, the AI didn't wire the state correctly. Tell AI: *"The /find request body's filters array isn't being populated from the active chips. Fix the request builder."*

**Some content-type chips return 0 results.**
- Your corpus might not have that content type. Try a content type you know is present.

**Topic facet click doesn't toggle.**
- The `setActiveTopics` updater may be mutating the existing array (React gotcha). Tell AI: *"Toggling a topic doesn't update the array. Use functional state update with `[...prev, label]` or `prev.filter(...)`."*

**Search is laggy when typing.**
- No debounce. Tell AI: *"Add a 500ms debounce on the query state before firing /find."*

**Anything else.**
- Copy DevTools network log + browser console errors.
- Paste into AI with: *"My filter UI does X but should do Y. Fix."*

---

## Next

[Build 8 — Knowledge Graph 101](../build-08-knowledge-graph/) — the Tier-4 surface. Typed entity navigation that no competitor ships. You'll wire the Graph agent's output from Build 6 into a navigable graph viewer.
