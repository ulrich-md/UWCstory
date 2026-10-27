# My Journey 📼🗺️

Dos años en UWC Costa Rica contados como un **viaje**. Abres un escritorio con un cassette holográfico
(*"play it to know me more"*), llegas a una pizarra con el mapa del vuelo **Tehuacán, Puebla → Santa Ana**
y el mapa de Costa Rica, y desde ahí visitas cada **parada** en su propia página.

Es un sitio estático: HTML, CSS y JS sin dependencias ni paso de build.

## Páginas

| Archivo | Qué es |
|---|---|
| `index.html` | El escritorio (cassette + tracklist) y la pizarra con los dos mapas |
| `stop.html?id=<id>` | Una parada del viaje: periódico, fotos, minimapa y "next stop" |
| `end.html` | Travel log ("to be continued") y liner notes |

Al pasar de una página a otra la foto de portada se transforma suavemente (View Transitions), y en las paradas las flechas ← → del teclado llevan a la anterior y a la siguiente.

## Cómo verlo en tu computadora

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Cómo poner TUS paradas, fotos y textos

Todo el contenido vive en **un solo archivo: `js/data.js`**. Cada objeto dentro de `events` genera automáticamente:
1. una canción en el **tracklist** del cassette (Side A / Side B),
2. una **polaroid y un pin** en el mapa de la pizarra,
3. su **propia página** (`stop.html?id=...`).

```js
{
  id: "bald-for-a-cause",      // sin espacios; se usa en el link
  title: "Bald for a Cause",
  date: "Nov 2024",
  place: "Santa Ana",
  coords: [9.93, -84.18],      // latitud, longitud (Google Maps → clic derecho → copiar)
  headline: "Titular del periódico",
  note: "Una frase tuya, corta.",
  chalk: ["brave?", "ha!"],    // hasta 2 notas en tiza
  layout: "",                  // "cluster" | "row" | "bag" (vacío = se alternan)
  photos: [ { src, w, h, alt, caption }, ... ]   // la PRIMERA foto es la portada
}
```

- **Mapas:** las paradas dentro de Costa Rica van al mapa de Costa Rica. Las de fuera (como Tehuacán) van al mapa del vuelo. Las paradas en el mismo lugar (Santa Ana, el campus) comparten un pin con todos sus números apilados.
- **Fotos:** guárdalas en `photos/` y actualiza `src`, `w` y `h`. El formato recomendado es `.webp` o `.jpg`, con un lado largo de 1000 a 1400 px.
- **`profile`:** es la libreta "Traveler profile" de la pizarra, el resumen de 10 segundos para el officer.
- **`cast`:** solo el nombre de pila y el país, y **pide permiso** a cada persona.

> ⚠️ Los lugares y los nombres de los eventos son reales, pero **las fechas, titulares, notas y fotos son de relleno**. Cámbialos por los tuyos.

## Publicarlo gratis

**Vercel:** vercel.com → *Add New Project* → importa este repo → *Framework preset:* **Other** → Deploy.
**GitHub Pages:** *Settings → Pages → Deploy from branch → `main` / root.*

## En la Common App

Pega el link en **Additional Information**:
*"My Journey — a 2-minute photo journey through my two years at UWC Costa Rica: [link]"*.

## Detalles

- Los carretes del cassette giran con el scroll y la cinta pasa de un carrete al otro a lo largo de todo el viaje. Abajo a la izquierda hay un mini cassette con contador.
- El cassette se inclina y la etiqueta holográfica cambia de brillo al mover el mouse.
- El visor de fotos funciona con teclado (← → Esc) y con deslizar en el celular.
- **Rendimiento:** no hay capas de mezcla a pantalla completa ni filtros de desenfoque, y la linterna se mueve con `transform`. Medido con scroll continuo: ~60 fps en todas las páginas (antes, 30).
- Respeta `prefers-reduced-motion`: si el sistema pide menos movimiento, se desactivan las animaciones y las transiciones.
- Tipografías de Google Fonts: Cabin Sketch, Gochi Hand, Fredoka, Playfair Display, Special Elite y UnifrakturMaguntia.
- Las fotos de relleno vienen de [Lorem Picsum](https://picsum.photos) (Unsplash License).
- Texturas reales de [ambientCG](https://ambientcg.com), CC0 (dominio público): ladrillo (Bricks058), madera (Wood092, Wood051), papel (Paper003), cartón (Cardboard002), pizarra (Concrete034 teñida de verde), rayones (Scratches005) y polvo/huellas (SurfaceImperfections003, 015). Están en `assets/tex/`.
- Objetos 3D realistas (lupa, linterna, brújula, lentes, cámara y walkman) escaneados por [Poly Haven](https://polyhaven.com), CC0, con la luz del estudio HDRI *studio_small_09*. Las chinchetas están modeladas en three.js. Todo se renderiza con la misma luz del sitio y vive en `assets/props/`. El estudio de render está en `tools/props/`.
- Contornos de México, Centroamérica y Costa Rica de [Natural Earth](https://www.naturalearthdata.com) (dominio público), simplificados en `js/geo.js`.
- Iluminación: una sola luz cálida desde arriba a la izquierda, así que todas las sombras caen hacia abajo a la derecha. En escritorio hay además una "linterna" que sigue al cursor.
