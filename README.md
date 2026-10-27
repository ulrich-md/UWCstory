# My Journey 📼🗺️

Dos años en UWC Costa Rica, en fotos. Abres con tu foto y tu nombre sobre un escritorio (con un cassette
holográfico, *"play it to know me more"*), ves el mapa del vuelo **Tehuacán, Puebla → Santa Ana** y el de Costa Rica,
y luego bajas por fotos esparcidas sobre la mesa.

Es un sitio estático: HTML, CSS y JS sin dependencias ni paso de build.

## La idea

**Fotos esparcidas sobre tu escritorio, bajo una lámpara.** Una sola página, **sin frases**: sin títulos, sin notas, sin secciones. Solo montones de fotos, uno tras otro. La única escritura es el lugar a mano en una polaroid y la fecha naranja de cámara vieja en las impresiones.

No es tu activity list (eso ya está en la Common App): aquí no hay logros, números ni cargos. Es el otro lado: tus amigos, el humor, los días difíciles, tu cultura.

## Cómo verlo en tu computadora

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Cómo poner TUS fotos

Todo vive en **un solo archivo: `js/data.js`**. Cada objeto de `moments` es un montón de fotos:

```js
{
  when: "Aug 2025",            // fecha naranja en las fotos y arriba de la pantalla
  where: "Santa Ana",          // escrito a mano en la primera polaroid
  coords: [9.93, -84.18],      // opcional: agrega un pin en el mapa (o usa places: [...])
  photos: [ { src, w, h, alt, caption }, ... ]   // 3 a 7 por montón; más de 7 se reparte en varios
}
```

- El montón se acomoda solo según cuántas fotos pongas. Cada uno queda en espejo respecto al anterior para que el escritorio no se repita. En el celular las fotos bajan en zigzag, encimadas.
- **Fotos:** guárdalas en `photos/` y actualiza `src`, `w` y `h`. El formato recomendado es `.webp` o `.jpg`, con un lado largo de 1000 a 1400 px.
- **`caption`** (opcional) cambia lo escrito en una polaroid. Que sea un nombre o un lugar, no una frase.
- **`alt`** lo leen los lectores de pantalla: describe la foto.
- **Pide permiso** a los amigos que aparezcan de cerca.

> ⚠️ Todas las fotos actuales son **de relleno** hasta que lleguen las reales.

## Publicarlo gratis

**Vercel:** vercel.com → *Add New Project* → importa este repo → *Framework preset:* **Other** → Deploy.
**GitHub Pages:** *Settings → Pages → Deploy from branch → `main` / root.*

## En la Common App

Pega el link en **Additional Information**:
*"My Journey — two years at UWC Costa Rica, in photos (2 min): [link]"*.

## Detalles

- Los carretes del cassette giran con el scroll. Abajo a la izquierda, un mini cassette muestra la fecha de lo que estás viendo.
- El cassette se inclina y la etiqueta holográfica cambia de brillo al mover el mouse.
- El visor de fotos funciona con teclado (← → Esc) y con deslizar en el celular.
- **Rendimiento:** no hay capas de mezcla a pantalla completa ni filtros de desenfoque, la linterna se mueve con `transform` y las paradas fuera de pantalla no se renderizan (`content-visibility`). Medido con scroll continuo: ~60 fps.
- Respeta `prefers-reduced-motion`: si el sistema pide menos movimiento, se desactivan las animaciones y las transiciones.
- Tipografías de Google Fonts: Gochi Hand, Playfair Display, Special Elite, Fredoka y VT323 (la fecha de cámara).
- Las fotos de relleno vienen de [Lorem Picsum](https://picsum.photos) (Unsplash License).
- Texturas reales de [ambientCG](https://ambientcg.com), CC0 (dominio público): ladrillo (Bricks058), madera (Wood092, Wood051), papel (Paper003), cartón (Cardboard002), pizarra (Concrete034 teñida de verde), rayones (Scratches005) y polvo/huellas (SurfaceImperfections003, 015). Están en `assets/tex/`.
- Objetos 3D realistas (lupa, linterna, brújula, lentes, cámara y walkman) escaneados por [Poly Haven](https://polyhaven.com), CC0, con la luz del estudio HDRI *studio_small_09*. Las chinchetas están modeladas en three.js. Todo se renderiza con la misma luz del sitio y vive en `assets/props/`. El estudio de render está en `tools/props/`.
- Contornos de México, Centroamérica y Costa Rica de [Natural Earth](https://www.naturalearthdata.com) (dominio público), simplificados en `js/geo.js`.
- Iluminación: una sola luz cálida desde arriba a la izquierda, así que todas las sombras caen hacia abajo a la derecha. En escritorio hay además una "linterna" que sigue al cursor.
