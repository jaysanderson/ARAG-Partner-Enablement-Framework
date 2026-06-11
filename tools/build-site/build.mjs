#!/usr/bin/env node
/**
 * Single-file static site generator for the Developer Foundations course.
 *
 * Reads markdown from courses/developer-foundations/ (source of truth — never
 * modified) and writes ONE self-contained HTML file: docs/index.html.
 * CSS is inlined; the only JavaScript is a ~20-line inline hash router that
 * shows one course page at a time (SPA feel) — quiz answer keys use native
 * <details>/<summary>. Without JavaScript the file degrades to one scrolling
 * document (<noscript> style). The file opens by double-clicking it, attaches
 * to an email, and works identically on any static host.
 *
 * Every course page becomes a <section id="…">; all cross-page links become
 * #fragment links. Heading anchors are prefixed with their section id so they
 * stay unique across the combined document.
 *
 * Zero dependencies — the markdown renderer below covers the (GFM) dialect
 * actually used by the course files: ATX headings, paragraphs, blockquotes,
 * fenced code (incl. inside list items, ````-fences, and two legacy source
 * quirks handled inline), pipe tables, nested lists, hr, inline
 * code/bold/italic/links, raw <details>/<summary> blocks.
 * QA: tools/build-site/check-links.mjs verifies every anchor resolves.
 *
 * Run: node tools/build-site/build.mjs   (or tools/build-site/rebuild.sh)
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');
const SRC = path.join(REPO, 'courses', 'developer-foundations');
const OUT = path.join(REPO, 'docs');

// ---------------------------------------------------------------------------
// Markdown renderer
// ---------------------------------------------------------------------------

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// GitHub-style heading slugs, prefixed with the section id for global
// uniqueness; ctx.slugs dedupes within one section.
function slugify(raw, ctx) {
  const plain = raw
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*?/g, '');
  let slug = plain
    .toLowerCase()
    .replace(/[^\p{L}\p{N} -]/gu, '')
    .replace(/ /g, '-');
  const n = ctx.slugs.get(slug) ?? 0;
  ctx.slugs.set(slug, n + 1);
  if (n > 0) slug = `${slug}-${n}`;
  return `${ctx.prefix}--${slug}`;
}

// --- build-time syntax highlighting (regex tokenizers, hljs-* classes) -----

const LANG_RULES = {
  js: [
    ['hljs-comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
    ['hljs-string', /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\[\s\S])*`/],
    ['hljs-keyword', /\b(?:const|let|var|function|return|import|export|from|default|async|await|if|else|for|while|do|new|class|extends|try|catch|finally|throw|typeof|instanceof|of|in|switch|case|break|continue|delete|void|yield|static|get|set|type|interface|enum|implements|declare|as|satisfies|public|private|protected|readonly)\b/],
    ['hljs-literal', /\b(?:true|false|null|undefined|NaN|Infinity)\b/],
    ['hljs-number', /\b\d[\d_]*(?:\.\d+)?\b/],
  ],
  json: [
    ['hljs-attr', /"(?:[^"\\]|\\.)*"(?=\s*:)/],
    ['hljs-string', /"(?:[^"\\]|\\.)*"/],
    ['hljs-literal', /\b(?:true|false|null)\b/],
    ['hljs-number', /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/],
  ],
  bash: [
    ['hljs-string', /'[^']*'|"(?:[^"\\]|\\.)*"/],
    ['hljs-comment', /(?:^|(?<=\s))#[^\n]*/],
    ['hljs-variable', /\$\{[^}]*\}|\$\w+/],
    ['hljs-keyword', /\b(?:if|then|else|elif|fi|for|do|done|while|until|case|esac|function|echo|cd|export|source|return|exit)\b/],
  ],
  html: [
    ['hljs-comment', /<!--[\s\S]*?-->/],
    ['hljs-string', /"[^"]*"|'[^']*'/],
    ['hljs-keyword', /<\/?[a-zA-Z][\w-]*|\/?>/],
    ['hljs-attr', /\b[a-zA-Z-]+(?==)/],
  ],
};
const LANG_ALIASES = {
  javascript: 'js', mjs: 'js', ts: 'js', tsx: 'js', jsx: 'js', typescript: 'js',
  shell: 'bash', sh: 'bash', zsh: 'bash', xml: 'html', svelte: 'html', vue: 'html',
};

function highlight(code, lang) {
  const rules = LANG_RULES[LANG_ALIASES[lang] ?? lang];
  if (!rules) return escapeHtml(code);
  const combined = new RegExp(rules.map(([, re]) => `(${re.source})`).join('|'), 'gm');
  let out = '';
  let last = 0;
  for (const m of code.matchAll(combined)) {
    out += escapeHtml(code.slice(last, m.index));
    const g = m.slice(1).findIndex((x) => x !== undefined);
    out += `<span class="${rules[g][0]}">${escapeHtml(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + escapeHtml(code.slice(last));
}

// --- inline pass ------------------------------------------------------------

const RAW_INLINE_TAGS = /<\/?(?:details|summary|strong|em|br|kbd|mark|sub|sup|b|i)(?:\s[^<>]*)?>/g;

function emphasis(s) {
  return s
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
}

function inline(text) {
  const stash = [];
  const put = (html) => `\x00${stash.push(html) - 1}\x00`;
  let s = text;
  s = s.replace(/(`+)([\s\S]*?)\1/g, (m, t, c) => put(`<code>${escapeHtml(c.trim())}</code>`));
  s = s.replace(RAW_INLINE_TAGS, (m) => put(m));
  s = escapeHtml(s);
  s = s.replace(/\[([^\]]*)\]\(([^()\s]+(?:\([^()\s]*\))?)\)/g, (m, txt, href) =>
    put(`<a href="${href}">${emphasis(txt)}</a>`),
  );
  s = emphasis(s);
  while (/\x00\d+\x00/.test(s)) s = s.replace(/\x00(\d+)\x00/g, (_, n) => stash[n]);
  return s;
}

// --- block pass ---------------------------------------------------------------

const stripN = (l, n) => {
  let k = 0;
  while (k < n && l[k] === ' ') k++;
  return l.slice(k);
};

const TABLE_DELIM = /^\s*\|?[\s|:-]*-[\s|:-]*\|?\s*$/;
const RAW_BLOCK = /^\s*<\/?(?:details|summary|div)\b/;

function splitRow(row) {
  const stash = [];
  const protectedRow = row.replace(/(`+)([\s\S]*?)\1/g, (m) => `\x01${stash.push(m) - 1}\x01`);
  let cells = protectedRow.trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
  return cells.map((c) => c.replace(/\x01(\d+)\x01/g, (_, n) => stash[n]).trim());
}

function parseBlocks(lines, ctx) {
  let html = '';
  let i = 0;
  const n = lines.length;
  while (i < n) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    // fenced code (supports ````-fences so blocks can contain ``` literally)
    const fence = line.match(/^(\s*)(`{3,})([^`]*)$/);
    if (fence) {
      const indent = fence[1].length;
      const marks = fence[2].length;
      const lang = fence[3].trim();
      const body = [];
      i++;
      while (i < n) {
        const l = lines[i];
        const c = l.match(/^(\s*)(`{3,})\s*$/);
        // language-less blocks only close at the opener's indent, so an
        // indented ``` inside a plain block (AI-brief snippets) stays content
        if (c && c[2].length >= marks && (lang !== '' || c[1].length === indent)) { i++; break; }
        // tolerate a closing ``` glued to the end of the last code line
        const glued = l.match(/^(.*\S)```\s*$/);
        if (glued && !/^\s*`{3,}/.test(l)) { body.push(stripN(glued[1], indent)); i++; break; }
        body.push(stripN(l, indent));
        i++;
      }
      const cls = lang ? ` class="hljs language-${escapeHtml(lang)}"` : '';
      html += `<pre><code${cls}>${highlight(body.join('\n'), lang)}\n</code></pre>\n`;
      continue;
    }

    // ATX heading
    const h = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (h) {
      const level = h[1].length;
      const id = slugify(h[2], ctx);
      html += `<h${level} id="${id}">${inline(h[2])}</h${level}>\n`;
      i++;
      continue;
    }

    // hr (the course always uses standalone --- between blank lines)
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { html += '<hr>\n'; i++; continue; }

    // blockquote
    if (/^\s*>/.test(line)) {
      const inner = [];
      while (i < n && /^\s*>/.test(lines[i])) { inner.push(lines[i].replace(/^\s*> ?/, '')); i++; }
      html += `<blockquote>\n${parseBlocks(inner, ctx)}</blockquote>\n`;
      continue;
    }

    // table
    if (line.includes('|') && i + 1 < n && lines[i + 1].includes('-') && TABLE_DELIM.test(lines[i + 1])) {
      const headers = splitRow(line);
      const aligns = splitRow(lines[i + 1]).map((d) =>
        /^:-+:$/.test(d) ? ' style="text-align:center"' : /-+:$/.test(d) ? ' style="text-align:right"' : '',
      );
      i += 2;
      let rows = '';
      while (i < n && lines[i].includes('|') && lines[i].trim() !== '') {
        const cells = splitRow(lines[i]);
        rows += '<tr>' + cells.map((c, k) => `<td${aligns[k] ?? ''}>${inline(c)}</td>`).join('') + '</tr>\n';
        i++;
      }
      html +=
        '<table>\n<thead><tr>' +
        headers.map((c, k) => `<th${aligns[k] ?? ''}>${inline(c)}</th>`).join('') +
        '</tr></thead>\n<tbody>\n' + rows + '</tbody>\n</table>\n';
      continue;
    }

    // list
    const li = line.match(/^(\s*)([-*+]|\d{1,3}[.)])\s+/);
    if (li) {
      const baseIndent = li[1].length;
      const ordered = /\d/.test(li[2][0]);
      const startNum = ordered ? parseInt(li[2], 10) : 1;
      const items = [];
      let cur = null;
      while (i < n) {
        const l = lines[i];
        const m = l.match(/^(\s*)([-*+]|\d{1,3}[.)])\s+(.*)$/);
        if (m && m[1].length === baseIndent && /\d/.test(m[2][0]) === ordered) {
          if (cur) items.push(cur);
          cur = { lines: [m[3]], pad: m[1].length + m[2].length + 1 };
          i++;
        } else if (l.trim() === '') {
          cur.lines.push('');
          i++;
        } else if (l.match(/^\s*/)[0].length > baseIndent) {
          cur.lines.push(stripN(l, cur.pad));
          i++;
        } else break;
      }
      if (cur) items.push(cur);
      const lis = items
        .map((it) => {
          let inner = parseBlocks(it.lines, ctx).trim();
          if (/^<p>[\s\S]*<\/p>$/.test(inner) && inner.indexOf('<p>', 1) === -1) {
            inner = inner.slice(3, -4);
          } else {
            inner = inner.replace(/^<p>([\s\S]*?)<\/p>/, '$1');
          }
          return `<li>${inner}</li>`;
        })
        .join('\n');
      const tag = ordered ? 'ol' : 'ul';
      const startAttr = ordered && startNum !== 1 ? ` start="${startNum}"` : '';
      html += `<${tag}${startAttr}>\n${lis}\n</${tag}>\n`;
      continue;
    }

    // raw HTML block line (<details>, <summary…>, <div…> authored in the md)
    if (RAW_BLOCK.test(line)) { html += line + '\n'; i++; continue; }

    // paragraph
    const para = [line];
    i++;
    while (
      i < n &&
      lines[i].trim() !== '' &&
      !/^(\s*)(#{1,6}\s|>|```|([-*+]|\d{1,3}[.)])\s)/.test(lines[i]) &&
      !RAW_BLOCK.test(lines[i]) &&
      !/^\s*(-{3,}|\*{3,})\s*$/.test(lines[i])
    ) { para.push(lines[i]); i++; }
    // Quiz answer options (A. / B. / C. / D. on consecutive lines) keep their
    // line breaks; all other soft breaks collapse per CommonMark.
    const joined = para
      .map((l, k) => (k > 0 && /^[A-D]\.\s/.test(l.trim()) ? '\x02' + l : l))
      .join('\n');
    html += `<p>${inline(joined).replace(/\n\x02/g, '<br>\n')}</p>\n`;
  }
  return html;
}

function renderMarkdown(md, prefix) {
  return parseBlocks(md.replace(/\r\n/g, '\n').split('\n'), { prefix, slugs: new Map() });
}

// ---------------------------------------------------------------------------
// Page model — discovered from the folder structure, no hardcoded build list.
// ---------------------------------------------------------------------------

const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(SRC, rel));
const h1Of = (md) => (md.match(/^# (.+)$/m) || [, 'Untitled'])[1].trim();

const buildDirs = fs
  .readdirSync(path.join(SRC, 'builds'))
  .filter((d) => /^build-\d{2}/.test(d))
  .sort();

// Each course page → one <section id>. Section ids are short and stable.
const pages = [];
const addPage = (p) => pages.push(p);

addPage({ src: 'README.md', id: 'home', title: 'Developer Foundations', kind: 'landing' });
addPage({ src: 'OVERVIEW.md', id: 'overview', title: h1Of(read('OVERVIEW.md')), kind: 'page' });
addPage({ src: 'vibe-coding-guide.md', id: 'vibe-coding-guide', title: h1Of(read('vibe-coding-guide.md')), kind: 'page' });

const PARTS = [
  ['README.md', '', 'Overview', 'build-index'],
  ['1-lesson.md', 'lesson', 'Lesson', 'content'],
  ['2-walkthrough.md', 'walkthrough', 'Walkthrough', 'content'],
  ['3-quiz.md', 'quiz', 'Quiz', 'quiz'],
];
const buildMeta = [];

for (const dir of buildDirs) {
  const isCapstone = !exists(`builds/${dir}/1-lesson.md`);
  const buildTitle = h1Of(read(`builds/${dir}/README.md`));
  const shortId = dir.match(/^build-\d{2}/)[0]; // e.g. "build-05"
  buildMeta.push({ dir, id: shortId, title: buildTitle, isCapstone });

  if (isCapstone) {
    addPage({ src: `builds/${dir}/README.md`, id: shortId, title: buildTitle, kind: 'capstone', build: dir });
    for (const variant of ['atlas-operations', 'aurora-concierge']) {
      if (!exists(`builds/${dir}/${variant}/README.md`)) continue;
      addPage({
        src: `builds/${dir}/${variant}/README.md`, id: `${shortId}-${variant.split('-')[0]}`,
        title: h1Of(read(`builds/${dir}/${variant}/README.md`)), kind: 'capstone-variant', build: dir,
      });
    }
  } else {
    for (const [file, suffix, label, kind] of PARTS) {
      if (!exists(`builds/${dir}/${file}`)) continue;
      addPage({
        src: `builds/${dir}/${file}`, id: suffix ? `${shortId}-${suffix}` : shortId,
        title: `${buildTitle} — ${label}`, kind, build: dir, partLabel: label,
      });
    }
  }
}

addPage({ src: 'final-exam.md', id: 'final-exam', title: h1Of(read('final-exam.md')), kind: 'quiz' });

// Document order: home, overview, vibe guide, builds 0–12, final exam,
// capstone chooser, capstone variants. The capstone block is the final page.
const bySrc = (src) => pages.find((p) => p.src === src);
const order = [bySrc('README.md'), bySrc('OVERVIEW.md'), bySrc('vibe-coding-guide.md')];
for (const { dir, isCapstone } of buildMeta) {
  if (isCapstone) continue;
  for (const [file] of PARTS) if (bySrc(`builds/${dir}/${file}`)) order.push(bySrc(`builds/${dir}/${file}`));
}
order.push(bySrc('final-exam.md'));
for (const { dir, isCapstone } of buildMeta) {
  if (!isCapstone) continue;
  order.push(bySrc(`builds/${dir}/README.md`));
  for (const p of pages) if (p.kind === 'capstone-variant' && p.build === dir) order.push(p);
}

// Reading chain for prev/next (reference pages excluded).
const chain = order.filter((p) => !['page'].includes(p.kind));

// Source path (and directory form) → section id, for link rewriting.
const srcToId = new Map();
for (const p of pages) {
  srcToId.set(p.src, p.id);
  if (p.src.endsWith('/README.md')) srcToId.set(p.src.slice(0, -'README.md'.length), p.id);
}
srcToId.set('', 'home');

// Rewrite repo-relative links to in-document #anchors; unlink targets that// are not published (corpus files, framework root).
function rewriteLinks(html, page) {
  const srcDir = path.posix.dirname(page.src) === '.' ? '' : path.posix.dirname(page.src);
  return html.replace(/<a\s+href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, (m, href, attrs, inner) => {
    if (/^(https?:|mailto:)/.test(href)) return m;
    if (href.startsWith('#')) return `<a href="#${page.id}--${href.slice(1)}">${inner}</a>`; // same-page anchor
    const [target, frag = ''] = href.split(/(?=#)/);
    let resolved = path.posix.normalize(path.posix.join(srcDir, decodeURI(target)));
    if (resolved === '.' || resolved === './') resolved = '';
    if (resolved.startsWith('..')) return inner; // escapes the course → unpublished
    const id =
      srcToId.get(resolved) ??
      (resolved.endsWith('/')
        ? srcToId.get(resolved + 'README.md')
        : srcToId.get(resolved + '/README.md') ?? srcToId.get(resolved + '/'));
    if (!id) return inner; // unpublished (corpus/, assets/…)
    return `<a href="#${frag ? `${id}--${frag.slice(1)}` : id}">${inner}</a>`;
  });
}

// Quizzes + final exam become runnable: options turn into radio groups, a
// "Check my answers" button grades against the answer key (parsed from the
// "## Answer key" section at build time) and reports the score against the
// quiz's pass mark. The static reveal-the-key <details> stays as a fallback.
function renderQuiz(md, prefix) {
  const m = md.match(/^## Answer key\s*$/m);
  if (!m) return renderMarkdown(md, prefix);
  const head = md.slice(0, m.index);
  const tail = md.slice(m.index + m[0].length);

  const keyMap = new Map([...tail.matchAll(/(\d+)\.\s*([A-D])\b/g)].map((k) => [+k[1], k[2]]));
  const pass = +(tail.match(/(\d+)\+\s*correct/)?.[1] ?? 0);

  // The options paragraph renders as "<p>A. …<br>\nB. …<br>\nC. …</p>" —
  // rebuild each into a radio fieldset, numbered in document order.
  let qNum = 0;
  const body = renderMarkdown(head, prefix).replace(/<p>(A\. [\s\S]*?)<\/p>/g, (m0, inner) => {
    const parts = inner.split(/<br>\n(?=[A-D]\. )/);
    if (parts.length < 2) return m0;
    qNum++;
    const answer = keyMap.get(qNum) ?? '';
    const opts = parts
      .map((p) => {
        const letter = p[0];
        const text = p.slice(3).replace(/<br>\n?$/, '');
        return `<label data-letter="${letter}"><input type="radio" name="${prefix}-q${qNum}"><span class="opt">${letter}.</span> <span>${text}</span></label>`;
      })
      .join('\n');
    return `<fieldset class="quiz-q" data-answer="${answer}">\n${opts}\n</fieldset>`;
  });
  if (qNum !== keyMap.size) {
    console.warn(`WARNING ${prefix}: ${qNum} option blocks vs ${keyMap.size} answer-key entries`);
  }

  return (
    body +
    `<div class="quiz-controls">
<button type="button" class="button quiz-check" data-pass="${pass}">Check my answers</button>
<p class="quiz-result" hidden></p>
</div>\n` +
    '<details class="answer-key"><summary>Reveal answer key</summary>\n' +
    renderMarkdown(tail, prefix) +
    '</details>\n'
  );
}

// ---------------------------------------------------------------------------
// Section chrome
// ---------------------------------------------------------------------------

function sectionShell(page, bodyHtml) {
  let crumbs = `<a href="#home">Developer Foundations</a>`;
  let tabs = '';
  if (page.build) {
    const meta = buildMeta.find((b) => b.dir === page.build);
    if (page.id !== meta.id) {
      crumbs += ` <span class="sep">/</span> <a href="#${meta.id}">${escapeHtml(meta.title)}</a>`;
    } else {
      crumbs += ` <span class="sep">/</span> <span>${escapeHtml(meta.title)}</span>`;
    }
    let items;
    if (meta.isCapstone) {
      items = [
        ['Brief', meta.id],
        ['Atlas Operations', `${meta.id}-atlas`],
        ['Aurora Concierge', `${meta.id}-aurora`],
      ];
    } else {
      items = PARTS.filter(([f]) => exists(`builds/${page.build}/${f}`)).map(([, suffix, label]) => [
        label,
        suffix ? `${meta.id}-${suffix}` : meta.id,
      ]);
    }
    tabs =
      '<nav class="tabs">' +
      items
        .map(([label, id]) =>
          id === page.id ? `<span class="tab current">${label}</span>` : `<a class="tab" href="#${id}">${label}</a>`,
        )
        .join('') +
      '</nav>';
  }

  let footNav = '';
  const i = chain.findIndex((p) => p.id === page.id);
  if (i !== -1) {
    const prev = chain[i - 1];
    const next = chain[i + 1];
    footNav =
      '<nav class="pager">' +
      (prev ? `<a class="prev" href="#${prev.id}">&larr; ${escapeHtml(prev.title)}</a>` : '<span></span>') +
      (next ? `<a class="next" href="#${next.id}">${escapeHtml(next.title)} &rarr;</a>` : '<span></span>') +
      '</nav>';
  }

  return `<section class="page" id="${page.id}">
<header class="section-header">
  <div class="crumbs">${crumbs} <a class="toc-link" href="#home">Contents ↑</a></div>
  ${tabs}
</header>
${bodyHtml}
${footNav}
</section>
`;
}

// ---------------------------------------------------------------------------
// Landing section — hero + start-here + ordered topic index, then the course
// README content (its own h1 dropped; the hero replaces it).
// ---------------------------------------------------------------------------

function landingBody(page) {
  const readme = read('README.md').replace(/^# .+\n/, '');
  const topicRows = buildMeta
    .map((b) => {
      if (b.isCapstone) {
        return `<li><a href="#${b.id}"><strong>${escapeHtml(b.title)}</strong></a>
          <span class="parts"><a href="#${b.id}-atlas">Atlas brief</a> · <a href="#${b.id}-aurora">Aurora brief</a></span></li>`;
      }
      return `<li><a href="#${b.id}"><strong>${escapeHtml(b.title)}</strong></a>
        <span class="parts"><a href="#${b.id}-lesson">Lesson</a> · <a href="#${b.id}-walkthrough">Walkthrough</a> · <a href="#${b.id}-quiz">Quiz</a></span></li>`;
    })
    .join('\n');

  const hero = `
<div class="hero">
  <h1>Developer Foundations</h1>
  <p class="tagline">The on-ramp course for partners building on Progress Agentic RAG. Thirteen builds plus a capstone — lesson, hands-on walkthrough, and quiz for each.</p>
  <p class="start-here"><a class="button" href="#${buildMeta[0].id}">Start here → Build 0</a>
     <a class="quiet" href="#overview">Should I take this course?</a></p>
</div>
<section class="topic-index">
  <h2 id="home--course-contents">Course contents</h2>
  <ol class="topics">
${topicRows}
  </ol>
  <p class="extras"><a href="#final-exam">Final exam</a> · <a href="#vibe-coding-guide">Vibe-coding guide</a> · <a href="#overview">Course overview</a></p>
</section>
<hr>
`;
  return hero + rewriteLinks(renderMarkdown(readme, page.id), page);
}

// ---------------------------------------------------------------------------
// Capstone section — append generated build-and-submit block with a clearly
// marked editable placeholder for the submission channel.
// ---------------------------------------------------------------------------

const SUBMIT_BLOCK = `
<!-- ======================================================================
     EDITABLE PLACEHOLDER — set your submission channel before publishing.
     Replace the [SET SUBMISSION CHANNEL] token below with the real channel,
     e.g. a Slack channel (#capstone-submissions), a partner-portal URL, or
     a review-board email address. This block is generated by
     tools/build-site/build.mjs — edit it there, then rebuild.
     ====================================================================== -->
<section class="submit-box">
  <h2>Build &amp; submit</h2>
  <ol>
    <li>Pass the <a href="#final-exam">final exam</a> (the gate above).</li>
    <li>Pick one variant and build it to the brief — <a href="#build-13-atlas">Atlas Operations</a> (Enterprise) or <a href="#build-13-aurora">Aurora Concierge</a> (Customer Experience).</li>
    <li>Deploy at your own domain and rehearse the 25-minute end-to-end demo until it runs without code edits.</li>
    <li>Send the review board your deployed URL, repo access, and demo availability via
      <mark class="placeholder">[SET SUBMISSION CHANNEL — e.g. #capstone-submissions or your partner-portal URL]</mark>.</li>
  </ol>
  <p>A Progress-led review board schedules the live defence; the pass rubric is above.</p>
</section>
`;

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

const sections = order
  .map((page) => {
    let body;
    if (page.kind === 'landing') {
      body = landingBody(page);
    } else if (page.kind === 'quiz') {
      body = rewriteLinks(renderQuiz(read(page.src), page.id), page);
    } else if (page.kind === 'capstone') {
      body = rewriteLinks(renderMarkdown(read(page.src), page.id), page) + SUBMIT_BLOCK;
    } else {
      body = rewriteLinks(renderMarkdown(read(page.src), page.id), page);
    }
    return sectionShell(page, body);
  })
  .join('\n');

const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');

// Hash router: shows the section the URL hash points at (or contains), hides
// the rest, scrolls to the right place, and keeps the document title in sync.
// Link clicks are intercepted and routed via pushState so the browser never
// performs its own fragment scroll (no race with ours); back/forward arrives
// through popstate. Browser history works as page history.
const ROUTER = `
(() => {
  history.scrollRestoration = 'manual';

  // SCORM 1.2 glue: when launched from an LMS, report status, score on the
  // final exam, and bookmark the current page. No-op in a plain browser.
  const lms = (() => {
    const find = (win) => {
      for (let i = 0; i < 10 && win; i++) {
        try { if (win.API) return win.API; } catch { return null; }
        if (win.parent === win) break;
        win = win.parent;
      }
      return null;
    };
    let api = null;
    try { api = find(window) ?? (window.opener ? find(window.opener) : null); } catch { api = null; }
    if (!api) return null;
    api.LMSInitialize('');
    const status = api.LMSGetValue('cmi.core.lesson_status');
    if (status === 'not attempted' || status === '') api.LMSSetValue('cmi.core.lesson_status', 'incomplete');
    window.addEventListener('beforeunload', () => api.LMSFinish(''));
    return api;
  })();
  if (lms) {
    const mark = lms.LMSGetValue('cmi.core.lesson_location');
    if (mark && !location.hash) location.hash = mark;
  }

  const route = () => {
    const hash = decodeURIComponent(location.hash.slice(1));
    const target = hash ? document.getElementById(hash) : null;
    const page = target?.closest('section.page') ?? document.getElementById('home');
    document.querySelectorAll('section.page.current').forEach((s) => s.classList.remove('current'));
    page.classList.add('current');
    if (target && target !== page) target.scrollIntoView();
    else window.scrollTo(0, 0);
    document.title = (page.querySelector('h1')?.textContent ?? 'Developer Foundations') + ' \\u00b7 Developer Foundations';
    if (lms) lms.LMSSetValue('cmi.core.lesson_location', location.hash);
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const href = a.getAttribute('href');
    try {
      if (href !== location.hash) history.pushState(null, '', href);
    } catch {
      location.hash = href; // sandboxed LMS players can refuse pushState
      return;
    }
    route();
  });
  window.addEventListener('popstate', route);
  route();

  // Quiz grading: mark each answered question, score against the pass mark.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button.quiz-check');
    if (!btn) return;
    const scope = btn.closest('section.page');
    const questions = scope.querySelectorAll('fieldset.quiz-q');
    let right = 0;
    let answered = 0;
    questions.forEach((fs) => {
      fs.classList.remove('correct', 'wrong');
      fs.querySelectorAll('label').forEach((l) => l.classList.remove('is-answer'));
      const sel = fs.querySelector('input:checked');
      if (!sel) return;
      answered++;
      const ok = sel.closest('label').dataset.letter === fs.dataset.answer;
      if (ok) right++;
      fs.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) {
        const good = fs.querySelector('label[data-letter="' + fs.dataset.answer + '"]');
        if (good) good.classList.add('is-answer');
      }
    });
    const total = questions.length;
    const pass = +btn.dataset.pass || 0;
    if (lms && scope.id === 'final-exam' && answered === total) {
      lms.LMSSetValue('cmi.core.score.min', '0');
      lms.LMSSetValue('cmi.core.score.max', String(total));
      lms.LMSSetValue('cmi.core.score.raw', String(right));
      if (right >= pass) lms.LMSSetValue('cmi.core.lesson_status', 'passed');
      lms.LMSCommit('');
    }
    const out = scope.querySelector('.quiz-result');
    out.hidden = false;
    out.classList.remove('pass', 'fail');
    if (answered < total) {
      out.textContent = 'Answered ' + answered + ' of ' + total + ' \\u2014 answer every question, then check again.';
    } else if (right >= pass) {
      out.classList.add('pass');
      out.textContent = 'Score ' + right + '/' + total + ' \\u2014 pass! (' + pass + '+ needed)';
    } else {
      out.classList.add('fail');
      out.textContent = 'Score ' + right + '/' + total + ' \\u2014 below the pass mark (' + pass + '+ needed). Review the lesson and try again.';
    }
  });
})();
`;

const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Developer Foundations · Progress Agentic RAG Partner Course</title>
<style>
${css}
</style>
<noscript><style>section.page { display: block !important; }</style></noscript>
</head>
<body>
<main>
${sections}
</main>
<footer class="site-footer">
  <p>Developer Foundations · Progress Agentic RAG Partner Enablement Framework</p>
</footer>
<script>${ROUTER}</script>
</body>
</html>
`;

// ---------------------------------------------------------------------------
// SCORM 1.2 package — single SCO wrapping the same index.html, plus the
// imsmanifest.xml an LMS needs. The page's inline SCORM glue reports status,
// bookmarks the current page, and posts the final-exam score (pass = 80%).
// ---------------------------------------------------------------------------

const SCORM_MANIFEST = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.progress.arag.developer-foundations" version="1.0"
    xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
    xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org-developer-foundations">
    <organization identifier="org-developer-foundations">
      <title>Developer Foundations · Progress Agentic RAG</title>
      <item identifier="item-course" identifierref="res-course" isvisible="true">
        <title>Developer Foundations</title>
        <adlcp:masteryscore>80</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res-course" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>
`;

// Minimal ZIP writer (deflate via node:zlib) — keeps the build dependency-free.
function buildZip(entries) {
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = (((now.getFullYear() - 1980) & 0x7f) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const locals = [];
  const central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, 'utf8');
    const crc = zlib.crc32(data) >>> 0;
    const deflated = zlib.deflateRawSync(data, { level: 9 });
    const stored = deflated.length >= data.length;
    const payload = stored ? data : deflated;
    const method = stored ? 0 : 8;
    const lfh = Buffer.alloc(30);
    lfh.writeUInt32LE(0x04034b50, 0);
    lfh.writeUInt16LE(20, 4);
    lfh.writeUInt16LE(method, 8);
    lfh.writeUInt16LE(dosTime, 10);
    lfh.writeUInt16LE(dosDate, 12);
    lfh.writeUInt32LE(crc, 14);
    lfh.writeUInt32LE(payload.length, 18);
    lfh.writeUInt32LE(data.length, 22);
    lfh.writeUInt16LE(nameBuf.length, 26);
    locals.push(lfh, nameBuf, payload);
    const cdh = Buffer.alloc(46);
    cdh.writeUInt32LE(0x02014b50, 0);
    cdh.writeUInt16LE(20, 4);
    cdh.writeUInt16LE(20, 6);
    cdh.writeUInt16LE(method, 10);
    cdh.writeUInt16LE(dosTime, 12);
    cdh.writeUInt16LE(dosDate, 14);
    cdh.writeUInt32LE(crc, 16);
    cdh.writeUInt32LE(payload.length, 20);
    cdh.writeUInt32LE(data.length, 24);
    cdh.writeUInt16LE(nameBuf.length, 28);
    cdh.writeUInt32LE(offset, 42);
    central.push(cdh, nameBuf);
    offset += 30 + nameBuf.length + payload.length;
  }
  const cd = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cd.length, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, eocd]);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), doc);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

const zip = buildZip([
  { name: 'imsmanifest.xml', data: Buffer.from(SCORM_MANIFEST, 'utf8') },
  { name: 'index.html', data: Buffer.from(doc, 'utf8') },
]);
fs.writeFileSync(path.join(OUT, 'developer-foundations-scorm12.zip'), zip);

const kb = Math.round(Buffer.byteLength(doc) / 1024);
console.log(`Built ${order.length} sections into one file → docs/index.html (${kb} KB)`);
console.log(`SCORM 1.2 package → docs/developer-foundations-scorm12.zip (${Math.round(zip.length / 1024)} KB)`);
