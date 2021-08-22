import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Manage from "@/views/Manage.vue";
import Song from "@/views/Song.vue";
import store from "@/store/store";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "about",
    path: "/about",
    component: About,
  },
  {
    name: "manage",
    alias: "/manage", // Renders the component with a different path
    path: "/manage-music",
    component: Manage,
    meta: {
      requiresAuth: true,
    },
    beforeEnter: (to, from, next) => {
      next();
    },
  },
  {
    name: "song",
    path: "/song/:id",
    component: Song,
  },
  // Redirect the user to another path
  // {
  //   path: "/manage",
  //   redirect: { name: "manage" },
  // },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
  // console.log(to.matched);

  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.userLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }
});

export default router;
