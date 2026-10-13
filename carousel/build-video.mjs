// Arma export/04.mp4 (slide 4 del carrusel) a partir de raw/flow.mov.
// Uso: npm run video   (necesita ffmpeg en el PATH y raw/flow.mov)
import { chromium } from "playwright-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const tmp = join(here, "raw", "layers");
mkdirSync(tmp, { recursive: true });

// Tramos de la grabación: [inicio, fin, velocidad, recorte "w:h:x:y", texto]
const SEGMENTS = [
  [2, 4.5, 1, "1300:1300:500:200", "1 · Subes la foto del producto"],
  [6, 35, 6, "1500:1500:685:150", "2 · Le das Run y se genera todo"],
  [56.5, 59.5, 1, "1340:1340:1126:210", "3 · El post de venta, listo"],
  [151, 156, 1, "1200:1200:946:274", "4 · Y hasta el video"],
];
const WIN = { x: 96, y: 262, size: 888 };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
await page.goto(pathToFileURL(join(here, "index.html")).href + "?export");
await page.evaluate(() => document.fonts.ready);
const slide = await page.$("#p04");

await page.addStyleTag({ content: "#p04 .vwin, #p04 .vlabel { visibility: hidden; }" });
await slide.screenshot({ path: join(tmp, "bg.png") });

await page.addStyleTag({ content: `
  html, body, .preview, #p04 { background: transparent !important; }
  #p04 > * { visibility: hidden !important; }
  #p04 .vlabel { visibility: visible !important; }` });
for (const [i, seg] of SEGMENTS.entries()) {
  await page.$eval("#p04 .vlabel", (el, t) => (el.textContent = t), seg[4]);
  await slide.screenshot({ path: join(tmp, `label${i}.png`), omitBackground: true });
}

await page.setContent(`<body style="margin:0;background:#000"><div id="m" style="width:${WIN.size}px;height:${WIN.size}px;border-radius:28px;background:#fff"></div></body>`);
await (await page.$("#m")).screenshot({ path: join(tmp, "mask.png") });
await browser.close();

const durations = SEGMENTS.map(([a, b, speed]) => (b - a) / speed);
const total = durations.reduce((x, y) => x + y, 0);
const parts = SEGMENTS.map(([a, b, speed, crop], i) =>
  `[0:v]trim=start=${a}:end=${b},setpts=(PTS-STARTPTS)/${speed},crop=${crop},scale=${WIN.size}:${WIN.size},fps=30,format=yuva420p[s${i}]`);
let t = 0;
const labels = SEGMENTS.map((_, i) => {
  const from = t, to = (t += durations[i]);
  const prev = i === 0 ? "base" : `l${i - 1}`;
  return `[${prev}][${i + 3}:v]overlay=0:0:enable='between(t,${from.toFixed(3)},${to.toFixed(3)})'[l${i}]`;
});
const filter = [
  ...parts,
  `${SEGMENTS.map((_, i) => `[s${i}]`).join("")}concat=n=${SEGMENTS.length}:v=1:a=0[v]`,
  `[2:v]format=gray,scale=${WIN.size}:${WIN.size}[mask]`,
  `[v][mask]alphamerge[vm]`,
  `[1:v][vm]overlay=${WIN.x}:${WIN.y}[base]`,
  ...labels,
].join(";");

const args = ["-y", "-v", "error", "-i", join(here, "raw", "flow.mov"),
  "-loop", "1", "-t", String(total), "-i", join(tmp, "bg.png"),
  "-loop", "1", "-t", String(total), "-i", join(tmp, "mask.png"),
  ...SEGMENTS.flatMap((_, i) => ["-loop", "1", "-t", String(total), "-i", join(tmp, `label${i}.png`)]),
  "-filter_complex", filter, "-map", `[l${SEGMENTS.length - 1}]`,
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30", "-crf", "18", "-movflags", "+faststart",
  join(here, "export", "04.mp4")];
execFileSync("ffmpeg", args, { stdio: "inherit" });
console.log(`export/04.mp4 · ${total.toFixed(1)} s`);
