# CLAUDE.md — Cantoral PWA

Contexto operativo para el agente. **Léelo antes de escribir código.**

## Qué es este proyecto

PWA Vue 3 para visualizar cantos con acordes, transposición (latino/inglés) y uso offline, pensada para coros parroquiales. Despliega en GitHub Pages (`https://bsperezb.github.io/cantoral-pwa/`). La hoja de ruta completa por fases vive en `PLAN.MD`.

## Stack (no negociable)

- **Vue 3** Composition API con `<script setup>`, **Vite**, **Pinia**, **Vue Router 4**
- **PWA**: `vite-plugin-pwa` (Workbox, strategy `autoUpdate`)
- **Persistencia**: IndexedDB vía `idb` (no Cache API para los `.song` — necesitamos consultarlos como datos)
- **Linter**: `oxlint` (no ESLint). **Formatter**: Prettier. **Tests**: Vitest unit + Playwright MCP E2E
- **Sin TypeScript**. JavaScript ES2022+ con JSDoc en funciones críticas
- **Sin frameworks CSS**. HTML/CSS nativos, variables CSS, `clamp()`, `@layer`, dark mode via `prefers-color-scheme`

## Principios de código

1. **Mobile-first absoluto**. Probar todo a 360px mínimo. Targets táctiles ≥44px.
2. **Atomic Design**: `atoms/` → `molecules/` → `organisms/` → `views/`. Un componente nuevo va en el nivel más bajo que lo justifique.
3. **Patrones**: Composable (Vue 3), Strategy (parsers), Observer (Pinia), Repository (`songRepository`), Factory cuando aporte valor. No abstraer antes de tiempo.
4. **Legibilidad > cleverness**. Nombres expresivos, funciones pequeñas. Comentarios solo cuando el *por qué* no sea obvio — no cuentes *qué* hace el código.
5. **No backwards-compat**: cuando elimines algo, elimínalo completamente (sin `// removed`, sin re-exports "por si acaso").

## Formato de cantos — CRÍTICO

Los `.song` en `public/songs/` pueden estar en **dos formatos**:

### Nativo (preferido)
Frontmatter YAML-lite + secciones `[Verso]`, `[Coro]`:
```
---
title: Como el Ciervo
artist: Marcos Witt
key: G
tags: [adoracion]
categories:
  entrada: [tranquilo]
---

[Verso]
G            Em
Como el ciervo busca
```

### laCuerda.net REAL
Descargable directo de `acordes.lacuerda.net/TXT/...`. El parser (`src/services/parsers/LaCuerdaParser.js`) maneja el formato **real** — no la versión simplificada — ver `EJEMPLO_LACUERDA.TXT`:
- Header delimitado por `====` con campos `| ARTISTA:`, `| CANCION:`, `| AUTOR:`, `| ALBUM:`, `| TRANS:`
- Secciones **sin corchetes**: `CORO`, `VERSO 1`, `PUENTE`, `SOLO` (palabra en MAYÚSCULAS, opcionalmente con número/`:`)
- `INTRO:` **inline** con acordes separados por ` - `
- Footer legal de lacuerda.net se descarta automáticamente
- Si no hay `Tono:` explícito, se infiere la tonalidad del primer acorde

El `FormatDetector` despacha por: `---` → nativo, `====` o `| ARTISTA:` → laCuerda, fallback laCuerda heurístico.

## Motor de acordes

`src/services/chordEngine/`:
- `ChordDetector.parseChord()` separa raíz, alteración, calidad, bajo invertido y notación
- `ChordTransposer.transposeChord(chord, semitones, { targetKey })` — si `semitones === 0` devuelve el original tal cual (para preservar bemoles como `Bb`)
- `NotationConverter.convertChord(chord, 'latin'|'english')` — idempotente round-trip
- Regex de acordes en `constants.js`. `FLAT_KEYS` lista las tonalidades que prefieren bemoles

Cobertura con tests unitarios de las 12 tonalidades.

## Comandos habituales

```bash
npm run dev         # http://localhost:5173 (regenera manifest + iconos PNG antes)
npm run build       # dist/ listo para deploy
GITHUB_PAGES=true npm run build   # build con base /cantoral-pwa/
npm run preview     # sirve dist/ en 4173 (útil para validar PWA con Playwright)
npm test            # Vitest (65+ tests)
npm run lint        # oxlint src scripts --deny-warnings
npm run format      # prettier --write
```

Antes de cada commit: `npm run lint && npm run test && npm run format:check`.

## Testing — usar Playwright MCP, no `playwright test`

Los E2E se ejecutan **interactivamente** desde el agente vía el MCP de Playwright. Los casos canónicos están en `tests/e2e/scenarios.md`. Flujo:

1. `npm run dev` (o `npm run preview` para verificar el SW real y el manifest)
2. Usar `mcp__playwright__browser_navigate`, `_click`, `_type`, `_snapshot`, `_evaluate`, `_resize`
3. Validar viewport móvil (360×740) además del default
4. Tomar screenshot con `_take_screenshot` cuando el cambio sea visual
5. Reportar en lenguaje natural, no solo logs

Para verificar la PWA: contra la build servida en preview, leer `link[rel="manifest"]` y comprobar `navigator.serviceWorker.controller`.

## UI/UX — skill `ui-ux-pro-max`

Al crear/modificar componentes visuales, invocar la skill `ui-ux-pro-max` para iterar estilo y accesibilidad. Aplica especialmente a:
- Componentes de `atoms/` y `molecules/` nuevos
- Cambios en `SongViewer` (el organism más complejo)
- Dark mode, estados (empty/loading/error), focus-visible
- Revisión antes de marcar feature como terminada

Siempre validar accesibilidad: ARIA en controles interactivos, targets ≥44px, contraste suficiente en ambos temas.

## PWA — criterios de instalabilidad

Chrome Android **exige PNG** (no SVG) para el prompt "Instalar app". El proyecto genera:
- `public/icons/icon-192.png` y `icon-512.png` con `purpose: any`
- `public/icons/icon-maskable-512.png` con padding ~12% para launchers circulares

Se regeneran automáticamente en `predev`/`prebuild` vía `scripts/build-icons.js` (usa `sharp`). Si cambias `icon.svg`, los PNG se regeneran al siguiente `npm run dev`.

Para que funcione en un sub-path de GH Pages, `vite.config.js` respeta `GITHUB_PAGES=true` y ajusta `base`, `start_url`, `scope` y rutas de iconos. El `songLoader` resuelve contra `import.meta.env.BASE_URL`.

## Convenciones

- Componentes: `PascalCase.vue`
- Composables: `useCamelCase.js`
- Stores Pinia: `*.store.js`
- Eventos: `kebab-case` (`@song-selected`)
- Commits: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`). **Sin** `Co-authored-by`. Mensajes en inglés cuando sean técnicos, en español si describen contexto del dominio.
- CSS: BEM suave + variables CSS. Scoped styles en componentes.

## Definition of Done

1. Tests unitarios (lógica) o screenshot Playwright (UI crítica)
2. `oxlint` sin warnings ni errors
3. `prettier --check` clean
4. Funciona a 360px viewport
5. Accesible por teclado
6. Estados empty/loading/error manejados

## Qué evitar

- ❌ Añadir ESLint — usamos **oxlint**
- ❌ Convertir a TypeScript
- ❌ Introducir Tailwind/Bootstrap/etc
- ❌ Parchear el SVG único en el manifest — deben ser PNGs (ver `build-icons.js`)
- ❌ Asumir rutas absolutas `/` en fetch — usa `BASE_URL`
- ❌ Transposer: si `semitones === 0` no normalizar sostenidos/bemoles, devolver el acorde original
- ❌ Cachear `.song` en Cache API — van a IndexedDB vía `songRepository`

## Archivos de referencia

- `PLAN.MD` — hoja de ruta completa de fases 0-9 (ya ejecutada)
- `EJEMPLO_LACUERDA.TXT` — formato real de laCuerda canónico para tests
- `tests/e2e/scenarios.md` — casos E2E para Playwright MCP
- `scripts/build-songs-manifest.js` — genera `public/songs/index.json`
- `scripts/build-icons.js` — rasteriza `icon.svg` a PNG 192/512/maskable
