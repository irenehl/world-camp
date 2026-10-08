# El flow real (ElevenCreative Flows)

Este documento es el registro **del flow que está armado** en ElevenLabs. El slide "Los prompts" del deck copia estos textos tal cual. Si cambias un prompt en Flows, cámbialo aquí también.

## Nodos y conexiones

```
Foto producto ─┬→ Escena 1 → Clip 1 ─────────┐
               ├→ Escena 2 → Post de venta   │
               ├→ Story                      ├→ Anuncio
               └→ Catálogo                   │
Guion → Voz ─────────────────────────────────┤
Música · Ambiente · Campanas ────────────────┘
```

| Nodo | Tipo / modelo | Formato | Entra desde | Sale |
|---|---|---|---|---|
| Foto producto | Upload Media | — | — | Escena 1, Escena 2, Story, Catálogo |
| Escena 1 | Nano Banana | 16:9 | Foto producto | Clip 1 |
| Escena 2 | Nano Banana | 16:9 | Foto producto | Post de venta |
| Post de venta | Nano Banana | 4:5 | Escena 2 | sale directo |
| Story | Nano Banana | 4:5 | Foto producto | sale directo |
| Catálogo | Nano Banana | 1:1 | Foto producto | sale directo |
| Clip 1 | Seedance | 6 s · audio OFF | Escena 1 (start frame) | Anuncio |
| Guion | Text | — | — | Voz |
| Voz | Text to Speech · Eleven v4 · "Voz WCGT cálida" | — | Guion | Anuncio |
| Música | Eleven Music | 15 s | — | Anuncio |
| Ambiente | Sound Effects | — | — | Anuncio |
| Campanas | Sound Effects | — | — | Anuncio |
| Anuncio | Composition | — | Clip 1, Voz, Música, Ambiente, Campanas | estreno |

## Prompts

### Post de venta
```
Use only the water bottle from the reference image, exactly as it is. Instagram post, 4:5. Solid warm orange background matching the bottle. The bottle on the right third with a hard daylight shadow. On the left, only this text in a clean bold sans-serif, perfectly spelled: "Tomá agua sin pensarlo." and below it, smaller: "Q95". No other text, no badges, no icons, no stickers, no sparkles, no 3D letters, no price tags.
```

### Escena 2
```
Use only the water bottle from the reference image, exactly as it is (same shape, colors, label and markings). Ignore the hand, the grass, the scooter and the round badge. Place it alone on a plain sand-colored paper backdrop. Hard direct sunlight from a window casts one crisp, long shadow to the side. Nothing else in the frame. Simple, modern brand photo taken with a phone, true colors, no glow, no reflections added, no props, no text.
```

### Catálogo
```
Use the exact product from the reference image. Preserve its real shape, colors, labels, packaging, textures and small imperfections. Do not make it glossy, perfect or generic. Do not add or change any text on the packaging. No people, no hands. Clean e-commerce catalog photo, square 1:1. The product centered on a seamless warm off-white paper background, soft diffused light from the left, a soft natural contact shadow, accurate colors and true proportions. Nothing added, no props, no text. Ready for an online store.
```

### Story
```
Use the exact product from the reference image. Preserve its real shape, colors, labels, packaging, textures and small imperfections. Do not make it glossy, perfect or generic. Do not add or change any text on the packaging. No people, no hands. Vertical 4:5 lifestyle photo for an Instagram feed post. The product on a sunlit windowsill of a colonial house in Antigua Guatemala, natural daylight, warm and honest, simple composition with breathing room around the product. Looks like a real photo taken by a good photographer with a film camera, not like an ad. No text, no logos added.
```

### Escena 1
```
Use the exact product from the reference image. Preserve its real shape, colors, labels, packaging, textures and small imperfections. Do not make it glossy, perfect or generic. Do not add or change any text on the packaging. No people, no hands. The product resting on a sunlit windowsill of an old colonial house in Antigua Guatemala. Ochre wall with slightly peeling paint, soft shadow of bougainvillea leaves across the wall, gentle morning light, a corner of a handwoven Guatemalan textile visible. Shot on 35mm film, true-to-life colors, natural documentary product photography.
```

### Clip 1
```
Very slow push-in on the product. The bougainvillea shadow moves gently across the wall, dust floating in the morning light. Subtle handheld feel. No people, no hands, no text.
```

### Guion (para el nodo Voz)
```
[warmly] Mirá: {PRODUCTO}. Detrás está {NOMBRE}, y {DIFERENCIA}. [smiling] No sale de una fábrica, sale de Guate. Pedilo {DONDE}.
```

### Música
```
Warm, intimate acoustic piece with nylon-string guitar and soft marimba accents. Hopeful and unhurried, small-town Guatemalan feeling. No drums, no build-up, no epic swell. Instrumental, 15 seconds.
```

### Ambiente
```
Quiet morning ambience in a Guatemalan neighborhood: birds, a distant rooster, a far-off street vendor calling, soft breeze
```

### Campanas
```
Distant church bells in a colonial town, gentle and far away.
```

## La voz (Voice Design)
"Voz WCGT cálida", diseñada con texto de prueba **en español** para que conserve el acento.
```
A Guatemalan woman in her 30s with a natural Guatemalan Spanish accent. Warm, close and genuine, like telling a friend about a small local business she loves. Relaxed pace, smiles while talking, small natural breaths. Never sounds like an announcer or a commercial voice. Intimate close-mic recording.
```

## Con el producto del voluntario
En Escena 2 y Post de venta, cambia "water bottle" por su producto y quita la frase "Ignore the hand, the grass, the scooter and the round badge." (era solo para la foto de prueba). En Post de venta cambia "warm orange", "Tomá agua sin pensarlo." y "Q95" por su color, su frase y su precio. En Guion reemplaza las variables.
