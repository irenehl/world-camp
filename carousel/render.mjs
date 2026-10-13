// Exporta cada slide del carrusel a PNG de 1080x1350.
// Uso: node render.mjs   (necesita playwright-core: npm i -D playwright-core && npx playwright install chromium)
import { chromium } from "playwright-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "export");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(here, "index.html")).href + "?export");
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);

const posts = await page.$$(".post");
for (const [i, post] of posts.entries()) {
  const file = join(out, `${String(i + 1).padStart(2, "0")}.png`);
  await post.screenshot({ path: file });
  console.log(file);
}

// PDF para LinkedIn (post de documento): una página por slide; la slide 4 usa la portada del video.
await page.addStyleTag({ content: `
  @page { size: 1080px 1350px; margin: 0; }
  body { background: var(--bg); }
  .post { break-after: page; }
  .post:last-child { break-after: auto; }` });
const pdf = join(out, "linkedin.pdf");
await page.pdf({ path: pdf, width: "1080px", height: "1350px", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
console.log(pdf);
await browser.close();
