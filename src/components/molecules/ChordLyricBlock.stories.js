import ChordLyricBlock from './ChordLyricBlock.vue';

export default {
  title: 'Molecules/ChordLyricBlock',
  component: ChordLyricBlock,
  tags: ['autodocs'],
  args: {
    chords: [
      { chord: 'G', column: 0 },
      { chord: 'Em', column: 13 },
    ],
    text: 'Como el ciervo busca las aguas',
  },
};

export const Default = {};

export const OnlyChords = {
  args: {
    chords: [
      { chord: 'C', column: 0 },
      { chord: 'G', column: 4 },
      { chord: 'Am', column: 8 },
      { chord: 'F', column: 12 },
    ],
    text: '',
  },
};

export const OnlyLyrics = {
  args: { chords: [], text: 'Y mi alma tiene sed' },
};
