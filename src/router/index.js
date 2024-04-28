import {createRouter, createWebHistory} from 'vue-router';
import WelcomePage from '../views/WelcomePage.vue';
import TripCreation from '../views/TripCreation.vue';
import Fallback from "../views/Fallback.vue";

const router = createRouter({
  history: createWebHistory(),
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
      path: "/TripCreation/:id*",
      name: "fallbackId",
      component: Fallback,
      meta: {
        title: "Trip Planer - Fallback"
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
      name: "fallbackBase",
      component: Fallback,
      meta: {
        title: 'Trip Planer - Fallback'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'fallbackBase',
      component: Fallback,
      meta: {
        title: 'Trip Planer - Fallback'
      }
    }
  ]
});

router.beforeEach((to, from) => {
  document.title = to.meta?.title ?? 'Default Title'
})

export default router;
