#!/usr/bin/env node
// Post-build sanity check for the single-file site: every internal #anchor in
// docs/index.html must resolve to a real id, and no relative file links may
// remain (everything internal should be a #fragment). Build-time QA only.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs', 'index.html');
const html = fs.readFileSync(FILE, 'utf8');

const ids = new Set();
for (const m of html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);

let bad = 0, anchors = 0;
for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const url = m[1];
  if (/^(https?:|mailto:|data:)/.test(url)) continue;
  if (url.startsWith('#')) {
    anchors++;
    if (!ids.has(url.slice(1))) {
      console.log(`MISSING ANCHOR → ${url}`);
      bad++;
    }
  } else {
    console.log(`RELATIVE FILE LINK (should be a #fragment) → ${url}`);
    bad++;
  }
}
console.log(`1 file, ${ids.size} ids, ${anchors} internal anchors checked, ${bad} broken`);
process.exit(bad ? 1 : 0);
