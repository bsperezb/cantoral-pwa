// Tipos compartidos por los parsers (documentación vía JSDoc).

/**
 * @typedef {Object} ChordPosition
 * @property {string} chord
 * @property {number} column
 */

/**
 * @typedef {Object} ParsedLine
 * @property {'chord'|'lyric'|'chord-lyric'|'empty'} type
 * @property {ChordPosition[]} [chords]
 * @property {string} [text]
 */

/**
 * @typedef {Object} ParsedSection
 * @property {'intro'|'verse'|'chorus'|'bridge'|'solo'|'outro'|'section'} type
 * @property {string|null} label
 * @property {ParsedLine[]} lines
 */

/**
 * @typedef {Object} SongMetadata
 * @property {string} title
 * @property {string|null} artist
 * @property {string|null} author
 * @property {string|null} album
 * @property {string|null} key
 * @property {string|number|null} tempo
 * @property {string[]} tags
 * @property {Record<string,string[]>} categories
 * @property {string|null} [transcriber]
 * @property {string|null} [capo]
 */

/**
 * @typedef {Object} ParsedSong
 * @property {string} id
 * @property {SongMetadata} metadata
 * @property {ParsedSection[]} sections
 * @property {'native'|'lacuerda'} sourceFormat
 */

export {};
