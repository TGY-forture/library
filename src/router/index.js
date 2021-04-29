import { createRouter, createWebHistory } from "vue-router";

const seat = () => import("../components/seat/select.vue");
const profile = () => import("../components/profile/profile.vue");
const appoint = () => import("../components/appoint/appoint.vue");
const message = () => import("../components/message/message.vue");
const chat = () => import("../components/message/chat.vue");
const search = () => import('../components/search/search.vue')

const routes = [
  { path: "/redirect.html", component: seat },
  { path: "/", component: seat },
  {
    name: "seat",
    path: "/seat",
    component: seat,
  },
  {
    name: "profile",
    path: "/profile",
    component: profile,
  },
  {
    name: "appoint",
    path: "/appoint",
    component: appoint,
  },
  {
    name: "message",
    path: "/message",
    component: message,
  },
  {
    name: "chat",
    path: "/chat",
    component: chat,
  },
  {
    name: 'search',
    path: '/search',
    component: search
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
