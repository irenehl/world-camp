# world-camp

Charla "The creative side of AI with ElevenLabs" (WordCamp Guatemala 2026, sáb 10 oct, 3:00 pm, track Growth).

## Estructura
- `deck/`: presentación en HTML/CSS/JS sin build (escenario fijo de 1920x1080 que se escala). Fuentes locales (Noto Sans para títulos, Archivo para párrafos), así funciona sin internet.
- `deck/assets/brand/`: imágenes de la plantilla oficial WCGT26 (sacadas de `source.pptx` → `pptx/ppt/media`).
- `deck/assets/collage/`: imágenes/videos del collage; se registran en `COLLAGE_MEDIA` dentro de `deck/deck.js`. `murmullo.mp3` (opcional) suena mientras corre el collage.
- `deck/assets/ads/backup.mp4`: anuncio de respaldo (slide 7 y tecla B).
- `flow/flow-spec.md`: especificación del flow de ElevenCreative Flows para la demo en vivo.

## Correr
```
cd deck && python3 -m http.server 4173
```
Abrir http://localhost:4173. Teclas: →/espacio siguiente, ← anterior, F pantalla completa, P vista de presentadora, B anuncio de respaldo.

## Demo en vivo
Un solo estilo ("anuncio real y cálido"), sin votación: alguien del público ofrece algo que vende, se entrevista (nombre/producto, qué lo hace diferente, dónde comprarlo) y se corre un único flow. Detalle en `flow/flow-spec.md`.

## Convenciones
- Paleta oficial: #3055f2, #3bd8f2, #3aba24, #ffd200, #fe8600, #127533, #c9372c, #041f33, #f8faff.
- Animaciones: `data-anim` (fade-up, left, scale, pop, reveal, stamp) + `data-step="n"` para pasos dentro de una slide; `--d` = delay.
- Notas de la presentadora en `<aside class="notes">` por slide.
