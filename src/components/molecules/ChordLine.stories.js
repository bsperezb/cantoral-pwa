import ChordLine from './ChordLine.vue';

export default {
  title: 'Molecules/ChordLine',
  component: ChordLine,
  tags: ['autodocs'],
  args: {
    chords: [
      { chord: 'G', column: 0 },
      { chord: 'Em', column: 4 },
      { chord: 'C', column: 8 },
      { chord: 'D', column: 12 },
    ],
  },
};

export const Default = {};

export const WithTransform = {
  args: {
    chords: [
      { chord: 'G', column: 0 },
      { chord: 'Em', column: 4 },
    ],
    transform: (c) => (c === 'G' ? 'Sol' : c === 'Em' ? 'Mim' : c),
  },
};

export const Empty = { args: { chords: [] } };
