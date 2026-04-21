import { ref } from 'vue';
import TransposeControl from './TransposeControl.vue';

export default {
  title: 'Organisms/TransposeControl',
  component: TransposeControl,
  tags: ['autodocs'],
  argTypes: {
    notation: { control: 'select', options: ['english', 'latin'] },
  },
  args: { semitones: 0, notation: 'english' },
  render: (args) => ({
    components: { TransposeControl },
    setup() {
      const semitones = ref(args.semitones);
      const notation = ref(args.notation);
      return { args, semitones, notation };
    },
    template: `
      <TransposeControl
        :semitones="semitones"
        :notation="notation"
        @up="semitones++"
        @down="semitones--"
        @reset="semitones = 0"
        @toggle-notation="notation = notation === 'english' ? 'latin' : 'english'"
      />
    `,
  }),
};

export const Default = {};
export const TransposedUp = { args: { semitones: 3 } };
export const TransposedDown = { args: { semitones: -2 } };
export const LatinNotation = { args: { notation: 'latin' } };
