import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/guild/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/GuildPage.vue') }],
  },
  {
    path: '/guild/:id/command_data',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CommandDataPage.vue') }],
  },
  {
    path: '/guild/:id/command_activation',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CommandActivationPage.vue') }],
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AdminPage.vue') }],
  },
  {
    path: '/admin/command_activation',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CommandActivationPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
];

export default routes;
