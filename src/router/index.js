import {createRouter, createWebHistory} from 'vue-router';
import WelcomePage from '../views/WelcomePage.vue';
import TripCreation from '../views/TripCreation.vue';
import Fallback from "../views/Fallback.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BACKEND_URL),
  routes: [
    {
      path: '/',
      name: 'welcomePage',
      component: WelcomePage,
      meta: {
        title: 'Trip Planer - Welcome Page'
      }
    },
    {
      path: "/TripCreation/:id",
      name: "tripCreation",
      component: TripCreation,
      meta: {
        title: 'Trip Planer - Trip Creation'
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
  ]
});

router.beforeEach((to) => {
  document.title = to.meta?.title ?? 'Default Title';
})

export default router;
