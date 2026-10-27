# My Journey 📼🗺️

Dos años en UWC Costa Rica contados como un **viaje**. Abres un escritorio con un cassette holográfico
(*"play it to know me more"*), llegas a una pizarra con el mapa del vuelo **Tehuacán, Puebla → Santa Ana**
y el mapa de Costa Rica, y desde ahí visitas cada **parada** en su propia página.

Es un sitio estático: HTML, CSS y JS sin dependencias ni paso de build.

## Estructura: una sola página de ~2 minutos

Un admissions officer le da a un link entre 1 y 3 minutos y casi nunca hace clic en subpáginas, así que todo está en una página que se lee con scroll:

| Sección | Tiempo | Qué hace |
|---|---|---|
| **1 · Quién** | 10 s | Tu foto, tu nombre, Grieg Scholar y una frase tuya (`thesis`) |
| **2 · La ruta** | 10 s | El vuelo Tehuacán → Santa Ana, el mapa de Costa Rica y la leyenda de paradas |
| **3 · Las paradas** | ~90 s | Cada parada: 1 foto grande, 1 o 2 frases (`line`) y un dato (`fact`). Las fotos extra se abren en el visor |
| **4 · Qué me llevo** | 10 s | Tres frases (`takeaways`) y "Next stop: university" |

## Cómo verlo en tu computadora

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Cómo poner TUS paradas, fotos y textos

Todo el contenido vive en **un solo archivo: `js/data.js`**. Cada objeto dentro de `stops` genera un pin en el mapa, una línea en la leyenda y su bloque en la página.

```js
{
  id: "bald-for-a-cause",      // sin espacios; se usa en el link
  title: "Bald for a Cause",
  date: "Nov 2024",
  place: "Santa Ana",
  coords: [9.93, -84.18],      // latitud, longitud (Google Maps → clic derecho → copiar)
  line: "1 o 2 frases tuyas: lo que el officer de verdad lee",
  fact: "hair donated",        // un dato o número, como sticker rojo (opcional)
  photos: [ { src, w, h, alt, caption }, ... ]   // la PRIMERA es la grande
}
```

- **Mapas:** las paradas dentro de Costa Rica van al mapa de Costa Rica. Las de fuera (como Tehuacán) van al mapa del vuelo. Las paradas en el mismo lugar (Santa Ana, el campus) comparten un pin con todos sus números apilados. Si una parada tiene varios lugares (los viajes de fin de semana), usa `places` en vez de `coords`.
- **Fotos:** guárdalas en `photos/` y actualiza `src`, `w` y `h`. El formato recomendado es `.webp` o `.jpg`, con un lado largo de 1000 a 1400 px.
- **`thesis`:** la frase de la portada. Que suene a ti; no la copies de tu ensayo.
- **Pide permiso** a los amigos que aparezcan de cerca en las fotos.

> ⚠️ Los textos vienen de tus actividades, pero **son borradores**. Las fotos y las fechas marcadas `TODO` en `js/data.js` siguen siendo de relleno.

## Publicarlo gratis

**Vercel:** vercel.com → *Add New Project* → importa este repo → *Framework preset:* **Other** → Deploy.
**GitHub Pages:** *Settings → Pages → Deploy from branch → `main` / root.*

## En la Common App

Pega el link en **Additional Information**:
*"My Journey — a 2-minute visual journey from Tehuacán to UWC Costa Rica: [link]"*.

## Detalles

- Los carretes del cassette giran con el scroll y la cinta pasa de un carrete al otro a lo largo de todo el viaje. Abajo a la izquierda hay un mini cassette con contador.
- El cassette se inclina y la etiqueta holográfica cambia de brillo al mover el mouse.
- El visor de fotos funciona con teclado (← → Esc) y con deslizar en el celular.
- **Rendimiento:** no hay capas de mezcla a pantalla completa ni filtros de desenfoque, la linterna se mueve con `transform` y las paradas fuera de pantalla no se renderizan (`content-visibility`). Medido con scroll continuo: ~60 fps.
- Respeta `prefers-reduced-motion`: si el sistema pide menos movimiento, se desactivan las animaciones y las transiciones.
- Tipografías de Google Fonts: Cabin Sketch, Gochi Hand, Fredoka, Playfair Display, Special Elite y UnifrakturMaguntia.
- Las fotos de relleno vienen de [Lorem Picsum](https://picsum.photos) (Unsplash License).
- Texturas reales de [ambientCG](https://ambientcg.com), CC0 (dominio público): ladrillo (Bricks058), madera (Wood092, Wood051), papel (Paper003), cartón (Cardboard002), pizarra (Concrete034 teñida de verde), rayones (Scratches005) y polvo/huellas (SurfaceImperfections003, 015). Están en `assets/tex/`.
- Objetos 3D realistas (lupa, linterna, brújula, lentes, cámara y walkman) escaneados por [Poly Haven](https://polyhaven.com), CC0, con la luz del estudio HDRI *studio_small_09*. Las chinchetas están modeladas en three.js. Todo se renderiza con la misma luz del sitio y vive en `assets/props/`. El estudio de render está en `tools/props/`.
- Contornos de México, Centroamérica y Costa Rica de [Natural Earth](https://www.naturalearthdata.com) (dominio público), simplificados en `js/geo.js`.
- Iluminación: una sola luz cálida desde arriba a la izquierda, así que todas las sombras caen hacia abajo a la derecha. En escritorio hay además una "linterna" que sigue al cursor.
