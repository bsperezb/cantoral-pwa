import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/canto/:id',
    name: 'song-detail',
    component: () => import('../views/SongDetailView.vue'),
    props: true,
  },
  {
    path: '/categorias',
    name: 'categories',
    component: () => import('../views/CategoriesView.vue'),
  },
  {
    path: '/offline',
    name: 'offline-manager',
    component: () => import('../views/OfflineManagerView.vue'),
  },
  {
    path: '/ajustes',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
