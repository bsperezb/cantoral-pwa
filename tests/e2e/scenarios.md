# Escenarios E2E

## 1. Home carga el manifest y muestra cantos

1. Navegar a `/`
2. Esperar a que aparezca el SearchBar
3. Verificar que al menos hay un `.song-list__item`

## 2. Buscar por título filtra resultados

1. Escribir "ciervo" en el input de búsqueda
2. Esperar 200ms (debounce)
3. Verificar que sólo aparece "Como el Ciervo"

## 3. Abrir detalle muestra acordes + letra

1. Click en el primer item de la lista
2. Verificar URL `/canto/:id`
3. Verificar que se renderiza `.chord-lyric__chords` y `.chord-lyric__text`

## 4. Transposición +1 cambia los acordes

1. Navegar a un canto en G (como-el-ciervo)
2. Click en botón "+"
3. Verificar que los acordes ahora son G# (o Ab)

## 5. Cambio notación latino/inglés

1. En detalle de canto
2. Click en botón "C D E" / "Do Re Mi"
3. Verificar conversión sin perder transposición

## 6. Parser laCuerda real

1. Navegar a `/canto/mi-historia-entre-tus-dedos`
2. Verificar que se muestra "CORO" como sección
3. Verificar que INTRO muestra los 4 acordes Dm7 G Cmaj7 Fmaj7

## 7. Offline manager lista todos los cantos

1. Navegar a `/offline`
2. Verificar que aparecen todos los items del manifest
3. Toggle descargar uno → queda marcado como ✓ Offline

## 8. Navegación móvil (viewport 360px)

1. Resize a 360x740
2. Navegar entre rutas
3. Verificar que ningún overflow rompe el layout

## 9. PWA manifest disponible

1. Navegar a `/manifest.webmanifest`
2. Verificar JSON válido con `name: "Cantoral"`
