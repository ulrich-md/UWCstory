# UWCCR — The Film 🎬

Dos años en UWC Costa Rica contados como una película en cinco escenas:
**Friends · Humor · Culture · Vulnerable · Serious**, con créditos finales al cierre.

Es un sitio estático: HTML, CSS y JS sin dependencias ni paso de build.

## Cómo verlo en tu computadora

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Cómo poner TUS fotos y textos

Todo el contenido vive en **un solo archivo: `js/data.js`**.

1. **Fotos:** reemplaza las imágenes en `photos/<escena>/` con las tuyas, usando los mismos nombres (`01.webp`, `02.webp`…). También puedes cambiar las rutas `src` en `data.js`.
   - Formato recomendado: `.webp` o `.jpg`, con un lado largo de 1000 a 1400 px y menos de 300 KB por foto.
   - Si cambias la proporción de una foto, actualiza `w` y `h` en `data.js` para que no salte el diseño al cargar.
2. **Notas a mano (`caption`):** cortas, de 10 palabras como máximo. Son tu voz, así que escríbelas tú.
3. **`alt`:** describe cada foto en una frase. Es para lectores de pantalla y también suma en accesibilidad.
4. **Créditos (`cast`):** pon solo el nombre de pila y el país, y **pide permiso** a cada persona.
5. **Escena 03 (Culture):** `selects: [0, 3, 5]` indica qué fotos llevan el círculo rojo (se cuentan desde 0).

> ⚠️ Todos los textos y fotos actuales son **de relleno**. Antes de mandar el link, cambia cada `caption`,
> sobre todo en *Serious* y *Vulnerable*: esos textos tienen que ser verdad y ser tuyos.

## Publicarlo gratis

**Opción A: Vercel (recomendada)**
1. Entra a vercel.com → *Add New Project* → importa este repo.
2. *Framework preset:* **Other**, sin build command. Haz clic en Deploy.
3. Obtienes un link tipo `uwcstory.vercel.app`.

**Opción B: GitHub Pages**
*Settings → Pages → Deploy from branch → `main` / root.*

## En la Common App

- Pega el link en **Additional Information** o en la descripción de una actividad relacionada.
- Una línea basta: *"A 2-minute photo film about my two years at UWC Costa Rica: [link]"*.
- Revisa en el teléfono que cargue rápido antes de enviarlo.

## Estructura

```
index.html        apertura, shot list, créditos
css/style.css     todo el diseño (tokens de color arriba)
js/data.js        ← tu contenido
js/main.js        render + interacciones (scroll, visor de fotos, HUD)
photos/           imágenes por escena
```

## Detalles de diseño

- La apertura es una claqueta animada; luego vienen un shot list para quien lee con prisa y las cinco escenas, cada una con un formato propio:
  tablero kraft con hilo rojo, tira de película horizontal, hoja de contactos, proyector y una claqueta grande.
- Respeta `prefers-reduced-motion`: si el sistema pide menos movimiento, se desactivan las animaciones.
- El visor de fotos funciona con teclado (← → Esc) y con deslizar en el celular.
- Tipografías de Google Fonts: Archivo Black, DM Serif Display, Gochi Hand y Special Elite.
- Las fotos de relleno vienen de [Lorem Picsum](https://picsum.photos) (Unsplash License).
