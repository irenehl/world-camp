# world-camp

Charla "The creative side of AI with ElevenLabs" (WordCamp Guatemala 2026, sáb 10 oct, 3:00 pm, track Growth).

## Estructura
- `deck/`: presentación en HTML/CSS/JS sin build (escenario fijo de 1920x1080 que se escala). Fuentes locales (Noto Sans para títulos, Archivo para párrafos), así funciona sin internet.
- `deck/assets/brand/`: imágenes de la plantilla oficial WCGT26 (sacadas de `source.pptx` → `pptx/ppt/media`).
- `deck/assets/collage/`: anuncios reales hechos con IA (01–28), registrados en `COLLAGE_MEDIA` dentro de `deck/deck.js`. El bingo (slide 4) reutiliza 6 de ellos. `murmullo.mp3` (opcional) suena mientras corre el collage.
- `deck/assets/results/`: post, catálogo y story de prueba generados con el flow (slide 7).
- `deck/assets/ads/backup.mp4`: story de respaldo en video (tecla B), opcional.
- `flow/flow-spec.md`: especificación del flow de ElevenCreative Flows para la demo en vivo.

## Correr
```
cd deck && python3 -m http.server 4173
```
Abrir http://localhost:4173. Teclas: →/espacio siguiente, ← anterior, F pantalla completa, P vista de presentadora, B anuncio de respaldo.

## Demo en vivo
Contenido de Instagram para un producto del público: post de venta con titular y precio, catálogo, story y un anuncio con voz. **`flow/flows-agent-prompt.md` es el registro del flow real armado en Flows** (nodos, conexiones y prompts exactos); el slide del flow (slide 9) lo copia tal cual: el diagrama de fondo y, por cada clic, un panel con el prompt real del nodo activo. Si cambia el flow hay que actualizar ambos. `flow/flow-spec.md` es el plan y la guía de la dinámica. El slide 7 muestra los resultados de prueba de `deck/assets/results/` (`post.webp`, `catalogo.webp`, `story.webp`); la tecla B reproduce `deck/assets/ads/backup.mp4` si existe.

## Convenciones
- Paleta oficial: #3055f2, #3bd8f2, #3aba24, #ffd200, #fe8600, #127533, #c9372c, #041f33, #f8faff.
- Animaciones: `data-anim` (fade-up, left, scale, pop, reveal, stamp) + `data-step="n"` para pasos dentro de una slide; `--d` = delay.
- Notas de la presentadora en `<aside class="notes">` por slide.
