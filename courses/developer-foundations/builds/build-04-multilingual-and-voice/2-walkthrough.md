# Build 4 — Walkthrough: Multilingual & Voice Switching

> Estimated time: 1.5–2 hours focused. Complete Build 3 and read the [lesson](1-lesson.md) first.
>
> **Layered on Build 3.** You're not starting from scratch — you're adding three controls to the chat you already built. If Build 3 works, Build 4 is mostly fast.

## What you'll build

Three new controls **layered onto your Build 3 chat**:

1. **Language dropdown** — same KB, same content, answer flips between English / French / Japanese / etc.
2. **Segment radio buttons** — same query, different audience framing (beginner / expert / etc.).
3. **Resource-scope text input** — name a document; the answer focuses on that resource.

All three are implemented with **one technique**: a **query prefix** prepended to the user's question. No new endpoints, no new data, no model fine-tuning. **5–10 lines of code per lever.**

This Build sells itself in customer demos. "Show us multilingual" and "show us audience targeting" are two questions you'll hear in every Tier-2 conversation.

## What you'll need open

- **Your Build 3 project folder** (`foundations-build-3`).
- **Your terminal**.
- **Your editor** (VS Code).
- **Your AI assistant**.
- **A modern browser**.

If Build 3 isn't working, **fix that first**. Build 4 layers on top.

---

## Step 1 — Re-open the Build 3 project (5 min)

In your terminal:

```bash
cd ~/Desktop/foundations-build-3
npm run dev
```

**You should see:** the same Build 3 chat UI at `http://localhost:5173/`. Send a test query in each persona mode (Prospect, Member). Confirm both still work.

**If Build 3 is broken:** stop here. Fix Build 3 first (see Build 3's "Getting unstuck"). Build 4 needs it as a foundation.

Stop the dev server (`Ctrl+C`) before editing files.

---

## Step 2 — Vibe-code the prefix builder (15 min)

This file is **tiny** — a single helper function that builds a query prefix from three inputs. We'll layer it into the chat in the next step.

### 2a. Brief your AI

Paste **exactly**:

```
In my Vite + React + TypeScript project, create src/lib/buildPrefix.ts.

Export a function:

  buildPrefix(opts: {
    language?: string;
    segment?: string;
    resourceTitle?: string;
  }): string

That returns a string built from three optional fragments:

- If language is set AND not "English" (case-insensitive):
    "Respond in {language}: "
- If segment is set:
    "The user is a {segment}. Frame your answer accordingly. "
- If resourceTitle is set (non-empty):
    'Regarding the resource titled "{resourceTitle}": '

Concatenate the fragments in order (language → segment → resource).
Skip empty/missing fragments cleanly (no extra spaces).

Return an empty string "" if no opts result in a fragment.

Pure TypeScript. No external dependencies. Include JSDoc comments
showing example calls and outputs.
```

Send.

### 2b. Save the AI's output

- **Claude Code / Cursor:** *"Save this as src/lib/buildPrefix.ts."*
- **Web chat:** in VS Code, create `src/lib/buildPrefix.ts` and paste.

### 2c. Read the code

Three checks:

1. The function is exported with the right signature (`buildPrefix(opts) => string`).
2. The fragments are joined cleanly (no double spaces, no leading/trailing whitespace).
3. Returns `""` when nothing is set (not `undefined` or `null`).

### 2d. Test it (optional but worth 2 minutes)

In your terminal, in the project root:

```bash
node --experimental-strip-types -e "
import { buildPrefix } from './src/lib/buildPrefix.ts';
console.log('1:', JSON.stringify(buildPrefix({})));
console.log('2:', JSON.stringify(buildPrefix({ language: 'Spanish' })));
console.log('3:', JSON.stringify(buildPrefix({ language: 'English', segment: 'Expert' })));
console.log('4:', JSON.stringify(buildPrefix({ language: 'French', segment: 'Beginner', resourceTitle: 'Onboarding Guide' })));
"
```

(If `--experimental-strip-types` errors out — your Node version is older. Skip this manual check; the next step's UI test verifies correctness.)

**Expected outputs:**
- `1: ""`
- `2: "Respond in Spanish: "`
- `3: "The user is a Expert. Frame your answer accordingly. "`
- `4: "Respond in French: The user is a Beginner. Frame your answer accordingly. Regarding the resource titled \"Onboarding Guide\": "`

### 2e. Save your prompt

Create or append to `prompt-log.md` in your project root. Add the Step 2 brief.

---

## Step 3 — Add the three UI controls (30 min)

Now the visible work — add three controls to the chat, wire them through `buildPrefix`.

### 3a. Brief your AI

Paste **exactly**:

```
Update src/components/MultiSurfaceChat.tsx to add three new UI controls
ABOVE the existing persona toggle:

1. Language dropdown (HTML <select>):
   - Options: ["English", "Spanish", "French", "German", "Japanese", "Mandarin"]
   - State: const [language, setLanguage] = useState<string>("English")

2. Segment radio buttons (3 options):
   - Choose sensible defaults for a generic knowledge KB:
     "Beginner", "Practitioner", "Expert"
   - State: const [segment, setSegment] = useState<string>("Practitioner")

3. Resource context text input (optional):
   - Placeholder: "Optional: focus on a resource titled..."
   - State: const [resourceTitle, setResourceTitle] = useState<string>("")

Layout (Tailwind):
- A horizontal flex row above the existing persona toggle.
- Each control labelled clearly.
- The whole row collapses to a vertical stack on narrow screens
  (use flex-wrap or md: breakpoints).

Wire it in:
- Import buildPrefix from '../lib/buildPrefix'.
- In the submit handler, BEFORE calling streamAsk:
    const prefix = buildPrefix({ language, segment, resourceTitle });
    const finalQuery = prefix + originalUserQuery;
    streamAsk(finalQuery, promptConfig);
- The chat history should still display the ORIGINAL user query
  (without the prefix) — the prefix is an internal lever.

Don't remove anything from the existing component. Just add.
```

Send.

### 3b. Save the AI's output

- **Claude Code / Cursor:** *"Apply this to src/components/MultiSurfaceChat.tsx."*
- **Web chat:** copy the updated file, replace `MultiSurfaceChat.tsx` in your editor, save.

### 3c. Read the diff

Three checks:

1. The three new controls are above the persona toggle.
2. `buildPrefix` is imported and called in the submit handler.
3. The chat history shows the **original** query (not the query-with-prefix).

If the AI re-wrote the entire component and broke Build 3 features, tell it: *"You removed the [feature]. Re-add it without removing the new controls."*

### 3d. Run and visually check

```bash
npm run dev
```

Open `http://localhost:5173/`.

**You should see:**
- A row of three controls at the top (language dropdown, segment radios, resource input).
- The Build 3 persona toggle below.
- The chat area below that.

If the layout's broken, tell the AI: *"The new controls overlap with the persona toggle. Stack them vertically on small screens. Make sure each control is clearly labelled."*

---

## Step 4 — Test each lever in isolation (25 min)

This is where the magic shows. Keep `language="English"`, `segment="Practitioner"`, `resourceTitle=""` for the baseline.

### 4a. Test the language lever

1. Type a question your corpus can answer: *"What should I focus on?"* (or whatever fits)
2. Press Enter. Note the English answer.
3. Change language to **French**. Same question. Press Enter.
4. Change language to **Japanese**. Same question. Press Enter.

**You should see:** the answer appears in French, then Japanese. Same content, different language.

**If the language doesn't change:**
- Open DevTools → Network tab → click the `/ask` request → look at the request body. The `query` field should start with `Respond in French:` (or whichever language).
- If not, the prefix isn't being prepended. Tell AI: *"The language prefix isn't being added to the query. Check the submit handler in MultiSurfaceChat.tsx — the prefix concat is missing."*

### 4b. Test the segment lever

Language back to English.

1. Segment = **Beginner**. Ask *"How does this work?"* Note the answer's tone — should be simple, accessible.
2. Segment = **Expert**. Same question. The answer should be more technical, terse, jargon-friendly.

**You should see:** the *same content*, framed differently. Beginner answers explain more; Expert answers assume context.

### 4c. Test the resource-scope lever

1. Pick a document title from your KB (open the Progress Agentic RAG dashboard → list of resources → copy any title verbatim).
2. Paste it into the **Resource Context** input.
3. Ask: *"Summarise this."*

**You should see:** the answer disproportionately references that resource (e.g., quotes paragraphs from it, or names it explicitly). Without the prefix, *"summarise this"* would be ambiguous; with the prefix, the model knows which "this".

### 4d. Test all three combined

1. Language = **Spanish**.
2. Segment = **Expert**.
3. Resource Context = some document title.
4. Ask any question.

**You should see:** answer is in Spanish, framed for an expert audience, focused on the named resource. **Three levers, one query, one answer.** Demonstration over.

---

## Step 5 — Make the language list configurable (10 min)

This is the **brand-team handoff pattern**. The customer's content/brand team should be able to swap the language list without editing component code.

### 5a. Brief your AI

Paste:

```
Refactor MultiSurfaceChat.tsx so the language list is a PROP, not hardcoded.

- Add a prop: languages?: string[]
- Default value: ["English", "Spanish", "French", "German", "Japanese", "Mandarin"]
- The dropdown should render from this prop.
- The default value of the `language` state should be the first item in the prop.

In App.tsx, demonstrate by passing a custom list:
  <MultiSurfaceChat languages={["English", "Welsh", "Irish Gaelic"]} />

That way the brand team can configure supported languages without
touching component code.
```

Send. Apply the changes.

### 5b. Test

Reload the page. **You should see** the three custom languages in the dropdown.

Restore the original six-language default for the final demo. (Or keep the custom list if you want — your call.)

---

## Key Takeaways

- **Three Tier-2 levers from one prefix string.** Language, segment, resource scope — each one is a prepended instruction to the user prompt. No model retrained, no extra KB provisioned, no filter required for the *voice* change. The whole pattern is `buildPrefix({ language, segment, resourceId })` returning a string the client glues onto the query.
- **Query prefixes shape voice. They are NOT a security boundary.** This is the most important takeaway. The model treats prefixes as *hints*, not constraints. *"The user is a Prospect"* is influential ~70-95% of the time and leaks the rest. Anywhere you need a hard scope (member-only content, GDPR-residency-restricted docs, internal-only resources), use a `/find` labelset filter — the server enforces it, no model in the loop.
- **The same prefix machinery scales to N customer questions.** Multilingual? Prefix. Persona voice? Prefix. "Just this PDF"? Prefix. Once a partner sees this they stop pitching ARAG as a chatbot and start pitching it as a *conversational substrate* — the platform-vs-feature framing in the Build 11 lessons.
- **Resource-scoped chat is a 1-line trick.** A prefix like `"Use only the resource titled <X>"` plus a `/find` filter on `resource_id` produces "ask about this PDF" behaviour customers usually budget months of engineering for. Closes the "chat with the document, not the KB" objection in 30 seconds.
- **Build 7 (Smart Filters) is where you graduate from prefixes to filters.** Build 4 is the *prefix* lesson. Build 7 makes the labelset side rigorous — sidebar facets, smart-default filters per user profile, the labelset architecture decisions that determine whether a filter actually exists for your scope rule.

---

## Step 7 — Update your prompt log (5 min)

Make sure `prompt-log.md` includes:

1. Step 2 brief (buildPrefix).
2. Step 3 brief (UI controls).
3. Step 5 brief (configurable language prop).
4. Any debugging prompts.

---

## Step 9 — Move audience scope from prefix to filter (20 min)

The prefix lever you wired in Step 3 shapes voice beautifully. It is **not** a security boundary. This step proves that with a deliberate failure, then replaces the prefix-only scope with a server-enforced labelset filter — the pattern you'll reach for whenever a customer says "prospects must never see member-only content".

### 9a. Reproduce the prefix-only leak

In your chat, set:
- Segment = `Prospect`
- Language = `English`

Ask a query that straddles the prospect/member boundary in your KB. For a generic content KB, try: *"What advanced workflows do you recommend?"* (or substitute any topic where you have both public-tier and member-only paragraphs in the KB).

Run the same query 5–10 times. Inspect each answer.

**You should see:** the answer occasionally cites or paraphrases a member-only document despite the `The user is a Prospect.` prefix. The model is treating the prefix as a *hint*, not a *constraint*. If you don't get a leak in 10 runs, lower the prefix's authority by rewording it (`The user identifies as a Prospect.`) — the point is that *prefix-only* gating is non-deterministic by design.

### 9b. Replace the prefix scope with a `/find` filter

Brief your AI:

```
In src/components/MultiSurfaceChat.tsx, when segment === "Prospect",
add a server-side filter to the /find (or /ask retrieval) request:

  filters: ["/classification.labels/audience/shopper"]

Keep the persona-prefix for voice shaping, but rely on the filter
for audience scoping. The filter must go in the request body, not
the query string.

If you're using streamAsk against /ask, the filter goes under
features.retrieval (or the equivalent retrieval config object —
check the request your client is currently building).
```

Apply the change. (Your KB needs an `audience` labelset with at least a `shopper` label for this to bind to real content — if you don't have one yet, add a label to 2–3 resources in the Progress Agentic RAG dashboard first, then re-index.)

Re-run the same query from 9a 5–10 times.

**You should see:** member-only results disappear from the result set, not just from the model's reply. Inspect the `/ask` (or `/find`) response in DevTools → Network — the `resources` / `paragraphs` array should no longer contain member-only documents at all. The model can't leak what the retriever never returned.

---

## Verification checklist

- [ ] `src/lib/buildPrefix.ts` working — returns the right strings for the example inputs in Step 2d.
- [ ] Language dropdown switches answer language in 3+ languages.
- [ ] Segment radio changes answer framing (visible difference between Beginner and Expert).
- [ ] Resource scope biases the model toward the named resource.
- [ ] All three combine cleanly when set together.
- [ ] Language list is a configurable prop, not hardcoded.
- [ ] `demo-script.md` saved.
- [ ] `prompt-log.md` saved with all briefs.

Then take the [Build 4 quiz](3-quiz.md). Pass → start [Build 5](../build-05-structured-outputs/).

---

## Getting unstuck

**Prefix doesn't appear in the request body.**
- DevTools → Network → click the `/ask` request → check the `query` field. Should start with the prefix.
- If not, the submit handler isn't calling `buildPrefix`. Tell AI: *"The query field in the request body doesn't include the prefix. The handler isn't prepending it."*

**Answer language doesn't change.**
- Make sure you typed the language name exactly as in the dropdown (case-sensitive). Some models are picky.
- If the prefix is in the request but the answer is still English, try setting `rephrase: false` temporarily — `rephrase` can occasionally rewrite the query into English first. (This is a model quirk; usually not an issue.)

**Segment doesn't change the tone.**
- The system prompt from Build 3 may be overriding. Try a much more distinct segment label, e.g., "10-year-old child" vs "PhD researcher" — that forces the difference visible.

**Resource scope doesn't focus the answer.**
- The resource title must match a real document in your KB. Copy/paste from the dashboard exactly.
- Ambiguous queries like "summarise this" depend on the resource scope landing. Try a more leading query: *"What does the resource say about X?"*

**Component re-renders on every keystroke and feels laggy.**
- Probably a `useEffect` watching the input states. Tell AI: *"The chat re-renders on every keystroke in the language/segment/resource controls. Fix the unnecessary re-renders."*

**Anything else.**
- Copy the symptom + the file/code in question into your AI.
- Apply the fix. Re-test.

---

## Next

[Build 5 — Structured Outputs](../build-05-structured-outputs/) — the **most important Build in the course**. `answer_json_schema` is the Tier-3 unlock: workflows, structured extraction, schema-validated generation. Plan 4–5 hours.
