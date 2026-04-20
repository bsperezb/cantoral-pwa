# 📋 Plan de Desarrollo: Cantoral PWA (Vue 3)

## 🎭 Contexto y Rol

Actuarás simultáneamente como:

- **Arquitecto de Software**: diseñarás la estructura, patrones y escalabilidad del proyecto.
- **Desarrollador Senior Vue/Frontend**: escribirás código limpio, modular y mantenible.
- **Músico Experto**: validarás la lógica de acordes, transposición (latino/inglés) y formato de cantorales.

### Principios rectores (NO NEGOCIABLES)

1. **Código limpio** siempre: nombres expresivos, funciones pequeñas, SRP (Single Responsibility Principle).
2. **Patrones de diseño** donde aporten valor: Composable Pattern (Vue 3), Strategy (parsers/transposición), Observer (stores reactivos), Factory (creación de cantos), Repository (acceso a datos).
3. **Legibilidad > cleverness**. Comentarios SOLO cuando el "por qué" no sea obvio.
4. **Componentes atómicos y reutilizables** (Atomic Design: atoms → molecules → organisms).
5. **HTML y CSS nativos**, sin frameworks CSS. Variables CSS, `clamp()`, container queries, `@layer`.
6. **Mobile-first absoluto**. Diseño pensado para navegador móvil e instalación como PWA.
7. **Sin TypeScript**. JavaScript moderno (ES2022+) con JSDoc en funciones críticas.

---

## 🛠️ Stack Técnico

| Categoría               | Tecnología                                                    |
| ----------------------- | ------------------------------------------------------------- |
| Framework               | Vue 3 (Composition API con `<script setup>`)                  |
| Build tool              | Vite                                                          |
| Router                  | Vue Router 4                                                  |
| Estado                  | Pinia                                                         |
| PWA                     | `vite-plugin-pwa` (Workbox)                                   |
| Persistencia local      | IndexedDB vía `idb`                                           |
| **Linter**              | **oxlint** (Rust, ultra-rápido)                               |
| Formatter               | Prettier                                                      |
| Testing E2E             | **Playwright MCP** (el agente IA ejecuta las pruebas vía MCP) |
| Testing unitario        | Vitest                                                        |
| Catálogo de componentes | Storybook (solo en desarrollo)                                |
| Skill UI/UX             | `ui-ux-pro-max`                                               |

---

## ⚙️ Configuración de oxlint

Instalación:

```bash
npm install --save-dev oxlint
```

Archivo `.oxlintrc.json` en la raíz:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "plugins": ["import", "unicorn", "promise", "vitest"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "pedantic": "off",
    "style": "warn",
    "perf": "warn"
  },
  "rules": {
    "no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "eqeqeq": "error",
    "prefer-const": "error",
    "no-var": "error",
    "import/no-duplicates": "error"
  },
  "ignorePatterns": [
    "dist",
    "node_modules",
    "storybook-static",
    "coverage",
    "public"
  ]
}
```

Scripts en `package.json`:

```json
{
  "scripts": {
    "lint": "oxlint . --deny-warnings",
    "lint:fix": "oxlint . --fix",
    "format": "prettier --write \"src/**/*.{js,vue,css,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,vue,css,json,md}\""
  }
}
```

Integración con Vite (opcional, con `vite-plugin-oxlint`):

```bash
npm install --save-dev vite-plugin-oxlint
```

Pre-commit hook con `simple-git-hooks` + `lint-staged`:

```json
{
  "simple-git-hooks": { "pre-commit": "npx lint-staged" },
  "lint-staged": {
    "*.{js,vue}": ["oxlint --fix", "prettier --write"],
    "*.{css,json,md}": ["prettier --write"]
  }
}
```

> ⚠️ **Nota**: oxlint no soporta nativamente plugins de Vue como `eslint-plugin-vue` todavía. Para reglas específicas de `<template>` de Vue, añadir ESLint solo para archivos `.vue` es opcional y se puede posponer. El linting de `<script>` en `.vue` sí funciona con oxlint.

---

## 📁 Estructura del Proyecto

```
cantoral-pwa/
├── public/
│   ├── icons/                     # Iconos PWA (maskable, 192, 512)
│   ├── manifest.webmanifest
│   └── songs/                     # 🎵 CANTOS PRE-CARGADOS AQUÍ
│       ├── index.json             # Manifest auto-generado (build-time)
│       ├── como-el-ciervo.song
│       ├── tu-estas-aqui.song
│       └── ...
├── scripts/
│   └── build-songs-manifest.js    # Genera public/songs/index.json
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── _variables.css
│   │       ├── _reset.css
│   │       ├── _typography.css
│   │       ├── _layers.css
│   │       └── main.css
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── composables/
│   │   ├── useChordParser.js
│   │   ├── useTranspose.js
│   │   ├── useChordNotation.js
│   │   ├── useSongParser.js       # Soporta formato propio + laCuerda
│   │   ├── useSearch.js
│   │   ├── useIndexedDB.js
│   │   ├── useOfflineManager.js   # 🆕 Gestión de descargas offline
│   │   └── useInstallPrompt.js    # 🆕 Prompt de instalación PWA
│   ├── stores/
│   │   ├── songs.store.js
│   │   ├── categories.store.js
│   │   ├── preferences.store.js
│   │   └── offline.store.js       # 🆕 Estado de cantos descargados
│   ├── services/
│   │   ├── songRepository.js
│   │   ├── songLoader.js          # 🆕 Carga desde /public/songs o remoto
│   │   ├── parsers/
│   │   │   ├── index.js           # Dispatcher entre formatos
│   │   │   ├── NativeParser.js    # Formato propio (frontmatter)
│   │   │   ├── LaCuerdaParser.js  # 🆕 Formato laCuerda
│   │   │   └── FormatDetector.js  # 🆕 Detecta automáticamente
│   │   └── chordEngine/
│   │       ├── ChordDetector.js
│   │       ├── ChordTransposer.js
│   │       ├── NotationConverter.js
│   │       └── constants.js
│   ├── router/
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── SongDetailView.vue
│   │   ├── CategoriesView.vue
│   │   ├── OfflineManagerView.vue # 🆕 Selección de cantos offline
│   │   └── SettingsView.vue
│   ├── utils/
│   ├── App.vue
│   └── main.js
├── .storybook/
├── tests/
│   ├── unit/
│   └── e2e/                       # Playwright MCP
├── .oxlintrc.json
├── vite.config.js
└── package.json
```

---

## 🎵 Carpeta de Cantos Pre-Cargados

### 📍 Ubicación: `public/songs/`

**Razón**: Todo lo que está en `public/` se copia tal cual al build final y es accesible desde `/songs/...` en la URL, sin pasar por el bundler. Ideal para archivos de datos que la app lee en tiempo de ejecución.

### Estructura esperada:

```
public/songs/
├── index.json                 # Auto-generado en build (lista todos los .song)
├── como-el-ciervo.song
├── tu-fidelidad.song
├── pan-de-vida.song
└── santo-santo-santo.song
```

### Script `scripts/build-songs-manifest.js`:

Se ejecuta automáticamente antes de `dev` y `build`. Genera `public/songs/index.json` con:

```json
{
  "generatedAt": "2026-04-19T12:00:00Z",
  "songs": [
    {
      "id": "como-el-ciervo",
      "file": "/songs/como-el-ciervo.song",
      "title": "Como el Ciervo",
      "artist": "Marcos Witt",
      "tags": ["adoracion", "entrada"],
      "hash": "abc123..."
    }
  ]
}
```

Scripts en `package.json`:

```json
{
  "scripts": {
    "prebuild": "node scripts/build-songs-manifest.js",
    "predev": "node scripts/build-songs-manifest.js",
    "build": "vite build",
    "dev": "vite"
  }
}
```

---

## ☁️ Alternativas GRATUITAS para Hospedaje (futuro)

Cuando el catálogo crezca y no quieras rebuildear por cada canto añadido, estas son tus opciones gratuitas:

| Opción                             | Ventajas                                                                                                         | Consideraciones                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **GitHub Pages** (recomendado)     | Gratis ilimitado, versionado con Git, el mismo repo sirve app + cantos                                           | Requiere rebuild al añadir cantos                                |
| **Repo separado solo para cantos** | Actualizas cantos sin tocar la app. Los `fetch` apuntan a `raw.githubusercontent.com/tu-usuario/cantos/main/...` | Rate limit de ~60 req/h no autenticado (no crítico si hay caché) |
| **Cloudflare Pages**               | Sin rate limit, CDN global, gratis hasta 500 builds/mes                                                          | Requiere cuenta Cloudflare                                       |
| **Netlify / Vercel**               | Deploy automático desde Git                                                                                      | Límites más bajos de ancho de banda en free tier                 |
| **jsDelivr sobre GitHub**          | CDN mundial gratuito: `https://cdn.jsdelivr.net/gh/usuario/repo@main/songs/...`                                  | Caché agresiva (~12h)                                            |

**Recomendación inicial**: mantener los cantos en `public/songs/` del mismo repo y desplegar en **GitHub Pages** o **Cloudflare Pages**. Cuando el volumen crezca, migrar a un repo separado de cantos + jsDelivr.

---

## 🎼 Formato de los Cantos

### Formato NATIVO (preferido):

```
---
title: Como el Ciervo
artist: Marcos Witt
author: Marcos Witt
album: Proyecto AA
key: G
tempo: 70
tags:
  - adoracion
  - entrada
categories:
  entrada:
    - tranquilo
  adoracion:
    - intimo
---

G            Em
Como el ciervo busca
    C              D
Por las aguas sediento
```

### Formato laCuerda (soporte completo del formato REAL):

El parser debe reconocer el formato real descargado desde `acordes.lacuerda.net/TXT/...`. Ejemplo canónico en `EJEMPLO_LACUERDA.TXT`:

```
=====================================================================
|             TABLATURAS Y ACORDES DE MÚSICA EN ESPAÑOL             |
+-------------------------- lacuerda.net ---------------------------+
| ARTISTA: Gianluca Grignani                                        |
| CANCION: MI HISTORIA ENTRE TUS DEDOS                              |
| AUTOR:   Gianluca Grignani                                        |
| ALBUM:   Destinazione Paradiso                                    |
+------------------------------------------------------ACO-gian0042-+
| TRANS:   Marco                                                    |
=====================================================================

INTRO:    Dm7  -  G  -  Cmaj7 - Fmaj7

 Dm7          G            Cmaj7                      Fmaj7
Yo pienso que, no son tan inútiles las noches que te di
...

CORO
               C
      Hay una cosa que yo no te he dicho aún
...
```

### Reglas del `FormatDetector`:

1. Si el archivo empieza con `---` (frontmatter YAML), usa `NativeParser`.
2. Si el archivo empieza con `=====` o contiene `| ARTISTA:` / `| CANCION:`, usa `LaCuerdaParser`.
3. Fallback: si no hay header estructurado pero hay acordes sobre letra, también se procesa como laCuerda heurístico.

### Reglas del `LaCuerdaParser`:

- **Bloque header** (entre líneas `====`): extraer `ARTISTA` → `artist`, `CANCION` → `title` (normalizado a Title Case), `AUTOR` → `author`, `ALBUM` → `album`, `TRANS` (transcriptor) → metadata ignorable o `transcriber`.
- **Bloque footer**: descartar disclaimer legal de lacuerda.net (todo tras la segunda línea de `====` al final).
- **Marcadores de sección sin corchetes**: líneas que contienen SOLO una palabra en mayúsculas (`INTRO`, `CORO`, `PUENTE`, `SOLO`, `ESTROFA`, `VERSO`) se tratan como encabezado de sección. También variantes con número (`CORO 2`, `VERSO 1`).
- **`INTRO:` inline**: si la línea empieza con `INTRO:` seguido de acordes separados por `-`, extraer la secuencia de acordes como una sección `intro`.
- **Líneas de acordes vs letra**: heurística — una línea es de acordes si ≥70% de sus tokens no-vacíos matchean el regex `ENGLISH_CHORD` o `LATIN_CHORD`. Pares consecutivos `(línea_acordes, línea_letra)` se agrupan preservando alineación por columnas.
- **Tono (opcional)**: líneas tipo `Tono: X`, `Tempo: X`, `Capo: X` si aparecen → metadata. El formato lacuerda.net real no siempre las incluye (la tonalidad se infiere del primer acorde o se deja `null`).

Ambos parsers devuelven el **mismo objeto normalizado**:

```js
{
  id: 'como-el-ciervo',
  metadata: { title, artist, author, album, key, tempo, tags, categories },
  sections: [
    { type: 'intro', lines: [...] },
    { type: 'verse', label: 'Verso 1', lines: [...] },
    { type: 'chorus', label: 'Coro', lines: [...] }
  ],
  sourceFormat: 'native' | 'lacuerda'
}
```

---

## 🎵 Motor de Acordes (Chord Engine)

### Detección (`ChordDetector.js`)

```js
// Inglés: C, C#, Db, Cm, Cmaj7, C7, Csus4, C/G, etc.
const ENGLISH_CHORD =
  /^[A-G](#|b)?(m|maj|min|dim|aug|sus)?\d?(\/[A-G](#|b)?)?$/;

// Latino: Do, Re#, Mim, Lam7, Do/Sol, etc.
const LATIN_CHORD =
  /^(Do|Re|Mi|Fa|Sol|La|Si)(#|b)?(m|maj|min|dim|aug|sus)?\d?(\/(Do|Re|Mi|Fa|Sol|La|Si)(#|b)?)?$/;
```

Heurística: una línea es "de acordes" si **≥70% de sus tokens no vacíos** matchean el regex.

### Transposición (`ChordTransposer.js`)

- Array circular de 12 semitonos.
- `transpose(chord, semitones)` preserva calidad (`m`, `maj7`, `sus4`), bajo invertido (`/G`) y notación original.
- Respeta preferencia de sostenidos vs bemoles según la tonalidad destino.

### Conversión de notación (`NotationConverter.js`)

Mapa bidireccional: `C ↔ Do`, `D ↔ Re`, etc.

---

## 🏷️ Sistema de Clasificación

Store `categories.store.js`:

```js
{
  categories: [
    {
      id: "entrada",
      name: "Entrada",
      subcategories: [
        { id: "alegre", name: "Alegre" },
        { id: "tranquilo", name: "Tranquilo" },
      ],
    },
  ];
}
```

- Un canto puede tener **N categorías** y **N subcategorías**.
- UI: chips desplegables + filtros en `HomeView`.
- Persistencia en IndexedDB.

---

## 📥 Gestión de Cantos Offline

### Flujo al instalar la PWA:

1. **Primera carga (online)**: la app descarga `public/songs/index.json`.
2. **Al instalar la PWA** (evento `appinstalled`): se descargan automáticamente **TODOS los cantos** del manifest y se guardan en IndexedDB.
3. **Post-instalación**: el usuario puede abrir `OfflineManagerView` y ver:
   - Lista completa de cantos disponibles (del manifest remoto).
   - Estado de cada uno: ✅ Descargado / ⬇️ No descargado.
   - Toggle individual por canto o "Descargar todos" / "Eliminar todos".
   - Indicador de espacio usado.

### Componentes clave:

**`useOfflineManager.js`**:

```js
{
  (availableSongs, // Del manifest remoto
    downloadedSongs, // De IndexedDB
    isDownloaded(id),
    downloadSong(id),
    removeSong(id),
    downloadAll(),
    syncManifest()); // Refresca el manifest
}
```

**`offline.store.js`** (Pinia):

- Estado: `{ downloadedIds: Set, downloading: Set, lastSync: Date }`.
- Acciones disparan eventos que `OfflineManagerView` consume.

**Estrategia con Workbox**:

- `public/songs/index.json` → `StaleWhileRevalidate`.
- Archivos `.song` → **NO precacheados**; se descargan bajo demanda y guardan en IndexedDB (no en Cache API, para poder consultarlos como datos estructurados).

### UI de `OfflineManagerView.vue`:

- Header: "Cantos disponibles offline".
- Barra de progreso global al descargar.
- Lista virtualizada con checkbox, título, artista, tamaño.
- Botones: `Descargar todo`, `Eliminar todo`, `Refrescar manifest`.

---

## 📱 Configuración PWA

- `vite-plugin-pwa` con estrategia **`autoUpdate`**.
- Manifest: `display: standalone`, orientación `portrait`, theme color consistente.
- Iconos: 192x192, 512x512, maskable.
- Service Worker:
  - Shell de app: precache.
  - Manifest de cantos: `StaleWhileRevalidate`.
  - Cantos individuales: gestión manual vía IndexedDB (`useOfflineManager`).
- Evento `appinstalled` → dispara descarga inicial completa.
- Prompt de instalación personalizado (`useInstallPrompt`).

---

## 📚 Storybook (solo desarrollo)

- Configuración con el builder de Vite.
- Stories obligatorias para cada átomo y molécula.
- Script `npm run storybook` (puerto 6006).
- **Excluido del build de producción**: no se incluye `.storybook/` ni `*.stories.js` en el bundle final.
- Controles (`argTypes`) para props críticas, especialmente `ChordLine` y `TransposeControl`.

---

## 🧪 Testing con Playwright MCP

**⚠️ Instrucción CRÍTICA para la IA ejecutora**: usa el **MCP de Playwright** para **ejecutar y validar** las pruebas interactivamente, no solo para escribir los archivos de test. El flujo debe ser:

1. Escribir el test en `tests/e2e/*.spec.js`.
2. **Invocar el MCP de Playwright** para:
   - Abrir el navegador.
   - Navegar a la URL local (`http://localhost:5173`).
   - Ejecutar los pasos del test (click, fill, expect).
   - Tomar screenshots ante fallos.
   - Verificar que la PWA funciona offline (desconectar red y recargar).
3. Reportar resultados en lenguaje natural, no solo logs.

### Casos E2E mínimos:

1. Búsqueda de canto por título devuelve resultados.
2. Apertura de canto muestra letra + acordes correctamente alineados.
3. Botón de transposición ±1 cambia todos los acordes.
4. Cambio de notación latino ↔ inglés funciona sin perder transposición.
5. Filtrado por categoría y subcategoría.
6. App carga offline después de primera visita.
7. Instalabilidad en móvil (verificar manifest).
8. **Parser laCuerda**: cargar un canto en formato laCuerda y verificar renderizado idéntico al nativo.
9. **Offline manager**: descargar un canto, desconectar red, abrirlo.
10. **Al instalar**: verificar que todos los cantos del manifest quedan en IndexedDB.

### Tests unitarios (Vitest):

- `ChordDetector`: casos límite.
- `ChordTransposer`: 12 tonalidades.
- `NotationConverter`: ida y vuelta idempotente.
- `NativeParser` y `LaCuerdaParser`: archivos reales de cada formato.
- `FormatDetector`: dispatcher correcto según contenido.

---

## 🚀 Fases de Desarrollo

### **Fase 0 — Setup**

- [ ] Inicializar Vite + Vue 3.
- [ ] Configurar **oxlint** + Prettier + pre-commit hooks.
- [ ] Instalar Pinia, Vue Router, `vite-plugin-pwa`, `idb`.
- [ ] Configurar Storybook.
- [ ] Configurar Vitest + **Playwright MCP**.
- [ ] Crear design tokens CSS.
- [ ] Layout base mobile-first.
- [ ] Crear `public/songs/` con 3 cantos de ejemplo (uno en formato nativo, uno en laCuerda, uno mixto).
- [ ] Script `build-songs-manifest.js`.

### **Fase 1 — Motor de Acordes**

- [ ] `ChordDetector` + tests.
- [ ] `NotationConverter` + tests.
- [ ] `ChordTransposer` + tests.
- [ ] Composables: `useChordParser`, `useTranspose`, `useChordNotation`.

### **Fase 2 — Parsers de cantos**

- [ ] `NativeParser` + tests.
- [ ] `LaCuerdaParser` + tests.
- [ ] `FormatDetector` + tests.
- [ ] `useSongParser` como fachada unificada.

### **Fase 3 — Persistencia y carga**

- [ ] `useIndexedDB` con schemas: `songs`, `categories`, `preferences`, `offlineMeta`.
- [ ] `songRepository` (Repository Pattern).
- [ ] `songLoader`: carga desde `/songs/index.json` y archivos individuales.

### **Fase 4 — Componentes Atómicos** (Storybook)

- [ ] `BaseButton`, `BaseInput`, `BaseIcon`, `BaseChip`, `BaseTag`, `BaseToggle`, `BaseProgressBar`.
- [ ] Aplicar skill `ui-ux-pro-max` en cada iteración.

### **Fase 5 — Componentes Moleculares**

- [ ] `SearchBar` (con debounce).
- [ ] `ChordLine`, `LyricLine`, `ChordLyricBlock`.
- [ ] `TagGroup`, `CategoryFilter`.
- [ ] `SongDownloadItem` (para el offline manager).

### **Fase 6 — Organismos y Vistas**

- [ ] `SongList` con virtualización.
- [ ] `SongViewer` con sticky header.
- [ ] `TransposeControl`.
- [ ] `HomeView`, `SongDetailView`, `CategoriesView`, `SettingsView`.

### **Fase 7 — PWA + Offline Manager**

- [ ] Manifest + iconos.
- [ ] Service Worker con Workbox.
- [ ] `useInstallPrompt` + UI.
- [ ] `useOfflineManager` + `offline.store.js`.
- [ ] `OfflineManagerView`.
- [ ] **Hook `appinstalled`**: descarga automática de todos los cantos del manifest.

### **Fase 8 — Testing E2E con Playwright MCP**

- [ ] Escribir todos los casos Playwright.
- [ ] **Ejecutarlos mediante el MCP** y validar.
- [ ] Reporte de cobertura.

### **Fase 9 — Pulido**

- [ ] Accesibilidad: ARIA, focus, contraste.
- [ ] Performance: lazy loading, `<Suspense>`.
- [ ] Dark mode.
- [ ] Animaciones con `view-transition-api`.

---

## ✅ Definición de "Terminado" (DoD)

Una feature está completa cuando:

1. Tiene tests unitarios (si es lógica) o story de Storybook (si es UI).
2. Pasa `oxlint` sin warnings.
3. Pasa `prettier --check`.
4. Funciona en móvil (viewport 360px mínimo).
5. Es accesible por teclado.
6. Tiene manejo de estados (empty, loading, error).
7. Documentada con JSDoc en funciones públicas.
8. Si involucra UI crítica, **validada con el MCP de Playwright**.

---

## 📏 Convenciones de Código

- **Componentes**: PascalCase (`SongViewer.vue`).
- **Composables**: camelCase con prefijo `use` (`useTranspose.js`).
- **Stores**: sufijo `.store.js`.
- **Eventos**: kebab-case (`@song-selected`).
- **Props**: camelCase en JS, kebab-case en template.
- **CSS**: BEM suave + variables CSS. Scoped styles en componentes.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).

---

## 🎯 Entregable Final

Una PWA instalable desde el navegador móvil que:

- Busca y visualiza cantos con acordes alineados sobre cada línea de letra.
- Detecta automáticamente acordes en notación latina e inglesa.
- Transpone preservando formato y notación.
- Clasifica cantos por categorías y subcategorías flexibles.
- Carga cantos desde `public/songs/` (con soporte para formato nativo y laCuerda).
- Al instalarse, descarga todos los cantos del manifest para uso offline.
- Permite al usuario elegir qué cantos mantener offline desde la vista de gestión.
- Catálogo de componentes en Storybook (solo dev).
- Cubierta por tests unitarios (Vitest) y E2E ejecutados vía **Playwright MCP**.

---

## ⚠️ Instrucciones para la IA ejecutora

1. Avanza **fase por fase**, sin saltarte pasos.
2. Al terminar cada fase:
   - Resume qué se hizo.
   - Muestra archivos creados y resultados de tests.
   - Espera confirmación antes de continuar.
3. **NO escribas todo el código de golpe**. Prioriza calidad.
4. Para cualquier test E2E: **usa el MCP de Playwright** para ejecutar, no solo para escribir archivos.
5. Antes de cada commit: corre `npm run lint && npm run format:check`.
6. Aplica la skill `ui-ux-pro-max` en todas las iteraciones de componentes visuales.
