# My Journey 📼🗺️

Dos años en UWC Costa Rica contados como un **viaje**. Abres un escritorio con un cassette holográfico
(*"play it to know me more"*), llegas a una pizarra con el mapa del vuelo **Tehuacán, Puebla → Santa Ana**
y el mapa de Costa Rica, y desde ahí visitas cada **parada** en su propia página.

Es un sitio estático: HTML, CSS y JS sin dependencias ni paso de build.

## La idea

**Fotos esparcidas sobre tu escritorio, bajo una lámpara.** Una sola página, sin títulos ni secciones: abres con tu foto y tu nombre, ves el mapa del viaje (Tehuacán → Santa Ana) y luego bajas por momentos, cada uno con un pequeño collage de fotos y **una sola nota a mano**.

No es tu activity list (eso ya está en la Common App): aquí no hay logros, números ni cargos. Es el otro lado: tus amigos, el humor, los días difíciles, tu cultura.

## Cómo verlo en tu computadora

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Cómo poner TUS fotos y notas

Todo vive en **un solo archivo: `js/data.js`**. Cada objeto de `moments` es un collage:

```js
{
  when: "Aug 2025",            // sale en la nota y como fecha naranja en las fotos
  where: "Santa Ana",
  coords: [9.93, -84.18],      // opcional: agrega un pin en el mapa (o usa places: [...])
  note: "Una sola frase tuya, a mano. Sin logros: cómo se sintió.",
  photos: [ { src, w, h, alt, caption }, ... ]   // 3 a 5; la primera es la más grande
}
```

- El collage se arma solo según cuántas fotos pongas (3, 4 o 5). Cada momento se acomoda en espejo respecto al anterior para que el escritorio no se repita.
- **Fotos:** guárdalas en `photos/` y actualiza `src`, `w` y `h`. El formato recomendado es `.webp` o `.jpg`, con un lado largo de 1000 a 1400 px.
- **`thesis`:** la frase de la primera pantalla. **`letter`:** la nota final.
- **Pide permiso** a los amigos que aparezcan de cerca.

> ⚠️ Todas las fotos y notas actuales son **borradores**. Deja solo lo que sea verdad y reescribe las notas hasta que suenen a ti.

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
