# Build 2 — Walkthrough: Query Understanding & Rephrasing

> Estimated time: 10–14 hours focused. Read the [lesson](1-lesson.md) first.
>
> Build 1's matrix + Build 1's harness are prerequisites. This Build extends both.

## What you'll build

- A **query-archetype catalogue** with at least 4 archetypes, per-archetype rephrasing strategy.
- A **custom rephraser prompt** with vertical-specific preserve / improve directives.
- An **expansion-experiment harness** that extends Build 1's comparison harness with rephrasing on/off and three expansion strategies.
- A **per-archetype recommendation table** with measured lift.

## Step 1 — Tag the test query set (45 min)

Open `test-queries.md` from Build 1. For each of the 12 queries, add an archetype tag:

```markdown
## Q1 — Factoid
Query: "What's the warranty length on the Aurora TerraTrek 7?"
Archetype: factoid
Expected to ace: /find, /ask sync
Notes: ...
```

Use **factoid / navigational / conceptual / exploratory** as the four-tag vocabulary. If your test set is skewed (e.g. 10 factoids and 2 conceptuals), add 4–8 more queries to balance the archetype distribution before continuing. The recommendation table needs at least 3 queries per archetype to be statistically meaningful.

Commit the updated `test-queries.md` and a new `query-archetypes.md` with the catalogue definitions.

## Step 2 — Run rephrasing on/off A/B (2 hours)

### 2a. Extend Build 1's harness

Add a `rephrase_on` / `rephrase_off` axis to the comparison harness. For each test query, run `/ask` twice — once with `rephrase: true`, once with `rephrase: false`.

### 2b. Measure per-archetype lift

For each archetype, aggregate:

- Median citation density (rephrase on vs off).
- Median retrieval-rank-of-first-correct-source (a hand-labelled metric — see Step 2c).

### 2c. Hand-label correct sources for at least 5 queries per archetype

This is the slow step. For each query, you need to know which resource ID *should* be the top match. Open the dashboard, run the query, eyeball the corpus, and decide. Save to `golden-set.md`:

```markdown
## Q1 — Factoid
Expected correct sources (ranked):
1. resource-id-abc123 (Aurora TerraTrek 7 product page)
2. resource-id-def456 (Warranty policy doc)
```

Yes this is tedious. There's no shortcut — every Build past this one depends on the hand-labelled ground truth.

### 2d. Tabulate the A/B

Per-archetype:

| Archetype | Citation density (rephrase on) | Citation density (rephrase off) | Rank of first correct source (on) | Rank of first correct source (off) |
|---|---|---|---|---|
| factoid | 4.1 | **4.3** | **1.2** | **1.1** |
| navigational | 3.8 | **4.2** | 2.4 | **1.6** |
| conceptual | **5.7** | 3.9 | **1.5** | 2.8 |
| exploratory | **6.2** | 4.0 | **1.8** | 3.1 |

(Numbers above are illustrative; yours will differ.)

Two things should jump out:

- Factoid and navigational queries are usually *hurt* by default rephrasing.
- Conceptual and exploratory queries are usually *helped* by default rephrasing.

Commit the A/B table as `rephrase-ab.md`.

## Step 3 — Write the custom rephraser prompt (2 hours)

The default rephraser is the wrong default for factoid and navigational queries. Two options:

- **Option A:** turn rephrasing off, accept the lift you measured on those archetypes.
- **Option B:** write a custom prompt that preserves verbatim what factoid / navigational queries need, while still helping conceptual / exploratory.

Option B is what differentiates a partner.

### 3a. Adapt the prompt template

Open the lesson's template. Fill the `{domain}` slot for your customer's vertical. Adjust the preserve / improve directives to the customer's actual terminology.

### 3b. Deploy it

ARAG accepts a custom rephraser prompt as a query-time parameter. Update your harness to pass it.

### 3c. Re-run the A/B with the custom prompt

Three configurations now:

- Rephrase off.
- Rephrase on, default prompt.
- Rephrase on, custom prompt.

Per-archetype, the custom prompt should:

- Match rephrase-off on factoid + navigational.
- Match or beat default-prompt on conceptual + exploratory.

Commit the three-way A/B/C as `custom-prompt-results.md`.

If the custom prompt doesn't beat the choice between rephrase-on-default and rephrase-off, your prompt isn't aggressive enough on its preserve directives. Iterate.

## Step 4 — Run expansion experiments (3 hours)

Three strategies, run via harness extension:

### 4a. Synonym expansion

Generate 2 synonyms per query with an LLM. Issue 3 retrievals (original + 2 synonyms). Merge the results (union by resource ID, keep highest score).

### 4b. Acronym expansion

Detect acronyms in the query (regex for 2–5 uppercase letters). Expand each via a domain glossary or LLM lookup. Issue 2 retrievals.

### 4c. HyDE

Generate a 50–80-word *hypothetical answer* to the query with an LLM. Embed *that* (use ARAG's `/embed` endpoint or your local embedding model). Issue a vector-only retrieval with the hypothetical-document embedding.

### 4d. Measure per-archetype lift

| Archetype | No expansion | Synonym | Acronym | HyDE |
|---|---|---|---|---|
| factoid | baseline | -3% | (n/a) | -8% |
| navigational | baseline | -5% | (n/a) | -12% |
| conceptual | baseline | **+8%** | (n/a) | **+15%** |
| exploratory | baseline | **+11%** | (n/a) | **+22%** |

(Numbers illustrative.) Lift = improvement in rank-of-first-correct-source, averaged across the archetype's queries.

Pattern most partners see: HyDE crushes on exploratory queries, hurts on factoids. Synonym helps on conceptual / exploratory, hurts on navigational. Acronym only helps where the corpus and the query use different forms.

Commit the expansion table as `expansion-results.md`.

## Step 5 — Publish per-archetype recommendation (1 hour)

Final deliverable: a per-archetype recommendation table the partner uses as the *opening* move in every customer scoping conversation.

```markdown
## Per-archetype rephrasing + expansion recommendation

| Archetype | Rephrase | Expansion | Why |
|---|---|---|---|
| factoid | off (or custom-preserve-entities) | none | rephrasing risks losing the SKU; expansion adds noise |
| navigational | off | none | the user knows the document title; expansion drags away |
| conceptual | on (custom prompt) | synonym + HyDE | corpus rarely uses the user's exact phrasing |
| exploratory | on (custom prompt) | HyDE | hypothetical-answer embeddings are closest in embedding space |
```

Commit to `per-archetype-recommendation.md` and copy a sanitised version to the course-level `../../assets/` folder.

## Step 6 — Defence rehearsal (45 min)

Pick a customer scenario currently in pipeline. Walk through:

- What archetype is the customer's primary traffic?
- What rephrasing + expansion recommendation does the table give?
- What's the measured lift?

Commit the rehearsal to `defence-rehearsal.md`.

## Pass-rubric self-check

- [ ] `query-archetypes.md` with at least 4 archetypes.
- [ ] `rephrase-ab.md` with measured A/B numbers per archetype.
- [ ] `custom-prompt-results.md` showing the three-way A/B/C.
- [ ] `expansion-results.md` with per-archetype lift for synonym, acronym, HyDE.
- [ ] `per-archetype-recommendation.md` table committed.
- [ ] Asset copied to `../../assets/per-archetype-recommendation.md`.
- [ ] Defence rehearsal committed.

## Getting unstuck

**Custom rephraser prompt makes results worse.** The preserve directives are usually under-specified. Add explicit examples of terms to preserve verbatim (SKU patterns, citation patterns).

**HyDE doesn't help on conceptual queries.** The hypothetical-answer LLM is generating bland prose. Make the HyDE prompt more specific: *"Write a 50-word technically-detailed paragraph as if it came from a {domain} document answering the question."*

**Synonym expansion adds noise.** Filter the 2 generated synonyms to the top-1 by embedding similarity to the original. The second synonym is usually the noise source.

---

## Next

[Build 3 — Filter Composition at Depth](../build-3-filter-composition-at-depth/) — composes on top of the rephrased query, so the lift from this Build carries forward.
