#!/usr/bin/env node
// Genera iconos PWA (PNG 192 y 512) a partir de public/icons/icon.svg.
// Se ejecuta en prebuild para que el manifest referencie PNGs reales,
// que es lo que Chrome Android exige para mostrar el prompt de instalación.

import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(__dirname, '..', 'public', 'icons');
const SVG_PATH = join(ICONS_DIR, 'icon.svg');

if (!existsSync(SVG_PATH)) {
  console.error('[icons] No se encontró public/icons/icon.svg');
  process.exit(1);
}
if (!existsSync(ICONS_DIR)) mkdirSync(ICONS_DIR, { recursive: true });

const svgBuffer = readFileSync(SVG_PATH);

async function render(size, filename, { maskable = false } = {}) {
  const outPath = join(ICONS_DIR, filename);
  let img = sharp(svgBuffer, { density: 384 }).resize(size, size);
  if (maskable) {
    // Para 'maskable' se añade un padding de ~12% alrededor del contenido
    // para que los recortes circulares/rounded del launcher no corten el diseño.
    const inner = Math.round(size * 0.76);
    const pad = Math.round((size - inner) / 2);
    img = sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 67, g: 56, b: 202, alpha: 1 }, // color-primary
      },
    }).composite([
      {
        input: await sharp(svgBuffer, { density: 384 }).resize(inner, inner).png().toBuffer(),
        top: pad,
        left: pad,
      },
    ]);
  }
  await img.png({ compressionLevel: 9 }).toFile(outPath);
  console.warn(`[icons] ${filename}`);
}

await Promise.all([
  render(192, 'icon-192.png'),
  render(512, 'icon-512.png'),
  render(512, 'icon-maskable-512.png', { maskable: true }),
]);
