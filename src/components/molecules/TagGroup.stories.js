import TagGroup from './TagGroup.vue';

export default {
  title: 'Molecules/TagGroup',
  component: TagGroup,
  tags: ['autodocs'],
  args: { tags: ['adoracion', 'entrada', 'tranquilo'] },
};

export const Default = {};
export const Single = { args: { tags: ['comunion'] } };
export const Many = {
  args: { tags: ['adoracion', 'entrada', 'comunion', 'salida', 'ofertorio', 'coros', 'alabanza'] },
};
export const Empty = { args: { tags: [] } };
