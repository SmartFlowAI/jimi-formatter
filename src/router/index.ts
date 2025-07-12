import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue")
    },
    {
      path: "/embed",
      name: "embed",
      component: () => import("../views/EmbedView.vue")
    }
  ]
});

export default router;
