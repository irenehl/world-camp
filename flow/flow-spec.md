# Flow "¿Alguien tiene algo que quiera vender?" · Especificación

Charla: **The creative side of AI with ElevenLabs** · WordCamp Guatemala 2026
Sábado 10 oct, 3:00 pm, track Growth, Universidad Galileo (zona 10)

> Idea central: el collage está lleno de posts de Instagram hechos con IA que se ven todos iguales. La demo hace **lo mismo, con la misma IA, pero dirigido**: el contenido de Instagram de una marca real del público.
> Salidas: **post de venta** (con titular y precio), **foto de marca**, **foto de catálogo** y una **story vertical** con voz.

**El estilo:** foto de marca moderna y simple. Producto real, fondo liso, luz de ventana dura con una sombra marcada, nada más. Nada de escenas de postal, nada brillante, nada de letreros inventados. Lo que delata a la IA es lo recargado; lo simple y bien dirigido no se nota.

---

## 1. Dinámica en el escenario (≈8 min)

1. **"¿Alguien tiene algo que quiera vender?"** Le hacemos ahorita el post de venta, la foto de catálogo y una story. Y se los lleva.
2. **Foto del producto.** Si lo trae, la tomás vos (buena luz, que se vea completo). Si no, que te pase una foto de su celular o de su Instagram. Solo el producto, nada de caras.
3. **(Opcional, muy recomendado)** Captura de su **Instagram o su logo**: así el post sale con *su* marca y no con la estética de la IA.
4. **Entrevista** (≈1 min). Anotás:
   - **¿Cómo se llama tu marca y qué vendés?** → `{MARCA}`, `{PRODUCTO}`
   - **¿Qué lo hace diferente?** → `{DIFERENCIA}` y de ahí escribís vos el `{TITULAR}`
   - **¿Cuánto cuesta y dónde lo compran?** → `{PRECIO}`, `{DONDE}`
5. Subís foto (y marca), llenás el texto del post y el guion, y das **Run**.
6. Mientras genera, explicás cada nodo (sección 5).
7. **Estreno:** la story con voz, y enseñás el post y la foto de catálogo. Descargás todo y se lo mandás.

### Variables

| Variable | Formato | Ejemplo |
|---|---|---|
| `{MARCA}` | Nombre de la marca | `Pacha` |
| `{PRODUCTO}` | Con artículo | `la pachita de dos litros` |
| `{DIFERENCIA}` | Una oración corta | `Te marca cuánta agua llevás cada hora.` |
| `{TITULAR}` | **Lo escribís vos**, máx. 5 palabras, sale de la diferencia | `Tomá agua sin pensarlo.` |
| `{PRECIO}` | Como se dice en Guate | `Q95` |
| `{COLOR}` | Color principal de la marca o del producto, en inglés | `warm orange` |
| `{DONDE}` | Lo que sigue a "Pedilo…" | `por WhatsApp`, `en Instagram, arroba pacha punto gt` |

> En `{DONDE}` escribí arrobas y puntos con palabras para que la voz los lea bien. En `{TITULAR}` y `{PRECIO}` va el texto exacto que aparecerá en el post: revisá la ortografía antes de correr.

---

## 2. Estructura del flow

```
[Foto producto] → [Background Removal: Recorte] ─┬→ [Foto de marca 4:5]   → sale directo (feed)
                                                 ├→ [Post de venta 4:5]   → sale directo (feed)
[Marca (opcional): logo / captura IG] ───────────┘        ▲ (2ª referencia)
                                                 ├→ [Catálogo 1:1]        → sale directo (tienda / WooCommerce)
                                                 └→ [Frame story 9:16] → [Clip story 9:16] ─┐
[Guion] → [Voz: Eleven v4] ─────────────────────────────────────────────────────────────────┼→ [Story: Composition 9:16]
[Música] (PRE-GENERADA) ────────────────────────────────────────────────────────────────────┘

(opcional) [Image "trampa": prompt pelado, sin foto]  ← contraste rápido con el collage
```

| Nodo | Modelo | Config | ¿En vivo? |
|---|---|---|---|
| Foto producto | Upload Media | Foto del producto | **Sí** |
| Marca | Upload Media | Logo o captura de su Instagram (opcional) | **Sí** |
| Recorte | **Background Removal** | Entrada: Foto producto | **Sí** |
| Foto de marca | **Nano Banana 2 Lite** | Ref: Recorte · **4:5** · 1 variación | **Sí** |
| Post de venta | **Nano Banana 2 Lite** | Refs: Recorte + Marca · **4:5** · 1 variación | **Sí** |
| Catálogo | **Nano Banana 2 Lite** | Ref: Recorte · **1:1** · 1 variación | **Sí** |
| Frame story | **Nano Banana 2 Lite** | Ref: Recorte · **9:16** · 1 variación | **Sí** |
| Clip story | **Seedance 2.0 Mini** | **Start Frame** = Frame story · **10 s** · **9:16** · 720p · **Audio: OFF** | **Sí** |
| Guion | Text | Guion con variables reemplazadas | **Sí** |
| Voz | **Eleven v4** | Voz "Voz WCGT cálida" | **Sí** |
| Música | Eleven Music | Instrumental · ~12 s | No (pre-generada) |
| Story | Composition | Clip story + Voz + Música bajita (≈ -12 dB), todo recortado a 10 s | Sí (preview) |

**Por qué Background Removal primero:** la foto del voluntario puede traer manos, fondo, otros objetos o sellos. Con el producto recortado, la IA solo ve el producto.

**Por qué Nano Banana 2 Lite:** es el más barato que respeta bien la imagen de referencia (Recraft, por ejemplo, inventa otro producto).

**Por qué Audio OFF en el video:** el sonido nativo del modelo es el "default" genérico. El sonido lo dirigimos nosotros (voz y música).

**Por qué 1 solo clip y casi sin movimiento:** el video es lo más caro y lo que más delata a la IA. Producto quieto, cámara quieta, solo la luz cambia.

---

## 3. Prompts

Prompts de imagen y video en inglés (los modelos responden mejor); guion en español chapín. Las **etiquetas de audio van en inglés** entre corchetes.

### 3.1 Voz (Voice Design, ya creada)
```
A Guatemalan woman in her 30s with a natural Guatemalan Spanish accent. Warm, close and genuine, like telling a friend about a small local business she loves. Relaxed pace, smiles while talking, small natural breaths. Never sounds like an announcer or a commercial voice. Intimate close-mic recording.
```
> Diseñada con texto de prueba **en español** para que conserve el acento.

### 3.2 Guion (~10 s, igual que el clip)
```
[warmly] {PRODUCTO}, de {MARCA}. {DIFERENCIA} [smiling] Hecho aquí, por gente de aquí. A {PRECIO}. Pedilo {DONDE}.
```
> Sin `[pause]`: cada una suma casi un segundo. Si la voz queda en 12–13 s, subí el clip a 12 s.

### 3.3 Línea base (va al inicio de todos los prompts de imagen)
```
Use the exact product from the reference image. Keep its real shape, colors, label and markings. Do not make it glossy, perfect or generic. Do not add or change any text on the product.
```

### 3.4 Foto de marca (feed, 4:5)
```
[línea base] Vertical 4:5. The product alone on a plain sand-colored paper backdrop. Hard direct sunlight from a window casts one crisp, long shadow to the side. Nothing else in the frame. Simple, modern brand photo taken with a phone, true colors, no glow, no reflections added, no props, no text.
```

### 3.5 Post de venta (feed, 4:5, con texto)
```
[línea base] Instagram post, 4:5. Solid {COLOR} background, matching the brand style from the second reference image if there is one. The product on the right third with a hard daylight shadow. On the left, only this text in a clean bold sans-serif, perfectly spelled: "{TITULAR}" and below it, smaller: "{PRECIO}". No other text, no badges, no icons, no stickers, no sparkles, no 3D letters, no price tags, no gradients.
```
> Una sola frase y el precio, exactos y entre comillas. Todo lo demás prohibido: así se evita la casilla de "mil textos, nadie lee".

### 3.6 Catálogo (tienda / WooCommerce, 1:1)
```
[línea base] Clean e-commerce catalog photo, square 1:1. The product centered on a seamless warm off-white paper background, soft diffused light from the left, a soft natural contact shadow, accurate colors and true proportions. Nothing added, no props, no text. Ready for an online store.
```

### 3.7 Frame story (9:16, sin texto)
```
[línea base] Vertical 9:16. The product alone on the same plain sand-colored paper backdrop, standing in the lower half of the frame, hard direct window sunlight casting one crisp long shadow, lots of empty space above it. Simple, modern brand photo taken with a phone, true colors, no glow, no props, no text.
```
> El espacio vacío arriba es para que el emprendedor ponga su texto o sticker directo en Instagram.

### 3.8 Clip story (9:16)
```
Static vertical phone shot on a tripod. The product does not move or change shape. Only the sunlight changes: the shadow shifts slowly across the backdrop as if a cloud passes, and the light warms slightly. No camera movement, no zoom, no slow motion, no particles, no light rays, no glow, no text, no people, no hands.
```

### 3.9 Música (pre-generada)
```
Warm, minimal modern acoustic track: soft guitar and light hand percussion, calm and confident, feels like a small independent brand. No epic swell, no build-up, no drops. Instrumental, 12 seconds.
```
> Si ya generaste una música que te gusta, reusala y recortala en el Composition.

---

## 4. Nodo trampa (opcional, 10 s en vivo)

Un Image node **sin foto**, solo con:
```
Instagram ad for {PRODUCTO}
```
Lo ponés junto al post de venta: el "default" (recargado, brillante, igual al collage) vs. el post dirigido. Contraste instantáneo.

> Ejemplo real de lo que sale con un prompt de "foto bonita": la escena de la tiendita con el letrero "RESTÓ NIE DAL PU…". Guardala, es material para la charla.

---

## 5. Qué decir mientras genera (cada nodo = una decisión humana)

| Mientras corre… | Decís (idea) |
|---|---|
| **Foto + Marca** | "El collage empieza con un prompt. Este empieza con algo **real**: su producto y su marca." |
| **Recorte** | "Primero le quito todo lo que no es el producto. Que la IA vea solo lo que importa." |
| **Imágenes** | "Fondo liso, luz de ventana, una sombra. Nada brilla. En el post le di **una frase y el precio, exactos**, y le prohibí todo lo demás. Y la foto de catálogo, si tienen WooCommerce, ya la pueden subir." |
| **Clip** | "Story vertical. Casi nada se mueve: entre menos se mueve, menos se nota la IA. Y sin audio: el sonido no se lo dejo al default." |
| **Voz + Música** | "Esta voz la **diseñé** para que suene a persona, no a locutor. El guion lo escribí con lo que nos contó." |
| **Story** | "Mismo flow, otra marca, otra historia. **La herramienta es la misma que la del collage. Lo que cambió fueron las decisiones.**" |

---

## 6. Preparación (antes del sábado)

- [ ] Voz guardada ("Voz WCGT cálida") ✔
- [ ] Armar el flow con `flows-agent-prompt.md`
- [ ] Música pre-generada (o reusar la que ya tenés)
- [ ] Guardarlo como **Template** (inputs: Foto producto, Marca, Guion, texto del post)

### Ensayo con cronómetro

| Paso | Tiempo medido |
|---|---|
| Foto + subirla | |
| Recorte | |
| 4 imágenes (en paralelo) | |
| Clip story | |
| Voz | |
| Story lista | |
| **Total desde "Run"** | |

Meta: **≤ 4 min**. Si se pasa: clip de 6–8 s (y guion más corto) o plan B sin video: el Frame story como foto fija con voz y música.

**Para cuidar créditos:** corré el clip **solo cuando las imágenes ya te convenzan**. 1 variación por nodo.

### Anuncio de respaldo
- [ ] Correr todo con un producto de prueba
- [ ] Exportar la story como `deck/assets/ads/backup.mp4` (el deck ya la muestra en vertical)

### Logística
- [ ] Hotspot del celular como plan B de internet
- [ ] Sesión de ElevenLabs abierta con el flow
- [ ] AirDrop o subir la foto directo desde el cel
- [ ] Flows está en **Alpha**: si un nodo falla no cobra y lo podés re-correr

---

## 7. Hoja de escenario (imprimir)

```
MARCA: ______________________   PRODUCTO (con artículo): ______________________
DIFERENCIA: ____________________________________________________________
TITULAR (máx. 5 palabras): ______________________   PRECIO: ________
COLOR (en inglés): ______________   DÓNDE (Pedilo…): ______________________

1. Foto → Foto producto   ·   (opcional) logo / captura IG → Marca
2. Post de venta: reemplazar {TITULAR}, {PRECIO}, {COLOR}
3. Guion: reemplazar variables
4. Run: Recorte → 4 imágenes → Clip story → Voz → Story
5. (opcional) Run nodo trampa
6. Estreno: story + enseñar post y catálogo
7. Descargar todo → mandárselo
Si falla: backup.mp4 (tecla B en el deck)
```
