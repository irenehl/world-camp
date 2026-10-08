# Flow "¿Alguien tiene algo que quiera vender?" · Especificación

Charla: **The creative side of AI with ElevenLabs** · WordCamp Guatemala 2026
Sábado 10 oct, 3:00 pm, track Growth, Universidad Galileo (zona 10)

> Idea central: la IA no sabe que esos alfajores se hacen con la receta de la abuela. **Eso lo pone una persona.**
> Un solo flow, un solo estilo: un **anuncio real y cálido** que el voluntario pueda publicar, **más un post para Instagram y una foto de catálogo** de su producto. Lo que lo vuelve único son sus respuestas.

---

## 1. Dinámica en el escenario (≈8 min)

1. **"¿Alguien tiene algo que quiera vender?"** Su producto o emprendimiento. Le hacemos el anuncio y se lo lleva.
2. **Foto del producto.** Si lo trae, la tomás vos (fondo neutro, buena luz, que se vea tal cual es). Si no, que te pase una foto de su celular o de su Instagram. Solo el producto, nada de caras.
3. **Entrevista** (≈1 min, sin prisa: es el corazón de la demo). Anotás las respuestas tal cual las dice:
   - **¿Cómo te llamás y qué vendés?** → `{NOMBRE}`, `{PRODUCTO}`
   - **¿Qué tiene que no tenga ningún otro?** → `{DIFERENCIA}` (buscá la historia: receta de la abuela, hecho a mano, empezó en pandemia…)
   - **¿Dónde te lo compran?** → `{DONDE}`
4. Subís la foto, llenás el guion y das **Run**.
5. Mientras genera, explicás cada nodo (ver sección 5).
6. **Estreno** en el nodo Composition, y enseñás también el post y la foto de catálogo. Descargás todo (MP4 + 2 imágenes) y se lo mandás al voluntario.

### Cómo escribir las variables (para que el guion siempre suene bien)

| Variable | Formato | Ejemplo |
|---|---|---|
| `{NOMBRE}` | Nombre de pila | `Andrea` |
| `{PRODUCTO}` | **Con artículo** | `los alfajores de maicena` |
| `{DIFERENCIA}` | **Empieza con verbo**, tercera persona, presente | `se hacen con la receta de su abuela` |
| `{DONDE}` | Lo que sigue a "Pedilo…" | `por WhatsApp`, `en Instagram, arroba alfajores punto andrea` |

> En `{DONDE}` escribí los arrobas y puntos con palabras ("arroba", "punto") para que la voz los lea bien.

---

## 2. Estructura del flow

```
                                ┌──► [Image A] ──► [Video A] ──┐
[Upload Media: foto producto] ──┼──► [Image B] ──► [Video B] ──┤
                                ├──► [Image IG 4:5]  ──► sale directo (post de Instagram)
                                └──► [Image Catálogo 1:1] ──► sale directo (tienda / WooCommerce)
[Text: guion lleno] ────────────────► [TTS v4] ────────────────┼──► [Composition] ──► Estreno
[Music]  (PRE-GENERADO) ───────────────────────────────────────┤
[SFX 1]  (PRE-GENERADO) ───────────────────────────────────────┤
[SFX 2]  (PRE-GENERADO) ───────────────────────────────────────┘

(opcional) [Image "trampa": prompt pelado, sin foto]  ← contraste rápido con el collage
```

| Nodo | Modelo sugerido | Config | ¿En vivo? |
|---|---|---|---|
| Upload Media | — | Foto del producto | **Sí** |
| Image A / B | **Nano Banana 2** (rápido, respeta referencias) | Ref: la foto · 16:9 · 1 variación | **Sí** |
| Image IG | **Nano Banana 2** | Ref: la foto · **4:5** · 1 variación · salida final | **Sí** |
| Image Catálogo | **Nano Banana 2** | Ref: la foto · **1:1** · 1 variación · salida final | **Sí** |
| Video A / B | **Seedance 2.0 Mini** o **Fast** (los más rápidos) | **Start Frame** = Image A/B · 8 s · 16:9 · 720p · **Audio: OFF** | **Sí** |
| Text | — | Guion con variables ya reemplazadas | **Sí** (lo escribís) |
| TTS | **Eleven v4** | Voz diseñada (ver 3.1) · Stability media-baja | **Sí** |
| Music | Eleven Music | Instrumental · ~25 s | No (pre-generado) |
| SFX 1 / 2 | Sound Effects | Ver prompts | No (pre-generado) |
| Composition | — | Video A + Video B en secuencia, VO, música bajita (≈ -12 dB), SFX | Sí (preview) |

**Por qué Audio OFF en el video:** el sonido nativo del modelo es el "default" genérico. El sonido lo dirigimos nosotros (voz, música, SFX). Es parte del mensaje.

**Por qué Seedance con Start Frame y no referencias:** en Seedance los frames y las referencias son excluyentes; el start frame garantiza que el producto real (de tu foto, vía Image A/B) sea lo primero que se ve.

> Si en el ensayo Composition no permite poner dos clips en secuencia, plan B: un solo clip de 10–12 s (Image A → Video A) o exportar a Studio para el backup.

---

## 3. El estilo: anuncio real y cálido

**La regla del estilo:** todo lo contrario al collage. Nada brilla, nada es épico, nadie es perfecto. Luz natural, lugares reales de Guate, una voz que suena a persona y no a locutor, y el producto tal cual es.

Prompts de imagen/video/música/SFX en inglés (los modelos responden mejor); guion y voz en español chapín. Las **etiquetas de audio van en inglés** entre corchetes.

### 3.1 Voz (Voice Design)
```
A Guatemalan woman in her 30s with a natural Guatemalan Spanish accent. Warm, close and genuine, like telling a friend about a small local business she loves. Relaxed pace, smiles while talking, small natural breaths. Never sounds like an announcer or a commercial voice. Intimate close-mic recording.
```
> Si querés tener una segunda opción (por ejemplo, si el voluntario es hombre y preferís que lo cuente un hombre), diseñá también una versión masculina con la misma descripción y dejá ambas listas.

### 3.2 Guion (~18 s)
```
[warmly] Mirá… {PRODUCTO}. [pause] Detrás está {NOMBRE}. [softly] Y {DIFERENCIA}. [pause] No sale de una fábrica. No sale de cualquier lado. [smiling] Sale de aquí, de Guate. [pause] Pedilo {DONDE}.
```
> Si preferís tuteo: "Mira…" / "Pídelo…". El voseo suena más de aquí.

### 3.3 Imágenes

Primera línea de **ambos** prompts (es la que mata el "plástico"):
```
Use the exact product from the reference image. Preserve its real shape, colors, labels, packaging, textures and small imperfections. Do not make it glossy, perfect or generic. Do not add or change any text on the packaging. No people, no hands.
```

**Image A** (luz de mañana, casa antigüeña)
```
[línea base] The product resting on a sunlit windowsill of an old colonial house in Antigua Guatemala. Ochre wall with slightly peeling paint, soft shadow of bougainvillea leaves across the wall, gentle morning light, a corner of a handwoven Guatemalan textile visible. Shot on 35mm film, true-to-life colors, natural documentary product photography.
```
**Image B** (tarde, barrio)
```
[línea base] The product on a small wooden table at a neighborhood corner shop in Guatemala City, late afternoon golden light, colorful painted wall and a hand-painted sign softly out of focus in the background, everyday life feeling. Shot on 35mm film, natural colors, shallow depth of field, honest documentary style.
```

**Escena alternativa según el producto** (cambiás solo la parte de la escena):

| Si vende… | Escena sugerida |
|---|---|
| Comida / repostería | `on a worn wooden kitchen table next to a clay comal, morning light from a small window` |
| Ropa / accesorios / joyería | `on top of a folded handwoven Guatemalan textile, soft window light, wooden floor` |
| Cosmética / velas / artesanía | `on a stone ledge in a quiet colonial courtyard with plants, soft diffused light` |
| Algo digital o un servicio | Foto de su logo o tarjeta: `on a café table in Antigua, a cup of Guatemalan coffee, volcano softly out of focus far away` |

**Image IG** (post de Instagram, 4:5)
```
[línea base] Vertical 4:5 lifestyle photo for an Instagram feed post. The product in the same real Guatemalan setting as the scene above (or the alternative scene), natural daylight, warm and honest, simple composition with breathing room around the product. Looks like a real photo taken by a good photographer with a film camera, not like an ad. No text, no logos added.
```
**Image Catálogo** (tienda en línea / WooCommerce, 1:1)
```
[línea base] Clean e-commerce catalog photo, square 1:1. The product centered on a seamless warm off-white paper background, soft diffused light from the left, a soft natural contact shadow, accurate colors and true proportions. Nothing added, no props, no text. Ready for an online store.
```
> El de catálogo es el único "limpio" a propósito: en una tienda el producto tiene que verse tal cual es. Por eso la línea base pesa todavía más aquí.

### 3.4 Video
**Video A**
```
Very slow push-in on the product. The bougainvillea shadow moves gently across the wall, dust floating in the morning light. Subtle handheld feel. No people, no hands, no text.
```
**Video B**
```
Slow lateral dolly past the product. In the background, soft out-of-focus movement of everyday street life and warm late afternoon light. No faces in focus, no hands, no text.
```

### 3.5 Música (pre-generada)
```
Warm, intimate acoustic piece with nylon-string guitar and soft marimba accents. Hopeful and unhurried, small-town Guatemalan feeling. No drums, no build-up, no epic swell. Instrumental, 25 seconds.
```

### 3.6 Efectos de sonido (pre-generados)
**SFX 1:** `Quiet morning ambience in a Guatemalan neighborhood: birds, a distant rooster, a far-off street vendor calling, soft breeze`
**SFX 2:** `Distant church bells in a colonial town, gentle and far away`

---

## 4. Nodo trampa (opcional, 10 s en vivo)

Un Image node **sin foto**, solo con:
```
Advertisement for {PRODUCTO}
```
Corre en 1–2 s con Nano Banana 2. Lo ponés junto a Image A: el "default" (plástico, genérico, igual al collage) vs. el producto real del voluntario. Contraste instantáneo, cero riesgo.

---

## 5. Qué decir mientras genera (cada nodo = una decisión humana)

| Mientras corre… | Decís (idea) |
|---|---|
| **Upload Media** | "El collage empieza con un prompt. Este empieza con algo **real**: el producto de {NOMBRE}, tal como es." |
| **Image** | "Le pedí que **respete el producto tal como es** y lo puse en un lugar de aquí, con luz de verdad. La IA por default todo lo vuelve brillante; por eso todo se ve igual. Y de la misma foto salen el post para Instagram y la foto para su tienda: si tienen WooCommerce, esto ya lo pueden subir." |
| **Video** | "Le apagué el audio al video. El sonido es la mitad de la emoción, y no se lo voy a dejar al default." |
| **TTS** | "Esta voz no la elegí de una lista: la **diseñé** para que suene a persona, no a locutor. Y el guion lo escribí con lo que nos contó {NOMBRE}." |
| **Music / SFX** | "Guitarra y marimba, no música épica. Pájaros y campanas de fondo. Eso es lo que hace que suene a **aquí**." |
| **Composition** | "Mismo flow, otro producto, otra persona → otro anuncio. **La herramienta es la misma que la del collage. Lo que cambió fueron las decisiones.**" |

---

## 6. Preparación (antes del sábado)

### Armar el flow una vez
- [ ] Voz diseñada (Voice Design → guardarla en *My Voices*; probarla con el guion usando valores de ejemplo)
- [ ] Música pre-generada
- [ ] SFX 1 y SFX 2 pre-generados
- [ ] Nodos Image/Video/TTS configurados con prompts, modelo y settings; **solo falta la foto y el guion**
- [ ] Guardarlo como **template** (inputs: foto + texto del guion) para correrlo rápido

### Ensayo con cronómetro (probalo con 2 o 3 productos distintos: algo de comida, algo de ropa, algo digital)

| Paso | Tiempo medido |
|---|---|
| Foto + subirla al flow | |
| Image A + B + IG + Catálogo (en paralelo) | |
| Video A + B (en paralelo) | |
| TTS | |
| Composition lista | |
| **Total desde "Run"** | |

Meta: **≤ 4 min** desde Run. Si se pasa: bajá el video a 5–6 s, usá Seedance 2.0 Mini, o dejá un solo clip.

Los créditos de cada nodo se ven al pasar el mouse sobre **Run**. Calculá: (costo de una corrida completa) × (ensayos + evento + 1 de colchón).

### Anuncio de respaldo
- [ ] Correr el flow completo con **un producto de prueba** (algo que vendas tú o un emprendimiento conocido)
- [ ] Exportar MP4 → guardarlo en `world-camp/deck/assets/ads/backup.mp4` (ya está conectado en las slides)
- [ ] Sirve para dos cosas: mostrar el flow funcionando antes de correrlo en vivo, y salvarte si algo falla

### Logística
- [ ] Hotspot del celular listo como plan B de internet
- [ ] Sesión de ElevenLabs abierta, el flow en una pestaña
- [ ] Forma rápida de pasar la foto del cel a la compu (AirDrop, o abrir ElevenLabs en el cel y subirla directo al nodo)
- [ ] Recordá: Flows está en **Alpha**; si un nodo falla no cobra y lo podés re-correr solo

---

## 7. Hoja de escenario (imprimir)

```
NOMBRE:  ______________________
PRODUCTO (con artículo): ______________________
DIFERENCIA (empieza con verbo): _________________________
DÓNDE (Pedilo…): ______________________________________
¿Escena alternativa?  Comida / Ropa-accesorios / Artesanía / Digital

1. Foto del producto → Upload Media
2. Pegar guion, reemplazar variables → Text
3. Run: Image A + B + IG + Catálogo  →  Video A + B  →  TTS
4. (opcional) Run nodo trampa
5. Composition → pantalla completa → ¡estreno! (+ enseñar post y catálogo)
6. Descargar MP4 + 2 imágenes → mandárselo al voluntario
Si falla: backup.mp4 (tecla B en el deck)
```
