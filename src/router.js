import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";
import Profile from "./components/Profile.vue";
import Participants from "./components/Participants.vue";
import Auth from "./components/Auth.vue";
import Logout from "./components/Logout.vue";

const history = createWebHistory();
const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/profile",
    component: Profile,
    children: [
      {
        path: "new",
        component: Profile
      }
    ]
  },
  {
    path: "/participants",
    component: Participants
  },
  {
    path: "/auth",
    component: Auth,
  },
  {
    path: "/logout",
    component: Logout,
  },
];

const router = createRouter({
  history,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { top: 0 };
  }
});

export default router;
