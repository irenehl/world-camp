# Armar el flow con Flows Agent

## Paso 0 · La voz (ya está creada)
"Voz WCGT cálida" en *My Voices*. Si algún día hay que rehacerla: **Voices → Voice Design**, descripción de abajo y **texto de prueba en español** (si la diseñas en inglés pierde el acento).
```
A Guatemalan woman in her 30s with a natural Guatemalan Spanish accent. Warm, close and genuine, like telling a friend about a small local business she loves. Relaxed pace, smiles while talking, small natural breaths. Never sounds like an announcer or a commercial voice. Intimate close-mic recording.
```
```
Mirá… los alfajores de maicena. Detrás está Andrea. Y se hacen con la receta de su abuela. No sale de una fábrica. Sale de aquí, de Guate. Pedilo por WhatsApp.
```

## Paso 1 · Abrir Flows
**Flows → + New Flow** (o borra los nodos del flow anterior). Permisos del agente en **"Approve each"**.

## Paso 2 · Pegar este prompt al agente

```
Build a reusable Instagram content flow for a small brand. Do NOT run any image or video generation yet; only create and connect the nodes. You may run the Music node after I approve.

INPUTS
1. "Foto producto": Upload Media node (product photo, uploaded later).
2. "Marca": Upload Media node (optional: the brand's logo or a screenshot of its Instagram, used as a style reference).
3. "Guion": Text node with this placeholder text:
[warmly] {PRODUCTO}, de {MARCA}. {DIFERENCIA} [smiling] Hecho aquí, por gente de aquí. A {PRECIO}. Pedilo {DONDE}.

UTILITY
4. "Recorte": Background Removal node, input from "Foto producto". All image nodes below use "Recorte" as their image reference.

IMAGE NODES (all Nano Banana 2 Lite, 1 variation).
Start every image prompt with this exact base line:
"Use the exact product from the reference image. Keep its real shape, colors, label and markings. Do not make it glossy, perfect or generic. Do not add or change any text on the product."

5. "Foto de marca" (4:5): base line + "Vertical 4:5. The product alone on a plain sand-colored paper backdrop. Hard direct sunlight from a window casts one crisp, long shadow to the side. Nothing else in the frame. Simple, modern brand photo taken with a phone, true colors, no glow, no reflections added, no props, no text."
6. "Post de venta" (4:5), references: "Recorte" AND "Marca": base line + "Instagram post, 4:5. Solid {COLOR} background, matching the brand style from the second reference image if there is one. The product on the right third with a hard daylight shadow. On the left, only this text in a clean bold sans-serif, perfectly spelled: "{TITULAR}" and below it, smaller: "{PRECIO}". No other text, no badges, no icons, no stickers, no sparkles, no 3D letters, no price tags, no gradients."
7. "Catálogo" (1:1): base line + "Clean e-commerce catalog photo, square 1:1. The product centered on a seamless warm off-white paper background, soft diffused light from the left, a soft natural contact shadow, accurate colors and true proportions. Nothing added, no props, no text. Ready for an online store."
8. "Frame story" (9:16): base line + "Vertical 9:16. The product alone on the same plain sand-colored paper backdrop, standing in the lower half of the frame, hard direct window sunlight casting one crisp long shadow, lots of empty space above it. Simple, modern brand photo taken with a phone, true colors, no glow, no props, no text."

VIDEO NODE
9. "Clip story": Seedance 2.0 Mini, Start Frame = "Frame story", 10 seconds, 9:16, 720p, AUDIO OFF. Prompt: "Static vertical phone shot on a tripod. The product does not move or change shape. Only the sunlight changes: the shadow shifts slowly across the backdrop as if a cloud passes, and the light warms slightly. No camera movement, no zoom, no slow motion, no particles, no light rays, no glow, no text, no people, no hands."

AUDIO NODES
10. "Voz": Text to Speech, model Eleven v4, voice "Voz WCGT cálida", text from the "Guion" node.
11. "Música": Music node, instrumental, 12 seconds: "Warm, minimal modern acoustic track: soft guitar and light hand percussion, calm and confident, feels like a small independent brand. No epic swell, no build-up, no drops."

OUTPUT
12. "Story": Composition node, vertical 9:16. Video: "Clip story". Audio: "Voz" on top, "Música" low (around -12 dB). Trim everything to the clip length (10 seconds).

"Foto de marca", "Post de venta" and "Catálogo" are final outputs (not connected to the Composition).
When done, list the nodes and connections so I can review them.
```

## Paso 3 · Revisar
- **Recorte** conectado a las 4 imágenes (y **Marca** solo al Post de venta).
- Las 4 imágenes en **Nano Banana 2 Lite** (no Recraft: inventa otro producto).
- **Clip story**: 9:16, 10 s, **audio apagado**, *Start Frame* = Frame story.
- **Voz** con **Eleven v4** y tu voz guardada, conectada a **Story**.
- **Clip story** y **Música** también conectados a **Story**.

## Paso 4 · Primer ensayo (cuidando créditos)
1. Sube la foto del producto de prueba (y, si quieres, un logo en "Marca").
2. En **Post de venta** reemplaza `{TITULAR}`, `{PRECIO}`, `{COLOR}`. En **Guion** reemplaza las variables.
3. Corre **Recorte → las 4 imágenes**. Si alguna se ve IA, ajusta y repite **solo esa**.
4. Cuando las imágenes te convenzan, corre **Clip story → Voz → Story**, con cronómetro.
5. Exporta la story como `deck/assets/ads/backup.mp4`.
6. Guarda el flow como **Template**.

## Si el agente no hace algo bien
Pídeselo en el mismo chat, por ejemplo: "Turn off audio on Clip story", "Use Nano Banana 2 Lite on all image nodes", "Connect Voz to Story". También puedes editar cualquier nodo a mano.
