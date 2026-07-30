# Build 8 — Walkthrough: Knowledge Graph 101

> Estimated time: 3–4 hours focused. Complete Build 6 and read the [lesson](1-lesson.md) first.
>
> **This is the Tier-4 demo Build.** It's also the most visually impressive output in the course. The graph viewer is the kind of thing customers screenshot and put in board decks.

## What you'll build

A **graph viewer page** that:

- Shows the typed entities + relations the Graph agent extracted in Build 6.
- Has a **fuzzy search** to find entities by name.
- Lets you **click an entity to expand its connections** (the merge-as-you-go pattern).
- Shows a **right sidebar** with the selected entity's paths and related document hits.
- Applies the `data-augmentation` filter throughout, so you never see ARAG's default NER noise.

By the end, you'll have answered at least one **graph-only question** — a question that single-shot retrieval *cannot* answer, only graph traversal can. That's the Tier-4 demo moment.

## What you'll need open

- **Your Build 6 KB** with the Graph agent configured (entity types + relation types defined; extraction run; `/graph` returns paths with the data-augmentation filter).
- **Your Build 3 React project** (we'll extend it) or scaffold fresh.
- **Your `.env` with VITE_NUCLIA_* credentials**.
- **Your terminal**, editor, AI assistant, browser.

**If `/graph` returns `{"paths": []}` for you** — your Graph agent didn't extract anything, or you didn't configure it in Build 6. Stop and finish Build 6 first. Build 8 is read-only against an empty graph; the demo won't land.

---

## Step 1 — Verify your graph is populated (15 min)

### 1a. Confirm extraction happened

```bash
export NUCLIA_API_URL="<your-url>"
export NUCLIA_KB_ID="<your-kb-id>"
export NUCLIA_API_KEY="<your-jwt>"

curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":{"and":[{"prop":"path"},{"prop":"generated","by":"data-augmentation"}]},"top_k":20}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/graph"
```

**You should see:** raw JSON. Scroll for the `paths` array — it should have entries (ideally 5–20+ depending on corpus size). If it's `"paths": []`, see the troubleshooting below.

If 0:
1. Go back to your Progress Agentic RAG dashboard. Check the Graph agent's run history — did extraction complete?
2. If it ran and you still see 0, your entity/relation schema may be too restrictive for your corpus. Loosen the entity types (use more generic ones like `PERSON`, `ORGANIZATION`, `CONCEPT`) and re-run.

### 1b. Confirm the filter excludes NER noise

```bash
# UNFILTERED query — shows default NER (DATE, ORG, MONEY, etc.)
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":{"prop":"path"},"top_k":20}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/graph"

# FILTERED query — only your custom entity types
curl -s -X POST \
  -H "X-NUCLIA-SERVICEACCOUNT: Bearer $NUCLIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":{"and":[{"prop":"path"},{"prop":"generated","by":"data-augmentation"}]},"top_k":20}' \
  "$NUCLIA_API_URL/kb/$NUCLIA_KB_ID/graph"
```

**You should see:** scroll the two responses and compare the `source.group` values that appear across `paths[]`. The filtered version contains only your custom entity types (e.g., `PERSON`, `PRODUCT`, `ORGANIZATION`). The unfiltered version mixes those with default NER groups (`DATE`, `MONEY`, `ORG`, ...).

**Save the difference to `graph-evidence.md`** in a Build 8 project folder. Reviewers want to see this — it proves you understand the filter.

---

## Step 2 — Set up the Build 8 project (10 min)

You can extend Build 3 or scaffold fresh. We recommend fresh for this Build because the graph viewer is a substantial component.

```bash
cd ~/Desktop/developer-foundations
npm create vite@latest build-8 -- --template react-ts
cd build-8
npm install
```

You don't install Tailwind by hand for Build 8 — the AI does it as part of the graph-viewer brief in Step 3, the same citizen-developer pattern Build 3 uses.

Create `.env`:

```bash
VITE_NUCLIA_API_URL=...
VITE_NUCLIA_KB_ID=...
VITE_NUCLIA_API_KEY=...
```

Install the graph visualisation library:

```bash
npm install react-force-graph-2d
```

**What that did:** installed a React wrapper around a popular force-directed graph rendering library. You don't need to know how it works — the AI will use it.

> **Alternative:** if you prefer Cytoscape, use `npm install cytoscape react-cytoscapejs`. We use react-force-graph in the brief below; tell the AI to use whichever you installed.

> **No-npm path** (see the [vibe-coding guide](../../vibe-coding-guide.md#npm-or-no-npm-pick-the-path-that-fits-your-machine)). Build this as one self-contained `index.html` — no Vite, no install. Load React + Tailwind from a CDN (esm.sh + cdn.tailwindcss.com) as in Build 3, and load the graph library from the same CDN: `import ForceGraph2D from "https://esm.sh/react-force-graph-2d"`. Put the `graphClient` functions (Step 3) and the graph-viewer component (Step 4) inline in one `<script type="module">`, with credentials in a `CONFIG` object at the top instead of `.env`. Open `index.html` in your browser (or serve with `python3 -m http.server`). If a CDN-loaded graph library gives trouble, tell the AI to render a simple SVG/canvas force layout directly — the teaching point is the graph *data* (`/graph` paths), not the rendering library.

---

## Step 3 — Vibe-code the graph client (40 min)

This is the data layer — four functions that call the ARAG graph endpoints.

### 3a. Brief your AI

**On the npm path?** Paste **exactly**:

```
In my Vite + React + TypeScript project, create src/lib/graphClient.ts.

Export FOUR async functions, each using plain fetch with the
X-NUCLIA-SERVICEACCOUNT: Bearer ${import.meta.env.VITE_NUCLIA_API_KEY}
header and Content-Type: application/json.

Base URL: ${import.meta.env.VITE_NUCLIA_API_URL}/kb/${import.meta.env.VITE_NUCLIA_KB_ID}

1. queryNodesByGroup(group: string): Promise<Node[]>
   - POST to /graph/nodes
   - Body: { query: { prop: 'node', group }, top_k: 500 }
   - Returns the `.nodes` array
   - Apply client-side filter (see below)

2. queryFuzzyNodes(value: string): Promise<Node[]>
   - POST to /graph/nodes
   - Body: { query: { prop: 'node', value, match: 'fuzzy' }, top_k: 50 }
   - Returns the `.nodes` array
   - Apply client-side filter

3. queryPaths(node: { value: string; group: string }): Promise<Path[]>
   - POST to /graph
   - Body: {
       query: {
         and: [
           { prop: 'path', source: node, undirected: true },
           { prop: 'generated', by: 'data-augmentation' }
         ]
       },
       top_k: 100
     }
   - Returns the `.paths` array
   - For each path, apply the client-side filter to source AND destination;
     drop paths whose endpoints fail the filter

4. searchRelatedResources(entityValue: string): Promise<Resource[]>
   - POST to /find
   - Body: { query: entityValue, features: ['keyword', 'semantic'], page_size: 8, show: ['basic','values','origin'] }
   - Returns the `.resources` object as an array of { id, title, excerpt }

CLIENT-SIDE FILTER (applied to nodes):
  Reject any node where:
  - value matches a GUID-shaped pattern (a long hex string, 20+
    characters, no dashes)
  - group is one of these default NER groups:
    [DATE, ORG, PERSON, MONEY, GPE, LOC, TIME, EVENT, NORP,
     WORK_OF_ART, LAW, LANGUAGE, QUANTITY, ORDINAL, CARDINAL, PERCENT]
  Otherwise accept.

Export TypeScript interfaces for Node, Path, Resource.

No SDK. Plain fetch only.
```

**On the no-npm path?** Paste this instead — same four functions, inside your single `index.html`:

```
In my single self-contained index.html, add a graphClient section to the
main <script type="module"> block, near the CONFIG object.

Define FOUR async functions, each using plain fetch with the
X-NUCLIA-SERVICEACCOUNT: Bearer ${CONFIG.apiKey} header and
Content-Type: application/json.

Base URL: ${CONFIG.apiUrl}/kb/${CONFIG.kbId}

1. queryNodesByGroup(group)
   - POST to /graph/nodes
   - Body: { query: { prop: 'node', group }, top_k: 500 }
   - Returns the `.nodes` array
   - Apply client-side filter (see below)

2. queryFuzzyNodes(value)
   - POST to /graph/nodes
   - Body: { query: { prop: 'node', value, match: 'fuzzy' }, top_k: 50 }
   - Returns the `.nodes` array
   - Apply client-side filter

3. queryPaths(node)  // node = { value, group }
   - POST to /graph
   - Body: {
       query: {
         and: [
           { prop: 'path', source: node, undirected: true },
           { prop: 'generated', by: 'data-augmentation' }
         ]
       },
       top_k: 100
     }
   - Returns the `.paths` array
   - For each path, apply the client-side filter to source AND destination;
     drop paths whose endpoints fail the filter

4. searchRelatedResources(entityValue)
   - POST to /find
   - Body: { query: entityValue, features: ['keyword', 'semantic'], page_size: 8, show: ['basic','values','origin'] }
   - Returns the `.resources` object as an array of { id, title, excerpt }

CLIENT-SIDE FILTER (applied to nodes):
  Reject any node where:
  - value matches a GUID-shaped pattern (a long hex string, 20+
    characters, no dashes)
  - group is one of these default NER groups:
    [DATE, ORG, PERSON, MONEY, GPE, LOC, TIME, EVENT, NORP,
     WORK_OF_ART, LAW, LANGUAGE, QUANTITY, ORDINAL, CARDINAL, PERCENT]
  Otherwise accept.

Plain JavaScript — no TypeScript, no SDK, no new files. Stay inside the
same index.html.
```

Send.

### 3b. Save the output

- **npm path, Claude Code / Cursor:** *"Save this as src/lib/graphClient.ts."*
- **npm path, web chat:** create the file, paste, save.
- **No-npm path:** ask the AI to edit `index.html` directly, or paste the updated `<script>` block back into your editor and save.

### 3c. Read the code

Four checks:

1. Each function uses `fetch` with the right URL and the data-augmentation filter in path queries.
2. The client-side filter is **applied** in each function (it's easy to forget — search for the GUID regex and the NER list).
3. Auth header is `X-NUCLIA-SERVICEACCOUNT`.
4. TypeScript interfaces exported.

### 3d. Quick smoke test

**npm path:** add this to `App.tsx` temporarily:

```tsx
import { useEffect } from 'react';
import { queryPaths } from './lib/graphClient';

function App() {
  useEffect(() => {
    // Pick any entity from your /graph response — copy a real value + group
    queryPaths({ value: "PASTE_REAL_ENTITY_VALUE", group: "PASTE_REAL_GROUP" })
      .then(paths => console.log("Paths:", paths))
      .catch(err => console.error(err));
  }, []);
  return <div>Check browser console.</div>;
}
export default App;
```

Run `npm run dev`. Open the page. Open DevTools → Console. **You should see** a paths array logged.

**No-npm path:** open `index.html` in your browser, open DevTools → Console, and run:

```js
queryPaths({ value: "PASTE_REAL_ENTITY_VALUE", group: "PASTE_REAL_GROUP" })
  .then(paths => console.log("Paths:", paths))
  .catch(err => console.error(err));
```

(If `queryPaths` isn't reachable from the console, ask your AI to temporarily add `window.queryPaths = queryPaths` for testing, then remove that line afterward.)

If you see 0 paths but `curl` returned paths, the AI's filter is over-rejecting. Tell AI: *"The client filter rejects too much. My curl returned 20 paths; my queryPaths returns 0. Make the filter less aggressive — only reject GUID-shaped values and exact default NER groups."*

### 3e. Save prompt log

Create `prompt-log.md`. Add the Step 3 brief.

---

## Step 4 — Vibe-code the GraphPage component (60 min)

This is the visual centrepiece. The brief tells the AI to install + configure Tailwind first (same citizen-developer pattern as Build 3), then build the component.

**On the npm path?** Brief your AI:

```
Create src/pages/GraphPage.tsx.

Before writing the component, set up Tailwind CSS in this Vite + React +
TypeScript project: install tailwindcss, postcss, autoprefixer; run
`npx tailwindcss init -p`; set the tailwind.config.js content array to
["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]; replace src/index.css
with the three @tailwind directives (base, components, utilities).
Claude Code / Cursor: do this directly. ChatGPT / Claude.ai web: emit
the commands + file contents precisely so I can paste them.

Layout (Tailwind):
  [ fuzzy search input + autocomplete chips ]   <- top
  ┌────────────────────────────────┬─────────────────────┐
  │                                │                     │
  │   Force-directed graph         │   Right sidebar     │
  │   visualization (center)       │   (selected entity  │
  │                                │    detail)          │
  │                                │                     │
  └────────────────────────────────┴─────────────────────┘

Top bar:
- A text input. State: const [search, setSearch] = useState("").
- On change (debounced 300ms), call queryFuzzyNodes(search).
- Show up to 10 matching nodes as clickable chips below the input.
- Clicking a chip selects that node (see below).

Graph viz (use react-force-graph-2d):
- State: const [graphData, setGraphData] = useState({ nodes: [], links: [] }).
- On mount, fetch all nodes for a default group (e.g., your first entity
  type — make this a constant at top of file) and populate graphData.
- Each node has: id (composite key of value + group), value, group, color.
- Each link has: source, target, label (relation type).
- Color nodes by group using a palette of 8 distinct colors
  (auto-assign as new groups are encountered).

Selection state:
- const [selected, setSelected] = useState<Node | null>(null).
- Clicking a chip OR a graph node sets selected.
- On select:
    1. Fetch queryPaths(selected) -> expands graphData (merge new nodes
       and edges, dedupe by composite key).
    2. Fetch searchRelatedResources(selected.value) -> show in sidebar.

Right sidebar:
- If selected is null, show "Click an entity to see details."
- If selected is set, show:
    - Entity name + group badge (colored chip).
    - Section "Paths" — group paths by relation type. For each,
      list "<source> -[relation]-> <destination>".
    - Section "Related resources" — list resource cards with title
      and excerpt.

Use Tailwind for styling. TypeScript. Loading states everywhere
data is being fetched.

The graph viz library is react-force-graph-2d. Refer to its README
for the node/link data shape if needed.
```

**On the no-npm path?** Paste this instead — same layout and logic, inside your single `index.html`:

```
In my single self-contained index.html, add a GraphPage component and
render it as the main page.

Tailwind and the graph library are already loaded from CDN in this file
(cdn.tailwindcss.com, and https://esm.sh/react-force-graph-2d) — use
them directly, no install step.

Layout (Tailwind):
  [ fuzzy search input + autocomplete chips ]   <- top
  ┌────────────────────────────────┬─────────────────────┐
  │                                │                     │
  │   Force-directed graph         │   Right sidebar     │
  │   visualization (center)       │   (selected entity  │
  │                                │    detail)          │
  │                                │                     │
  └────────────────────────────────┴─────────────────────┘

Top bar:
- A text input. State: search, default "".
- On change (debounced 300ms), call queryFuzzyNodes(search).
- Show up to 10 matching nodes as clickable chips below the input.
- Clicking a chip selects that node (see below).

Graph viz (use react-force-graph-2d):
- State: graphData, default { nodes: [], links: [] }.
- On mount, fetch all nodes for a default group (e.g., your first entity
  type — make this a constant near the top of the script) and populate
  graphData.
- Each node has: id (composite key of value + group), value, group, color.
- Each link has: source, target, label (relation type).
- Color nodes by group using a palette of 8 distinct colors
  (auto-assign as new groups are encountered).

Selection state:
- State: selected, default null.
- Clicking a chip OR a graph node sets selected.
- On select:
    1. Fetch queryPaths(selected) -> expands graphData (merge new nodes
       and edges, dedupe by composite key).
    2. Fetch searchRelatedResources(selected.value) -> show in sidebar.

Right sidebar:
- If selected is null, show "Click an entity to see details."
- If selected is set, show:
    - Entity name + group badge (colored chip).
    - Section "Paths" — group paths by relation type. For each,
      list "<source> -[relation]-> <destination>".
    - Section "Related resources" — list resource cards with title
      and excerpt.

Use Tailwind for styling. Plain JavaScript — no TypeScript. Loading
states everywhere data is being fetched. Stay inside the same
index.html — no new files.

If the CDN-loaded graph library gives trouble, render a simple
SVG/canvas force layout directly — the teaching point is the graph
*data*, not the rendering library.
```

Send.

### 4a. Save the output

- **npm path, Claude Code / Cursor:** *"Save this as src/pages/GraphPage.tsx. Update App.tsx to render it."*
- **npm path, web chat:** create the file. Update `App.tsx` manually to import and render `<GraphPage />`.
- **No-npm path:** ask the AI to edit `index.html` directly, or paste the updated `<script>` block back into your editor and save.

### 4b. Read the code

Three checks:

1. **Merge dedupe:** when paths are merged into `graphData`, nodes are deduped by a composite key (`value + group`). Otherwise the graph fills with duplicates.
2. **Initial group** — the AI hardcoded an entity type at the top. Confirm it matches one of *your* entity types from Build 6.
3. **Filter never bypassed** — every call to `queryPaths` should pass through the client-side filter from `graphClient`.

### 4c. Run it

**npm path:**

```bash
npm run dev
```

**No-npm path:** reload `index.html` in your browser (or the localhost URL if you're serving it with `python3 -m http.server`).

Open the URL. **You should see:**

- A search input at top.
- A graph visualisation in the centre with some nodes (depending on initial group).
- An empty sidebar saying "Click an entity to see details."

### 4d. Update prompt log

---

## Step 5 — Test the navigation (25 min)

Test each interaction:

### 5a. Fuzzy search

1. Type the first 3 letters of a known entity in your corpus (e.g., an organisation name).
2. **You should see** matching chips appear below.
3. Click one. **You should see** the entity appear in the graph (if not already) and the sidebar populate.

### 5b. Click to expand

1. Click any node in the graph.
2. **You should see** new nodes and edges merge into the visualisation (the selected entity's neighbours appear).
3. The sidebar populates with paths grouped by relation type + related resources.

### 5c. No NER noise

Look at all nodes visible. **No node should have a group of `DATE`, `MONEY`, `ORG`, `PERSON` (the default NER one)** — only your custom entity types.

If you see NER noise, the client filter isn't being applied to the paths query. Tell AI: *"NER nodes (group: DATE, MONEY, ORG) are appearing in the graph. The client-side filter isn't being applied to queryPaths' results. Fix."*

### 5d. Related resources

The sidebar's "Related resources" section uses **hybrid retrieval** (the `searchRelatedResources` function calls `/find`). It bridges the structured graph back to the unstructured documents. This is a subtle Tier-4 unlock — narrate it in your demo.

---

## Step 6 — Handle leaf nodes with queryPathsAround (20 min)

Step 3 gave you `queryPaths` — an outbound-only `/graph` query. It works for hubs. It silently returns empty for **leaf nodes** (competitor products, sparse destinations, anything with zero outbound edges). You'll only notice when the canvas stays blank on a live customer call.

Fix it by firing inbound and outbound in parallel and merging.

> **No-npm path:** wherever this section says `src/lib/graphClient.ts` or `src/pages/GraphPage.tsx`, read that as "the graphClient / GraphPage section of your single `index.html`" — same logic, plain JavaScript instead of the TypeScript shown, no new files.

### 6a. Add `queryPathsTo` to graphClient

In `src/lib/graphClient.ts` (no-npm: the graphClient section of your `index.html`), add a near-clone of `queryPaths` that swaps `source` for `destination`:

```ts
export async function queryPathsTo(node: { value: string; group: string }) {
  const body = {
    query: {
      and: [
        { prop: 'path', destination: node, undirected: true },
        { prop: 'generated', by: 'data-augmentation' }
      ]
    },
    top_k: 100
  };
  // ...same fetch + same client-side filter as queryPaths
}
```

### 6b. Add the merge helper

Still in `graphClient.ts`:

```ts
export async function queryPathsAround(node: { value: string; group: string }) {
  const [out, inb] = await Promise.all([
    queryPaths(node),
    queryPathsTo(node),
  ]);
  const seen = new Set<string>();
  const merged = [];
  for (const p of [...out, ...inb]) {
    const k = `${p.source.value}|${p.relation.label}|${p.destination.value}`;
    if (seen.has(k)) continue;
    seen.add(k);
    merged.push(p);
  }
  return merged;
}
```

### 6c. Swap GraphPage to call `queryPathsAround`

Open `src/pages/GraphPage.tsx` (no-npm: the GraphPage section of your `index.html`). Find every call to `queryPaths(selected)` and replace with `queryPathsAround(selected)`. There should be one (in the selection effect) — possibly two if the AI used it on initial mount.

### 6d. Verify

**npm path:**

```bash
npm run dev
```

**No-npm path:** reload `index.html` in your browser.

Pick a leaf-shaped entity from your corpus — something you know is *referenced by* other things but rarely originates relations (a competitor product name, a regulation cited by many documents, a venue mentioned in event records). Click it.

**You should see:** Clicking a leaf node should now populate the canvas — not stay empty. Sidebar shows paths where your entity is the destination, not just the source.

If you still see an empty canvas, your entity genuinely has zero edges in either direction — try a different one. If you see edges in the sidebar list but not on the canvas, the GraphPage's `mergeIntoGraphData` doesn't handle the new path objects — tell the AI: *"queryPathsAround returns paths but the graph viz doesn't show the inbound ones. Make sure the merge handles paths where the selected node is the destination, not the source."*

---

## Step 7 — Add the entity-to-resources back-link panel (25 min)

The sidebar's "Related resources" section from Step 4 is the seed. This step upgrades it from a flat list into a **persona-split commerce surface** — Prospects see products and guides, Members see ambassador content and endorsements too. That split is what turns the graph from a pretty diagram into a pipeline driver.

> **No-npm path:** same file-path note as Step 6 — `src/lib/graphClient.ts` and `src/pages/GraphPage.tsx` below mean "the corresponding section of your single `index.html`."

### 7a. Confirm `searchRelatedResources` iterates the resources map

Open `src/lib/graphClient.ts` (no-npm: the graphClient section of your `index.html`) → `searchRelatedResources`. Confirm it does:

```ts
return Object.entries(raw.resources ?? {}).slice(0, 8).map(([id, r]) => ({
  id,
  title: (r.title ?? '').replace(/^#+\s*/, '').trim() || id.slice(0, 8),
}));
```

If the AI instead pulled ids from `best_matches[i]`, fix it now. Those are *paragraph* references, not resource ids. Tell the AI: *"searchRelatedResources is using best_matches to derive ids. Those are paragraph references. Iterate the `resources` map directly — keys are resource ids."*

### 7b. Add a persona-split renderer in the sidebar

In `src/pages/GraphPage.tsx`, add a persona toggle at the top of the page (a simple `<select>` with `Prospect` / `Member`) and a `splitPathsByPersona`-style filter for the related-resources list:

```tsx
const [persona, setPersona] = useState<{ tier: 'Prospect' | 'Member' }>({ tier: 'Prospect' });

const visible = persona.tier === 'Prospect'
  ? related.filter(r => isProductOrGuide(r))
  : related;
```

`isProductOrGuide` is a simple title/group check against your corpus — adapt to whatever resource types your KB uses. The point isn't the exact rule, it's that the panel **responds** to the persona toggle.

### 7c. Render two visually distinct sections in the sidebar

Above the existing "Paths" section, render a "Related resources" block with:
- The persona toggle.
- The filtered list, each item a clickable card with title.
- A subtle group/type badge so the user can tell a product from a guide from an endorsement.

### 7d. Verify

Pick an ambassador-style entity from your corpus — someone or something that authored content AND endorsed/field-tested products. In the Aurora-Concierge capstone this is **Mara Chen**; in your own corpus, find the equivalent.

Select that entity. Toggle the persona from Prospect to Member.

**You should see:** Selecting Mara Chen (or your ambassador equivalent) should show her authored content and the products she field-tested in the side panel. Flipping to Prospect narrows the list to products and guides; flipping back to Member restores the full set including her authored content and endorsements.

If the list doesn't change when you flip persona, the filter isn't wired to the toggle state — tell the AI: *"The related-resources list doesn't change when I flip persona. The visible filter isn't reading from the persona state. Fix."*

---

## Step 8 — Answer a graph-only question (25 min)

This is the demo moment. Find or construct a question against your KB that **single-shot retrieval cannot answer** — only graph traversal can.

### 8a. Patterns

- **Two-hop intersection.** "Which X are connected to BOTH Y and Z?" (e.g., "Which investigators worked on both COMPOUND-A and COMPOUND-B?")
- **Path traversal.** "How is X connected to Y?" (Walk the path through one or two intermediate entities.)
- **Group-membership compounding.** "Which employees of Acme work in the EU and are also subject-matter experts on data privacy?" (Three constraints — graph excels.)

Pick one that fits your corpus.

### 8b. Walk through it in the UI

1. Search for the first entity.
2. Click it. Note its connections.
3. Search for the second entity (or click a connection that leads toward it).
4. Walk the graph to the answer.
5. **Take a screenshot** of the final graph state. Save as `graph-only-answer.png`.

### 8c. Document the walk

In `graph-evidence.md`, write the question + the steps + the answer:

```markdown
## Graph-only question

Q: "Which X are connected to both Y and Z?"

Walk:
1. Searched for Y → found node.
2. Clicked Y → expanded to neighbours, found ["A", "B", "C"].
3. Searched for Z → found node.
4. Clicked Z → expanded to neighbours, found ["B", "D", "E"].
5. Intersection: B.

Answer: B is the only X connected to both Y and Z.

(Try this with a flat /find query — you can't get there. That's the
graph-only demo punchline.)
```

---

## Key Takeaways

- **Graphs answer questions retrieval can't.** *"Which engineers worked on both Atlas E-220 cooling AND BuildingHub firmware?"* — no single document carries that fact. Retrieval returns five docs that mention either; only a graph traversal answers the intersection. This is the Tier 4 demo move; no competing vendor ships it with the platform.
- **The data-augmentation filter is non-negotiable.** Every graph query the app sends MUST wrap with `{ prop: "generated", by: "data-augmentation" }`. Without it Progress Agentic RAG returns default NER nodes (DATE, MONEY, ORG, PERSON) alongside your typed entities and the result reads as noise. The filter is a one-line client-side discipline; ship it everywhere.
- **Custom entity types beat generic NER.** Default NER gives you PERSON, ORG, DATE. Your customer's value comes from custom types: `INVESTIGATOR`, `COMPOUND`, `RUNBOOK`, `INCIDENT`. The data-augmentation agent (Build 6) is what produces them; this Build is where you query them.
- **Click-expand is the partner's quiet demo lever.** The customer in the room doesn't know what to ask the graph. Click an entity to expand its neighbours — let the customer point and ask *"what's that?"* — answer with another click. The exploration feels organic; the graph reveals connections the customer didn't know they had.
- **Graph schema is half the work.** 8-15 entity types, 8-15 relation types, definitions partners agree on, no overlapping semantics. Bad schema design surfaces in three places: the data-augmentation agent extracts noise (Build 6 fault), the graph viewer surfaces incoherent paths (this Build), the composite RAG flow (Build 10) can't traverse meaningfully. Get the schema right; the rest follows.
- **`/graph/nodes` + `/graph` + `/find` is the leaf-node recipe.** Hop-1 traversal misses leaf entities (the things people *talk about* but rarely originate relations from — competitor products, regulations, venues). The `queryPathsAround` pattern (outbound + inbound merge) is the fix; you'll re-use it in every customer engagement past Tier 1.

---

## Verification checklist

- [ ] `/graph` returns >0 paths with the data-augmentation filter.
- [ ] `graph-evidence.md` shows the difference between filtered + unfiltered queries.
- [ ] `src/lib/graphClient.ts` with all four functions + client-side filter.
- [ ] `src/pages/GraphPage.tsx` — fuzzy search + clickable graph + sidebar all working.
- [ ] No NER noise (DATE, MONEY, ORG, etc.) visible in the graph.
- [ ] At least one graph-only question demonstrated; screenshot saved.
- [ ] `prompt-log.md` saved.

Then take the [Build 8 quiz](3-quiz.md). Pass → start [Build 9](../build-09-field-engineering/).

---

## Getting unstuck

**`/graph` returns 0 paths even though the agent ran.**
- Confirm in the Progress Agentic RAG dashboard that the Graph agent's run completed (status: success).
- Re-run extraction if needed.
- Loosen your entity types — too narrow a schema = no extractions.

**Graph viz is blank.**
- The library expects a specific data shape. Check browser DevTools → Console for errors. Most common: `nodes` has `id` mismatch with `links` source/target IDs.
- Tell AI: *"The graph viz is blank. Console shows [error]. Fix."*

**NER nodes (DATE, MONEY, ORG) appearing.**
- Client filter isn't applied to `queryPaths` results — only to its initial nodes. Tell AI: *"queryPaths returns NER endpoints. Apply the client filter to BOTH source and destination of every path returned."*

**Click on a graph node does nothing.**
- The graph library's `onNodeClick` callback isn't wired. Tell AI: *"Clicking a graph node doesn't trigger selection. The onNodeClick handler isn't connected to the setSelected state setter."*

**Sidebar's "Related resources" is empty.**
- `searchRelatedResources` is failing silently. Check DevTools → Network for the `/find` request. If 0 results, the entity value isn't a strong-enough query — try a different entity.

**Anything else.**
- Copy the symptom + screenshot + DevTools error.
- Paste into AI with: *"My GraphPage does X but should do Y. Fix."*

---

## Next

[Build 9 — Field Engineering](../build-09-field-engineering/) — the highest-leverage **recurring-revenue** lever in the framework. Custom fields, `callToAction`, `searchResultDisplay`, training a customer's content team to own them.
