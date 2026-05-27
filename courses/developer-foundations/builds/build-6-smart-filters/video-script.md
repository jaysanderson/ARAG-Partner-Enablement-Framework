# Video Script — Build 6: Smart Filters & Labelsets

> **Duration target:** 8 minutes
> **Format:** Screen recording. Dashboard + curl + AI generation + browser demo.

## Cold open (0:00 – 0:30)

**ON SCREEN:** Title card. *"Developer Foundations · Build 6 · Smart Filters & Labelsets."* Cut to a search page mockup with chips at the top.

**VOICEOVER:**
> Eight minutes. Filters are the cheapest precision lever in ARAG — five minutes of labelset design lifts retrieval precision twenty to forty percent. By the end of this video you'll have a working filtered search UI, vibe-coded, with content-type chips and a labelset facet sidebar.

## Section 1: The two filter types (0:30 – 1:30)

**ON SCREEN:** Slide showing the two filter-path patterns: `/icon/application/pdf` (content-type) and `/classification.labels/audience/legal-team` (label). Both with example values.

**VOICEOVER:**
> Both `/find` and `/ask` accept a filters array. Two kinds.
>
> Icon-paths — content type. `/icon/video`, `/icon/application/pdf`, `/icon/audio`. Stack multiple — that's OR. Videos or PDFs.
>
> Label-paths — your classification labels. `/classification.labels/<labelset>/<value>`. Stack across different labelsets — that's AND. Region EMEA and audience legal-team.

## Section 2: Discover labelsets (1:30 – 2:30)

**ON SCREEN:** Terminal. Run `GET /labelsets`. Empty response or near-empty.

**VOICEOVER:**
> First check: what labelsets exist on your KB? Hit `/labelsets`. On a fresh sandbox — empty. You haven't designed any. We're about to.

## Section 3: Design a labelset on paper (2:30 – 3:30)

**ON SCREEN:** Open a markdown file. Type out a labelset design: name `topic`, with 7 labels (e.g., onboarding, billing, technical, security, integrations, troubleshooting, release-notes). One-sentence definition each.

**VOICEOVER:**
> Pick one dimension. Topic. Five to nine labels — cognitive limit. Less doesn't separate; more confuses both the classifier and the user.
>
> Each label gets a one-sentence definition. Map to user intent — what the customer's user thinks they want — not the internal taxonomy of the customer's CMS.

## Section 4: Apply labels in the dashboard (3:30 – 4:30)

**ON SCREEN:** Nuclia dashboard. Settings → Labelsets → Create. Name it `topic`. Add the 7 labels. Then jump to a resource, apply 2–3 labels to it. Repeat for 4–5 resources. Fast-forward.

**VOICEOVER:**
> In the dashboard, create the labelset. Add the labels. Then apply to your resources. For a 10-document sandbox you do this by hand in fifteen minutes. For a customer's 10,000-document corpus you train a classifier — that's the Advanced course.

## Section 5: Test filter composition via curl (4:30 – 5:30)

**ON SCREEN:** Terminal. Three curl commands. First: query without filters → 10 results. Second: query with `/icon/application/pdf` filter → 3 results. Third: query with PDF filter + topic label filter → 1 result. Show the result count shrinking each time.

**VOICEOVER:**
> Hit `/find` three times. No filter — ten results. PDF-only — three. PDF plus topic-billing — one. Each filter narrows the result set. The customer's user gets exactly what they were looking for, not the broad mess that comes from an unfiltered semantic search.

## Section 6: Vibe-code the filter UI (5:30 – 7:00)

**ON SCREEN:** Claude Code. Paste the search-page brief from the walkthrough. AI generates `/search` page with chips + sidebar. Fast-forward. Open the browser. Show the page.

**VOICEOVER:**
> Vibe-code the UI. Brief Claude: chip strip for content type, sidebar for the topic labelset, fetch labelsets at mount, re-query on every filter change.
>
> Sixty seconds of generation. The page renders.

## Section 7: Live demo the filter UX (7:00 – 7:45)

**ON SCREEN:** Browser. Type a generic query. Show ten results. Click "PDFs" chip — three results. Click "billing" topic in the sidebar — one result. Click "All" + clear topic — back to ten.

**VOICEOVER:**
> Demo. Generic query — ten results. PDF chip — three. Add billing topic — one. Clear both — back to ten.
>
> The same architecture works for a hundred labels across ten labelsets. Customer's brand team owns the labelset design; you maintain the UI scaffold.

## Wrap (7:45 – 8:00)

**ON SCREEN:** End card. *"Build 7 — Knowledge Graph 101. Next."*

**VOICEOVER:**
> Build 7 is the Tier 4 surface — the typed knowledge graph. The single most differentiated capability in ARAG. See you there.

---

## Production notes

- **Section 4 (label application):** the per-resource label assignment in the dashboard is tedious on camera. Fast-forward (×8) and show the result.
- **Section 5 (curl):** show the result count change clearly — overlay the count on screen if jq output is hard to read live.
- **Section 6 (vibe-code):** generation takes 60–90 seconds. Don't show the full cursor; fast-forward and cut to the finished page.
- **Section 7 (demo):** the chip + facet UI should be visually clear. Use a high-contrast Tailwind theme.
