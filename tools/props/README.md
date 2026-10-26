# Prop render studio

Renderiza los modelos 3D CC0 de [Poly Haven](https://polyhaven.com) como PNG con fondo transparente,
usando la misma luz del sitio (una luz cálida desde arriba a la izquierda, con la sombra integrada en la imagen).

```bash
cd tools/props
npm init -y && npm install three@0.169.0
python3 download.py models 2k magnifying_glass_01            # baja el modelo y sus texturas
mkdir -p hdri out && curl -L -o hdri/studio.hdr "$(curl -s https://api.polyhaven.com/files/studio_small_09 | python3 -c 'import json,sys;print(json.load(sys.stdin)["hdri"]["1k"]["hdr"]["url"])')"
python3 -m http.server 8766 &                                 # deja este servidor corriendo
node drive.js '[{"m":"magnifying_glass_01","out":"magnifier","rx":"-90","ry":"35","pitch":"90","size":"1200"}]'
```

- `rx` / `ry` / `rz` rotan el objeto. Para girarlo en el plano usa `ry`, no la cámara: así la sombra sigue cayendo abajo a la derecha.
- `hide=nombreDelNodo` oculta partes del modelo. `glassop` controla la opacidad del vidrio.
- Después recorta la imagen y expórtala a `.webp`. Así se hicieron los archivos de `assets/props/`.
