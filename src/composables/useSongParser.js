import { parseSong } from '../services/parsers/index.js';

/**
 * Composable (función plana) para obtener un canto parseado.
 * Se mantiene stateless para poder memoizarse fácilmente desde el store.
 */
export function useSongParser() {
  return {
    parse(text, options) {
      return parseSong(text, options);
    },
  };
}
