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
- **Your editor**.
- **Your AI assistant**.
- **A modern browser** — Steps 1–3 are entirely dashboard-driven (no terminal). Steps 4+ vibe-code the UI.
- **A terminal** — only if you take the optional Power-user paths in Step 3 (Mac/Linux). Windows `cmd` and PowerShell handle single-quoted JSON differently from bash, so the curl paths are Mac/Linux only.

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

**Dashboard path (recommended, works on any OS):**

1. In the Nuclia dashboard, open **KB → Labelsets** (left nav).
2. You should see your labelset listed with all the labels you defined.
3. Click the labelset name to expand the labels and confirm the values match your design.

<details>
<summary><strong>Power-user path: same check via curl</strong> (Mac/Linux only — Windows users use the dashboard)</summary>

```bash
export NUCLIA_API_URL="<your-url>"
export NUCLIA_KB_ID="<your-kb-id>"
export NUCLIA_API_KEY="<your-jwt>"

curl -s -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/labelsets"
```

Returns raw JSON containing your labelset and labels.

</details>

---

## Step 3 — Test filter composition (15 min)

Before you wire it into a UI, **prove the filter syntax works**. Three patterns to test — content type, label, and both composed.

> **Why dashboard-first this time?** The filter API takes a JSON body. Windows `cmd` doesn't strip single quotes around `-d '{...}'` the way bash does, so a copy-pasted curl command ships malformed JSON and Nuclia replies with *"JSON decode error · Expecting value"*. The dashboard's Search panel has a filter UI that builds the same query without any shell-quoting hazard. The curl paths below are preserved for Mac/Linux power users.

### 3a. Filter by content type (mimetype icon)

**Dashboard path:**

1. Open your KB's **Search & Ask** (or **Try the API** / **Playground**) panel.
2. Type a question your corpus can answer.
3. In the filters area, add a **mimetype filter**: `/icon/application/pdf` (or whatever the dashboard's filter builder calls it — wording varies; look for "content type", "mimetype", or "icon").
4. Submit. Note the result count.
5. **Remove the filter** and re-submit the same query. Note the new (larger) result count.

**You should see:** the filtered count is smaller than the unfiltered count. That's the filter working.

<details>
<summary><strong>Power-user path: same check via curl</strong> (Mac/Linux only)</summary>

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"your question","filters":["/icon/application/pdf"],"page_size":5,"features":["keyword","semantic"]}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find"
```

Returns raw JSON. Scroll for the `resources` object — the number of keys is your result count; the `best_matches` array shows the ranked resource IDs.

**Why this curl will fail on Windows cmd:** cmd doesn't process single quotes the way bash does — the `'{...}'` body arrives at Nuclia as garbage and you get *"JSON decode error"*. Either use PowerShell with backtick-escaped double quotes, or save the JSON body to a file and use `-d @body.json`, or just use the dashboard path above.

</details>

### 3b. Filter by label

**Dashboard path:**

1. In the **Search & Ask** panel, add a **label filter** instead of a mimetype filter. The dashboard's filter builder lets you pick a labelset (e.g., `topic`) and a label (e.g., `procedure`).
2. Submit your query.
3. **You should see:** results scoped to only documents with that label.

The wire-format filter path is `/classification.labels/<labelset>/<label>` — useful to know for the React UI you'll vibe-code in Step 5, but you don't need to type it directly here.

<details>
<summary><strong>Power-user path: same check via curl</strong> (Mac/Linux only)</summary>

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"your question","filters":["/classification.labels/<labelset>/<label>"],"page_size":5}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find"
```

Replace `<labelset>` with your labelset name (e.g., `topic`) and `<label>` with one of your labels (e.g., `procedure`).

</details>

### 3c. Compose both filters

**Dashboard path:**

1. In the Search & Ask panel, add **both** a mimetype filter (e.g., `/icon/application/pdf`) **and** a label filter (e.g., `topic/procedure`).
2. Submit.
3. **You should see:** results scoped to PDFs **AND** the chosen topic. The result count is usually smaller than either filter alone.

This proves the AND-composition behaviour the lesson covered. In your React UI you'll let the user toggle chips that map to these same filter paths.

<details>
<summary><strong>Power-user path: same check via curl</strong> (Mac/Linux only)</summary>

```bash
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"your question","filters":["/icon/application/pdf","/classification.labels/topic/procedure"],"page_size":5}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/find"
```

</details>

> **Filter syntax recap** (you'll reuse this in the React UI):
> - Content type: `/icon/<mimetype>` (e.g., `/icon/application/pdf`, `/icon/video`, `/icon/audio`).
> - Label: `/classification.labels/<labelset-name>/<label-name>`.
> - Multiple filters in the array compose with AND.

### 3d. Save your evidence

Append the three result counts (3a, 3b, 3c) to `labelset-design.md` so reviewers can see the filter math. Screenshots of the dashboard's Search panel with each filter combination are also fine.

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

You don't install styling tooling by hand — the AI picks and configures it as part of the SearchPage brief in Step 5, same citizen-developer pattern as Build 3.

Create or copy `.env` with your three `VITE_NUCLIA_*` credentials.

We'll add a new component, `SearchPage.tsx`, that the AI builds.

---

## Step 5 — Vibe-code the filterable search page (50 min)

This is the meaty step. Brief your AI:

```
In my Vite + React + TypeScript project, create
src/components/SearchPage.tsx and route it (or render it from App.tsx).

Pick a styling approach that fits a clean, modern search UI and set it
up if it isn't already wired in (Claude Code / Cursor: do the setup
directly; ChatGPT / Claude.ai web: emit the exact commands + file
contents so I can paste them).

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
   array. Style active topics so they're visually distinct.

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

8. Style the whole page for a clean, modern feel — clear hierarchy,
   readable type, hover states on chips and facets. Loading state
   ("Searching...") while a request is in flight. Error state if the
   API fails.

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

## Key Takeaways

- **Filters are the cheapest precision lever in ARAG.** One labelset, one afternoon's design work, one filter array on `/find` — and you've shrunk a noisy 50-result list to a focused 8. Customers feel the difference immediately; the engineering cost is negligible.
- **Filter composition stacks.** Three filters in one `filters` array (`content_type`, `audience`, `region` for example) compose with AND semantics inside one labelset and OR semantics across labels at the same level. You'll use stacked filters in every production engagement.
- **Labelset design is its own discipline.** 5-9 labels per labelset, definitions partners agree on, no overlapping semantics, no exhaustive enumeration. Bad labelset design surfaces months later when a customer says *"we can't tell `policy` from `procedure` apart"* — at that point the corpus is tagged wrong and re-labelling is expensive. Do the design first, ship second.
- **Smart-default filters are the partner's quiet win.** Pre-filtering by the user's profile (`region:emea` for an EMEA user; `audience:trail_club_pro` for a logged-in member) is a one-line change that customers don't notice but recommend-to-others quality lifts 30-50% on.
- **Chips are just labelsets exposed as buttons.** The UI affordance is downstream of the data model. Once labelsets are designed right, the chip UI is half a day of vibe coding (Build 7's walkthrough). Wrong labelsets — you can't paper over with UI.
- **Filters are the security boundary that prefixes aren't (Build 4).** When a customer says *"prospects must never see member content,"* the answer is a `audience:shopper` filter on the server, not a `"You are a prospect"` prefix on the prompt. Builds 4 and 7 together tell the full *prefix-for-voice / filter-for-scope* story.

---

## Verification checklist

- [ ] `labelset-design.md` written with 5-9 labels + 1-sentence definitions + corpus examples.
- [ ] Labelset configured in dashboard; visible at `GET /labelsets`.
- [ ] `curl` filter composition tested — content-type, label, composed (all three work).
- [ ] `src/components/SearchPage.tsx` running with search + chips + topic facets.
- [ ] Toggling chips visibly shrinks/expands results.
- [ ] Filter changes re-query live (you can see new `/find` requests in DevTools).
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
