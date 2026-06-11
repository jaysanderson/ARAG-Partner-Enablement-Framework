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

The build also emits **`docs/developer-foundations-scorm2004_4.zip`** — a
SCORM 2004 4th Edition package in the same layout as Progress's
authoring-tool exports (Articulate Rise / Rustici SCORM driver):

```
imsmanifest.xml, metadata.xml, *.xsd     (package root)
scormdriver/                             (vendored Rustici driver — the SCO
                                          launch point, indexAPI.html)
scormcontent/index.html                  (the whole course, with its own
                                          sidebar course menu)
```

- The **driver owns all LMS communication** (API discovery, initialise,
  commit, exit). The course hands it bookmarks and results via
  `SetBookmark` / `SetScore` / `SetPassed` / `SetFailed` / `SetReachedEnd`.
- **Resume** is driver-native: the bookmark is `index.html#<page>`, so a
  relaunch reopens the learner's last page.
- The **final exam** reports its score to the gradebook as a percentage
  (`cmi.score.raw`/`scaled`) and sets `passed` at 16+/20 (or `failed`), plus
  course completion via `SetReachedEnd`.
- The course UI shows a persistent **sidebar course menu** (all builds with
  Lesson / Walkthrough / Quiz), so inside the LMS player it behaves like a
  standard authored course, not a bare web page.

The driver files under `tools/build-site/scorm-template/` were taken from a
Progress Rise SCORM 2004 4th Ed export (zone-migration-essentials) and are reused verbatim apart from the content
launch URL. `docs/index.html` is the same course for web/standalone use.

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
