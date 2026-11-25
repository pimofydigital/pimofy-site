#!/usr/bin/env node
// Mobile layout and contrast check for pimofydigital.com.
// Loads every URL in the site's sitemap.xml at phone (360px) and tablet (768px) widths and
// fails (exit 1) if any page is wider than the screen or has low-contrast text (WCAG AA, axe-core).
// Usage: BASE_URL=https://preview-url npm run check:mobile
// Optional env:
//   CHECK_PAGES=/,/about      check only these paths instead of the sitemap
//   CONCURRENCY=4             pages checked in parallel (default 4)
//   VERCEL_BYPASS=<secret>    Vercel protection bypass secret for protected previews
//   CHROME_PATH=<path>        use a specific Chromium binary
import { chromium } from 'playwright';
import { createRequire } from 'module';
import { readFileSync } from 'fs';

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = (process.env.BASE_URL || 'https://pimofydigital.com').replace(/\/$/, '');
const CONCURRENCY = Math.max(1, parseInt(process.env.CONCURRENCY || '4', 10));
const WIDTHS = [{ name: 'phone', width: 360, height: 780 }, { name: 'tablet', width: 768, height: 1024 }];
const headers = process.env.VERCEL_BYPASS
  ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS, 'x-vercel-set-bypass-cookie': 'true' } : {};

async function sitemapPaths() {
  const res = await fetch(BASE + '/sitemap.xml', { headers });
  if (!res.ok) throw new Error(`could not load ${BASE}/sitemap.xml (HTTP ${res.status})`);
  const xml = await res.text();
  const paths = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => {
    try { const u = new URL(m[1]); return (u.pathname || '/') + u.search; } catch { return null; }
  }).filter(Boolean);
  const unique = [...new Set(paths)];
  if (!unique.length) throw new Error('sitemap.xml has no URLs');
  return unique;
}

const started = Date.now();
let PAGES;
try {
  PAGES = process.env.CHECK_PAGES
    ? process.env.CHECK_PAGES.split(',').map(p => p.trim()).filter(Boolean)
    : await sitemapPaths();
} catch (e) {
  console.error(`Mobile check FAILED: ${e.message}`);
  process.exit(1);
}

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const failures = [];

async function checkPage(ctx, vp, path) {
  const page = await ctx.newPage();
  const label = `${path} @ ${vp.name} ${vp.width}px`;
  try {
    const res = await page.goto(BASE + path, { waitUntil: 'load', timeout: 30000 });
    if (!res || res.status() >= 400) { failures.push(`${label}: HTTP ${res ? res.status() : 'no response'}`); return; }
    await page.evaluate(() => {
      document.querySelectorAll('.cookie-banner').forEach(e => e.remove());
      document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible'));
    });
    await page.waitForTimeout(500);
    const wide = await page.evaluate(() => {
      const W = document.documentElement.clientWidth, out = [];
      document.querySelectorAll('body *').forEach(e => {
        if (e.closest('.tabbar, table, pre, .table-wrap')) return;
        const b = e.getBoundingClientRect(), p = e.parentElement.getBoundingClientRect();
        if (b.width > 0 && b.right > W + 1 && p.right <= W + 1)
          out.push(`<${e.tagName.toLowerCase()} class="${String(e.className).trim()}"> is ${Math.round(b.width)}px wide, ends at ${Math.round(b.right)}px`);
      });
      return { sw: document.documentElement.scrollWidth, W, out };
    });
    if (wide.sw > wide.W + 1) failures.push(`${label}: page is ${wide.sw}px wide, screen is ${wide.W}px`);
    for (const w of wide.out.slice(0, 5)) failures.push(`${label}: wider than screen: ${w}`);
    await page.addScriptTag({ content: AXE });
    const v = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: { type: 'rule', values: ['color-contrast'] }, resultTypes: ['violations'] });
      return r.violations.flatMap(x => x.nodes.map(n => `${n.target.join(' ')}: ${(n.any[0] || {}).message || 'low contrast'}`));
    });
    for (const m of v.slice(0, 8)) failures.push(`${label}: low contrast: ${m}`);
  } catch (e) {
    failures.push(`${label}: could not check (${String(e.message).split('\n')[0]})`);
  } finally {
    await page.close();
  }
}

for (const vp of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: true, hasTouch: true, bypassCSP: true, extraHTTPHeaders: headers });
  const queue = [...PAGES];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await checkPage(ctx, vp, queue.shift());
  }));
  await ctx.close();
}
await browser.close();

const secs = Math.round((Date.now() - started) / 1000);
const unique = [...new Set(failures)].sort();
failures.length = 0; failures.push(...unique);
if (failures.length) {
  console.error(`Mobile check FAILED (${failures.length} problem(s)) on ${BASE}, ${PAGES.length} pages x ${WIDTHS.length} widths, ${secs}s:`);
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`Mobile check passed: ${PAGES.length} pages x ${WIDTHS.length} widths on ${BASE} in ${secs}s`);
