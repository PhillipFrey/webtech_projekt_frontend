import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../views/WelcomePage.vue';
import TripCreation from '../views/TripCreation.vue';
import Fallback from "../views/Fallback.vue";

const routes = [
  {
    path: '/',
    name: 'welcomePage',
    component: WelcomePage,
    meta: {
      title: 'Trip Planner - Welcome Page'
    }
  },
  {
    path: "/TripCreation/:id",
    name: "tripCreation",
    component: TripCreation,
    meta: {
      title: 'Trip Planner - Trip Creation'
    }
  },
  {
    path: "/Fallback",
    name: "fallback",
    component: Fallback
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const exists = routes.some(route => route.path === to.path);

  if (!exists) {
    next({ name: 'fallback' });
  } else {
    document.title = to.meta?.title ?? 'Default Title';
    next();
  }
});

export default router;
