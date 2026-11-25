#!/usr/bin/env node
// Mobile layout and contrast check. Fails (exit 1) if any main page is wider than a
// phone screen or has text with low colour contrast (WCAG AA, via axe-core).
// Usage: BASE_URL=https://preview-url node scripts/mobile-check.mjs
// Optional: VERCEL_BYPASS=<protection bypass secret> for protected preview deployments.
import { chromium } from 'playwright';
import { createRequire } from 'module';
import { readFileSync } from 'fs';

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = (process.env.BASE_URL || 'https://pimofydigital.com').replace(/\/$/, '');
const PAGES = (process.env.CHECK_PAGES || [
  '/', '/about', '/solutions', '/data-operations', '/industries', '/capacity-audit',
  '/contact', '/ai-services', '/ai-visibility-review', '/blog', '/locations',
  '/blog/aeo-vs-seo-vs-geo', '/privacy', '/terms'
].join(',')).split(',').map(p => p.trim()).filter(Boolean);
const WIDTHS = [{ name: 'phone', width: 360, height: 780 }, { name: 'tablet', width: 768, height: 1024 }];

const headers = process.env.VERCEL_BYPASS
  ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS, 'x-vercel-set-bypass-cookie': 'true' } : {};

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const failures = [];
for (const vp of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: true, hasTouch: true, bypassCSP: true, extraHTTPHeaders: headers });
  for (const path of PAGES) {
    const page = await ctx.newPage();
    const label = `${path} @ ${vp.name} ${vp.width}px`;
    try {
      const res = await page.goto(BASE + path, { waitUntil: 'load', timeout: 30000 });
      if (!res || res.status() >= 400) { failures.push(`${label}: HTTP ${res ? res.status() : 'no response'}`); await page.close(); continue; }
      await page.evaluate(() => {
        document.querySelectorAll('.cookie-banner').forEach(e => e.remove());
        document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible'));
      });
      await page.waitForTimeout(600);
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
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();

if (failures.length) {
  console.error(`Mobile check FAILED (${failures.length} problem(s)) on ${BASE}:`);
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`Mobile check passed: ${PAGES.length} pages x ${WIDTHS.length} widths on ${BASE}`);
