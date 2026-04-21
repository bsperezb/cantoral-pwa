import SongDownloadItem from './SongDownloadItem.vue';

const SONG = {
  id: 'como-el-ciervo',
  title: 'Como el Ciervo',
  artist: 'Marcos Witt',
  size: 3456,
};

export default {
  title: 'Molecules/SongDownloadItem',
  component: SongDownloadItem,
  tags: ['autodocs'],
  args: { song: SONG, downloaded: false, loading: false },
  decorators: [
    () => ({
      template: `<ul style="list-style:none;padding:0;margin:0;max-width:420px"><story /></ul>`,
    }),
  ],
};

export const NotDownloaded = {};
export const Downloaded = { args: { downloaded: true } };
export const Loading = { args: { loading: true } };
export const WithoutArtist = {
  args: { song: { ...SONG, artist: null } },
};
