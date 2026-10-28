/** Gera public/og.png (1200x630), a imagem que aparece ao compartilhar o link. Uso: node scripts/og.cjs */
const path = require('node:path');
const { chromium } = require('playwright');
const fs = require('node:fs');
const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(__dirname, '..', 'node_modules', '@fontsource', 'geist', 'files', f)).toString('base64');
const html = `<!doctype html><html><head><style>
@font-face { font-family: G; src: url('${font('geist-latin-800-normal.woff2')}'); font-weight: 800; }
@font-face { font-family: G; src: url('${font('geist-latin-500-normal.woff2')}'); font-weight: 500; }
body { margin: 0; width: 1200px; height: 630px; background: #0E1024; font-family: G; color: #EEF0FF; overflow: hidden; position: relative; }
.glow { position: absolute; inset: 0; background: radial-gradient(700px 400px at 90% 0%, rgba(156,140,255,.35), transparent 70%), radial-gradient(600px 400px at 0% 100%, rgba(111,242,216,.18), transparent 70%); }
.route { position: absolute; right: 110px; top: 70px; bottom: 70px; width: 4px; border-radius: 4px; background: linear-gradient(#6FF2D8, #9C8CFF 55%, #FFB547); box-shadow: 0 0 24px rgba(111,242,216,.6); }
.dot { position: absolute; right: 101px; width: 22px; height: 22px; border-radius: 50%; background: #0E1024; border: 4px solid #6FF2D8; }
.box { position: absolute; left: 80px; top: 80px; right: 220px; }
.who { font-size: 30px; font-weight: 500; color: #A4A9C9; margin: 0 0 28px; }
h1 { font-size: 120px; line-height: .9; letter-spacing: -6px; margin: 0; font-weight: 800; }
p { font-size: 32px; font-weight: 500; color: #A4A9C9; margin: 34px 0 0; }
.url { position: absolute; left: 80px; bottom: 64px; font-size: 30px; font-weight: 500; color: #6FF2D8; }
</style></head><body><div class="glow"></div><div class="route"></div>
<div class="dot" style="top:90px"></div><div class="dot" style="top:220px"></div><div class="dot" style="top:350px;border-color:#9C8CFF"></div><div class="dot" style="top:480px;border-color:#FFB547"></div>
<div class="box"><p class="who">Bruno Pereira Bento, desenvolvedor back-end</p><h1>Eu dirijo,<br>a IA acelera.</h1><p>Programo sozinho. Hoje, com vibe coding.</p></div>
<div class="url">brunosyster.com</div></body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(__dirname, '..', 'public', 'og.png') });
  await b.close();
  console.log('public/og.png gerado');
})();
