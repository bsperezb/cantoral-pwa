import SongList from './SongList.vue';

const SONGS = [
  { id: 'como-el-ciervo', title: 'Como el Ciervo', artist: 'Marcos Witt', tags: ['adoracion'] },
  { id: 'dios-manda-lluvia', title: 'Dios Manda Lluvia', artist: 'Hillsong', tags: ['alabanza', 'celebracion'] },
  { id: 'pescador-de-hombres', title: 'Pescador de Hombres', artist: 'Cesareo Gabarain', tags: ['entrada'] },
  { id: 'tu-reinaras', title: 'Tú Reinarás', artist: null, tags: ['coro'] },
];

export default {
  title: 'Organisms/SongList',
  component: SongList,
  tags: ['autodocs'],
  args: { songs: SONGS, downloadedIds: new Set(['como-el-ciervo']) },
};

export const Default = {};
export const AllOffline = {
  args: { downloadedIds: new Set(SONGS.map((s) => s.id)) },
};
export const NoneOffline = {
  args: { downloadedIds: new Set() },
};
export const Empty = {
  args: { songs: [], downloadedIds: new Set() },
};
