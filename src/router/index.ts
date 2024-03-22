import { createRouter, createWebHashHistory } from 'vue-router';
import utils from '@/utils';

const router = createRouter({
  history: createWebHashHistory('/'),
  routes: [
    { path: '/:pathMatch(.*)*', redirect: '/' },
    { path: '/', component: () => import('@/views/HomeView.vue') }
  ]
});

router.beforeEach((to, from, next) => {
  utils.scrollToTop();
  next();
});

export default router;
