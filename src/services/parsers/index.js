import { detectFormat } from './FormatDetector.js';
import { parseNative } from './NativeParser.js';
import { parseLaCuerda } from './LaCuerdaParser.js';

/**
 * Dispatcher: detecta el formato y aplica el parser correspondiente.
 * @param {string} text
 * @param {{ fallbackId?: string }} [options]
 * @returns {import('./types.js').ParsedSong}
 */
export function parseSong(text, options = {}) {
  const format = detectFormat(text);
  if (format === 'native') return parseNative(text, options);
  return parseLaCuerda(text, options);
}

export { detectFormat, parseNative, parseLaCuerda };
