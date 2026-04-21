import SongViewer from './SongViewer.vue';

const SAMPLE_SONG = {
  metadata: {
    title: 'Como el Ciervo',
    artist: 'Marcos Witt',
    key: 'G',
    tempo: '72 BPM',
  },
  sections: [
    {
      type: 'intro',
      lines: [
        { type: 'chord', chords: [{ chord: 'G', column: 0 }, { chord: 'D', column: 4 }, { chord: 'Em', column: 8 }, { chord: 'C', column: 12 }] },
      ],
    },
    {
      type: 'verse',
      lines: [
        {
          type: 'chord-lyric',
          chords: [{ chord: 'G', column: 0 }, { chord: 'Em', column: 13 }],
          text: 'Como el ciervo busca las aguas',
        },
        {
          type: 'chord-lyric',
          chords: [{ chord: 'C', column: 0 }, { chord: 'D', column: 10 }],
          text: 'así mi alma te busca a ti',
        },
      ],
    },
    {
      type: 'chorus',
      lines: [
        {
          type: 'chord-lyric',
          chords: [{ chord: 'G', column: 0 }, { chord: 'D/F#', column: 5 }],
          text: 'Sólo tú eres mi Dios',
        },
        { type: 'lyric', text: 'y mi alma tiene sed de ti' },
      ],
    },
  ],
};

export default {
  title: 'Organisms/SongViewer',
  component: SongViewer,
  tags: ['autodocs'],
  args: { song: SAMPLE_SONG, transform: (c) => c },
};

export const Default = {};

export const TransposedUp2 = {
  args: {
    transform: (chord) => {
      const map = { G: 'A', D: 'E', Em: 'F#m', C: 'D', 'D/F#': 'E/G#' };
      return map[chord] ?? chord;
    },
  },
};

export const LatinNotation = {
  args: {
    transform: (chord) => {
      const map = { G: 'Sol', D: 'Re', Em: 'Mim', C: 'Do', 'D/F#': 'Re/Fa#' };
      return map[chord] ?? chord;
    },
  },
};

export const Empty = {
  args: { song: { metadata: { title: 'Canto sin contenido' }, sections: [] } },
};
