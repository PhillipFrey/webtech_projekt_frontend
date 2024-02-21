import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../views/WelcomePage.vue';
import TripCreation from '../views/TripCreation.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcomePage',
      component: WelcomePage
    },
    {
      path: "/TripCreation/:id",
      name: "tripCreation",
      component: TripCreation
    }
  ]
});

export default router;
