# The Ulrich Files 🕵️📼

Dos años en UWC Costa Rica contados como un **caso de detective**: un cassette holográfico
(*"play it to know me more"*) abre un tablero de investigación en pizarra verde, con un mapa de
Costa Rica, polaroids e hilo rojo. Cada **evento** es una pieza de evidencia.

Es un sitio estático: HTML, CSS y JS sin dependencias ni paso de build.

## Cómo verlo en tu computadora

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Cómo poner TUS eventos, fotos y textos

Todo el contenido vive en **un solo archivo: `js/data.js`**.

Cada objeto dentro de `events` genera automáticamente:
1. una canción en el **tracklist** del cassette (Side A / Side B),
2. una **polaroid y un pin en el mapa** del tablero,
3. su propia sección de **evidencia**, con un recorte de periódico, fotos, notas en tiza e hilo rojo.

```js
{
  id: "arrival",               // sin espacios; se usa en el link (#ev-arrival)
  title: "Arrival",
  date: "Aug 2024",
  place: "Santa Ana",
  coords: [9.93, -84.18],      // latitud, longitud (Google Maps → clic derecho → copiar)
  headline: "Titular del periódico",
  note: "Una frase tuya, corta.",
  chalk: ["who is he?", "??"], // hasta 2 notas en tiza
  layout: "",                  // "cluster" | "row" | "bag" (vacío = se alternan)
  photos: [ { src, w, h, alt, caption }, ... ]   // la PRIMERA foto es la portada
}
```

- **Fotos:** guárdalas en `photos/e1/`, `photos/e2/`… (o en la carpeta que quieras) y actualiza `src`, `w` y `h`.
  El formato recomendado es `.webp` o `.jpg`, con un lado largo de 1000 a 1400 px.
- **Funcionan mejor entre 4 y 8 eventos**, con 4 o 5 fotos cada uno.
- **`profile`:** es el "Suspect profile" del tablero, el resumen de 10 segundos para el officer.
- **`cast`:** solo el nombre de pila y el país, y **pide permiso** a cada persona.

> ⚠️ Los eventos, titulares, notas y fotos actuales son **de relleno**. Cámbialos por tus eventos reales.

## Publicarlo gratis

**Vercel:** vercel.com → *Add New Project* → importa este repo → *Framework preset:* **Other** → Deploy.
**GitHub Pages:** *Settings → Pages → Deploy from branch → `main` / root.*

## En la Common App

Pega el link en **Additional Information**:
*"The Ulrich Files — a 2-minute photo case file about my two years at UWC Costa Rica: [link]"*.

## Detalles

- Los carretes del cassette giran con el scroll y la cinta pasa de un carrete al otro. Abajo a la izquierda hay un mini cassette con contador.
- El cassette se inclina y la etiqueta holográfica cambia de brillo al mover el mouse.
- El visor de fotos funciona con teclado (← → Esc) y con deslizar en el celular.
- Respeta `prefers-reduced-motion`: si el sistema pide menos movimiento, se desactivan las animaciones.
- Tipografías de Google Fonts: Cabin Sketch, Gochi Hand, Fredoka, Playfair Display, Special Elite y UnifrakturMaguntia.
- Las fotos de relleno vienen de [Lorem Picsum](https://picsum.photos) (Unsplash License).
- Texturas reales (ladrillo, madera, papel, cartón y la base de la pizarra) de [ambientCG](https://ambientcg.com), CC0 (dominio público): Bricks058, Wood092, Paper003, Cardboard002 y Concrete034 (teñida de verde). Están procesadas en `assets/tex/` y pesan unos 135 KB en total.
- Objetos 3D realistas (lupa, linterna, brújula, lentes, cámara y walkman) escaneados por [Poly Haven](https://polyhaven.com), CC0 (dominio público), con la luz del estudio HDRI *studio_small_09* de Poly Haven. Los renderizamos nosotros con la misma luz del sitio y viven en `assets/props/` (unos 320 KB). El estudio de render está en `tools/props/`.
- Contornos de Costa Rica, Nicaragua y Panamá de [Natural Earth](https://www.naturalearthdata.com) (dominio público), simplificados en `js/geo.js`.
- Iluminación: una sola luz cálida desde arriba a la izquierda, así que todas las sombras caen hacia abajo a la derecha. En escritorio hay además una "linterna" que sigue al cursor.
