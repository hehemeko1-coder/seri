const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8') + fs.readFileSync(path.join(root, 'polish.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

test('document has a useful title, description, canonical and social metadata', () => {
  assert.match(html, /<title>[^<]{10,}<\/title>/i);
  assert.match(html, /<meta name="description" content="[^"]{40,}"/i);
  assert.match(html, /rel="canonical" href="https:\/\/seri\.et\//);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="twitter:card"/);
});

test('navigation links point to existing unique section IDs', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, 'IDs must be unique');
  const targets = new Set(ids);
  const localLinks = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
  for (const target of localLinks) assert.ok(targets.has(target), `Missing target #${target}`);
});

test('course guide form has accessible labels and does not silently discard submissions', () => {
  assert.match(html, /<form id="guide-form"/);
  assert.match(html, /for="full-name"/);
  assert.match(html, /for="phone"/);
  assert.match(html, /name="name"[^>]*required/);
  assert.match(html, /name="phone"[^>]*required/);
  assert.match(js, /online request form is not connected yet/i);
  assert.match(js, /aria-live', 'polite'/);
});

test('site uses the SERI wordmark and does not load an unpinned icon CDN', () => {
  assert.match(html, /seri_logo_full_color\.png/);
  assert.doesNotMatch(html, /unpkg\.com\/lucide@latest/);
});

test('responsive and reduced-motion styles are present', () => {
  assert.match(css, /@media\s*\(max-width:\s*680px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test('mobile navigation has accessible expanded state and Escape handling', () => {
  assert.match(html, /aria-expanded="false"/);
  assert.match(js, /event\.key === 'Escape'/);
  assert.match(js, /aria-controls="primary-nav"/);
});
