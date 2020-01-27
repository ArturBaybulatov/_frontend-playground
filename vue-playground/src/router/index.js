import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home.vue';


Vue.use(VueRouter);

const routes = [
  {
    component: Home,
    name: 'home',
    path: '/',
  },

  {
    component: () => import('../views/About.vue'),
    name: 'about',
    path: '/about',
  },
];

const router = new VueRouter({
  routes,
});

export default router;
