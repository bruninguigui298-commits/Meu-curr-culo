/**
 * Roda o axe-core (WCAG 2.1 A/AA) nas páginas principais.
 * Uso: suba o site (ex.: `npm run dev:demo` no backend, depois de `npm run build` aqui) e rode
 *   BASE_URL=http://localhost:3000 npm run a11y
 * Opcional: SHOTS_DIR=/caminho para salvar screenshots.
 */
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const SHOTS = process.env.SHOTS_DIR;
const PAGES = ['/', '/sobre', '/projetos', '/projetos/mensalli', '/projetos/saas-restaurante', '/como-trabalho-com-ia', '/linha-do-tempo', '/contato', '/curriculo', '/privacidade', '/termos', '/cookies', '/seus-dados', '/admin', '/nao-existe'];
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

(async () => {
  const browser = await chromium.launch();
  let total = 0;
  for (const viewport of [{ width: 1440, height: 900, tag: 'desktop' }, { width: 390, height: 844, tag: 'mobile' }]) {
    const ctx = await browser.newContext({ viewport, reducedMotion: 'reduce', bypassCSP: true });
    const page = await ctx.newPage();
    for (const p of PAGES) {
      await page.goto(BASE + p, { waitUntil: 'networkidle' });
      await page.addScriptTag({ content: axeSource });
      const res = await page.evaluate(() => window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }));
      const scroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      total += res.violations.length + (scroll ? 1 : 0);
      console.log(`${viewport.tag.padEnd(7)} ${p.padEnd(28)} violações: ${res.violations.length}${scroll ? '  ⚠ rolagem horizontal' : ''}`);
      for (const v of res.violations) {
        console.log(`   - [${v.impact}] ${v.id}: ${v.help}`);
        for (const n of v.nodes.slice(0, 3)) console.log(`       ${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`);
      }
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${viewport.tag}${p.replace(/\//g, '_') || '_home'}.png`), fullPage: true });
    }
    await ctx.close();
  }
  await browser.close();
  console.log(total === 0 ? '\naxe: 0 violações ✓' : `\naxe: ${total} problema(s)`);
  process.exit(total === 0 ? 0 : 1);
})();
