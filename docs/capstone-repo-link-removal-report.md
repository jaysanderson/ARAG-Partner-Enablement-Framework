# Repo-Link Removal — Change Report (Developer Foundations)

**Scope:** commit `70eb2e9` — removing every reference to the two working-capstone
GitHub repos (`Capstone-Atlas-Operations`, `Capstone-Aurora-Concierge`) so students
build the capstone from the brief instead of forking the finished solution.

**Footprint:** 16 course files changed, +73 / −86 lines.

**Governing decisions**
- **Capstone = "brief only"** — Build 13 no longer claims a 100%-scoring reference
  app exists to fork; the briefs become build specs.
- **In-lesson pointers = reword, keep value** — "See it in the capstone" code
  pointers drop the repo name but keep their teaching value.

---

## OVERVIEW.md
- **Removed:** "The reference implementations … are **real GitHub repos that score
  100%** … Partners **fork these** and re-skin them."
- **Added:** "The course gives you **two worked capstone briefs** … each a complete
  build spec … Partners **build one** to match their book of business."

## Build 0 — Hello ARAG
*(`1-lesson.md`, `2-walkthrough.md`, `corpus/README.md`)*
- **Removed:** "clone the framework repo locally first" as the way to get the
  corpus; the "Don't have git? … cloning is the path the course assumes" note; the
  *Getting unstuck* entry pointing at `download-directory.github.io` + `git clone` +
  `git-scm`; the `corpus/README` "Canonical source" section linking both
  `Capstone-*` repos; the `Capstone-Aurora-Concierge/` prefix on a lesson code
  pointer.
- **Added:** "The sample corpus **ships with this course** — find the
  `…/corpus/content_type/` folder in your course materials"; a repo-free *Getting
  unstuck* entry ("ask your programme lead for the folder/ZIP"); a plain
  "**The two corpora**" section describing both as bundled with the course.

## Build 3 — Conversational Surfaces
*(`1-lesson.md`)*
- **Removed:** `Capstone-Aurora-Concierge/` prefix on two `FloatingChat.tsx`
  pointers; the phrase "the full ~280-line **reference implementation**."
- **Added:** repo-free pointers (`src/components/FloatingChat.tsx`) + "the full
  ~280-line **version you'll build there**."

## Build 4 — Multilingual & Voice
*(`1-lesson.md`)*
- **Removed:** `Capstone-Aurora-Concierge/` prefix on three code pointers
  (`buildPrefix.ts`, `Storefront.tsx`, `JourneyGraph.tsx`).
- **Added:** the same pointers, repo-free (`src/…`).

## Build 5 — Structured Outputs
*(`1-lesson.md`, `2-walkthrough.md`)*
- **Removed:** two `Capstone-Aurora-Concierge/…` GitHub **links** (`askForJson.ts`,
  `Personalize.tsx`); "which you'll **fork** in Build 13."
- **Added:** repo-free pointers ("a reference shape: `src/lib/askForJson.ts` …");
  "the Aurora capstone you'll **build** in Build 13."

## Build 8 — Knowledge Graph
*(`1-lesson.md`)*
- **Removed:** `Capstone-Aurora-Concierge/` prefix on `graphClient.ts` /
  `JourneyGraph.tsx` pointers.
- **Added:** the same pointers, repo-free.
  *(The "near-clone of `queryPaths`" wording — a code concept — was kept.)*

## Build 11 — Production Readiness
*(`1-lesson.md`)*
- **Removed:** `Capstone-Atlas-Operations/` and `Capstone-Aurora-Concierge/`
  prefixes on `env.ts` / `graphClient.ts` / `Ops.tsx` / `ForYou.tsx` pointers.
- **Added:** the same pointers, repo-free.
  *(Variant name "Atlas Operations capstone" kept.)*

## Build 12 — Capstone Prep
*(`2-walkthrough.md`)*
- **Removed:** "Open each in your editor (**or in GitHub web view**)."
- **Added:** "Open each in your editor."

## Build 13 — The Capstone *(largest change)*
*(chooser `README.md`, `atlas-operations/README.md` + its `corpus/README.md`,
`aurora-concierge/README.md` + its `corpus/README.md`)*

**Removed**
- The **"Reference implementation"** GitHub column from the chooser table; the
  "See also → Reference implementations: `Capstone-*`" links.
- Both briefs' opener: "The complete reference app is at **github.com/…** — a
  chassis that **scores 100% against this brief** … It includes:"; the
  `## Reference implementation` heading; "fork it, don't rebuild from zero" /
  "fork as the technical baseline"; "the repo's `README.md` / `KB_SETUP.md`."
- The "corpus lives in **two places** — canonical source on GitHub / mirror in
  framework … when a partner **clones the capstone repo**" block.
- Ingest **step 1: "Partner clones `Capstone-X`."**
- The `capstone-*.fly.dev` live reference-app URLs; "in a private repo named
  `Capstone-X`"; "(matches `Capstone-X`)" / "reduces fork cost" stack notes; the
  "**Fork + reskin**" build-plan phase labels; status line
  "+ reference implementation shipped."

**Added**
- Heading **"What you'll build"** + "a Vite + React + TypeScript + Tailwind app that
  **satisfies this brief**. It covers: …" (the old artifact list reframed as **the
  build's scope**, not "what you receive").
- "Build it **to the spec** in this brief — the in-scope sections and the build
  plan below are your guide."
- "The seed corpus **ships with this course** at `./corpus/<labelset>/`."
- Ingest **step 1: "Locate the `corpus/<labelset>/` folder included with this
  course."**
- Phase labels renamed **"Chassis + reskin"**; status line **"Brief shipped."**;
  corpus READMEs reframed as "bundled with this course" / "for the Atlas Operations
  (Aurora Concierge) capstone."

*Builds 1, 2, 6, 7, 9, 10 — no repo references, unchanged.*

---

## Summary

- **Model shift:** Build 13 moved from **"fork the working reference app and
  re-skin"** → **"build to this spec."** The artifact lists that described what the
  repo *shipped* are now the **deliverable scope** of what the partner *builds*.
- **Corpus unaffected:** it already shipped inside the course tree, so removing the
  repos broke nothing mechanically — only the "canonical = repo / mirror =
  framework" framing reversed to "ships with the course."
- **Kept on purpose (not repos):** GitHub Copilot (a tool), `git-scm.com` (the git
  download), the variant **names** Atlas Operations / Aurora Concierge, and
  code-concept "clone" (deep clone, near-clone, un-cloneable).
- **Verification:** grep across the course = **zero** repo references; site + all 16
  SCORM packages rebuilt clean; `check-links` 0 broken; Atlas brief confirmed
  rendering coherently.
- **Security outcome:** combined with the two capstone repos already being
  **private**, students now have no path to the working solution — no URL in the
  course, and no public repo to find. They build their own.
