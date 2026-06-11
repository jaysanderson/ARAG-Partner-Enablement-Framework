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
  tab title updating), and back/forward walks your page history. This is a
  ~30-line inline hash router — the only JavaScript in the file. With
  JavaScript disabled the file degrades to one scrolling document. Printing
  renders the whole course; note that browser find-in-page only searches the
  currently open page.
- Quiz answer keys use native `<details>`/`<summary>` (no scoring, no
  persistence).
- Code blocks are syntax-highlighted at build time (classes baked into the
  HTML, palette in the inlined CSS).
- Navigation is derived from the folder structure: a landing section with an
  ordered topic index, per-build Overview / Lesson / Walkthrough / Quiz
  sections with prev/next links, the final exam, then the capstone brief as
  the final section. All navigation is in-page `#anchors`.
- **Not published:** `video-script.md` files, corpus folders, and anything
  outside the course. Links to unpublished files are rendered as plain text so
  the file has no dead links.

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
