import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../views/WelcomePage.vue';
import TripCreation from '../views/TripCreation.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    }
  ]
});

router.beforeEach((to, from) => {
  document.title = to.meta?.title ?? 'Default Title'
})

export default router;
