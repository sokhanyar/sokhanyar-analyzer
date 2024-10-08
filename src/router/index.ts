import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import NProgress from "nprogress";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
  ],
});

router.beforeEach((To, From, next) => {
  NProgress.start();
  next();
});
router.afterEach(() => {
  NProgress.done();
});

export default router;
