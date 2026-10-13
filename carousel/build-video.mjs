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
// El último tramo es un mosaico con todos los resultados: post arriba; catálogo, story y el clip (en movimiento) abajo.
const SEGMENTS = [
  [2, 4.5, 1, "1300:1300:500:200", "1 · Subes la foto del producto"],
  [6, 35, 6, "1500:1500:685:150", "2 · Le das Run y se genera todo"],
  [56.5, 59.5, 1, "1340:1340:1126:210", "3 · El post de venta, listo"],
  [151, 157, 1, "490:766:1352:560", "4 · Todo listo, de una sola foto", "mosaic"],
];
const MOSAIC_IMAGES = ["post-new.jpg", "catalogo-new.jpg", "story-new.jpg"];
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
const img = 3 + SEGMENTS.length; // primer input de las imágenes del mosaico
const parts = SEGMENTS.map(([a, b, speed, crop, , kind], i) => {
  const clip = `[0:v]trim=start=${a}:end=${b},setpts=(PTS-STARTPTS)/${speed},crop=${crop}`;
  if (kind !== "mosaic") return `${clip},scale=${WIN.size}:${WIN.size},fps=30,format=yuva420p[s${i}]`;
  const d = (b - a) / speed, W = WIN.size, gap = 12, tw = (W - 2 * gap) / 3, th = W - 426 - gap;
  return [
    `color=c=0xE9E6DF:s=${W}x${W}:d=${d}:r=30[canvas${i}]`,
    `[${img}:v]scale=${W}:426,setsar=1[mp${i}]`,
    `[${img + 1}:v]scale=-2:${th},crop=${tw}:${th},setsar=1[mc${i}]`,
    `[${img + 2}:v]scale=-2:${th},crop=${tw}:${th},setsar=1[ms${i}]`,
    `${clip},scale=${tw}:${th},setsar=1,fps=30[mv${i}]`,
    `[canvas${i}][mp${i}]overlay=0:0[m1${i}]`,
    `[m1${i}][mc${i}]overlay=0:${426 + gap}[m2${i}]`,
    `[m2${i}][ms${i}]overlay=${tw + gap}:${426 + gap}[m3${i}]`,
    `[m3${i}][mv${i}]overlay=${2 * (tw + gap)}:${426 + gap}:shortest=1,format=yuva420p[s${i}]`,
  ].join(";");
});
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
  ...MOSAIC_IMAGES.flatMap((f) => ["-loop", "1", "-t", String(total), "-i", join(here, "assets", "img", f)]),
  "-filter_complex", filter, "-map", `[l${SEGMENTS.length - 1}]`,
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30", "-crf", "18", "-movflags", "+faststart",
  join(here, "export", "04.mp4")];
execFileSync("ffmpeg", args, { stdio: "inherit" });
console.log(`export/04.mp4 · ${total.toFixed(1)} s`);
