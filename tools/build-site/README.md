# Course site builder

Converts the **Developer Foundations** markdown course
(`courses/developer-foundations/`) into a **single self-contained HTML file**:
`docs/index.html`. The markdown is the source of truth and is never modified;
this tool is build-time only and ships nothing to the browser.

## What the output is

- **One file** (~800 KB): every lesson, walkthrough, quiz, the final exam, and
  the capstone briefs, with CSS inlined. Double-click it, email it, drop it on
  any static host — it works the same everywhere, no server needed.
- **Behaves like a single-page app** — only one course page is visible at a
  time; clicking any link swaps the page (landing at the top, with the browser
  tab title updating), and back/forward walks your page history. All
  JavaScript is one small inline script (hash router + quiz grading). With
  JavaScript disabled the file degrades to one scrolling document. Printing
  renders the whole course; note that browser find-in-page only searches the
  currently open page.
- **Quizzes are runnable**: options are radio buttons, "Check my answers"
  marks each question, shows the correct answer on misses, and scores against
  the quiz's real pass mark (parsed from its answer key at build time —
  4/5 per build, 16/20 on the final exam). No persistence; a reload resets.
  The static "Reveal answer key" `<details>` stays as a fallback.
- Targets modern browsers (Chrome, Edge, Safari, Firefox).
- Code blocks are syntax-highlighted at build time (classes baked into the
  HTML, palette in the inlined CSS).
- Navigation is derived from the folder structure: a landing section with an
  ordered topic index, per-build Overview / Lesson / Walkthrough / Quiz
  sections with prev/next links, the final exam, then the capstone brief as
  the final section. All navigation is in-page `#anchors`.
- **Not published:** corpus folders and anything outside the course. Links to
  unpublished files are rendered as plain text so the file has no dead links.

## SCORM package (for LMS import)

The build also emits **`docs/developer-foundations-scorm12.zip`** — a SCORM
1.2 single-SCO package (`imsmanifest.xml` + the same `index.html`) that
imports into Moodle, Cornerstone, Docebo, SCORM Cloud, and any other
SCORM-1.2-compliant LMS. When launched from an LMS the course:

- reports `lesson_status` (`incomplete` on first launch),
- bookmarks the learner's current page and resumes there next launch,
- reports the **final-exam score** (`cmi.core.score.raw`, out of 20) and sets
  `lesson_status = passed` at 16+ (mastery score 80 in the manifest).

A failed exam attempt leaves the status `incomplete` (retry-friendly, matching
the open-book course design). Outside an LMS all of this is inert — the same
file works standalone.

## Rebuild (after any content change)

```bash
bash tools/build-site/rebuild.sh
```

Needs only **Node 18+** — no npm install, no network, no dependencies. The
script regenerates `docs/index.html` from scratch (never hand-edit it) and
then runs `check-links.mjs`, which fails the build if any internal anchor is
broken.

## Edit the capstone submission channel

The capstone section ends with a generated **Build & submit** box containing
the placeholder `[SET SUBMISSION CHANNEL …]`. Set the real channel in
`SUBMIT_BLOCK` inside [`build.mjs`](build.mjs), then rebuild.

## Deploy

- **Send the file:** email or share `docs/index.html` directly — it is fully
  self-contained.
- **GitHub Pages:** repo Settings → Pages → "Deploy from a branch" →
  `main` / `docs/`. A `.nojekyll` file is generated so Pages serves it as-is.
- **Any static host** (Netlify, S3, nginx…): upload `docs/index.html`.
