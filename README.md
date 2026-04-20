# Cantoral PWA

PWA para visualizar cantos con acordes, transposición y uso offline — pensada para coros parroquiales. Vue 3 + Vite, sin frameworks CSS.

🎵 **Demo**: https://bsperezb.github.io/cantoral-pwa/

## Características

- **Motor de acordes** con detección heurística, transposición ±12 semitonos y conversión latino ↔ inglés (Do ↔ C).
- **Dos formatos de canto** en `public/songs/`:
  - Nativo con frontmatter YAML (`---\ntitle: ...\n---`) y secciones `[Verso]`, `[Coro]`, …
  - **laCuerda.net** real (header `====` con `| ARTISTA:/CANCION:/AUTOR:/ALBUM:`, secciones sin corchetes como `CORO`, `INTRO:` inline). Los cantos se pueden copiar tal cual desde `acordes.lacuerda.net`.
- **PWA instalable**: manifest, Service Worker (Workbox), iconos PNG 192/512 + maskable. Al instalarse se descargan todos los cantos del manifest para uso offline.
- **Offline manager**: lista todos los cantos, permite descargar/eliminar individualmente o en masa, muestra espacio usado.
- **Mobile-first**: diseño probado a 360px, controles táctiles mínimo 44px, dark mode automático (`prefers-color-scheme`).
- **Accesible**: skip-link, `prefers-reduced-motion`, focus-visible, ARIA en controles interactivos.

## Stack

Vue 3 (`<script setup>`) · Vite · Pinia · Vue Router · IndexedDB (`idb`) · `vite-plugin-pwa` · Vitest · oxlint · Prettier.

## Scripts

```bash
npm run dev         # http://localhost:5173 (regenera manifest + iconos antes)
npm run build       # dist/ listo para despliegue
npm run preview     # sirve dist/ en http://localhost:4173
npm test            # 65 tests unitarios (Vitest)
npm run lint        # oxlint sobre src/ y scripts/
npm run format      # prettier --write
```

Los tests E2E se ejecutan con el **MCP de Playwright** desde el agente (ver `tests/e2e/scenarios.md`).

## Añadir cantos

Coloca un archivo `.song` en `public/songs/`. Se soportan ambos formatos:

```
---
title: Como el Ciervo
artist: Marcos Witt
key: G
tags: [adoracion, entrada]
---

[Verso]
G            Em
Como el ciervo busca
```

o el formato laCuerda real:

```
=====================================================================
| ARTISTA: ...                                                      |
| CANCION: ...                                                      |
=====================================================================

INTRO:  Dm7 - G - Cmaj7 - Fmaj7

 Dm7          G
Yo pienso que, no son tan inútiles...
```

`scripts/build-songs-manifest.js` se ejecuta automáticamente en `predev`/`prebuild` y regenera `public/songs/index.json`.

## Estructura

```
src/
├── services/
│   ├── chordEngine/     # Detector, transposer, notation converter
│   ├── parsers/         # Native, laCuerda, FormatDetector
│   ├── songLoader.js    # fetch de manifest y .song
│   └── songRepository.js
├── composables/         # useTranspose, useChordNotation, useOfflineManager…
├── stores/              # Pinia: songs, categories, preferences, offline
├── components/
│   ├── atoms/           # Button, Input, Icon, Chip, Tag, Toggle, ProgressBar
│   ├── molecules/       # SearchBar, ChordLyricBlock, CategoryFilter…
│   └── organisms/       # SongList, SongViewer, TransposeControl
└── views/               # Home, SongDetail, Categories, OfflineManager, Settings
```

## Despliegue

GitHub Actions (`.github/workflows/deploy.yml`) hace lint + tests + build con `GITHUB_PAGES=true` y publica `dist/` en GitHub Pages en cada push a `main`.

## Licencia

Uso personal para la parroquia.
